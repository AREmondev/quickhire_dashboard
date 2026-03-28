import type { ExperienceLevel } from "@/lib/api/types";
import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function getExperienceLevels(): Promise<ExperienceLevel[]> {
  const res = await apiClient.get<{ success: true; data: ExperienceLevel[] }>(
    API_ENDPOINTS.ADMIN.EXPERIENCELEVELS,
  );
  return res.data.data;
}

export async function createExperienceLevel(data: {
  name: string;
}): Promise<ExperienceLevel> {
  const res = await apiClient.post<{ success: true; data: ExperienceLevel }>(
    API_ENDPOINTS.ADMIN.EXPERIENCELEVELS,
    data,
  );
  return res.data.data;
}

export async function deleteExperienceLevel(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.ADMIN.EXPERIENCELEVEL_DETAIL(id));
}

export async function updateExperienceLevel(
  id: string,
  data: { name: string },
): Promise<ExperienceLevel> {
  const res = await apiClient.patch<{ success: true; data: ExperienceLevel }>(
    API_ENDPOINTS.ADMIN.EXPERIENCELEVEL_DETAIL(id),
    data,
  );
  return res.data.data;
}
