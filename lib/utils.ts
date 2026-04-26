import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return ["http:", "https:"].includes(parsed.protocol);
    } catch {
        return false;
    }
}

export function getPlatformFromReferrer(referrer: string | null, userAgent?: string | null): string {
    // 1. First try to extract from User-Agent (crucial for mobile apps that drop referrers)
    if (userAgent) {
        const ua = userAgent.toLowerCase();
        if (ua.includes("whatsapp")) return "WhatsApp";
        if (ua.includes("instagram")) return "FB / Instagram";
        if (ua.includes("fban") || ua.includes("fbios")) return "FB / Instagram";
        if (ua.includes("tiktok")) return "TikTok";
        if (ua.includes("snapchat")) return "Snapchat";
        if (ua.includes("telegram")) return "Telegram"; // TelegramBot uses "(like TwitterBot)", so it must be checked first
        if (ua.includes("twitter")) return "Twitter";
        if (ua.includes("linkedin")) return "LinkedIn";
        if (ua.includes("discord")) return "Discord";
        if (ua.includes("youtube")) return "YouTube";
    }

    // 2. Fallback to Referrer if no app matched in UA
    if (!referrer) return "Direct";
    try {
        const url = new URL(referrer);
        const hostname = url.hostname.toLowerCase();
        if (hostname.includes("instagram")) return "FB / Instagram";
        if (hostname.includes("youtube") || hostname.includes("youtu.be"))
            return "YouTube";
        if (hostname.includes("facebook") || hostname.includes("fb.com"))
            return "FB / Instagram";
        if (hostname.includes("twitter") || hostname.includes("x.com") || hostname.includes("t.co"))
            return "Twitter";
        if (hostname.includes("tiktok")) return "TikTok";
        if (hostname.includes("linkedin")) return "LinkedIn";
        if (hostname.includes("pinterest")) return "Pinterest";
        if (hostname.includes("reddit")) return "Reddit";
        if (hostname.includes("snapchat")) return "Snapchat";
        if (hostname.includes("telegram") || hostname.includes("t.me")) return "Telegram";
        if (hostname.includes("whatsapp")) return "WhatsApp";
        return hostname.replace("www.", "");
    } catch {
        return "Unknown";
    }
}
