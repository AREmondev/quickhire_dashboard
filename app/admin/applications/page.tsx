"use client";

import { useMemo, useState, useEffect } from "react";
import AdminTopbar from "@/components/admin/Topbar";
import { useSession } from "next-auth/react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  LoadingRow,
  EmptyState,
  ErrorBanner,
} from "@/components/admin/Feedback";
import { RiFileList3Line, RiSearchLine, RiEyeLine } from "react-icons/ri";
import type { ApplicationStatus } from "@/lib/api/types";
import { useCandidateApplicationsQuery } from "@/lib/hooks/applications";
import Link from "next/link";

interface AppItem {
  id: string;
  job: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
  status: ApplicationStatus;
  resumeSource: string;
  score?: number;
}

const ALL_STATUSES = [
  "all",
  "assessment_pending",
  "assessment_completed",
  "submitted",
  "under_review",
  "interview",
  "offer",
  "hired",
  "rejected",
];

export default function AdminApplicationsPage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const appsQuery = useCandidateApplicationsQuery();

  const filtered = useMemo(() => {
    const data = (appsQuery.data as any) ?? { items: [] };
    let items = Array.isArray(data) ? data : data.items || [];

    if (statusFilter !== "all") {
      items = items.filter((a: any) => a.status === statusFilter);
    }

    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (a: any) =>
          a.id.toLowerCase().includes(s) ||
          a.job?.title?.toLowerCase().includes(s) ||
          a.user?.name?.toLowerCase().includes(s),
      );
    }
    return { items };
  }, [appsQuery.data, search, statusFilter]);

  if (!session) return null;

  return (
    <>
      <AdminTopbar
        title="Applications"
        subtitle="Review all candidate applications"
      />
      <main className="flex-1 p-6 space-y-4">
        {appsQuery.error && (
          <ErrorBanner message={(appsQuery.error as Error).message} />
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 text-sm focus-within:border-primary transition-colors">
            <RiSearchLine className="text-neutral-60 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job, candidate…"
              className="bg-transparent outline-none text-neutral-100 placeholder:text-neutral-60 w-44"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-border rounded-lg px-3 py-2 text-sm text-neutral-80 outline-none focus:border-primary cursor-pointer"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all"
                  ? "All Statuses"
                  : s
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-light-gray">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60">
                    Candidate
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60">
                    Job Title
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60 hidden sm:table-cell">
                    Resume
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60 hidden xl:table-cell">
                    Applied
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60">
                    Score
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {appsQuery.isLoading ? (
                  <tr>
                    <td colSpan={7}>
                      <LoadingRow />
                    </td>
                  </tr>
                ) : filtered.items.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        icon={<RiFileList3Line />}
                        title="No applications found"
                        description="Applications will appear here when candidates apply to jobs."
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.items.map((app: any) => (
                    <tr
                      key={app.id}
                      className="border-b border-border last:border-0 hover:bg-light-gray/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-neutral-100">
                          {app.user?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-neutral-60 font-mono">
                          ID: {app.id.slice(0, 8)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-neutral-80">
                          {app.jobTitle || app.job?.title || "Unknown Job"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-60 capitalize hidden sm:table-cell">
                        {app.resumeSource}
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-60 hidden xl:table-cell">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-neutral-80">
                        {app.score != null ? app.score : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                          <RiEyeLine /> View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
