"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // Route through callback to handle both code and token_hash flows reliably.
            redirectTo: `${window.location.origin}/auth/reset-callback`,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-up">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to login
                </Link>

                <div className="card rounded-xl p-8 border border-solid border-border bg-bg text-center">
                    {success ? (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-accent-light/10 flex items-center justify-center mb-4 text-accent">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-medium text-text-primary mb-2">Check your email</h2>
                            <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                We&apos;ve sent a password reset link to <strong className="text-text-primary">{email}</strong>.
                            </p>
                            <Link href="/login" className="btn-primary w-full py-3 inline-block">
                                Return to sign in
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-medium tracking-tight text-text-primary mb-2">Reset password</h1>
                            <p className="text-sm text-text-secondary mb-8">
                                Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="text-left space-y-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="input-base w-full pl-9 py-3 text-sm"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-xs font-bold text-text-primary bg-[#ef4444] border border-[#ef4444] rounded-lg px-3 py-2 shadow-md">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {loading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending link…</>
                                    ) : (
                                        "Send reset link"
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
