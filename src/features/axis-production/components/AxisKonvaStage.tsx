"use client";

import { Stage, Layer, Group, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { useState, memo } from "react";

interface URLImageProps {
    src: string;
    x: number;
    y: number;
    scale: number;
    flipX: boolean;
    flipY: boolean;
    isLocked: boolean;
    isSelected: boolean;
    draggable: boolean;
    onDragEnd?: (e: any) => void;
    onClick?: (e: any) => void;
    isBackground?: boolean;
    width?: number;
    height?: number;
}

export const URLImage = memo(({
    src,
    x,
    y,
    scale,
    flipX,
    flipY,
    isLocked,
    isSelected,
    draggable,
    onDragEnd,
    onClick,
    isBackground = false,
    width,
    height,
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
            x={x}
            y={y}
            draggable={!isLocked && draggable}
            onDragEnd={onDragEnd}
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
        </Group>
    );
});

URLImage.displayName = "URLImage";

interface AxisKonvaStageProps {
    width: number;
    height: number;
    backgroundImage: string | null;
    canvasAssets: any[];
    selectedAssetId: string | null;
    onSelectAsset: (id: string | null) => void;
    onUpdateAssetPosition: (id: string, x: number, y: number) => void;
}

const AxisKonvaStage = ({
    width,
    height,
    backgroundImage,
    canvasAssets,
    selectedAssetId,
    onSelectAsset,
    onUpdateAssetPosition,
}: AxisKonvaStageProps) => {
    return (
        <Stage
            width={width}
            height={height}
            className="absolute inset-0 z-10"
            onClick={(e) => {
                if (e.target === e.target.getStage()) {
                    onSelectAsset(null);
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
                        flipX={false}
                        flipY={false}
                        isLocked={false}
                        isSelected={false}
                        width={width}
                        height={height}
                        isBackground={true}
                        draggable={false}
                    />
                )}

                {canvasAssets.map((asset) => (
                    <URLImage
                        key={asset.id}
                        src={asset.item.asset?.image}
                        x={asset.x}
                        y={asset.y}
                        scale={asset.scale}
                        flipX={asset.flipX}
                        flipY={asset.flipY}
                        isLocked={asset.isLocked}
                        isSelected={selectedAssetId === asset.id}
                        draggable={true}
                        onClick={(e) => {
                            e.cancelBubble = true;
                            onSelectAsset(asset.id);
                        }}
                        onDragEnd={(e: any) => {
                            onUpdateAssetPosition(asset.id, e.target.x(), e.target.y());
                        }}
                    />
                ))}
            </Layer>
        </Stage>
    );
};

export default AxisKonvaStage;
