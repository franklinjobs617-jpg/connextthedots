"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PALETTE } from "@/app/[locale]/convert-photo-to-beads/palette-data";
import { findClosestColor, getDetailedBeadCanvas } from "@/app/[locale]/convert-photo-to-beads/utils";
import { CELL_SIZE } from "@/app/[locale]/convert-photo-to-beads/constants";

export default function BeadComparisonSlider() {
    const [sliderPos, setSliderPos] = useState(50);
    const [beadCanvas, setBeadCanvas] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    useEffect(() => {
        const img = new (window as any).Image();
        img.crossOrigin = "anonymous";
        img.src = "/transformar-foto-em-desenho-anime-online.webp";
        img.onload = () => {
            const sampleCanvas = document.createElement("canvas");
            const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
            if (!sampleCtx) return;

            const gridW = 116;
            const rawH = Math.round((img.height / img.width) * gridW);
            const boardSize = 29;
            const gridH = Math.ceil(rawH / boardSize) * boardSize;

            sampleCanvas.width = gridW;
            sampleCanvas.height = gridH;
            sampleCtx.imageSmoothingEnabled = false;
            sampleCtx.drawImage(img, 0, 0, gridW, rawH);

            const imageData = sampleCtx.getImageData(0, 0, gridW, gridH);
            const data = imageData.data;
            const colorMap = new Map(PALETTE.map((p) => [p.id, p.color]));

            type GridRow = (string | null)[];
            const grid: GridRow[] = Array(gridH).fill(null).map(() => Array(gridW).fill(null));

            for (let y = 0; y < gridH; y++) {
                for (let x = 0; x < gridW; x++) {
                    const idx = (y * gridW + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    const a = data[idx + 3];

                    if (a > 200) {
                        const closest = findClosestColor(r, g, b, PALETTE);
                        grid[y][x] = closest.id;
                    }
                }
            }

            const outputCanvas = document.createElement("canvas");
            const outputCtx = outputCanvas.getContext("2d");
            if (!outputCtx) return;

            const cellSize = CELL_SIZE;
            outputCanvas.width = gridW * cellSize;
            outputCanvas.height = gridH * cellSize;

            outputCtx.fillStyle = "#ffffff";
            outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

            grid.forEach((row, y) => {
                row.forEach((cellId, x) => {
                    if (cellId) {
                        const color = colorMap.get(cellId);
                        if (color) {
                            const beadStamp = getDetailedBeadCanvas(color, cellSize);
                            const cx = x * cellSize + cellSize / 2;
                            const cy = y * cellSize + cellSize / 2;
                            outputCtx.drawImage(beadStamp, cx - (cellSize + 6) / 2, cy - (cellSize + 6) / 2);
                        }
                    }
                });
            });

            outputCtx.strokeStyle = "rgba(0, 0, 0, 0.08)";
            outputCtx.lineWidth = 1;
            outputCtx.beginPath();
            for (let x = 0; x <= outputCanvas.width; x += cellSize) {
                outputCtx.moveTo(x, 0);
                outputCtx.lineTo(x, outputCanvas.height);
            }
            for (let y = 0; y <= outputCanvas.height; y += cellSize) {
                outputCtx.moveTo(0, y);
                outputCtx.lineTo(outputCanvas.width, y);
            }
            outputCtx.stroke();

            setBeadCanvas(outputCanvas.toDataURL());
        };
    }, []);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPos(percent);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        handleMove(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isDragging.current) {
            handleMove(e.clientX);
        }
    };

    useEffect(() => {
        const handleUp = () => { isDragging.current = false; };
        window.addEventListener('pointerup', handleUp);
        return () => window.removeEventListener('pointerup', handleUp);
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative cursor-ew-resize select-none overflow-hidden bg-slate-100"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute top-6 left-6 z-20 px-3 py-1.5 bg-black/70 backdrop-blur-md text-white text-[10px] rounded-lg font-black uppercase tracking-widest border border-white/10">
                    Original
                </div>
                <div className="relative w-full h-full">
                    <Image src="/transformar-foto-em-desenho-anime-online.webp" alt="Original" fill className="object-cover" />
                </div>
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-white" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
                <div className="absolute top-6 right-6 z-30 px-3 py-1.5 bg-indigo-600 text-white text-[10px] rounded-lg font-black uppercase tracking-widest shadow-xl">
                    Pattern
                </div>
                <div className="relative w-full h-full flex items-center justify-center">
                    {beadCanvas ? <img src={beadCanvas} alt="Pattern" className="w-full h-full object-cover" /> : <div className="text-slate-400">Loading...</div>}
                </div>
            </div>

            <div className="absolute inset-y-0 z-20 w-1 bg-white shadow-lg" style={{ left: `${sliderPos}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="16" height="16" fill="currentColor"><path d="M470.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l41.4 41.4-357.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-41.4-41.4 357.5 0-41.4 41.4c12.5 12.5 12.5 32.8 0 45.3s32.8 12.5 45.3 0z" /></svg>
                </div>
            </div>
        </div>
    );
}
