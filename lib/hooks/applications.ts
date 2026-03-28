import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCandidateApplications,
  getCandidateApplication,
  submitCandidateApplication,
  createApplicationForJob,
  getJobApplications,
  getApplicationAnswers,
  updateApplicationStatus,
} from "@/lib/services/applications";
import type { Application } from "@/lib/api/types";

export function useJobApplicationsQuery(jobId: string) {
  return useQuery({
    queryKey: ["applications", "job", jobId],
    queryFn: () => getJobApplications(jobId),
    enabled: !!jobId,
  });
}

export function useApplicationAnswersQuery(id: string) {
  return useQuery({
    queryKey: ["applications", "answers", id],
    queryFn: () => getApplicationAnswers(id),
    enabled: !!id,
  });
}

export function useUpdateApplicationStatusMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => updateApplicationStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useCandidateApplicationsQuery() {
  return useQuery({
    queryKey: ["applications", "candidate"],
    queryFn: getCandidateApplications,
  });
}

export function useCandidateApplicationQuery(id: string) {
  return useQuery({
    queryKey: ["applications", "candidate", id],
    queryFn: () => getCandidateApplication(id),
    enabled: !!id,
  });
}

export function useSubmitApplicationMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => submitCandidateApplication(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications", "candidate"] });
      qc.invalidateQueries({ queryKey: ["applications", "candidate", id] });
    },
  });
}

export function useCreateApplicationMutation(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      resumeSource: "profile" | "pdf";
      resumeId?: string | null;
    }) => createApplicationForJob(jobId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications", "candidate"] });
    },
  });
}
