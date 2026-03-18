import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * 自动扫描 /public/gallery/ 目录下的所有 JSON 文件
 * 返回文件名列表，前端根据列表 fetch 对应的 JSON
 */
export async function GET() {
    try {
        const galleryDir = path.join(process.cwd(), "public", "gallery");

        if (!fs.existsSync(galleryDir)) {
            return NextResponse.json([]);
        }

        const files = fs
            .readdirSync(galleryDir)
            .filter((f) => f.endsWith(".json"))
            .map((f) => f.replace(".json", ""));

        return NextResponse.json(files);
    } catch {
        return NextResponse.json([], { status: 500 });
    }
}
