import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 商业化配置：新用户注册只送 2 个体验积分 (止血策略)
const NEW_USER_STARTING_CREDITS = "2";
// 站点 ID配置
const SITE_TYPE_ID = "6";

export async function POST(req: NextRequest) {
    try {
        const { accessToken } = await req.json();

        // 1. 调用 Google 接口验证 Token
        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!googleRes.ok) {
            return NextResponse.json({ error: 'Invalid Google Token' }, { status: 401 });
        }

        const payload = await googleRes.json();
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        // 2. 先查询用户是否存在
        let user = await prisma.user.findUnique({
            where: { email: payload.email },
        });

        if (!user) {
            // ============================
            // 场景 A: 新用户注册
            // ============================
            user = await prisma.user.create({
                data: {
                    email: payload.email,
                    googleUserId: payload.sub,
                    name: payload.name,
                    givenName: payload.given_name,
                    familyName: payload.family_name,
                    picture: payload.picture,
                    accessToken: accessToken,
                    ip: clientIp,

                    score: "0",                     // 初始分数
                    credits: NEW_USER_STARTING_CREDITS, // ★ 初始 2 积分 

                    type: SITE_TYPE_ID,             // ★ 站点 ID (6)
                    plan: "free",                   // ★ 新增：初始会员等级 (free)
                }
            });
        } else {
            // ============================
            // 场景 B: 老用户登录
            // ============================
            // 只更新基础信息，绝不碰 credits 和 plan
            user = await prisma.user.update({
                where: { email: payload.email },
                data: {
                    accessToken: accessToken,
                    ip: clientIp,
                    picture: payload.picture,
                    name: payload.name,
                }
            });
        }

        // 3. 返回数据给前端
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
                type: user.type, // "6" (站点ID)
                plan: user.plan, // ★ "free" 或 "premium" (用于判断权限)
            }
        });

    } catch (error: any) {
        console.error("Login API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}