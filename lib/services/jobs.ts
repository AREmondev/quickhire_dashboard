import type { Job } from "@/lib/api/types";
import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export type JobsListParams = {
  page?: number;
  pageSize?: number;
  query?: string;
  location?: string;
  type?: string;
  experience?: string;
  sort?: string;
};

export async function getPublicJobs(params?: JobsListParams) {
  const res = await apiClient.get<{
    success: true;
    data: {
      items: Job[];
      page: number;
      pageSize: number;
      total: number;
      pageCount: number;
    };
  }>(API_ENDPOINTS.JOBS.PUBLIC, {
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      ...(params?.query ? { query: params.query } : {}),
      ...(params?.location ? { location: params.location } : {}),
      ...(params?.type ? { type: params.type } : {}),
      ...(params?.experience ? { experience: params.experience } : {}),
      ...(params?.sort ? { sort: params.sort } : {}),
    },
  });
  return res.data.data;
}

export async function getPublicJob(slug: string) {
  const res = await apiClient.get<{ success: true; data: Job }>(
    API_ENDPOINTS.JOBS.DETAIL(slug),
  );
  return res.data.data;
}

export async function getAdminJobs() {
  const res = await apiClient.get<{ success: true; data: Job[] }>(
    API_ENDPOINTS.JOBS.ADMIN_LIST,
  );
  return res.data.data;
}

export async function createJob(payload: Partial<Job>) {
  const res = await apiClient.post<{ success: true; data: Job }>(
    API_ENDPOINTS.JOBS.ADMIN_BASE,
    payload,
  );
  return res.data.data;
}

export async function updateJob(id: string, payload: Partial<Job>) {
  const res = await apiClient.patch<{ success: true; data: Job }>(
    API_ENDPOINTS.JOBS.ADMIN_DETAIL(id),
    payload,
  );
  return res.data.data;
}

export async function deleteJob(id: string) {
  await apiClient.delete(API_ENDPOINTS.JOBS.ADMIN_DETAIL(id));
}

export async function publishJob(id: string) {
  const res = await apiClient.post<{ success: true; data: Job }>(
    API_ENDPOINTS.JOBS.PUBLISH(id),
    {},
  );
  return res.data.data;
}

export async function unpublishJob(id: string) {
  const res = await apiClient.post<{ success: true; data: Job }>(
    API_ENDPOINTS.JOBS.UNPUBLISH(id),
    {},
  );
  return res.data.data;
}

export async function updateJobAssessment(id: string, payload: { title?: string, questions: any[] }) {
  const res = await apiClient.patch<{ success: true; data: any }>(
    API_ENDPOINTS.ASSESSMENTS.UPDATE(id),
    payload,
  );
  return res.data.data;
}

export async function createJobAssessment(jobId: string, payload: { title: string, questions: any[] }) {
  const res = await apiClient.post<{ success: true; data: any }>(
    API_ENDPOINTS.JOBS.ASSESSMENTS(jobId),
    payload,
  );
  return res.data.data;
}
