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
    ArrowRight,
    SlidersHorizontal,
    Check,
    Home,
    MoreVertical,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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

    // Filter states
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
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ballrooms Hub</h2>
                    <p className="text-sm text-muted-foreground">
                        Import global space templates or manage your local ballroom inventory.
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
                        <Store className="size-3.5" /> Space Catalog
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
                        <LayoutList className="size-3.5" /> My Spaces
                        {ballrooms.length > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-semibold bg-primary/10 text-primary border-none">
                                {ballrooms.length}
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
                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Filter Spaces</DropdownMenuLabel>
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
                                        <p className="text-[10px] font-bold uppercase text-muted-foreground px-2 tracking-wider">Unit</p>
                                        <div className="flex flex-wrap gap-1 px-1">
                                            {['ft', 'm'].map(u => (
                                                <Button
                                                    key={u}
                                                    variant={catUnit === u ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCatUnit(catUnit === u ? null : u)}
                                                    className="h-7 text-[10px] font-semibold uppercase px-2.5 rounded-md"
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
                                            className="w-full h-7 text-[10px] font-semibold uppercase text-red-500 hover:text-red-600 hover:bg-red-500/5"
                                            onClick={() => { setCatCategory(null); setCatUnit(null); }}
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
                            placeholder={activeTab === 'catalog' ? "Search global templates..." : "Search your spaces..."}
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
                                {asset.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={asset.image}
                                        alt={asset.name}
                                        className="size-full object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                ) : (
                                    <Home className="size-12 text-muted-foreground/15" />
                                )}
                                <div className="absolute top-3 right-3">
                                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm text-[10px] font-semibold py-0.5 px-2 rounded-md border-border/50">
                                        {asset.atlas_ballroom_categories?.name || "Global Template"}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-4 flex-1 flex flex-col border-t border-border/30">
                                <div className="space-y-1 mb-4">
                                    <h3 className="font-semibold text-sm truncate leading-tight group-hover:text-primary transition-colors">{asset.name}</h3>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5">
                                        {asset.width}×{asset.depth} {asset.unit_type} <span className="text-border">•</span> Cap. {asset.capacity || '—'}
                                    </p>
                                </div>
                                <div className="mt-auto space-y-2">
                                    <Button
                                        onClick={() => setImportingBallroom(asset)}
                                        className="w-full h-9 gap-2 rounded-lg cursor-pointer shadow-sm shadow-primary/10 font-medium text-xs"
                                        size="sm"
                                    >
                                        <Plus className="size-3.5" /> Import Space
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full h-7 rounded-md text-[10px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                                        onClick={() => setViewingCatalogBallroom(asset)}
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
                    {filteredBallrooms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/50 rounded-xl bg-muted/5">
                            <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center mb-5">
                                <Home className="size-8 text-primary/20" />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight">No Ballroom Spaces Yet</h3>
                            <p className="text-sm text-muted-foreground mt-1.5 mb-6 max-w-[280px] text-center">
                                Start building your local space inventory by importing templates from the Global Catalog.
                            </p>
                            <Button onClick={() => setActiveTab("catalog")} className="gap-2 cursor-pointer rounded-lg px-6 h-10 shadow-sm font-medium">
                                <Store className="size-4" /> Explore Global Catalog
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredBallrooms.map((item) => (
                                <Card
                                    key={item.id}
                                    className="group flex flex-col overflow-hidden border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 bg-card rounded-xl cursor-pointer"
                                    onClick={() => setViewingBallroom(item)}
                                >
                                    {/* Image */}
                                    <div className="h-40 w-full bg-muted/10 relative flex items-center justify-center p-6 overflow-hidden">
                                        {item.image || item.atlas_ballroom?.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={(item.image || item.atlas_ballroom?.image) || ""} alt={item.name} className="size-full object-contain opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                        ) : (
                                            <Home className="size-12 text-muted-foreground/15" />
                                        )}

                                        {/* Status */}
                                        <div className="absolute top-3 left-3">
                                            <StatusBadge status={item.status} />
                                        </div>

                                        {/* Actions dropdown */}
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
                                                    <DropdownMenuItem className="gap-2 text-xs cursor-pointer" onClick={() => setViewingBallroom(item)}>
                                                        <Eye className="size-3.5" /> View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 text-xs cursor-pointer" onClick={() => setEditingBallroom(item)}>
                                                        <Edit3 className="size-3.5" /> Edit Space
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2 text-xs text-red-600 focus:text-red-600 cursor-pointer" onClick={() => setDeletingBallroom(item)}>
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
                                                <h3 className="font-semibold text-sm truncate leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
                                                <p className="text-[10px] text-muted-foreground font-medium truncate uppercase tracking-wider">
                                                    {item.atlas_ballroom?.atlas_ballroom_categories?.name || "Private Space"}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="font-medium border-primary/20 bg-primary/5 text-primary text-[10px] px-2 shrink-0">
                                                {item.capacity || "—"} pax
                                            </Badge>
                                        </div>

                                        <div className="mt-auto pt-3 border-t border-border/30">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <Maximize2 className="size-3.5 text-muted-foreground shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-medium text-muted-foreground uppercase">Dimensions</p>
                                                    <p className="text-[11px] font-medium truncate">{item.width}×{item.depth} {item.unit_type}</p>
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

            <DeleteBallroomDialog
                ballroom={deletingBallroom}
                open={!!deletingBallroom}
                onOpenChange={(open) => !open && setDeletingBallroom(null)}
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
