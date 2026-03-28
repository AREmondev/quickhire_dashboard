export type Experience = {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type Education = {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  details?: string;
};

export type Project = {
  name: string;
  link?: string;
  description: string;
  tech: string[];
};

export type Profile = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  summary: string;
  skills: string[];
  technicalSkills?: string[];
  tools?: string[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
};

const key = "qh_profile_v1";

export const defaultProfile: Profile = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  github: "",
  linkedin: "",
  portfolio: "",
  summary: "",
  skills: [],
  technicalSkills: [],
  tools: [],
  experiences: [],
  education: [],
  projects: [],
};

export const loadProfile = (): Profile => {
  if (typeof window === "undefined") return defaultProfile;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw) as Profile;
    return { ...defaultProfile, ...parsed };
  } catch {
    return defaultProfile;
  }
};

export const saveProfile = (p: Profile) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(p));
};
