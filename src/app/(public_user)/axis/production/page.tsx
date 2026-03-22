"use client";

import { AxisHeader } from "@/features/axis-production/components/AxisHeader";
import { BallroomsSidebar } from "@/features/axis-production/components/BallroomsSidebar";
import { AxisCanvas } from "@/features/axis-production/components/AxisCanvas";
import { AssetsSidebar } from "@/features/axis-production/components/AssetsSidebar";
import { AxisEnvironment } from "@/features/axis-production/components/AxisEnvironment";
import { WorkspaceGuideModal } from "@/features/axis-production/components/WorkspaceGuideModal";
import { ProjectEstimateModal } from "@/features/axis-production/components/ProjectEstimateModal";
import { ProductionProvider, useProduction } from "@/features/axis-production/context/ProductionContext";
import { LAYOUT } from "@/features/axis-production/constants";

function AxisProductionContent() {
  const {
    mounted,
    leftSidebarOpen,
    rightSidebarOpen,
    selectedBallroomImage,
    selectedBallroomId,
    canvasAssets,
    tableAssets,
    selectedAssetIds,
    infoModalOpen,
    summaryOpen,
    dispatch,
  } = useProduction();

  const numberOfDays = 1;

  if (!mounted) return null;

  const { rows, middle, bottom } = LAYOUT;

  /**
   * CSS Grid row template:
   *   Row 1 → Header  (fixed `fr` ratio)
   *   Row 2 → Middle  (flexible `fr` ratio)
   *   Row 3 → Bottom  (fixed `fr` ratio)
   */
  const gridRowTemplate = `auto ${rows.middle}fr ${rows.bottom}fr`;

  /**
   * Middle-section column template.
   * When a sidebar collapses its track becomes 0fr, and the canvas track
   * absorbs the freed space automatically.
   */
  const middleColTemplate = [
    leftSidebarOpen ? `${middle.ballroom}fr` : "0fr",
    `${middle.canvas}fr`,
    rightSidebarOpen ? `${middle.assets}fr` : "0fr",
  ].join(" ");

  /**
   * Bottom-section column template.
   * Inherits the width toggles of the top columns matching the prompt's layout.
   */
  const bottomColTemplate = [
    leftSidebarOpen ? `${bottom.nio}fr` : "0fr",
    `${bottom.table}fr ${bottom.case}fr`,
    rightSidebarOpen ? `${bottom.staff}fr ${bottom.slider}fr` : "0fr 0fr",
  ].join(" ");

  return (
    <div
      className="h-screen bg-transparent overflow-hidden text-white font-montserrat"
      style={{
        display: "grid",
        gridTemplateRows: gridRowTemplate,
      }}
    >
      {/* ─── Row 1: Header ─── */}
      <AxisHeader
        leftSidebarOpen={leftSidebarOpen}
        setLeftSidebarOpen={(open) => dispatch({ type: 'TOGGLE_LEFT_SIDEBAR', open })}
        rightSidebarOpen={rightSidebarOpen}
        setRightSidebarOpen={(open) => dispatch({ type: 'TOGGLE_RIGHT_SIDEBAR', open })}
        onOpenSummary={() => dispatch({ type: 'SET_MODAL_OPEN', modal: 'summary', open: true })}
        onOpenGuide={() => dispatch({ type: 'SET_MODAL_OPEN', modal: 'info', open: true })}
        eventName="Summer Gala"
      />

      {/* ─── Row 2: Middle (Ballroom | Canvas | Assets) ─── */}
      <div
        className="min-h-0 min-w-0"
        style={{
          display: "grid",
          gridTemplateColumns: middleColTemplate,
          transition: "grid-template-columns 300ms ease-in-out",
        }}
      >
        <BallroomsSidebar
          isOpen={leftSidebarOpen}
          selectedBallroomId={selectedBallroomId}
          onSelectBallroom={(id, image) => dispatch({ type: 'SET_BALLROOM', id, image })}
        />

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

      {/* ─── Row 3: Bottom (NIO | Table | Case | Staff | Slider) ─── */}
      <div
        className="min-h-0 min-w-0"
        style={{
          display: "grid",
          gridTemplateColumns: bottomColTemplate,
        }}
      >
        <AxisEnvironment
          tableAssets={tableAssets}
          onRemoveTableAsset={(id) => dispatch({ type: 'REMOVE_TABLE_ASSET', id })}
        />
      </div>

      {/* ─── Modals ─── */}
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
