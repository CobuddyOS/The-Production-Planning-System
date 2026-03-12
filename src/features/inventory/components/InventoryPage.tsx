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
    ArrowRight
} from "lucide-react";
import { useInventory } from "../hooks/useInventory";
import { ImportAssetDialog } from "./ImportAssetDialog";
import { UpdateInventoryItemDialog } from "./UpdateInventoryItemDialog";
import { DeleteInventoryItemDialog } from "./DeleteInventoryItemDialog";
import { WarehouseItemViewSheet } from "./WarehouseItemViewSheet";
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
    const [viewingItem, setViewingItem] = useState<WarehouseItem | null>(null);
    const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<WarehouseItem | null>(null);

    const filteredCatalog = useMemo(() => {
        return catalog.filter(asset =>
            asset.name.toLowerCase().includes(search.toLowerCase()) ||
            (asset.atlas_categories?.name?.toLowerCase().includes(search.toLowerCase()) ?? false)
        );
    }, [catalog, search]);

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
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter text-foreground">Inventory Hub</h2>
                    <p className="text-sm text-muted-foreground font-medium">
                        Seamlessly import global assets and manage your warehouse operations.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card/50 p-2 rounded-2xl border border-border/50 shadow-sm backdrop-blur-sm">
                <div className="flex p-1 bg-muted/50 rounded-xl w-fit">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("catalog")}
                        className={`h-9 px-4 text-xs font-bold gap-2 transition-all cursor-pointer rounded-lg ${activeTab === "catalog"
                            ? "bg-background text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            }`}
                    >
                        <Store className="size-4" /> Global Catalog
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("warehouse")}
                        className={`h-9 px-4 text-xs font-bold gap-2 transition-all cursor-pointer rounded-lg ${activeTab === "warehouse"
                            ? "bg-background text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            }`}
                    >
                        <Box className="size-4" /> My Warehouse
                        {inventory.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-black bg-primary/10 text-primary border-none">
                                {inventory.length}
                            </Badge>
                        )}
                    </Button>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder={activeTab === 'catalog' ? "Search global templates..." : "Search your stock..."}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-10 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:border-primary"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Card key={i} className="border-none shadow-sm overflow-hidden bg-muted/10 rounded-2xl">
                            <Skeleton className="h-44 w-full" />
                            <CardHeader className="p-4 space-y-3">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : activeTab === "catalog" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCatalog.map((asset) => (
                        <Card key={asset.id} className="group overflow-hidden border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-card rounded-2xl">
                            <div className="h-48 w-full bg-muted/20 relative flex items-center justify-center p-8 overflow-hidden">
                                <img
                                    src={asset.image}
                                    alt={asset.name}
                                    className="size-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3">
                                    <Badge variant="secondary" className="bg-background/90 backdrop-blur shadow-sm text-[10px] font-black py-0.5 px-2 rounded-lg border-none uppercase tracking-tighter">
                                        {asset.atlas_categories?.name || "Global"}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-5">
                                <div className="space-y-1 mb-5">
                                    <h3 className="font-black text-base truncate leading-tight">{asset.name}</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1.5">
                                        {asset.placement_type} <span className="text-primary/20">•</span> Scale {asset.default_scale}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setImportingAsset(asset)}
                                    className="w-full h-10 gap-2 rounded-xl cursor-pointer shadow-lg shadow-primary/10 hover:shadow-primary/20 group-hover:bg-primary transition-all font-bold"
                                    size="sm"
                                >
                                    <Plus className="size-4" /> Import Asset
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredInventory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border/50 rounded-[2.5rem] bg-muted/5">
                            <div className="size-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                                <Box className="size-10 text-primary/20" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">Your Warehouse is Empty</h3>
                            <p className="text-sm text-muted-foreground mt-2 mb-8 max-w-[280px] text-center font-medium">
                                Start building your local supply by importing equipment from the Global Catalog.
                            </p>
                            <Button onClick={() => setActiveTab("catalog")} variant="default" className="gap-2 cursor-pointer rounded-2xl px-8 h-12 shadow-xl shadow-primary/20 font-bold">
                                <Store className="size-5" /> Explore Global Catalog
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredInventory.map((item) => (
                                <Card key={item.id} className="group flex flex-col overflow-hidden border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-card rounded-2xl">
                                    {/* Card Visual Header */}
                                    <div className="h-40 w-full bg-muted/10 relative flex items-center justify-center p-6 group/image">
                                        {item.asset?.image && (
                                            <img src={item.asset.image} alt={item.title || ""} className="size-full object-contain opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            <Badge className={`text-[10px] uppercase font-black tracking-tighter rounded-lg px-2 py-0 border-none shadow-sm ${item.approval_status === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                                item.approval_status === 'pending' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-500 hover:bg-red-600'
                                                }`}>
                                                {item.approval_status}
                                            </Badge>
                                        </div>

                                        {/* Hover Overlay Actions */}
                                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="size-10 rounded-xl cursor-not-allowed cursor-pointer shadow-lg hover:bg-primary hover:text-white transition-colors"
                                                onClick={() => setViewingItem(item)}
                                            >
                                                <Eye className="size-5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="size-10 rounded-xl cursor-pointer shadow-lg hover:bg-primary hover:text-white transition-colors"
                                                onClick={() => setEditingItem(item)}
                                            >
                                                <Edit3 className="size-5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="size-10 rounded-xl cursor-not-allowed cursor-pointer shadow-lg transition-transform hover:scale-110"
                                                onClick={() => setDeletingItem(item)}
                                            >
                                                <Trash2 className="size-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <CardContent className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="min-w-0 space-y-0.5">
                                                <h3 className="font-black text-sm truncate leading-none text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                                                <p className="text-[10px] text-muted-foreground font-bold truncate uppercase tracking-tight">{item.brand} {item.model}</p>
                                            </div>
                                            <div className="bg-primary/5 px-2.5 py-1.5 rounded-xl border border-primary/10 flex flex-col items-center min-w-[44px] shadow-sm">
                                                <span className="text-xs font-black leading-none text-primary">{item.quantity}</span>
                                                <span className="text-[8px] font-black text-primary/40 uppercase tracking-tighter mt-0.5">Qty</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-border/40 grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="size-7 rounded-lg bg-muted/40 flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="size-3.5 text-muted-foreground" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[8px] font-black text-muted-foreground uppercase leading-none mb-0.5">Location</p>
                                                    <p className="text-[10px] font-bold text-foreground truncate">{item.warehouse_location || "Not Set"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 justify-end text-right">
                                                <div className="min-w-0">
                                                    <p className="text-[8px] font-black text-muted-foreground uppercase leading-none mb-0.5">Daily Rate</p>
                                                    <p className="text-[10px] font-black text-emerald-600">{item.pricing ? `$${item.pricing}` : "—"}</p>
                                                </div>
                                                <div className="size-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                    <Store className="size-3.5 text-emerald-600" />
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full mt-4 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group-hover:border-primary/20"
                                            onClick={() => setViewingItem(item)}
                                        >
                                            View Details <ArrowRight className="size-3 ml-1.5" />
                                        </Button>
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
