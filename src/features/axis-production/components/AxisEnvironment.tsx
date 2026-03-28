"use client";

import { cn } from "@/lib/utils";
import { TableAsset } from "../types";

interface AxisEnvironmentProps {
    tableAssets?: TableAsset[];
    onRemoveTableAsset?: (id: string) => void;
    onUpdateQuantity?: (id: string, delta: number) => void;
}

/**
 * Clean asset image extractor to avoid shotgun data mapping.
 */
const getAssetImage = (assetData: TableAsset) => {
    const asset = assetData?.item?.asset;
    return asset?.image || "";
};

/**
 * AxisEnvironment renders 4 direct children that map 1-to-1 to the parent
 * grid's bottom-row column tracks (NIO | Table | Case | Staff | Slider).
 *
 * Each section uses `object-contain` with `w-full h-full` so the images
 * fill their dedicated space seamlessly without cropping.
 *
 * ⚠ This component must be used inside a CSS Grid parent whose columns
 *   match the LAYOUT.bottom proportions.
 */
export function AxisEnvironment({ tableAssets = [], onRemoveTableAsset, onUpdateQuantity }: AxisEnvironmentProps) {
    return (
        <>
            {/* ─── Column 1: NIO ─── */}
            <div className="relative overflow-hidden min-w-0 min-h-0">
                <img
                    src="/axis/nio.png"
                    alt="NIO"
                    className="absolute inset-0 w-full h-full object-contain"
                />
            </div>

            {/* ─── Column 2: Tech Table ─── */}
            <div className="relative overflow-hidden min-w-0 min-h-0">
                <img
                    src="/axis/table.png"
                    alt="Tech Table"
                    className="absolute inset-0 w-full h-full object-contain"
                />

                {/* Asset slots overlaid on the table */}
                <div className="absolute inset-x-0 top-[5%] left-[5%] flex items-start justify-center px-[8%]">
                    <div className="flex w-full justify-center gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-14 h-14 relative flex items-center justify-center transition-all duration-300 group",
                                    tableAssets[i] ? "text-sky-400" : "opacity-0"
                                )}
                                style={{
                                    transform: `translateY(${i * 6}px) scale(${1 - i * 0.03})`
                                }}
                            >
                                {tableAssets[i] && (
                                    <>
                                        <div
                                            onClick={() => tableAssets[i] && onRemoveTableAsset?.(tableAssets[i].id)}
                                            className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                                        >
                                            <img
                                                src={getAssetImage(tableAssets[i])}
                                                alt={tableAssets[i]?.item?.title || "asset"}
                                                className="w-12 h-12 object-contain"
                                            />
                                        </div>

                                        {/* Quantity Controls Overlay */}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-[#00ff88]/30 rounded-full px-1.5 py-0.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-[0_0_10px_rgba(0,255,136,0.1)]">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onUpdateQuantity?.(tableAssets[i].id, -1); }}
                                                className="w-3.5 h-3.5 flex items-center justify-center text-[10px] text-white/70 hover:text-[#00ff88] transition-colors leading-none"
                                            >
                                                −
                                            </button>
                                            <span className="text-[8px] font-black text-[#00ff88] tracking-tighter min-w-[8px] text-center">
                                                {tableAssets[i].quantity}
                                            </span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onUpdateQuantity?.(tableAssets[i].id, 1); }}
                                                className="w-3.5 h-3.5 flex items-center justify-center text-[10px] text-white/70 hover:text-[#00ff88] transition-colors leading-none"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Column 3: Cable Case ─── */}
            <div className="relative overflow-hidden min-w-0 min-h-0">
                <img
                    src="/axis/case.png"
                    alt="Cable Case"
                    className="absolute inset-0 w-full h-full object-contain"
                />
            </div>

            {/* ─── Column 4: Staff ─── */}
            <div className="relative overflow-hidden min-w-0 min-h-0">
                <img
                    src="/staff.png"
                    alt="Staff"
                    className="absolute inset-0 w-full h-full object-contain"
                />
            </div>

            {/* ─── Column 5: Environment Controls (Sliders) ─── */}
            <div className="relative overflow-hidden min-w-0 min-h-0 flex items-center justify-center">
                <div className="flex items-center justify-center gap-6 p-4">
                    {["Freq.", "Col."].map((label) => (
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
        </>
    );
}
