"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Home, XCircle, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/lib/auth-context";

export default function PayPalPaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { refreshUser } = useAuth();

    // 获取 PayPal 回调所有可能的参数
    const token = searchParams.get("token");
    const payerId = searchParams.get("PayerID");
    const subscriptionId = searchParams.get("subscription_id");

    const [status, setStatus] = useState<"verifying" | "success" | "error" | "timeout">("verifying");
    const [message, setMessage] = useState("");

    const checkCountRef = useRef(0);
    const maxChecks = 10; 

    useEffect(() => {
        if (!token && !payerId && !subscriptionId) {
            console.warn("Missing PayPal callback parameters, redirecting home...");
            router.push("/");
            return;
        }

        const completePayment = async () => {
            try {
                // 确定传给后端的 ID (订阅 ID 通常在 token 或 subscription_id 参数里)
                const finalToken = token || subscriptionId;
                
                // 构造请求 URL，确保把能拿到的 ID 都传过去
                const apiUrl = `/api/pay/paypalCheck?token=${finalToken}&PayerID=${payerId || ""}`;
                
                const res = await fetch(apiUrl);
                const result = await res.json();

                if (result.status === 'success') {
                    setStatus("success");

                    try {
                        console.log("PayPal payment confirmed. Refreshing user info...");
                        await refreshUser();
                    } catch (e) {
                        console.error("Sync user data failed:", e);
                    }

                    // 延迟跳转回首页
                    setTimeout(() => {
                        router.push("/");
                    }, 3000);

                    return true; 
                } else {
                    // 如果后端返回 code 错误
                    if (checkCountRef.current > 1) {
                        setStatus("error");
                        setMessage(result.message || "Payment verification failed.");
                        return true; 
                    }
                    return false; 
                }
            } catch (err) {
                console.error("Network error during verification:", err);
                return false;
            }
        };

        const timer = setInterval(async () => {
            checkCountRef.current += 1;
            const isDone = await completePayment();

            if (isDone) {
                clearInterval(timer);
            } else if (checkCountRef.current >= maxChecks) {
                clearInterval(timer);
                setStatus("timeout");
            }
        }, 2500); 

        return () => clearInterval(timer);
    }, [token, payerId, subscriptionId, router, refreshUser]);

    return (
        <div className="min-h-screen bg-[#020204] text-white flex items-center justify-center font-sans p-4 relative overflow-hidden">

            {/* 背景装饰 */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-md w-full p-10 rounded-[40px] bg-zinc-900/50 border border-white/5 text-center backdrop-blur-2xl shadow-2xl relative z-10">

                <div className="mb-8 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                        <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Secure Transaction</span>
                    </div>
                </div>

                {/* 1. 处理中 */}
                {status === "verifying" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="relative w-16 h-16 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <Loader2 className="absolute inset-0 w-8 h-8 text-blue-500 m-auto" />
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">
                            Verifying...
                        </h1>
                        <p className="text-zinc-500 font-medium">
                            Completing your order, please don't close this window.
                        </p>
                    </div>
                )}

                {/* 2. 成功 */}
                {status === "success" && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase text-white">
                            Success!
                        </h1>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Payment confirmed. Your account has been updated.<br />
                            Redirecting you to dashboard...
                        </p>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-[progress_3s_linear] w-full origin-left"></div>
                        </div>
                    </div>
                )}

                {/* 3. 超时或异常 */}
                {status === "timeout" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-4">Verification Pending</h1>
                        <p className="text-zinc-500 mb-8">
                            We've received your payment but it's taking a moment to sync. 
                            Your credits will appear in your account shortly.
                        </p>
                        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 text-white rounded-2xl font-bold hover:bg-zinc-700 transition-all w-full justify-center">
                            <Home className="w-4 h-4" /> Go to Dashboard
                        </Link>
                    </div>
                )}

                {/* 4. 错误 */}
                {status === "error" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
                        <p className="text-zinc-500 mb-8">
                            {message || "We couldn't verify this transaction with PayPal."}
                        </p>
                        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all w-full justify-center">
                            Return and Retry
                        </Link>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% { transform: scaleX(0); }
                    100% { transform: scaleX(1); }
                }
            `}</style>
        </div>
    );
}