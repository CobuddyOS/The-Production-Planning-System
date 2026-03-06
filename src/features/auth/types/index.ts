/**
 * Auth feature types.
 */

export interface PingResult {
    ok: boolean;
    tenant_slug?: string;
    tenant_id?: string;
    role?: string;
    user_id?: string;
    error?: string;
}

export interface PingState {
    status: 'idle' | 'loading' | 'done';
    httpStatus: number | null;
    result: PingResult | null;
}
