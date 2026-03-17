import Image from "next/image";
import {
    PanelLeft,
    PanelRight,
    Layers,
    CalendarDays,
    HelpCircle,
    Bell,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AxisHeaderProps {
    leftSidebarOpen: boolean;
    setLeftSidebarOpen: (v: boolean) => void;
    rightSidebarOpen: boolean;
    setRightSidebarOpen: (v: boolean) => void;
    onOpenSummary: () => void;
    onOpenGuide: () => void;
}

export function AxisHeader({
    leftSidebarOpen,
    setLeftSidebarOpen,
    rightSidebarOpen,
    setRightSidebarOpen,
    onOpenSummary,
    onOpenGuide,
}: AxisHeaderProps) {
    return (
        <header className="flex flex-col shrink-0 z-30">
            <Card className="relative flex flex-row items-center justify-between px-4 py-1.5 rounded-none h-12 border-0 !shadow-none !bg-[linear-gradient(90deg,rgba(6,10,18,0.7),rgba(10,36,54,0.45),rgba(6,10,18,0.7))]">
                <div className="flex items-center gap-2 mt-2 z-10">
                    <Image
                        src="/cobuddy_logo.png"
                        alt="Cobuddy"
                        width={300}
                        height={300}
                        className="h-20 w-auto object-contain"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "size-8 transition-colors hover:bg-white/10",
                            leftSidebarOpen && "bg-white/10 text-white"
                        )}
                        onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                    >
                        <PanelLeft className="size-4" />
                    </Button>
                </div>

                {/* Center Event Banner */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none mt-1 group">
                    <div className="absolute inset-0 bg-orange-500/30 blur-xl scale-[1.5] rounded-full pointer-events-none z-0" />
                    <div className="relative z-10 flex items-center h-8 bg-[#111318]/90 border border-white/10 skew-x-[-15deg] px-8 shadow-[0_0_15px_rgba(255,255,255,0.05)] max-w-lg">
                        <div className="flex items-center gap-4 skew-x-[15deg]">
                            <div className="flex items-center gap-2">
                                <Layers className="size-4 text-orange-500" />
                                <span className="text-xs text-white/50">Event:</span>
                                <span className="text-xs font-semibold text-white">
                                    Summer Gala
                                </span>
                            </div>
                            <div className="text-white/30 text-xs">|</div>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="size-4 text-emerald-400" />
                                <span className="text-xs font-semibold text-white">
                                    June 15, 2024
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 z-10 mt-1">
                    <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded px-2.5 py-1.5 backdrop-blur-md">
                        <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
                        <span className="text-[11px] font-medium text-white/90">Saved</span>
                        <div className="size-1 rounded-full bg-white/40 ml-1"></div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
                            onClick={onOpenGuide}
                        >
                            <HelpCircle className="size-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
                        >
                            <Bell className="size-5" />
                        </Button>
                    </div>

                    <Button
                        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold h-8 px-4 rounded shadow-[0_0_15px_rgba(220,38,38,0.3)] border border-red-500/30 skew-x-[-12deg]"
                        onClick={onOpenSummary}
                    >
                        <div className="flex items-center gap-2 skew-x-[12deg]">
                            <span className="tracking-widest text-[11px] font-extrabold uppercase mt-0.5">
                                SUMMARY
                            </span>
                            <ChevronRight className="size-4" />
                        </div>
                    </Button>

                    <Separator orientation="vertical" className="h-5 bg-white/10 mx-1" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "size-8 transition-colors hover:bg-white/10",
                            rightSidebarOpen && "bg-white/10 text-white"
                        )}
                        onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                    >
                        <PanelRight className="size-4" />
                    </Button>
                </div>
            </Card>
        </header>
    );
}
