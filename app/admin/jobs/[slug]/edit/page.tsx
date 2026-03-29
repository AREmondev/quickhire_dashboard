"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminTopbar from "@/components/admin/Topbar";
import { Form } from "@/components/admin/forms/Form";
import JobForm from "@/components/admin/forms/JobForm";
import { JobCreateSchema, type JobCreateInput } from "@/lib/validators/job";
import { LoadingScreen, ErrorBanner } from "@/components/admin/Feedback";
import { RiArrowLeftLine } from "react-icons/ri";
import type { Company, Job, Category } from "@/lib/api/types";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublicJob, updateJob } from "@/lib/services/jobs";
import { getCompanies } from "@/lib/services/companies";
import { getCategories } from "@/lib/services/categories";
import { useExperienceLevelsQuery } from "@/lib/hooks/experience-levels";
import { useJobTypesQuery } from "@/lib/hooks/job-types";

export default function EditJobPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const experienceLevelsQuery = useExperienceLevelsQuery();
  const experienceLevels = useMemo(
    () => experienceLevelsQuery.data ?? [],
    [experienceLevelsQuery.data],
  );
  const jobTypesQuery = useJobTypesQuery();
  const jobTypes = useMemo(
    () => jobTypesQuery.data ?? [],
    [jobTypesQuery.data],
  );
  const {
    data: job,
    isLoading: jobLoading,
    error: jobError,
  } = useQuery<Job>({
    queryKey: ["admin-job", slug],
    queryFn: () => getPublicJob(slug),
    enabled: !!session && !!slug,
  });

  const {
    data: companies,
    isLoading: companiesLoading,
    error: companiesError,
  } = useQuery<Company[]>({
    queryKey: ["admin-companies"],
    queryFn: getCompanies,
    enabled: !!session,
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
    enabled: !!session,
  });

  const { mutateAsync: updateMutate, isPending: submitting } = useMutation({
    mutationFn: async (payload: Partial<Job>) => {
      return await updateJob(job?.id || "", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-job", slug] });
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      router.push(`/admin/jobs/${slug}`);
    },
  });

  const [serverError, setServerError] = useState("");

  const handleSubmit = async (data: JobCreateInput) => {
    setServerError("");
    try {
      const {
        _hasAssessment,
        companyId,
        jobType,
        experienceLevel,
        assessment,
        ...rest
      } = data as any;

      const jobPayload = {
        ...rest,
        jobType: jobType,
        experienceLevel: experienceLevel,
        salaryMin: Number(data.salaryMin),
        salaryMax: Number(data.salaryMax),
        responsibilities: data.responsibilities
          ? data.responsibilities.split("\n").filter(Boolean)
          : [],
        requirements: data.requirements
          ? data.requirements.split("\n").filter(Boolean)
          : [],
        benefits: data.benefits
          ? data.benefits.split("\n").filter(Boolean)
          : [],
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds : [],
      };

      await updateMutate(jobPayload);
    } catch (e) {
      setServerError((e as Error).message);
    }
  };

  const loading = jobLoading || companiesLoading || categoriesLoading;
  const error = jobError || companiesError || categoriesError;

  if (loading) {
    return (
      <>
        <AdminTopbar title="Edit Job" />
        <LoadingScreen />
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminTopbar title="Edit Job" />
        <main className="p-6">
          <ErrorBanner message={error.message} />
        </main>
      </>
    );
  }
  if (!job) return null;

  const defaultValues: Partial<JobCreateInput> = {
    title: job.title,
    companyId: job.companyId,
    jobType: job.jobType || "",
    experienceLevel: job.experienceLevel || "",
    location: job.location,
    isRemote: job.isRemote,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency || "USD",
    categoryIds: job.categoryIds || [],
    description: job.description,
    responsibilities: job.responsibilities?.join("\n"),
    requirements: job.requirements?.join("\n"),
    benefits: job.benefits?.join("\n"),
    deadline: job.deadline
      ? new Date(job.deadline).toISOString().split("T")[0]
      : "",
    isFeatured: job.isFeatured,
  } as any;

  return (
    <>
      <AdminTopbar title="Edit Job" subtitle={`Editing: ${job.title}`} />
      <main className="flex-1 p-6 max-w-3xl mx-auto space-y-4">
        <Link
          href={`/admin/jobs/${slug}`}
          className="flex items-center gap-1.5 text-sm text-neutral-60 hover:text-primary transition-colors"
        >
          <RiArrowLeftLine /> Back to Job
        </Link>
        <Form<JobCreateInput>
          schema={JobCreateSchema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        >
          <JobForm
            jobTypes={jobTypes || []}
            experienceLevels={experienceLevels || []}
            companies={companies || []}
            categories={categories || []}
            loading={submitting}
            submitLabel="Update Job"
            serverError={serverError}
            hideAssessment={true}
          />
        </Form>
      </main>
    </>
  );
}
