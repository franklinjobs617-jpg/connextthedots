import { Metadata } from "next";
import PricingContent from "./PricingContent";
import { getAlternates, getUrl } from "@/lib/metadata";
// 1. 修改引入：从 next-intl/server 引入 getTranslations
import { getTranslations } from "next-intl/server";

// 注意：在 Next.js 15 中，params 是一个 Promise，建议更新类型定义
type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const path = "/pricing";

    // 2. 修改调用方式：使用 await getTranslations
    // 这允许你在服务端非组件环境获取翻译
    const t = await getTranslations({ locale, namespace: "pricing" });

    return {
        title: t('title'),
        description: t('description'),
        alternates: getAlternates(locale, path),
        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title: t('title'),
            description: t('description'),
        },
    };
}

export default function PricingPage() {
    return <PricingContent />;
}