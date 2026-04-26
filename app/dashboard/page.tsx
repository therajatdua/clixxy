import { createClient } from "@/lib/supabase/server";
import DashboardHeader from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import Link from "next/link";
import { Link2, Users, Globe, Smartphone, Plus, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: links } = await supabase
        .from("links").select("id, name, slug, destination_url, created_at")
        .eq("user_id", user!.id).order("created_at", { ascending: false });

    const linkIds = links?.map((l) => l.id) ?? [];
    const { data: clicks } = linkIds.length
        ? await supabase.from("clicks").select("id, link_id, device, country").in("link_id", linkIds)
        : { data: [] };

    const totalLinks = links?.length ?? 0;
    const totalClicks = clicks?.length ?? 0;
    const mobileClicks = clicks?.filter((c) => c.device === "Mobile").length ?? 0;
    const uniqueCountries = new Set(clicks?.map((c) => c.country).filter(Boolean)).size;

    const recentLinks = (links ?? []).slice(0, 5).map((link) => ({
        ...link,
        click_count: clicks?.filter((c) => c.link_id === link.id).length ?? 0,
    }));

    return (
        <div>
            <DashboardHeader title="Overview" />
            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <StatsCard title="Total Links" value={totalLinks} icon={Link2} subtitle="Created" iconColor="text-blue-500" />
                    <StatsCard title="Total Audience" value={totalClicks} icon={Users} subtitle="People reached" iconColor="text-green-500" />
                    <StatsCard title="Mobile" value={mobileClicks} icon={Smartphone}
                        subtitle={totalClicks > 0 ? `${Math.round((mobileClicks / totalClicks) * 100)}%` : "—"} iconColor="text-orange-500" />
                    <StatsCard title="Countries" value={uniqueCountries} icon={Globe} subtitle="Unique" iconColor="text-purple-500" />
                </div>

                {/* Recent Links */}
                <div className="card rounded-2xl border border-border bg-surface overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-border bg-bg/50">
                        <h2 className="text-sm sm:text-base font-semibold text-text-primary">Recent Links</h2>
                        <Link href="/dashboard/links" className="text-xs sm:text-sm text-accent hover:text-accent-hover font-medium flex items-center gap-1 transition-colors">
                            View all <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {recentLinks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-6">
                            <div className="w-12 h-12 rounded-xl bg-bg border border-border shadow-sm flex items-center justify-center mb-4">
                                <Link2 className="w-6 h-6 text-text-muted" />
                            </div>
                            <h3 className="text-base font-semibold text-text-primary mb-1">No links created yet</h3>
                            <p className="text-sm text-text-secondary mb-6 max-w-sm">Create your first shortened link to start tracking your audience and geography.</p>
                            <Link href="/dashboard/links/create"
                                className="btn-primary flex items-center gap-1.5 px-6 py-3 text-xs w-auto shadow-md hover:shadow-md">
                                <Plus className="w-4 h-4" /> Create link
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {recentLinks.map((link) => (
                                <div key={link.id} className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 hover:bg-surface-hover transition-colors group">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <p className="text-sm sm:text-base font-medium text-text-primary truncate">{link.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs sm:text-sm text-text-muted truncate">/r/{link.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 sm:gap-6">
                                        <div className="text-right">
                                            <p className="text-sm sm:text-base font-semibold text-text-primary">{link.click_count}</p>
                                            <p className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">visitors</p>
                                        </div>
                                        <Link href={`/dashboard/links/${link.id}`}
                                            className="p-2 sm:p-2.5 rounded-xl bg-bg border border-border text-text-secondary hover:text-accent hover:border-accent shadow-sm transition-all sm:opacity-0 sm:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                        { href: "/dashboard/links/create", icon: Plus, title: "Create new link", sub: "Set up tracking instantly" },
                        { href: "/dashboard/links", icon: Link2, title: "Manage links", sub: "View and edit all links" },
                    ].map((a) => (
                        <Link key={a.href} href={a.href}
                            className="card rounded-2xl p-5 sm:p-6 flex items-center gap-4 group border border-border bg-surface hover:border-text-muted hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-bg border border-border shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                <a.icon className="w-5 h-5 sm:w-6 sm:h-6 text-text-primary group-hover:text-accent transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base font-semibold text-text-primary mb-0.5">{a.title}</p>
                                <p className="text-xs sm:text-sm text-text-secondary truncate">{a.sub}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:border-accent transition-colors">
                                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
