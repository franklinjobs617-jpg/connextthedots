import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const AUTH_API_BASE_URL = 'https://api.connectthedotsprintable.online';
const APP_TYPE = 'content';

type BackendUser = {
    id: number;
    email?: string | null;
    googleUserId?: string | null;
    credits?: string | number | null;
    type?: string | null;
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
    });
}

async function getBackendUser(token: string): Promise<BackendUser> {
    const response = await fetch(`${AUTH_API_BASE_URL}/prod-api/g/getUser?type=6`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'X-App-Type': APP_TYPE,
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Your session has expired. Please sign in again to continue.');
    }

    const data = await response.json();
    if (data?.code !== 200 || !data?.data) {
        throw new Error(data?.msg || 'Your session has expired. Please sign in again to continue.');
    }

    return data.data;
}

async function consumeBackendCredit(token: string, user: BackendUser, idempotencyKey: string) {
    const response = await fetch(`${AUTH_API_BASE_URL}/prod-api/g/credits/consume`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-App-Type': APP_TYPE,
        },
        body: JSON.stringify({
            amount: 1,
            reason: 'doubao_image_generation',
            idempotencyKey,
            googleUserId: user.googleUserId,
            type: '6',
        }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || data?.code !== 200) {
        throw new Error(data?.msg || data?.error || 'Unable to deduct credits. Please try again.');
    }

    return data.data;
}

function createIdempotencyKey() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    return `doubao_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function POST(request: NextRequest) {
    const apiKey = process.env.DOUBAO_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'API key is not configured' }, { status: 500, headers: CORS_HEADERS });
    }

    try {
        const userInput = await request.json();
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Please sign in again to continue.' }, { status: 401, headers: CORS_HEADERS });
        }

        const token = authHeader.split(' ')[1];
        let backendUser: BackendUser;

        try {
            backendUser = await getBackendUser(token);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Your session has expired. Please sign in again to continue.';
            return NextResponse.json({ error: message }, { status: 401, headers: CORS_HEADERS });
        }

        const currentCredits = parseInt(String(backendUser.credits || '0'), 10);
        if (currentCredits <= 0) {
            return NextResponse.json({ error: 'You\'ve used up all your credits. Upgrade your plan to keep creating!' }, { status: 403, headers: CORS_HEADERS });
        }

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
                        external_id: backendUser.email ? `${backendUser.email}:gen_${Date.now()}` : `user_${backendUser.id}:gen_${Date.now()}`,
                    }),
                });

                if (moderationRes.ok) {
                    const moderationData = await moderationRes.json();
                    if (moderationData.status === 'flagged' || moderationData.flagged === true || moderationData.compliant === false) {
                        return NextResponse.json(
                            { error: 'Oops! Your prompt seems to contain content that doesn\'t meet our community guidelines. Please adjust it and give it another try.' },
                            { status: 400, headers: CORS_HEADERS }
                        );
                    }
                }
            } catch (moderationError) {
                console.warn('Moderation API error, proceeding:', moderationError);
            }
        }

        const requestBody = {
            ...userInput,
            model: 'Doubao-Seedream-3.0-t2i',
            watermark: false,
        };

        const doubaoResponse = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!doubaoResponse.ok) {
            const errorData = await doubaoResponse.json();
            return NextResponse.json(
                { error: errorData.error?.message || 'Something went wrong while generating your image. Please try again in a moment.' },
                { status: doubaoResponse.status, headers: CORS_HEADERS }
            );
        }

        const data = await doubaoResponse.json();
        const imageUrl = data.data?.[0]?.url;

        if (!imageUrl) {
            return NextResponse.json({ error: 'The generation didn\'t complete as expected. Try a different description and try again.' }, { status: 500, headers: CORS_HEADERS });
        }

        const imageFetchResponse = await fetch(imageUrl);
        if (!imageFetchResponse.ok) {
            return NextResponse.json({ error: 'We had trouble loading the image. Please hit generate again.' }, { status: 500, headers: CORS_HEADERS });
        }

        const contentType = imageFetchResponse.headers.get('content-type') || 'image/png';
        const imageArrayBuffer = await imageFetchResponse.arrayBuffer();

        try {
            await consumeBackendCredit(token, backendUser, createIdempotencyKey());
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to deduct credits. Please try again.';
            return NextResponse.json({ error: message }, { status: 402, headers: CORS_HEADERS });
        }

        return new Response(imageArrayBuffer, {
            status: 200,
            headers: {
                ...CORS_HEADERS,
                'Content-Type': contentType,
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error) {
        console.error('System Error:', error);
        return NextResponse.json(
            { error: 'Something unexpected happened on our end. Please try again shortly.' },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
