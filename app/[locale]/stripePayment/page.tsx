"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Home, XCircle, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/lib/auth-context"; // 引入 AuthContext

export default function StripePaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");

    // 从 AuthContext 获取刷新用户数据的方法
    const { refreshUser } = useAuth();

    const [status, setStatus] = useState<"verifying" | "success" | "error" | "timeout">("verifying");
    const [message, setMessage] = useState("");

    // 轮询计数器
    const checkCountRef = useRef(0);
    const maxChecks = 30; // 30次 * 2秒 = 60秒超时 (Webhook 处理通常需要几秒)

    useEffect(() => {
        // 1. 安全检查：没有 sessionId 直接回首页
        if (!sessionId) {
            router.push("/");
            return;
        }

        const checkOrderStatus = async () => {
            try {
                // 2. 直接请求 Java 中转接口查询 Stripe 状态
                const res = await fetch(`https://connectthedotsprintable.online/prod-api/stripe/check-order-status?sessionId=${sessionId}`, {
                    // 避免缓存，确保查到最新状态
                    cache: 'no-store',
                    headers: { 'Pragma': 'no-cache' }
                });

                const result = await res.json();

                // 3. 判断逻辑 (根据你之前提供的参考代码，data === 'paid' 代表成功)
                if (result.data === 'paid') {
                    setStatus("success");

                    // ★★★ 核心步骤：支付确认成功，立即同步最新积分到前端 ★★★
                    try {
                        console.log("Java backend confirmed payment. Refreshing user credits...");
                        await refreshUser();
                        console.log("Credits synchronized.");
                    } catch (syncError) {
                        console.error("Failed to sync user data locally:", syncError);
                    }

                    // 4. 延迟 2 秒自动跳回首页，让用户看到成功动画
                    setTimeout(() => {
                        router.push("/");
                    }, 2000);

                    return true; // 返回 true 表示已完成，停止轮询
                }
                else {
                    // 如果不是 paid (可能是 pending)，返回 false 继续轮询
                    return false;
                }
            } catch (err) {
                console.error("Verification network error:", err);
                // 网络报错不直接判死刑，继续重试直到超时
                return false;
            }
        };

        // 5. 设置轮询定时器 (每 2 秒一次)
        const timer = setInterval(async () => {
            checkCountRef.current += 1;
            const isDone = await checkOrderStatus();

            if (isDone) {
                clearInterval(timer);
            } else if (checkCountRef.current >= maxChecks) {
                clearInterval(timer);
                setStatus("timeout"); // 超时处理
            }
        }, 2000);

        // 清理函数
        return () => clearInterval(timer);
    }, [sessionId, router, refreshUser]);

    return (
        <div className="min-h-screen bg-[#020204] text-white flex items-center justify-center font-sans p-4">
            <div className="max-w-md w-full p-10 rounded-[40px] bg-zinc-900/50 border border-white/5 text-center backdrop-blur-2xl shadow-2xl">

                {/* 状态 1: 校验中 */}
                {status === "verifying" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto mb-6" />
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">
                            Verifying Order
                        </h1>
                        <p className="text-zinc-500 font-medium">
                            Waiting for confirmation...
                        </p>
                        <p className="text-zinc-700 text-xs mt-6 font-mono">
                            Attempt {checkCountRef.current} of {maxChecks}
                        </p>
                    </div>
                )}

                {/* 状态 2: 支付成功 */}
                {status === "success" && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6 animate-pulse" />
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase text-white">
                            Payment Success!
                        </h1>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Your credits have been added successfully.<br />
                            Redirecting to workspace...
                        </p>
                        {/* 进度条动画 */}
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-[progress_2s_ease-in-out_infinite] w-full origin-left"></div>
                        </div>
                    </div>
                )}

                {/* 状态 3: 超时 (Webhook处理慢) */}
                {status === "timeout" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">
                            Processing...
                        </h1>
                        <p className="text-zinc-500 mb-8">
                            Your payment is confirmed, but it&apos;s taking a moment to update your credits.
                            Please check your dashboard in a minute.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-700 hover:scale-105 transition-all w-full justify-center shadow-lg"
                        >
                            <Home className="w-4 h-4" /> Go to Dashboard
                        </Link>
                    </div>
                )}

                {/* 状态 4: 错误 */}
                {status === "error" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">
                            Verification Failed
                        </h1>
                        <p className="text-zinc-500 mb-8">
                            {message || "We couldn't verify your payment instantly. If you were charged, please contact support."}
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-700 hover:scale-105 transition-all w-full justify-center shadow-lg"
                        >
                            Return Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}