import { NextRequest, NextResponse } from 'next/server';

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

        // 豆包 API 配置
        const requestBody = {
            ...userInput,
            model: "doubao-seedream-4-5-251128",
            watermark: false
        };

        const DOUBAO_IMAGE_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';

        // 步骤 1: 请求豆包生成图片
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
            return NextResponse.json({ error: errorData.error?.message || 'Upstream API Error' }, { status: doubaoResponse.status, headers: CORS_HEADERS });
        }

        const data = await doubaoResponse.json();
        const imageUrl = data.data?.[0]?.url;

        if (!imageUrl) {
            return NextResponse.json({ error: 'No image URL returned from AI' }, { status: 500, headers: CORS_HEADERS });
        }

        // 步骤 2: 获取生成的图片
        const imageFetchResponse = await fetch(imageUrl);
        if (!imageFetchResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch generated image' }, { status: 500, headers: CORS_HEADERS });
        }

        // 步骤 3: 获取 Content-Type 并以二进制流返回
        const contentType = imageFetchResponse.headers.get('content-type') || 'image/png';
        const imageArrayBuffer = await imageFetchResponse.arrayBuffer();

        return new Response(imageArrayBuffer, {
            status: 200,
            headers: {
                ...CORS_HEADERS,
                'Content-Type': contentType,
                'Cache-Control': 'no-store, max-age=0', // 确保图片不被缓存
            },
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}