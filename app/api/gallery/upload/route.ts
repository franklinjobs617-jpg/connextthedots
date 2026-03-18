import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { uploadToR2 } from "@/app/[locale]/convert-photo-to-beads/lib/r2-service";
import { compressGrid } from "@/app/[locale]/convert-photo-to-beads/lib/compress-utils";

/**
 * 后端统一发布 API
 * 接收用户图纸数据 -> 压缩 -> 存储到 R2 或本地 FS
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, slug, title, grid, ...meta } = body;

        if (!grid || !slug) return NextResponse.json({ error: "Missing grid or slug" }, { status: 400 });

        // 1. 构建标准图纸结构，核心是压缩 grid 数据
        const galleryData = {
            id: id || `pattern-${Date.now()}`,
            slug,
            title: title || "Untitled Pattern",
            ...meta,
            gridString: compressGrid(grid), // 压缩图纸核心数据，剔除原本巨大的 grid 属性
            createdAt: new Date().toISOString().split("T")[0],
        };

        // 2. 策略 A: 优先上云 (R2)
        if (process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID) {
            console.log("[Upload API] Saving to Cloudflare R2:", slug);
            await uploadToR2(slug, galleryData);
        }

        // 3. 策略 B: 同时本地 FS 备份 (如果是开发模式或受信任的服务器)
        const galleryDir = path.join(process.cwd(), "public", "gallery");
        if (fs.existsSync(galleryDir)) {
            const filePath = path.join(galleryDir, `${slug}.json`);
            fs.writeFileSync(filePath, JSON.stringify(galleryData, null, 2));
        }

        return NextResponse.json({
            success: true,
            slug: galleryData.slug,
            message: "Successfully published to R2 and Local backup"
        });

    } catch (e) {
        console.error("[Upload API Error]", e);
        return NextResponse.json({ error: "Upload Failure" }, { status: 500 });
    }
}
