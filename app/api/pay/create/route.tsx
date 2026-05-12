import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { googleUserId, type, userId, provider = "creem" } = await req.json();

        const priceMap: Record<string, { amount: string; remark: string }> = {
            content_pro_master_yearly: { amount: "49.90", remark: "Yearly Pro Master" },
            content_creator_monthly: { amount: "8.90", remark: "Monthly Creator" },
            content_lifesaver_once: { amount: "4.90", remark: "Life-saver Once" },
            content_creator_pro_yearly: { amount: "199.00", remark: "Creator Pro Yearly" },
            content_creator_pro_monthly: { amount: "22.90", remark: "Creator Pro Monthly" },
            content_hobbyist_yearly: { amount: "129.00", remark: "Hobbyist Yearly" },
            content_hobbyist_monthly: { amount: "12.90", remark: "Hobbyist Monthly" },
            content_credits_45: { amount: "9.90", remark: "45 AI Credits" },
            content_credits_15: { amount: "6.90", remark: "15 AI Credits" },
        };

        if (!priceMap[type]) {
            return NextResponse.json({ error: "Invalid Plan" }, { status: 400 });
        }

        const normalizedProvider = String(provider).toLowerCase();
        const gatewayUrl = normalizedProvider === "stripe"
            ? "https://api.connectthedotsprintable.online/prod-api/stripe/getPayUrl"
            : "https://api.connectthedotsprintable.online/prod-api/creem/pay";

        const gatewayRes = await fetch(gatewayUrl, {
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
        const checkoutUrl = resData?.data?.checkoutUrl || resData?.checkoutUrl || resData?.url;

        if (!gatewayRes.ok || !checkoutUrl) {
            return NextResponse.json(
                { error: resData?.msg || "Failed to create checkout session" },
                { status: 500 }
            );
        }

        return NextResponse.json({ url: checkoutUrl });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
