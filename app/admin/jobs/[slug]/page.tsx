"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminTopbar from "@/components/admin/Topbar";
import { AdminButton } from "@/components/admin/AdminButton";
import { StatusBadge, JobTypeBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LoadingScreen, ErrorBanner } from "@/components/admin/Feedback";
import { useSession } from "next-auth/react";
import {
  RiEditLine,
  RiDeleteBinLine,
  RiGlobalLine,
  RiForbidLine,
  RiArrowLeftLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
} from "react-icons/ri";
import type { Job } from "@/lib/api/types";
import { useJobTypesQuery } from "@/lib/hooks/job-types";
import { useExperienceLevelsQuery } from "@/lib/hooks/experience-levels";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPublicJob,
  deleteJob,
  publishJob,
  unpublishJob,
} from "@/lib/services/jobs";

export default function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    data: job,
    isLoading,
    error,
  } = useQuery<Job>({
    queryKey: ["admin-job", slug],
    queryFn: () => getPublicJob(slug),
    enabled: !!session && !!slug,
  });

  const { mutate: deleteMutate, isPending: deleteLoading } = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      router.push("/admin/jobs");
    },
  });

  const { mutate: publishMutate, isPending: publishLoading } = useMutation({
    mutationFn: job?.isPublished ? unpublishJob : publishJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-job", slug] });
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
    },
  });

  const [deleteOpen, setDeleteOpen] = useState(false);

  const jobTypesQuery = useJobTypesQuery();
  const experienceLevelsQuery = useExperienceLevelsQuery();

  const jobTypes = jobTypesQuery.data ?? [];
  const experienceLevels = experienceLevelsQuery.data ?? [];

  const jobTypeMap = Object.fromEntries(jobTypes.map((t) => [t._id, t.name]));
  const experienceLevelMap = Object.fromEntries(
    experienceLevels.map((l) => [l._id, l.name]),
  );

  const handleDelete = () => {
    if (!slug) return;
    deleteMutate(slug);
  };

  const handleTogglePublish = () => {
    if (!slug) return;
    publishMutate(slug);
  };

  if (isLoading) {
    return (
      <>
        <AdminTopbar title="Job Detail" />
        <LoadingScreen />
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminTopbar title="Job Detail" />
        <main className="p-6">
          <ErrorBanner message={error.message} />
        </main>
      </>
    );
  }
  if (!job) return null;

  const salaryRange = `${job.salaryCurrency} ${job.salaryMin?.toLocaleString()} – ${job.salaryMax?.toLocaleString()}`;

  return (
    <>
      <AdminTopbar title="Job Detail" subtitle={job.title} />
      <main className="flex-1 p-6 max-w-4xl space-y-5">
        {/* Back + actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/jobs"
            className="flex items-center gap-1.5 text-sm text-neutral-60 hover:text-primary transition-colors"
          >
            <RiArrowLeftLine /> Back to Jobs
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge
              status={job.isPublished ? "published" : "unpublished"}
            />
            <AdminButton
              variant="outline"
              size="sm"
              onClick={handleTogglePublish}
              loading={publishLoading}
              leftIcon={job.isPublished ? <RiForbidLine /> : <RiGlobalLine />}
            >
              {job.isPublished ? "Unpublish" : "Publish"}
            </AdminButton>
            <Link href={`/admin/jobs/${slug}/edit`}>
              <AdminButton
                variant="outline"
                size="sm"
                leftIcon={<RiEditLine />}
              >
                Edit
              </AdminButton>
            </Link>
            <AdminButton
              variant="danger"
              size="sm"
              leftIcon={<RiDeleteBinLine />}
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </AdminButton>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        {/* Job card */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-neutral-100 font-clash">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <JobTypeBadge type={jobTypeMap[job.job_type] || job.job_type} />
                <span className="text-xs bg-neutral-20 text-neutral-60 font-semibold px-2.5 py-1 rounded-full">
                  {experienceLevelMap[job.experience_level] ||
                    job.experience_level}
                </span>
                {job.isRemote && (
                  <span className="text-xs bg-accent-green/10 text-accent-green font-semibold px-2.5 py-1 rounded-full">
                    Remote
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm text-neutral-60">
              <RiMapPinLine className="text-primary shrink-0" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-60">
              <RiMoneyDollarCircleLine className="text-accent-green shrink-0" />
              <span>{salaryRange}</span>
            </div>
            {job.deadline && (
              <div className="flex items-center gap-2 text-sm text-neutral-60">
                <RiTimeLine className="text-accent-yellow shrink-0" />
                <span>
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="border-t border-border pt-4">
            <h2 className="text-sm font-bold text-neutral-100 mb-2">
              Description
            </h2>
            <p className="text-sm text-neutral-80 whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities?.length > 0 && (
            <div className="border-t border-border pt-4">
              <h2 className="text-sm font-bold text-neutral-100 mb-2">
                Responsibilities
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="text-sm text-neutral-80">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="border-t border-border pt-4">
              <h2 className="text-sm font-bold text-neutral-100 mb-2">
                Requirements
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {job.requirements.map((r, i) => (
                  <li key={i} className="text-sm text-neutral-80">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits?.length > 0 && (
            <div className="border-t border-border pt-4">
              <h2 className="text-sm font-bold text-neutral-100 mb-2">
                Benefits
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((b, i) => (
                  <span
                    key={i}
                    className="text-xs bg-primary/10 text-primary font-semibold px-3 py-1.5 rounded-full"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <ConfirmDialog
          open={deleteOpen}
          title="Delete Job"
          description={`Permanently delete "${job.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteOpen(false)}
          confirmLabel="Delete Job"
          loading={deleteLoading}
        />
      </main>
    </>
  );
}
