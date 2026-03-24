import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

export async function uploadConnectDotsImage(
    userId: string,
    puzzleId: string,
    imageType: "original" | "puzzle",
    imageBuffer: Buffer,
    contentType: string
) {
    if (!BUCKET_NAME) throw new Error("R2_BUCKET_NAME not configured");

    const ext = contentType.split('/')[1];
    const key = `connect-dots/${userId}/${puzzleId}/${imageType}.${ext}`;

    await r2Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: imageBuffer,
        ContentType: contentType,
    }));

    return `${process.env.R2_PUBLIC_URL}/${key}`;
}
