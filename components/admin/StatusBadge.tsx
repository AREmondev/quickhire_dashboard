"use client";
import React from "react";
import { clsx } from "clsx";
import type { ApplicationStatus } from "@/lib/api/types";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-neutral-20 text-neutral-60",
  assessment_pending: "bg-yellow-100 text-yellow-700",
  assessment_completed: "bg-blue-100 text-blue-700",
  submitted: "bg-accent-blue/10 text-accent-blue",
  under_review: "bg-purple-100 text-purple-700",
  interview: "bg-orange-100 text-orange-700",
  offer: "bg-accent-green/10 text-accent-green",
  hired: "bg-green-100 text-green-700",
  rejected: "bg-accent-red/10 text-accent-red",
  // published
  published: "bg-accent-green/10 text-accent-green",
  unpublished: "bg-neutral-20 text-neutral-60",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  assessment_pending: "Assessment Pending",
  assessment_completed: "Assessment Done",
  submitted: "Submitted",
  under_review: "Under Review",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
  published: "Published",
  unpublished: "Draft",
};

interface StatusBadgeProps {
  status: ApplicationStatus | "published" | "unpublished";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full",
        STATUS_STYLES[status] ?? "bg-neutral-20 text-neutral-60",
        className,
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

interface CategoryBadgeProps {
  label: string;
  color?: string;
  className?: string;
}

export function CategoryBadge({
  label,
  color = "#4640DE",
  className,
}: CategoryBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full",
        className,
      )}
      style={{ background: `${color}18`, color }}
    >
      {label}
    </span>
  );
}

export function JobTypeBadge({ type }: { type: string | { name: string } }) {
  const colors: Record<string, string> = {
    "Full Time": "#4640DE",
    "Part Time": "#FFB836",
    Remote: "#56CDAD",
    Contract: "#FF6550",
    Internship: "#26A4FF",
  };
  const label = typeof type === "string" ? type : type?.name || "Unknown";
  const color = colors[label] ?? "#4640DE";
  return <CategoryBadge label={label} color={color} />;
}
