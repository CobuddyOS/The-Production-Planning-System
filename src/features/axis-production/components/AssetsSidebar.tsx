import { useState } from "react";
import { LayoutGrid, Search, Box } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import { useAtlasCategories } from "@/features/axis-production/hooks/useAtlasCategories";
import { CATEGORY_ICONS } from "../constants";

import { Asset } from "../types";

interface AssetsSidebarProps {
    isOpen: boolean;
    hasBallroom: boolean;
    onAddAsset: (item: Asset) => void;
}


export function AssetsSidebar({ isOpen, hasBallroom, onAddAsset }: AssetsSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const { inventory, loading: inventoryLoading } = useInventory();
    const { categories, activeCategoryId, setActiveCategoryId } = useAtlasCategories();

    const normalizedSearch = searchQuery.trim().toLowerCase();

    const filteredInventory = inventory.filter((item) => {
        const isApproved = item.approval_status === "approved" || !item.approval_status;
        if (!isApproved) return false;
        if (!activeCategoryId) return true;
        return item.asset?.category_id === activeCategoryId;
    });

    const visibleInventory = filteredInventory.filter((item) => {
        if (!normalizedSearch) return true;
        return (
            item.title?.toLowerCase().includes(normalizedSearch) ||
            item.asset?.name.toLowerCase().includes(normalizedSearch)
        );
    });

    return (
        <aside
            className={cn(
                "h-full overflow-hidden bg-zinc-950/80 backdrop-blur-xl flex flex-col min-w-0 min-h-0",
                !isOpen && "pointer-events-none"
            )}
        >
            <div className="p-4 pb-2 pt-6 flex flex-col gap-3">
                <span className="text-[12px] font-bold text-white/60 uppercase tracking-[0.25em] block text-center">
                    Assets Library
                </span>

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

            <div className="p-2 border-t border-white/5">
                <div className="grid grid-cols-6 gap-1">
                    {categories.map((cat) => {
                        // Resilient icon lookup: try exact match, then case-insensitive match, then fallback
                        const iconKey = Object.keys(CATEGORY_ICONS).find(
                            (key) => key.toLowerCase() === cat.name?.toLowerCase()
                        );
                        const Icon = (iconKey ? CATEGORY_ICONS[iconKey] : CATEGORY_ICONS[cat.name]) || LayoutGrid;
                        const isActive = activeCategoryId === cat.id;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategoryId(cat.id)}
                                title={cat.name}
                                className={cn(
                                    "h-8 w-8 rounded-xl transition-all flex items-center justify-center relative group",
                                    isActive
                                        ? "bg-white/15 text-white shadow-[0_0_16px_rgba(56,189,248,0.35)]"
                                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <Icon className="size-4 relative z-10" />
                                {isActive && (
                                    <div className="absolute inset-0 rounded-xl bg-sky-500/10 animate-pulse pointer-events-none" />
                                )}
                                <span className="sr-only">{cat.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
                <TooltipProvider delayDuration={100}>
                    <div className="grid grid-cols-3 gap-3">
                        {inventoryLoading ? (
                            <div className="col-span-3 flex justify-center p-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-300"></div>
                            </div>
                        ) : (
                            visibleInventory.map((item) => {
                                const isCanvasItem = item.asset?.placement_type === "canvas";
                                const isTableItem = item.asset?.placement_type === "table";
                                const canPlace = hasBallroom && (isCanvasItem || isTableItem);

                                return (
                                    <Tooltip key={item.id}>
                                        <TooltipTrigger asChild>
                                            <div
                                                onClick={() => canPlace && onAddAsset(item)}
                                                draggable={isCanvasItem && canPlace}
                                                onDragStart={(e) => {
                                                    if (canPlace) {
                                                        e.dataTransfer.setData("application/json", JSON.stringify(item));
                                                        e.dataTransfer.effectAllowed = "copy";
                                                    } else {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                className={cn(
                                                    "group flex flex-col items-center gap-1.5 transition-all outline-none",
                                                    canPlace ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed opacity-40 grayscale"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "w-full aspect-square bg-white/[0.08] border border-white/10 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative",
                                                        canPlace && "group-hover:bg-white/[0.12] group-hover:border-sky-500/50 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] group-hover:scale-[1.02]"
                                                    )}
                                                    style={{
                                                        backgroundImage: `
                                                            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                                                            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                                                        `,
                                                        backgroundSize: '8px 8px'
                                                    }}
                                                >
                                                    {/* Core Lighting Highlight */}
                                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-bottom from-white/[0.05] to-transparent pointer-events-none" />

                                                    {item.asset?.image ? (
                                                        <img
                                                            src={item.asset.image}
                                                            alt={item.title || item.asset.name}
                                                            className="w-full h-full object-contain p-3 relative z-10 pointer-events-none transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <Box className={cn("size-8 text-white/30 relative z-10", canPlace && "group-hover:text-sky-300")} />
                                                    )}
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" hideArrow className="bg-zinc-900/95 border-white/10 backdrop-blur-xl">
                                            <span className="text-[10px] font-bold text-[#bef264] uppercase tracking-wider">
                                                {item.title || item.asset?.name}
                                            </span>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })
                        )}
                        {!inventoryLoading && visibleInventory.length === 0 && (
                            <div className="col-span-3 text-center py-8">
                                <Box className="size-8 text-white/30 mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-white/50 uppercase">
                                    No items found
                                </p>
                            </div>
                        )}
                    </div>
                </TooltipProvider>
            </div>
        </aside>
    );
}
