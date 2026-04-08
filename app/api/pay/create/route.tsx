import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { googleUserId, type, userId } = await req.json();

        const priceMap: Record<string, { amount: string; remark: string }> = {
            content_pro_master_yearly: { amount: "49.90", remark: "Yearly Pro Master" },
            content_creator_monthly: { amount: "8.90", remark: "Monthly Creator" },
            content_lifesaver_once: { amount: "4.90", remark: "Life-saver Once" },
        };

        if (!priceMap[type]) {
            return NextResponse.json({ error: "Invalid Plan" }, { status: 400 });
        }

        const gatewayRes = await fetch("https://api.connectthedotsprintable.online/prod-api/stripe/getPayUrl", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                googleUserId,
                type,
                userId: userId ? String(userId) : undefined,
                project: "content",
            }),
        });

        const resData = await gatewayRes.json();
        const checkoutUrl = resData?.data || resData?.url;

        if (!gatewayRes.ok || !checkoutUrl) {
            return NextResponse.json(
                { error: resData?.msg || "Failed to create Stripe checkout session" },
                { status: 500 }
            );
        }

        return NextResponse.json({ url: checkoutUrl });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
