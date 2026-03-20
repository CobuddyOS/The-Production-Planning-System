"use client";

import { useState, useEffect, useRef } from "react";
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Trash2,
    Maximize2,
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
import dynamic from "next/dynamic";

// Dynamically import the Konva Stage component to avoid SSR issues
const AxisKonvaStage = dynamic<any>(() => import("./AxisKonvaStage"), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-300"></div>
        </div>
    )
});

import { Asset, CanvasAsset, LayerAction, RotationDirection } from "../types";

interface AxisCanvasProps {
    backgroundImage: string | null;
    canvasAssets: CanvasAsset[];
    selectedAssetIds: string[];
    onSelectAssets: (ids: string[]) => void;
    onDropAsset: (item: any, x: number, y: number) => void;
    onUpdateAssetPosition: (updates: { id: string, x: number, y: number }[]) => void;
    onUpdateAssetProperties: (updates: { id: string, properties: Partial<CanvasAsset> }[]) => void;
    onDeleteAsset: (ids: string[]) => void;
    onDuplicateAsset: (ids: string[]) => void;
    onResetAsset: (ids: string[]) => void;
    onUpdateAssetLayering: (ids: string[], action: LayerAction) => void;
    onRotateAssets: (ids: string[], direction: RotationDirection) => void;
}


interface ToolbarItem {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    iconClass?: string;
    btnClass?: string;
}

interface ToolbarGroup {
    group: string;
    items: ToolbarItem[];
}

function AxisCanvasInternal({
    backgroundImage,
    canvasAssets,
    selectedAssetIds,
    onSelectAssets,
    onDropAsset,
    onUpdateAssetPosition,
    onUpdateAssetProperties,
    onDeleteAsset,
    onDuplicateAsset,
    onResetAsset,
    onUpdateAssetLayering,
    onRotateAssets,
}: AxisCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isClient, setIsClient] = useState(false);
    const [isToolbarMinimized, setIsToolbarMinimized] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const toolBtnClass =
        "h-8 w-8 p-0 rounded-md transition-all duration-200 border border-white/10 text-white/70 bg-white/5 hover:text-white hover:bg-white/10";

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
                { icon: Trash2, label: "Delete Selected", onClick: () => onDeleteAsset(selectedAssetIds), btnClass: "text-rose-300 hover:text-rose-200 hover:bg-rose-500/10" },
            ]
        }
    ];

    return (
        <div className="flex-1 p-2 flex flex-col gap-2 overflow-hidden">
            <div
                id="myCanvas"
                ref={containerRef}
                className="flex-1 overflow-hidden rounded-xl neon-glass-card shadow-[0_0_35px_rgba(56,189,248,0.25)] relative group"
            >
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="bg-white/90 backdrop-blur shadow-md hover:bg-white"
                        onClick={() => { }}
                    >
                        <Maximize2 className="size-4" />
                    </Button>
                </div>

                {/* Konva Stage */}
                {isClient && dimensions.width > 0 && (
                    <AxisKonvaStage
                        width={dimensions.width}
                        height={dimensions.height}
                        backgroundImage={backgroundImage}
                        canvasAssets={canvasAssets}
                        selectedAssetIds={selectedAssetIds}
                        onSelectAssets={onSelectAssets}
                        onDropAsset={onDropAsset}
                        onUpdateAssetPosition={onUpdateAssetPosition}
                        onUpdateAssetProperties={onUpdateAssetProperties}
                    />
                )}

                {/* Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none z-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Toolbar Overlay */}
                <div className={`absolute transition-all duration-500 ease-in-out z-20 ${isToolbarMinimized ? "bottom-4 right-4" : "bottom-4 left-1/2 -translate-x-1/2"}`}>
                    <div className="flex items-center gap-1.5 p-1.5 bg-zinc-950/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl">
                        {!isToolbarMinimized ? (
                            <TooltipProvider>
                                <div className="flex items-center gap-0.5 px-1.5">
                                    {TOOLBAR_CONFIG.map((group, gIdx) => (
                                        <div key={group.group} className="flex items-center gap-0.5">
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
                                                    <TooltipContent side="top">
                                                        <p>{item.label}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                            {gIdx < TOOLBAR_CONFIG.length - 1 && (
                                                <Separator orientation="vertical" className="h-3 bg-white/20 mx-1" />
                                            )}
                                        </div>
                                    ))}

                                    <Separator orientation="vertical" className="h-8 bg-white/20 ml-2 mr-1" />

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-white/50 hover:text-white"
                                                onClick={() => setIsToolbarMinimized(true)}
                                            >
                                                <Maximize2 className="size-4 rotate-45" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Minimize Toolbar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </TooltipProvider>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-primary hover:bg-white/10 rounded-full"
                                onClick={() => setIsToolbarMinimized(false)}
                            >
                                <Maximize2 className="size-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const AxisCanvas = AxisCanvasInternal;
