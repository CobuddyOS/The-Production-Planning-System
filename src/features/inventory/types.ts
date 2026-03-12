import { AtlasAsset } from "../atlas/assets/types";
import { WarehouseItemSchemaValues } from "./schemas";


export type WarehouseItem = {
    id: string;
    tenant_id: string;
    atlas_asset_id: string | null;
    title: string | null;
    description: string | null;
    quantity: number;
    warehouse_location: string | null;
    brand: string | null;
    model: string | null;
    dimensions: string | null;
    weight: number | null;
    power: string | null;
    footprint_width: number | null;
    footprint_depth: number | null;
    rotation_allowed: boolean;
    pricing: number | null;
    approval_status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    // Expanded for UI
    asset?: AtlasAsset;
};

export type ImportAssetInput = WarehouseItemSchemaValues;
