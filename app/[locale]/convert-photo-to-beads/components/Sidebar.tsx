import React from "react";
import { PALETTE } from "../palette-data";

interface SidebarProps {
    showPalette: boolean;
    setShowPalette: (val: boolean) => void;
    currentColor: string | null;
    setCurrentColor: (id: string | null) => void;
    showStats: boolean;
    stats: any[];
}

export const Sidebar = ({
    showPalette,
    setShowPalette,
    currentColor,
    setCurrentColor,
    showStats,
    stats
}: SidebarProps) => {
    return (
        <aside
            className={`${showPalette ? "fixed" : "hidden"
                } lg:relative lg:flex w-full lg:w-80 bg-white border-l border-gray-200 flex-col h-full shrink-0 z-40 inset-0 top-14 lg:top-0`}
        >
            <button
                onClick={() => setShowPalette(false)}
                className="lg:hidden absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-900"
            >
                ✕
            </button>
            <div className="p-4 border-b border-gray-200">
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500">
                    <option>Mard Beads</option>
                    <option>Perler Beads</option>
                    <option>Hama Beads</option>
                </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-500">
                        调色板 (MARD)
                    </h3>
                    <span className="text-xs text-gray-400">{PALETTE.length}</span>
                </div>

                <div className="grid grid-cols-4 gap-2 md:gap-4">
                    {PALETTE.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setCurrentColor(p.id)}
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div
                                className={`w-10 h-10 rounded-full border-2 transition-all ${currentColor === p.id
                                    ? "border-blue-500 scale-110 shadow-md ring-2 ring-blue-500/20"
                                    : "border-transparent shadow-sm hover:scale-110 hover:border-gray-300 hover:shadow-md"
                                    }`}
                                style={{ backgroundColor: p.color }}
                            >
                                <div className="w-full h-full rounded-full border-[6px] border-white/20 mix-blend-overlay"></div>
                            </div>
                            <span className="text-[10px] text-gray-500 group-hover:text-gray-900">
                                #{p.code}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {(showStats || stats.length > 0) && (
                <div className="h-1/3 border-t border-gray-200 p-4 overflow-y-auto bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">
                        库存 ({stats.length})
                    </h3>
                    {stats.length === 0 ? (
                        <div className="text-center text-sm text-gray-400 mt-10">
                            Start drawing to generate the list
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {stats.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: s.color }}
                                        ></div>
                                        <span className="text-gray-700">
                                            #{s.code} {s.name}
                                        </span>
                                    </div>
                                    <span className="text-gray-500">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </aside>
    );
};
