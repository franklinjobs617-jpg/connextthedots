import { Metadata } from "next";
import { redirect } from "next/navigation";
import FeedbackPageClient from "./FeedbackPageClient";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

// 1. 批量生成静态路径 (SSG)
export async function generateStaticParams() {
    return [{ locale: "en" }, { locale: "es" }, { locale: "de" }];
}

// 2. 动态生成 SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEs = locale === "es";

    // 根据语言设置 Title 和 Description
    const title = isEs
        ? "Generador de Dibujos de Unir Puntos Gratis | Creador Online"
        : "Free Connect the Dots Generator | Online Dot to Dot Maker";

    const description = isEs
        ? "Crea instantáneamente fichas personalizadas con nuestro Generador gratuito. Hojas de trabajo de alta calidad para niños y adultos, sin marcas de agua."
        : "Instantly create custom printables with our Free Connect the Dots Generator & Maker. High-quality worksheets for kids/adults—no watermarks, no sign-up needed. Start creating now!";


    const path = "/feedback/";
    return {
        title,
        description,
        alternates: getAlternates(locale, path),
        openGraph: {
            title,
            description,
            url: getUrl(locale, path),
        },
    };
}

// 3. 页面主入口与重定向逻辑
export default async function Page({ params }: Props) {
    const { locale } = await params;

    return <FeedbackPageClient locale={locale} />;
}