import React, { useState } from "react";
import { PRESETS } from "../constants";

interface NewCanvasModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (width: number, height: number) => void;
}

export const NewCanvasModal = ({ isOpen, onClose, onCreate }: NewCanvasModalProps) => {
    const [presetIndex, setPresetIndex] = useState(0);
    const [boardsX, setBoardsX] = useState(1);
    const [boardsY, setBoardsY] = useState(1);
    const [customWidth, setCustomWidth] = useState(29);
    const [customHeight, setCustomHeight] = useState(29);

    if (!isOpen) return null;

    const handleCreate = () => {
        let w, h;
        if (PRESETS[presetIndex].name === "Custom") {
            w = customWidth;
            h = customHeight;
        } else {
            w = PRESETS[presetIndex].width * boardsX;
            h = PRESETS[presetIndex].height * boardsY;
        }
        onCreate(w, h);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] p-4 md:p-6">
                <h2 className="text-lg font-semibold mb-4">新建拼豆板</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            拼豆板预设
                        </label>
                        <select
                            value={presetIndex}
                            onChange={(e) => setPresetIndex(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {PRESETS.map((p, i) => (
                                <option key={i} value={i}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {PRESETS[presetIndex].name === "Custom" ? (
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    宽度 (珠子数)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="200"
                                    value={customWidth}
                                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    高度 (珠子数)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="200"
                                    value={customHeight}
                                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    横向拼接板数
                                </label>
                                <select
                                    value={boardsX}
                                    onChange={(e) => setBoardsX(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    纵向拼接板数
                                </label>
                                <select
                                    value={boardsY}
                                    onChange={(e) => setBoardsY(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        创建
                    </button>
                </div>
            </div>
        </div>
    );
};
