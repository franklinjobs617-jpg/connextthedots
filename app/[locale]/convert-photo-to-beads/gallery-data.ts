import { GridData } from "./types";

// 画廊图纸类型定义
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
    grid: GridData;
    createdAt: string;
}

/**
 * 全自动画廊加载器
 *
 * 使用方式（只需 1 步！）：
 * 1. Editor → Export → 导出画廊 JSON → 把 .json 丢进 /public/gallery/ 目录
 *
 * 系统通过 /api/gallery 自动扫描目录，无需任何手动注册。
 */
export async function loadGalleryPatterns(): Promise<GalleryPattern[]> {
    try {
        // Step 1: 调 API 获取 /public/gallery/ 下所有 JSON 文件名
        const indexRes = await fetch("/api/gallery");
        const fileNames: string[] = await indexRes.json();

        if (!fileNames.length) return [];

        // Step 2: 并行加载所有 JSON 文件
        const results = await Promise.all(
            fileNames.map(async (name) => {
                try {
                    const res = await fetch(`/gallery/${name}.json`);
                    if (res.ok) return (await res.json()) as GalleryPattern;
                } catch (e) {
                    console.warn(`加载画廊图纸失败: ${name}`, e);
                }
                return null;
            })
        );

        return results.filter(Boolean) as GalleryPattern[];
    } catch {
        console.warn("画廊加载失败");
        return [];
    }
}
