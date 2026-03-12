import { AtlasBallroom } from "../atlas/ballrooms/types";

export type TenantBallroom = {
    id: string;
    tenant_id: string;
    atlas_ballroom_id: string | null;
    name: string;
    description: string | null;
    image: string | null;
    width: number;
    depth: number;
    unit_type: 'ft' | 'm';
    capacity: number | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    // UI Expanded
    atlas_ballroom?: AtlasBallroom | null;
};

export type ImportBallroomInput = {
    atlas_ballroom_id: string;
    name: string;
    description?: string | null;
    width: number;
    depth: number;
    unit_type: 'ft' | 'm';
    capacity?: number | null;
    status?: 'pending' | 'approved' | 'rejected';
};
