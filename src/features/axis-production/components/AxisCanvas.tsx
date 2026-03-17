import {
    ArrowUp,
    ArrowDown,
    FlipVertical,
    FlipHorizontal,
    ArrowDownToLine,
    ArrowUpFromLine,
    Trash2,
    Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function AxisCanvas() {
    const toolBtnClass =
        "h-8 w-8 p-0 rounded-md transition-all duration-200 border border-white/10 text-white/70 bg-white/5 hover:text-white hover:bg-white/10";

    return (
        <div className="flex-1 p-2 flex flex-col gap-2 overflow-hidden">
            <div className="flex-1 overflow-hidden rounded-xl neon-glass-card shadow-[0_0_35px_rgba(56,189,248,0.25)] relative group">
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="bg-white/90 backdrop-blur shadow-md hover:bg-white"
                        onClick={() => { }}
                    >
                        <Maximize2 className="size-4" />
                    </Button>
                </div>

                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                <div id="myCanvas" className="w-full h-full min-h-[400px]" />

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-black/40 backdrop-blur border border-white/15 rounded-xl shadow-[0_0_24px_rgba(34,197,94,0.25)] z-10 scale-90 md:scale-100">
                    <div className="flex items-center gap-0.5 px-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={toolBtnClass}
                            title="Scale Up"
                        >
                            <ArrowUp className="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={toolBtnClass}
                            title="Scale Down"
                        >
                            <ArrowDown className="size-3.5" />
                        </Button>
                        <Separator orientation="vertical" className="h-3 bg-white/20 mx-1" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className={toolBtnClass}
                            title="Flip"
                        >
                            <FlipVertical className="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={toolBtnClass}
                            title="Rotate"
                        >
                            <FlipHorizontal className="size-3.5" />
                        </Button>
                        <Separator orientation="vertical" className="h-3 bg-white/20 mx-1" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className={toolBtnClass}
                            title="Send Back"
                        >
                            <ArrowDownToLine className="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={toolBtnClass}
                            title="Bring Front"
                        >
                            <ArrowUpFromLine className="size-3.5" />
                        </Button>
                    </div>
                    <Separator orientation="vertical" className="h-8 bg-white/20" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-rose-300 hover:bg-white/10 hover:text-rose-200 rounded-lg"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
