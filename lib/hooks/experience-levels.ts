import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExperienceLevels,
  createExperienceLevel,
  deleteExperienceLevel,
  updateExperienceLevel,
} from "@/lib/services/experience-levels";
import type { ExperienceLevel } from "@/lib/api/types";

export function useExperienceLevelsQuery() {
  return useQuery({
    queryKey: ["experience-levels"],
    queryFn: getExperienceLevels,
  });
}

export function useCreateExperienceLevelMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) => createExperienceLevel(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experience-levels"] }),
  });
}

export function useDeleteExperienceLevelMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteExperienceLevel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experience-levels"] }),
  });
}

export function useUpdateExperienceLevelMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) =>
      updateExperienceLevel(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experience-levels"] }),
  });
}
