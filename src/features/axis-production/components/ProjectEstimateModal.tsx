import { FileText, X, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProjectEstimateModalProps {
    isOpen: boolean;
    onClose: () => void;
    numberOfDays: number;
}

export function ProjectEstimateModal({
    isOpen,
    onClose,
    numberOfDays,
}: ProjectEstimateModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-2xl border-none shadow-2xl rounded-2xl overflow-hidden p-0 bg-white">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <FileText className="size-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-slate-900">
                            Project Estimate
                        </h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="size-5" />
                    </Button>
                </div>

                <div className="p-6">
                    <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-3 font-bold text-slate-400">ITEM</th>
                                    <th className="p-3 font-bold text-slate-400">QTY</th>
                                    <th className="p-3 font-bold text-slate-400 text-right">
                                        UNIT
                                    </th>
                                    <th className="p-3 font-bold text-slate-400 text-right">
                                        TOTAL
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-100 last:border-0">
                                    <td className="p-3">
                                        <p className="font-bold text-slate-800">
                                            Wireless Mic System
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            Handheld Shure QLXD
                                        </p>
                                    </td>
                                    <td className="p-3 font-medium">02</td>
                                    <td className="p-3 text-right font-medium">$25.00</td>
                                    <td className="p-3 text-right font-bold text-blue-600">
                                        $50.00
                                    </td>
                                </tr>
                                {/* Placeholder empty state */}
                                <tr>
                                    <td colSpan={4} className="p-8 text-center bg-slate-50/50">
                                        <div className="flex flex-col items-center gap-1">
                                            <Box className="size-8 text-slate-200" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                                More items coming from backend
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                Equipment Total
                            </p>
                            <p className="text-xl font-black text-slate-900">$50.00</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                Event Duration
                            </p>
                            <p className="text-xl font-black text-slate-900">
                                {numberOfDays} Days
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1 text-white">
                                Project Total
                            </p>
                            <p className="text-xl font-black text-white">
                                ${50 * numberOfDays}.00
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <Button
                            variant="outline"
                            className="flex-1 h-11 font-bold border-slate-200"
                        >
                            Download PDF
                        </Button>
                        <Button className="flex-[2] h-11 font-bold bg-blue-600 hover:bg-blue-700">
                            Submit for Approval
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
