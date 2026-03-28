"use client";
import React from "react";
import { clsx } from "clsx";
import { RiLoader4Line } from "react-icons/ri";

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "danger" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function AdminButton({
    variant = "primary",
    size = "md",
    loading,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    ...props
}: AdminButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

    const variants = {
        primary:
            "bg-primary text-white hover:bg-[#3730c4] active:scale-[0.97] focus-visible:ring-primary shadow-sm",
        danger:
            "bg-accent-red text-white hover:bg-[#e24a36] active:scale-[0.97] focus-visible:ring-accent-red shadow-sm",
        ghost:
            "bg-transparent text-neutral-80 hover:bg-light-gray hover:text-neutral-100 focus-visible:ring-primary",
        outline:
            "bg-white border border-border text-neutral-80 hover:border-primary hover:text-primary focus-visible:ring-primary",
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2.5",
        lg: "text-sm px-6 py-3",
    };

    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={clsx(base, variants[variant], sizes[size], className)}
        >
            {loading ? (
                <RiLoader4Line className="animate-spin text-[16px]" />
            ) : leftIcon ? (
                leftIcon
            ) : null}
            {children}
            {!loading && rightIcon}
        </button>
    );
}
