// /api/doubao.js

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const setCorsHeaders = (res) => {
    Object.keys(CORS_HEADERS).forEach(key => {
        res.setHeader(key, CORS_HEADERS[key]);
    });
};

export default async function handler(request, response) {
    setCorsHeaders(response);

    if (request.method === 'OPTIONS') {
        return response.status(204).end();
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    // 您的 API Key
    const apiKey = process.env.DOUBAO_API_KEY;

    if (!apiKey) {
        return response.status(500).json({ error: 'API key is not configured' });
    }

    try {
        // --- 步骤 1: 请求豆包 API 生成图片 ---
        const userInput = request.body;
        const requestBody = {
            ...userInput,
            model: userInput.model || "doubao-seedream-3-0-t2i-250415",
            watermark: false
        };

        const DOUBAO_IMAGE_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';

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
            return response.status(doubaoResponse.status).json(errorData);
        }

        const data = await doubaoResponse.json();
        const imageUrl = data.data?.[0]?.url;

        if (!imageUrl) {
            console.error('Doubao response missing image URL:', data);
            return response.status(500).json({ error: 'Image URL missing from upstream API response.' });
        }

        // --- 步骤 2: 服务器获取图片数据 ---
        const imageFetchResponse = await fetch(imageUrl);

        if (!imageFetchResponse.ok) {
            return response.status(imageFetchResponse.status).json({ error: `Failed to fetch the generated image from storage. Status: ${imageFetchResponse.statusText}` });
        }

        // --- 步骤 3: 将图片数据流式传输回客户端 ---
        const imageBlob = await imageFetchResponse.blob();
        const contentType = imageFetchResponse.headers.get('content-type') || 'image/jpeg';

        // 设置正确的响应头，告诉浏览器这是一个图片
        response.setHeader('Content-Type', contentType);

        // 将 Blob 转换为 Buffer 并发送
        const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
        return response.status(200).send(imageBuffer);

    } catch (error) {
        console.error('Error in Doubao proxy:', error);
        return response.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}