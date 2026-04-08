import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const NEW_USER_STARTING_CREDITS = "2";
const SITE_TYPE_ID = "6";

export async function POST(req: NextRequest) {
    try {
        const { accessToken } = await req.json();
        if (!accessToken) {
            return NextResponse.json({ error: "Missing access token" }, { status: 400 });
        }

        const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!googleRes.ok) {
            return NextResponse.json({ error: "Invalid Google Token" }, { status: 401 });
        }

        const payload = await googleRes.json();
        const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

        const orConditions: Array<{ email?: string; googleUserId?: string }> = [];
        if (payload?.email) {
            orConditions.push({ email: payload.email });
        }
        if (payload?.sub) {
            orConditions.push({ googleUserId: payload.sub });
        }

        if (orConditions.length === 0) {
            return NextResponse.json({ error: "Google user info missing email/sub" }, { status: 400 });
        }

        // 关键：只在当前站点(type=6)内查找，避免跨站点串账号
        let user = await prisma.user.findFirst({
            where: {
                type: SITE_TYPE_ID,
                OR: orConditions,
            },
            orderBy: { id: "desc" },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: payload.email ?? null,
                    googleUserId: payload.sub ?? null,
                    name: payload.name ?? null,
                    givenName: payload.given_name ?? null,
                    familyName: payload.family_name ?? null,
                    picture: payload.picture ?? null,
                    accessToken,
                    ip: clientIp,
                    score: "0",
                    credits: NEW_USER_STARTING_CREDITS,
                    type: SITE_TYPE_ID,
                    plan: "free",
                },
            });
        } else {
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    accessToken,
                    ip: clientIp,
                    picture: payload.picture ?? user.picture,
                    name: payload.name ?? user.name,
                    email: payload.email ?? user.email,
                    googleUserId: payload.sub ?? user.googleUserId,
                },
            });
        }

        return NextResponse.json({
            status: "success",
            user: {
                id: user.id,
                googleUserId: user.googleUserId,
                email: user.email,
                name: user.name,
                picture: user.picture,
                credits: user.credits,
                score: user.score,
                type: user.type,
                plan: user.plan,
            },
        });
    } catch (error: unknown) {
        console.error("Login API Error:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
