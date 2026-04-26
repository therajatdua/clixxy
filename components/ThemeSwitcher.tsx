"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
    const mounted = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );
    const { theme, setTheme } = useTheme();

    if (!mounted) {
        return <div className="w-8 h-8 rounded-full bg-surface border border-border" />;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors shadow-sm"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="w-4 h-4" />
            ) : (
                <Moon className="w-4 h-4" />
            )}
        </button>
    );
}
