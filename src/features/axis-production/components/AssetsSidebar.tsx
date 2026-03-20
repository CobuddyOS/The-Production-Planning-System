import { useState } from "react";
import { LayoutGrid, Search, Box } from "lucide-react";
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
                "h-full overflow-hidden border-l border-white/5 bg-[radial-gradient(120%_85%_at_50%_100%,rgba(255,255,255,0.06)_0%,rgba(56,189,248,0.22)_35%,rgba(0,0,0,0.7)_70%)] backdrop-blur-xl flex flex-col min-w-0 min-h-0",
                !isOpen && "pointer-events-none"
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
                    {categories.map((cat) => {
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
                        visibleInventory.map((item) => {
                            const isCanvasItem = item.asset?.placement_type === "canvas";
                            const isTableItem = item.asset?.placement_type === "table";
                            const canPlace = hasBallroom && (isCanvasItem || isTableItem);

                            return (
                                <div
                                    key={item.id}
                                    title={[
                                        item.title || item.asset?.name || "Unknown Item",
                                        item.brand ? `Brand: ${item.brand}` : null,
                                        item.model ? `Model: ${item.model}` : null,
                                        item.quantity ? `Qty: ${item.quantity}` : null,
                                        item.pricing ? `Price: $${item.pricing}/Day` : null,
                                        (!isCanvasItem && !isTableItem) ? `(Placement: ${item.asset?.placement_type})` : null,
                                        (!hasBallroom && (isCanvasItem || isTableItem)) ? "(Select a ballroom first)" : null,
                                    ]
                                        .filter(Boolean)
                                        .join("\n")}
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
                                        "group bg-white/5 rounded-lg p-2 flex flex-col items-center text-center gap-1.5 shadow-[0_0_18px_rgba(0,0,0,0.35)] transition-all",
                                        canPlace
                                            ? "hover:shadow-[0_0_28px_rgba(56,189,248,0.18)] cursor-grab active:cursor-grabbing hover:bg-white/10"
                                            : "cursor-not-allowed opacity-40 grayscale"
                                    )}
                                >
                                    <div className={cn(
                                        "w-full aspect-square bg-black/20 rounded-md flex items-center justify-center overflow-hidden transition-colors",
                                        canPlace && "group-hover:bg-white/5"
                                    )}>
                                        {item.asset?.image ? (
                                            <img
                                                src={item.asset.image}
                                                alt={item.title || item.asset.name}
                                                className="w-full h-full object-contain pointer-events-none"
                                            />
                                        ) : (
                                            <Box className={cn("size-8 text-white/30", canPlace && "group-hover:text-emerald-200")} />
                                        )}
                                    </div>
                                </div>
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
            </div>
        </aside>
    );
}
