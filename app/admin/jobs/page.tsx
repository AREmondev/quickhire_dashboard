"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminTopbar from "@/components/admin/Topbar";
import { useSession } from "next-auth/react";
import { AdminButton } from "@/components/admin/AdminButton";
import { StatusBadge, JobTypeBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  LoadingRow,
  EmptyState,
  ErrorBanner,
} from "@/components/admin/Feedback";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiSearchLine,
  RiGlobalLine,
  RiForbidLine,
  RiBriefcaseLine,
} from "react-icons/ri";
import {
  useAdminJobsQuery,
  useDeleteJobMutation,
  usePublishJobMutation,
  useUnpublishJobMutation,
} from "@/lib/hooks/jobs";
import { useJobTypesQuery } from "@/lib/hooks/job-types";
import { Job } from "@/lib/api/types";

export default function AdminJobsPage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState<string | null>(null);

  const jobsQuery = useAdminJobsQuery();
  const jobs = jobsQuery.data ?? [];
  const jobTypesQuery = useJobTypesQuery();
  const jobTypes = jobTypesQuery.data ?? [];

  const jobTypeMap = useMemo(() => {
    return Object.fromEntries(jobTypes.map((t) => [t._id, t.name]));
  }, [jobTypes]);

  const deleteMutation = useDeleteJobMutation(deleteId || "");
  const publishMutation = usePublishJobMutation(publishLoading || "");
  const unpublishMutation = useUnpublishJobMutation(publishLoading || "");

  const filtered = useMemo(() => {
    let result = jobs;
    if (search) {
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.location.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (filterStatus === "published")
      result = result.filter((j) => j.isPublished);
    if (filterStatus === "draft") result = result.filter((j) => !j.isPublished);
    return result;
  }, [jobs, search, filterStatus]);

  const handleDelete = async () => {
    if (!deleteId || !session) return;
    setDeleteLoading(true);
    try {
      await deleteMutation.mutateAsync();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const handleTogglePublish = async (
    job: Job,
    action: "publish" | "unpublish",
  ) => {
    if (!session) return;
    setPublishLoading(job.id);
    try {
      if (action === "publish") {
        await publishMutation.mutateAsync();
      } else {
        await unpublishMutation.mutateAsync();
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPublishLoading(null);
    }
  };

  return (
    <>
      <AdminTopbar title="Jobs" subtitle="Manage your job listings" />
      <main className="flex-1 p-6 space-y-4">
        {error && <ErrorBanner message={error} />}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 text-sm focus-within:border-primary transition-colors">
              <RiSearchLine className="text-neutral-60 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs…"
                className="bg-transparent outline-none text-neutral-100 placeholder:text-neutral-60 w-44"
              />
            </div>
            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | "published" | "draft")
              }
              className="bg-white border border-border rounded-lg px-3 py-2 text-sm text-neutral-80 outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>

          <Link href="/admin/jobs/new">
            <AdminButton leftIcon={<RiAddLine />}>Post a Job</AdminButton>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-light-gray">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60">
                    Job Title
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60 hidden md:table-cell">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60 hidden lg:table-cell">
                    Location
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60 hidden xl:table-cell">
                    Updated
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobsQuery.isLoading ? (
                  <tr>
                    <td colSpan={6}>
                      <LoadingRow />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        icon={<RiBriefcaseLine />}
                        title="No jobs found"
                        description="Post your first job to get started"
                        action={
                          <Link href="/admin/jobs/new">
                            <AdminButton leftIcon={<RiAddLine />}>
                              Post a Job
                            </AdminButton>
                          </Link>
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-border last:border-0 hover:bg-light-gray/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/jobs/${job.id}`}
                          className="font-medium text-neutral-100 hover:text-primary transition-colors line-clamp-1"
                        >
                          {job.title}
                        </Link>
                        {job.isRemote && (
                          <span className="text-xs text-accent-green">
                            Remote
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <JobTypeBadge
                          type={jobTypeMap[job.jobType._id] || job.jobType.name}
                        />
                      </td>
                      <td className="px-4 py-3 text-neutral-60 hidden lg:table-cell">
                        {job.location}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={job.isPublished ? "published" : "unpublished"}
                        />
                      </td>
                      <td className="px-4 py-3 text-neutral-60 text-xs hidden xl:table-cell">
                        {job.updatedAt
                          ? new Date(job.updatedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/jobs/${job.slug}`}>
                            <button
                              title="View"
                              className="p-1.5 rounded-lg text-neutral-60 hover:bg-light-gray hover:text-primary transition-colors"
                            >
                              <RiEyeLine className="text-base" />
                            </button>
                          </Link>
                          <Link href={`/admin/jobs/${job.slug}/edit`}>
                            <button
                              title="Edit"
                              className="p-1.5 rounded-lg text-neutral-60 hover:bg-light-gray hover:text-primary transition-colors"
                            >
                              <RiEditLine className="text-base" />
                            </button>
                          </Link>
                          <button
                            title={job.isPublished ? "Unpublish" : "Publish"}
                            onClick={() =>
                              handleTogglePublish(
                                job,
                                job.isPublished ? "unpublish" : "publish",
                              )
                            }
                            disabled={publishLoading === job.id}
                            className="p-1.5 rounded-lg text-neutral-60 hover:bg-light-gray hover:text-accent-green transition-colors disabled:opacity-50"
                          >
                            {job.isPublished ? (
                              <RiForbidLine className="text-base" />
                            ) : (
                              <RiGlobalLine className="text-base" />
                            )}
                          </button>
                          <button
                            title="Delete"
                            onClick={() => setDeleteId(job.id)}
                            className="p-1.5 rounded-lg text-neutral-60 hover:bg-accent-red/10 hover:text-accent-red transition-colors"
                          >
                            <RiDeleteBinLine className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ConfirmDialog
          open={!!deleteId}
          title="Delete Job"
          description="This will permanently delete the job and cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          confirmLabel="Delete"
          loading={deleteLoading}
        />
      </main>
    </>
  );
}
