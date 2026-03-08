/**
 * Tenant feature types.
 *
 * Shared TypeScript interfaces for the tenant domain.
 */

export interface Tenant {
    id: string;
    slug: string;
    status: 'active' | 'suspended' | 'deleted';
    name: string;
}

export interface TenantInfo {
    id: string;
    name: string;
}

export interface TenantDebugData {
    host: string;
    tenant_slug: string;
    tenant_id: string | null;
    tenant_name: string | null;
    authenticated: boolean;
    user_id: string | null;
    status: 'found' | 'not_found';
    debug: {
        auth_error: string | null;
        db_error: string | null;
        has_session: boolean;
    };
}
