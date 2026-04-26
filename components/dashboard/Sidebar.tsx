"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Link2,
    Plus,
    LogOut,
    ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/links", icon: Link2, label: "My Links" },
    { href: "/dashboard/links/create", icon: Plus, label: "Create Link" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-20 w-56 hidden md:flex flex-col bg-bg border-r border-solid border-border">
                {/* Logo */}
                <div className="h-14 flex items-center px-5 border-b border-solid border-border">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-surface dark:bg-surface-hover text-text-primary rounded uppercase font-medium tracking-tight  border border-solid border-border shadow-md text-sm">
                            CLIXY™
                        </div>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                    <p className="px-2 py-2 text-[10px] font-medium text-text-secondary uppercase tracking-widest">
                        Menu
                    </p>
                    {navItems.map((item) => {
                        const active =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-all border",
                                    active
                                        ? "bg-surface text-text-primary border-border shadow-md translate-x-1"
                                        : "bg-transparent text-text-secondary border-transparent hover:text-text-primary hover:bg-surface-hover hover:border-[#333]"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", active ? "text-text-primary" : "text-text-secondary")} />
                                {item.label}
                                {active && <ChevronRight className="w-4 h-4 ml-auto text-text-primary" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-solid border-border">
                    <button
                        id="sidebar-logout"
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide text-text-secondary hover:text-text-primary hover:bg-[#ef4444] border border-transparent hover:border-border hover:shadow-md transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 bg-bg border-t border-solid border-border flex md:hidden items-center justify-around h-16 px-2 pb-safe">
                {navItems.map((item) => {
                    const active =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg text-[10px] font-medium uppercase tracking-widest transition-colors flex-1",
                                active ? "text-[#ffffff]" : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 mb-1", active ? "text-[#ffffff]" : "text-text-muted")} />
                            <span className="truncate">{item.label}</span>
                        </Link>
                    );
                })}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center justify-center p-2 rounded-lg text-[10px] font-medium uppercase tracking-widest text-text-secondary hover:text-[#ef4444] transition-colors flex-1"
                >
                    <LogOut className="w-5 h-5 mb-1 text-text-muted" />
                    <span>Sign out</span>
                </button>
            </nav>
        </>
    );
}
