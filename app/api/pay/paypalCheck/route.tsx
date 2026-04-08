import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const payerId = searchParams.get("PayerID");

    if (!token) {
        return NextResponse.json({ status: "error", message: "Missing PayPal token" });
    }

    try {
        const javaParams = new URLSearchParams();
        javaParams.set("token", token);
        if (payerId) {
            javaParams.set("PayerID", payerId);
        }

        const javaApiUrl = `https://api.connectthedotsprintable.online/prod-api/paypal/retUrl?${javaParams.toString()}`;

        const res = await fetch(javaApiUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
        });

        const data = await res.json();

        if (data.code === 200) {
            return NextResponse.json({ status: "success" });
        }

        return NextResponse.json({
            status: "error",
            message: data.msg || "Payment verification failed",
        });
    } catch (error) {
        console.error("PayPal API Error:", error);
        return NextResponse.json({ status: "error", message: "Server connection failed" });
    }
}
