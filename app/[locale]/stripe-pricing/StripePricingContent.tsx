"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, ArrowRight, Check, CheckCircle2, Cpu, Loader2 } from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth } from "@/lib/auth-context";

type VerificationStatus = "idle" | "loading" | "success" | "error";

interface PlanCardProps {
    title: string;
    price: string;
    desc: string;
    features: string[];
    type: string;
    loading: boolean;
    onStripe: () => void;
    featured?: boolean;
    isLoaded: boolean;
    isLoggedIn: boolean;
    user: {
        googleUserId?: string | number;
        id?: string | number;
        email?: string;
    } | null;
    login: () => void;
    refreshUser: () => Promise<void>;
    setVerificationStatus: (status: VerificationStatus) => void;
}

export default function StripePricingContent() {
    const t = useTranslations("pricing");
    const { user, isLoggedIn, isLoaded, login, refreshUser } = useAuth();

    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("PayerID")) {
            handleVerifyPayPal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (verificationStatus === "success") {
            const timer = setTimeout(() => {
                window.location.href = "/";
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [verificationStatus]);

    const handleVerifyPayPal = async () => {
        setVerificationStatus("loading");
        try {
            const res = await fetch(`https://api.connectthedotsprintable.online/prod-api/paypal/retUrl${window.location.search}`);
            const data = await res.json();
            if (data.code === 200) {
                await refreshUser();
                setVerificationStatus("success");
                setTimeout(() => {
                    window.location.href = "/";
                }, 3000);
            } else {
                setVerificationStatus("error");
            }
        } catch {
            setVerificationStatus("error");
        }
    };

    const handleStripePayment = async (planType: string) => {
        if (!isLoggedIn) {
            login();
            return;
        }

        setLoadingPlan(planType);
        try {
            const res = await fetch("/api/pay/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    provider: "stripe",
                    googleUserId: user?.googleUserId || user?.id,
                    userId: user?.id,
                    type: planType,
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Service busy, please try again.");
            }
        } catch {
            alert("Payment connection failed.");
        } finally {
            setLoadingPlan(null);
        }
    };

    if (verificationStatus !== "idle") {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                {verificationStatus === "loading" && (
                    <div className="space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
                        <h2>Verifying Payment...</h2>
                    </div>
                )}
                {verificationStatus === "success" && (
                    <div className="space-y-4">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                        <h2>Payment Successful!</h2>
                        <p>Redirecting to home...</p>
                    </div>
                )}
                {verificationStatus === "error" && (
                    <div className="space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <h2>Payment Verification Failed</h2>
                        <button onClick={() => setVerificationStatus("idle")} className="px-6 py-2 bg-slate-900 text-white rounded-xl">
                            Retry
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="bg-slate-50 min-h-screen text-slate-900 pb-20 pt-10">
                <div className="max-w-5xl mx-auto text-center px-4">
                    <h1 className="text-5xl font-black mb-4 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">{t("heroTitle")}</span>
                    </h1>
                    <p className="text-slate-600 font-medium mb-12">{t("heroSubtitle")}</p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    <PlanCard
                        title={t("tiers.saver.name")}
                        price={t("tiers.saver.price")}
                        desc={t("tiers.saver.desc")}
                        features={[t("tiers.saver.features.0"), t("tiers.saver.features.1"), t("tiers.saver.features.2")]}
                        type="content_lifesaver_once"
                        loading={loadingPlan === "content_lifesaver_once"}
                        onStripe={() => handleStripePayment("content_lifesaver_once")}
                        isLoaded={isLoaded}
                        isLoggedIn={isLoggedIn}
                        user={user}
                        refreshUser={refreshUser}
                        setVerificationStatus={setVerificationStatus}
                        featured
                        login={login}
                    />

                    <PlanCard
                        title={t("tiers.monthly.name")}
                        price={t("tiers.monthly.price")}
                        desc={t("tiers.monthly.desc")}
                        features={[t("tiers.monthly.features.0"), t("tiers.monthly.features.1"), t("tiers.monthly.features.2"), t("tiers.monthly.features.3")]}
                        type="content_creator_monthly"
                        loading={loadingPlan === "content_creator_monthly"}
                        onStripe={() => handleStripePayment("content_creator_monthly")}
                        setVerificationStatus={setVerificationStatus}
                        isLoaded={isLoaded}
                        isLoggedIn={isLoggedIn}
                        user={user}
                        refreshUser={refreshUser}
                        login={login}
                    />

                    <PlanCard
                        title={t("tiers.annual.name")}
                        setVerificationStatus={setVerificationStatus}
                        price={t("tiers.annual.price")}
                        desc={t("tiers.annual.desc")}
                        features={[t("tiers.annual.features.0"), t("tiers.annual.features.1"), t("tiers.annual.features.2"), t("tiers.annual.features.3")]}
                        type="content_pro_master_yearly"
                        loading={loadingPlan === "content_pro_master_yearly"}
                        onStripe={() => handleStripePayment("content_pro_master_yearly")}
                        isLoaded={isLoaded}
                        isLoggedIn={isLoggedIn}
                        user={user}
                        refreshUser={refreshUser}
                        login={login}
                    />
                </div>

                <div className="max-w-4xl mx-auto px-4 mt-24">
                    <div className="bg-white border border-indigo-100 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center shadow-lg shadow-indigo-100/50">
                        <div className="mb-6 md:mb-0 md:mr-10 bg-indigo-50 p-5 rounded-2xl shrink-0">
                            <Cpu size={48} className="text-indigo-600" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                {t("aiTech.title")}
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Beta</span>
                            </h4>
                            <p className="text-slate-600 text-sm leading-relaxed">{t("aiTech.body")}</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-black text-center mb-16 tracking-tighter text-slate-900 uppercase italic">{t("faq.title")}</h2>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((num) => (
                            <div key={num} className="group border border-slate-100 rounded-2xl p-6 hover:border-indigo-100 hover:shadow-sm transition-all">
                                <h4 className="font-bold text-lg mb-3 text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {t(`faq.q${num}`)}
                                </h4>
                                <p className="text-slate-500 leading-relaxed text-sm">
                                    {t(`faq.a${num}`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

function PlanCard({
    title,
    price,
    desc,
    features,
    type,
    loading,
    onStripe,
    featured = false,
    isLoaded,
    isLoggedIn,
    user,
    login,
    refreshUser,
    setVerificationStatus,
}: PlanCardProps) {
    const isSubscription = type.includes("monthly") || type.includes("yearly");
    const [paypalLoading, setPaypalLoading] = useState(false);

    const handlePayPalSubscription = async () => {
        if (!isLoggedIn) {
            login();
            return;
        }

        setPaypalLoading(true);
        try {
            const res = await fetch("/api/pay/paypal-smart-create-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    googleUserId: user?.googleUserId || user?.id,
                    email: user?.email,
                    userId: user?.id,
                }),
            });
            const json = await res.json();
            const approveUrl = json?.data;

            if (json?.code === 200 && typeof approveUrl === "string" && approveUrl.startsWith("http")) {
                window.location.href = approveUrl;
                return;
            }

            setVerificationStatus("error");
        } catch (error) {
            console.error("PayPal subscription create error:", error);
            setVerificationStatus("error");
        } finally {
            setPaypalLoading(false);
        }
    };

    return (
        <div className={`bg-white p-8 rounded-[2.5rem] flex flex-col transition-all border ${featured ? "ring-4 ring-indigo-100 shadow-2xl md:scale-105 z-10" : "shadow-sm border-slate-200"}`}>
            <div className="mb-6">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-slate-500 text-sm mt-1">{desc}</p>
                <div className="mt-4 text-4xl font-black">${price}</div>
            </div>
            <ul className="space-y-3 mb-8 grow">
                {features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm font-medium">
                        <Check className="w-4 h-4 text-emerald-500 mr-2" />
                        {feature}
                    </li>
                ))}
            </ul>

            <div className="space-y-3">
                <button
                    disabled={loading}
                    onClick={onStripe}
                    className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${featured ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-slate-900 text-white hover:bg-black"}`}
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Pay with Stripe <ArrowRight className="w-4 h-4" /></>}
                </button>

                {isSubscription ? (
                    <button
                        disabled={paypalLoading}
                        onClick={handlePayPalSubscription}
                        className="w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 bg-[#0070ba] text-white hover:bg-[#005ea6] disabled:opacity-70"
                    >
                        {paypalLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Subscribe with PayPal <ArrowRight className="w-4 h-4" /></>}
                    </button>
                ) : !isLoaded ? (
                    <button
                        disabled
                        className="w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 bg-[#0070ba] text-white opacity-70"
                    >
                        <Loader2 className="animate-spin w-5 h-5" />
                        Loading PayPal...
                    </button>
                ) : !isLoggedIn ? (
                    <button
                        onClick={login}
                        className="w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 bg-[#0070ba] text-white hover:bg-[#005ea6]"
                    >
                        Login to use PayPal <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <div className="z-0">
                        <PayPalButtons
                            style={{
                                layout: "vertical",
                                shape: "rect",
                                borderRadius: 12,
                                height: 48,
                                label: "pay",
                            }}
                            forceReRender={[type, String(user?.id || ""), String(user?.googleUserId || "")]}
                            createOrder={async () => {
                                if (!isLoggedIn) {
                                    throw new Error("Please login before PayPal checkout");
                                }

                                const res = await fetch("/api/pay/paypal-smart-create", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        type,
                                        googleUserId: user?.googleUserId || user?.id,
                                        email: user?.email,
                                        userId: user?.id,
                                    }),
                                });
                                const json = await res.json();

                                if (json?.code !== 200 || !json?.data) {
                                    throw new Error(json?.msg || "Create PayPal order failed");
                                }

                                return json.data;
                            }}
                            onApprove={async (data) => {
                                try {
                                    setVerificationStatus("loading");
                                    const res = await fetch("/api/pay/paypal-smart-capture", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ orderId: data.orderID }),
                                    });
                                    const json = await res.json();
                                    if (json.code === 200) {
                                        await refreshUser();
                                        setVerificationStatus("success");
                                    } else {
                                        setVerificationStatus("error");
                                    }
                                } catch (error) {
                                    console.error("PayPal capture error:", error);
                                    setVerificationStatus("error");
                                }
                            }}
                            onCancel={() => console.log("Payment Cancelled")}
                            onError={(error) => {
                                console.error("PayPal Error:", error);
                                setVerificationStatus("error");
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
