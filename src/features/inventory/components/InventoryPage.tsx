"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import {
    Search,
    Plus,
    Box,
    Store,
    Trash2,
    Edit3,
    Eye,
    MapPin,
    LayoutList,
    Check,
    SlidersHorizontal,
    ArrowRight,
    MoreVertical,
    Package,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInventory } from "../hooks/useInventory";
import { ImportAssetDialog } from "./ImportAssetDialog";
import { UpdateInventoryItemDialog } from "./UpdateInventoryItemDialog";
import { DeleteInventoryItemDialog } from "./DeleteInventoryItemDialog";
import { WarehouseItemViewSheet } from "./WarehouseItemViewSheet";
import { AssetDetailsSheet } from "@/features/atlas/assets/components/AssetDetailsSheet";
import { WarehouseItemSchemaValues } from "../schemas";
import { AtlasAsset } from "@/features/atlas/assets/types";
import { WarehouseItem } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

export function InventoryPage() {
    const { catalog, inventory, loading, importAsset, updateItem, deleteItem } = useInventory();
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"catalog" | "warehouse">("catalog");

    // Selection states
    const [importingAsset, setImportingAsset] = useState<AtlasAsset | null>(null);
    const [viewingAsset, setViewingAsset] = useState<AtlasAsset | null>(null);
    const [viewingItem, setViewingItem] = useState<WarehouseItem | null>(null);
    const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<WarehouseItem | null>(null);

    // Filter states for catalog
    const [catCategory, setCatCategory] = useState<string | null>(null);
    const [catScale, setCatScale] = useState<string | null>(null);
    const [catPlacement, setCatPlacement] = useState<string | null>(null);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(catalog.map(a => a.atlas_categories?.name).filter(Boolean)));
        return unique as string[];
    }, [catalog]);

    const filteredCatalog = useMemo(() => {
        return catalog.filter(asset => {
            const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
                (asset.atlas_categories?.name?.toLowerCase().includes(search.toLowerCase()) ?? false);

            const matchesCategory = !catCategory || asset.atlas_categories?.name === catCategory;
            const matchesScale = !catScale || asset.default_scale === catScale;
            const matchesPlacement = !catPlacement || asset.placement_type === catPlacement;

            return matchesSearch && matchesCategory && matchesScale && matchesPlacement;
        });
    }, [catalog, search, catCategory, catScale, catPlacement]);

    const activeFiltersCount = [catCategory, catScale, catPlacement].filter(Boolean).length;

    const filteredInventory = useMemo(() => {
        return inventory.filter(item =>
            (item.title?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
            (item.asset?.name.toLowerCase().includes(search.toLowerCase()) ?? false) ||
            (item.brand?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
            (item.model?.toLowerCase().includes(search.toLowerCase()) ?? false)
        );
    }, [inventory, search]);

    const handleImport = async (values: WarehouseItemSchemaValues) => {
        const result = await importAsset(values);
        if (result.success) {
            setImportingAsset(null);
            setActiveTab("warehouse");
        } else {
            throw result.error;
        }
    };

    const handleUpdate = async (id: string, values: Partial<WarehouseItemSchemaValues>) => {
        const result = await updateItem(id, values);
        if (result.success) {
            setEditingItem(null);
        } else {
            throw result.error;
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteItem(id);
        if (result.success) {
            setDeletingItem(null);
        } else {
            throw result.error;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Inventory Hub</h2>
                    <p className="text-sm text-muted-foreground">
                        Import global assets and manage your warehouse operations.
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                <div className="flex p-1 bg-muted/40 rounded-lg w-fit border border-border/50">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("catalog")}
                        className={`h-8 px-4 text-xs font-medium gap-2 transition-all cursor-pointer rounded-md ${activeTab === "catalog"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Store className="size-3.5" /> Global Catalog
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("warehouse")}
                        className={`h-8 px-4 text-xs font-medium gap-2 transition-all cursor-pointer rounded-md ${activeTab === "warehouse"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Box className="size-3.5" /> My Warehouse
                        {inventory.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-semibold bg-primary/10 text-primary border-none">
                                {inventory.length}
                            </Badge>
                        )}
                    </Button>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    {activeTab === 'catalog' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 rounded-lg gap-2 cursor-pointer relative">
                                    <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                                    <span className="hidden sm:inline text-sm font-medium">Filters</span>
                                    {activeFiltersCount > 0 && (
                                        <Badge variant="default" className="h-4 min-w-4 p-0 flex items-center justify-center text-[9px] rounded-full absolute -top-1.5 -right-1.5 border border-background">
                                            {activeFiltersCount}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 rounded-lg">
                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Filter Assets</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="p-2 space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground px-2 tracking-wider">Category</p>
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCatCategory(catCategory === cat ? null : cat)}
                                                className={`w-full text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${catCategory === cat ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                                                    }`}
                                            >
                                                {cat}
                                                {catCategory === cat && <Check className="size-3" />}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground px-2 tracking-wider">Scale</p>
                                        <div className="flex flex-wrap gap-1 px-1">
                                            {['low', 'medium', 'large'].map(s => (
                                                <Button
                                                    key={s}
                                                    variant={catScale === s ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCatScale(catScale === s ? null : s)}
                                                    className="h-7 text-[10px] font-semibold uppercase px-2.5 rounded-md"
                                                >
                                                    {s}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground px-2 tracking-wider">Placement</p>
                                        <div className="flex flex-wrap gap-1 px-1">
                                            {['click', 'drag'].map(p => (
                                                <Button
                                                    key={p}
                                                    variant={catPlacement === p ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCatPlacement(catPlacement === p ? null : p)}
                                                    className="h-7 text-[10px] font-semibold uppercase px-2.5 rounded-md"
                                                >
                                                    {p}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    {(catCategory || catScale || catPlacement) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full h-7 text-[10px] font-semibold uppercase text-red-500 hover:text-red-600 hover:bg-red-500/5"
                                            onClick={() => { setCatCategory(null); setCatScale(null); setCatPlacement(null); }}
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={activeTab === 'catalog' ? "Search global templates..." : "Search your stock..."}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 h-9 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Card key={i} className="border-none shadow-sm overflow-hidden bg-muted/10 rounded-xl">
                            <Skeleton className="h-40 w-full" />
                            <CardHeader className="p-4 space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-full" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : activeTab === "catalog" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredCatalog.map((asset) => (
                        <Card key={asset.id} className="group overflow-hidden border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 bg-card rounded-xl flex flex-col">
                            <div className="h-44 w-full bg-muted/20 relative flex items-center justify-center p-6 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={asset.image}
                                    alt={asset.name}
                                    className="size-full object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute top-3 right-3">
                                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm text-[10px] font-semibold py-0.5 px-2 rounded-md border-border/50">
                                        {asset.atlas_categories?.name || "Global"}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-4 flex-1 flex flex-col border-t border-border/30">
                                <div className="space-y-1 mb-4">
                                    <h3 className="font-semibold text-sm truncate leading-tight group-hover:text-primary transition-colors">{asset.name}</h3>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5">
                                        {asset.placement_type} <span className="text-border">•</span> Scale {asset.default_scale}
                                    </p>
                                </div>
                                <div className="mt-auto space-y-2">
                                    <Button
                                        onClick={() => setImportingAsset(asset)}
                                        className="w-full h-9 gap-2 rounded-lg cursor-pointer shadow-sm shadow-primary/10 font-medium text-xs"
                                        size="sm"
                                    >
                                        <Plus className="size-3.5" /> Import Asset
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full h-7 rounded-md text-[10px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                                        onClick={() => setViewingAsset(asset)}
                                    >
                                        View Details <ArrowRight className="size-3 ml-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredInventory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/50 rounded-xl bg-muted/5">
                            <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center mb-5">
                                <Box className="size-8 text-primary/20" />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight">Your Warehouse is Empty</h3>
                            <p className="text-sm text-muted-foreground mt-1.5 mb-6 max-w-[280px] text-center">
                                Start building your local supply by importing equipment from the Global Catalog.
                            </p>
                            <Button onClick={() => setActiveTab("catalog")} className="gap-2 cursor-pointer rounded-lg px-6 h-10 shadow-sm font-medium">
                                <Store className="size-4" /> Explore Global Catalog
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredInventory.map((item) => (
                                <Card
                                    key={item.id}
                                    className="group flex flex-col overflow-hidden border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 bg-card rounded-xl cursor-pointer"
                                    onClick={() => setViewingItem(item)}
                                >
                                    {/* Image */}
                                    <div className="h-40 w-full bg-muted/10 relative flex items-center justify-center p-6 overflow-hidden">
                                        {item.asset?.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.asset.image} alt={item.title || ""} className="size-full object-contain opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                        ) : (
                                            <Package className="size-12 text-muted-foreground/15" />
                                        )}

                                        {/* Status */}
                                        <div className="absolute top-3 left-3">
                                            <StatusBadge status={item.approval_status} />
                                        </div>

                                        {/* Actions – top-right dropdown */}
                                        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="size-8 rounded-lg bg-background/90 backdrop-blur-sm border border-border/50 shadow-sm cursor-pointer hover:bg-background"
                                                    >
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 rounded-lg">
                                                    <DropdownMenuItem className="gap-2 text-xs cursor-pointer" onClick={() => setViewingItem(item)}>
                                                        <Eye className="size-3.5" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 text-xs cursor-pointer" onClick={() => setEditingItem(item)}>
                                                        <Edit3 className="size-3.5" /> Edit Item
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 text-xs text-red-600 focus:text-red-600 cursor-pointer" onClick={() => setDeletingItem(item)}>
                                                        <Trash2 className="size-3.5" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <CardContent className="p-4 flex-1 flex flex-col border-t border-border/30">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="min-w-0 space-y-0.5">
                                                <h3 className="font-semibold text-sm truncate leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                                                <p className="text-[10px] text-muted-foreground font-medium truncate uppercase tracking-wider">{item.brand} {item.model}</p>
                                            </div>
                                            <Badge variant="outline" className="font-medium border-primary/20 bg-primary/5 text-primary text-[10px] px-2 shrink-0">
                                                ×{item.quantity}
                                            </Badge>
                                        </div>

                                        <div className="mt-auto pt-3 border-t border-border/30 grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-medium text-muted-foreground uppercase">Location</p>
                                                    <p className="text-[11px] font-medium truncate">{item.warehouse_location || "Not Set"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 justify-end text-right">
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-medium text-muted-foreground uppercase">Rate</p>
                                                    <p className="text-[11px] font-semibold text-emerald-600">{item.pricing ? `$${item.pricing}` : "—"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Dialogs and Sheets */}
            <Dialog open={!!importingAsset} onOpenChange={(open) => !open && setImportingAsset(null)}>
                {importingAsset && (
                    <ImportAssetDialog
                        asset={importingAsset}
                        onSuccess={handleImport}
                        onCancel={() => setImportingAsset(null)}
                    />
                )}
            </Dialog>

            <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
                {editingItem && (
                    <UpdateInventoryItemDialog
                        item={editingItem}
                        onSuccess={handleUpdate}
                        onCancel={() => setEditingItem(null)}
                    />
                )}
            </Dialog>

            <AssetDetailsSheet
                asset={viewingAsset}
                open={!!viewingAsset}
                onOpenChange={(open) => !open && setViewingAsset(null)}
            />

            <WarehouseItemViewSheet
                item={viewingItem}
                open={!!viewingItem}
                onOpenChange={(open) => !open && setViewingItem(null)}
            />

            <DeleteInventoryItemDialog
                item={deletingItem}
                open={!!deletingItem}
                onOpenChange={(open) => !open && setDeletingItem(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}

/* ── Status Badge reusable ── */
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        approved: "bg-emerald-500 text-white",
        pending: "bg-amber-500 text-white",
        rejected: "bg-red-500 text-white",
    };
    return (
        <Badge className={`text-[10px] font-medium capitalize px-2 py-0 border-none shadow-sm rounded-md ${styles[status] || styles.pending}`}>
            {status}
        </Badge>
    );
}
