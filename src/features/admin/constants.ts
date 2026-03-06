/**
 * Admin feature types.
 * 
 * Allowed roles for admin API access.
 */
export const ADMIN_ALLOWED_ROLES = ['owner', 'admin'] as const;

export type AdminRole = typeof ADMIN_ALLOWED_ROLES[number];
