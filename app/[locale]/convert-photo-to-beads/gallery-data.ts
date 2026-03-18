import { GridData } from "./types";
import { decompressGrid } from "./lib/compress-utils";

// 画廊图纸完整结构
export interface GalleryPattern {
    id: string;
    slug: string;
    title: string;
    description: string;
    author: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    category: string;
    tags: string[];
    width: number;
    height: number;
    beadCount: number;
    grid?: GridData;          // 原始二维数组，按需加载
    gridString: string;       // 核心：压缩后的像素字符串
    thumbnail?: string;       // 面向未来的缩略图预览
    createdAt: string;
}

// 内存级缓存：防止用户在页面间切换时重复请求
let patternsCache: GalleryPattern[] | null = null;

/**
 * 画廊高性能加载器 (带缓存机制)
 */
export async function loadGalleryPatterns(forceRefresh = false): Promise<GalleryPattern[]> {
    // 1. 如果已有缓存且不强制刷新，直接返回内存数据（实现秒开）
    if (patternsCache && !forceRefresh) {
        return patternsCache;
    }

    try {
        // 请求 API 获取所有预聚合的摘要数据
        const res = await fetch("/api/gallery", {
            cache: 'no-store' // 确保获取的是最新列表
        });

        if (!res.ok) return patternsCache || [];

        const index: GalleryPattern[] = await res.json();

        // 2. 核心解压缩：前端只在需要时解压
        const result = index.map((item) => {
            if (!item.grid && item.gridString) {
                try {
                    item.grid = decompressGrid(item.gridString, item.width, item.height);
                } catch { }
            }
            return item;
        });

        // 3. 更新缓存
        patternsCache = result;
        return result;
    } catch {
        console.warn("画廊数据拉取失败");
        return patternsCache || [];
    }
}
