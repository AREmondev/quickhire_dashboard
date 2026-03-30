export type Role = "candidate" | "employer" | "admin";

export interface JobType {
  _id: string;
  name: string;
  slug: string;
}

export interface ExperienceLevel {
  _id: string;
  name: string;
  slug: string;
}

export type ApplicationStatus =
  | "draft"
  | "assessment_pending"
  | "assessment_completed"
  | "submitted"
  | "under_review"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  companyId?: string;
  createdAt?: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  location?: string;
  description?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface AssessmentQuestion {
  id?: string;
  questionText: string;
  questionType:
    | "multiple-choice"
    | "short-answer"
    | "true-false"
    | "problem-solve";
  options?: string[];
  correctAnswer?: string;
}

export interface JobAssessment {
  id?: string;
  title: string;
  questions: AssessmentQuestion[];
}

export interface Job {
  id: string;
  slug: string;
  companyId: string;
  title: string;
  jobType: {
    id: string;
    name: string;
    slug: string;
  };
  experienceLevel: {
    id: string;
    name: string;
    slug: string;
  };
  location: string;
  isRemote: boolean;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  categoryIds: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  deadline?: string;
  isFeatured: boolean;
  isPublished?: boolean;
  postedAt?: string;
  updatedAt?: string;
  assessment?: JobAssessment;
  company?: Pick<Company, "id" | "name" | "logoUrl" | "website" | "location">;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  createdAt: string;
  status: ApplicationStatus;
  resumeSource: "profile" | "pdf";
  resumeId?: string;
  score?: number;
  answers?: AssessmentAnswer[];
  job?: Partial<Job>;
  user?: Partial<User>;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  user: User;
  tokens: AuthTokens;
}
