"use client";

import { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <button
            id="analytics-copy-btn"
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-solid border-transparent hover:border-accent bg-surface-hover hover:bg-surface-hover text-text-secondary hover:text-accent-hover transition-all"
            title="Copy link"
        >
            {copied ? (
                <CheckCheck className="w-4 h-4 text-text-primary" />
            ) : (
                <Copy className="w-4 h-4" />
            )}
        </button>
    );
}
