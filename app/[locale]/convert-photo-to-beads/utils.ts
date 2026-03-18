import { GridData } from "./types";

export function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

// 基于人眼感知的 RGB 加权空间色差
export function colorDistance(
    r1: number,
    g1: number,
    b1: number,
    r2: number,
    g2: number,
    b2: number
) {
    const rmean = (r1 + r2) / 2;
    const r = r1 - r2;
    const g = g1 - g2;
    const b = b1 - b2;

    // 这是一种经典的加权颜色距离算法，极好地防止了对比强烈的颜色发灰变粉
    return Math.sqrt(
        ((512 + rmean) * r * r) / 256 + 4 * g * g + ((767 - rmean) * b * b) / 256
    );
}

const paletteRgbCache = new Map<string, { r: number; g: number; b: number }>();

export function findClosestColor(
    r: number,
    g: number,
    b: number,
    palette: any[]
) {
    // 色彩预处理：提升色彩鲜艳度和厚度，防止转换变灰 
    const boost = (v: number) => {
        let n = v / 255;
        n = (n - 0.5) * 1.35 + 0.5; // +35% 对比度
        // 再稍微压低亮度(-5%)，弥补拼豆自带的塑料浅色感
        return Math.max(0, Math.min(255, n * 255 * 0.95));
    };

    const tr = boost(r);
    const tg = boost(g);
    const tb = boost(b);

    let minDistance = Infinity;
    let closestColor = palette[0];

    for (const p of palette) {
        if (!paletteRgbCache.has(p.id)) {
            const rgb = hexToRgb(p.color);
            if (rgb) paletteRgbCache.set(p.id, rgb);
        }

        const pRgb = paletteRgbCache.get(p.id);
        if (!pRgb) continue;

        let distance = colorDistance(tr, tg, tb, pRgb.r, pRgb.g, pRgb.b);

        // 重点保护动漫黑线和深对比区块
        const luma1 = 0.299 * tr + 0.587 * tg + 0.114 * tb;
        const luma2 = 0.299 * pRgb.r + 0.587 * pRgb.g + 0.114 * pRgb.b;
        if (luma1 < 60 && luma2 > 85) {
            distance *= 2.5; // 惩罚错配成灰色
        }

        if (distance < minDistance) {
            minDistance = distance;
            closestColor = p;
        }
    }
    return closestColor;
}

export function floodFill(
    grid: GridData,
    startX: number,
    startY: number,
    targetColorId: string | null,
    replacementColorId: string | null
): GridData {
    if (targetColorId === replacementColorId) return grid;
    if (
        startX < 0 ||
        startX >= grid[0].length ||
        startY < 0 ||
        startY >= grid.length
    )
        return grid;
    if (grid[startY][startX] !== targetColorId) return grid;

    const newGrid = grid.map((row) => [...row]);
    const queue = [{ x: startX, y: startY }];
    newGrid[startY][startX] = replacementColorId;

    while (queue.length > 0) {
        const { x: cx, y: cy } = queue.shift()!;
        const neighbors = [
            { x: cx + 1, y: cy },
            { x: cx - 1, y: cy },
            { x: cx, y: cy + 1 },
            { x: cx, y: cy - 1 },
        ];

        for (const n of neighbors) {
            if (
                n.x >= 0 &&
                n.x < newGrid[0].length &&
                n.y >= 0 &&
                n.y < newGrid.length
            ) {
                if (newGrid[n.y][n.x] === targetColorId) {
                    newGrid[n.y][n.x] = replacementColorId;
                    queue.push(n);
                }
            }
        }
    }
    return newGrid;
}

// 【极致性能优化】预渲染精灵图（Sprite Stamp）缓存池
const detailedBeadCache = new Map<string, HTMLCanvasElement>();

export function getDetailedBeadCanvas(color: string, cellSize: number) {
    const key = `${color}-${cellSize}`;
    if (detailedBeadCache.has(key)) return detailedBeadCache.get(key)!;

    const padding = 6;
    const size = cellSize + padding;
    const cvs = document.createElement("canvas");
    cvs.width = size;
    cvs.height = size;
    const ctx = cvs.getContext("2d");
    if (!ctx) return cvs;

    const cx = size / 2;
    const cy = size / 2;
    const outerRadius = cellSize / 2 - 0.5;
    const innerRadius = cellSize / 4;

    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    const highlightGradient = ctx.createRadialGradient(
        cx - outerRadius * 0.3, cy - outerRadius * 0.3, 0,
        cx - outerRadius * 0.3, cy - outerRadius * 0.3, outerRadius * 0.6
    );
    highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.6)");
    highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();

    const holeGradient = ctx.createRadialGradient(
        cx, cy, innerRadius * 0.5,
        cx, cy, innerRadius
    );
    holeGradient.addColorStop(0, "rgba(0, 0, 0, 0.4)");
    holeGradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");

    ctx.fillStyle = holeGradient;
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    ctx.stroke();

    detailedBeadCache.set(key, cvs);
    return cvs;
}
