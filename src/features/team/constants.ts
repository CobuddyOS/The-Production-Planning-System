/**
 * Team roles for tenant membership.
 * Value is stored in DB; label is for display.
 */
export const TEAM_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'warehouse_manager', label: 'Warehouse Manager' },
  { value: 'sales', label: 'Sales' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'lead_technician', label: 'Lead Technician' },
  { value: 'hr', label: 'HR' },
] as const;

export type TeamRoleValue = (typeof TEAM_ROLES)[number]['value'];

export const TEAM_ROLE_VALUES: TeamRoleValue[] = TEAM_ROLES.map((r) => r.value);

export function getRoleLabel(value: string): string {
  return TEAM_ROLES.find((r) => r.value === value)?.label ?? value;
}
