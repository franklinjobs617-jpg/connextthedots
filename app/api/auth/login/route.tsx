import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 配置每日登录奖励的积分数量
const DAILY_LOGIN_REWARD = 1;

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
        const now = new Date();

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
                    score: "3",    // 初始 Score
                    credits: "5",  // 初始 Credits (根据你的 schema default 是 5)
                    type: "6",
                    // ★ 初始化每日奖励字段
                    last_daily_reward: now,
                    current_streak: "1"
                }
            });
        } else {
            // ============================
            // 场景 B: 老用户登录 (处理每日奖励逻辑)
            // ============================

            // 获取上次奖励时间
            const lastRewardDate = user.last_daily_reward ? new Date(user.last_daily_reward) : null;

            let newCredits = parseInt(user.credits || "0", 10);
            let newStreak = parseInt(user.current_streak || "0", 10);
            let shouldUpdateReward = false;

            // 判断日期逻辑
            if (lastRewardDate) {
                const isToday = lastRewardDate.toDateString() === now.toDateString();

                if (!isToday) {
                    // 不是今天，说明可以领奖励
                    shouldUpdateReward = true;
                    newCredits += DAILY_LOGIN_REWARD;

                    // 判断是否是“昨天” (判断是否连续)
                    const yesterday = new Date(now);
                    yesterday.setDate(yesterday.getDate() - 1);

                    const isYesterday = lastRewardDate.toDateString() === yesterday.toDateString();

                    if (isYesterday) {
                        newStreak += 1; // 连续登录，+1
                    } else {
                        newStreak = 1;  // 断签了，重置为 1
                    }
                }
                // 如果 isToday 为 true，说明今天已经领过了，什么都不改
            } else {
                // 以前没记录过时间 (老数据迁移)，算作第一次领取
                shouldUpdateReward = true;
                newCredits += DAILY_LOGIN_REWARD;
                newStreak = 1;
            }

            // 准备更新数据对象
            const updateData: any = {
                accessToken: accessToken,
                ip: clientIp,
                picture: payload.picture,
                name: payload.name,
                // 只有触发奖励时才更新时间和 Streak
                ...(shouldUpdateReward && {
                    credits: newCredits.toString(),
                    current_streak: newStreak.toString(),
                    last_daily_reward: now
                })
            };

            user = await prisma.user.update({
                where: { email: payload.email },
                data: updateData
            });
        }

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
                // 返回给前端展示，比如 "已连续登录 5 天"
                current_streak: user.current_streak,
                last_daily_reward: user.last_daily_reward
            }
        });

    } catch (error: any) {
        console.error("Login API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}