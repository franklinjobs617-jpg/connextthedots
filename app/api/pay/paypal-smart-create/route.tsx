import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { googleUserId, type } = await req.json();

    const backendRes = await fetch(
      "https://api.connectthedotsprintable.online/prod-api/paypal/smart/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleUserId, type, project: "content" }),
      }
    );

    const data = await backendRes.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { code: 500, msg: message },
      { status: 500 }
    );
  }
}
