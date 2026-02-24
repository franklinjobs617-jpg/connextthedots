"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Home, XCircle, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/lib/auth-context";

export default function PayPalPaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { refreshUser } = useAuth(); // 获取刷新积分的方法

    // 获取 PayPal 回调参数
    const token = searchParams.get("token");
    const payerId = searchParams.get("PayerID");

    const [status, setStatus] = useState<"verifying" | "success" | "error" | "timeout">("verifying");
    const [message, setMessage] = useState("");

    // 轮询/重试控制
    const checkCountRef = useRef(0);
    const maxChecks = 10; // PayPal capture 通常只需要一次请求，这里设置重试是为了防止网络抖动

    useEffect(() => {
        // 1. 参数校验
        if (!payerId) {
            // 如果缺少必要参数，跳回首页
            router.push("/");
            return;
        }

        const completePayment = async () => {
            try {
                // 2. 调用我们刚才创建的 Next.js 代理接口
                const res = await fetch(`/api/pay/paypalCheck?token=${token}&PayerID=${payerId}`);
                const result = await res.json();

                if (result.status === 'success') {
                    setStatus("success");

                    // ★★★ 核心：支付成功，强制刷新本地积分 ★★★
                    try {
                        console.log("PayPal payment captured. Refreshing user credits...");
                        await refreshUser();
                    } catch (e) {
                        console.error("Sync credits failed:", e);
                    }

                    // 3. 延迟跳转回首页
                    setTimeout(() => {
                        router.push("/");
                    }, 2000);

                    return true; // 停止重试
                } else {
                    // 如果 API 明确返回错误 (code != 0)
                    if (checkCountRef.current > 1) {
                        setStatus("error");
                        setMessage(result.message || "Payment processing failed.");
                        return true; // 停止重试
                    }
                    return false; // 如果是第一次失败，允许重试一次
                }
            } catch (err) {
                console.error("Network error:", err);
                return false;
            }
        };

        const timer = setInterval(async () => {
            checkCountRef.current += 1;

            // 执行检查
            const isDone = await completePayment();

            if (isDone) {
                clearInterval(timer);
            } else if (checkCountRef.current >= maxChecks) {
                clearInterval(timer);
                setStatus("timeout");
            }
        }, 2000); // 2秒间隔

        return () => clearInterval(timer);
    }, [token, payerId, router, refreshUser]);

    return (
        <div className="min-h-screen bg-[#020204] text-white flex items-center justify-center font-sans p-4 relative overflow-hidden">

            {/* 背景装饰 (复刻了你参考代码的氛围) */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-md w-full p-10 rounded-[40px] bg-zinc-900/50 border border-white/5 text-center backdrop-blur-2xl shadow-2xl relative z-10">

                {/* 顶部 Logo 区域 */}
                <div className="mb-8 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                        <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase">PayPal Secure</span>
                    </div>
                </div>

                {/* 状态 1: 处理中 */}
                {status === "verifying" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="relative w-16 h-16 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <Loader2 className="absolute inset-0 w-8 h-8 text-blue-500 m-auto animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">
                            Finalizing...
                        </h1>
                        <p className="text-zinc-500 font-medium">
                            Please wait while we confirm your transaction.
                        </p>
                    </div>
                )}

                {/* 状态 2: 成功 */}
                {status === "success" && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-green-500 animate-bounce" />
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase text-white">
                            Payment Success!
                        </h1>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Transaction completed via PayPal.<br />
                            Your credits have been added.
                        </p>
                        {/* 进度条 */}
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-[progress_2s_ease-in-out_infinite] w-full origin-left"></div>
                        </div>
                    </div>
                )}

                {/* 状态 3: 超时 */}
                {status === "timeout" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-4">Taking longer than expected</h1>
                        <p className="text-zinc-500 mb-8">
                            We received your request, but PayPal is taking a while to respond.
                            Please check your dashboard in a minute.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 text-white rounded-2xl font-bold hover:bg-zinc-700 transition-all w-full justify-center"
                        >
                            <Home className="w-4 h-4" /> Go to Dashboard
                        </Link>
                    </div>
                )}

                {/* 状态 4: 错误/取消 */}
                {status === "error" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h1 className="text-2xl font-bold mb-4">Transaction Failed</h1>
                        <p className="text-zinc-500 mb-8">
                            {message || "The payment could not be completed or was cancelled."}
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all w-full justify-center"
                        >
                            Try Again
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}