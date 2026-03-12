import { z } from "zod";

export const warehouseItemSchema = z.object({
    atlas_asset_id: z.string().uuid().nullable().optional(),
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().max(1000, "Description must be less than 1000 characters").nullable().optional(),
    quantity: z.coerce.number().int().min(0, "Quantity cannot be negative").default(0),
    warehouse_location: z.string().max(100, "Location must be less than 100 characters").nullable().optional(),
    brand: z.string().max(50, "Brand must be less than 50 characters").nullable().optional(),
    model: z.string().max(50, "Model must be less than 50 characters").nullable().optional(),
    dimensions: z.string().max(100, "Dimensions must be less than 100 characters").nullable().optional(),
    weight: z.coerce.number().nullable().optional(),
    power: z.string().max(50, "Power spec must be less than 50 characters").nullable().optional(),
    footprint_width: z.coerce.number().nullable().optional(),
    footprint_depth: z.coerce.number().nullable().optional(),
    rotation_allowed: z.boolean().default(true),
    pricing: z.coerce.number().min(0, "Pricing cannot be negative").nullable().optional(),
    approval_status: z.enum(['pending', 'approved', 'rejected'] as const).default('pending'),
});

export type WarehouseItemSchemaValues = z.infer<typeof warehouseItemSchema>;
