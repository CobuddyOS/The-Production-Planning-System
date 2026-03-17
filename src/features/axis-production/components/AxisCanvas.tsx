"use client";

import { useState, useEffect, useRef } from "react";
import {
    ArrowUp,
    ArrowDown,
    FlipVertical,
    FlipHorizontal,
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
    ZoomOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";

// Dynamically import the Konva Stage component to avoid SSR and module evaluation issues
const AxisKonvaStage = dynamic<any>(() => import("./AxisKonvaStage"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-300"></div>
    </div>
});

interface AxisCanvasProps {
    backgroundImage: string | null;
    canvasAssets: any[];
    selectedAssetIds: string[];
    onSelectAssets: (ids: string[]) => void;
    onDropAsset: (e: any) => void;
    onUpdateAssetPosition: (updates: { id: string, x: number, y: number }[]) => void;
    onUpdateAssetProperties: (updates: { id: string, properties: any }[]) => void;
    onDeleteAsset: (ids: string[]) => void;
    onDuplicateAsset: (ids: string[]) => void;
    onResetAsset: (ids: string[]) => void;
    onUpdateAssetLayering: (ids: string[], action: "front" | "back" | "forward" | "backward") => void;
    onRotateAssets: (ids: string[], direction: "cw" | "ccw") => void;
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

    const [isToolbarMinimized, setIsToolbarMinimized] = useState(false);

    const toolBtnClass =
        "h-8 w-8 p-0 rounded-md transition-all duration-200 border border-white/10 text-white/70 bg-white/5 hover:text-white hover:bg-white/10";

    return (
        <div className="flex-1 p-2 flex flex-col gap-2 overflow-hidden">
            <div
                id="myCanvas"
                ref={containerRef}
                className="flex-1 overflow-hidden rounded-xl neon-glass-card shadow-[0_0_35px_rgba(56,189,248,0.25)] relative group"
                onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "copy";
                }}
                onDrop={(e) => {
                    onDropAsset(e);
                }}
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

                {/* Konva Stage Rendered via Dynamic Sub-component */}
                {isClient && dimensions.width > 0 && (
                    <AxisKonvaStage
                        width={dimensions.width}
                        height={dimensions.height}
                        backgroundImage={backgroundImage}
                        canvasAssets={canvasAssets}
                        selectedAssetIds={selectedAssetIds}
                        onSelectAssets={onSelectAssets}
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
                <div
                    className={`absolute transition-all duration-500 ease-in-out z-20 ${isToolbarMinimized
                        ? "bottom-4 right-4 translate-x-0"
                        : "bottom-4 left-1/2 -translate-x-1/2"
                        }`}
                >
                    <div className={`flex items-center gap-1.5 p-1.5 bg-zinc-950/95 backdrop-blur-md border border-white/20 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] ${isToolbarMinimized ? "w-11 h-11 justify-center" : "w-auto"
                        }`}>
                        {!isToolbarMinimized ? (
                            <TooltipProvider>
                                <div className="flex items-center gap-0.5 px-2">
                                    {/* Scale */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => {
                                                    const asset = canvasAssets.find(a => selectedAssetIds.includes(a.id));
                                                    if (asset) onUpdateAssetProperties(selectedAssetIds.map(id => ({ id, properties: { scale: asset.scale + 0.1 } })));
                                                }}
                                            >
                                                <ZoomIn className="size-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Scale Up</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => {
                                                    const asset = canvasAssets.find(a => selectedAssetIds.includes(a.id));
                                                    if (asset && asset.scale > 0.1) onUpdateAssetProperties(selectedAssetIds.map(id => ({ id, properties: { scale: asset.scale - 0.1 } })));
                                                }}
                                            >
                                                <ZoomOut className="size-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Scale Down</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Separator orientation="vertical" className="h-3 bg-white/20 mx-1" />

                                    {/* Flip */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => {
                                                    const asset = canvasAssets.find(a => selectedAssetIds.includes(a.id));
                                                    if (asset) onUpdateAssetProperties(selectedAssetIds.map(id => ({ id, properties: { flipX: !asset.flipX } })));
                                                }}
                                            >
                                                <FlipHorizontal className="size-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Flip Horizontal</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => {
                                                    const asset = canvasAssets.find(a => selectedAssetIds.includes(a.id));
                                                    if (asset) onUpdateAssetProperties(selectedAssetIds.map(id => ({ id, properties: { flipY: !asset.flipY } })));
                                                }}
                                            >
                                                <FlipVertical className="size-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Flip Vertical</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0 || canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.rotationAllowed === false)}
                                                onClick={() => onRotateAssets(selectedAssetIds, "ccw")}
                                            >
                                                <RotateCcw className="size-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>{canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.rotationAllowed === false) ? "Rotation Locked" : "Rotate CCW"}</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0 || canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.rotationAllowed === false)}
                                                onClick={() => onRotateAssets(selectedAssetIds, "cw")}
                                            >
                                                <RotateCw className="size-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>{canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.rotationAllowed === false) ? "Rotation Locked" : "Rotate CW"}</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Separator orientation="vertical" className="h-3 bg-white/20 mx-1" />

                                    {/* Layering */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => onUpdateAssetLayering(selectedAssetIds, "front")}
                                            >
                                                <ChevronLast className="size-3.5 rotate-[270deg]" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Bring to Front</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => onUpdateAssetLayering(selectedAssetIds, "forward")}
                                            >
                                                <ArrowUpFromLine className="size-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Bring Forward</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => onUpdateAssetLayering(selectedAssetIds, "backward")}
                                            >
                                                <ArrowDownToLine className="size-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Send Backward</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => onUpdateAssetLayering(selectedAssetIds, "back")}
                                            >
                                                <ChevronFirst className="size-3.5 rotate-[270deg]" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Send to Back</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Separator orientation="vertical" className="h-3 bg-white/20 mx-1" />

                                    {/* DUPLICATE / RESET / LOCK */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => onDuplicateAsset(selectedAssetIds)}
                                            >
                                                <Copy className="size-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Duplicate</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => onResetAsset(selectedAssetIds)}
                                            >
                                                <RotateCcw className="size-3.5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Reset</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={toolBtnClass}
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => {
                                                    const anyLocked = canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.isLocked);
                                                    onUpdateAssetProperties(selectedAssetIds.map(id => ({ id, properties: { isLocked: !anyLocked } })));
                                                }}
                                            >
                                                {canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.isLocked) ? <Lock className="size-3.5 text-amber-400" /> : <Unlock className="size-3.5" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>{canvasAssets.some(a => selectedAssetIds.includes(a.id) && a.isLocked) ? "Unlock All" : "Lock All"}</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-rose-300 hover:bg-white/10 hover:text-rose-200 rounded-lg disabled:opacity-30"
                                                disabled={selectedAssetIds.length === 0}
                                                onClick={() => onDeleteAsset(selectedAssetIds)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            <p>Delete Selected</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Separator orientation="vertical" className="h-8 bg-white/20 ml-2 mr-1" />

                                    {/* Minimize Button */}
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
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-sky-400 hover:bg-white/10 rounded-full"
                                            onClick={() => setIsToolbarMinimized(false)}
                                        >
                                            <Maximize2 className="size-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        <p>Expand Toolbar</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const AxisCanvas = AxisCanvasInternal;
