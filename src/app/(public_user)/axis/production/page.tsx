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
          <BallroomsSidebar isOpen={leftSidebarOpen} />

          <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
            <AxisCanvas />
          </main>

          <AssetsSidebar isOpen={rightSidebarOpen} />
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
