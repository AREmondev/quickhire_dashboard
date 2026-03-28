import type { Application } from "@/lib/api/types";
import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function getCandidateApplications(): Promise<Application[]> {
  const res = await apiClient.get<{ success: true; data: Application[] }>(
    API_ENDPOINTS.APPLICATIONS.BASE,
  );
  return res.data.data;
}

export async function getCandidateApplication(id: string): Promise<Application> {
  const res = await apiClient.get<{ success: true; data: Application }>(
    API_ENDPOINTS.APPLICATIONS.DETAIL(id),
  );
  return res.data.data;
}

export async function submitCandidateApplication(id: string): Promise<Application> {
  const res = await apiClient.post<{ success: true; data: Application }>(
    API_ENDPOINTS.APPLICATIONS.SUBMIT(id),
    {},
  );
  return res.data.data;
}

export async function createApplicationForJob(
  jobId: string,
  payload: { resumeSource: "profile" | "pdf"; resumeId?: string | null },
): Promise<Application> {
  const res = await apiClient.post<{ success: true; data: Application }>(
    API_ENDPOINTS.JOBS.APPLICATIONS(jobId),
    payload,
  );
  return res.data.data;
}

export async function getJobApplications(jobId: string): Promise<Application[]> {
  const res = await apiClient.get<{ success: true; data: Application[] }>(
    API_ENDPOINTS.JOBS.APPLICATIONS(jobId),
  );
  return res.data.data;
}

export async function getApplicationAnswers(id: string): Promise<any> {
  const res = await apiClient.get<{ success: true; data: any }>(
    API_ENDPOINTS.APPLICATIONS.ANSWERS(id),
  );
  return res.data.data;
}

export async function updateApplicationStatus(
  id: string,
  status: string,
): Promise<Application> {
  const res = await apiClient.patch<{ success: true; data: Application }>(
    API_ENDPOINTS.APPLICATIONS.STATUS(id),
    { status },
  );
  return res.data.data;
}
