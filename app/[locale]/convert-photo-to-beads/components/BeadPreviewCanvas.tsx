"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { PALETTE } from "../palette-data";
import { getDetailedBeadCanvas } from "../utils";
import { GridData } from "../types";

interface BeadPreviewCanvasProps {
    grid: GridData;
    /** 最大像素宽度，超过则自动缩放 */
    maxWidth?: number;
    /** 是否显示精细 3D 珠子（大图使用），否则用色块模式（缩略图用） */
    detailed?: boolean;
    className?: string;
}

/**
 * 通用拼豆预览画布组件
 * 接收 grid 数据（和 Editor 一样的 GridData 格式），自动渲染到 <canvas> 上。
 * 支持两种渲染模式：缩略图色块模式（高性能）和精细 3D 珠子模式（高品质）。
 */
export default function BeadPreviewCanvas({
    grid,
    maxWidth = 400,
    detailed = false,
    className = "",
}: BeadPreviewCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 构建 id → color 查找表
    const colorMap = useMemo(
        () => new Map(PALETTE.map((p) => [p.id, p.color])),
        []
    );

    const gridW = grid[0]?.length ?? 0;
    const gridH = grid.length;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || gridW === 0 || gridH === 0) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 根据 maxWidth 计算每颗珠子的渲染像素大小
        const baseCellSize = detailed ? 20 : Math.max(2, Math.min(12, Math.floor(maxWidth / gridW)));
        const cellSize = Math.min(baseCellSize, Math.floor(maxWidth / gridW));

        canvas.width = gridW * cellSize;
        canvas.height = gridH * cellSize;

        // 白色底板
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (detailed && cellSize >= 8) {
            // 精细模式：使用和 Editor 完全一致的 getDetailedBeadCanvas 印章
            grid.forEach((row, y) => {
                row.forEach((cellId, x) => {
                    if (cellId) {
                        const color = colorMap.get(cellId);
                        if (color) {
                            const beadStamp = getDetailedBeadCanvas(color, cellSize);
                            const cx = x * cellSize + cellSize / 2;
                            const cy = y * cellSize + cellSize / 2;
                            ctx.drawImage(
                                beadStamp,
                                cx - (cellSize + 6) / 2,
                                cy - (cellSize + 6) / 2
                            );
                        }
                    }
                });
            });
        } else {
            // 缩略图模式：纯色块 + 暗色中心孔（高性能）
            grid.forEach((row, y) => {
                row.forEach((cellId, x) => {
                    if (cellId) {
                        const color = colorMap.get(cellId);
                        if (color) {
                            const px = x * cellSize;
                            const py = y * cellSize;

                            // 色块填充
                            ctx.fillStyle = color;
                            ctx.fillRect(px, py, cellSize, cellSize);

                            // 模拟中心孔洞
                            if (cellSize >= 4) {
                                const cx = px + cellSize / 2;
                                const cy = py + cellSize / 2;
                                ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                                ctx.beginPath();
                                ctx.arc(cx, cy, cellSize / 4, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        }
                    }
                });
            });

            // 网格线
            if (cellSize >= 4) {
                ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let x = 0; x <= canvas.width; x += cellSize) {
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                }
                for (let y = 0; y <= canvas.height; y += cellSize) {
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                }
                ctx.stroke();
            }
        }
    }, [grid, maxWidth, detailed, colorMap, gridW, gridH]);

    return (
        <canvas
            ref={canvasRef}
            className={`max-w-full ${className}`}
            style={{ imageRendering: "auto" }}
        />
    );
}
