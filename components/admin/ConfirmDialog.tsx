"use client";
import React from "react";
import { AdminButton } from "./AdminButton";
import { RiCloseLine, RiAlertLine } from "react-icons/ri";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    variant?: "danger" | "primary";
    loading?: boolean;
}

export function ConfirmDialog({
    open,
    title,
    description,
    onConfirm,
    onCancel,
    confirmLabel = "Confirm",
    variant = "danger",
    loading,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
                onClick={onCancel}
            />
            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-fadeInUp">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1 rounded-lg text-neutral-60 hover:bg-light-gray transition-colors"
                >
                    <RiCloseLine className="text-lg" />
                </button>

                <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent-red/10 flex items-center justify-center">
                        <RiAlertLine className="text-2xl text-accent-red" />
                    </div>
                    <h2 className="text-base font-bold text-neutral-100">{title}</h2>
                    {description && (
                        <p className="text-sm text-neutral-60">{description}</p>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                    <AdminButton
                        variant="outline"
                        className="flex-1"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </AdminButton>
                    <AdminButton
                        variant={variant}
                        className="flex-1"
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmLabel}
                    </AdminButton>
                </div>
            </div>
        </div>
    );
}
