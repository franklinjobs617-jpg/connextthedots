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
                    transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
                    willChange: "transform",
                }}
            >
                <div
                    className="relative bg-white shadow-sm border border-gray-200"
                    style={{
                        width: grid[0].length * CELL_SIZE + 24,
                        height: grid.length * CELL_SIZE + 24,
                    }}
                    onPointerDown={handleWrapperPointerDown}
                >
                    <div className="absolute top-0 left-0 w-full h-6 bg-gray-50 flex pointer-events-none">
                        <div className="w-6 h-6 border-r border-b border-gray-200 bg-gray-50"></div>
                        {renderRulerX}
                    </div>
                    <div className="absolute top-0 left-0 w-6 h-full bg-gray-50 flex flex-col pt-6 pointer-events-none">
                        {renderRulerY}
                    </div>

                    <canvas
                        ref={canvasRef}
                        className={`absolute top-6 left-6 touch-none ${tool === "pan"
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
                            width: grid[0].length * CELL_SIZE,
                            height: grid.length * CELL_SIZE,
                            backgroundImage: showGrid
                                ? `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `
                                : "none",
                            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
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
