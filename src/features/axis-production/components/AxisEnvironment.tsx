"use client";

import { cn } from "@/lib/utils";

interface AxisEnvironmentProps {
    tableAssets?: any[];
    onRemoveTableAsset?: (id: string) => void;
}

/**
 * Clean asset image extractor to avoid shotgun data mapping.
 */
const getAssetImage = (assetData: any) => {
    const asset = assetData?.item?.asset;
    return asset?.image || asset?.thumbnail_url || asset?.image_url || "";
};

export function AxisEnvironment({ tableAssets = [], onRemoveTableAsset }: AxisEnvironmentProps) {
    return (
        <div className="px-4 pb-3">
            <div className="flex gap-4 h-40">
                {/* Tech Table Section */}
                <div className="flex-[2.0] relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <img
                            src="/axis/table.png"
                            alt="Tech Table"
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                        />
                    </div>
                    <div
                        id="techAssetsContainer"
                        className="absolute inset-x-0 top-1/4 flex items-start justify-center px-12"
                    >
                        <div className="flex w-full justify-center gap-1">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    onClick={() => tableAssets[i] && onRemoveTableAsset?.(tableAssets[i].id)}
                                    className={cn(
                                        "w-10 h-10 flex items-center justify-center overflow-hidden transition-all duration-300",
                                        tableAssets[i] ? "cursor-pointer hover:scale-110 active:scale-95" : "opacity-0"
                                    )}
                                    // Subtle organic displacement instead of magic translateY
                                    style={{ transform: `translateY(${Math.sin(i / 1.5) * 3}px)` }}
                                >
                                    {tableAssets[i] && (
                                        <img
                                            src={getAssetImage(tableAssets[i])}
                                            alt={tableAssets[i]?.item?.title || "asset"}
                                            className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cable Case Section */}
                <div className="flex-1 relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <img
                            src="/axis/case.png"
                            alt="Cable Case"
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_12px_rgba(14,165,233,0.2)]"
                        />
                    </div>
                    <div
                        id="hardwareAssetsContainer"
                        className="absolute inset-0 grid grid-cols-3 gap-1.5 p-3 pt-10"
                    />
                </div>

                {/* Staff Section */}
                <div className="flex-[1.3] relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <img
                            src="/staff.png"
                            alt="Staff"
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_15px_rgba(132,204,22,0.4)]"
                        />
                    </div>
                </div>

                {/* Environment Controls Section */}
                <div className="flex-[0.5] relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center gap-6 p-4 pt-6">
                        {["Frequency", "Color"].map((label) => (
                            <div key={label} className="flex flex-col items-center gap-2">
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">
                                    {label}
                                </span>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    defaultValue={60}
                                    className="axis-slider h-24 w-2.5"
                                    style={{ writingMode: "vertical-rl" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
}
