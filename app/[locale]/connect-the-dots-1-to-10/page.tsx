import type { Metadata } from "next";
import ConnectDots1to10Content from "./ConnectDots1to10Content";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return [{ locale: "en" }, { locale: "fr" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isFr = locale === "fr";
    const path = "/connect-the-dots-1-to-10/";

    const title = isFr
        ? "Points à Relier Maternelle | Fiches Faciles à Imprimer"
        : "Free Connect the Dots 1 to 10 Printables | Easy Worksheets for Toddlers";
    const description = isFr
        ? "Fiches de points à relier gratuites pour la maternelle, conçues pour les tout-petits qui commencent à compter. PDF à imprimer, gros points, formes simples."
        : "Download 20+ free connect the dots 1 to 10 printables for toddlers and preschoolers. Easy PDF worksheets with large dots and simple shapes. Instant download, no sign-up.";

    return {
        title,
        description,
        alternates: getAlternates(locale, path),
        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title,
            description,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function ConnectDots1to10Page({ params }: Props) {
    const { locale } = await params;
    return <ConnectDots1to10Content locale={locale} />;
}
