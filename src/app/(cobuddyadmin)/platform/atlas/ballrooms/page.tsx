"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { Search, Plus, Filter, Maximize2, Users, Layout, MapPin, Calendar, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type BallroomCategory = "Ballroom" | "Conference Hall" | "Banquet Hall" | "Outdoor Venue" | "Exhibition Hall";
type UnitType = "ft" | "m";
type BallroomStatus = "Active" | "Inactive";

type BallroomTemplate = {
    id: string;
    name: string;
    category: BallroomCategory;
    description: string;
    width: number;
    depth: number;
    unitType: UnitType;
    capacity: number;
    status: BallroomStatus;
    imageUrl?: string;
    createdAt: string;
};

const BALLROOM_CATEGORIES: BallroomCategory[] = [
    "Ballroom",
    "Conference Hall",
    "Banquet Hall",
    "Outdoor Venue",
    "Exhibition Hall",
];

const mockBallrooms: BallroomTemplate[] = [
    {
        id: "B-001",
        name: "Grand Imperial Ballroom",
        category: "Ballroom",
        description: "A luxury ballroom with high ceilings and crystal chandeliers, perfect for weddings and gala dinners.",
        width: 120,
        depth: 80,
        unitType: "ft",
        capacity: 800,
        status: "Active",
        imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400",
        createdAt: "2026-01-15",
    },
    {
        id: "B-002",
        name: "Executive Summit Suite",
        category: "Conference Hall",
        description: "Modern conference space equipped with state-of-the-art audiovisual technology.",
        width: 45,
        depth: 30,
        unitType: "ft",
        capacity: 120,
        status: "Active",
        imageUrl: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=400",
        createdAt: "2026-02-10",
    },
    {
        id: "B-003",
        name: "Riverside Terrace",
        category: "Outdoor Venue",
        description: "Expansive outdoor space overlooking the river delta, ideal for cocktail receptions.",
        width: 60,
        depth: 40,
        unitType: "m",
        capacity: 450,
        status: "Active",
        imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400",
        createdAt: "2026-02-22",
    },
    {
        id: "B-004",
        name: "Legacy Banquet Hall",
        category: "Banquet Hall",
        description: "Classic banquet hall with warm wood finishes and versatile layout options.",
        width: 80,
        depth: 60,
        unitType: "ft",
        capacity: 350,
        status: "Inactive",
        imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400",
        createdAt: "2026-03-01",
    },
];

export default function BallroomsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<BallroomStatus | "all">("all");
    const [categoryFilter, setCategoryFilter] = useState<BallroomCategory | "all">("all");
    const [sortBy, setSortBy] = useState<"capacity-asc" | "capacity-desc" | "none">("none");

    const [selectedBallroom, setSelectedBallroom] = useState<BallroomTemplate | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBallroom, setEditingBallroom] = useState<BallroomTemplate | null>(null);

    const filteredAndSortedBallrooms = useMemo(() => {
        let result = mockBallrooms.filter((b) => {
            const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" || b.status === statusFilter;
            const matchesCategory = categoryFilter === "all" || b.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });

        if (sortBy === "capacity-asc") {
            result.sort((a, b) => a.capacity - b.capacity);
        } else if (sortBy === "capacity-desc") {
            result.sort((a, b) => b.capacity - a.capacity);
        }

        return result;
    }, [search, statusFilter, categoryFilter, sortBy]);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In real app, call API
        setIsCreateModalOpen(false);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In real app, call API
        setIsEditModalOpen(false);
        setEditingBallroom(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ballrooms</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage global venue templates for tenant event spaces.
                    </p>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Ballroom Template
                        </Button>
                    </DialogTrigger>
                    <BallroomFormModal
                        title="Create Ballroom Template"
                        onSubmit={handleCreateSubmit}
                        onCancel={() => setIsCreateModalOpen(false)}
                    />
                </Dialog>
            </div>

            <Card className="border-none shadow-sm bg-muted/30">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Layout className="h-5 w-5 text-primary" />
                        Template Library
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8 h-9 rounded-lg"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(v) => setStatusFilter(v as any)}
                        >
                            <SelectTrigger className="h-9 w-[130px] rounded-lg">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={categoryFilter}
                            onValueChange={(v) => setCategoryFilter(v as any)}
                        >
                            <SelectTrigger className="h-9 w-[160px] rounded-lg">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {BALLROOM_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={sortBy}
                            onValueChange={(v) => setSortBy(v as any)}
                        >
                            <SelectTrigger className="h-9 w-[160px] rounded-lg">
                                <SelectValue placeholder="Sort Capacity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Sorting</SelectItem>
                                <SelectItem value="capacity-asc">Capacity (Low to High)</SelectItem>
                                <SelectItem value="capacity-desc">Capacity (High to Low)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-hidden rounded-b-xl border-t">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[100px]">Floorplan</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Dimensions</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-background">
                                {filteredAndSortedBallrooms.length > 0 ? (
                                    filteredAndSortedBallrooms.map((ballroom) => (
                                        <TableRow
                                            key={ballroom.id}
                                            className="group cursor-pointer hover:bg-muted/30 transition-colors"
                                            onClick={() => setSelectedBallroom(ballroom)}
                                        >
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <div className="h-12 w-16 rounded-md overflow-hidden bg-muted border border-border/50">
                                                    {ballroom.imageUrl ? (
                                                        <img
                                                            src={ballroom.imageUrl}
                                                            alt={ballroom.name}
                                                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <Layout className="h-6 w-6 text-muted-foreground/40" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">{ballroom.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary">
                                                    {ballroom.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Maximize2 className="h-3.5 w-3.5" />
                                                    <span>{ballroom.width} {ballroom.unitType} x {ballroom.depth} {ballroom.unitType}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 font-medium">
                                                    <Users className="h-4 w-4 text-blue-500" />
                                                    {ballroom.capacity.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={ballroom.status === "Active"
                                                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20"
                                                        : "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20"}
                                                >
                                                    {ballroom.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground font-mono">
                                                {ballroom.createdAt}
                                            </TableCell>
                                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => {
                                                            setEditingBallroom(ballroom);
                                                            setIsEditModalOpen(true);
                                                        }}>
                                                            Edit Template
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setSelectedBallroom(ballroom)}>
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                            No ballroom templates found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <BallroomFormModal
                    title="Edit Ballroom Template"
                    initialData={editingBallroom}
                    onSubmit={handleEditSubmit}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setEditingBallroom(null);
                    }}
                />
            </Dialog>

            {/* Details Panel */}
            <BallroomDetailsSheet
                ballroom={selectedBallroom}
                onClose={() => setSelectedBallroom(null)}
            />
        </div>
    );
}

function BallroomFormModal({
    title,
    initialData,
    onSubmit,
    onCancel
}: {
    title: string;
    initialData?: BallroomTemplate | null;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}) {
    return (
        <DialogContent className="sm:max-w-[600px] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
            <DialogHeader className="p-6 pb-2 bg-muted/20">
                <DialogTitle className="text-xl">{title}</DialogTitle>
                <DialogDescription>
                    {initialData ? "Modify existing ballroom template details." : "Create a new ballroom template for your library."}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit}>
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ballroom Name</label>
                            <Input placeholder="e.g. Grand Imperial Ballroom" defaultValue={initialData?.name} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                            <Select defaultValue={initialData?.category || "Ballroom"}>
                                <SelectTrigger className="w-full h-10">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {BALLROOM_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                        <Textarea
                            placeholder="Enter a detailed description of the space..."
                            className="resize-none h-24"
                            defaultValue={initialData?.description}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image / Floorplan</label>
                        <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 transition-colors hover:border-primary/50 bg-muted/5">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <Plus className="h-8 w-8 text-muted-foreground/40" />
                                <div className="text-sm font-medium">Click to upload or drag and drop</div>
                                <div className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB)</div>
                                <Input type="file" className="hidden" id="image-upload" />
                                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => document.getElementById('image-upload')?.click()}>
                                    Select File
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Width</label>
                            <Input type="number" placeholder="100" defaultValue={initialData?.width} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Depth</label>
                            <Input type="number" placeholder="80" defaultValue={initialData?.depth} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unit Type</label>
                            <Select defaultValue={initialData?.unitType || "ft"}>
                                <SelectTrigger className="w-full h-10">
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ft">ft (Feet)</SelectItem>
                                    <SelectItem value="m">m (Meters)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Capacity</label>
                            <Input type="number" placeholder="500" defaultValue={initialData?.capacity} required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
                            <Select defaultValue={initialData?.status || "Active"}>
                                <SelectTrigger className="w-full h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter className="p-6 bg-muted/20 border-t">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">{initialData ? "Update Template" : "Create Template"}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}

function BallroomDetailsSheet({
    ballroom,
    onClose
}: {
    ballroom: BallroomTemplate | null;
    onClose: () => void;
}) {
    if (!ballroom) return null;

    return (
        <Sheet open={!!ballroom} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="sm:max-w-[450px] p-0 border-l border-border/50 shadow-2xl overflow-y-auto">
                <div className="h-56 w-full relative bg-muted">
                    {ballroom.imageUrl ? (
                        <img
                            src={ballroom.imageUrl}
                            alt={ballroom.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <Layout className="h-16 w-16 text-muted-foreground/20" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4">
                        <Badge
                            className={ballroom.status === "Active"
                                ? "bg-emerald-500 text-white border-none shadow-lg"
                                : "bg-red-500 text-white border-none shadow-lg"}
                        >
                            {ballroom.status}
                        </Badge>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="font-semibold px-2 py-0 border-primary/20 bg-primary/10 text-primary uppercase text-[10px] tracking-widest">
                                {ballroom.category}
                            </Badge>
                        </div>
                        <SheetTitle className="text-2xl font-bold tracking-tight text-left">{ballroom.name}</SheetTitle>
                        <SheetDescription className="mt-4 text-muted-foreground leading-relaxed text-sm text-left">
                            {ballroom.description}
                        </SheetDescription>
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-border/50 border border-border/50 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-background p-4 flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Width</span>
                            <span className="text-lg font-semibold">{ballroom.width} <span className="text-sm font-normal text-muted-foreground">{ballroom.unitType}</span></span>
                        </div>
                        <div className="bg-background p-4 flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Depth</span>
                            <span className="text-lg font-semibold">{ballroom.depth} <span className="text-sm font-normal text-muted-foreground">{ballroom.unitType}</span></span>
                        </div>
                        <div className="bg-background p-4 flex flex-col gap-1 col-span-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Display Size</span>
                            <span className="font-medium text-muted-foreground">{ballroom.width} {ballroom.unitType} x {ballroom.depth} {ballroom.unitType}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 border border-blue-100 ring-4 ring-blue-50/20">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Max Capacity</span>
                                    <span className="font-bold text-blue-950 text-xl">{ballroom.capacity.toLocaleString()} People</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 pt-4 border-t">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Created Date</span>
                                </div>
                                <span className="font-mono font-medium">{ballroom.createdAt}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>Template ID</span>
                                </div>
                                <span className="font-mono font-medium">{ballroom.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button className="flex-1 shadow-lg shadow-primary/20">Edit Details</Button>
                        <Button variant="outline" className="flex-1">Export PDF</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
