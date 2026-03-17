"use client";

import { useState, useEffect } from "react";
import { AxisHeader } from "@/features/axis-production/components/AxisHeader";
import { BallroomsSidebar } from "@/features/axis-production/components/BallroomsSidebar";
import { AxisCanvas } from "@/features/axis-production/components/AxisCanvas";
import { AssetsSidebar } from "@/features/axis-production/components/AssetsSidebar";
import { AxisEnvironment } from "@/features/axis-production/components/AxisEnvironment";
import { WorkspaceGuideModal } from "@/features/axis-production/components/WorkspaceGuideModal";
import { ProjectEstimateModal } from "@/features/axis-production/components/ProjectEstimateModal";

export default function AxisProductionPage() {
  const [mounted, setMounted] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [selectedBallroomImage, setSelectedBallroomImage] = useState<string | null>(null);
  const [canvasAssets, setCanvasAssets] = useState<any[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [numberOfDays] = useState(1);

  useEffect(() => {
    setMounted(true);
    // Responsive sidebars: open by default only on desktop
    if (window.innerWidth >= 1024) {
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
    }
  }, []);

  const handleAddAsset = (item: any, x?: number, y?: number) => {
    if (!selectedBallroomImage) return;
    if (item.asset?.placement_type !== "canvas") return;

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
        flipX: false,
        flipY: false,
        isLocked: false,
      },
    ]);
  };

  const updateAssetPosition = (id: string, x: number, y: number) => {
    setCanvasAssets((prev) => prev.map(a => a.id === id ? { ...a, x, y } : a));
  };

  const updateAssetProperties = (id: string, properties: any) => {
    setCanvasAssets((prev) => prev.map(a => a.id === id ? { ...a, ...properties } : a));
  };

  const deleteAsset = (id: string) => {
    setCanvasAssets((prev) => prev.filter((a) => a.id !== id));
    if (selectedAssetId === id) setSelectedAssetId(null);
  };

  const duplicateAsset = (id: string) => {
    const asset = canvasAssets.find((a) => a.id === id);
    if (!asset) return;

    const newAsset = {
      ...asset,
      id: Math.random().toString(36).substring(7),
      x: asset.x + 20,
      y: asset.y + 20,
    };
    setCanvasAssets((prev) => [...prev, newAsset]);
    setSelectedAssetId(newAsset.id);
  };

  const resetAsset = (id: string) => {
    setCanvasAssets((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
            ...a,
            scale: 0.8,
            flipX: false,
            flipY: false,
            isLocked: false,
          }
          : a
      )
    );
  };

  const updateAssetLayering = (id: string, action: "front" | "back" | "forward" | "backward") => {
    setCanvasAssets((prev) => {
      const index = prev.findIndex((a) => a.id === id);
      if (index === -1) return prev;

      const newAssets = [...prev];
      const [item] = newAssets.splice(index, 1);

      if (action === "front") {
        newAssets.push(item);
      } else if (action === "back") {
        newAssets.unshift(item);
      } else if (action === "forward") {
        const newIndex = Math.min(index + 1, newAssets.length);
        newAssets.splice(newIndex, 0, item);
      } else if (action === "backward") {
        const newIndex = Math.max(index - 1, 0);
        newAssets.splice(newIndex, 0, item);
      }

      return newAssets;
    });
  };

  const handleDropAsset = (e: React.DragEvent) => {
    e.preventDefault();
    if (!selectedBallroomImage) return;

    try {
      const itemData = e.dataTransfer.getData("application/json");
      if (!itemData) return;
      const item = JSON.parse(itemData);
      if (item.asset?.placement_type !== "canvas") return;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      handleAddAsset(item, x, y);
    } catch (err) {
      console.error("Error dropping asset", err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-transparent overflow-hidden text-white font-montserrat">
      <AxisHeader
        leftSidebarOpen={leftSidebarOpen}
        setLeftSidebarOpen={setLeftSidebarOpen}
        rightSidebarOpen={rightSidebarOpen}
        setRightSidebarOpen={setRightSidebarOpen}
        onOpenSummary={() => setSummaryOpen(true)}
        onOpenGuide={() => setInfoModalOpen(true)}
      />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <div className="flex flex-1 overflow-hidden">
          <BallroomsSidebar
            isOpen={leftSidebarOpen}
            selectedBallroomImage={selectedBallroomImage}
            onSelectBallroom={setSelectedBallroomImage}
          />

          <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
            <AxisCanvas
              backgroundImage={selectedBallroomImage}
              canvasAssets={canvasAssets}
              selectedAssetId={selectedAssetId}
              onSelectAsset={setSelectedAssetId}
              onDropAsset={handleDropAsset}
              onUpdateAssetPosition={updateAssetPosition}
              onUpdateAssetProperties={updateAssetProperties}
              onDeleteAsset={deleteAsset}
              onDuplicateAsset={duplicateAsset}
              onResetAsset={resetAsset}
              onUpdateAssetLayering={updateAssetLayering}
            />
          </main>

          <AssetsSidebar
            isOpen={rightSidebarOpen}
            hasBallroom={!!selectedBallroomImage}
            onAddAsset={handleAddAsset}
          />
        </div>

        <AxisEnvironment />
      </div>

      <WorkspaceGuideModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
      />

      <ProjectEstimateModal
        isOpen={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        numberOfDays={numberOfDays}
      />

      {/* Custom Styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .axis-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .axis-slider::-webkit-slider-runnable-track {
          width: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 999px;
        }
        .axis-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px;
          height: 12px;
          border-radius: 4px;
          background: rgba(56, 189, 248, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: 0 0 12px rgba(132, 204, 22, 0.6);
          margin-top: -4px;
        }
        .axis-slider::-moz-range-track {
          width: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 999px;
        }
        .axis-slider::-moz-range-thumb {
          width: 28px;
          height: 12px;
          border-radius: 4px;
          background: rgba(56, 189, 248, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: 0 0 12px rgba(132, 204, 22, 0.6);
        }
      `}</style>
    </div>
  );
}
