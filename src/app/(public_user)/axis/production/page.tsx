"use client";

import { useAxisProductionState } from "@/features/axis-production/hooks/useAxisProductionState";
import { AxisHeader } from "@/features/axis-production/components/AxisHeader";
import { BallroomsSidebar } from "@/features/axis-production/components/BallroomsSidebar";
import { AxisCanvas } from "@/features/axis-production/components/AxisCanvas";
import { AssetsSidebar } from "@/features/axis-production/components/AssetsSidebar";
import { AxisEnvironment } from "@/features/axis-production/components/AxisEnvironment";
import { WorkspaceGuideModal } from "@/features/axis-production/components/WorkspaceGuideModal";
import { ProjectEstimateModal } from "@/features/axis-production/components/ProjectEstimateModal";

export default function AxisProductionPage() {
  const {
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
  } = useAxisProductionState();

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
        eventName="Summer Gala" // This can now be dynamic
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
              selectedAssetIds={selectedAssetIds}
              onSelectAssets={setSelectedAssetIds}
              onDropAsset={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                try {
                  const item = JSON.parse(e.dataTransfer.getData("application/json"));
                  handleAddAsset(item, x, y);
                } catch (err) {
                  console.error("Failed to drop asset", err);
                }
              }}
              onUpdateAssetPosition={updateAssetPosition}
              onUpdateAssetProperties={updateAssetProperties}
              onDeleteAsset={deleteAsset}
              onDuplicateAsset={duplicateAsset}
              onResetAsset={resetAsset}
              onUpdateAssetLayering={updateAssetLayering}
              onRotateAssets={rotateAssets}
            />
          </main>

          <AssetsSidebar
            isOpen={rightSidebarOpen}
            hasBallroom={!!selectedBallroomImage}
            onAddAsset={handleAddAsset}
          />
        </div>

        <AxisEnvironment
          tableAssets={tableAssets}
          onRemoveTableAsset={removeTableAsset}
        />
      </div>

      <WorkspaceGuideModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
      />

      <ProjectEstimateModal
        isOpen={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        numberOfDays={numberOfDays}
        canvasAssets={canvasAssets}
        tableAssets={tableAssets}
      />
    </div>
  );
}
