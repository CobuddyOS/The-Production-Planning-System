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
import { Search, Plus, MoreHorizontal, Grid, Hash, Image as ImageIcon } from "lucide-react";
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
                <div className="flex items-center gap-3">
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
                </div>

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
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 px-6">
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
                                className="pl-8 h-9 rounded-lg bg-background"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden">
                    <div className="border-t">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[80px] text-center">Order</TableHead>
                                    <TableHead className="w-[80px] text-center">Icon</TableHead>
                                    <TableHead>Category Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-background">
                                {loading && categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                                <p className="text-sm font-medium">Syncing categories...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2 opacity-50">
                                                <Grid className="size-10" />
                                                <p>{search ? "No categories match your search." : "No categories found."}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map((cat) => (
                                    <TableRow key={cat.id} className="group hover:bg-muted/30 transition-colors border-white/5">
                                        <TableCell>
                                            <div className="flex justify-center w-full font-mono text-sm font-bold text-primary/80">
                                                {cat.sort_order}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center w-full">
                                                <div className="relative size-14 flex items-center justify-center overflow-visible">
                                                    {/* Subtle Light Effect */}
                                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-40 scale-75" />

                                                    {cat.icon_url ? (
                                                        <img
                                                            src={cat.icon_url}
                                                            alt=""
                                                            className="relative z-10 size-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="relative z-10 size-6 text-muted-foreground/30" />
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-white">
                                            {cat.name}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-muted-foreground text-xs">
                                            {cat.description || "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${cat.status === 'active'
                                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                                    : 'border-red-500/20 bg-red-500/10 text-red-600'
                                                    }`}
                                            >
                                                {cat.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-[11px] text-muted-foreground font-mono">
                                            {new Date(cat.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 group-hover:opacity-100 opacity-50 transition-all">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 border-white/10 bg-slate-900/95 backdrop-blur-xl">
                                                    <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground">Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-white/5" />
                                                    <DropdownMenuItem onClick={() => setSelectedCategory(cat)} className="text-xs focus:bg-primary/20 focus:text-primary">
                                                        Edit Category
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/5" />
                                                    <DropdownMenuItem
                                                        className="text-xs text-destructive focus:bg-destructive/20 focus:text-destructive"
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
