import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const puzzle = await prisma.connectDotsPuzzle.findUnique({
      where: { slug },
      include: {
        user: {
          select: { name: true, picture: true },
        },
      },
    });

    if (!puzzle || !puzzle.isPublic) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error("Puzzle fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
