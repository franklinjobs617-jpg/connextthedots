"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Home, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/lib/auth-context";

export default function CreemPaymentPage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [status, setStatus] = useState<"verifying" | "success" | "timeout">("verifying");
    const [attempt, setAttempt] = useState(0);
    const initialCreditsRef = useRef<string | null>(null);
    const initialPlanRef = useRef<string | null>(null);
    const checksRef = useRef(0);
    const maxChecks = 30;

    useEffect(() => {
        initialCreditsRef.current = user?.credits || null;
        initialPlanRef.current = user?.plan || null;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const timer = setInterval(async () => {
            checksRef.current += 1;
            setAttempt(checksRef.current);

            try {
                await refreshUser();
                const savedUser = localStorage.getItem("app_user");
                const latest = savedUser ? JSON.parse(savedUser) : null;
                const creditsChanged = latest?.credits && latest.credits !== initialCreditsRef.current;
                const planChanged = latest?.plan && latest.plan !== initialPlanRef.current && latest.plan !== "free";

                if (creditsChanged || planChanged) {
                    setStatus("success");
                    clearInterval(timer);
                    setTimeout(() => router.push("/"), 2200);
                    return;
                }
            } catch (error) {
                console.error("Creem payment refresh failed", error);
            }

            if (checksRef.current >= maxChecks) {
                setStatus("timeout");
                clearInterval(timer);
            }
        }, 2000);

        return () => clearInterval(timer);
    }, [maxChecks, refreshUser, router]);

    return (
        <div className="min-h-screen bg-[#020204] text-white flex items-center justify-center font-sans p-4">
            <div className="max-w-md w-full p-10 rounded-[40px] bg-zinc-900/50 border border-white/5 text-center backdrop-blur-2xl shadow-2xl">
                {status === "verifying" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <Loader2 className="w-16 h-16 text-lime-400 animate-spin mx-auto mb-6" />
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">
                            Confirming Payment
                        </h1>
                        <p className="text-zinc-500 font-medium">
                            Creem is sending the payment confirmation. Your account will update automatically.
                        </p>
                        <p className="text-zinc-700 text-xs mt-6 font-mono">
                            Attempt {attempt} of {maxChecks}
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6 animate-pulse" />
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">
                            Payment Success!
                        </h1>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Your account has been updated.<br />
                            Redirecting to workspace...
                        </p>
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-[progress_2s_ease-in-out_infinite] w-full origin-left"></div>
                        </div>
                    </div>
                )}

                {status === "timeout" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">
                            Payment Processing
                        </h1>
                        <p className="text-zinc-500 mb-8">
                            Your payment was received. The webhook may still be updating your account, so please check again in a minute.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-700 hover:scale-105 transition-all w-full justify-center shadow-lg"
                        >
                            <Home className="w-4 h-4" /> Go to Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
