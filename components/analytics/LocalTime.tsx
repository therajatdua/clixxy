"use client";

import { useSyncExternalStore } from "react";
import { formatDateTime } from "@/lib/utils";

export default function LocalTime({ timestamp }: { timestamp: string }) {
    const mounted = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );

    if (!mounted) {
        return <span className="opacity-0">Loading...</span>;
    }

    return <span>{formatDateTime(timestamp)}</span>;
}
