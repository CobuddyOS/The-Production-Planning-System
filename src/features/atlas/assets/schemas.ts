import { z } from "zod";

export const assetSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    category_id: z.string().uuid("Invalid category selected").nullable(),
    image: z.string().url("Invalid image URL or path"),
    placement_type: z.enum(['click', 'drag'] as const, {
        error: "Please select a placement type",
    }),
    default_scale: z.enum(['low', 'medium', 'large'] as const, {
        error: "Please select a default scale",
    }),
    status: z.enum(['active', 'inactive'] as const).default('active'),
});

export type AssetSchemaValues = z.infer<typeof assetSchema>;
