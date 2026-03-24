import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { uploadConnectDotsImage } from "@/app/[locale]/convert-photo-to-beads/lib/r2-connect-dots-service";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("session_user_id")?.value;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { googleUserId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string || "";
        const difficulty = formData.get("difficulty") as string;
        const dotCount = parseInt(formData.get("dotCount") as string);
        const width = parseInt(formData.get("width") as string);
        const height = parseInt(formData.get("height") as string);
        const settings = formData.get("settings") as string || "";
        const originalImage = formData.get("originalImage") as File;
        const puzzleImage = formData.get("puzzleImage") as File;

        const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
        const puzzleId = `puzzle-${Date.now()}`;

        const originalBuffer = Buffer.from(await originalImage.arrayBuffer());
        const puzzleBuffer = Buffer.from(await puzzleImage.arrayBuffer());

        const originalUrl = await uploadConnectDotsImage(
            userId, puzzleId, "original", originalBuffer, originalImage.type
        );
        const puzzleUrl = await uploadConnectDotsImage(
            userId, puzzleId, "puzzle", puzzleBuffer, puzzleImage.type
        );

        const puzzle = await prisma.connectDotsPuzzle.create({
            data: {
                userId: user.id,
                slug,
                title,
                description,
                originalImageUrl: originalUrl,
                puzzleImageUrl: puzzleUrl,
                difficulty,
                dotCount,
                width,
                height,
                settings,
                isPublic: true,
            },
        });

        return NextResponse.json({ success: true, puzzle });
    } catch (error) {
        console.error("Save puzzle error:", error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}

