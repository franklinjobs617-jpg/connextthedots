import type { Metadata } from "next";
import HomeContentComponent from "@/components/HomeContent";
import { getAlternates, getUrl } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import Script from "next/script";
type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const t = await getTranslations({ locale, namespace: "metadata" });
    const path = "/";
    return {
        title: t("homeTitle"),
        description: t("homeDesc"),
        alternates: getAlternates(locale, path),

        openGraph: {
            title: t("homeTitle"),
            description: t("homeDesc"),
            url: getUrl(locale, path),
        },

        twitter: {
            card: "summary_large_image",
            title: t("homeTitle"),
            description: t("homeDesc"),
        },
    };
}



export default async function HomeContent({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "faq" });

    const faqItems = [
        { q: t("q1"), a: t("a1") },
        { q: t("q2"), a: t("a2") },
        { q: t("q3"), a: t("a3") },
        { q: t("q4"), a: t("a4") },
        { q: t("q5"), a: t("a5") },
    ];

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ConnectTheDotsPrintable",
        "url": "https://connectthedotsprintable.online",
        "description": "Free connect the dots generator and printable dot to dot worksheets for kids and adults.",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://connectthedotsprintable.online/printables/{search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        }))
    };

    return (
        <>
            <Script
                id="schema-website"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <Script
                id="schema-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <HomeContentComponent />
        </>
    );
}