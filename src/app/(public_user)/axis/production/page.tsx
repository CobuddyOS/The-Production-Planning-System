"use client";

import { AxisHeader } from "@/features/axis-production/components/AxisHeader";
import { BallroomsSidebar } from "@/features/axis-production/components/BallroomsSidebar";
import { AxisCanvas } from "@/features/axis-production/components/AxisCanvas";
import { AssetsSidebar } from "@/features/axis-production/components/AssetsSidebar";
import { AxisEnvironment } from "@/features/axis-production/components/AxisEnvironment";
import { WorkspaceGuideModal } from "@/features/axis-production/components/WorkspaceGuideModal";
import { ProjectEstimateModal } from "@/features/axis-production/components/ProjectEstimateModal";
import { ProductionProvider, useProduction } from "@/features/axis-production/context/ProductionContext";
import { Asset, CanvasAsset, LayerAction, RotationDirection } from "@/features/axis-production/types";

function AxisProductionContent() {
  const {
    mounted,
    leftSidebarOpen,
    rightSidebarOpen,
    selectedBallroomImage,
    canvasAssets,
    tableAssets,
    selectedAssetIds,
    infoModalOpen,
    summaryOpen,
    dispatch,
  } = useProduction();

  const numberOfDays = 1;

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-transparent overflow-hidden text-white font-montserrat">
      <AxisHeader
        leftSidebarOpen={leftSidebarOpen}
        setLeftSidebarOpen={(open) => dispatch({ type: 'TOGGLE_LEFT_SIDEBAR', open })}
        rightSidebarOpen={rightSidebarOpen}
        setRightSidebarOpen={(open) => dispatch({ type: 'TOGGLE_RIGHT_SIDEBAR', open })}
        onOpenSummary={() => dispatch({ type: 'SET_MODAL_OPEN', modal: 'summary', open: true })}
        onOpenGuide={() => dispatch({ type: 'SET_MODAL_OPEN', modal: 'info', open: true })}
        eventName="Summer Gala"
      />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <div className="flex flex-1 overflow-hidden">
          <BallroomsSidebar
            isOpen={leftSidebarOpen}
            selectedBallroomImage={selectedBallroomImage}
            onSelectBallroom={(image) => dispatch({ type: 'SET_BALLROOM_IMAGE', image })}
          />

          <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
            <AxisCanvas
              backgroundImage={selectedBallroomImage}
              canvasAssets={canvasAssets}
              selectedAssetIds={selectedAssetIds}
              onSelectAssets={(ids) => dispatch({ type: 'SET_SELECTED_ASSETS', ids })}
              onDropAsset={(item, x, y) => {
                dispatch({
                  type: 'ADD_CANVAS_ASSET',
                  asset: {
                    id: crypto.randomUUID(),
                    item,
                    x,
                    y,
                    scale: 0.8,
                    rotation: 0,
                    flipX: false,
                    flipY: false,
                    isLocked: false,
                    rotationAllowed: item.rotation_allowed ?? true,
                  }
                });
              }}
              onUpdateAssetPosition={(updates) => dispatch({ type: 'UPDATE_CANVAS_ASSET_POS', updates })}
              onUpdateAssetProperties={(updates) => dispatch({ type: 'UPDATE_CANVAS_ASSET_PROPS', updates })}
              onDeleteAsset={(ids) => dispatch({ type: 'REMOVE_CANVAS_ASSET', ids })}
              onDuplicateAsset={(ids) => {
                const newAssets = canvasAssets
                  .filter(a => ids.includes(a.id))
                  .map(a => ({
                    ...a,
                    id: crypto.randomUUID(),
                    x: a.x + 20,
                    y: a.y + 20,
                  }));
                dispatch({ type: 'DUPLICATE_ASSETS', assets: newAssets });
              }}
              onResetAsset={(ids) => dispatch({ type: 'RESET_ASSETS', ids })}
              onUpdateAssetLayering={(ids, action) => dispatch({ type: 'UPDATE_LAYERING', ids, action })}
              onRotateAssets={(ids, direction) => dispatch({ type: 'ROTATE_ASSETS', ids, direction })}
            />
          </main>

          <AssetsSidebar
            isOpen={rightSidebarOpen}
            hasBallroom={!!selectedBallroomImage}
            onAddAsset={(item) => {
              if (item.asset?.placement_type === 'table') {
                dispatch({ type: 'ADD_TABLE_ASSET', asset: item });
              } else if (item.asset?.placement_type === 'canvas') {
                dispatch({
                  type: 'ADD_CANVAS_ASSET',
                  asset: {
                    id: crypto.randomUUID(),
                    item,
                    x: 400,
                    y: 300,
                    scale: 0.8,
                    rotation: 0,
                    flipX: false,
                    flipY: false,
                    isLocked: false,
                    rotationAllowed: item.rotation_allowed ?? true,
                  }
                });
              }
            }}
          />
        </div>

        <AxisEnvironment
          tableAssets={tableAssets}
          onRemoveTableAsset={(id) => dispatch({ type: 'REMOVE_TABLE_ASSET', id })}
        />
      </div>

      <WorkspaceGuideModal
        isOpen={infoModalOpen}
        onClose={() => dispatch({ type: 'SET_MODAL_OPEN', modal: 'info', open: false })}
      />

      <ProjectEstimateModal
        isOpen={summaryOpen}
        onClose={() => dispatch({ type: 'SET_MODAL_OPEN', modal: 'summary', open: false })}
        numberOfDays={numberOfDays}
        canvasAssets={canvasAssets}
        tableAssets={tableAssets}
      />
    </div>
  );
}

export default function AxisProductionPage() {
  return (
    <ProductionProvider>
      <AxisProductionContent />
    </ProductionProvider>
  );
}
