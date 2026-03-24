import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const difficulty = searchParams.get("difficulty");
        const limit = parseInt(searchParams.get("limit") || "50");

        const where: any = { isPublic: true };
        if (difficulty) where.difficulty = difficulty;

        const puzzles = await prisma.connectDotsPuzzle.findMany({
            where,
            orderBy: { createTime: "desc" },
            take: limit,
            include: {
                user: {
                    select: { name: true, picture: true },
                },
            },
        });

        return NextResponse.json(puzzles);
    } catch (error) {
        console.error("Gallery fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
