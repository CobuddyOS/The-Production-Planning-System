import { z } from "zod";

export const ballroomSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    category_id: z.string().uuid("Invalid category selected").nullable(),
    description: z.string().max(500, "Description must be less than 500 characters").nullable().optional(),
    image: z.string().url("Invalid image URL or path").nullable().optional().or(z.literal("")),
    width: z.coerce.number().positive("Width must be greater than 0"),
    depth: z.coerce.number().positive("Depth must be greater than 0"),
    unit_type: z.enum(['ft', 'm'] as const).default('ft'),
    capacity: z.coerce.number().int().nonnegative("Capacity cannot be negative").nullable().optional(),
    status: z.enum(['active', 'inactive'] as const).default('active'),
});

export type BallroomSchemaValues = z.infer<typeof ballroomSchema>;
