"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Check, X, Star, Zap, Cpu, ArrowRight, Loader2, CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { PayPalButtons } from "@paypal/react-paypal-js";


export default function PricingContent() {
    const t = useTranslations("pricing");
    const { user, isLoggedIn, login } = useAuth();

    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');




    // 🚀 支付回调校验 (针对 PayPal 自动跳转回来的情况)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('PayerID')) { handleVerifyPayPal(); }
    }, []);

    
// 在 PricingContent 函数内部，其他 useEffect 后面添加
useEffect(() => {
    if (verificationStatus === 'success') {
        const timer = setTimeout(() => {
            window.location.href = "/"; // 3秒后跳转回首页
        }, 3000);
        return () => clearTimeout(timer);
    }
}, [verificationStatus]);
    const handleVerifyPayPal = async () => {
        setVerificationStatus('loading');
        try {
            const res = await fetch(`https://api.connectthedotsprintable.online/prod-api/paypal/retUrl${window.location.search}`);
            const data = await res.json();
            if (data.code === 0) {

                setVerificationStatus('success');
                setTimeout(() => window.location.href = "/", 3000);
            } else {
                setVerificationStatus('error');
            }
        } catch (e) { setVerificationStatus('error'); }
    };

    // --- Stripe 支付逻辑 ---
    const handleStripePayment = async (planType: string, planName: string) => {
        if (!isLoggedIn) { login(); return; }


        setLoadingPlan(planType);

        try {
            const res = await fetch('/api/pay/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    googleUserId: user?.googleUserId || user?.id,
                    email: user?.email,
                    userId: user?.id,
                    type: planType
                })
            });
            const data = await res.json();
            if (data.url) { window.location.href = data.url; }
            else { alert("Service busy, please try again."); }
        } catch (error) { alert("Payment connection failed."); }
        finally { setLoadingPlan(null); }
    };

    if (verificationStatus !== 'idle') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                {verificationStatus === 'loading' && <div className="space-y-4"><Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" /><h2>Verifying Payment...</h2></div>}
                {verificationStatus === 'success' && <div className="space-y-4"><CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" /><h2>Payment Successful!</h2><p>Redirecting to home...</p></div>}
                {verificationStatus === 'error' && <div className="space-y-4"><AlertCircle className="w-12 h-12 text-red-500 mx-auto" /><h2>Payment Verification Failed</h2><button onClick={() => setVerificationStatus('idle')} className="px-6 py-2 bg-slate-900 text-white rounded-xl">Retry</button></div>}
            </div>
        );
    }

    return (
        <>
            <div className="bg-slate-50 min-h-screen text-slate-900 pb-20 pt-10">
                <div className="max-w-5xl mx-auto text-center px-4">
                    <h1 className="text-5xl font-black mb-4 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">{t('heroTitle')}</span>
                    </h1>
                    <p className="text-slate-600 font-medium mb-12">{t('heroSubtitle')}</p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">

                    {/* --- 1. Life-saver Pack (一次性) --- */}
                    <PlanCard
                        title={t('tiers.saver.name')}
                        price={t('tiers.saver.price')}
                        desc={t('tiers.saver.desc')}
                        features={[t('tiers.saver.features.0'), t('tiers.saver.features.1'), t('tiers.saver.features.2')]}
                        type="content_lifesaver_once"
                        loading={loadingPlan === "content_lifesaver_once"}
                        onStripe={() => handleStripePayment("content_lifesaver_once", "Life-saver")}
                        isLoggedIn={isLoggedIn}
                        user={user}
                        setVerificationStatus={setVerificationStatus} // 必须加上这一行
                        featured
                        login={login}
                    />

                    {/* --- 2. Creator (月订阅) --- */}
                    <PlanCard
                        title={t('tiers.monthly.name')}
                        price={t('tiers.monthly.price')}
                        desc={t('tiers.monthly.desc')}
                        features={[t('tiers.monthly.features.0'), t('tiers.monthly.features.1'), t('tiers.monthly.features.2'), t('tiers.monthly.features.3')]}
                        type="content_creator_monthly"
                        loading={loadingPlan === "content_creator_monthly"}
                        onStripe={() => handleStripePayment("content_creator_monthly", "Creator")}
                        setVerificationStatus={setVerificationStatus} // 必须加上这一行
                        isLoggedIn={isLoggedIn}
                        user={user}
                        login={login}
                    />

                    {/* --- 3. Pro Master (年订阅) --- */}
                    <PlanCard
                        title={t('tiers.annual.name')}
                        setVerificationStatus={setVerificationStatus} // 必须加上这一行
                        price={t('tiers.annual.price')}
                        desc={t('tiers.annual.desc')}
                        features={[t('tiers.annual.features.0'), t('tiers.annual.features.1'), t('tiers.annual.features.2'), t('tiers.annual.features.3')]}
                        type="content_pro_master_yearly"
                        loading={loadingPlan === "content_pro_master_yearly"}
                        onStripe={() => handleStripePayment("content_pro_master_yearly", "Pro Master")}
                        isLoggedIn={isLoggedIn}
                        user={user}
                        login={login}
                    />
                </div>
                {/* --- AI Tech Banner --- */}
                <div className="max-w-4xl mx-auto px-4 mt-24">
                    <div className="bg-white border border-indigo-100 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center shadow-lg shadow-indigo-100/50">
                        <div className="mb-6 md:mb-0 md:mr-10 bg-indigo-50 p-5 rounded-2xl shrink-0">
                            <Cpu size={48} className="text-indigo-600" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                {t('aiTech.title')}
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">Beta</span>
                            </h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {t('aiTech.body')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FAQ Section --- */}
            <section className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-black text-center mb-16 tracking-tighter text-slate-900 uppercase italic">
                        {t('faq.title')}
                    </h2>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((num) => (
                            <div key={num} className="group border border-slate-100 rounded-2xl p-6 hover:border-indigo-100 hover:shadow-sm transition-all">
                                <h4 className="font-bold text-lg mb-3 text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {/* @ts-ignore */}
                                    {t(`faq.q${num}`)}
                                </h4>
                                <p className="text-slate-500 leading-relaxed text-sm">
                                    {/* @ts-ignore */}
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

// 子组件：套餐卡片
function PlanCard({ title, price, desc, features, type, loading, onStripe, featured = false, isLoggedIn, user, login, setVerificationStatus }: any) {
    
    // 【关键判断】：是否为订阅模式
    const isSubscription = type.includes('monthly') || type.includes('yearly');

    return (
        <div className={`bg-white p-8 rounded-[2.5rem] flex flex-col transition-all border ${featured ? 'ring-4 ring-indigo-100 shadow-2xl md:scale-105 z-10' : 'shadow-sm border-slate-200'}`}>
            <div className="mb-6">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-slate-500 text-sm mt-1">{desc}</p>
                <div className="mt-4 text-4xl font-black">${price}</div>
            </div>
            <ul className="space-y-3 mb-8 grow">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center text-sm font-medium"><Check className="w-4 h-4 text-emerald-500 mr-2" />{f}</li>
                ))}
            </ul>

            <div className="space-y-3">
                <button
                    disabled={loading}
                    onClick={onStripe}
                    className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${featured ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-900 text-white hover:bg-black'}`}
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Pay with Stripe <ArrowRight className="w-4 h-4" /></>}
                </button>

                <div className="z-0">
                    <PayPalButtons
                        style={{ 
                            layout: "vertical", 
                            shape: "rect", 
                            borderRadius: 12, 
                            height: 48, 
                            label: isSubscription ? 'subscribe' : 'pay' 
                        }}
                        
                        // 【混合逻辑 1】：一次性支付走 createOrder
                        createOrder={!isSubscription ? async () => {
                            if (!isLoggedIn) { login(); return ""; }
                            const res = await fetch("/api/pay/paypal-smart-create", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ type, googleUserId: user?.googleUserId || user?.id, email: user?.email, userId: user?.id })
                            });
                            const json = await res.json();
                            return json.data; 
                        } : undefined}

                        // 【混合逻辑 2】：订阅会员走 createSubscription
                        createSubscription={isSubscription ? async () => {
                            if (!isLoggedIn) { login(); return ""; }
                            const res = await fetch("/api/pay/paypal-smart-create-subscription", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ type, googleUserId: user?.googleUserId || user?.id, email: user?.email, userId: user?.id })
                            });
                            const json = await res.json();
                            return json.data; // 返回 I-XXXX
                        } : undefined}

                        onApprove={async (data) => {
                            if (isSubscription) {
                                // 订阅模式：无需 capture，直接切换 UI 状态
                                console.log("Subscription ID:", data.subscriptionID);
                                setVerificationStatus('success');
                            } else {
                                // 一次性模式：必须 capture
                                setVerificationStatus('loading');
                                const res = await fetch("/api/pay/paypal-smart-capture", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ orderId: data.orderID })
                                });
                                const json = await res.json();
                                if (json.code === 200) { 
                                    setVerificationStatus('success'); 
                                } else {
                                    setVerificationStatus('error');
                                }
                            }
                        }}
                        onCancel={() => console.log("Payment Cancelled")}
                        onError={(err) => {
                            console.error("PayPal Error:", err);
                            setVerificationStatus('error');
                        }}
                    />
                </div>
            </div>
        </div>
    );
}