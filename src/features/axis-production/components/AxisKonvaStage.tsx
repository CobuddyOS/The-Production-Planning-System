"use client";

import { Stage, Layer, Group, Rect, Image as KonvaImage, Circle, Line } from "react-konva";
import useImage from "use-image";
import { useState, memo, useRef } from "react";

interface URLImageProps {
    src: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    flipX: boolean;
    flipY: boolean;
    isLocked: boolean;
    isSelected: boolean;
    draggable: boolean;
    onDragEnd?: (e: any) => void;
    onDragMove?: (e: any) => void;
    onClick?: (e: any) => void;
    isBackground?: boolean;
    width?: number;
    height?: number;
    imageRef?: (node: any) => void;
    rotationAllowed?: boolean;
    onRotateHandleStart?: (e: any) => void;
    onRotateHandleMove?: (e: any) => void;
    onRotateHandleEnd?: (e: any) => void;
}

export const URLImage = memo(({
    src,
    x,
    y,
    scale,
    rotation,
    flipX,
    flipY,
    isLocked,
    isSelected,
    draggable,
    onDragEnd,
    onDragMove,
    onClick,
    isBackground = false,
    width,
    height,
    imageRef,
    rotationAllowed = true,
    onRotateHandleStart,
    onRotateHandleMove,
    onRotateHandleEnd,
}: URLImageProps) => {
    const [img] = useImage(src, "anonymous");
    const [isHovered, setIsHovered] = useState(false);

    if (!img) return null;

    let finalWidth = img.width;
    let finalHeight = img.height;

    if (isBackground && width && height) {
        const stageRatio = width / height;
        const imgRatio = img.width / img.height;

        if (imgRatio > stageRatio) {
            finalHeight = height;
            finalWidth = height * imgRatio;
        } else {
            finalWidth = width;
            finalHeight = width / imgRatio;
        }
    } else if (!isBackground) {
        finalWidth = img.width * scale;
        finalHeight = img.height * scale;
    }

    // Glow effects based on state
    const selectionColor = "#D946EF"; // Neon Purplish
    const hoverColor = "#C084FC";    // Lighter Purple for hover
    const borderColor = isSelected ? selectionColor : hoverColor;
    const borderOpacity = isSelected ? 1 : 0.9;

    return (
        <Group
            ref={imageRef}
            x={x}
            y={y}
            rotation={rotation}
            draggable={!isLocked && draggable}
            onDragEnd={onDragEnd}
            onDragMove={onDragMove}
            onClick={onClick}
            onTap={onClick}
            onMouseEnter={(e: any) => {
                if (!isBackground && !isLocked) {
                    const container = e.target.getStage().container();
                    container.style.cursor = "grab";
                    setIsHovered(true);
                }
            }}
            onMouseLeave={(e: any) => {
                if (!isBackground) {
                    const container = e.target.getStage().container();
                    container.style.cursor = "default";
                    setIsHovered(false);
                }
            }}
        >
            <KonvaImage
                image={img}
                x={0}
                y={0}
                width={finalWidth}
                height={finalHeight}
                offsetX={isBackground ? 0 : finalWidth / 2}
                offsetY={isBackground ? 0 : finalHeight / 2}
                scaleX={flipX ? -1 : 1}
                scaleY={flipY ? -1 : 1}
            />
            {((isHovered || isSelected) && !isBackground) && (
                <Rect
                    x={-finalWidth / 2}
                    y={-finalHeight / 2}
                    width={finalWidth}
                    height={finalHeight}
                    stroke={borderColor}
                    strokeWidth={isSelected ? 2 : 1}
                    dash={isSelected ? [] : [6, 3]}
                    opacity={borderOpacity}
                    cornerRadius={4}
                    listening={false}
                    shadowColor={borderColor}
                    shadowBlur={isSelected ? 15 : 5}
                    shadowOpacity={0.6}
                />
            )}
            {(isSelected && !isLocked && rotationAllowed && !isBackground) && (
                <Group>
                    <Line
                        points={[0, -finalHeight / 2, 0, -finalHeight / 2 - 25]}
                        stroke={borderColor}
                        strokeWidth={1.5}
                        opacity={0.8}
                    />
                    <Circle
                        x={0}
                        y={-finalHeight / 2 - 25}
                        radius={6}
                        fill={selectionColor}
                        stroke="white"
                        strokeWidth={1.5}
                        shadowColor="black"
                        shadowBlur={5}
                        shadowOpacity={0.4}
                        draggable
                        onDragStart={onRotateHandleStart}
                        onDragMove={onRotateHandleMove}
                        onDragEnd={onRotateHandleEnd}
                        onMouseEnter={(e: any) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = "crosshair";
                        }}
                        onMouseLeave={(e: any) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = "default";
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
    canvasAssets: any[];
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
    const nodeRefs = new Map<string, any>();
    const [isRotating, setIsRotating] = useState(false);
    const rotationStartAngle = useRef(0);
    const assetStartRotation = useRef(0);

    return (
        <Stage
            width={width}
            height={height}
            className="absolute inset-0 z-10"
            onClick={(e) => {
                if (e.target === e.target.getStage()) {
                    onSelectAssets([]);
                }
            }}
        >
            <Layer>
                {backgroundImage && (
                    <URLImage
                        src={backgroundImage}
                        x={0}
                        y={0}
                        scale={1}
                        rotation={0}
                        flipX={false}
                        flipY={false}
                        isLocked={false}
                        isSelected={false}
                        width={width}
                        height={height}
                        isBackground={true}
                        draggable={false}
                        onClick={() => onSelectAssets([])}
                    />
                )}

                {canvasAssets.map((asset) => (
                    <URLImage
                        key={asset.id}
                        imageRef={(node) => {
                            if (node) nodeRefs.set(asset.id, node);
                            else nodeRefs.delete(asset.id);
                        }}
                        src={asset.item.asset?.image}
                        x={asset.x}
                        y={asset.y}
                        scale={asset.scale}
                        rotation={asset.rotation || 0}
                        flipX={asset.flipX}
                        flipY={asset.flipY}
                        isLocked={asset.isLocked}
                        isSelected={selectedAssetIds.includes(asset.id)}
                        rotationAllowed={asset.rotationAllowed}
                        draggable={true}
                        onClick={(e) => {
                            e.cancelBubble = true;
                            const isCtrl = e.evt.ctrlKey || e.evt.metaKey;

                            if (isCtrl) {
                                if (selectedAssetIds.includes(asset.id)) {
                                    onSelectAssets(selectedAssetIds.filter(id => id !== asset.id));
                                } else {
                                    onSelectAssets([...selectedAssetIds, asset.id]);
                                }
                            } else {
                                onSelectAssets([asset.id]);
                            }
                        }}
                        onRotateHandleStart={(e) => {
                            e.cancelBubble = true;
                            setIsRotating(true);
                            const stage = e.target.getStage();
                            const pos = stage.getPointerPosition();
                            const assetNode = nodeRefs.get(asset.id);
                            if (pos && assetNode) {
                                // Calculate angle from center to mouse
                                const dx = pos.x - asset.x;
                                const dy = pos.y - asset.y;
                                rotationStartAngle.current = Math.atan2(dy, dx);
                                assetStartRotation.current = asset.rotation || 0;
                            }
                        }}
                        onRotateHandleMove={(e) => {
                            e.cancelBubble = true;
                            const stage = e.target.getStage();
                            const pos = stage.getPointerPosition();
                            const assetNode = nodeRefs.get(asset.id);

                            if (pos && assetNode) {
                                const dx = pos.x - asset.x;
                                const dy = pos.y - asset.y;
                                const currentAngle = Math.atan2(dy, dx);
                                const deltaRotation = (currentAngle - rotationStartAngle.current) * (180 / Math.PI);

                                const newRotation = assetStartRotation.current + deltaRotation;

                                // Update all selected assets around their own centers for simplicity & performance
                                if (selectedAssetIds.includes(asset.id)) {
                                    const diff = newRotation - (assetNode.rotation() || 0);
                                    selectedAssetIds.forEach(id => {
                                        const node = nodeRefs.get(id);
                                        const currentAsset = canvasAssets.find(ca => ca.id === id);
                                        if (node && (currentAsset?.rotationAllowed !== false)) {
                                            node.rotation(node.rotation() + diff);
                                        }
                                    });
                                } else {
                                    assetNode.rotation(newRotation);
                                }

                                // Reset the handle node position so it doesn't move away
                                e.target.x(0);
                                e.target.y(- (assetNode.children[0].height() / 2 + 25));
                            }
                        }}
                        onRotateHandleEnd={(e) => {
                            e.cancelBubble = true;
                            setIsRotating(false);

                            const assetNode = nodeRefs.get(asset.id);
                            if (assetNode) {
                                e.target.x(0);
                                e.target.y(-(assetNode.children[0].height() / 2 + 25));
                            }

                            if (selectedAssetIds.includes(asset.id)) {
                                const updates = selectedAssetIds.map(id => {
                                    const node = nodeRefs.get(id);
                                    if (node) return { id, rotation: node.rotation() };
                                    return null;
                                }).filter((u): u is { id: string, rotation: number } => u !== null);

                                // Extract the unique ids and properties for batch update
                                onUpdateAssetProperties?.(updates.map(u => ({ id: u.id, properties: { rotation: u.rotation } })));
                            } else {
                                const node = nodeRefs.get(asset.id);
                                if (node) onUpdateAssetProperties?.([{ id: asset.id, properties: { rotation: node.rotation() } }]);
                            }
                        }}
                        onDragMove={(e: any) => {
                            if (isRotating) return;
                            if (!selectedAssetIds.includes(asset.id) || selectedAssetIds.length <= 1) return;

                            const dx = e.target.x() - asset.x;
                            const dy = e.target.y() - asset.y;

                            selectedAssetIds.forEach(id => {
                                if (id === asset.id) return;
                                const node = nodeRefs.get(id);
                                if (node) {
                                    const originalAsset = canvasAssets.find(a => a.id === id);
                                    if (originalAsset) {
                                        node.x(originalAsset.x + dx);
                                        node.y(originalAsset.y + dy);
                                    }
                                }
                            });
                        }}
                        onDragEnd={(e: any) => {
                            if (isRotating) return;
                            const dx = e.target.x() - asset.x;
                            const dy = e.target.y() - asset.y;

                            if (selectedAssetIds.includes(asset.id)) {
                                const updates = selectedAssetIds.map(id => {
                                    const a = canvasAssets.find(ca => ca.id === id);
                                    if (!a) return null;
                                    if (id === asset.id) return { id, x: e.target.x(), y: e.target.y() };
                                    return { id, x: a.x + dx, y: a.y + dy };
                                }).filter((u): u is { id: string, x: number, y: number } => u !== null);

                                onUpdateAssetPosition(updates);
                            } else {
                                onUpdateAssetPosition([{ id: asset.id, x: e.target.x(), y: e.target.y() }]);
                            }
                        }}
                    />
                ))}
            </Layer>
        </Stage>
    );
};

export default AxisKonvaStage;
