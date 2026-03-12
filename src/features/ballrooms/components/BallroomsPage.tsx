"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import {
    Search,
    Plus,
    LayoutList,
    Store,
    Trash2,
    Edit3,
    Eye,
    Maximize2,
    Users,
    ArrowRight,
    SlidersHorizontal,
    Check,
    Home
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBallrooms } from "../hooks/useBallrooms";
import { ImportBallroomDialog } from "./ImportBallroomDialog";
import { UpdateBallroomDialog } from "./UpdateBallroomDialog";
import { DeleteBallroomDialog } from "./DeleteBallroomDialog";
import { BallroomViewSheet } from "./BallroomViewSheet";
import { BallroomDetailsSheet } from "@/features/atlas/ballrooms/components/BallroomDetailsSheet";
import { AtlasBallroom } from "@/features/atlas/ballrooms/types";
import { TenantBallroom } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

export function BallroomsPage() {
    const {
        catalog,
        ballrooms,
        loading,
        importBallroom,
        updateBallroom,
        deleteBallroom
    } = useBallrooms();

    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"catalog" | "warehouse">("catalog");

    // Selection states
    const [importingBallroom, setImportingBallroom] = useState<AtlasBallroom | null>(null);
    const [viewingBallroom, setViewingBallroom] = useState<TenantBallroom | null>(null);
    const [viewingCatalogBallroom, setViewingCatalogBallroom] = useState<AtlasBallroom | null>(null);
    const [editingBallroom, setEditingBallroom] = useState<TenantBallroom | null>(null);
    const [deletingBallroom, setDeletingBallroom] = useState<TenantBallroom | null>(null);

    // Filter states for catalog
    const [catCategory, setCatCategory] = useState<string | null>(null);
    const [catUnit, setCatUnit] = useState<string | null>(null);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(catalog.map(a => a.atlas_ballroom_categories?.name).filter(Boolean)));
        return unique as string[];
    }, [catalog]);

    const filteredCatalog = useMemo(() => {
        return catalog.filter(asset => {
            const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
                (asset.atlas_ballroom_categories?.name?.toLowerCase().includes(search.toLowerCase()) ?? false);

            const matchesCategory = !catCategory || asset.atlas_ballroom_categories?.name === catCategory;
            const matchesUnit = !catUnit || asset.unit_type === catUnit;

            return matchesSearch && matchesCategory && matchesUnit;
        });
    }, [catalog, search, catCategory, catUnit]);

    const filteredBallrooms = useMemo(() => {
        return ballrooms.filter(item =>
            (item.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
            (item.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
        );
    }, [ballrooms, search]);

    const activeFiltersCount = [catCategory, catUnit].filter(Boolean).length;

    const handleImport = async (values: any) => {
        const result = await importBallroom(values);
        if (result.success) {
            setImportingBallroom(null);
            setActiveTab("warehouse");
        } else {
            throw result.error;
        }
    };

    const handleUpdate = async (id: string, values: any) => {
        const result = await updateBallroom(id, values);
        if (result.success) {
            setEditingBallroom(null);
        } else {
            throw result.error;
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteBallroom(id);
        if (result.success) {
            setDeletingBallroom(null);
        } else {
            throw result.error;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter text-foreground">Ballrooms Hub</h2>
                    <p className="text-sm text-muted-foreground font-medium">
                        Import global space templates or manage your local ballroom inventory.
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
                        <Store className="size-4" /> Space Catalog
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
                        <LayoutList className="size-4" /> My Spaces
                        {ballrooms.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-black bg-primary/10 text-primary border-none">
                                {ballrooms.length}
                            </Badge>
                        )}
                    </Button>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    {activeTab === 'catalog' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 cursor-pointer border-border/50 bg-background/50 hover:bg-background relative transition-all active:scale-95 group">
                                    <SlidersHorizontal className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="hidden sm:inline font-bold">Filters</span>
                                    {activeFiltersCount > 0 && (
                                        <Badge variant="default" className="h-5 min-w-5 p-0 flex items-center justify-center text-[10px] font-black rounded-full absolute -top-2 -right-2 shadow-lg shadow-primary/20 border-2 border-background animate-in zoom-in">
                                            {activeFiltersCount}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/50 shadow-xl">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-1">Filter Spaces</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <div className="p-2 space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase text-primary/60 px-2 tracking-tighter">Category</p>
                                        <div className="grid grid-cols-1 gap-1">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setCatCategory(catCategory === cat ? null : cat)}
                                                    className={`text-left px-2 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-between ${catCategory === cat ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                                                        }`}
                                                >
                                                    {cat}
                                                    {catCategory === cat && <Check className="size-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase text-primary/60 px-2 tracking-tighter">Unit</p>
                                        <div className="flex flex-wrap gap-1 px-1">
                                            {['ft', 'm'].map(u => (
                                                <Button
                                                    key={u}
                                                    variant={catUnit === u ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCatUnit(catUnit === u ? null : u)}
                                                    className="h-7 text-[10px] font-extrabold uppercase px-2 rounded-md transition-all active:scale-95"
                                                >
                                                    {u === 'ft' ? 'Feet' : 'Meters'}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {(catCategory || catUnit) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full h-8 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                                setCatCategory(null);
                                                setCatUnit(null);
                                            }}
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <div className="relative flex-1 md:w-72 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder={activeTab === 'catalog' ? "Search global templates..." : "Search your spaces..."}
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
                        <Card key={asset.id} className="group overflow-hidden border border-border/40 shadow-sm hover:border-primary/30 transition-all duration-300 bg-card rounded-2xl flex flex-col">
                            <div className="h-48 w-full bg-muted/20 relative flex items-center justify-center p-8 overflow-hidden">
                                {asset.image ? (
                                    <img
                                        src={asset.image}
                                        alt={asset.name}
                                        className="size-full object-contain drop-shadow-xl transition-all duration-500"
                                    />
                                ) : (
                                    <Home className="size-16 text-muted-foreground/20" />
                                )}
                                <div className="absolute top-3 right-3">
                                    <Badge variant="secondary" className="bg-background/90 backdrop-blur shadow-sm text-[10px] font-black py-0.5 px-2 rounded-lg border-none uppercase tracking-tighter">
                                        {asset.atlas_ballroom_categories?.name || "Global Template"}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-5 flex-1 flex flex-col">
                                <div className="space-y-1 mb-5">
                                    <h3 className="font-black text-base truncate leading-tight group-hover:text-primary transition-colors">{asset.name}</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1.5">
                                        {asset.width}x{asset.depth} {asset.unit_type} <span className="text-primary/20">•</span> Cap. {asset.capacity || '—'}
                                    </p>
                                </div>
                                <div className="mt-auto space-y-2">
                                    <Button
                                        onClick={() => setImportingBallroom(asset)}
                                        className="w-full h-10 gap-2 rounded-xl cursor-pointer shadow-lg shadow-primary/10 hover:shadow-primary/20 group-hover:bg-primary transition-all font-bold"
                                        size="sm"
                                    >
                                        <Plus className="size-4" /> Import Space
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full h-8 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                                        onClick={() => setViewingCatalogBallroom(asset)}
                                    >
                                        View <ArrowRight className="size-3 ml-1.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredBallrooms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border/50 rounded-[2.5rem] bg-muted/5">
                            <div className="size-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                                <Home className="size-10 text-primary/20" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">No Ballroom Spaces Yet</h3>
                            <p className="text-sm text-muted-foreground mt-2 mb-8 max-w-[280px] text-center font-medium">
                                Start building your local space inventory by importing templates from the Global Catalog.
                            </p>
                            <Button onClick={() => setActiveTab("catalog")} variant="default" className="gap-2 cursor-pointer rounded-2xl px-8 h-12 shadow-xl shadow-primary/20 font-bold">
                                <Store className="size-5" /> Explore Global Catalog
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBallrooms.map((item) => (
                                <Card key={item.id} className="group flex flex-col overflow-hidden border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-card rounded-2xl">
                                    {/* Card Visual Header */}
                                    <div className="h-40 w-full bg-muted/10 relative flex items-center justify-center p-6 group/image">
                                        {item.image || item.atlas_ballroom?.image ? (
                                            <img src={(item.image || item.atlas_ballroom?.image) || ""} alt={item.name} className="size-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-500" />
                                        ) : (
                                            <Home className="size-16 text-muted-foreground/20" />
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            <Badge className={`text-[10px] uppercase font-black tracking-tighter rounded-lg px-2 py-0 border-none shadow-sm ${item.status === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                                item.status === 'pending' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-500 hover:bg-red-600'
                                                }`}>
                                                {item.status}
                                            </Badge>
                                        </div>

                                        {/* Hover Overlay Actions */}
                                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="size-10 rounded-xl cursor-pointer shadow-lg hover:bg-primary hover:text-white transition-colors"
                                                onClick={() => setViewingBallroom(item)}
                                            >
                                                <Eye className="size-5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="size-10 rounded-xl cursor-pointer shadow-lg hover:bg-primary hover:text-white transition-colors"
                                                onClick={() => setEditingBallroom(item)}
                                            >
                                                <Edit3 className="size-5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="size-10 rounded-xl cursor-pointer shadow-lg transition-transform hover:scale-110"
                                                onClick={() => setDeletingBallroom(item)}
                                            >
                                                <Trash2 className="size-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <CardContent className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="min-w-0 space-y-0.5">
                                                <h3 className="font-black text-sm truncate leading-none text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                                                <p className="text-[10px] text-muted-foreground font-bold truncate uppercase tracking-tight">
                                                    {item.atlas_ballroom?.atlas_ballroom_categories?.name || "Private Space"}
                                                </p>
                                            </div>
                                            <div className="bg-primary/5 px-2.5 py-1.5 rounded-xl border border-primary/10 flex flex-col items-center min-w-[50px] shadow-sm">
                                                <span className="text-xs font-black leading-none text-primary">{item.capacity || '—'}</span>
                                                <span className="text-[8px] font-black text-primary/40 uppercase tracking-tighter mt-0.5">Cap</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-border/40 grid grid-cols-1 gap-4">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="size-7 rounded-lg bg-muted/40 flex items-center justify-center flex-shrink-0">
                                                    <Maximize2 className="size-3.5 text-muted-foreground" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[8px] font-black text-muted-foreground uppercase leading-none mb-0.5">Dimensions</p>
                                                    <p className="text-[10px] font-bold text-foreground truncate">
                                                        {item.width}x{item.depth} {item.unit_type}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full mt-4 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group-hover:border-primary/20"
                                            onClick={() => setViewingBallroom(item)}
                                        >
                                            View <ArrowRight className="size-3 ml-1.5" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Dialogs and Sheets */}
            <Dialog open={!!importingBallroom} onOpenChange={(open) => !open && setImportingBallroom(null)}>
                {importingBallroom && (
                    <ImportBallroomDialog
                        ballroom={importingBallroom}
                        onSuccess={handleImport}
                        onCancel={() => setImportingBallroom(null)}
                    />
                )}
            </Dialog>

            <Dialog open={!!editingBallroom} onOpenChange={(open) => !open && setEditingBallroom(null)}>
                {editingBallroom && (
                    <UpdateBallroomDialog
                        ballroom={editingBallroom}
                        onSuccess={handleUpdate}
                        onCancel={() => setEditingBallroom(null)}
                    />
                )}
            </Dialog>

            <Sheet
                open={!!viewingCatalogBallroom}
                onOpenChange={(open) => !open && setViewingCatalogBallroom(null)}
            >
                <BallroomDetailsSheet ballroom={viewingCatalogBallroom} />
            </Sheet>

            <BallroomViewSheet
                ballroom={viewingBallroom}
                open={!!viewingBallroom}
                onOpenChange={(open) => !open && setViewingBallroom(null)}
            />

            {/* Reuse AssetDetailsSheet for Catalog Ballrooms or equivalent if needed */}
            {/* For now we stick to standard catalog view */}

            <DeleteBallroomDialog
                ballroom={deletingBallroom}
                open={!!deletingBallroom}
                onOpenChange={(open) => !open && setDeletingBallroom(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
