"use client";

import { useState, useEffect } from "react";
import { Inter, Alegreya_SC } from "next/font/google"; // Adding Inter for UI
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBallrooms } from "@/features/ballrooms/hooks/useBallrooms";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import { createClient } from "@/lib/supabase/client";

const inter = Inter({ subsets: ["latin"] });
const alegreyaSC = Alegreya_SC({ weight: ["400", "700"], subsets: ["latin"] });

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
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { ballrooms, loading: ballroomsLoading } = useBallrooms();
  const { inventory, loading: inventoryLoading } = useInventory();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    fetchCategories();

    // Responsive sidebars: open by default only on desktop
    if (window.innerWidth >= 1024) {
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
    }
  }, []);

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

  if (!mounted) return null;

  const toolBtnClass = "p-2 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-md transition-all duration-200 border border-transparent hover:border-blue-100";

  return (
    <div className={cn("flex flex-col h-screen bg-[#f8fafc] overflow-hidden text-slate-900", inter.className)}>
      {/* Top Header Section */}
      <header className="flex flex-col shrink-0 z-30">
        {/* Superior Branding Bar */}
        <div className="flex justify-between items-center py-2 px-6 bg-white border-b border-slate-200 h-14">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                B
              </div>
              <span className={cn("text-xl tracking-tight text-slate-800", alegreyaSC.className)}>
                BAEBOARD <span className="text-blue-600">AXIS</span>
              </span>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold py-0 h-5 border-blue-200 text-blue-700 bg-blue-50">
              Production
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-slate-100/80 rounded-full px-3 py-1 border border-slate-200">
              <DollarSign className="size-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-500 mr-2">Daily:</span>
              <span className="text-sm font-bold text-emerald-600">${totalDailyAmount}</span>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-blue-600"
              onClick={() => setInfoModalOpen(true)}
            >
              <Info className="size-5" />
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-9 px-4 rounded-lg shadow-sm"
              onClick={() => setSummaryOpen(true)}
            >
              <FileText className="size-4 mr-2" />
              View Summary
            </Button>
          </div>
        </div>

        {/* Dynamic Context Toolbar */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-white border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] h-12">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8 transition-colors", leftSidebarOpen && "bg-slate-100 text-blue-600")}
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            >
              <PanelLeft className="size-4" />
            </Button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <div className="flex items-center gap-0.5">
              <button className={toolBtnClass} title="Zoom In"><ZoomIn className="size-4" /></button>
              <button className={toolBtnClass} title="Zoom Out"><ZoomOut className="size-4" /></button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button className={toolBtnClass} title="Pan Left"><ChevronLeft className="size-4" /></button>
              <button className={toolBtnClass} title="Pan Right"><ChevronRight className="size-4" /></button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5 border border-slate-200">
              {[1, 2, 3].map(d => (
                <button
                  key={d}
                  onClick={() => setNumberOfDays(d)}
                  className={cn(
                    "px-3 py-1 text-xs font-bold rounded transition-all",
                    numberOfDays === d ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {d}D
                </button>
              ))}
              <Input
                type="number"
                className="w-10 h-6 p-0 border-none bg-transparent text-center text-xs font-bold focus-visible:ring-0"
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(parseInt(e.target.value) || 1)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 border-slate-300 text-slate-600 hover:bg-slate-50">
              <Save className="size-3.5" />
              Save Layout
            </Button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8 transition-colors", rightSidebarOpen && "bg-slate-100 text-blue-600")}
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            >
              <PanelRight className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main UI Body */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Professional Left Sidebar - Ballrooms */}
        <aside
          className={cn(
            "bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-20 shrink-0 shadow-[1px_0_10px_rgba(0,0,0,0.02)]",
            leftSidebarOpen ? "w-64" : "w-0 -translate-x-full opacity-0 pointer-events-none"
          )}
        >
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Layers className="size-3.5" />
              Floor Plans
            </span>
            <Button variant="ghost" size="icon" className="size-6 text-slate-400">
              <Settings className="size-3.5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div className="space-y-2">
              <div className="group relative rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Upload className="size-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700">Import Drawings</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">DWG, PDF, JPG</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Ballrooms</span>
              <div className="space-y-1">
                {ballroomsLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                ) : ballrooms.length === 0 ? (
                  <p className="text-[10px] text-slate-400 text-center py-4">No ballrooms found</p>
                ) : (
                  ballrooms.map((ballroom) => (
                    <div key={ballroom.id} className="group bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer mb-3">
                      <div className="aspect-video w-full bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                        {ballroom.image ? (
                          <img src={ballroom.image} alt={ballroom.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <Box className="size-8 text-slate-200" />
                        )}
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-bold text-slate-700 truncate">{ballroom.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[10px] text-slate-400">{ballroom.width} x {ballroom.depth} {ballroom.unit_type}</p>
                          <Badge variant="outline" className="text-[8px] h-3.5 px-1 font-bold border-slate-200 text-slate-400 capitalize">
                            {ballroom.unit_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/30">
            <Button variant="ghost" className="w-full justify-start text-[11px] font-bold text-slate-500 hover:text-blue-600 h-8 gap-2">
              <History className="size-3.5" />
              Version History
            </Button>
          </div>
        </aside>

        {/* Central Workspace area - Maximize canvas */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#f1f5f9] relative">

          {/* Main Canvas Area */}
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
            {/* The Actual Canvas Container - Remove inner card padding, maximize space */}
            <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm relative group">
              {/* Floating Canvas Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="bg-white/90 backdrop-blur shadow-md hover:bg-white" onClick={() => { }}>
                  <Maximize2 className="size-4" />
                </Button>
              </div>

              {/* Canvas Ruler/Grid Placeholder */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

              <div
                id="myCanvas"
                className="w-full h-full min-h-[400px]"
              />

              {/* Selection Properties Overlay (When item is selected) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur border border-slate-200 rounded-xl shadow-2xl z-10 scale-90 md:scale-100">
                <div className="flex items-center gap-0.5 px-2">
                  <button className={toolBtnClass} title="Scale Up"><ArrowUp className="size-3.5" /></button>
                  <button className={toolBtnClass} title="Scale Down"><ArrowDown className="size-3.5" /></button>
                  <div className="w-px h-3 bg-slate-200 mx-1" />
                  <button className={toolBtnClass} title="Flip"><FlipVertical className="size-3.5" /></button>
                  <button className={toolBtnClass} title="Rotate"><FlipHorizontal className="size-3.5" /></button>
                  <div className="w-px h-3 bg-slate-200 mx-1" />
                  <button className={toolBtnClass} title="Send Back"><ArrowDownToLine className="size-3.5" /></button>
                  <button className={toolBtnClass} title="Bring Front"><ArrowUpFromLine className="size-3.5" /></button>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <Button variant="ghost" size="icon" className="size-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            {/* Bottom Accessories Panel (Tech Table / Case) - Compacted */}
            <div className="flex gap-4 h-48 shrink-0">
              <div className="flex-[2] bg-slate-200/30 rounded-xl border border-slate-300 relative overflow-hidden group">

                <div className="absolute inset-0 flex items-center justify-center p-4 pt-10">
                  <img src="/axis/table.png" alt="Tech Table" className="h-full w-auto object-contain" />
                </div>
                <div id="techAssetsContainer" className="absolute inset-0 flex items-center justify-center gap-2 p-4 pt-10" />
              </div>

              <div className="flex-1 bg-slate-200/30 rounded-xl border border-slate-300 relative overflow-hidden group">

                <div className="absolute inset-0 flex items-center justify-center p-4 pt-10">
                  <img src="/axis/case.png" alt="Cable Case" className="h-full w-auto object-contain" />
                </div>
                <div id="hardwareAssetsContainer" className="absolute inset-0 grid grid-cols-3 gap-1.5 p-3 pt-10" />
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - High Spec Assets Library */}
        <aside
          className={cn(
            "bg-white border-l border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-20 shrink-0 shadow-[-1px_0_10px_rgba(0,0,0,0.02)]",
            rightSidebarOpen ? "w-[300px]" : "w-0 translate-x-full opacity-0 pointer-events-none"
          )}
        >
          <div className="p-4 flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid className="size-3.5" />
                Assets Library
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <Input
                placeholder="Search gear..."
                className="h-9 pl-9 text-xs bg-white border-slate-200 shadow-none focus-visible:ring-blue-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="p-2 bg-white border-b border-slate-100">
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
              {atlasCategories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.name] || LayoutGrid;
                const isActive = activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5",
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    )}
                  >
                    {Icon && <Icon className="size-3" />}
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3">
              {inventoryLoading ? (
                <div className="col-span-2 flex justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                inventory
                  .filter(item =>
                    item.approval_status === 'approved' &&
                    (!activeCategoryId || item.asset?.category_id === activeCategoryId) &&
                    (!searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.asset?.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="group bg-white border border-slate-100 rounded-xl p-3 flex flex-col items-center text-center gap-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-grab active:cursor-grabbing"
                    >
                      <div className="w-full aspect-square bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors overflow-hidden">
                        {item.asset?.image ? (
                          <img src={item.asset.image} alt={item.title || item.asset.name} className="w-full h-full object-contain" />
                        ) : (
                          <Box className="size-8 text-slate-300 group-hover:text-blue-200" />
                        )}
                      </div>
                      <div className="w-full">
                        <p className="text-[11px] font-bold text-slate-700 truncate w-full">{item.title || item.asset?.name || 'Unknown Item'}</p>
                        <div className="flex items-center justify-center gap-1 mt-1 text-emerald-600">
                          <span className="text-[10px] font-bold">${item.pricing || 0}</span>
                          <span className="text-[8px] text-slate-400 font-medium">/ Day</span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
              {!inventoryLoading && inventory.filter(item =>
                item.approval_status === 'approved' &&
                (!activeCategoryId || item.asset?.category_id === activeCategoryId) &&
                (!searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.asset?.name.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <Box className="size-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">No items found</p>
                  </div>
                )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active List</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">3 Items</span>
            </div>
            <div className="space-y-2">
              {/* Small summary line items */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600 font-medium truncate flex-1">Wireless Mic System</span>
                <span className="font-bold text-slate-800">$25.00</span>
              </div>
            </div>
          </div>
        </aside>
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
                Got it, let's build
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
      `}</style>
    </div>
  );
}

