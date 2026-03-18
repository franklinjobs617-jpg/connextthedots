import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { uploadToR2 } from "@/app/[locale]/convert-photo-to-beads/lib/r2-service";
import { compressGrid } from "@/app/[locale]/convert-photo-to-beads/lib/compress-utils";

/**
 * 【一次性迁移脚本】
 * 作用：扫描 public/gallery/ 下的所有旧 JSON，为其生成压缩字符串并同步到 R2
 */
export async function GET() {
    try {
        const galleryDir = path.join(process.cwd(), "public", "gallery");
        if (!fs.existsSync(galleryDir)) {
            return NextResponse.json({ error: "Gallery folder not found" });
        }

        const files = fs.readdirSync(galleryDir).filter((f) => f.endsWith(".json"));
        const results = {
            total: files.length,
            success: 0,
            skipped: 0,
            failed: 0,
            details: [] as string[],
        };

        // 串行执行，避免瞬间大量读写冲突
        for (const fileName of files) {
            try {
                const filePath = path.join(galleryDir, fileName);
                const content = fs.readFileSync(filePath, "utf-8");
                const data = JSON.parse(content);

                // 只有当有 grid 数据 且 没有 gridString 时才压缩（或者你想强制压缩所有）
                if (data.grid && (!data.gridString || data.gridString.length === 0)) {
                    console.log(`[Migrate] Processing: ${fileName}`);

                    // 1. 生成压缩字符串
                    data.gridString = compressGrid(data.grid);

                    // 2. 移除冗余的巨大 grid 数组 (节省 90% 存储)
                    // 此处保留 grid 还是删除？为了极致性能和 R2，我建议摘要版删除，但同步到本地的文件可以选留
                    // const { grid, ...optimizedData } = data;

                    // 3. 将新格式写回本地文件 (为了本地开发也享受加速)
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

                    // 4. 同步至 R2
                    const slug = data.slug || fileName.replace(".json", "");
                    if (process.env.R2_ENDPOINT) {
                        await uploadToR2(slug, data);
                    }

                    results.success++;
                    results.details.push(`Migrated & Uploaded: ${fileName}`);
                } else {
                    // 如果已经有 gridString，直接同步到 R2 (如果是刚配好 R2 的空桶)
                    if (process.env.R2_ENDPOINT && (!data.gridString || data.gridString.length > 0)) {
                        await uploadToR2(data.slug || fileName.replace(".json", ""), data);
                        results.details.push(`Direct Sync to R2: ${fileName}`);
                    }
                    results.skipped++;
                }

            } catch (err: any) {
                console.error(`[Migrate Error] ${fileName}:`, err);
                results.failed++;
                results.details.push(`Error ${fileName}: ${err.message}`);
            }
        }

        return NextResponse.json(results);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
