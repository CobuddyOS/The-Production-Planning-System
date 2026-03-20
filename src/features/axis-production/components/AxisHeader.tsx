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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AxisHeaderProps {
    leftSidebarOpen: boolean;
    setLeftSidebarOpen: (v: boolean) => void;
    rightSidebarOpen: boolean;
    setRightSidebarOpen: (v: boolean) => void;
    onOpenSummary: () => void;
    onOpenGuide: () => void;
    eventName?: string;
    eventDate?: string;
}

export function AxisHeader({
    leftSidebarOpen,
    setLeftSidebarOpen,
    rightSidebarOpen,
    setRightSidebarOpen,
    onOpenSummary,
    onOpenGuide,
    eventName = "New Event",
    eventDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
}: AxisHeaderProps) {
    return (
        <header className="flex flex-col shrink-0 z-30 glass-header h-12">
            <div className="relative flex flex-row items-center justify-between px-4 h-full">
                {/* Logo and Left Sidebar Toggle */}
                <div className="flex items-center gap-4 z-10 h-full">
                    <Image
                        src="/cobuddy_logo.png"
                        alt="Cobuddy"
                        width={100}
                        height={32}
                        className="h-10 w-auto object-contain"
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

                {/* Center Event Banner - Clean & Non-Brittle */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="neon-banner-accent rounded-full px-6 py-1 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Layers className="size-3.5 text-primary" />
                            <span className="text-[11px] font-bold text-white tracking-wide">
                                {eventName}
                            </span>
                        </div>
                        <Separator orientation="vertical" className="h-3 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <CalendarDays className="size-3.5 text-emerald-400" />
                            <span className="text-[11px] font-medium text-white/70">
                                {eventDate}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 z-10">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-3 py-1 backdrop-blur-md">
                        <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Auto-saved</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/40 hover:text-white hover:bg-white/10 rounded-full size-8"
                            onClick={onOpenGuide}
                        >
                            <HelpCircle className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/40 hover:text-white hover:bg-white/10 rounded-full size-8"
                        >
                            <Bell className="size-4" />
                        </Button>
                    </div>

                    {/* Generic, clean button without magic skews */}
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-primary text-black font-black text-[10px] tracking-widest uppercase h-8 px-5 rounded-full hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                        onClick={onOpenSummary}
                    >
                        SUMMARY
                        <ChevronRight className="size-3.5 ml-1" />
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
            </div>
        </header>
    );
}
