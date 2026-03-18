import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";

// 提示：这部分代码只在服务器端 (Server Mode) 运行，确保你的密钥安全
const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

/**
 * 上传图纸 JSON 到 R2
 */
export async function uploadToR2(key: string, data: any) {
    if (!BUCKET_NAME) throw new Error("R2_BUCKET_NAME 未配置");

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `gallery/${key}.json`,
        Body: JSON.stringify(data),
        ContentType: "application/json",
    });

    return await r2Client.send(command);
}

/**
 * 从 R2 下载图纸 JSON
 */
export async function getFromR2(key: string) {
    if (!BUCKET_NAME) throw new Error("R2_BUCKET_NAME 未配置");

    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `gallery/${key}.json`,
    });

    const response = await r2Client.send(command);
    const text = await response.Body?.transformToString();
    return text ? JSON.parse(text) : null;
}

/**
 * 列出所有图纸元数据 (模拟数据库查询)
 * 高级版：以后可以对接数据库提速，目前直接查列表并提取头部信息
 */
export async function listGalleryR2() {
    if (!BUCKET_NAME) throw new Error("R2_BUCKET_NAME 未配置");

    const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: "gallery/",
    });

    const response = await r2Client.send(command);
    if (!response.Contents) return [];

    // 并行获取元数据摘要
    const summaries = await Promise.all(
        response.Contents.map(async (obj) => {
            if (!obj.Key) return null;
            try {
                // 虽然 R2 获取元数据有 Head 请求，但我们的元数据在 JSON 内部。
                // 暂时加载整个 JSON，如果后续图纸极多，建议同时存入一个索引表（数据库）
                const detail = await getFromR2(obj.Key.replace("gallery/", "").replace(".json", ""));
                if (!detail) return null;

                // 剔除巨大的 grid 数组返回摘要
                const { grid, ...summary } = detail;
                return summary;
            } catch (e) {
                console.error("Failed to load R2 item:", obj.Key, e);
                return null;
            }
        })
    );

    return summaries.filter(Boolean);
}
