"use client";
import React from "react";
import { clsx } from "clsx";
import type { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "up" | "down" | "neutral";
    icon?: ReactNode;
    iconBg?: string;
    href?: string;
    className?: string;
}

export function StatCard({
    title,
    value,
    change,
    changeType = "neutral",
    icon,
    iconBg = "bg-primary/10",
    className,
}: StatCardProps) {
    return (
        <div
            className={clsx(
                "bg-white rounded-xl border border-border p-5 flex items-start justify-between gap-4 hover:shadow-md transition-shadow duration-200",
                className
            )}
        >
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-60 uppercase tracking-wider mb-1">
                    {title}
                </p>
                <p className="text-2xl font-bold text-neutral-100 font-clash">{value}</p>
                {change && (
                    <p
                        className={clsx(
                            "text-xs font-medium mt-1 flex items-center gap-1",
                            changeType === "up" && "text-accent-green",
                            changeType === "down" && "text-accent-red",
                            changeType === "neutral" && "text-neutral-60"
                        )}
                    >
                        {changeType === "up" && "▲"}
                        {changeType === "down" && "▼"}
                        {change}
                    </p>
                )}
            </div>
            {icon && (
                <div
                    className={clsx(
                        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                        iconBg
                    )}
                >
                    {icon}
                </div>
            )}
        </div>
    );
}

interface HeroStatCardProps {
    value: string | number;
    label: string;
    bg: string;
    href?: string;
}

export function HeroStatCard({ value, label, bg }: HeroStatCardProps) {
    return (
        <div
            className={clsx(
                "relative flex items-center gap-4 rounded-xl px-6 py-5 text-white overflow-hidden group cursor-pointer hover:opacity-95 transition-opacity",
                bg
            )}
        >
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute right-10 bottom-0 w-10 h-10 rounded-full bg-white/10" />
            <span className="text-4xl font-black font-clash z-10">{value}</span>
            <span className="text-sm font-semibold leading-tight z-10">{label}</span>
            <span className="ml-auto text-white/70 z-10 group-hover:translate-x-1 transition-transform">
                →
            </span>
        </div>
    );
}
