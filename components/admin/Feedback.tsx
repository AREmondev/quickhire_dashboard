"use client";
import React from "react";
import { RiLoader4Line } from "react-icons/ri";

export function LoadingScreen() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <RiLoader4Line className="text-primary text-3xl animate-spin" />
                <p className="text-sm text-neutral-60">Loading…</p>
            </div>
        </div>
    );
}

export function LoadingRow() {
    return (
        <div className="flex items-center justify-center py-12">
            <RiLoader4Line className="text-primary text-2xl animate-spin" />
        </div>
    );
}

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {icon && (
                <div className="text-5xl text-neutral-20 mb-4">{icon}</div>
            )}
            <h3 className="text-base font-semibold text-neutral-100 mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-neutral-60 max-w-sm mb-4">{description}</p>
            )}
            {action}
        </div>
    );
}

export function ErrorBanner({ message }: { message: string }) {
    return (
        <div className="rounded-lg border border-accent-red/30 bg-accent-red/5 px-4 py-3 text-sm text-accent-red">
            {message}
        </div>
    );
}

export function SuccessBanner({ message }: { message: string }) {
    return (
        <div className="rounded-lg border border-accent-green/30 bg-accent-green/5 px-4 py-3 text-sm text-accent-green font-medium">
            {message}
        </div>
    );
}
