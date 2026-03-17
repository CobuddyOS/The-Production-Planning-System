export function AxisEnvironment() {
    return (
        <div className="px-4 pb-3">
            <div className="flex gap-4 h-40">
                <div className="flex-[2.0] relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center pt-3 ">
                        <img
                            src="/axis/table.png"
                            alt="Tech Table"
                            className="h-[250%] w-[250%] object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.35)]"
                        />
                    </div>
                    <div
                        id="techAssetsContainer"
                        className="absolute inset-0 flex items-center justify-center gap-2 p-3 pt-6"
                    />
                </div>

                <div className="flex-1 relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center p-2 pt-3">
                        <img
                            src="/axis/case.png"
                            alt="Cable Case"
                            className="h-[150%] w-[150%] object-contain scale-110 drop-shadow-[0_0_18px_rgba(14,165,233,0.35)]"
                        />
                    </div>
                    <div
                        id="hardwareAssetsContainer"
                        className="absolute inset-0 grid grid-cols-3 gap-1.5 p-3 pt-10"
                    />
                </div>

                <div className="flex-[1.3] relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center p-2 pt-4">
                        <img
                            src="/staff.png"
                            alt="Staff"
                            className="h-[150%] w-[150%] object-contain scale-125 drop-shadow-[0_0_22px_rgba(132,204,22,0.7)]"
                        />
                    </div>
                </div>

                <div className="flex-[0.5] relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center gap-6 p-4 pt-8">
                        {["Frequency", "Color"].map((label) => (
                            <div key={label} className="flex flex-col items-center gap-2">
                                <span className="text-[10px] font-semibold text-white/70 uppercase tracking-[0.2em]">
                                    {label}
                                </span>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    defaultValue={60}
                                    className="axis-slider h-28 w-3"
                                    style={{ writingMode: "vertical-rl" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
