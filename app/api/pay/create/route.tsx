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

        // 2. 请求后端 Java/Python 统一支付中转接口
        const gatewayRes = await fetch('https://api.connectthedotsprintable.online/prod-api/stripe/getPayUrl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ googleUserId, type, project: "connectthedotsprintable" }),
        });

        const resData = await gatewayRes.json();
        const checkoutUrl = resData.data || resData.url;

        // 3. 记录到本地数据库
        await prisma.pay.create({
            data: {
                userId,
                googleUserId,
                email,
                orderNo: `STRIPE_${Date.now()}`,
                checkoutUrl: checkoutUrl || "",
                status: "1", // 待支付
                type: type,
                businessType: "connectthedotsprintable",
                amount: plan.amount,
                remark: plan.remark,
                timestamp: Date.now().toString()
            }
        });

        return NextResponse.json({ url: checkoutUrl });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}