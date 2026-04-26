import { Click } from "@/types";
import { getPlatformFromReferrer } from "@/lib/utils";
import { Monitor, Smartphone, Globe } from "lucide-react";
import LocalTime from "./LocalTime";

export default function RecentClicks({ clicks }: { clicks: Click[] }) {
    if (!clicks || clicks.length === 0) {
        return (
            <div className="flex items-center justify-center p-12 text-text-secondary text-sm font-bold uppercase tracking-widest border border-solid border-[#262626] m-4 rounded-xl">
                No visitors yet
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-solid border-border bg-surface-hover">
                        {["Time", "Platform", "Device", "Country"].map((h) => (
                            <th key={h} className="text-left py-3 px-4 text-xs font-medium text-text-primary uppercase tracking-widest">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {clicks.map((click) => (
                        <tr key={click.id} className="border-b border-solid border-[#262626] hover:bg-surface-hover transition-colors cursor-default">
                            <td className="py-3 px-4 text-xs font-bold text-text-secondary whitespace-nowrap">
                                <LocalTime timestamp={click.timestamp} />
                            </td>
                            <td className="py-3 px-4 text-xs text-text-primary font-medium uppercase tracking-widest">
                                {getPlatformFromReferrer(click.referrer, click.user_agent)}
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-secondary">
                                    {click.device === "Mobile"
                                        ? <Smartphone className="w-4 h-4 text-[#ffffff]" />
                                        : <Monitor className="w-4 h-4 text-text-primary" />}
                                    {click.device || "Unknown"}
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-secondary">
                                    <Globe className="w-4 h-4 text-text-muted" />
                                    {click.country || "Unknown"}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
