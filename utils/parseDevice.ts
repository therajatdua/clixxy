import { UAParser } from "ua-parser-js";

export function parseDevice(userAgent: string | null): string {
    if (!userAgent) return "Unknown";
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    if (device.type === "mobile" || device.type === "tablet") return "Mobile";
    return "Desktop";
}

export function parseBrowser(userAgent: string | null): string {
    if (!userAgent) return "Unknown";
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    return browser.name || "Unknown";
}

export function parseOS(userAgent: string | null): string {
    if (!userAgent) return "Unknown";
    const parser = new UAParser(userAgent);
    const os = parser.getOS();
    return os.name || "Unknown";
}
