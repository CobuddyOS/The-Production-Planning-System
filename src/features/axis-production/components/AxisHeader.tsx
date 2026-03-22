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
import { AxisToolbar } from "./AxisToolbar";

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
        <header className="flex flex-col z-30 glass-header h-full min-h-0">
            <div className="relative flex flex-wrap items-center justify-center md:justify-between gap-4 px-4 py-3 h-full overflow-y-auto scrollbar-hide">
                {/* Left Section: Logo, Left Sidebar Toggle, and Toolbar */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 z-10">
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
                            "size-8 transition-colors hover:bg-white/10 md:hidden",
                            leftSidebarOpen && "bg-white/10 text-white"
                        )}
                        onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                    >
                        <PanelLeft className="size-4" />
                    </Button>

                    <Separator orientation="vertical" className="hidden md:block h-6 bg-white/10 mx-2" />

                    <AxisToolbar />
                </div>

                {/* Right Section: Event Info and Right Actions */}
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-4 z-10">
                    <div className="neon-banner-accent rounded-full px-5 py-1.5 flex items-center gap-4 shrink-0 shadow-[0_0_15px_rgba(30,30,30,0.5)]">
                        <div className="flex items-center gap-2">
                            <Layers className="size-3.5 text-primary" />
                            <span className="text-[11px] font-bold text-white tracking-wide uppercase">
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

                    <Button
                        variant="default"
                        size="sm"
                        className="bg-primary text-black font-black text-[10px] tracking-widest uppercase h-8 px-5 rounded-full hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                        onClick={onOpenSummary}
                    >
                        SUMMARY
                        <ChevronRight className="size-3.5 ml-1" />
                    </Button>

                    <Separator orientation="vertical" className="md:hidden h-5 bg-white/10 mx-1" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "size-8 transition-colors hover:bg-white/10 md:hidden",
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
