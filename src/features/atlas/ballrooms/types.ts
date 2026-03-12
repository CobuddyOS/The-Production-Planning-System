export type AtlasBallroom = {
    id: string;
    name: string;
    category_id: string | null;
    description: string | null;
    image: string | null;
    width: number;
    depth: number;
    unit_type: 'ft' | 'm';
    capacity: number | null;
    status: 'active' | 'inactive';
    created_at: string;
    atlas_ballroom_categories?: {
        id: string;
        name: string;
    } | null;
};

export type CreateBallroomInput = Omit<AtlasBallroom, 'id' | 'created_at' | 'atlas_ballroom_categories'>;
export type UpdateBallroomInput = Partial<CreateBallroomInput> & { id: string };
