export type AssetPlacementType = 'canvas' | 'staff' | 'table' | 'case' | 'slider';
export type AssetScale = 'low' | 'medium' | 'large';
export type AssetStatus = 'active' | 'inactive';

export type AtlasAsset = {
    id: string;
    name: string;
    category_id: string | null;
    image: string;
    placement_type: AssetPlacementType;
    default_scale: AssetScale;
    status: AssetStatus;
    created_at: string;
    // Expanded field for UI convenience
    atlas_categories?: {
        name: string;
    };
};

export type CreateAssetInput = Omit<AtlasAsset, 'id' | 'created_at' | 'atlas_categories'>;
export type UpdateAssetInput = Partial<CreateAssetInput> & { id: string };
