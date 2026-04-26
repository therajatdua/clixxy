import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Fail open when env vars are missing (e.g., misconfigured deployment) to avoid 500s.
    // Auth-protected routes will still enforce auth in server components/routes where applicable.
    if (!supabaseUrl || !supabaseAnonKey) {
        return supabaseResponse;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
            cookieOptions: {
                name: 'sb-clixy-auth-token',
            }
        }
    );

    let user = null;
    try {
        const {
            data: { user: authUser },
        } = await supabase.auth.getUser();
        user = authUser;
    } catch {
        // If Supabase is unreachable at edge/runtime, do not crash middleware.
        return supabaseResponse;
    }

    // Rate limiting for redirect route (simple in-memory approach)
    // For production, use Upstash Redis
    if (request.nextUrl.pathname.startsWith("/r/")) {
        // Allow all redirects — rate limiting handled in route handler
        return supabaseResponse;
    }

    // Protect dashboard routes
    if (
        request.nextUrl.pathname.startsWith("/dashboard") &&
        !user
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Redirect logged-in users away from auth pages
    if (
        (request.nextUrl.pathname === "/login" ||
            request.nextUrl.pathname === "/signup") &&
        user
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
