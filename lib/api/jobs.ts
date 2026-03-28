import type { Job, PaginatedResponse } from "./types";
import {
  getPublicJobs as svcGetPublicJobs,
  getPublicJob as svcGetPublicJob,
  getAdminJobs as svcGetAdminJobs,
  type JobsListParams,
} from "@/lib/services/jobs";

export type { JobsListParams };

export async function getPublicJobs(
  params?: JobsListParams,
): Promise<PaginatedResponse<Job>> {
  return svcGetPublicJobs(params);
}

export async function getPublicJob(slug: string): Promise<Job> {
  return svcGetPublicJob(slug);
}

export async function getAdminJobs(): Promise<Job[]> {
  return svcGetAdminJobs();
}
