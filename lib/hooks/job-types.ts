import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getJobTypes,
  createJobType,
  deleteJobType,
  updateJobType,
} from "@/lib/services/job-types";
import type { JobType } from "@/lib/api/types";

export function useJobTypesQuery() {
  return useQuery({
    queryKey: ["job-types"],
    queryFn: getJobTypes,
  });
}

export function useCreateJobTypeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) => createJobType(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job-types"] }),
  });
}

export function useDeleteJobTypeMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteJobType(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job-types"] }),
  });
}

export function useUpdateJobTypeMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) => updateJobType(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job-types"] }),
  });
}
