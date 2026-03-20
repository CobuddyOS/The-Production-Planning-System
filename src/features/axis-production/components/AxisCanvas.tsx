"use client";

import { useState, useEffect, useRef } from "react";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

import { CanvasAsset, LayerAction, RotationDirection } from "../types";

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

function AxisCanvasInternal({
    backgroundImage,
    canvasAssets,
    selectedAssetIds,
    onSelectAssets,
    onDropAsset,
    onUpdateAssetPosition,
    onUpdateAssetProperties,
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

    return (
        <div className="h-full w-full p-2 flex flex-col gap-2 overflow-hidden min-w-0 min-h-0">
            <div
                id="myCanvas"
                ref={containerRef}
                className="flex-1 overflow-hidden rounded-xl neon-glass-card shadow-[0_0_35px_rgba(56,189,248,0.25)] relative group min-h-0"
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
            </div>
        </div>
    );
}

export const AxisCanvas = AxisCanvasInternal;
