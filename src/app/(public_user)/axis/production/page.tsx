"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  PanelLeft,
  PanelRight,
  ArrowUp,
  ArrowDown,
  FlipVertical,
  FlipHorizontal,
  ArrowDownToLine,
  ArrowUpFromLine,
  Trash2,
  Info,
  Maximize2,
  Save,
  Upload,
  Box,
  X,
  DollarSign,
  CalendarDays,
  FileText,
  LayoutGrid,
  Mic2,
  Video,
  Lightbulb,
  Cable,
  Briefcase,
  History,
  Settings,
  Layers,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useBallrooms } from "@/features/ballrooms/hooks/useBallrooms";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import { createClient } from "@/lib/supabase/client";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Audio: Mic2,
  Video: Video,
  Lighting: Lightbulb,
  "Tech Table Items": LayoutGrid,
  "Cable Trunk Hardware": Cable,
};

type AtlasCategory = {
  id: string;
  name: string;
};

export default function AxisProductionPage() {
  const [mounted, setMounted] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [atlasCategories, setAtlasCategories] = useState<AtlasCategory[]>([]);
  const [totalDailyAmount, setTotalDailyAmount] = useState("0.00");
  const [numberOfDays] = useState(1);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { ballrooms, loading: ballroomsLoading } = useBallrooms();
  const { inventory, loading: inventoryLoading } = useInventory();
  const supabase = createClient();

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("atlas_categories")
      .select("id, name")
      .eq("status", "active")
      .order("name");

    if (data) {
      setAtlasCategories(data);
      if (data.length > 0 && !activeCategoryId) {
        setActiveCategoryId(data[0].id);
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCategories();

    // Responsive sidebars: open by default only on desktop
    if (window.innerWidth >= 1024) {
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
    }
  }, []);

  if (!mounted) return null;

  const toolBtnClass = "h-8 w-8 p-0 rounded-md transition-all duration-200 border border-white/10 text-white/70 bg-white/5 hover:text-white hover:bg-white/10";
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredInventory = inventory.filter((item) => {
    const isApproved = item.approval_status === "approved" || !item.approval_status;
    if (!isApproved) return false;
    if (!activeCategoryId) return true;
    if (!item.asset?.category_id) return true;
    return item.asset.category_id === activeCategoryId;
  });
  const visibleInventory = filteredInventory.filter((item) => {
    if (!normalizedSearch) return true;
    return (
      item.title?.toLowerCase().includes(normalizedSearch) ||
      item.asset?.name.toLowerCase().includes(normalizedSearch)
    );
  });

  return (
    <div className="flex flex-col h-screen bg-transparent overflow-hidden text-white font-montserrat">
      {/* Top Header Section */}
      <header className="flex flex-col shrink-0 z-30">
        {/* Dynamic Context Toolbar */}
        <Card className="flex flex-row items-center justify-between px-4 py-1.5 rounded-none h-12 border-0 !shadow-none !bg-[linear-gradient(90deg,rgba(6,10,18,0.7),rgba(10,36,54,0.45),rgba(6,10,18,0.7))]">
          <div className="flex items-center gap-2 mt-2">
            <Image
              src="/cobuddy_logo.png"
              alt="Cobuddy"
              width={300}
              height={300}
              className="h-20 w-auto object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8 transition-colors hover:bg-white/10", leftSidebarOpen && "bg-white/10 text-white")}
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            >
              <PanelLeft className="size-4" />
            </Button>
            <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className={toolBtnClass} title="Zoom In"><ZoomIn className="size-4" /></Button>
              <Button variant="ghost" size="icon" className={toolBtnClass} title="Zoom Out"><ZoomOut className="size-4" /></Button>
              <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />
              <Button variant="ghost" size="icon" className={toolBtnClass} title="Pan Left"><ChevronLeft className="size-4" /></Button>
              <Button variant="ghost" size="icon" className={toolBtnClass} title="Pan Right"><ChevronRight className="size-4" /></Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 border-white/15 text-white/80 hover:bg-white/10 hover:text-white">
              <Save className="size-3.5" />
              Save Layout
            </Button>
            <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />
            <div className="hidden md:flex items-center gap-2 rounded-full px-3 py-1 bg-white/5">
              <DollarSign className="size-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-white/60 mr-2">Daily:</span>
              <span className="text-sm font-bold text-emerald-300">${totalDailyAmount}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setInfoModalOpen(true)}
            >
              <Info className="size-5" />
            </Button>
            <Button
              className="bg-[linear-gradient(120deg,rgba(14,165,233,0.9),rgba(132,204,22,0.7))] hover:brightness-110 text-white font-semibold h-8 px-4 rounded-lg shadow-[0_0_18px_rgba(14,165,233,0.35)]"
              onClick={() => setSummaryOpen(true)}
            >
              <FileText className="size-4 mr-2" />
              View Summary
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8 transition-colors hover:bg-white/10", rightSidebarOpen && "bg-white/10 text-white")}
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            >
              <PanelRight className="size-4" />
            </Button>
          </div>
        </Card>
      </header>

      {/* Main UI Body */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <div className="flex flex-1 overflow-hidden">
          {/* Professional Left Sidebar - Ballrooms */}
          <aside
            className={cn(
              "mb-3 rounded-2xl overflow-hidden border-r border-white/5 bg-[radial-gradient(120%_85%_at_50%_100%,rgba(255,255,255,0.06)_0%,rgba(56,189,248,0.22)_35%,rgba(0,0,0,0.7)_70%)] backdrop-blur-xl flex flex-col transition-all duration-300 ease-in-out z-20 shrink-0",
              leftSidebarOpen ? "w-35" : "w-0 -translate-x-full opacity-0 pointer-events-none"
            )}
          >
            

            <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-4">
             

              <div className="pt-3">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3 block">Ballrooms</span>
                <div className="grid grid-cols-1 gap-2 justify-items-center">
                  {ballroomsLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-300"></div>
                    </div>
                  ) : ballrooms.length === 0 ? (
                    <p className="text-[10px] text-white/60 text-center py-4">No ballrooms found</p>
                  ) : (
                    ballrooms.map((ballroom) => (
                      <div key={ballroom.id} className="group bg-white/5 rounded-lg overflow-hidden shadow-[0_0_18px_rgba(0,0,0,0.35)] hover:shadow-[0_0_28px_rgba(56,189,248,0.18)] transition-all cursor-pointer w-[92px] h-[92px]">
                        <div className="h-full w-full bg-black/20 flex items-center justify-center overflow-hidden">
                          {ballroom.image ? (
                            <img src={ballroom.image} alt={ballroom.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <Box className="size-8 text-white/30" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </aside>

          {/* Central Workspace area - Maximize canvas */}
          <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">

            {/* Main Canvas Area */}
            <div className="flex-1 p-2 flex flex-col gap-2 overflow-hidden">
              {/* The Actual Canvas Container - Remove inner card padding, maximize space */}
            <div className="flex-1 overflow-hidden rounded-xl neon-glass-card shadow-[0_0_35px_rgba(56,189,248,0.25)] relative group">
                {/* Floating Canvas Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="bg-white/90 backdrop-blur shadow-md hover:bg-white" onClick={() => { }}>
                    <Maximize2 className="size-4" />
                  </Button>
                </div>

                {/* Canvas Ruler/Grid Placeholder */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

                <div
                  id="myCanvas"
                  className="w-full h-full min-h-[400px]"
                />

                {/* Selection Properties Overlay (When item is selected) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-black/40 backdrop-blur border border-white/15 rounded-xl shadow-[0_0_24px_rgba(34,197,94,0.25)] z-10 scale-90 md:scale-100">
                <div className="flex items-center gap-0.5 px-2">
                  <Button variant="ghost" size="icon" className={toolBtnClass} title="Scale Up"><ArrowUp className="size-3.5" /></Button>
                  <Button variant="ghost" size="icon" className={toolBtnClass} title="Scale Down"><ArrowDown className="size-3.5" /></Button>
                    <Separator orientation="vertical" className="h-3 bg-white/20 mx-1" />
                    <Button variant="ghost" size="icon" className={toolBtnClass} title="Flip"><FlipVertical className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon" className={toolBtnClass} title="Rotate"><FlipHorizontal className="size-3.5" /></Button>
                    <Separator orientation="vertical" className="h-3 bg-white/20 mx-1" />
                    <Button variant="ghost" size="icon" className={toolBtnClass} title="Send Back"><ArrowDownToLine className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon" className={toolBtnClass} title="Bring Front"><ArrowUpFromLine className="size-3.5" /></Button>
                  </div>
                  <Separator orientation="vertical" className="h-8 bg-white/20" />
                  <Button variant="ghost" size="icon" className="size-8 text-rose-300 hover:bg-white/10 hover:text-rose-200 rounded-lg">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

            </div>
          </main>

          {/* Right Sidebar - High Spec Assets Library */}
          <aside
            className={cn(
              "mb-3 rounded-2xl overflow-hidden border-l border-white/5 bg-[radial-gradient(120%_85%_at_50%_100%,rgba(255,255,255,0.06)_0%,rgba(56,189,248,0.22)_35%,rgba(0,0,0,0.7)_70%)] backdrop-blur-xl flex flex-col transition-all duration-300 ease-in-out z-20 shrink-0",
              rightSidebarOpen ? "w-[320px]" : "w-0 translate-x-full opacity-0 pointer-events-none"
            )}
          >
            <div className="p-3 flex flex-col gap-3 bg-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid className="size-3.5" />
                  Assets Library
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
                <Input
                  placeholder="Search gear..."
                  className="h-8 pl-9 text-xs bg-white/5 border-white/15 text-white placeholder:text-white/40 shadow-none focus-visible:ring-sky-500/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="p-2 bg-white/5">
              <div className="grid grid-cols-6 gap-1">
                {atlasCategories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.name] || LayoutGrid;
                  const isActive = activeCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryId(cat.id)}
                      title={cat.name}
                      className={cn(
                        "h-8 w-8 rounded-lg transition-all flex items-center justify-center",
                        isActive
                          ? "bg-white/15 text-white shadow-[0_0_16px_rgba(56,189,248,0.35)]"
                          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {Icon && <Icon className="size-4" />}
                      <span className="sr-only">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
              <div className="grid grid-cols-3 gap-2">
                {inventoryLoading ? (
                  <div className="col-span-3 flex justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-300"></div>
                  </div>
                ) : (
                  visibleInventory.map((item) => (
                      <div
                        key={item.id}
                        title={[
                          item.title || item.asset?.name || "Unknown Item",
                          item.brand ? `Brand: ${item.brand}` : null,
                          item.model ? `Model: ${item.model}` : null,
                          item.quantity ? `Qty: ${item.quantity}` : null,
                          item.pricing ? `Price: $${item.pricing}/Day` : null,
                        ]
                          .filter(Boolean)
                          .join("\n")}
                        className="group bg-white/5 rounded-lg p-2 flex flex-col items-center text-center gap-1.5 shadow-[0_0_18px_rgba(0,0,0,0.35)] hover:shadow-[0_0_28px_rgba(56,189,248,0.18)] transition-all cursor-grab active:cursor-grabbing"
                      >
                        <div className="w-full aspect-square bg-black/20 rounded-md flex items-center justify-center group-hover:bg-white/5 transition-colors overflow-hidden">
                          {item.asset?.image ? (
                            <img src={item.asset.image} alt={item.title || item.asset.name} className="w-full h-full object-contain" />
                          ) : (
                            <Box className="size-8 text-white/30 group-hover:text-emerald-200" />
                          )}
                        </div>
                      </div>
                    ))
                )}
                {!inventoryLoading && visibleInventory.length === 0 && (
                    <div className="col-span-3 text-center py-8">
                      <Box className="size-8 text-white/30 mx-auto mb-2" />
                      <p className="text-[10px] font-bold text-white/50 uppercase">No items found</p>
                    </div>
                  )}
              </div>
            </div>

          </aside>
        </div>

        <div className="px-4 pb-3">
          <div className="flex gap-4 h-40">
              <div className="flex-[2.0] bg-white/5 rounded-xl relative overflow-hidden group backdrop-blur">
              <div className="absolute inset-0 flex items-center justify-center p-1 pt-2">
                <img src="/axis/table.png" alt="Tech Table" className="h-[250%] w-[250%] object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.35)]" />
              </div>
                <div id="techAssetsContainer" className="absolute inset-0 flex items-center justify-center gap-2 p-3 pt-6" />
              </div>

              <div className="flex-1 bg-white/5 rounded-xl relative overflow-hidden group backdrop-blur">
              <div className="absolute inset-0 flex items-center justify-center p-2 pt-6">
                <img src="/axis/case.png" alt="Cable Case" className="h-[150%] w-[150%] object-contain scale-110 drop-shadow-[0_0_18px_rgba(14,165,233,0.35)]" />
              </div>
                <div id="hardwareAssetsContainer" className="absolute inset-0 grid grid-cols-3 gap-1.5 p-3 pt-10" />
              </div>

              <div className="flex-[1.3] bg-white/5 rounded-xl relative overflow-hidden group backdrop-blur">
              <div className="absolute inset-0 flex items-center justify-center p-2 pt-4">
                <img src="/staff.png" alt="Staff" className="h-[150%] w-[150%] object-contain scale-125 drop-shadow-[0_0_22px_rgba(132,204,22,0.7)]" />
              </div>
              </div>

              <div className="flex-[0.9] bg-white/5 rounded-xl relative overflow-hidden backdrop-blur">
                <div className="absolute inset-0 flex items-center justify-center gap-6 p-4 pt-8">
                  {["Frequency", "Color"].map((label) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-semibold text-white/70 uppercase tracking-[0.2em]">{label}</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        defaultValue={60}
                        className="axis-slider h-28 w-3"
                        style={{ writingMode: "vertical-rl" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      {/* (Keeping existing modal structures but cleaning up the styles) */}

      {infoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg border-none shadow-2xl rounded-2xl overflow-hidden p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Info className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Workspace Guide</h2>
                    <p className="text-xs text-slate-500 font-medium">Master the production tools</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setInfoModalOpen(false)}>
                  <X className="size-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Select Venue", text: "Drag a floor plan from the left library onto the canvas to begin your layout.", icon: Layers },
                  { title: "Place Equipment", text: "Drag items from the asset library. Use the tech area for compact placement.", icon: LayoutGrid },
                  { title: "Precision Tuning", text: "Select an item to scale, flip, or change its layer priority.", icon: Settings },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-sm">
                      <step.icon className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 h-10 font-bold"
                onClick={() => setInfoModalOpen(false)}
              >
                Got it, let&apos;s build
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Summary Popup - Same Cleanup Pattern */}
      {summaryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl border-none shadow-2xl rounded-2xl overflow-hidden p-0 bg-white">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Project Estimate</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSummaryOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-bold text-slate-400">ITEM</th>
                      <th className="p-3 font-bold text-slate-400">QTY</th>
                      <th className="p-3 font-bold text-slate-400 text-right">UNIT</th>
                      <th className="p-3 font-bold text-slate-400 text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 last:border-0">
                      <td className="p-3">
                        <p className="font-bold text-slate-800">Wireless Mic System</p>
                        <p className="text-[10px] text-slate-400">Handheld Shure QLXD</p>
                      </td>
                      <td className="p-3 font-medium">02</td>
                      <td className="p-3 text-right font-medium">$25.00</td>
                      <td className="p-3 text-right font-bold text-blue-600">$50.00</td>
                    </tr>
                    {/* Placeholder empty state */}
                    <tr>
                      <td colSpan={4} className="p-8 text-center bg-slate-50/50">
                        <div className="flex flex-col items-center gap-1">
                          <Box className="size-8 text-slate-200" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">More items coming from backend</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Equipment Total</p>
                  <p className="text-xl font-black text-slate-900">$50.00</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Event Duration</p>
                  <p className="text-xl font-black text-slate-900">{numberOfDays} Days</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                  <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1 text-white">Project Total</p>
                  <p className="text-xl font-black text-white">${50 * numberOfDays}.00</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="outline" className="flex-1 h-11 font-bold border-slate-200">Download PDF</Button>
                <Button className="flex-[2] h-11 font-bold bg-blue-600 hover:bg-blue-700">Submit for Approval</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Custom Styles to remove scrollbars while maintaining functionality */}
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
