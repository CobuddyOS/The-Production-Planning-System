"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Package, MoreHorizontal, Layers } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
    useAtlasBundles,
    BundleFormDialog,
    DeleteBundleDialog,
    BundleDetailsSheet,
    type AtlasBundle
} from "@/features/atlas/bundles";

export default function AtlasBundlesPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

    const [selectedBundle, setSelectedBundle] = useState<AtlasBundle | null>(null);
    const [viewingBundle, setViewingBundle] = useState<AtlasBundle | null>(null);
    const [bundleToDelete, setBundleToDelete] = useState<AtlasBundle | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { bundles, loading, refresh, deleteBundle } = useAtlasBundles();

    const handleDelete = async (id: string) => {
        const result = await deleteBundle(id);
        if (!result.success) {
            alert(result.error?.message || "Failed to delete bundle");
        }
    };

    const filtered = useMemo(() => {
        return bundles.filter((b) => {
            const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
                (b.description?.toLowerCase().includes(search.toLowerCase()) || false) ||
                (b.category?.toLowerCase().includes(search.toLowerCase()) || false);
            const matchesStatus = statusFilter === "all" || b.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [bundles, search, statusFilter]);

    if (!mounted) return null;

    return (
        <div className="space-y-6 px-4 md:px-6 lg:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Equipment Bundles</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage pre-configured sets of items for rapid deployment.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 cursor-pointer">
                                <Plus className="h-4 w-4" />
                                Create Bundle
                            </Button>
                        </DialogTrigger>
                        <BundleFormDialog
                            onSuccess={() => {
                                setIsCreateOpen(false);
                                refresh();
                            }}
                            onCancel={() => setIsCreateOpen(false)}
                        />
                    </Dialog>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-muted/30">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" />
                        Bundle Library
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search bundles..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8 h-9 rounded-lg"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => setStatusFilter(value as any)}
                        >
                            <SelectTrigger className="h-9 w-[130px] rounded-lg cursor-pointer">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-hidden rounded-b-xl border-t">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Bundle Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Included Items</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-background">
                                {loading && bundles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                            Loading bundles...
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                            {search || statusFilter !== 'all'
                                                ? "No bundles match your filters."
                                                : "No bundles found. Build your first bundle to streamline bookings."}
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map((b) => (
                                    <TableRow
                                        key={b.id}
                                        className="group hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => setViewingBundle(b)}
                                    >
                                        <TableCell>
                                            <div className="font-semibold">{b.name}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                {b.description || "No description"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-normal">
                                                {b.category || "General"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {b.items?.slice(0, 4).map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="inline-flex items-center justify-center size-8 rounded-full bg-background border ring-2 ring-background ring-offset-0 overflow-hidden"
                                                        title={`${item.asset?.name} (x${item.quantity})`}
                                                    >
                                                        {item.asset?.image ? (
                                                            <img src={item.asset.image} alt={item.asset.name} className="size-full object-cover" />
                                                        ) : (
                                                            <span className="text-[10px] font-bold">{item.asset?.name.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                ))}
                                                {(b.items?.length || 0) > 4 && (
                                                    <div className="inline-flex items-center justify-center size-8 rounded-full bg-muted border text-[10px] font-bold ring-2 ring-background">
                                                        +{(b.items?.length || 0) - 4}
                                                    </div>
                                                )}
                                                {(!b.items || b.items.length === 0) && (
                                                    <span className="text-xs text-muted-foreground italic">No items</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`font-normal ${b.status === 'active'
                                                    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
                                                    : 'border-red-500/20 bg-red-500/5 text-red-600'
                                                    }`}
                                            >
                                                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground font-mono">
                                            {new Date(b.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setSelectedBundle(b)} className="cursor-pointer">
                                                        Edit Bundle
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setViewingBundle(b)} className="cursor-pointer">
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive cursor-pointer"
                                                        onClick={() => setBundleToDelete(b)}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Bundle Dialog */}
            <Dialog
                open={!!selectedBundle}
                onOpenChange={(open) => !open && setSelectedBundle(null)}
            >
                {selectedBundle && (
                    <BundleFormDialog
                        bundle={selectedBundle}
                        onSuccess={() => {
                            setSelectedBundle(null);
                            refresh();
                        }}
                        onCancel={() => setSelectedBundle(null)}
                    />
                )}
            </Dialog>

            {/* Details Sheet */}
            <Sheet
                open={!!viewingBundle}
                onOpenChange={(open) => !open && setViewingBundle(null)}
            >
                <BundleDetailsSheet bundle={viewingBundle} />
            </Sheet>

            {/* Delete Confirmation */}
            <DeleteBundleDialog
                bundle={bundleToDelete}
                open={!!bundleToDelete}
                onOpenChange={(open) => !open && setBundleToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
