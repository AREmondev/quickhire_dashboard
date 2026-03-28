# QuickHire Backend API

This document describes all available API routes, authentication, request/response envelopes, validation rules, and data schemas for this project.

## Base URLs

- Legacy (public + admin header): `/api`
- v1 (JWT + RBAC; camelCase payloads): `/api/v1`

## Authentication (v1)

- Access token (short‑lived) and refresh token (rotated).
- Header: `Authorization: Bearer <accessToken>`
- Roles: `candidate`, `employer`, `admin`
- Employer endpoints are scoped to their `companyId`.

Tokens are issued by the auth endpoints below. Refresh tokens are stored as hashes in the database and rotated on refresh.

## Response Envelopes

- Success:
  ```json
  { "success": true, "data": {} }
  ```
- Error:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid payload",
      "details": [{ "path": "field", "message": "reason" }]
    }
  }
  ```

## Pagination

- v1: `page`, `pageSize` → returns `total`, `pageCount`
- Legacy jobs: `page`, `limit` → returns `total`, `page_count`

## Data Types (v1)

TypeScript-like definitions to communicate field names and types.

```ts
type Role = "candidate" | "employer" | "admin";

type User = {
  id: string; // ObjectId
  email: string;
  name: string;
  role: Role;
  companyId?: string; // ObjectId
};

type JobType = "Full Time" | "Part Time" | "Remote" | "Contract" | "Internship";
type ExperienceLevel =
  | "Entry Level"
  | "Mid Level"
  | "Senior"
  | "Lead"
  | "Director";

type Job = {
  id: string; // ObjectId
  slug: string;
  companyId: string; // ObjectId
  title: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  location: string;
  isRemote: boolean;
  salaryMin: number; // int; salaryMin ≤ salaryMax
  salaryMax: number; // int
  salaryCurrency: string; // 3-letter code (e.g., "USD", "EUR")
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  categoryIds: string[]; // ObjectIds
  deadline?: string; // ISO
  isFeatured: boolean;
  postedAt?: string; // ISO (when published)
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
  id: string; // ObjectId
  jobId: string; // ObjectId
  userId: string; // ObjectId
  createdAt: string; // ISO
  updatedAt: string; // ISO
  status: ApplicationStatus;
  resumeSource: "profile" | "pdf";
  resumeId?: string; // ObjectId
  score?: number | null;
};

type Company = {
  id: string; // ObjectId
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  location?: string | null;
  description?: string | null;
};

type Category = {
  id: string; // ObjectId
  name: string;
  slug: string;
  color?: string | null;
};
```

## Validation Highlights

- All inputs trimmed; unknown fields rejected (strict).
- `salaryMin` ≤ `salaryMax`.
- IDs are MongoDB ObjectId strings.
- Uploads accept `image/*` only; max size 5MB.

## v1 API Routes

### Auth

- POST `/api/v1/auth/register`
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "Passw0rd!",
      "name": "User",
      "role": "candidate",
      "companyId": "<ObjectId?>"
    }
    ```
  - 201 → `{ user: User, tokens: { accessToken, refreshToken } }`

- POST `/api/v1/auth/login`
  - Body:
    ```json
    { "email": "user@example.com", "password": "Passw0rd!" }
    ```
  - 200 → `{ user: User, tokens: { accessToken, refreshToken } }`

- POST `/api/v1/auth/refresh`
  - Body:
    ```json
    { "refreshToken": "..." }
    ```
  - 200 → `{ accessToken, refreshToken }`

- POST `/api/v1/auth/logout`
  - Body:
    ```json
    { "refreshToken": "..." }
    ```
  - 204

- GET `/api/v1/me` (auth: any role)
  - 200 → `{ id, email, name, role, companyId }`

### Jobs (Public)

- GET `/api/v1/jobs`
  - Query (optional):
    - `page` (int, default 1), `pageSize` (int, default 20)
    - `query` (string; full-text), `location` (string)
    - `type` (`JobType`), `experience` (`ExperienceLevel`)
    - `category` (repeatable; category slugs or ids)
    - `remote` (boolean), `featured` (boolean)
    - `salaryMin` (int), `salaryMax` (int)
    - `sort` (e.g., `posted_at:desc,created_at:desc`)
  - 200 → `{ items: Job[], page, pageSize, total, pageCount }`

- GET `/api/v1/jobs/:slug`
  - 200 → `Job` detail including company summary.

### Jobs (Employer/Admin)

- GET `/api/v1/jobs/admin/list` (auth: employer/admin)
  - 200 → `[{ id, slug, title, isPublished, updatedAt }]`

- POST `/api/v1/jobs/admin` (auth: employer/admin)
  - Body:
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
      "requirements": ["5+ years React/TypeScript"],
      "benefits": ["Health Insurance"],
      "categoryIds": [],
      "deadline": "2026-05-12T00:00:00.000Z",
      "isFeatured": true
    }
    ```
  - 201 → `Job` (not published by default)

- PATCH `/api/v1/jobs/admin/:id` (auth: employer/admin)
  - Body: any subset of creation fields (same names); `salaryMin ≤ salaryMax` if both provided.
  - 200 → updated `Job`

- POST `/api/v1/jobs/admin/:id/publish` (auth: employer/admin)
  - 200 → `Job` (published; postedAt set)

- POST `/api/v1/jobs/admin/:id/unpublish` (auth: employer/admin)
  - 200 → `Job` (unpublished)

### Applications (Candidate)

- POST `/api/v1/jobs/:id/applications` (auth: candidate)
  - Body:
    ```json
    { "resumeSource": "profile", "resumeId": "<ObjectId?>" }
    ```
  - 201 → `Application` (status: `assessment_pending`)

- GET `/api/v1/applications` (auth: candidate)
  - 200 → `Application[]`

- GET `/api/v1/applications/:id` (auth: candidate; own)
  - 200 → `Application`

- POST `/api/v1/applications/:id/submit` (auth: candidate; own)
  - Requires current status `assessment_completed`.
  - 200 → `Application` with status `submitted`

### Admin: Companies

- GET `/api/v1/admin/companies` (auth: admin)
  - 200 → `Company[]`

- POST `/api/v1/admin/companies` (auth: admin)
  - Content-Type: `multipart/form-data`
  - Fields:
    - `name` (text, required)
    - `website` (text URL, optional)
    - `location` (text, optional)
    - `description` (text, optional)
    - `logo` (file, image/\*, optional)
  - 201 → `Company` (logoUrl set if `logo` provided)

- GET `/api/v1/admin/companies/:id` (auth: admin)
  - 200 → `Company`

- PATCH `/api/v1/admin/companies/:id` (auth: admin)
  - Content-Type: `multipart/form-data`
  - Any subset of: `name`, `website`, `location`, `description`, `logo` (image/\*)
  - 200 → updated `Company`

- DELETE `/api/v1/admin/companies/:id` (auth: admin)
  - 204

### Admin: Categories

- GET `/api/v1/admin/categories` (auth: admin)
  - 200 → `Category[]`

- POST `/api/v1/admin/categories` (auth: admin)
  - Body:
    ```json
    { "name": "Engineering", "slug": "engineering", "color": "#1f77b4" }
    ```
  - 201 → `Category`

- DELETE `/api/v1/admin/categories/:id` (auth: admin)
  - 204

### Admin: Experience Levels

- GET `/api/v1/admin/experience-levels` (auth: admin)
  - 200 → `ExperienceLevel[]`

- POST `/api/v1/admin/experience-levels` (auth: admin)
  - Body:
    ```json
    { "name": "Entry Level" }
    ```
  - 201 → `ExperienceLevel`

- DELETE `/api/v1/admin/experience-levels/:id` (auth: admin)
  - 204

### Admin: Job Types

- GET `/api/v1/admin/job-types` (auth: admin)
  - 200 → `JobType[]`

- POST `/api/v1/admin/job-types` (auth: admin)
  - Body:
    ```json
    { "name": "Full Time" }
    ```
  - 201 → `JobType`

- DELETE `/api/v1/admin/job-types/:id` (auth: admin)
  - 204

### Uploads

- POST `/api/v1/uploads/images` (auth: admin|employer|candidate)
  - Content-Type: `multipart/form-data`
  - File field: `file` (image/\*, max 5MB)
  - Query: `folder` (optional; Cloudinary grouping)
  - 201 → `{ url: string, storageKey: string }`

Provider is selected via environment:

- Local: `UPLOAD_PROVIDER=local` (default). Files saved to `UPLOAD_DIR` and served at `/uploads`.
- Cloudinary: `UPLOAD_PROVIDER=cloudinary` plus `CLOUDINARY_*` vars.

## Legacy API (snake_case)

### Health

- GET `/api/health` → `{ success: true, data: { status: "ok" } }`

### Jobs (legacy)

- GET `/api/jobs`
  - Query: `page`, `limit`, `q`, `location`, `category`, `sort=created_at:asc|desc`
  - 200 → `{ items: LegacyJob[], page, limit, total, page_count }`

- GET `/api/jobs/:id`
  - 200 → `LegacyJob`

- POST `/api/jobs` (admin header required)
  - Header: `x-admin-key: <ADMIN_API_KEY>`
  - Body:
    ```json
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "category": "string",
      "description": "string"
    }
    ```
  - 201 → `LegacyJob`

- DELETE `/api/jobs/:id` (admin header required)
  - Header: `x-admin-key: <ADMIN_API_KEY>`
  - 204

`LegacyJob`:

```ts
type LegacyJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  created_at: string; // ISO
};
```

### Applications (legacy)

- POST `/api/applications`
  - Body:
    ```json
    {
      "job_id": "ObjectId",
      "name": "string (1-100)",
      "email": "valid email",
      "resume_link": "https://... (<= 2048 chars)",
      "cover_note": "string (<= 2000, optional)"
    }
    ```
  - 201 → `LegacyApplication`

`LegacyApplication`:

```ts
type LegacyApplication = {
  id: string;
  job_id: string;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
  created_at: string; // ISO
};
```

## Example cURL Snippets

Register:

```bash
curl -s -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Passw0rd!","name":"User One"}'
```

Login:

```bash
curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Passw0rd!"}'
```

Public jobs:

```bash
curl -s "http://localhost:4000/api/v1/jobs?page=1&pageSize=10&query=Engineer&sort=posted_at:desc"
```

Create job (employer/admin):

```bash
curl -s -X POST http://localhost:4000/api/v1/jobs/admin \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Senior Frontend Engineer",
    "slug":"senior-frontend-engineer",
    "jobType":"Full Time",
    "experienceLevel":"Senior",
    "location":"Dublin, Ireland",
    "isRemote":false,
    "salaryMin":120000,
    "salaryMax":160000,
    "salaryCurrency":"EUR",
    "description":"Build and maintain...",
    "responsibilities":["Build and maintain...","Mentor engineers"],
    "requirements":["5+ years React/TypeScript"],
    "benefits":["Health Insurance"],
    "categoryIds":[],
    "deadline":"2026-05-12T00:00:00.000Z",
    "isFeatured":true
  }'
```

Upload image:

```bash
curl -s -X POST "http://localhost:4000/api/v1/uploads/images?folder=logos" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "file=@/path/to/logo.png"
```

Create company with logo:

```bash
curl -s -X POST http://localhost:4000/api/v1/admin/companies \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
  -F "name=Example Co" \
  -F "website=https://example.com" \
  -F "logo=@/path/to/logo.png"
```

Apply to job:

```bash
curl -s -X POST http://localhost:4000/api/v1/jobs/<jobId>/applications \
  -H "Authorization: Bearer $CANDIDATE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resumeSource":"pdf","resumeId":null}'
```
