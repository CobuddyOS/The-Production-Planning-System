import { WarehouseItem } from "@/features/inventory/types";

export type { WarehouseItem as Asset };

export interface CanvasAsset {
    id: string;
    item: WarehouseItem;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    flipX: boolean;
    flipY: boolean;
    isLocked: boolean;
    rotationAllowed: boolean;
}

export interface TableAsset {
    id: string;
    item: WarehouseItem;
}

export type LayerAction = "front" | "back" | "forward" | "backward";
export type RotationDirection = "cw" | "ccw";

export interface ProductionState {
    canvasAssets: CanvasAsset[];
    tableAssets: TableAsset[];
    selectedAssetIds: string[];
    leftSidebarOpen: boolean;
    rightSidebarOpen: boolean;
    selectedBallroomImage: string | null;
    selectedBallroomId: string | null;
    infoModalOpen: boolean;
    summaryOpen: boolean;
    mounted: boolean;
}

export type ProductionAction =
    | { type: 'ADD_CANVAS_ASSET'; asset: CanvasAsset }
    | { type: 'REMOVE_CANVAS_ASSET'; ids: string[] }
    | { type: 'UPDATE_CANVAS_ASSET_POS'; updates: { id: string, x: number, y: number }[] }
    | { type: 'UPDATE_CANVAS_ASSET_PROPS'; updates: { id: string, properties: Partial<CanvasAsset> }[] }
    | { type: 'SET_SELECTED_ASSETS'; ids: string[] }
    | { type: 'TOGGLE_LEFT_SIDEBAR'; open?: boolean }
    | { type: 'TOGGLE_RIGHT_SIDEBAR'; open?: boolean }
    | { type: 'SET_BALLROOM'; id: string | null, image: string | null }
    | { type: 'SET_MODAL_OPEN'; modal: 'info' | 'summary'; open: boolean }
    | { type: 'SET_MOUNTED'; mounted: boolean }
    | { type: 'DUPLICATE_ASSETS'; assets: CanvasAsset[] }
    | { type: 'RESET_ASSETS'; ids: string[] }
    | { type: 'UPDATE_LAYERING'; ids: string[], action: LayerAction }
    | { type: 'ROTATE_ASSETS'; ids: string[], direction: RotationDirection }
    | { type: 'REMOVE_TABLE_ASSET'; id: string }
    | { type: 'ADD_TABLE_ASSET'; asset: WarehouseItem };
