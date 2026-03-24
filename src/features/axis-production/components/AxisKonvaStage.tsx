import { Stage, Layer, Group, Rect, Image as KonvaImage, Circle, Line } from "react-konva";
import useImage from "use-image";
import { useState, memo, useRef, useCallback } from "react";
import { CanvasAsset } from "../types";

interface URLImageProps {
    asset: CanvasAsset;
    isSelected: boolean;
    isBackground?: boolean;
    stageDimensions?: { width: number; height: number };
    onSelect: (e: any) => void;
    onUpdateProperties: (properties: Partial<CanvasAsset>) => void;
    onDragStart: (e: any) => void;
    onDragMove: (e: any) => void;
    onDragEnd: (e: any) => void;
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
    onDragStart,
    onDragMove,
    onDragEnd,
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
    let offsetX = 0;
    let offsetY = 0;

    // Background fitting logic
    if (isBackground && stageDimensions) {
        const stageRatio = stageDimensions.width / stageDimensions.height;
        const imgRatio = img.width / img.height;

        // Use 'cover' strategy but with centering
        if (imgRatio > stageRatio) {
            displayHeight = stageDimensions.height;
            displayWidth = stageDimensions.height * imgRatio;
            offsetX = (displayWidth - stageDimensions.width) / 2;
        } else {
            displayWidth = stageDimensions.width;
            displayHeight = stageDimensions.width / imgRatio;
            offsetY = (displayHeight - stageDimensions.height) / 2;
        }
    } else {
        displayWidth = img.width * asset.scale;
        displayHeight = img.height * asset.scale;
        offsetX = displayWidth / 2;
        offsetY = displayHeight / 2;
    }

    const selectionColor = "#D946EF";
    const hoverColor = "#C084FC";
    const accentColor = isSelected ? selectionColor : hoverColor;

    return (
        <Group
            x={asset.x}
            y={asset.y}
            name="asset-node"
            id={asset.id}
            rotation={asset.rotation}
            draggable={!asset.isLocked && !isBackground}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
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
                offsetX={offsetX}
                offsetY={offsetY}
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
    onDropAsset: (item: any, x: number, y: number) => void;
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
    onDropAsset,
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

    const dragOffsetRef = useRef<{ id: string, x: number, y: number }[]>([]);

    const handleDragStart = useCallback((e: any) => {
        if (selectedAssetIds.length > 1) {
            dragOffsetRef.current = selectedAssetIds.map(id => {
                const node = e.target.getStage().findOne(`#${id}`);
                return { id, x: node?.x() || 0, y: node?.y() || 0 };
            });
        }
    }, [selectedAssetIds]);

    const handleDragMove = useCallback((e: any) => {
        const assetId = e.target.id();
        if (selectedAssetIds.includes(assetId) && selectedAssetIds.length > 1) {
            const node = e.target;
            const dx = node.x() - dragOffsetRef.current.find(o => o.id === assetId)!.x;
            const dy = node.y() - dragOffsetRef.current.find(o => o.id === assetId)!.y;

            selectedAssetIds.forEach(id => {
                if (id === assetId) return;
                const otherNode = e.target.getStage().findOne(`#${id}`);
                const initial = dragOffsetRef.current.find(o => o.id === id);
                if (otherNode && initial) {
                    otherNode.x(initial.x + dx);
                    otherNode.y(initial.y + dy);
                }
            });
        }
    }, [selectedAssetIds]);

    const handleDragEnd = useCallback((e: any) => {
        const assetId = e.target.id();
        const updates: { id: string, x: number, y: number }[] = [];

        if (selectedAssetIds.includes(assetId) && selectedAssetIds.length > 1) {
            selectedAssetIds.forEach(id => {
                const node = e.target.getStage().findOne(`#${id}`);
                if (node) updates.push({ id, x: node.x(), y: node.y() });
            });
        } else {
            updates.push({ id: assetId, x: e.target.x(), y: e.target.y() });
        }

        onUpdateAssetPosition(updates);
        dragOffsetRef.current = [];
    }, [selectedAssetIds, onUpdateAssetPosition]);

    // Optimize rotation similarly
    const handleRotateMove = useCallback((e: any) => {
        e.cancelBubble = true;
        if (!rotationState.current) return;

        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        if (pos) {
            const { startAngle, startRotation, assetId } = rotationState.current;
            const assetNode = stage.findOne(`#${assetId}`);
            if (!assetNode) return;

            const dx = pos.x - assetNode.x();
            const dy = pos.y - assetNode.y();
            const currentAngle = Math.atan2(dy, dx);
            const deltaRotation = (currentAngle - startAngle) * (180 / Math.PI);
            const newRotation = startRotation + deltaRotation;

            // Update node(s) imperatively first
            if (selectedAssetIds.includes(assetId)) {
                const diff = newRotation - assetNode.rotation();
                selectedAssetIds.forEach(id => {
                    const node = stage.findOne(`#${id}`);
                    if (node) {
                        const meta = canvasAssets.find(ca => ca.id === id);
                        if (meta && meta.rotationAllowed !== false) {
                            node.rotation(node.rotation() + diff);
                        }
                    }
                });
            } else {
                assetNode.rotation(newRotation);
            }
        }
        // Keep handle centered visually during drag
        e.target.x(0);
    }, [canvasAssets, selectedAssetIds]);

    const handleRotateEnd = useCallback((e: any) => {
        e.cancelBubble = true;
        if (rotationState.current) {
            const { assetId } = rotationState.current;
            const stage = e.target.getStage();
            const updates: { id: string, properties: any }[] = [];

            if (selectedAssetIds.includes(assetId)) {
                selectedAssetIds.forEach(id => {
                    const node = stage.findOne(`#${id}`);
                    if (node) updates.push({ id, properties: { rotation: node.rotation() } });
                });
            } else {
                const assetNode = stage.findOne(`#${assetId}`);
                if (assetNode) updates.push({ id: assetId, properties: { rotation: assetNode.rotation() } });
            }
            onUpdateAssetProperties(updates);
        }
        rotationState.current = null;
        e.target.x(0);
    }, [selectedAssetIds, onUpdateAssetProperties]);

    return (
        <Stage
            width={width}
            height={height}
            className="absolute inset-0 z-10"
            onClick={(e) => {
                if (e.target === e.target.getStage()) onSelectAssets([]);
            }}
            onDragOver={(e: any) => {
                e.evt.preventDefault();
            }}
            onDrop={(e: any) => {
                e.evt.preventDefault();
                const stage = e.target.getStage();
                if (!stage) return;

                stage.setPointersPositions(e.evt);
                const pos = stage.getRelativePointerPosition();
                if (!pos) return;

                try {
                    const item = JSON.parse(e.evt.dataTransfer?.getData("application/json") || "{}");
                    onDropAsset(item, pos.x, pos.y);
                } catch (err) {
                    console.error("Failed to parse dropped item", err);
                }
            }}
        >
            <Layer>
                {backgroundImage && (
                    <URLImage
                        asset={{
                            id: backgroundImage,
                            x: 0,
                            y: 0,
                            scale: 1,
                            rotation: 0,
                            flipX: false,
                            flipY: false,
                            isLocked: true,
                            rotationAllowed: false,
                            item: {
                                id: 'bg',
                                title: "Background",
                                asset: { image: backgroundImage }
                            } as any
                        }}
                        isSelected={false}
                        isBackground={true}
                        stageDimensions={{ width, height }}
                        onSelect={() => onSelectAssets([])}
                        onUpdateProperties={() => { }}
                        onDragStart={() => { }}
                        onDragMove={() => { }}
                        onDragEnd={() => { }}
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
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={handleDragEnd}
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
