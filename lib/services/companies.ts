import type { Company } from "@/lib/api/types";
import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function getCompanies(): Promise<Company[]> {
  const res = await apiClient.get<{ success: true; data: Company[] }>(
    API_ENDPOINTS.ADMIN.COMPANIES,
  );
  return res.data.data;
}

export async function createCompany(data: {
  name: string;
  website?: string | null;
  location?: string | null;
  description?: string | null;
  logo?: File | Blob | null;
}): Promise<Company> {
  console.log("data", data);
  const form = new FormData();
  form.append("name", data.name);
  if (data.website) form.append("website", data.website);
  if (data.location) form.append("location", data.location);
  if (data.description) form.append("description", data.description);
  if (data.logo) form.append("logo", data.logo);
  const res = await apiClient.post<{ success: true; data: Company }>(
    API_ENDPOINTS.ADMIN.COMPANIES,
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data.data;
}

export async function updateCompany(
  id: string,
  data: {
    name?: string;
    website?: string | null;
    location?: string | null;
    description?: string | null;
    logo?: File | Blob | null;
  },
): Promise<Company> {
  const form = new FormData();
  if (data.name !== undefined) form.append("name", data.name);
  if (data.website !== undefined && data.website !== null)
    form.append("website", data.website);
  if (data.location !== undefined && data.location !== null)
    form.append("location", data.location);
  if (data.description !== undefined && data.description !== null)
    form.append("description", data.description);
  if (data.logo) form.append("file", data.logo);
  const res = await apiClient.patch<{ success: true; data: Company }>(
    API_ENDPOINTS.ADMIN.COMPANY_DETAIL(id),
    form,
  );
  return res.data.data;
}

export async function deleteCompany(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.ADMIN.COMPANY_DETAIL(id));
}
