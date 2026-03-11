"use client";

import { useState } from "react";
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
import { Search, Plus, Filter, Tag, Layout, MoreHorizontal, Grid } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type Category = {
    id: string;
    name: string;
    description: string;
    icon: string;
    displayOrder: number;
    active: boolean;
    assetCount: number;
    createdAt: string;
};

const mockCategories: Category[] = [
    {
        id: "lighting",
        name: "Lighting",
        description: "Static and intelligent lighting fixtures.",
        icon: "💡",
        displayOrder: 1,
        active: true,
        assetCount: 82,
        createdAt: "2026-01-12",
    },
    {
        id: "audio",
        name: "Audio",
        description: "Speakers, microphones and consoles.",
        icon: "🔊",
        displayOrder: 2,
        active: true,
        assetCount: 54,
        createdAt: "2026-01-13",
    },
    {
        id: "visual",
        name: "Visual",
        description: "Projectors, LED walls and displays.",
        icon: "📽️",
        displayOrder: 3,
        active: true,
        assetCount: 31,
        createdAt: "2026-01-18",
    },
    {
        id: "fx",
        name: "Special FX",
        description: "Atmospherics, pyrotechnics and effects.",
        icon: "✨",
        displayOrder: 4,
        active: false,
        assetCount: 9,
        createdAt: "2026-02-02",
    },
];

export default function AtlasCategoriesPage() {
    const [search, setSearch] = useState("");
    const [categories] = useState<Category[]>(mockCategories);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
                    <p className="text-sm text-muted-foreground">
                        Define global groupings for all Atlas assets.
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Category
                        </Button>
                    </DialogTrigger>
                    <CategoryFormDialog />
                </Dialog>

                <Dialog
                    open={!!selectedCategory}
                    onOpenChange={(open) => !open && setSelectedCategory(null)}
                >
                    {selectedCategory && (
                        <CategoryFormDialog category={selectedCategory} />
                    )}
                </Dialog>
            </div>

            <Card className="border-none shadow-sm bg-muted/30">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Grid className="h-5 w-5 text-primary" />
                        Category Library
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search categories..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8 h-9 rounded-lg"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-hidden rounded-b-xl border-t">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Category Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Asset Count</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-background">
                                {filtered.map((cat) => (
                                    <TableRow key={cat.id} className="group hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-semibold">
                                            <span className="mr-2">{cat.icon}</span>
                                            {cat.name}
                                            {!cat.active && (
                                                <Badge
                                                    variant="outline"
                                                    className="ml-2 text-[10px] bg-red-500/10 text-red-600 border-red-500/20"
                                                >
                                                    Inactive
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-md truncate text-muted-foreground">
                                            {cat.description}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary">
                                                {cat.assetCount} Assets
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground font-mono">
                                            {cat.createdAt}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setSelectedCategory(cat)}>
                                                        Edit Category
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
        </div>
    );
}

function CategoryFormDialog({ category }: { category?: Category }) {
    const isEdit = Boolean(category);

    return (
        <DialogContent className="sm:max-w-[500px] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
            <DialogHeader className="p-6 pb-2 bg-muted/20 text-left">
                <DialogTitle className="text-xl">
                    {isEdit ? "Edit Category" : "Create Category"}
                </DialogTitle>
                <DialogDescription>
                    {isEdit
                        ? "Update the global category definition. These changes will affect all tenants."
                        : "Define a new global category for Atlas assets. Tenants will use these for their inventory."}
                </DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                <div className="space-y-1">
                    <label className="text-xs font-medium">Category Name</label>
                    <Input
                        defaultValue={category?.name}
                        placeholder="e.g. Lighting"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium">Description</label>
                    <Input
                        defaultValue={category?.description}
                        placeholder="Short description for internal admins"
                    />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Icon</label>
                        <Input
                            defaultValue={category?.icon}
                            placeholder="Emoji or icon name, e.g. 💡"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Display Order</label>
                        <Input
                            type="number"
                            defaultValue={category?.displayOrder ?? 1}
                            min={1}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                    <div className="space-y-0.5">
                        <p className="text-xs font-medium">Active</p>
                        <p className="text-[11px] text-muted-foreground">
                            Inactive categories will be hidden from tenant imports.
                        </p>
                    </div>
                    {/* Placeholder toggle, to be wired later */}
                    <button className="inline-flex h-6 w-11 items-center rounded-full border border-input bg-muted px-0.5 text-[10px]">
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-background shadow">
                            {category?.active === false ? "Off" : "On"}
                        </span>
                    </button>
                </div>
            </div>
            <DialogFooter className="p-6 bg-muted/20 border-t">
                <Button variant="outline" size="sm">
                    Cancel
                </Button>
                <Button size="sm">
                    {isEdit ? "Save Changes" : "Create Category"}
                </Button>
            </DialogFooter>
        </DialogContent >
    );
}

