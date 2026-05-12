"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Check, Cpu, Loader2, Sparkles, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type Plan = {
    type: string;
    title: string;
    price: string;
    cadence: string;
    desc: string;
    credits: string;
    badge?: string;
    featured?: boolean;
    features: string[];
};

type BillingCycle = "monthly" | "yearly";

const ONE_TIME_PLANS: Plan[] = [
    {
        type: "content_credits_15",
        title: "Mini Pack",
        price: "6.90",
        cadence: "once",
        desc: "A quick refill for small custom worksheet batches.",
        credits: "15 AI Credits",
        features: ["One-time purchase", "HD PDF exports", "No subscription"],
    },
    {
        type: "content_credits_45",
        title: "Value Bundle",
        price: "9.90",
        cadence: "once",
        desc: "More room to iterate on classroom and printable ideas.",
        credits: "45 AI Credits",
        badge: "Best value pack",
        features: ["One-time purchase", "45 generations", "No subscription"],
    },
];

const SUBSCRIPTION_PLANS: Record<BillingCycle, Plan[]> = {
    monthly: [
        {
            type: "content_hobbyist_monthly",
            title: "Hobbyist",
            price: "12.90",
            cadence: "month",
            desc: "A steady monthly allowance for personal projects.",
            credits: "100 credits / month",
            features: ["Monthly credit refill", "Watermark-free PDFs", "Cancel anytime"],
        },
        {
            type: "content_creator_pro_monthly",
            title: "Creator Pro",
            price: "22.90",
            cadence: "month",
            desc: "For commercial creators who need more monthly capacity.",
            credits: "250 credits / month",
            featured: true,
            badge: "Most popular",
            features: ["Commercial license", "Monthly credit refill", "Priority creative capacity"],
        },
    ],
    yearly: [
        {
            type: "content_hobbyist_yearly",
            title: "Hobbyist",
            price: "129",
            cadence: "year",
            desc: "The hobbyist plan with a lower yearly rate.",
            credits: "100 credits / month",
            badge: "Save annually",
            features: ["Monthly credit refill", "Yearly billing", "Watermark-free PDFs"],
        },
        {
            type: "content_creator_pro_yearly",
            title: "Creator Pro",
            price: "199",
            cadence: "year",
            desc: "The strongest plan for sellers, teachers, and repeat creators.",
            credits: "250 credits / month",
            badge: "Best yearly deal",
            featured: true,
            features: ["Commercial license", "Yearly billing", "Monthly credit refill"],
        },
    ],
};

export default function PricingContent() {
    const t = useTranslations("pricing");
    const { user, isLoggedIn, login } = useAuth();
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const visiblePlans = [...ONE_TIME_PLANS, ...SUBSCRIPTION_PLANS[billingCycle]];

    const handleCreemPayment = async (planType: string) => {
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
                    provider: "creem",
                    googleUserId: user?.googleUserId || user?.id,
                    userId: user?.id,
                    type: planType,
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
                return;
            }
            alert(data.error || "Service busy, please try again.");
        } catch {
            alert("Payment connection failed.");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <>
            <div className="bg-slate-50 min-h-screen text-slate-950 pb-20 pt-10">
                <div className="max-w-5xl mx-auto text-center px-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm mb-6">
                        <Sparkles className="h-4 w-4 text-lime-500" />
                        Secure checkout powered by Creem
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-700 to-lime-500">{t("heroTitle")}</span>
                    </h1>
                    <p className="text-slate-600 font-medium mb-12 max-w-2xl mx-auto">{t("heroSubtitle")}</p>

                    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm mb-10">
                        {(["monthly", "yearly"] as const).map((cycle) => (
                            <button
                                key={cycle}
                                type="button"
                                onClick={() => setBillingCycle(cycle)}
                                className={`min-w-28 rounded-xl px-5 py-3 text-sm font-black capitalize transition-all ${billingCycle === cycle
                                    ? "bg-slate-950 text-white shadow-md"
                                    : "text-slate-500 hover:text-slate-950"
                                    }`}
                                aria-pressed={billingCycle === cycle}
                            >
                                {cycle}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-4">
                    {visiblePlans.map((plan) => (
                        <PlanCard
                            key={plan.type}
                            plan={plan}
                            loading={loadingPlan === plan.type}
                            onPay={() => handleCreemPayment(plan.type)}
                        />
                    ))}
                </div>

                <div className="max-w-4xl mx-auto px-4 mt-20">
                    <div className="bg-white border border-indigo-100 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center shadow-lg shadow-indigo-100/50">
                        <div className="mb-6 md:mb-0 md:mr-10 bg-indigo-50 p-5 rounded-2xl shrink-0">
                            <Cpu size={48} className="text-indigo-600" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                {t("aiTech.title")}
                                <span className="bg-lime-100 text-lime-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Beta</span>
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

function PlanCard({ plan, loading, onPay }: { plan: Plan; loading: boolean; onPay: () => void }) {
    return (
        <div className={`relative bg-white p-7 rounded-[2rem] flex flex-col transition-all border ${plan.featured ? "ring-4 ring-lime-100 shadow-2xl shadow-lime-100/70 md:scale-[1.02] z-10" : "shadow-sm border-slate-200"}`}>
            {plan.badge && (
                <div className={`absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${plan.featured ? "bg-lime-400 text-slate-950" : "bg-slate-100 text-slate-600"}`}>
                    {plan.badge}
                </div>
            )}

            <div className="mb-6 pr-24">
                <h3 className="text-xl font-black tracking-tight">{plan.title}</h3>
                <p className="text-slate-500 text-sm mt-2 min-h-10">{plan.desc}</p>
            </div>

            <div className="mb-6">
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black tracking-tight">${plan.price}</span>
                    <span className="text-sm font-bold text-slate-500 mb-1">/{plan.cadence}</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-black text-indigo-700">
                    <Zap className="h-4 w-4" />
                    {plan.credits}
                </div>
            </div>

            <ul className="space-y-3 mb-8 grow">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm font-medium text-slate-700">
                        <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            <button
                disabled={loading}
                onClick={onPay}
                className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${plan.featured ? "bg-lime-400 text-slate-950 hover:bg-lime-300" : "bg-slate-950 text-white hover:bg-indigo-700"}`}
            >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Pay with Creem <ArrowRight className="w-4 h-4" /></>}
            </button>
        </div>
    );
}
