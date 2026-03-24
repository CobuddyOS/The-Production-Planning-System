"use client";

import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Trash2,
    Copy,
    RotateCcw,
    RotateCw,
    Lock,
    Unlock,
    ChevronFirst,
    ChevronLast,
    ZoomIn,
    ZoomOut,
    FlipHorizontal,
    FlipVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useProduction } from "../context/ProductionContext";
import { CanvasAsset } from "../types";

interface ToolbarItem {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    iconClass?: string;
    btnClass?: string;
}

interface ToolbarGroup {
    group: string;
    items: ToolbarItem[];
}

export function AxisToolbar() {
    const { canvasAssets, selectedAssetIds, dispatch } = useProduction();

    const onUpdateAssetProperties = (updates: { id: string, properties: Partial<CanvasAsset> }[]) => {
        dispatch({ type: 'UPDATE_CANVAS_ASSET_PROPS', updates });
    };

    const onDeleteAsset = (ids: string[]) => dispatch({ type: 'REMOVE_CANVAS_ASSET', ids });
    const onDuplicateAsset = (ids: string[]) => {
        const newAssets = canvasAssets
            .filter(a => ids.includes(a.id))
            .map(a => ({
                ...a,
                id: crypto.randomUUID(),
                x: a.x + 20,
                y: a.y + 20,
            }));
        dispatch({ type: 'DUPLICATE_ASSETS', assets: newAssets });
    };
    const onResetAsset = (ids: string[]) => dispatch({ type: 'RESET_ASSETS', ids });
    const onUpdateAssetLayering = (ids: string[], action: any) => dispatch({ type: 'UPDATE_LAYERING', ids, action });
    const onRotateAssets = (ids: string[], direction: any) => dispatch({ type: 'ROTATE_ASSETS', ids, direction });

    const toolBtnClass =
        "h-8 w-8 p-0 rounded-xl transition-all duration-200 border border-white/10 text-white/50 bg-white/5 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5";

    const TOOLBAR_CONFIG: ToolbarGroup[] = [
        {
            group: "scale",
            items: [
                {
                    icon: ZoomIn,
                    label: "Scale Up",
                    onClick: () => {
                        const asset = canvasAssets.find(a => selectedAssetIds.includes(a.id));
                        if (asset) onUpdateAssetProperties(selectedAssetIds.map(id => ({ id, properties: { scale: asset.scale + 0.1 } })))
                    }
                },
                {
                    icon: ZoomOut,
                    label: "Scale Down",
                    onClick: () => {
                        const asset = canvasAssets.find(a => selectedAssetIds.includes(a.id));
                        if (asset && asset.scale > 0.1) onUpdateAssetProperties(selectedAssetIds.map(id => ({ id, properties: { scale: asset.scale - 0.1 } })))
                    }
                },
            ]
        },
        {
            group: "rotation",
            items: [
                {
                    icon: FlipHorizontal,
                    label: "Flip Horizontal",
                    onClick: () => {
                        const asset = canvasAssets.find(a => selectedAssetIds.includes(a.id));
                        if (asset) onUpdateAssetProperties(selectedAssetIds.map(id => ({ id, properties: { flipX: !asset.flipX } })))
                    }
                },
                {
                    icon: FlipVertical,
                    label: "Flip Vertical",
                    onClick: () => {
                        const asset = canvasAssets.find(a => selectedAssetIds.includes(a.id));
                        if (asset) onUpdateAssetProperties(selectedAssetIds.map(id => ({ id, properties: { flipY: !asset.flipY } })))
                    }
                },
                {
                    icon: RotateCcw,
                    label: canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.rotationAllowed === false) ? "Rotation Locked" : "Rotate CCW",
                    disabled: canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.rotationAllowed === false),
                    onClick: () => onRotateAssets(selectedAssetIds, "ccw")
                },
                {
                    icon: RotateCw,
                    label: canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.rotationAllowed === false) ? "Rotation Locked" : "Rotate CW",
                    disabled: canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.rotationAllowed === false),
                    onClick: () => onRotateAssets(selectedAssetIds, "cw")
                },
            ]
        },
        {
            group: "layering",
            items: [
                { icon: ChevronLast, label: "Bring to Front", onClick: () => onUpdateAssetLayering(selectedAssetIds, "front"), iconClass: "rotate-[270deg]" },
                { icon: ArrowUpFromLine, label: "Bring Forward", onClick: () => onUpdateAssetLayering(selectedAssetIds, "forward") },
                { icon: ArrowDownToLine, label: "Send Backward", onClick: () => onUpdateAssetLayering(selectedAssetIds, "backward") },
                { icon: ChevronFirst, label: "Send to Back", onClick: () => onUpdateAssetLayering(selectedAssetIds, "back"), iconClass: "rotate-[270deg]" },
            ]
        },
        {
            group: "actions",
            items: [
                { icon: Copy, label: "Duplicate", onClick: () => onDuplicateAsset(selectedAssetIds) },
                { icon: RotateCcw, label: "Reset", onClick: () => onResetAsset(selectedAssetIds) },
                {
                    icon: canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.isLocked) ? Lock : Unlock,
                    label: canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.isLocked) ? "Unlock All" : "Lock All",
                    iconClass: canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.isLocked) ? "text-amber-400" : "",
                    onClick: () => {
                        const anyLocked = canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.isLocked);
                        onUpdateAssetProperties(selectedAssetIds.map(id => ({ id, properties: { isLocked: !anyLocked } })));
                    }
                },
                { icon: Trash2, label: "Delete Selected", onClick: () => onDeleteAsset(selectedAssetIds), btnClass: "text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/10" },
            ]
        }
    ];

    return (
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-xl backdrop-blur-sm">
            <TooltipProvider>
                <div className="flex items-center gap-1">
                    {TOOLBAR_CONFIG.map((group, gIdx) => (
                        <div key={group.group} className="flex items-center gap-1">
                            {group.items.map((item, iIdx) => (
                                <Tooltip key={`${gIdx}-${iIdx}`}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn(toolBtnClass, item.btnClass)}
                                            disabled={selectedAssetIds.length === 0 || item.disabled}
                                            onClick={item.onClick}
                                        >
                                            <item.icon className={cn("size-3.5", item.iconClass)} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="bg-zinc-900 border-white/10 text-white text-[10px]">
                                        <p>{item.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                            {gIdx < TOOLBAR_CONFIG.length - 1 && (
                                <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />
                            )}
                        </div>
                    ))}
                </div>
            </TooltipProvider>
        </div>
    );
}
