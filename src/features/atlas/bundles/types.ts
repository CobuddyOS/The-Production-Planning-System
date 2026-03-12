import { AtlasAsset } from "../assets/types";

export type AtlasBundle = {
    id: string;
    name: string;
    category: string | null;
    description: string | null;
    status: 'active' | 'inactive';
    created_at: string;
    items?: AtlasBundleItem[];
};

export type AtlasBundleItem = {
    id: string;
    bundle_id: string;
    asset_id: string;
    quantity: number;
    asset?: AtlasAsset;
};

export type CreateBundleInput = Omit<AtlasBundle, 'id' | 'created_at' | 'items'> & {
    items: {
        asset_id: string;
        quantity: number;
    }[];
};

export type UpdateBundleInput = Partial<Omit<CreateBundleInput, 'items'>> & {
    id: string;
    items?: {
        asset_id: string;
        quantity: number;
    }[];
};
