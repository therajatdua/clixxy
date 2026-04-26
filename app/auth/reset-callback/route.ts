import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    if (token_hash && type) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value },
                    set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                    remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }) },
                },
                cookieOptions: { name: 'sb-clixy-auth-token' }
            }
        )

        // Verify the token_hash robustly, ignoring any PKCE browser mismatch constraints!
        const otpType = type as EmailOtpType
        const { error } = await supabase.auth.verifyOtp({
            type: otpType,
            token_hash,
        })

        if (!error) {
            return NextResponse.redirect(`${origin}/reset-password`)
        } else {
            return NextResponse.redirect(`${origin}/reset-password?error=${encodeURIComponent(error.message)}`)
        }
    }

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options })
                    },
                },
                cookieOptions: {
                    name: 'sb-clixy-auth-token',
                }
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}/reset-password`)
        } else {
            // Forward the exact error message so we know why PKCE failed
            return NextResponse.redirect(`${origin}/reset-password?error=${encodeURIComponent(error.message)}`)
        }
    }

    // If there's no code, it might be an Implicit Flow redirect featuring a hash fragment.
    // We seamlessly bounce the user to their destination so the client-side JS can parse the hash!
    return NextResponse.redirect(`${origin}/reset-password`)
}
