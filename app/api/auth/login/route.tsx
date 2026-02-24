import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { accessToken } = await req.json();

        // 1. 调用 Google 接口验证 Token 并获取用户信息
        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!googleRes.ok) {
            return NextResponse.json({ error: 'Invalid Google Token' }, { status: 401 });
        }

        const payload = await googleRes.json();
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        // 2. 更新或创建用户 (Upsert)
        // 对应你的 Schema 字段名
        const user = await prisma.user.upsert({
            where: { email: payload.email },
            update: {
                accessToken: accessToken,
                ip: clientIp,
                picture: payload.picture,
                name: payload.name,
            },
            create: {
                email: payload.email,
                googleUserId: payload.sub,
                name: payload.name,
                givenName: payload.given_name,
                familyName: payload.family_name,
                picture: payload.picture,
                accessToken: accessToken,
                ip: clientIp,
                score: "3",    // 默认值
                credits: "1",  // 默认值
                type: "6",     // 默认类型
            }
        });

        return NextResponse.json({
            status: "success",
            user: {
                id: user.id,
                googleUserId: user.googleUserId,
                email: user.email,
                name: user.name,
                picture: user.picture,
                credits: user.credits,
                score: user.score
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}