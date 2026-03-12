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
import { Search, Plus, Home, MoreHorizontal, Ruler, Users } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
    useAtlasBallrooms,
    BallroomFormDialog,
    DeleteBallroomDialog,
    BallroomDetailsSheet,
    type AtlasBallroom
} from "@/features/atlas/ballrooms";
import { useAtlasBallroomCategories } from "@/features/atlas/ballroom-categories";

export default function AtlasBallroomsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    const [selectedBallroom, setSelectedBallroom] = useState<AtlasBallroom | null>(null);
    const [viewingBallroom, setViewingBallroom] = useState<AtlasBallroom | null>(null);
    const [ballroomToDelete, setBallroomToDelete] = useState<AtlasBallroom | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { ballrooms, loading, refresh, deleteBallroom } = useAtlasBallrooms();
    const { categories } = useAtlasBallroomCategories();

    const handleDelete = async (id: string) => {
        const result = await deleteBallroom(id);
        if (!result.success) {
            alert(result.error?.message || "Failed to delete ballroom template");
        }
    };

    const filtered = useMemo(() => {
        return ballrooms.filter((br) => {
            const matchesSearch = br.name.toLowerCase().includes(search.toLowerCase()) ||
                (br.description?.toLowerCase().includes(search.toLowerCase()) || false);
            const matchesStatus = statusFilter === "all" || br.status === statusFilter;
            const matchesCategory = categoryFilter === "all" || br.category_id === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [ballrooms, search, statusFilter, categoryFilter]);

    if (!mounted) return null;

    return (
        <div className="space-y-6 px-4 md:px-6 lg:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ballroom Templates</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage global ballroom layouts and technical dimensions.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 cursor-pointer">
                                <Plus className="h-4 w-4" />
                                Create Ballroom
                            </Button>
                        </DialogTrigger>
                        <BallroomFormDialog
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
                        <Home className="h-5 w-5 text-primary" />
                        Template Library
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search ballrooms..."
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
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="h-9 w-[160px] rounded-lg cursor-pointer">
                                <SelectValue placeholder="Segment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Segments</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-hidden rounded-b-xl border-t">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Ballroom Name</TableHead>
                                    <TableHead>Segment</TableHead>
                                    <TableHead>Dimensions</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-background">
                                {loading && ballrooms.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                            Loading ballroom templates...
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                            {search || statusFilter !== 'all' || categoryFilter !== 'all'
                                                ? "No templates match your filters."
                                                : "No ballroom templates found. Create one to get started."}
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map((br) => (
                                    <TableRow
                                        key={br.id}
                                        className="group hover:bg-muted/30 transition-colors cursor-pointer"
                                        onClick={() => setViewingBallroom(br)}
                                    >
                                        <TableCell>
                                            <div className="size-10 rounded-md overflow-hidden bg-muted border">
                                                {br.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={br.image} alt={br.name} className="size-full object-cover" />
                                                ) : (
                                                    <div className="size-full flex items-center justify-center">
                                                        <Home className="size-4 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold">{br.name}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                {br.description || "No description"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-normal">
                                                {br.atlas_ballroom_categories?.name || "Uncategorized"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm font-medium">
                                                <Ruler className="h-4 w-4 text-muted-foreground" />
                                                {br.width} x {br.depth} {br.unit_type}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm font-medium">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                {br.capacity || "—"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`font-normal ${br.status === 'active'
                                                    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
                                                    : 'border-red-500/20 bg-red-500/5 text-red-600'
                                                    }`}
                                            >
                                                {br.status.charAt(0).toUpperCase() + br.status.slice(1)}
                                            </Badge>
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
                                                    <DropdownMenuItem onClick={() => setSelectedBallroom(br)} className="cursor-pointer">
                                                        Edit Template
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setViewingBallroom(br)} className="cursor-pointer">
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive cursor-pointer"
                                                        onClick={() => setBallroomToDelete(br)}
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

            {/* Edit Asset Dialog */}
            <Dialog
                open={!!selectedBallroom}
                onOpenChange={(open) => !open && setSelectedBallroom(null)}
            >
                {selectedBallroom && (
                    <BallroomFormDialog
                        ballroom={selectedBallroom}
                        onSuccess={() => {
                            setSelectedBallroom(null);
                            refresh();
                        }}
                        onCancel={() => setSelectedBallroom(null)}
                    />
                )}
            </Dialog>

            {/* Details Sheet */}
            <Sheet
                open={!!viewingBallroom}
                onOpenChange={(open) => !open && setViewingBallroom(null)}
            >
                <BallroomDetailsSheet ballroom={viewingBallroom} />
            </Sheet>

            {/* Delete Confirmation */}
            <DeleteBallroomDialog
                ballroom={ballroomToDelete}
                open={!!ballroomToDelete}
                onOpenChange={(open) => !open && setBallroomToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
