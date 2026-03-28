import { z } from "zod";

const JobBaseSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  companyId: z.string().min(1, "Company is required"),
  jobType: z.string().min(1, "Job type is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  location: z.string().min(2, "Location is required").max(200),
  isRemote: z.boolean().default(false),
  salaryMin: z.coerce.number().min(0, "Must be ≥ 0"),
  salaryMax: z.coerce.number().min(0, "Must be ≥ 0"),
  salaryCurrency: z.string().min(1, "Currency required").max(10),
  categoryIds: z.array(z.string()).default([]),
  description: z.string().min(10, "Description is required").max(10000),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  deadline: z.string().optional(),
  isFeatured: z.boolean().default(false),
  _hasAssessment: z.boolean().default(false),
  assessment: z
    .object({
      title: z.string().optional(),
      questions: z
        .array(
          z.object({
            questionText: z.string().optional(),
            questionType: z.enum([
              "multiple-choice",
              "short-answer",
              "true-false",
              "problem-solve",
            ]),
            options: z.array(z.string()).optional(),
            correctAnswer: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
});

/**
 * Create Job Schema
 * Includes salary validation and conditional assessment validation
 */
export const JobCreateSchema = JobBaseSchema.refine(
  (data) => data.salaryMax >= data.salaryMin,
  {
    message: "Max salary must be ≥ min salary",
    path: ["salaryMax"],
  },
).superRefine((data, ctx) => {
  if (data._hasAssessment) {
    if (!data.assessment?.title || data.assessment.title.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Assessment title is required (min 2 chars)",
        path: ["assessment", "title"],
      });
    }

    if (!data.assessment?.questions || data.assessment.questions.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one question is required",
        path: ["assessment", "questions"],
      });
    } else {
      data.assessment.questions.forEach((q, i) => {
        if (!q.questionText || q.questionText.length < 5) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Question text must be at least 5 characters",
            path: ["assessment", "questions", i, "questionText"],
          });
        }
      });
    }
  }
});

export type JobCreateInput = z.infer<typeof JobCreateSchema>;

/**
 * Patch Job Schema
 * - companyId cannot be updated
 * - all fields optional
 */
export const JobPatchSchema = JobBaseSchema.omit({ companyId: true })
  .partial()
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMax >= data.salaryMin,
    {
      message: "Max salary must be ≥ min salary",
      path: ["salaryMax"],
    },
  )
  .superRefine((data, ctx) => {
    if (data._hasAssessment) {
      if (!data.assessment?.title || data.assessment.title.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Assessment title is required (min 2 chars)",
          path: ["assessment", "title"],
        });
      }

      if (
        !data.assessment?.questions ||
        data.assessment.questions.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one question is required",
          path: ["assessment", "questions"],
        });
      } else {
        data.assessment.questions.forEach((q: any, i: number) => {
          if (!q.questionText || q.questionText.length < 5) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Question text must be at least 5 characters",
              path: ["assessment", "questions", i, "questionText"],
            });
          }
        });
      }
    }
  });

export type JobPatchInput = z.infer<typeof JobPatchSchema>;
