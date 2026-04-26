"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess(false);

        const normalizedEmail = email.trim().toLowerCase();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!normalizedEmail) {
            setError("Please enter a valid email.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        const supabase = createClient();

        try {
            const timeout = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Connection timed out. Supabase may be starting up — try again in 30 seconds.")), 8000)
            );
            const displayName = email.split("@")[0];
            const signUpResult = supabase.auth.signUp({
                email: normalizedEmail,
                password,
                options: {
                    // Use callback route so the auth code/session is exchanged server-side first.
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                    data: {
                        full_name: displayName,
                        display_name: displayName,
                    }
                },
            });
            const { data, error } = await Promise.race([signUpResult, timeout]) as Awaited<typeof signUpResult>;

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                // If session exists, user can enter dashboard immediately.
                // If not, Supabase is in email-confirmation mode and user must verify first.
                if (data.session) {
                    router.push("/dashboard");
                    router.refresh();
                } else {
                    setSuccess(true);
                    setLoading(false);
                }
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to connect. Please try again.");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            {/* Top bar */}
            <div className="px-6 py-4 border-b border-solid border-border bg-bg">
                <Link href="/" className="flex items-center gap-2 w-fit">
                    <div className="px-2 py-1 bg-surface dark:bg-surface-hover text-text-primary rounded uppercase font-medium tracking-tight  border border-solid border-border shadow-md text-sm">
                        CLIXY™
                    </div>
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm animate-fade-up">
                    <div className="mb-7 text-center">
                        <h1 className="text-2xl font-medium uppercase tracking-wider text-text-primary">Create your account</h1>
                        <p className="text-sm font-semibold text-text-secondary mt-2">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[#ffffff] hover:text-text-primary font-bold uppercase tracking-wider">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="card rounded-xl p-6 border border-solid border-border bg-bg">
                        {success ? (
                            <div className="text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-accent-light/10 flex items-center justify-center mx-auto text-accent">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-medium text-text-primary">Check your email</h2>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    Your account was created. Please verify <strong className="text-text-primary">{email.trim().toLowerCase()}</strong> from your inbox, then sign in.
                                </p>
                                <Link href="/login" className="btn-primary w-full py-3 inline-block text-sm">
                                    Go to sign in
                                </Link>
                            </div>
                        ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        id="signup-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="input-base w-full pl-9 pr-3 py-3 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        className="input-base w-full pl-9 pr-10 py-3 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        id="signup-confirm-password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter password"
                                        className="input-base w-full pl-9 pr-3 py-3 text-sm"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs font-bold text-text-primary bg-[#ef4444] border border-[#ef4444] rounded-lg px-3 py-2 shadow-md">
                                    {error}
                                </p>
                            )}

                            <button
                                id="signup-submit"
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
                                ) : (
                                    "Create account"
                                )}
                            </button>
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
