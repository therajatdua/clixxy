import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseDevice } from "@/utils/parseDevice";

// Simple in-memory rate limiting (per-slug, resets on cold start)
// For production: use Upstash Redis
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // max 30 hits per window
const RATE_WINDOW_MS = 60_000; // 1 minute window

function isRateLimited(key: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(key);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return false;
    }
    if (entry.count >= RATE_LIMIT) return true;
    entry.count++;
    return false;
}

async function getCountry(request: NextRequest): Promise<string> {
    // Vercel provides this header automatically
    const country =
        request.headers.get("x-vercel-ip-country") ||
        request.headers.get("cf-ipcountry") ||
        null;

    if (country) return country;

    // Fallback: free HTTPS IP geolocation API (only in non-Vercel environments)
    try {
        const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            "1.1.1.1";

        if (ip === "127.0.0.1" || ip === "::1") return "Local";

        const res = await fetch(`https://ipwho.is/${ip}`, {
            signal: AbortSignal.timeout(2000),
        });
        const data = await res.json();
        return data?.country_code || "Unknown";
    } catch {
        return "Unknown";
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    // Rate limiting by slug
    if (isRateLimited(slug)) {
        return new NextResponse("Too Many Requests", { status: 429 });
    }

    const supabase = await createClient();

    // Fetch the link
    const { data: link, error } = await supabase
        .from("links")
        .select("id, destination_url")
        .eq("slug", slug)
        .single();

    if (error || !link) {
        return new NextResponse(
            `<!DOCTYPE html>
      <html>
        <head><title>Link Not Found – Clixy</title>
        <style>
          body{font-family:system-ui;background:#030712;color:#f9fafb;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
          .box{text-align:center;padding:2rem;}
          h1{font-size:2rem;margin-bottom:.5rem;}
          p{color:#9ca3af;margin-bottom:1.5rem;}
          a{color:#8b5cf6;text-decoration:none;font-weight:600;}
        </style>
        </head>
        <body>
          <div class="box">
            <h1>🔗 Link Not Found</h1>
            <p>This tracking link does not exist or has been removed.</p>
            <a href="/">Go to Clixy</a>
          </div>
        </body>
      </html>`,
            { status: 404, headers: { "Content-Type": "text/html" } }
        );
    }

    // Capture analytics asynchronously (don't block redirect)
    const userAgent = request.headers.get("user-agent") || null;
    const referrer =
        request.headers.get("referer") || request.headers.get("referrer") || null;
    const device = parseDevice(userAgent);

    // Get country (non-blocking)
    const countryPromise = getCountry(request);

    // Perform 302 redirect immediately
    const response = NextResponse.redirect(link.destination_url, {
        status: 302,
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
        },
    });

    // Store click in background (after redirect initiated)
    countryPromise.then(async (country) => {
        await supabase.from("clicks").insert({
            link_id: link.id,
            referrer,
            device,
            country,
            user_agent: userAgent,
            timestamp: new Date().toISOString(),
        });
    });

    return response;
}
