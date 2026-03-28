import { FileText, Box, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ProjectEstimateModalProps {
    isOpen: boolean;
    onClose: () => void;
    numberOfDays: number;
    canvasAssets: any[];
    tableAssets: any[];
}

export function ProjectEstimateModal({
    isOpen,
    onClose,
    numberOfDays,
    canvasAssets,
    tableAssets,
}: ProjectEstimateModalProps) {
    const aggregatedItems = useMemo(() => {
        const itemsMap = new Map<string, any>();
        const allAssets = [...canvasAssets, ...tableAssets];

        allAssets.forEach((asset) => {
            const item = asset.item;
            const itemId = item.id;
            const quantityToAdd = asset.quantity || 1;

            if (itemsMap.has(itemId)) {
                const existing = itemsMap.get(itemId);
                existing.quantity += quantityToAdd;
                existing.total = existing.quantity * (parseFloat(item.pricing) || 0) * numberOfDays;
            } else {
                itemsMap.set(itemId, {
                    id: itemId,
                    name: item.title || item.asset?.name || "Unknown Item",
                    image: item.asset?.image || item.asset?.thumbnail_url || item.asset?.image_url,
                    price: parseFloat(item.pricing) || 0,
                    quantity: quantityToAdd,
                    total: quantityToAdd * (parseFloat(item.pricing) || 0) * numberOfDays,
                });
            }
        });

        return Array.from(itemsMap.values());
    }, [canvasAssets, tableAssets, numberOfDays]);

    const projectTotal = useMemo(() => {
        return aggregatedItems.reduce((sum, item) => sum + item.total, 0);
    }, [aggregatedItems]);

    const equipmentBaseTotal = useMemo(() => {
        return aggregatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [aggregatedItems]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl p-0 border-none bg-transparent shadow-none [&>button]:hidden">
                <div className="w-full rounded-2xl overflow-hidden neon-glass-card">
                    <DialogHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between space-y-0 bg-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-sky-500/20 border border-sky-500/30">
                                <FileText className="size-5 text-sky-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-white font-orbitron tracking-tight text-left">
                                    Project Estimate Summary
                                </DialogTitle>
                                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold text-left">
                                    Comprehensive Equipment Breakdown
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        >
                            <X className="size-5" />
                        </Button>
                    </DialogHeader>

                    <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar bg-black/40">
                        {aggregatedItems.length > 0 ? (
                            <div className="space-y-3">
                                {aggregatedItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-sky-500/30 transition-colors">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain p-1"
                                                />
                                            ) : (
                                                <Box className="size-6 text-white/20" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white truncate group-hover:text-sky-400 transition-colors">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <p className="text-xs text-white/40 font-medium">
                                                    Unit: <span className="text-white/80">${item.price.toLocaleString()}</span>
                                                </p>
                                                <div className="h-1 w-1 rounded-full bg-white/20" />
                                                <p className="text-xs text-white/40 font-medium">
                                                    Qty: <span className="text-white/80">{item.quantity.toString().padStart(2, '0')}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-0.5">
                                                Subtotal
                                            </p>
                                            <p className="text-lg font-black text-sky-400 font-orbitron">
                                                ${item.total.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                                <div className="size-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-4">
                                    <Box className="size-10 text-white/10" />
                                </div>
                                <h3 className="text-lg font-bold text-white/60">No items selected</h3>
                                <p className="text-sm text-white/30 max-w-xs mt-2">
                                    Add equipment from the sidebar to generate a project estimate summary.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white/5 border-t border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Box className="size-12 text-white" />
                                </div>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">
                                    Equipment Total
                                </p>
                                <p className="text-2xl font-black text-white font-orbitron tracking-tight">
                                    ${equipmentBaseTotal.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Info className="size-12 text-white" />
                                </div>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">
                                    Event Duration
                                </p>
                                <p className="text-2xl font-black text-white font-orbitron tracking-tight">
                                    {numberOfDays} Day{numberOfDays !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-sky-500 text-white shadow-[0_0_30px_rgba(56,189,248,0.3)] border border-sky-400/50 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                                <p className="text-[10px] font-bold text-sky-100 uppercase tracking-[0.2em] mb-1">
                                    Project Total
                                </p>
                                <p className="text-2xl font-black text-white font-orbitron tracking-tight">
                                    ${projectTotal.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 font-bold border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                            >
                                Download PDF Report
                            </Button>
                            <Button className="flex-[1.5] h-12 font-bold bg-sky-500 hover:bg-sky-400 text-black shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all">
                                Finalize & Submit Estimate
                            </Button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-4 text-[10px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-[0.3em] font-bold"
                        >
                            [ Esc to Close ]
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
