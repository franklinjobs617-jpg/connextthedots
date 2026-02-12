import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { googleUserId, type, email, userId } = await req.json();

        // 调用后端 PayPal 下单接口
        const backendRes = await fetch('https://api.connectthedotsprintable.online/prod-api/paypal/smart/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ googleUserId, type, project: "connectthedotsprintable" }),
        });

        const data = await backendRes.json();

        // 本地存根记录
        await prisma.pay.create({
            data: {
                userId: userId || "",
                googleUserId: googleUserId || "",
                email: email || "",
                orderNo: `PP_SMART_${Date.now()}`,
                checkoutUrl: "SMART_BUTTON",
                status: "1",
                type: type,
                businessType: "connectthedotsprintable", // 4 代表 PayPal
                amount: "0.00",
                remark: `PayPal Smart Order: ${data.data || 'No ID'}`,
                timestamp: Date.now().toString()
            }
        });

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ code: 500, msg: error.message }, { status: 500 });
    }
}