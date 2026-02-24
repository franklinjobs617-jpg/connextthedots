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

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ code: 500, msg: error.message }, { status: 500 });
    }
}