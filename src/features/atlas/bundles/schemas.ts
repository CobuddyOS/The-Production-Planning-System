import { z } from "zod";

export const bundleItemSchema = z.object({
    asset_id: z.string().uuid("Invalid asset selected"),
    quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
});

export const bundleSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    category: z.string().max(50, "Category must be less than 50 characters").nullable().optional(),
    description: z.string().max(500, "Description must be less than 500 characters").nullable().optional(),
    status: z.enum(['active', 'inactive'] as const).default('active'),
    items: z.array(bundleItemSchema).min(1, "At least one asset is required in a bundle"),
});

export type BundleSchemaValues = z.infer<typeof bundleSchema>;
