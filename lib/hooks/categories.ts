import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/services/categories";
import type { Category } from "@/lib/api/types";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useCreateCategoryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; color?: string }) =>
      createCategory(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategoryMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategoryMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; color?: string }) =>
      updateCategory(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
