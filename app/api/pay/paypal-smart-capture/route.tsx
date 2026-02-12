import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json();

        const backendRes = await fetch('https://api.connectthedotsprintable.online/prod-api/paypal/smart/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
        });

        const data = await backendRes.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ code: 500, msg: error.message }, { status: 500 });
    }
}