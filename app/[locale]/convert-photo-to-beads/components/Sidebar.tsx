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
    const totalBeads = React.useMemo(() => stats.reduce((acc, s) => acc + s.count, 0), [stats]);

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

            <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-500">
                        Palette (MARD)
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
                <div className="flex-1 min-h-0 border-t border-gray-100 bg-slate-50/50 flex flex-col overflow-hidden">
                    <div className="shrink-0 p-4 border-b border-gray-100 bg-white flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                            Inventory ({stats.length})
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400">TOTAL: {totalBeads}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
                        {stats.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-sm text-slate-400 italic">Start drawing to see stats</p>
                            </div>
                        ) : (
                            stats.map((s) => (
                                <div
                                    key={s.id}
                                    className="group bg-white rounded-xl p-3 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-5 h-5 rounded-full shadow-inner border border-slate-200"
                                                style={{
                                                    backgroundColor: s.color,
                                                    boxShadow: `inset 0 1px 2px rgba(0,0,0,0.1)`
                                                }}
                                            ></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400">#{s.code}</span>
                                                <span className="text-sm font-semibold text-slate-700 truncate max-w-[140px] leading-none mt-0.5">
                                                    {s.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-black text-slate-900 leading-none">
                                                {s.count}
                                            </div>
                                            <div className="text-[10px] text-blue-600 font-bold uppercase mt-0.5">
                                                {Math.ceil(s.count / 1000)} BAGS
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full opacity-80"
                                            style={{
                                                width: `${(s.count / totalBeads) * 100}%`,
                                                backgroundColor: s.color,
                                            }}
                                        />
                                    </div>
                                    <div className="mt-1 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <span>{((s.count / totalBeads) * 100).toFixed(1)}% Usage</span>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                                            Click to select
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
};
