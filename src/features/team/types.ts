import { TeamRoleValue } from "./constants";

export interface TeamMember {
    userId: string;
    name: string | null;
    email: string | null;
    role: string;
    createdAt: string | null;
}

export interface TeamResponse {
    ok: boolean;
    members: TeamMember[];
    currentUserRole: string | null;
    canManage: boolean;
    error?: string;
}

export interface CreateMemberData {
    name?: string;
    email: string;
    password?: string;
    role: TeamRoleValue;
}
