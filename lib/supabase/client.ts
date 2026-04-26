import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    // In the browser, we proxy Supabase requests through Vercel to bypass ISP blocks
    const proxyUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/api/supabase`
        : process.env.NEXT_PUBLIC_SUPABASE_URL!;

    return createBrowserClient(
        proxyUrl,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookieOptions: {
                name: 'sb-clixy-auth-token',
            }
        }
    );
}
