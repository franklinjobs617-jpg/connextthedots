import { Metadata } from "next";
import { redirect } from "next/navigation";
import GeneratorPageClient from "./GeneratorPageClient";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return [{ locale: "en" }, { locale: "es" }, { locale: "de" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEs = locale === "es";

    // SEO 文本完全对应您提供的版本
    const title = isEs
        ? "Generador de Dibujos de Unir Puntos Gratis | Crea Fichas Online Personalizadas"
        : "Connect the Dots Printable Hard: Extreme Challenge & Concentration Training Guide";

    const description = isEs
        ? "Los datos de búsqueda revelan que términos como generador de unir puntos son prioridades constantes. Esta guía explica qué pueden hacer estas herramientas."
        : "Unlock Limitless Creativity: Your Ultimate Guide to a Free Connect the Dots Generator. Learn how these tools work and why they are best for education.";

    const baseUrl = "https://connectthedotsprintable.online";
    const pagePath = "/printables/connectTheDotsGenerator.html";
    const canonicalUrl = isEs ? `${baseUrl}/es${pagePath}` : `${baseUrl}${pagePath}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                en: `${baseUrl}${pagePath}`,
                es: `${baseUrl}/es${pagePath}`,
                de: `${baseUrl}/de${pagePath}`,
                "x-default": `${baseUrl}${pagePath}`,
            },
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: "ConnectTheDotsPrintable.online",
            type: "article",
            images: [{ url: `${baseUrl}/og-image.jpg` }],
        },
        other: {
            "google-adsense-account": "ca-pub-3383070348689557",
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;

    return <GeneratorPageClient locale={locale} />;
}