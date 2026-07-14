import { Metadata } from "next";
import ConnectDotsAdultsClient from "./ConnectDotsAdultsClient";
import { getAllPrintables } from "@/lib/printables-data";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return [{ locale: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const title = "Connect the Dots for Adults — Free & Custom Extreme Puzzles";
    const description =
        "Free connect the dots for adults, 100-300+ dots. Download extreme printable PDFs or turn any photo into your own custom puzzle in seconds.";
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
