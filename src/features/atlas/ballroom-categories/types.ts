export type AtlasBallroomCategory = {
    id: string;
    name: string;
    description: string | null;
    status: 'active' | 'inactive';
    created_at: string;
};

export type CreateBallroomCategoryInput = Omit<AtlasBallroomCategory, 'id' | 'created_at'>;
export type UpdateBallroomCategoryInput = Partial<CreateBallroomCategoryInput> & { id: string };
