"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopbar from "@/components/admin/Topbar";
import { Form } from "@/components/admin/forms/Form";
import JobForm from "@/components/admin/forms/JobForm";
import { JobCreateSchema, type JobCreateInput } from "@/lib/validators/job";
import type { Company } from "@/lib/api/types";
import { useCompaniesQuery } from "@/lib/hooks/companies";
import {
  createJob,
  updateJobAssessment,
  createJobAssessment,
} from "@/lib/services/jobs";
import { useCategoriesQuery } from "@/lib/hooks/categories";
import { useExperienceLevelsQuery } from "@/lib/hooks/experience-levels";
import { useJobTypesQuery } from "@/lib/hooks/job-types";
import { useSession } from "next-auth/react";

export default function NewJobPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const companiesQuery = useCompaniesQuery();
  const companies = useMemo(
    () => companiesQuery.data ?? [],
    [companiesQuery.data],
  );
  const categoriesQuery = useCategoriesQuery();
  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
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

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: JobCreateInput) => {
    if (!session) return;
    setLoading(true);
    setServerError("");
    console.log("data", data);
    try {
      const { _hasAssessment, jobType, experienceLevel, assessment, ...rest } =
        data as any;
      let assessmentPayload = undefined;
      if (_hasAssessment && assessment) {
        assessmentPayload = {
          title: assessment.title,
          questions: assessment.questions.map((q: any) => {
            const { options_raw, ...questionRest } = q;
            return questionRest;
          }),
        };
      }

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
        assessment: assessmentPayload,
      };

      await createJob(jobPayload);
      router.push("/admin/jobs");
    } catch (e) {
      setServerError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminTopbar title="Post a Job" subtitle="Create a new job listing" />
      <main className="flex-1 p-6 max-w-3xl mx-auto">
        <Form<JobCreateInput>
          schema={JobCreateSchema}
          defaultValues={
            {
              title: "",
              companyId: "",
              jobType: jobTypes[0]?._id || "",
              experienceLevel: experienceLevels[0]?._id || "",
              location: "",
              isRemote: false,
              salaryMin: 0,
              salaryMax: 0,
              salaryCurrency: "USD",
              categoryIds: [],
              description: "",
              responsibilities: "",
              requirements: "",
              benefits: "",
              deadline: "",
              isFeatured: false,
              _hasAssessment: false,
              assessment: {
                title: "",
                questions: [],
              },
            } as any
          }
          onSubmit={handleSubmit}
        >
          <JobForm
            companies={companies as Company[]}
            categories={categories}
            experienceLevels={experienceLevels}
            jobTypes={jobTypes}
            loading={loading}
            submitLabel="Create Job"
            serverError={serverError}
          />
        </Form>
      </main>
    </>
  );
}
