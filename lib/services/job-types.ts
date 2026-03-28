import type { JobType } from "@/lib/api/types";
import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function getJobTypes(): Promise<JobType[]> {
  const res = await apiClient.get<{ success: true; data: JobType[] }>(
    API_ENDPOINTS.ADMIN.JOBTYPES,
  );
  return res.data.data;
}

export async function createJobType(data: { name: string }): Promise<JobType> {
  const res = await apiClient.post<{ success: true; data: JobType }>(
    API_ENDPOINTS.ADMIN.JOBTYPES,
    data,
  );
  return res.data.data;
}

export async function deleteJobType(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.ADMIN.JOBTYPE_DETAIL(id));
}

export async function updateJobType(
  id: string,
  data: { name: string },
): Promise<JobType> {
  const res = await apiClient.patch<{ success: true; data: JobType }>(
    API_ENDPOINTS.ADMIN.JOBTYPE_DETAIL(id),
    data,
  );
  return res.data.data;
}
