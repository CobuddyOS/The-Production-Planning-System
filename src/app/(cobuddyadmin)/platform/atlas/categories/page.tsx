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
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Categories
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Define global groupings for all Atlas assets.
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm">Create Category</Button>
                    </DialogTrigger>
                    <CategoryFormDialog />
                </Dialog>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-3">
                    <CardTitle className="text-sm font-medium">
                        Category Library
                    </CardTitle>
                    <Input
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 max-w-xs"
                    />
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Asset Count</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell className="font-medium">
                                            <span className="mr-2">{cat.icon}</span>
                                            {cat.name}
                                            {!cat.active && (
                                                <Badge
                                                    variant="outline"
                                                    className="ml-2 text-[10px]"
                                                >
                                                    Inactive
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-md truncate">
                                            {cat.description}
                                        </TableCell>
                                        <TableCell>{cat.assetCount}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {cat.createdAt}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Dialog
                                                onOpenChange={(open) =>
                                                    !open && setSelectedCategory(null)
                                                }
                                                open={selectedCategory?.id === cat.id}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="xs"
                                                        variant="outline"
                                                        onClick={() => setSelectedCategory(cat)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </DialogTrigger>
                                                {selectedCategory && (
                                                    <CategoryFormDialog
                                                        category={selectedCategory}
                                                    />
                                                )}
                                            </Dialog>
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                className="text-destructive border-destructive/40"
                                            >
                                                Delete
                                            </Button>
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
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {isEdit ? "Edit Category" : "Create Category"}
                </DialogTitle>
                <DialogDescription>
                    {isEdit
                        ? "Update the global category definition. These changes will affect all tenants importing from Atlas."
                        : "Define a new global category for Atlas assets. Tenants will use these categories when importing inventory."}
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
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
            <DialogFooter>
                <Button variant="outline" size="sm">
                    Cancel
                </Button>
                <Button size="sm">
                    {isEdit ? "Save Changes" : "Create Category"}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

