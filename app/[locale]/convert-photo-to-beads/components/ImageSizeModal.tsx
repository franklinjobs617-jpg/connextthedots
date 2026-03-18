import React, { useState, useRef, useEffect } from "react";
import { GridData } from "../types";
import { PRESETS, CELL_SIZE } from "../constants";
import { findClosestColor } from "../utils";

interface ImageSizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    image: HTMLImageElement | null;
    onConfirm: (width: number, height: number, grid: GridData, boardSize: number) => void;
    palette: any[];
}

export const ImageSizeModal = ({
    isOpen,
    onClose,
    image,
    onConfirm,
    palette,
}: ImageSizeModalProps) => {
    const [presetIndex, setPresetIndex] = useState(0);
    const [boardsX, setBoardsX] = useState(2);
    const [customWidth, setCustomWidth] = useState(58);

    const [previewGrid, setPreviewGrid] = useState<GridData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    const boardSize = PRESETS[presetIndex].width;
    const width = PRESETS[presetIndex].name === "Custom" ? customWidth : boardSize * boardsX;
    const rawHeight = image ? Math.round((image.height / image.width) * width) : width;

    // Optimization: Total height calculated directly from image ratio, no longer forced to board multiples to avoid large empty space at bottom
    const height = rawHeight;

    useEffect(() => {
        if (!image || !isOpen) return;

        if (isProcessing) return;

        const timer = setTimeout(() => {
            setIsProcessing(true);

            requestAnimationFrame(() => {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    setIsProcessing(false);
                    return;
                }

                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(image, 0, 0, width, rawHeight);

                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;

                const newGrid: GridData = Array(height)
                    .fill(null)
                    .map(() => Array(width).fill(null));

                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const idx = (y * width + x) * 4;
                        const r = data[idx];
                        const g = data[idx + 1];
                        const b = data[idx + 2];
                        const a = data[idx + 3];

                        if (a > 200) {
                            const closest = findClosestColor(r, g, b, palette);
                            newGrid[y][x] = closest.id;
                        } else {
                            newGrid[y][x] = null;
                        }
                    }
                }

                setPreviewGrid(newGrid);
                setIsProcessing(false);
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [width, height, image, isOpen, palette]);

    useEffect(() => {
        if (!previewGrid || !previewCanvasRef.current) return;

        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const colorMap = new Map(palette.map((p) => [p.id, p.color]));
        const maxSize = 400;
        const scale = Math.min(
            1,
            maxSize / Math.max(width * CELL_SIZE, height * CELL_SIZE)
        );
        const cellSize = Math.max(CELL_SIZE * scale, 2);

        canvas.width = width * cellSize;
        canvas.height = height * cellSize;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        previewGrid.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    const color = colorMap.get(cell);
                    if (color) {
                        ctx.fillStyle = color;

                        if (cellSize <= 4) {
                            ctx.fillRect(x * cellSize, y * cellSize, Math.ceil(cellSize), Math.ceil(cellSize));
                        } else {
                            const cx = x * cellSize + cellSize / 2;
                            const cy = y * cellSize + cellSize / 2;
                            const outerRadius = Math.max(cellSize / 2 - 0.5, 0.5);

                            ctx.beginPath();
                            ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            });
        });
    }, [previewGrid, width, height, palette]);

    if (!isOpen || !image) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-4 md:p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Select Bead Size</h2>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
                            {isProcessing ? (
                                <div className="text-gray-500">Processing...</div>
                            ) : (
                                <canvas ref={previewCanvasRef} className="max-w-full" />
                            )}
                        </div>
                    </div>

                    <div className="lg:w-80 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bead Board Size (Physical Size)
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Custom Total Width (beads): {customWidth} px
                                </label>
                                <input
                                    type="range"
                                    min="20"
                                    max="200"
                                    value={customWidth}
                                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>20</span>
                                    <span>200</span>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Horizontal Boards: <span className="text-blue-600 font-semibold">{boardsX}</span> boards
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={boardsX}
                                    onChange={(e) => setBoardsX(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>1 minimal</span>
                                    <span>10 giant</span>
                                </div>
                            </div>
                        )}

                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <p className="text-sm text-gray-700 flex justify-between">
                                <span>Total Width (pixels):</span>
                                <span className="font-semibold text-blue-700">{width} beads</span>
                            </p>
                            <p className="text-sm text-gray-700 flex justify-between mt-1">
                                <span>Total Height (approx):</span>
                                <span className="font-semibold text-blue-700">{height} beads</span>
                            </p>
                        </div>

                        <div className="bg-amber-50 p-3 rounded text-xs text-amber-700 border border-amber-200">
                            <p className="font-medium mb-1 flex items-center gap-1">✨ Grid Guide Tip:</p>
                            <p>We will draw thick cutting lines on the canvas based on your selected board size (e.g., every 29 beads), so you won't miscount a single bead!</p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    previewGrid && onConfirm(width, height, previewGrid, boardSize)
                                }
                                disabled={!previewGrid}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                            >
                                Confirm & Draw Lines
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
