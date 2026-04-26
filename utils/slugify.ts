import { customAlphabet } from "nanoid";

const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const generateId = customAlphabet(alphabet, 7);

export function generateSlug(): string {
    return generateId();
}

export function sanitizeSlug(slug: string): string {
    return slug
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 50);
}
