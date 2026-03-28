# QuickHire Admin Dashboard (Next.js + React Hook Form + Zod)

Purpose: A practical, implementation-ready guide to build the admin dashboard with Next.js (App Router), separating features by domain, and handling forms using react-hook-form (useForm) with Zod validation.

Scope (Phase 1)

- Jobs: list, view, create, delete
- Applications: submit from public site (already in backend); admin list planned as Phase 2
- Clean separation of features, validation-first forms, and environment-based config

Recommended Dependencies

- react-hook-form
- zod
- @hookform/resolvers
- Optional for data fetching: native fetch; SWR or TanStack Query may be added later

Install (reference)

```bash
npm i react-hook-form zod @hookform/resolvers
```

## API Contracts (aligned with backend)

Job

```ts
type ApiJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  created_at: string;
};
```

Application

```ts
type ApiApplication = {
  id: string;
  job_id: string;
  name: string;
  email: string;
  resume_link: string;
  cover_note?: string;
  created_at: string;
};
```

Endpoints

- GET /api/jobs
- GET /api/jobs/{id}
- POST /api/jobs (Admin; requires x-admin-key)
- DELETE /api/jobs/{id} (Admin; requires x-admin-key)
- POST /api/applications (public)

## Directory Structure (App Router)

```
app/
  (dashboard)/
    admin/
      layout.tsx
      page.tsx                     # dashboard home (metrics / quick links)
      jobs/
        page.tsx                   # list + filters + pagination
        new/
          page.tsx                 # create job
        [id]/
          page.tsx                 # job detail + delete
      applications/
        page.tsx                   # Phase 2 (admin list)

components/
  dashboard/
    Nav.tsx
    Sidebar.tsx
    PageHeader.tsx
    DataTable.tsx
    ConfirmDialog.tsx
    forms/
      Form.tsx                    # generic <Form> wrapper for RHF
      TextField.tsx
      TextArea.tsx
      SelectField.tsx
      JobForm.tsx                 # schema-driven form for jobs

lib/
  api/
    client.ts                     # fetch wrapper
    jobs.ts                       # jobs API functions
    applications.ts               # (public submit or future admin)
  validators/
    job.ts                        # zod schema for Job create
    application.ts                # zod schema for Application submit (public)
```

## Environment & Secrets

- NEXT_PUBLIC_API_URL: base URL for the backend (e.g., http://localhost:4000)
- ADMIN_API_KEY: server-only secret used to call admin endpoints
  - Never expose ADMIN_API_KEY in the browser
  - Use Next.js Route Handlers or Server Actions to proxy admin requests and attach the header server-side

Example server-side proxy (route handler)

```ts
// app/api/jobs/admin/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": process.env.ADMIN_API_KEY || "",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json();
  return new NextResponse(JSON.stringify(data), { status: res.status });
}
```

## Validation Schemas (Zod)

Job create

```ts
// lib/validators/job.ts
import { z } from "zod";

export const JobCreateSchema = z.object({
  title: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  description: z.string().min(1).max(10000),
});
export type JobCreateInput = z.infer<typeof JobCreateSchema>;
```

Application submit (public)

```ts
// lib/validators/application.ts
import { z } from "zod";

export const ApplicationCreateSchema = z.object({
  job_id: z.string().min(1),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  resume_link: z.string().url().max(2048),
  cover_note: z.string().max(2000).optional(),
});
export type ApplicationCreateInput = z.infer<typeof ApplicationCreateSchema>;
```

## Form Patterns (react-hook-form + zodResolver)

RHF setup

```tsx
// components/dashboard/forms/Form.tsx
"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props<T> = {
  schema: any;
  defaultValues: T;
  onSubmit: (data: T) => Promise<void> | void;
  children: React.ReactNode;
};

export function Form<T>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: Props<T>) {
  const methods = useForm<T>({ defaultValues, resolver: zodResolver(schema) });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
```

Job create form

```tsx
// components/dashboard/forms/JobForm.tsx
"use client";
import { useFormContext } from "react-hook-form";
import type { JobCreateInput } from "@/lib/validators/job";

export default function JobForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<JobCreateInput>();
  return (
    <>
      <label>Title</label>
      <input {...register("title")} />
      {errors.title?.message && <p>{errors.title.message}</p>}

      <label>Company</label>
      <input {...register("company")} />
      {errors.company?.message && <p>{errors.company.message}</p>}

      <label>Location</label>
      <input {...register("location")} />
      {errors.location?.message && <p>{errors.location.message}</p>}

      <label>Category</label>
      <input {...register("category")} />
      {errors.category?.message && <p>{errors.category.message}</p>}

      <label>Description</label>
      <textarea rows={6} {...register("description")} />
      {errors.description?.message && <p>{errors.description.message}</p>}

      <button type="submit">Create Job</button>
    </>
  );
}
```

Page using the form

```tsx
// app/(dashboard)/admin/jobs/new/page.tsx
import { Form } from "@/components/dashboard/forms/Form";
import JobForm from "@/components/dashboard/forms/JobForm";
import { JobCreateSchema, type JobCreateInput } from "@/lib/validators/job";

async function createJob(input: JobCreateInput) {
  const res = await fetch("/api/jobs/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Failed to create job");
  }
}

export default function NewJobPage() {
  return (
    <div>
      <h1>Create Job</h1>
      <Form<JobCreateInput>
        schema={JobCreateSchema}
        defaultValues={{
          title: "",
          company: "",
          location: "",
          category: "",
          description: "",
        }}
        onSubmit={async (data) => {
          await createJob(data);
        }}
      >
        <JobForm />
      </Form>
    </div>
  );
}
```

## Jobs List Page (list, filter, paginate)

Data load (server component)

```tsx
// app/(dashboard)/admin/jobs/page.tsx
export const dynamic = "force-dynamic";

async function getJobs(search: string, page: number) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`);
  if (search) url.searchParams.set("q", search);
  url.searchParams.set("page", String(page));
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load jobs");
  return res.json();
}

export default async function JobsPage({ searchParams }: any) {
  const q = searchParams?.q ?? "";
  const page = Number(searchParams?.page ?? "1");
  const { data } = await getJobs(q, page);
  return (
    <div>
      <h1>Jobs</h1>
      <a href="/admin/jobs/new">New Job</a>
      <ul>
        {data.items.map((j: any) => (
          <li key={j.id}>
            <a href={`/admin/jobs/${j.id}`}>
              {j.title} — {j.company} · {j.location}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Job Detail Page (view + delete)

Delete is performed through a server-side proxy route attaching x-admin-key.

```tsx
// app/(dashboard)/admin/jobs/[id]/page.tsx
export default async function JobDetailPage({ params }: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${params.id}`,
    { cache: "no-store" },
  );
  if (res.status === 404) return <div>Not found</div>;
  const { data: job } = await res.json();
  return (
    <div>
      <h1>{job.title}</h1>
      <p>
        {job.company} · {job.location}
      </p>
      <p>{job.category}</p>
      <pre>{job.description}</pre>
      <form action={`/api/jobs/admin/${params.id}/delete`} method="post">
        <button type="submit">Delete</button>
      </form>
    </div>
  );
}
```

Example delete route handler

```ts
// app/api/jobs/admin/[id]/delete/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${params.id}`,
    {
      method: "DELETE",
      headers: { "x-admin-key": process.env.ADMIN_API_KEY || "" },
    },
  );
  return new NextResponse(null, { status: res.status || 204 });
}
```

## Applications (Admin) — Phase 2

- Add GET endpoints in backend for admin listing if needed
- Admin pages:
  - /admin/applications: list (filter by job_id, email, date range)
  - /admin/applications/[id]: detail view
- Zod filters schema and controlled RHF forms for filter bars

## UX Notes

- Keep feature boundaries: jobs, applications as separate routes and modules
- Use server route handlers to keep secrets off the client
- Display backend validation errors by mapping error.details to field errors
- Prefer schema reuse across UI and server (Zod)

## Implementation Steps Checklist

- [ ] Add dependencies (react-hook-form, zod, @hookform/resolvers)
- [ ] Create validators in lib/validators
- [ ] Build generic Form wrapper and field components
- [ ] Implement /admin layout, nav, and jobs pages
- [ ] Add server proxy routes for admin POST/DELETE with ADMIN_API_KEY
- [ ] Wire form submit success/error states and minimal notifications
- [ ] Prepare Phase 2 applications admin after backend GET endpoints exist

---

Reference data sources:

- Jobs data: [lib/jobs.ts](file:///Users/emon/Desktop/task/qtec/lib/jobs.ts)
- Applications model: [lib/applications.ts](file:///Users/emon/Desktop/task/qtec/lib/applications.ts)
