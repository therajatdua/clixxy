"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    DoughnutController,
    ArcElement
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    DoughnutController,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface UnifiedAnalyticsChartsProps {
    platformData: { name: string; count: number }[];
    deviceData: { name: string; count: number }[];
    countryData: { name: string; count: number }[];
}

export default function UnifiedAnalyticsCharts({ platformData, deviceData, countryData }: UnifiedAnalyticsChartsProps) {
    const mounted = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );
    const { resolvedTheme } = useTheme();

    if (!mounted) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center border border-border rounded-xl">
                <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            </div>
        );
    }

    const isDark = resolvedTheme === "dark";
    const textColor = isDark ? "#e5e5e5" : "#111827";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

    // Colors
    const platformColors = ["#3b82f6", "#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899"];
    const deviceColors = ["#10b981", "#f59e0b", "#f43f5e"];
    const countryColors = ["#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308"];

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: isDark ? "#374151" : "#e5e7eb",
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: gridColor,
                },
                ticks: {
                    color: textColor,
                    font: { family: "Inter", weight: 500 as const },
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: textColor,
                    font: { family: "Inter", weight: 500 as const },
                },
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    color: textColor,
                    font: { family: "Inter", weight: 500 as const, size: 12 },
                    padding: 20,
                    usePointStyle: true,
                },
            },
            tooltip: commonOptions.plugins.tooltip,
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Platform Chart - Bar */}
            <div className="card p-6 rounded-2xl border border-border bg-surface flex flex-col items-center">
                <h3 className="w-full text-sm font-bold tracking-widest uppercase text-text-secondary mb-6">Platforms</h3>
                {platformData.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-sm font-medium text-text-muted">No data yet</div>
                ) : (
                    <div className="w-full h-[250px]">
                        <Bar
                            options={commonOptions}
                            data={{
                                labels: platformData.map((d) => d.name),
                                datasets: [
                                    {
                                        data: platformData.map((d) => d.count),
                                        backgroundColor: platformColors,
                                        borderRadius: 6,
                                    },
                                ],
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Device Chart - Doughnut */}
            <div className="card p-6 rounded-2xl border border-border bg-surface flex flex-col items-center">
                <h3 className="w-full text-sm font-bold tracking-widest uppercase text-text-secondary mb-6">Devices</h3>
                {deviceData.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-sm font-medium text-text-muted">No data yet</div>
                ) : (
                    <div className="w-full h-[250px]">
                        <Doughnut
                            options={doughnutOptions}
                            data={{
                                labels: deviceData.map((d) => d.name),
                                datasets: [
                                    {
                                        data: deviceData.map((d) => d.count),
                                        backgroundColor: deviceColors,
                                        borderWidth: 0,
                                    },
                                ],
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Country Chart - Bar */}
            <div className="card p-6 rounded-2xl border border-border bg-surface flex flex-col items-center">
                <h3 className="w-full text-sm font-bold tracking-widest uppercase text-text-secondary mb-6">Countries</h3>
                {countryData.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-sm font-medium text-text-muted">No data yet</div>
                ) : (
                    <div className="w-full h-[250px]">
                        <Bar
                            options={{ ...commonOptions, indexAxis: 'y' as const }}
                            data={{
                                labels: countryData.map((d) => d.name),
                                datasets: [
                                    {
                                        data: countryData.map((d) => d.count),
                                        backgroundColor: countryData.map((_, i) => countryColors[i % countryColors.length]),
                                        borderRadius: 6,
                                    },
                                ],
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
