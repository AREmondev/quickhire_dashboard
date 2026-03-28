# QuickHire Backend Specification (Jobs, Applications, Admin)

Purpose: a complete, implementation-ready blueprint to build the backend for this project. Aligned with the current frontend data shapes and flows in:

- Jobs list and detail: see lib/jobs.ts
- Applications and statuses: see lib/applications.ts and pages under /app/applications and /app/jobs/[slug]/\*
- Candidate profile and resume: see lib/profile.ts and /app/profile, /app/resume

You can implement with any stack. A recommended stack is TypeScript + Node (NestJS/Express/Fastify) + PostgreSQL + Prisma, but the spec remains framework-agnostic.

## Architecture & Conventions

- Base URL: /api/v1
- JSON only; UTF‑8; camelCase fields
- Auth: JWT access (short‑lived) + refresh token (httpOnly)
- RBAC: candidate, employer, admin
- Multi-tenant: jobs belong to a company; employers belong to one company
- Pagination: page, pageSize (default 20, max 100); total, pageCount in response
- Filtering: query params; arrays via repeated keys (?category=Design&category=Engineering)
- Sorting: sort=<field>:<asc|desc>, support multiple comma-separated fields
- Timestamps: ISO8601 in UTC
- IDs: UUIDv4 everywhere, except human slugs for jobs
- Errors: consistent envelope
  - 400–422: validation domain errors
  - 401: auth required, 403: forbidden
  - 404: not found, 409: conflict, 429: rate limit

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid payload",
    "details": [{ "path": "email", "message": "Invalid email" }]
  }
}
```

## Core Data Model (Relational)

Notation: (PK) primary key, (FK) foreign key, types are for PostgreSQL; adapt as needed.

Users & Auth

- users (id uuid PK, email text unique, password_hash text, name text, role text enum['candidate','employer','admin'], company_id uuid FK companies.id nullable, email_verified_at timestamptz null, created_at timestamptz, updated_at timestamptz)
- refresh_tokens (id uuid PK, user_id uuid FK users.id, token_hash text unique, expires_at timestamptz, created_at timestamptz, revoked_at timestamptz null)
- permissions (optional extension if you need finer grain; RBAC below uses role enum for simplicity)

Companies

- companies (id uuid PK, name text, logo_url text, website text, location text, description text, created_at, updated_at)

Taxonomy

- categories (id uuid PK, name text unique, slug text unique, color text null)

Jobs

- jobs (id uuid PK, company_id uuid FK companies.id, slug text unique, title text, jobType text enum['Full Time','Part Time','Remote','Contract','Internship'], experienceLevel text enum['Entry Level','Mid Level','Senior','Lead','Director'], location text, is_remote boolean, salary_min int, salary_max int, salary_currency char(3), description text, responsibilities text[] , requirements text[] , benefits text[] , deadline date null, is_featured boolean default false, posted_at timestamptz, updated_at timestamptz)
- job_categories (job_id uuid FK jobs.id, category_id uuid FK categories.id, PRIMARY KEY(job_id, category_id))

Candidate Profile & Resume

- profiles (id uuid PK, user_id uuid FK users.id unique, title text, email text, phone text, location text, website text, github text, linkedin text, portfolio text, summary text, skills text[], technical_skills text[], tools text[], created_at, updated_at)
- experiences (id uuid PK, profile_id uuid FK profiles.id, company text, role text, location text, start_date date, end_date date null, bullets text[])
- education (id uuid PK, profile_id uuid FK profiles.id, institution text, degree text, start_date date, end_date date null, details text)
- projects (id uuid PK, profile_id uuid FK profiles.id, name text, link text, description text, tech text[])
- resumes (id uuid PK, user_id uuid FK users.id, storage_key text unique, url text, original_filename text, mime_type text, size_bytes int, uploaded_at timestamptz)

Applications & Pipeline

- applications (id uuid PK, job_id uuid FK jobs.id, user_id uuid FK users.id, resume_source text enum['profile','pdf'], resume_id uuid FK resumes.id null, profile_snapshot jsonb, status text enum['draft','assessment_pending','assessment_completed','submitted','under_review','interview','offer','hired','rejected'] default 'assessment_pending', score numeric null, created_at timestamptz, updated_at timestamptz)
- application_events (id uuid PK, application_id uuid FK applications.id, actor_id uuid FK users.id, type text enum['status_change','note','email','file','stage_change'], data jsonb, created_at timestamptz)
- application_notes (id uuid PK, application_id uuid FK applications.id, author_id uuid FK users.id, body text, created_at timestamptz)

Assessments

- assessment_questions (id uuid PK, job_id uuid FK jobs.id, type text enum['mcq','text','code'], prompt text, options jsonb null, answer jsonb null, min_words int null, language text null, starter text null, created_at timestamptz)
- assessment_submissions (id uuid PK, application_id uuid FK applications.id, started_at timestamptz, submitted_at timestamptz null, score numeric null, total int, created_at timestamptz)
- assessment_answers (id uuid PK, submission_id uuid FK assessment_submissions.id, question_id uuid FK assessment_questions.id, answer jsonb, is_correct boolean null)

Interviews & Offers (optional but recommended)

- interviews (id uuid PK, application_id uuid FK applications.id, scheduled_at timestamptz, mode text enum['onsite','video','phone'], location text null, link text null, notes text)
- offers (id uuid PK, application_id uuid FK applications.id, amount int, currency char(3), start_date date, status text enum['draft','sent','accepted','declined','withdrawn'], created_at timestamptz, updated_at timestamptz)

Indices & Constraints

- Unique: users.email, jobs.slug, categories.slug
- Index: applications(job_id, status), jobs(company_id, is_featured), assessment_questions(job_id)
- FK on delete cascades for child collections (experiences, education, projects); restrict or cascade for applications when job is deleted (business choice; commonly restrict if apps exist)

## TypeScript Types (Reference)

These mirror frontend shapes ([jobs.ts](file:///Users/emon/Desktop/qtec/lib/jobs.ts), [applications.ts](file:///Users/emon/Desktop/qtec/lib/applications.ts), [profile.ts](file:///Users/emon/Desktop/qtec/lib/profile.ts), [assessments.ts](file:///Users/emon/Desktop/qtec/lib/assessments.ts)) and can be used in SDKs:

```ts
type Role = "candidate" | "employer" | "admin";

type JobType = "Full Time" | "Part Time" | "Remote" | "Contract" | "Internship";
type ExperienceLevel =
  | "Entry Level"
  | "Mid Level"
  | "Senior"
  | "Lead"
  | "Director";

type Job = {
  id: string;
  slug: string;
  companyId: string;
  title: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  location: string;
  isRemote: boolean;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: "USD" | "EUR" | string;
  categories: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  deadline?: string; // ISO
  isFeatured: boolean;
  postedAt: string;
};

type ApplicationStatus =
  | "draft"
  | "assessment_pending"
  | "assessment_completed"
  | "submitted"
  | "under_review"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

type Application = {
  id: string;
  jobId: string;
  userId: string;
  createdAt: string;
  status: ApplicationStatus;
  resumeSource: "profile" | "pdf";
  resumeId?: string;
  profileSnapshot?: unknown;
  assessment?: {
    score: number;
    total: number;
    answers: Record<string, string>;
  };
};
```

## RBAC Model

- candidate: can browse jobs; create applications for any published job; view and manage own applications; manage own profile and resumes
- employer: scoped to their company; can create/update/publish/unpublish jobs for their company; view candidates who applied to their jobs; move candidates across stages; add notes; schedule interviews; cannot access other companies
- admin: full access; manage companies, users, jobs, applications; override any status

Access Matrix (selected):

- Public: GET /jobs, GET /jobs/:slug
- Candidate (auth): POST /jobs/:id/applications, GET/PUT /me, GET /applications (own), GET /applications/:id (own), assessment submission
- Employer (auth): GET /admin/jobs (own company), CRUD /admin/jobs, GET /admin/jobs/:id/applications, PATCH /admin/applications/:id/status, POST notes, schedule interviews
- Admin (auth): same as employer across all companies + manage users/companies

## REST API Surface

Auth

- POST /auth/register { email, password, name, role? } → 201 { user, tokens }
- POST /auth/login { email, password } → 200 { user, tokens }
- POST /auth/refresh { refreshToken } → 200 { accessToken, refreshToken }
- POST /auth/logout { refreshToken } → 204
- POST /auth/verify-email { token } → 204
- POST /auth/request-password-reset { email } → 204
- POST /auth/reset-password { token, password } → 204

Me & Profile

- GET /me → { id, email, name, role, companyId }
- PUT /me { name, ... } → updated
- GET /profiles/me → Profile
- PUT /profiles/me → Profile
- POST /profiles/me/resume (multipart) → { resumeId, url }
- DELETE /profiles/me/resume/:id → 204

Companies (admin)

- GET /admin/companies
- POST /admin/companies
- GET /admin/companies/:id
- PATCH /admin/companies/:id
- DELETE /admin/companies/:id

Categories (admin)

- GET /admin/categories
- POST /admin/categories
- DELETE /admin/categories/:id

Jobs

- GET /jobs?query=&location=&type=&experience=&category=&remote=&featured=&salaryMin=&salaryMax=&sort= → { items, page, pageSize, total, pageCount }
- GET /jobs/:slug → Job detail (include company)

Jobs (employer/admin)

- GET /admin/jobs?companyId= → list
- POST /admin/jobs { title, slug?, jobType, experienceLevel, location, isRemote, salaryMin, salaryMax, salaryCurrency, description, responsibilities[], requirements[], benefits[], categoryIds[], deadline } → 201 Job
- PATCH /admin/jobs/:id {...fields} → Job
- POST /admin/jobs/:id/publish → 200
- POST /admin/jobs/:id/unpublish → 200
- PUT /admin/jobs/:id/assessments { questions: AssessmentQuestion[] } → saved set

Applications (candidate)

- POST /jobs/:id/applications { resumeSource: 'profile'|'pdf', resumeId? } → 201 Application (status: assessment_pending)
- GET /applications → own applications
- GET /applications/:id → own application detail
- POST /applications/:id/submit → 200 Application (status → submitted; locks payload)

Assessments

- GET /jobs/:id/assessments → AssessmentQuestion[] (public read if job published)
- POST /applications/:id/assessment/start → 201 submission { submissionId, total }
- POST /applications/:id/assessment/answers { submissionId, answers: { [questionId]: string } } → 200
- POST /applications/:id/assessment/submit { submissionId } → 200 { score, total } and application.status → assessment_completed

Applications (employer/admin)

- GET /admin/jobs/:id/applications?status=&q=&sort= → list with candidate profile summary, scores
- GET /admin/applications/:id → detail with timeline, notes
- PATCH /admin/applications/:id/status { status } → 200 (allowed transitions enforced)
- POST /admin/applications/:id/notes { body } → 201
- POST /admin/applications/:id/interviews { scheduledAt, mode, link?, location?, notes? } → 201
- POST /admin/applications/:id/decision { decision: 'rejected'|'offer'|'hired', reason? } → 200

### Validation & Business Rules

- Unique: users.email, jobs.slug
- Job salary: salaryMin ≤ salaryMax
- Assessment submission: can only submit once; must include answers to required questions
- Application transitions (example guardrails):
  - assessment_pending → assessment_completed (after assessment submit)
  - assessment_completed → submitted (candidate explicit submit)
  - submitted → under_review (employer), → rejected, → interview
  - interview → offer | rejected
  - offer → hired | rejected
- Employer/company scoping: employer can only access resources where jobs.company_id = employer.company_id

### Example Payloads

Create Job (employer/admin)

```json
{
  "title": "Senior Frontend Engineer",
  "slug": "senior-frontend-engineer",
  "jobType": "Full Time",
  "experienceLevel": "Senior",
  "location": "Dublin, Ireland",
  "isRemote": false,
  "salaryMin": 120000,
  "salaryMax": 160000,
  "salaryCurrency": "EUR",
  "description": "Build and maintain core frontend infrastructure...",
  "responsibilities": ["Build and maintain...", "Mentor engineers"],
  "requirements": ["5+ years React/TypeScript", "Design systems experience"],
  "benefits": ["Remote Friendly", "Health Insurance"],
  "categoryIds": ["<uuid1>", "<uuid2>"],
  "deadline": "2026-05-12"
}
```

Assessment Questions (aligns with lib/assessments.ts)

```json
{
  "questions": [
    {
      "type": "mcq",
      "prompt": "Which hook manages local state in React?",
      "options": ["useRef", "useEffect", "useState"],
      "answer": "useState"
    },
    {
      "type": "text",
      "prompt": "Describe a challenging UI/UX problem you solved.",
      "min_words": 20
    },
    {
      "type": "code",
      "prompt": "Implement uniq(nums: number[]): number[]",
      "language": "ts",
      "starter": "function uniq(nums: number[]){ }"
    }
  ]
}
```

## Admin Dashboard Flows

Job Posting

- Create job draft → attach categories → configure assessment → publish/unpublish
- Edit job fields anytime; editing published jobs logs an event

Candidate Pipeline

- Ingest applications (auto-created when candidate starts apply)
- View by stage, score, assessment completion, search by name/email
- Open application: timeline (events), profile snapshot, resume file link, assessment result
- Actions: move stage, add notes, schedule interview, send email, record decision (rejected / offer / hired)
- Bulk actions: move stage, reject with reason, export CSV
- Audit log: every status change and note creates an application_events row

Notifications & Emails (optional)

- Email candidate on stage changes (submitted, interview scheduled, decision)
- Email employer when new application is submitted

Webhooks (optional)

- Outbound events: job.published, application.submitted, application.status_changed
- Each includes resource IDs and minimal payload; signed with HMAC secret

Background Jobs

- Resume file scan, attachment processing
- Deadline monitor: mark jobs expired and stop accepting new applications
- Email dispatch; webhook retries with exponential backoff

Security & Compliance

- Passwords: Argon2id or bcrypt, pepper + per-user salt
- JWT: short (15m) access; 7–30d refresh; rotate on refresh
- CORS allowlist for frontend; CSRF not needed for pure token APIs
- Input validation with Zod/Valibot/Joi; output filtering to avoid leaking secrets
- Rate limiting: login/password reset endpoints stricter limits
- PII: encrypt at rest optional for resumes and profile contact info

## Implementation Checklist

- [ ] Database migrations for all entities and enums
- [ ] Seed categories and an admin user
- [ ] Auth module (register/login/refresh/logout)
- [ ] RBAC guards and company scoping middleware
- [ ] Jobs CRUD + publish toggle + assessments management
- [ ] Candidate profile + resume upload (S3-compatible) + snapshotting at application time
- [ ] Applications creation + status transitions + notes + interviews + decisions
- [ ] Assessment engine (MCQ auto-score; text/code optional manual score or 3rd-party)
- [ ] List endpoints with pagination/filtering/sorting
- [ ] Email service and background job runner
- [ ] Observability: request logs, audit logs, metrics

## Frontend Alignment Notes

- job fields map one-to-one from lib/jobs.ts (title, jobType, experienceLevel, location, salary range/currency, is_remote, is_featured, categories[])
- application statuses must include "assessment_pending", "assessment_completed", "submitted" used by UI timelines; extend with "under_review", "interview", "offer", "hired", "rejected" for admin pipeline
- assessment question shapes match lib/assessments.ts
- profile structure matches lib/profile.ts; application.profile_snapshot can store a JSON snapshot for audit consistency

## Testing Strategy

- Unit: validators, RBAC guards, status transition rules
- Integration: full lifecycle—register → create job → apply → assessment → submit → move stages → decision
- Contract: JSON schemas for request/response; publish typed client for frontend
- E2E (optional): spin up ephemeral DB; seed; run API flows

---

This spec is designed so you can implement the backend end‑to‑end and plug it into the existing frontend without changing current data shapes. Adjust enumerations and optional fields to match your chosen tech and regional requirements.
