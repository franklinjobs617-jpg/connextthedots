import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { googleUserId, type, email, userId } = await req.json();

        // 1. 套餐价格映射
        const priceMap: any = {
            "content_pro_master_yearly": { amount: "49.90", remark: "Yearly Pro Master" },
            "content_creator_monthly": { amount: "8.90", remark: "Monthly Creator" },
            "content_lifesaver_once": { amount: "4.90", remark: "Life-saver Once" }
        };

        const plan = priceMap[type];
        if (!plan) return NextResponse.json({ error: "Invalid Plan" }, { status: 400 });
        console.log("Error in Stripe Create Pay URL:");


        // 2. 请求后端 Java/Python 统一支付中转接口
        const gatewayRes = await fetch('https://api.connectthedotsprintable.online/prod-api/stripe/getPayUrl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ googleUserId, type, project: "connectdots" }),
        });

        const resData = await gatewayRes.json();
        const checkoutUrl = resData.data || resData.url;

        return NextResponse.json({ url: checkoutUrl });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}