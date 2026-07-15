import { Metadata } from "next";
import ConnectDotsAdultsClient from "./ConnectDotsAdultsClient";
import { getAllPrintables } from "@/lib/printables-data";
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

    const title = isFr
        ? "Points à Relier pour Adultes — Puzzles Gratuits et Personnalisés"
        : "Connect the Dots for Adults — Free & Custom Extreme Puzzles";
    const description = isFr
        ? "Points à relier pour adultes, 100 à 300+ points. Téléchargez des PDF extrêmes gratuits ou créez votre propre puzzle personnalisé en quelques secondes."
        : "Free connect the dots for adults, 100-300+ dots. Download extreme printable PDFs or turn any photo into your own custom puzzle in seconds.";
    const path = "/connect-the-dots-for-adults/";

    return {
        title,
        description,
        alternates: getAlternates(locale, path),
        openGraph: {
            title,
            description,
            url: getUrl(locale, path),
            type: "website",
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;
    const allItems = getAllPrintables();
    const featuredItems = allItems.filter(
        (item) => item.difficulty === "Hard" || item.difficulty === "Extreme"
    );
    return <ConnectDotsAdultsClient locale={locale} featuredItems={featuredItems} />;
}
