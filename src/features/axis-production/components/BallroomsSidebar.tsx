import { useState, useRef } from "react";
import { Box, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBallrooms } from "@/features/ballrooms/hooks/useBallrooms";

interface BallroomsSidebarProps {
    isOpen: boolean;
    selectedBallroomId: string | null;
    onSelectBallroom: (id: string, image: string | null) => void;
}

export function BallroomsSidebar({ isOpen, selectedBallroomId, onSelectBallroom }: BallroomsSidebarProps) {
    const { ballrooms, loading } = useBallrooms();
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setUploadedImage(url);
            onSelectBallroom("custom-upload", url);
            // Reset input so re-uploading the same file works
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <aside
            className={cn(
                "h-full overflow-hidden bg-[radial-gradient(120%_85%_at_50%_100%,rgba(255,255,255,0.06)_0%,rgba(56,189,248,0.22)_35%,rgba(0,0,0,0.7)_70%)] backdrop-blur-xl flex flex-col min-w-0 min-h-0",
                !isOpen && "pointer-events-none"
            )}
        >
            <div className="p-4 pb-2 pt-6">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] block">
                    Event Spaces
                </span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-3 pt-3">
                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-300"></div>
                        </div>
                    ) : (
                        <>
                            {/* Upload Action */}
                            {!uploadedImage ? (
                                <div
                                    className="group bg-white/5 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all cursor-pointer w-full aspect-[4/3] relative"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                    <div className="h-full w-full bg-black/20 flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/upload.png"
                                            alt="Upload Custom Ballroom"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={cn(
                                        "group bg-white/5 border border-dashed border-sky-500/50 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all cursor-pointer w-full aspect-[4/3] relative",
                                        selectedBallroomId === "custom-upload" && "ring-2 ring-sky-500 shadow-[0_0_35px_rgba(56,189,248,0.35)]"
                                    )}
                                    onClick={() => onSelectBallroom("custom-upload", uploadedImage)}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                    <div className="h-full w-full bg-black/20 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={uploadedImage}
                                            alt="Custom Upload"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div
                                        className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/80 p-1.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setUploadedImage(null);
                                            if (selectedBallroomId === "custom-upload") {
                                                onSelectBallroom("", null);
                                            }
                                        }}
                                    >
                                        <X className="size-3 text-white" />
                                    </div>
                                    <div
                                        className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-all font-bold text-[9px] text-white/80 text-center z-20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        CHANGE IMAGE
                                    </div>
                                </div>
                            )}

                            {/* Ballrooms List */}
                            {ballrooms.length === 0 ? (
                                <p className="text-[10px] text-white/60 text-center py-4">
                                    No ballrooms found
                                </p>
                            ) : (
                                ballrooms.map((ballroom) => (
                                    <div
                                        key={ballroom.id}
                                        onClick={() => onSelectBallroom(ballroom.id, ballroom.image)}
                                        className={cn(
                                            "group bg-white/5 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all cursor-pointer w-full aspect-[4/3] relative",
                                            selectedBallroomId === ballroom.id && "ring-2 ring-sky-500 shadow-[0_0_35px_rgba(56,189,248,0.35)]"
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
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
