import { useState, useEffect } from "react";

export function useAxisProductionState() {
    const [mounted, setMounted] = useState(false);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [selectedBallroomImage, setSelectedBallroomImage] = useState<string | null>(null);
    const [canvasAssets, setCanvasAssets] = useState<any[]>([]);
    const [tableAssets, setTableAssets] = useState<any[]>([]);
    const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [numberOfDays] = useState(1);

    useEffect(() => {
        setMounted(true);
        if (window.innerWidth >= 1024) {
            setLeftSidebarOpen(true);
            setRightSidebarOpen(true);
        }
    }, []);

    const handleAddAsset = (item: any, x?: number, y?: number) => {
        if (!selectedBallroomImage) return;

        const placementType = item.asset?.placement_type;

        if (placementType === "table") {
            if (tableAssets.length < 8) {
                setTableAssets((prev) => [
                    ...prev,
                    {
                        id: Math.random().toString(36).substring(7),
                        item,
                    },
                ]);
            }
            return;
        }

        if (placementType !== "canvas") return;

        let targetX = x;
        let targetY = y;

        if (targetX === undefined || targetY === undefined) {
            const canvasEl = document.getElementById("myCanvas");
            if (canvasEl) {
                const rect = canvasEl.getBoundingClientRect();
                targetX = rect.width / 2;
                targetY = rect.height / 2;
            } else {
                targetX = 200;
                targetY = 200;
            }
        }

        setCanvasAssets((prev) => [
            ...prev,
            {
                id: Math.random().toString(36).substring(7),
                item,
                x: targetX,
                y: targetY,
                scale: 0.8,
                rotation: 0,
                flipX: false,
                flipY: false,
                isLocked: false,
                rotationAllowed: item.rotation_allowed ?? true,
            },
        ]);
    };

    const updateAssetPosition = (updates: { id: string, x: number, y: number }[]) => {
        setCanvasAssets((prev) => prev.map(a => {
            const update = updates.find(u => u.id === a.id);
            return update ? { ...a, x: update.x, y: update.y } : a;
        }));
    };

    const updateAssetProperties = (updates: { id: string, properties: any }[]) => {
        setCanvasAssets((prev) => prev.map(a => {
            const update = updates.find(u => u.id === a.id);
            return update ? { ...a, ...update.properties } : a;
        }));
    };

    const deleteAsset = (ids: string[]) => {
        setCanvasAssets((prev) => prev.filter((a) => !ids.includes(a.id)));
        setSelectedAssetIds((prev) => prev.filter(id => !ids.includes(id)));
    };

    const removeTableAsset = (id: string) => {
        setTableAssets((prev) => prev.filter(a => a.id !== id));
    };

    const duplicateAsset = (ids: string[]) => {
        const assetsToDuplicate = canvasAssets.filter((a) => ids.includes(a.id));
        if (assetsToDuplicate.length === 0) return;

        const newAssets = assetsToDuplicate.map(asset => ({
            ...asset,
            id: Math.random().toString(36).substring(7),
            x: asset.x + 20,
            y: asset.y + 20,
        }));

        setCanvasAssets((prev) => [...prev, ...newAssets]);
        setSelectedAssetIds(newAssets.map(a => a.id));
    };

    const resetAsset = (ids: string[]) => {
        setCanvasAssets((prev) =>
            prev.map((a) =>
                ids.includes(a.id)
                    ? {
                        ...a,
                        scale: 0.8,
                        rotation: 0,
                        flipX: false,
                        flipY: false,
                        isLocked: false,
                    }
                    : a
            )
        );
    };

    const updateAssetLayering = (ids: string[], action: "front" | "back" | "forward" | "backward") => {
        setCanvasAssets((prev) => {
            const indices = ids.map(id => prev.findIndex(a => a.id === id)).filter(idx => idx !== -1);
            if (indices.length === 0) return prev;

            indices.sort((a, b) => a - b);
            const newAssets = [...prev];
            const selectedItems = indices.map(idx => newAssets[idx]);

            [...indices].reverse().forEach(idx => newAssets.splice(idx, 1));

            if (action === "front") {
                newAssets.push(...selectedItems);
            } else if (action === "back") {
                newAssets.unshift(...selectedItems);
            } else if (action === "forward") {
                const maxIdx = Math.max(...indices);
                const insertionIdx = Math.min(maxIdx + 1, prev.length - selectedItems.length + 1);
                newAssets.splice(insertionIdx - selectedItems.length + 1, 0, ...selectedItems);
            } else if (action === "backward") {
                const minIdx = Math.min(...indices);
                const insertionIdx = Math.max(minIdx - 1, 0);
                newAssets.splice(insertionIdx, 0, ...selectedItems);
            }

            return newAssets;
        });
    };

    const rotateAssets = (ids: string[], direction: "cw" | "ccw") => {
        const step = direction === "cw" ? 15 : -15;
        setCanvasAssets((prev) =>
            prev.map((a) =>
                ids.includes(a.id) && (a.rotationAllowed !== false)
                    ? { ...a, rotation: (a.rotation || 0) + step }
                    : a
            )
        );
    };

    return {
        mounted,
        leftSidebarOpen,
        setLeftSidebarOpen,
        rightSidebarOpen,
        setRightSidebarOpen,
        selectedBallroomImage,
        setSelectedBallroomImage,
        canvasAssets,
        tableAssets,
        selectedAssetIds,
        setSelectedAssetIds,
        infoModalOpen,
        setInfoModalOpen,
        summaryOpen,
        setSummaryOpen,
        numberOfDays,
        handleAddAsset,
        updateAssetPosition,
        updateAssetProperties,
        deleteAsset,
        removeTableAsset,
        duplicateAsset,
        resetAsset,
        updateAssetLayering,
        rotateAssets,
    };
}
