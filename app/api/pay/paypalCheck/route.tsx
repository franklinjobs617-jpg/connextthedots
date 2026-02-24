import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    // 获取 PayPal 回调的参数
    const token = searchParams.get('token');
    const payerId = searchParams.get('PayerID');

    if (!token || !payerId) {
        return NextResponse.json({ status: 'error', message: 'Missing PayPal parameters' });
    }

    try {
        // 构建透传给 Java 后端的参数
        const javaApiUrl = `https://api.connectthedotsprintable.online/prod-api/paypal/retUrl?token=${token}&PayerID=${payerId}`;

        // 调用 Java 后端完成扣款 (Capture Payment)
        const res = await fetch(javaApiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 如果 Java 后端需要特定的 Header，可以在这里加
            },
            cache: 'no-store'
        });

        const data = await res.json();

        // 根据你提供的 HTML 参考代码，code == 0 代表成功
        if (data.code == 0) {
            return NextResponse.json({ status: 'success' });
        } else {
            return NextResponse.json({
                status: 'error',
                message: data.msg || 'Payment capture failed'
            });
        }

    } catch (error) {
        console.error("PayPal API Error:", error);
        return NextResponse.json({ status: 'error', message: 'Server connection failed' });
    }
}