import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
    });
}

export async function POST(request: NextRequest) {
    const apiKey = process.env.DOUBAO_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'API key is not configured' }, { status: 500, headers: CORS_HEADERS });
    }

    try {
        const userInput = await request.json();

        // ==========================================
        // 1. 获取并验证用户 Token
        // ==========================================
        const authHeader = request.headers.get('authorization');
        let userEmail: string | null = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            // 向 Google 验证 Access Token
            try {
                const tokenInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
                if (tokenInfoRes.ok) {
                    const userInfo = await tokenInfoRes.json();
                    userEmail = userInfo.email; // 获取到对应的谷歌邮箱
                } else {
                    console.warn("Invalid or expired Google access token");
                    return NextResponse.json({ error: "Your session has expired. Please sign in again to continue." }, { status: 401, headers: CORS_HEADERS });
                }
            } catch (error) {
                console.error("Token validation error:", error);
            }
        }

        // ==========================================
        // 2. 检查数据库用户额度 (仅针对已登录用户)
        // ==========================================
        let dbUser = null;
        if (userEmail) {
            dbUser = await prisma.user.findUnique({
                where: { email: userEmail }
            });

            if (!dbUser) {
                return NextResponse.json({ error: 'We couldn\'t find your account. Please try signing in again.' }, { status: 404, headers: CORS_HEADERS });
            }

            // 你的 schema 中 credits 是 String 类型，需要转换为 int 判断
            const currentCredits = parseInt(dbUser.credits || "0", 10);

            if (currentCredits <= 0) {
                return NextResponse.json({ error: 'You\'ve used up all your credits. Upgrade your plan to keep creating!' }, { status: 403, headers: CORS_HEADERS });
            }
        }

        // ==========================================
        // 3. Creem.io 内容审核
        // ==========================================
        const userPrompt = userInput.prompt;
        if (userPrompt) {
            try {
                const moderationRes = await fetch('https://api.creem.io/v1/moderation/prompt', {
                    method: 'POST',
                    headers: {
                        'x-api-key': 'creem_3fmMvFBIxAnIfLvxs9TGtd',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: userPrompt,
                        external_id: userEmail ? `${userEmail}:gen_${Date.now()}` : `anonymous:gen_${Date.now()}`,
                    }),
                });

                if (moderationRes.ok) {
                    const moderationData = await moderationRes.json();
                    // 如果审核不通过，拒绝生成
                    if (moderationData.status === 'flagged' || moderationData.flagged === true || moderationData.compliant === false) {
                        return NextResponse.json(
                            { error: 'Oops! Your prompt seems to contain content that doesn\'t meet our community guidelines. Please adjust it and give it another try.' },
                            { status: 400, headers: CORS_HEADERS }
                        );
                    }
                }
                // 如果审核 API 调用失败，放行（不阻塞用户）
            } catch (moderationError) {
                console.warn('Moderation API error, proceeding:', moderationError);
            }
        }

        // ==========================================
        // 4. 准备豆包 API 参数
        // ==========================================
        const requestBody = {
            ...userInput,
            model: `Doubao-Seedream-3.0-t2i`,
            watermark: false
        };

        const DOUBAO_IMAGE_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';

        // ==========================================
        // 5. 请求豆包生成图片
        // ==========================================
        const doubaoResponse = await fetch(DOUBAO_IMAGE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!doubaoResponse.ok) {
            const errorData = await doubaoResponse.json();
            return NextResponse.json({ error: errorData.error?.message || 'Something went wrong while generating your image. Please try again in a moment.' }, { status: doubaoResponse.status, headers: CORS_HEADERS });
        }

        const data = await doubaoResponse.json();
        const imageUrl = data.data?.[0]?.url;

        if (!imageUrl) {
            return NextResponse.json({ error: 'The generation didn\'t complete as expected. Try a different description and try again.' }, { status: 500, headers: CORS_HEADERS });
        }

        // ==========================================
        // 6. 获取生成的图片
        // ==========================================
        const imageFetchResponse = await fetch(imageUrl);
        if (!imageFetchResponse.ok) {
            return NextResponse.json({ error: 'We had trouble loading the image. Please hit generate again.' }, { status: 500, headers: CORS_HEADERS });
        }

        // 获取 Content-Type 并以二进制流返回
        const contentType = imageFetchResponse.headers.get('content-type') || 'image/png';
        const imageArrayBuffer = await imageFetchResponse.arrayBuffer();

        // ==========================================
        // 7. 扣除数据库积分 (在图片成功获取后)
        // ==========================================
        if (userEmail && dbUser) {
            const currentCredits = parseInt(dbUser.credits || "0", 10);

            await prisma.user.update({
                where: { email: userEmail },
                data: {
                    // 转回 String 存入数据库
                    credits: (currentCredits - 1).toString()
                }
            });
        }

        // ==========================================
        // 8. 返回结果
        // ==========================================
        return new Response(imageArrayBuffer, {
            status: 200,
            headers: {
                ...CORS_HEADERS,
                'Content-Type': contentType,
                'Cache-Control': 'no-store, max-age=0', // 确保图片不被缓存
            },
        });

    } catch (error: any) {
        console.error("System Error:", error);
        return NextResponse.json(
            { error: 'Something unexpected happened on our end. Please try again shortly.' },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}