import { Info, X, Layers, LayoutGrid, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WorkspaceGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WorkspaceGuideModal({ isOpen, onClose }: WorkspaceGuideModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-lg border-none shadow-2xl rounded-2xl overflow-hidden p-0">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <Info className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Workspace Guide
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">
                                    Master the production tools
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="size-5" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                title: "Select Venue",
                                text: "Drag a floor plan from the left library onto the canvas to begin your layout.",
                                icon: Layers,
                            },
                            {
                                title: "Place Equipment",
                                text: "Drag items from the asset library. Use the tech area for compact placement.",
                                icon: LayoutGrid,
                            },
                            {
                                title: "Precision Tuning",
                                text: "Select an item to scale, flip, or change its layer priority.",
                                icon: Settings,
                            },
                        ].map((step, idx) => (
                            <div
                                key={idx}
                                className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100"
                            >
                                <div className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-sm">
                                    <step.icon className="size-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">
                                        {step.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                        {step.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 h-10 font-bold"
                        onClick={onClose}
                    >
                        Got it, let&apos;s build
                    </Button>
                </div>
            </Card>
        </div>
    );
}
