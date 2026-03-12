import { WarehouseItem } from "@/features/inventory/types";
import { TenantBallroom } from "@/features/ballrooms/types";
import { Tenant } from "@/features/tenant/types";

/**
 * A warehouse item enriched with its owning tenant info.
 * Supabase returns `tenant` via the join `tenant:tenants(*)`.
 */
export type AssetRequest = WarehouseItem & {
    tenant: Tenant | null;
};

/**
 * A tenant ballroom enriched with its owning tenant info.
 * Supabase returns `tenant` via the join `tenant:tenants(*)`.
 */
export type BallroomRequest = TenantBallroom & {
    tenant: Tenant | null;
};
