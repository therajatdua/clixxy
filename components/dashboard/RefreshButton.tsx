"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function RefreshButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleRefresh() {
        startTransition(() => {
            router.refresh();
        });
    }

    return (
        <button
            onClick={handleRefresh}
            disabled={isPending}
            className="flex items-center gap-2 px-3 py-1.5 bg-bg border border-solid border-border hover:border-solid hover:shadow-md hover:-translate-y-0.5 text-text-primary rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
        >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin text-text-primary" : "text-text-muted"}`} />
            <span className="hidden sm:inline">Refresh</span>
        </button>
    );
}
