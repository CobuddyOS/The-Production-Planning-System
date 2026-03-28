import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    description: z.string().max(500, "Description must be less than 500 characters").nullable().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
    icon_url: z.string().nullable().optional(),
    sort_order: z.number().int().default(0),
});

export type CategorySchemaValues = z.infer<typeof categorySchema>;
