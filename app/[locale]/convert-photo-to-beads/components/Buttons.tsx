import React from "react";

export const ToolButton = ({ icon: Icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all active:scale-[0.98] ${active
            ? "bg-zinc-900 text-white font-medium shadow-sm"
            : "text-gray-500 hover:bg-zinc-100 hover:text-gray-900 active:bg-zinc-200"
            }`}
    >
        <Icon size={15} strokeWidth={active ? 2.5 : 2} />
        <span className="tracking-tight">{label}</span>
    </button>
);

export const IconButton = ({ icon: Icon, active, onClick, disabled }: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded-md transition-all active:scale-[0.98] ${active
            ? "bg-zinc-900 text-white shadow-sm"
            : "text-gray-500 hover:bg-zinc-100 hover:text-gray-900"
            } ${disabled ? "opacity-20 cursor-not-allowed" : ""}`}
    >
        <Icon size={17} strokeWidth={active ? 2.5 : 2} />
    </button>
);
