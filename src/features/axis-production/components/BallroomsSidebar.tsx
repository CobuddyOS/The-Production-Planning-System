import { Box } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBallrooms } from "@/features/ballrooms/hooks/useBallrooms";

interface BallroomsSidebarProps {
    isOpen: boolean;
    selectedBallroomImage: string | null;
    onSelectBallroom: (image: string | null) => void;
}

export function BallroomsSidebar({ isOpen, selectedBallroomImage, onSelectBallroom }: BallroomsSidebarProps) {
    const { ballrooms, loading } = useBallrooms();

    return (
        <aside
            className={cn(
                "h-full overflow-hidden border-r border-white/5 bg-[radial-gradient(120%_85%_at_50%_100%,rgba(255,255,255,0.06)_0%,rgba(56,189,248,0.22)_35%,rgba(0,0,0,0.7)_70%)] backdrop-blur-xl flex flex-col min-w-0 min-h-0",
                !isOpen && "pointer-events-none"
            )}
        >
            <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-4">
                <div className="pt-3">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3 block">
                        Ballrooms
                    </span>
                    <div className="grid grid-cols-1 gap-2 justify-items-center">
                        {loading ? (
                            <div className="flex justify-center p-4">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-300"></div>
                            </div>
                        ) : ballrooms.length === 0 ? (
                            <p className="text-[10px] text-white/60 text-center py-4">
                                No ballrooms found
                            </p>
                        ) : (
                            ballrooms.map((ballroom) => (
                                <div
                                    key={ballroom.id}
                                    onClick={() => ballroom.image && onSelectBallroom(ballroom.image)}
                                    className={cn(
                                        "group bg-white/5 rounded-lg overflow-hidden shadow-[0_0_18px_rgba(0,0,0,0.35)] hover:shadow-[0_0_28px_rgba(56,189,248,0.18)] transition-all cursor-pointer w-[92px] h-[92px]",
                                        selectedBallroomImage === ballroom.image && "ring-2 ring-sky-500 shadow-[0_0_28px_rgba(56,189,248,0.3)]"
                                    )}
                                >
                                    <div className="h-full w-full bg-black/20 flex items-center justify-center overflow-hidden">
                                        {ballroom.image ? (
                                            <img
                                                src={ballroom.image}
                                                alt={ballroom.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <Box className="size-8 text-white/30" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
