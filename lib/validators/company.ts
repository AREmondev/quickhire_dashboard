import { z } from "zod";

export const CompanySchema = z.object({
    name: z.string().min(2, "Company name is required").max(200),
    website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    location: z.string().max(200).optional(),
    description: z.string().max(2000).optional(),
});
export type CompanyInput = z.infer<typeof CompanySchema>;

export const CategorySchema = z.object({
    name: z.string().min(2, "Category name is required").max(100),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a hex color like #FF6550").optional().or(z.literal("")),
});
export type CategoryInput = z.infer<typeof CategorySchema>;
