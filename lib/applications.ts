export type ApplicationStatus = "draft" | "assessment_pending" | "assessment_completed" | "submitted";

export type Application = {
  id: string;
  jobSlug: string;
  createdAt: number;
  resumeSource: "profile" | "pdf";
  assessment?: {
    score: number;
    total: number;
    answers: Record<string, string>;
  };
  status: ApplicationStatus;
};

const key = "qh_applications_v1";

const loadAll = (): Application[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as Application[];
  } catch {
    return [];
  }
};

const saveAll = (apps: Application[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(apps));
};

export const createApplication = (jobSlug: string, resumeSource: "profile" | "pdf") => {
  const apps = loadAll();
  const id = `${jobSlug}-${Date.now()}`;
  const app: Application = {
    id,
    jobSlug,
    createdAt: Date.now(),
    resumeSource,
    status: "assessment_pending",
  };
  apps.unshift(app);
  saveAll(apps);
  return app;
};

export const getApplication = (id: string): Application | null => {
  const apps = loadAll();
  return apps.find((a) => a.id === id) || null;
};

export const updateApplication = (id: string, patch: Partial<Application>) => {
  const apps = loadAll();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const updated = { ...apps[idx], ...patch };
  apps[idx] = updated;
  saveAll(apps);
  return updated as Application;
};

export const listApplications = () => loadAll();
