import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { listGalleryR2 } from "@/app/[locale]/convert-photo-to-beads/lib/r2-service";

/**
 * 核心优化：统一画廊索引 API
 * 返回高性能的画廊列表 (只有摘要信息)
 */
export async function GET() {
    try {
        // --- 策略 A: 尝试连接 Cloudflare R2 ---
        if (process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID) {
            console.log("[Gallery API] Attempting to load from Cloudflare R2");
            const fromR2 = await listGalleryR2();
            if (fromR2.length > 0) return NextResponse.json(fromR2);
        }

        // --- 策略 B: 回退到本地文件系统 (测试/本地开发环境) ---
        console.log("[Gallery API] Falling back to local FS");
        const galleryDir = path.join(process.cwd(), "public", "gallery");
        if (!fs.existsSync(galleryDir)) return NextResponse.json([]);

        const files = fs.readdirSync(galleryDir).filter((f) => f.endsWith(".json"));

        const summaryList = files.map((fileName) => {
            try {
                const content = fs.readFileSync(path.join(galleryDir, fileName), "utf-8");
                const data = JSON.parse(content);
                // 剔除巨大的 grid数据，确保 API 本身足够小
                const { grid, ...summary } = data;
                return { ...summary, fileName: fileName.replace(".json", "") };
            } catch {
                return null;
            }
        });

        const result = summaryList.filter(Boolean);
        // 按创建时间倒序排列
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(result);
    } catch (e) {
        console.error("[Gallery API Error]", e);
        return NextResponse.json({ error: "API Failure" }, { status: 500 });
    }
}
