import type { Category } from "@/lib/api/types";
import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function getCategories(): Promise<Category[]> {
  const res = await apiClient.get<{ success: true; data: Category[] }>(
    API_ENDPOINTS.ADMIN.CATEGORIES,
  );
  return res.data.data;
}

export async function createCategory(data: {
  name: string;
  color?: string;
}): Promise<Category> {
  const res = await apiClient.post<{ success: true; data: Category }>(
    API_ENDPOINTS.ADMIN.CATEGORIES,
    data,
  );
  return res.data.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.ADMIN.CATEGORY_DETAIL(id));
}

export async function updateCategory(
  id: string,
  data: { name: string; color?: string },
): Promise<Category> {
  const res = await apiClient.patch<{ success: true; data: Category }>(
    API_ENDPOINTS.ADMIN.CATEGORY_DETAIL(id),
    data,
  );
  return res.data.data;
}
