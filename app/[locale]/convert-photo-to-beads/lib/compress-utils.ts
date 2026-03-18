import { GridData } from "../types";
import { PALETTE } from "../palette-data";

/**
 * 拼豆图纸压缩/解压缩器
 * 将巨大的二维数组转换为轻量的字符矩阵
 *
 * 例子：
 * [["MARD_AA", "MARD_AA", null]] -> "0101__" (01: 对应的颜色索引, __: 空)
 */

const EMPTY_CELL = "__";

// 缓存调色板 ID 列表，用于建立索引表
const PALETTE_IDS = PALETTE.map((p) => p.id);

/**
 * 压缩：GridData -> String
 */
export function compressGrid(grid: GridData): string {
    if (!grid || grid.length === 0) return "";

    return grid
        .map((row) =>
            row
                .map((cell) => {
                    if (cell === null) return EMPTY_CELL;
                    const index = PALETTE_IDS.indexOf(cell);
                    if (index === -1) return EMPTY_CELL;
                    // 使用 36 进制进行 2 位转换 (支持 36*36=1296 种颜色，目前足够)
                    return index.toString(36).padStart(2, "0").toUpperCase();
                })
                .join("")
        )
        .join("");
}

/**
 * 解压缩：String -> GridData
 */
export function decompressGrid(compressed: string, width: number, height: number): GridData {
    const grid: GridData = Array(height)
        .fill(null)
        .map(() => Array(width).fill(null));

    if (!compressed || compressed.length !== width * height * 2) {
        console.warn("[Decompress] 数据长度不匹配，可能导致图纸损坏");
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pos = (y * width + x) * 2;
            const chunk = compressed.substring(pos, pos + 2);

            if (chunk === EMPTY_CELL) {
                grid[y][x] = null;
            } else {
                const index = parseInt(chunk, 36);
                grid[y][x] = PALETTE_IDS[index] || null;
            }
        }
    }

    return grid;
}
