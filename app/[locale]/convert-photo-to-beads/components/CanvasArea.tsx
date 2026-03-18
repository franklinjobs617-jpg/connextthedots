import React from "react";
import { GridData } from "../types";
import { CELL_SIZE } from "../constants";

interface CanvasAreaProps {
    mainRef: React.RefObject<HTMLElement | null>;
    tool: string;
    isPanning: boolean;
    pan: { x: number; y: number };
    zoom: number;
    grid: GridData;
    handleWrapperPointerDown: (e: any) => void;
    renderRulerX: React.ReactNode;
    renderRulerY: React.ReactNode;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    showGrid: boolean;
    handleCanvasPointerDown: (e: any) => void;
    handleCanvasPointerMove: (e: any) => void;
    handlePointerUp: () => void;
    setHoverCell: (val: { x: number; y: number } | null) => void;
}

export const CanvasArea = ({
    mainRef,
    tool,
    isPanning,
    pan,
    zoom,
    grid,
    handleWrapperPointerDown,
    renderRulerX,
    renderRulerY,
    canvasRef,
    showGrid,
    handleCanvasPointerDown,
    handleCanvasPointerMove,
    handlePointerUp,
    setHoverCell
}: CanvasAreaProps) => {
    return (
        <main
            ref={mainRef}
            className={`flex-1 overflow-hidden bg-[#f4f5f7] relative ${tool === "pan"
                ? isPanning
                    ? "cursor-grabbing"
                    : "cursor-grab"
                : ""
                }`}
            style={{ touchAction: "none" }}
        >
            <div
                className="absolute top-1/2 left-1/2 origin-center"
                style={{
                    transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))`,
                }}
            >
                <div
                    className="relative bg-white shadow-lg border border-slate-200"
                    style={{
                        width: (grid[0].length * CELL_SIZE) * zoom + 28,
                        height: (grid.length * CELL_SIZE) * zoom + 28,
                    }}
                    onPointerDown={handleWrapperPointerDown}
                >
                    {/* Header Ruler Container */}
                    <div className="absolute top-0 left-0 w-full h-[28px] bg-[#f8fafc] flex pointer-events-none z-10 border-b border-slate-200">
                        <div className="w-[28px] h-[28px] border-r border-slate-200 bg-[#ebf2ff] flex-shrink-0 flex items-center justify-center relative">
                            <div className="w-[1px] h-3 bg-slate-400 rotate-45" />
                            <div className="absolute right-0 bottom-0 w-[1px] h-3 bg-slate-400 translate-x-1/2" />
                            <div className="absolute right-0 bottom-0 h-[1px] w-3 bg-slate-400 translate-y-1/2" />
                        </div>
                        {/* Direct SVG sizing for pixel-perfect alignment and vector sharpness */}
                        <div className="flex-1 overflow-hidden" style={{ width: (grid[0].length * CELL_SIZE) * zoom, height: 28 }}>
                            {renderRulerX}
                        </div>
                    </div>

                    {/* Side Ruler Container */}
                    <div className="absolute top-0 left-0 w-[28px] h-full bg-[#f8fafc] flex flex-col pt-[28px] pointer-events-none border-r border-slate-200 z-10">
                        <div className="flex-1 overflow-hidden" style={{ width: 28, height: (grid.length * CELL_SIZE) * zoom }}>
                            {renderRulerY}
                        </div>
                    </div>

                    <canvas
                        ref={canvasRef}
                        className={`absolute touch-none ${tool === "pan"
                            ? isPanning
                                ? "cursor-grabbing"
                                : "cursor-grab"
                            : tool === "eyedropper"
                                ? "cursor-crosshair"
                                : "cursor-none"
                            }`}
                        width={grid[0].length * CELL_SIZE}
                        height={grid.length * CELL_SIZE}
                        style={{
                            top: 28,
                            left: 28,
                            width: (grid[0].length * CELL_SIZE) * zoom,
                            height: (grid.length * CELL_SIZE) * zoom,
                            backgroundImage: showGrid
                                ? `
                linear-gradient(to right, #cbd5e1 1px, transparent 1px),
                linear-gradient(to bottom, #cbd5e1 1px, transparent 1px),
                linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
              `
                                : "none",
                            backgroundSize: `${CELL_SIZE * zoom * 5}px ${CELL_SIZE * zoom * 5}px, 
                                            ${CELL_SIZE * zoom * 5}px ${CELL_SIZE * zoom * 5}px,
                                            ${CELL_SIZE * zoom}px ${CELL_SIZE * zoom}px,
                                            ${CELL_SIZE * zoom}px ${CELL_SIZE * zoom}px`,
                        }}
                        onPointerDown={handleCanvasPointerDown}
                        onPointerMove={handleCanvasPointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={() => {
                            handlePointerUp();
                            setHoverCell(null);
                        }}
                    />
                </div>
            </div>
        </main>
    );
};
