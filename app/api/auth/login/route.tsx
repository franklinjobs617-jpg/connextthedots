import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const NEW_USER_STARTING_CREDITS = "2";
const SITE_TYPE_ID = "6";
const CONTENT_TYPE_PRO = "content_pro_master_yearly";
const CONTENT_TYPE_CREATOR = "content_creator_monthly";
const CONTENT_TYPE_LIFESAVER = "content_lifesaver_once";
const CONTENT_TYPE_CREATOR_PRO_YEARLY = "content_creator_pro_yearly";
const CONTENT_TYPE_CREATOR_PRO_MONTHLY = "content_creator_pro_monthly";
const CONTENT_TYPE_HOBBYIST_YEARLY = "content_hobbyist_yearly";
const CONTENT_TYPE_HOBBYIST_MONTHLY = "content_hobbyist_monthly";
const CONTENT_TYPES = [
    CONTENT_TYPE_PRO,
    CONTENT_TYPE_CREATOR,
    CONTENT_TYPE_LIFESAVER,
    CONTENT_TYPE_CREATOR_PRO_YEARLY,
    CONTENT_TYPE_CREATOR_PRO_MONTHLY,
    CONTENT_TYPE_HOBBYIST_YEARLY,
    CONTENT_TYPE_HOBBYIST_MONTHLY,
] as const;

type PaymentTypeRow = { type: string | null };

function planRank(plan?: string | null): number {
    const normalized = String(plan || "free").toLowerCase();
    if (normalized === "creator_pro") return 4;
    if (normalized === "pro_master") return 3;
    if (normalized === "creator") return 2;
    if (normalized === "hobbyist") return 2;
    if (normalized === "lifesaver") return 1;
    if (normalized === "premium") return 2;
    return 0;
}

function planByPayType(payType?: string | null): string | null {
    if (payType === CONTENT_TYPE_PRO) return "pro_master";
    if (payType === CONTENT_TYPE_CREATOR) return "creator";
    if (payType === CONTENT_TYPE_LIFESAVER) return "lifesaver";
    if (payType === CONTENT_TYPE_CREATOR_PRO_YEARLY || payType === CONTENT_TYPE_CREATOR_PRO_MONTHLY) return "creator_pro";
    if (payType === CONTENT_TYPE_HOBBYIST_YEARLY || payType === CONTENT_TYPE_HOBBYIST_MONTHLY) return "hobbyist";
    return null;
}

async function resolveConnectPlan(googleUserId?: string, email?: string, currentPlan?: string | null): Promise<string> {
    const safeGoogleUserId = googleUserId || "__EMPTY__";
    const safeEmail = email || "__EMPTY__";

    const stripeRows = await prisma.$queryRawUnsafe<PaymentTypeRow[]>(
        `SELECT type
         FROM pay
         WHERE type IN (${CONTENT_TYPES.map(() => "?").join(", ")})
           AND status = '1'
           AND (google_user_id = ? OR email = ?)
         ORDER BY update_time DESC, id DESC
         LIMIT 30`,
        ...CONTENT_TYPES,
        safeGoogleUserId,
        safeEmail
    );

    const paypalRows = await prisma.$queryRawUnsafe<PaymentTypeRow[]>(
        `SELECT type
         FROM paypal_pay
         WHERE type IN (${CONTENT_TYPES.map(() => "?").join(", ")})
           AND status = '2'
           AND (google_user_id = ? OR email = ?)
         ORDER BY update_time DESC, id DESC
         LIMIT 30`,
        ...CONTENT_TYPES,
        safeGoogleUserId,
        safeEmail
    );

    let resolvedPlan = String(currentPlan || "free");
    const allRows = [...stripeRows, ...paypalRows];
    for (const row of allRows) {
        const candidate = planByPayType(row.type);
        if (candidate && planRank(candidate) > planRank(resolvedPlan)) {
            resolvedPlan = candidate;
        }
    }
    return resolvedPlan;
}

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

        if (user.type === SITE_TYPE_ID) {
            const derivedPlan = await resolveConnectPlan(user.googleUserId || undefined, user.email || undefined, user.plan);
            if (derivedPlan !== (user.plan || "free")) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { plan: derivedPlan },
                });
            }
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
