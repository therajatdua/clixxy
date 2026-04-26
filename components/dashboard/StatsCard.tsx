import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor?: string;
}

export default function StatsCard({ title, value, subtitle, icon: Icon, iconColor = "text-text-primary" }: StatsCardProps) {
    const isAudience = title.toLowerCase().includes("audience");

    return (
        <div className={cn(
            "card relative overflow-hidden rounded-2xl p-5 sm:p-6 border bg-surface hover:shadow-lg transition-all duration-300 group",
            isAudience ? "border-green-500/30 hover:border-green-500/60" : "border-border hover:border-text-muted"
        )}>
            {isAudience && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            )}

            <div className="relative z-10 flex items-center justify-between mb-4">
                <p className={cn("text-xs sm:text-sm font-semibold uppercase tracking-widest text-text-secondary", isAudience && "text-green-400")}>{title}</p>
                <div className={cn("w-8 h-8 rounded-lg bg-bg border shadow-sm flex items-center justify-center flex-shrink-0 transition-colors", isAudience ? "border-green-500/30 group-hover:bg-green-500/10" : "border-border")}>
                    <Icon className={cn("w-4 h-4", iconColor)} />
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary mb-1">{value}</p>
                {subtitle && <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{subtitle}</p>}

                {isAudience && (
                    <div className="absolute -bottom-2 -right-2 text-green-500 opacity-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                )}
            </div>
        </div>
    );
}
