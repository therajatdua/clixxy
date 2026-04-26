"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [canResendVerification, setCanResendVerification] = useState(false);

    async function handleResendVerification() {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            setError("Enter your email first, then resend verification.");
            return;
        }

        setResendLoading(true);
        setNotice("");
        const supabase = createClient();
        const { error: resendError } = await supabase.auth.resend({
            type: "signup",
            email: normalizedEmail,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            },
        });

        if (resendError) {
            setError(resendError.message);
        } else {
            setNotice("Verification email sent. Please check your inbox.");
        }

        setResendLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setNotice("");
        setCanResendVerification(false);

        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !password) {
            setError("Please enter email and password.");
            return;
        }

        setLoading(true);
        const supabase = createClient();

        try {
            const timeout = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Connection timed out. Try again in a moment.")), 8000)
            );
            const signInResult = supabase.auth.signInWithPassword({
                email: normalizedEmail,
                password,
            });
            const { error } = await Promise.race([signInResult, timeout]) as Awaited<typeof signInResult>;

            if (error) {
                if (error.message.toLowerCase().includes("email not confirmed")) {
                    setError("Email not confirmed. Please verify your inbox, then sign in again.");
                    setCanResendVerification(true);
                } else if (error.message.toLowerCase().includes("invalid login credentials")) {
                    setError("Invalid email or password.");
                } else {
                    setError(error.message);
                }
                setLoading(false);
            } else {
                // Success - do not reset loading so the spinner stays while Next.js routes
                router.push("/dashboard");
                router.refresh();
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

            {/* Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm animate-fade-up">
                    <div className="mb-7 text-center">
                        <h1 className="text-2xl font-medium uppercase tracking-wider text-text-primary">Sign in to Clixy</h1>
                        <p className="text-sm font-semibold text-text-secondary mt-2">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-[#ffffff] hover:text-text-primary font-bold uppercase tracking-wider">
                                Sign up free
                            </Link>
                        </p>
                    </div>

                    <div className="card rounded-xl p-6 border border-solid border-border bg-bg">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        id="login-email"
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
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="input-base w-full pl-9 pr-10 py-3 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent/20 cursor-pointer"
                                    />
                                    <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">
                                        Remember me
                                    </span>
                                </label>
                                <Link href="/forgot-password" className="text-xs font-bold uppercase tracking-widest text-accent hover:text-accent-hover transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            {error && (
                                <p className="text-xs font-bold text-text-primary bg-[#ef4444] border border-[#ef4444] rounded-lg px-3 py-2 shadow-md">
                                    {error}
                                </p>
                            )}

                            {canResendVerification && (
                                <button
                                    type="button"
                                    onClick={handleResendVerification}
                                    disabled={resendLoading}
                                    className="w-full text-xs font-bold uppercase tracking-widest border border-solid border-border rounded-lg px-3 py-2 text-text-primary hover:bg-surface transition-colors disabled:opacity-60"
                                >
                                    {resendLoading ? "Sending verification email..." : "Resend verification email"}
                                </button>
                            )}

                            {notice && (
                                <p className="text-xs font-bold text-text-primary bg-[#22c55e] border border-[#22c55e] rounded-lg px-3 py-2 shadow-md">
                                    {notice}
                                </p>
                            )}

                            <button
                                id="login-submit"
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
