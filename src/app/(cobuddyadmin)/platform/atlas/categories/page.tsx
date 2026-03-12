"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Plus, MoreHorizontal, Grid } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    useAtlasCategories,
    CategoryFormDialog,
    DeleteCategoryDialog,
    type AtlasCategory
} from "@/features/atlas/categories";

export default function AtlasCategoriesPage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<AtlasCategory | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<AtlasCategory | null>(null);

    const { categories, loading, refresh, deleteCategory } = useAtlasCategories();

    const handleDelete = async (id: string) => {
        const result = await deleteCategory(id);
        if (!result.success) {
            alert(result.error?.message || "Failed to delete category");
        }
    };

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
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Category
                        </Button>
                    </DialogTrigger>
                    <CategoryFormDialog
                        onSuccess={() => {
                            setIsCreateOpen(false);
                            refresh();
                        }}
                        onCancel={() => setIsCreateOpen(false)}
                    />
                </Dialog>

                <Dialog
                    open={!!selectedCategory}
                    onOpenChange={(open) => !open && setSelectedCategory(null)}
                >
                    {selectedCategory && (
                        <CategoryFormDialog
                            category={selectedCategory}
                            onSuccess={() => {
                                setSelectedCategory(null);
                                refresh();
                            }}
                            onCancel={() => setSelectedCategory(null)}
                        />
                    )}
                </Dialog>

                <DeleteCategoryDialog
                    category={categoryToDelete}
                    open={!!categoryToDelete}
                    onOpenChange={(open) => !open && setCategoryToDelete(null)}
                    onConfirm={handleDelete}
                />
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
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-background">
                                {loading && categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                            Loading categories...
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                            {search ? "No categories match your search." : "No categories found."}
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map((cat) => (
                                    <TableRow key={cat.id} className="group hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-semibold">
                                            {cat.name}
                                        </TableCell>
                                        <TableCell className="max-w-md truncate text-muted-foreground">
                                            {cat.description || "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`font-normal ${cat.status === 'active'
                                                    ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
                                                    : 'border-red-500/20 bg-red-500/5 text-red-600'
                                                    }`}
                                            >
                                                {cat.status.charAt(0).toUpperCase() + cat.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground font-mono">
                                            {new Date(cat.created_at).toLocaleDateString()}
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
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => setCategoryToDelete(cat)}
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
        </div>
    );
}

