"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Globe, Tag, Wand2, Loader2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isValidUrl } from "@/lib/utils";
import { generateSlug, sanitizeSlug } from "@/utils/slugify";

export default function CreateLinkForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showUtm, setShowUtm] = useState(false);
    const [form, setForm] = useState({
        name: "", destination_url: "", slug: "",
        utm_source: "", utm_medium: "", utm_campaign: "",
    });

    function update(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!isValidUrl(form.destination_url)) {
            setError("Please enter a valid URL starting with http:// or https://");
            return;
        }

        const slug = form.slug ? sanitizeSlug(form.slug) : generateSlug();
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) { setError("You must be logged in."); setLoading(false); return; }

        let destinationUrl = form.destination_url;
        if (form.utm_source || form.utm_medium || form.utm_campaign) {
            try {
                const url = new URL(destinationUrl);
                if (form.utm_source) url.searchParams.set("utm_source", form.utm_source);
                if (form.utm_medium) url.searchParams.set("utm_medium", form.utm_medium);
                if (form.utm_campaign) url.searchParams.set("utm_campaign", form.utm_campaign);
                destinationUrl = url.toString();
            } catch { /* use as-is */ }
        }

        const { error: insertError } = await supabase.from("links").insert({
            user_id: user.id, slug, name: form.name, destination_url: destinationUrl,
            utm_source: form.utm_source || null, utm_medium: form.utm_medium || null,
            utm_campaign: form.utm_campaign || null,
        });

        if (insertError) {
            setError(insertError.code === "23505" ? "That slug is already taken. Choose a different one." : insertError.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setTimeout(() => { router.push("/dashboard/links"); router.refresh(); }, 1200);
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 rounded-xl bg-bg border border-border shadow-md flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-text-primary" />
                </div>
                <p className="text-sm font-medium uppercase tracking-wider text-text-primary">Link created!</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mt-2">Redirecting…</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
                    Link name <span className="text-[#ffffff]">*</span>
                </label>
                <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input id="link-name" type="text" required value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="e.g. YouTube Product Review"
                        className="input-base w-full pl-9 pr-3 py-3 text-sm" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
                    Destination URL <span className="text-[#ffffff]">*</span>
                </label>
                <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input id="destination-url" type="url" required value={form.destination_url}
                        onChange={(e) => update("destination_url", e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="input-base w-full pl-9 pr-3 py-3 text-sm flex-1" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">
                    Custom slug <span className="text-text-muted font-semibold">(optional)</span>
                </label>
                <div className="flex">
                    <span className="px-3 py-3 bg-surface-hover border border-r-0 border-border rounded-l-lg text-xs font-bold text-text-secondary whitespace-nowrap flex items-center">
                        /r/
                    </span>
                    <div className="relative flex-1">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input id="custom-slug" type="text" value={form.slug}
                            onChange={(e) => update("slug", e.target.value)}
                            placeholder="my-link"
                            className="input-base w-full pl-9 pr-3 py-3 text-sm rounded-l-none" />
                    </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-2 flex items-center gap-1.5">
                    <Wand2 className="w-3 h-3" /> Leave blank to auto-generate
                </p>
            </div>

            <div>
                <button type="button" id="utm-toggle" onClick={() => setShowUtm(!showUtm)}
                    className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-[#ffffff] hover:text-text-primary transition-colors">
                    {showUtm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    UTM parameters
                </button>
                {showUtm && (
                    <div className="mt-4 grid grid-cols-3 gap-3 p-4 bg-surface-hover border border-solid border-[#262626] rounded-xl">
                        {[
                            { key: "utm_source", label: "Source", placeholder: "instagram" },
                            { key: "utm_medium", label: "Medium", placeholder: "social" },
                            { key: "utm_campaign", label: "Campaign", placeholder: "spring-sale" },
                        ].map((f) => (
                            <div key={f.key}>
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-text-muted mb-1.5">{f.label}</label>
                                <input id={f.key} type="text" value={form[f.key as keyof typeof form]}
                                    onChange={(e) => update(f.key, e.target.value)}
                                    placeholder={f.placeholder}
                                    className="input-base w-full px-3 py-2 text-xs" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-xs font-bold text-text-primary bg-[#ef4444] border border-[#ef4444] rounded-lg px-3 py-2 shadow-md">
                    {error}
                </p>
            )}

            <button id="create-link-submit" type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 px-5 py-3 text-sm disabled:opacity-60 shadow-md hover:shadow-md">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <><Link2 className="w-4 h-4" /> Create link</>}
            </button>
        </form>
    );
}
