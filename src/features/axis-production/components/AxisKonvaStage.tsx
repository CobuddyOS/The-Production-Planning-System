"use client";

import { Stage, Layer, Group, Rect, Image as KonvaImage, Circle, Line } from "react-konva";
import useImage from "use-image";
import { useState, memo, useRef, useCallback } from "react";

/**
 * Interface for the properties of a single canvas asset.
 * This should match the data structure used in useAxisProductionState.
 */
interface CanvasAsset {
    id: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    flipX: boolean;
    flipY: boolean;
    isLocked: boolean;
    rotationAllowed?: boolean;
    item: {
        title: string;
        asset?: {
            image: string;
        };
    };
}

interface URLImageProps {
    asset: CanvasAsset;
    isSelected: boolean;
    isBackground?: boolean;
    stageDimensions?: { width: number; height: number };
    onSelect: (e: any) => void;
    onUpdateProperties: (properties: Partial<CanvasAsset>) => void;
    onUpdatePosition: (x: number, y: number) => void;
    onRotateStart: (e: any) => void;
    onRotateMove: (e: any) => void;
    onRotateEnd: (e: any) => void;
}

export const URLImage = memo(({
    asset,
    isSelected,
    isBackground = false,
    stageDimensions,
    onSelect,
    onUpdateProperties,
    onUpdatePosition,
    onRotateStart,
    onRotateMove,
    onRotateEnd,
}: URLImageProps) => {
    const src = isBackground ? asset.id : asset.item.asset?.image || "";
    const [img] = useImage(src, "anonymous");
    const [isHovered, setIsHovered] = useState(false);

    if (!img) return null;

    let displayWidth = img.width;
    let displayHeight = img.height;

    // Background fitting logic
    if (isBackground && stageDimensions) {
        const stageRatio = stageDimensions.width / stageDimensions.height;
        const imgRatio = img.width / img.height;

        if (imgRatio > stageRatio) {
            displayHeight = stageDimensions.height;
            displayWidth = stageDimensions.height * imgRatio;
        } else {
            displayWidth = stageDimensions.width;
            displayHeight = stageDimensions.width / imgRatio;
        }
    } else {
        displayWidth = img.width * asset.scale;
        displayHeight = img.height * asset.scale;
    }

    const selectionColor = "#D946EF";
    const hoverColor = "#C084FC";
    const accentColor = isSelected ? selectionColor : hoverColor;

    return (
        <Group
            x={asset.x}
            y={asset.y}
            rotation={asset.rotation}
            draggable={!asset.isLocked && !isBackground}
            onDragMove={(e) => {
                onUpdatePosition(e.target.x(), e.target.y());
            }}
            onClick={onSelect}
            onTap={onSelect}
            onMouseEnter={(e: any) => {
                if (!isBackground && !asset.isLocked) {
                    e.target.getStage().container().style.cursor = "grab";
                    setIsHovered(true);
                }
            }}
            onMouseLeave={(e: any) => {
                if (!isBackground) {
                    e.target.getStage().container().style.cursor = "default";
                    setIsHovered(false);
                }
            }}
        >
            <KonvaImage
                image={img}
                width={displayWidth}
                height={displayHeight}
                offsetX={isBackground ? 0 : displayWidth / 2}
                offsetY={isBackground ? 0 : displayHeight / 2}
                scaleX={asset.flipX ? -1 : 1}
                scaleY={asset.flipY ? -1 : 1}
            />

            {/* Selection/Hover Frame */}
            {((isHovered || isSelected) && !isBackground) && (
                <Rect
                    x={-displayWidth / 2}
                    y={-displayHeight / 2}
                    width={displayWidth}
                    height={displayHeight}
                    stroke={accentColor}
                    strokeWidth={isSelected ? 2 : 1}
                    dash={isSelected ? [] : [6, 3]}
                    cornerRadius={4}
                    listening={false}
                    shadowColor={accentColor}
                    shadowBlur={isSelected ? 15 : 5}
                    shadowOpacity={0.6}
                />
            )}

            {/* Rotation Handle */}
            {(isSelected && !asset.isLocked && asset.rotationAllowed !== false && !isBackground) && (
                <Group>
                    <Line
                        points={[0, -displayHeight / 2, 0, -displayHeight / 2 - 25]}
                        stroke={accentColor}
                        strokeWidth={1.5}
                        opacity={0.8}
                    />
                    <Circle
                        y={-displayHeight / 2 - 25}
                        radius={6}
                        fill={selectionColor}
                        stroke="white"
                        strokeWidth={1.5}
                        draggable
                        onDragStart={onRotateStart}
                        onDragMove={onRotateMove}
                        onDragEnd={onRotateEnd}
                        onMouseEnter={(e: any) => {
                            e.target.getStage().container().style.cursor = "crosshair";
                        }}
                        onMouseLeave={(e: any) => {
                            e.target.getStage().container().style.cursor = "default";
                        }}
                    />
                </Group>
            )}
        </Group>
    );
});

URLImage.displayName = "URLImage";

interface AxisKonvaStageProps {
    width: number;
    height: number;
    backgroundImage: string | null;
    canvasAssets: CanvasAsset[];
    selectedAssetIds: string[];
    onSelectAssets: (ids: string[]) => void;
    onUpdateAssetPosition: (updates: { id: string, x: number, y: number }[]) => void;
    onUpdateAssetProperties: (updates: { id: string, properties: any }[]) => void;
}

const AxisKonvaStage = ({
    width,
    height,
    backgroundImage,
    canvasAssets,
    selectedAssetIds,
    onSelectAssets,
    onUpdateAssetPosition,
    onUpdateAssetProperties,
}: AxisKonvaStageProps) => {

    // Rotation calculations
    const rotationState = useRef<{
        startAngle: number;
        startRotation: number;
        assetId: string;
    } | null>(null);

    const handleRotateStart = useCallback((asset: CanvasAsset, e: any) => {
        e.cancelBubble = true;
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        if (pos) {
            const dx = pos.x - asset.x;
            const dy = pos.y - asset.y;
            rotationState.current = {
                startAngle: Math.atan2(dy, dx),
                startRotation: asset.rotation || 0,
                assetId: asset.id
            };
        }
    }, []);

    const handleRotateMove = useCallback((e: any) => {
        e.cancelBubble = true;
        if (!rotationState.current) return;

        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        if (pos) {
            const { startAngle, startRotation, assetId } = rotationState.current;
            const asset = canvasAssets.find(a => a.id === assetId);
            if (!asset) return;

            const dx = pos.x - asset.x;
            const dy = pos.y - asset.y;
            const currentAngle = Math.atan2(dy, dx);
            const deltaRotation = (currentAngle - startAngle) * (180 / Math.PI);
            const newRotation = startRotation + deltaRotation;

            // Multi-selection rotation
            if (selectedAssetIds.includes(assetId)) {
                const diff = newRotation - asset.rotation;
                const updates = selectedAssetIds.map(id => {
                    const target = canvasAssets.find(ca => ca.id === id);
                    if (target && target.rotationAllowed !== false) {
                        return { id, properties: { rotation: target.rotation + diff } };
                    }
                    return null;
                }).filter(Boolean) as { id: string, properties: any }[];

                onUpdateAssetProperties(updates);
            } else {
                onUpdateAssetProperties([{ id: assetId, properties: { rotation: newRotation } }]);
            }
        }

        // Keep handle centered visually during drag
        e.target.x(0);
    }, [canvasAssets, selectedAssetIds, onUpdateAssetProperties]);

    const handleRotateEnd = useCallback((e: any) => {
        e.cancelBubble = true;
        rotationState.current = null;
        e.target.x(0);
    }, []);

    const handleDragMove = useCallback((assetId: string, x: number, y: number) => {
        const asset = canvasAssets.find(a => a.id === assetId);
        if (!asset || asset.isLocked) return;

        if (selectedAssetIds.includes(assetId) && selectedAssetIds.length > 1) {
            const dx = x - asset.x;
            const dy = y - asset.y;

            const updates = selectedAssetIds.map(id => {
                const a = canvasAssets.find(ca => ca.id === id);
                if (a) return { id, x: a.x + dx, y: a.y + dy };
                return null;
            }).filter(Boolean) as { id: string, x: number, y: number }[];

            onUpdateAssetPosition(updates);
        } else {
            onUpdateAssetPosition([{ id: assetId, x, y }]);
        }
    }, [canvasAssets, selectedAssetIds, onUpdateAssetPosition]);

    return (
        <Stage
            width={width}
            height={height}
            className="absolute inset-0 z-10"
            onClick={(e) => {
                if (e.target === e.target.getStage()) onSelectAssets([]);
            }}
        >
            <Layer>
                {backgroundImage && (
                    <URLImage
                        asset={{
                            id: backgroundImage,
                            x: 0, y: 0, scale: 1, rotation: 0, flipX: false, flipY: false,
                            isLocked: true, item: { title: "Background" }
                        } as any}
                        isSelected={false}
                        isBackground={true}
                        stageDimensions={{ width, height }}
                        onSelect={() => onSelectAssets([])}
                        onUpdateProperties={() => { }}
                        onUpdatePosition={() => { }}
                        onRotateStart={() => { }}
                        onRotateMove={() => { }}
                        onRotateEnd={() => { }}
                    />
                )}

                {canvasAssets.map((asset) => (
                    <URLImage
                        key={asset.id}
                        asset={asset}
                        isSelected={selectedAssetIds.includes(asset.id)}
                        onSelect={(e) => {
                            e.cancelBubble = true;
                            const isCtrl = e.evt.ctrlKey || e.evt.metaKey;
                            if (isCtrl) {
                                onSelectAssets(selectedAssetIds.includes(asset.id)
                                    ? selectedAssetIds.filter(id => id !== asset.id)
                                    : [...selectedAssetIds, asset.id]
                                );
                            } else {
                                onSelectAssets([asset.id]);
                            }
                        }}
                        onUpdateProperties={(props) => onUpdateAssetProperties([{ id: asset.id, properties: props }])}
                        onUpdatePosition={(x, y) => handleDragMove(asset.id, x, y)}
                        onRotateStart={(e) => handleRotateStart(asset, e)}
                        onRotateMove={handleRotateMove}
                        onRotateEnd={handleRotateEnd}
                    />
                ))}
            </Layer>
        </Stage>
    );
};

export default memo(AxisKonvaStage);
