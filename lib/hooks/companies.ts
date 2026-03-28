import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "@/lib/services/companies";
import type { Company } from "@/lib/api/types";

export function useCompaniesQuery() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });
}

export function useCreateCompanyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      name: string;
      website?: string | null;
      location?: string | null;
      description?: string | null;
      logo?: File | Blob | null;
    }) => createCompany(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useUpdateCompanyMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      name?: string;
      website?: string | null;
      location?: string | null;
      description?: string | null;
      logo?: File | Blob | null;
    }) => updateCompany(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useDeleteCompanyMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteCompany(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}
