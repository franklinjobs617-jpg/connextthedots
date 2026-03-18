import React from "react";

export const ToolButton = ({ icon: Icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all active:scale-95 ${active
            ? "bg-white text-blue-600 shadow-sm font-semibold ring-1 ring-black/5"
            : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 active:bg-gray-200"
            }`}
    >
        <Icon size={16} />
        <span>{label}</span>
    </button>
);

export const IconButton = ({ icon: Icon, active, onClick, disabled }: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-md transition-all active:scale-95 ${active
            ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
            : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 active:bg-gray-200"
            } ${disabled ? "opacity-50 cursor-not-allowed active:scale-100" : ""}`}
    >
        <Icon size={18} />
    </button>
);
