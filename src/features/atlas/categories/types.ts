export type AtlasCategory = {
    id: string;
    name: string;
    description: string | null;
    status: 'active' | 'inactive';
    created_at: string;
    icon_url: string | null;
    sort_order: number;
};

export type CreateCategoryInput = Omit<AtlasCategory, 'id' | 'created_at'>;
export type UpdateCategoryInput = Partial<CreateCategoryInput> & { id: string };
