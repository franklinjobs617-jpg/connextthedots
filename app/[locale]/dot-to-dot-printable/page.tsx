import { Metadata } from "next";
import DotToDotPrintableClient from "./DotToDotPrintableClient";
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

    const title = "Free Dot to Dot Printables — PDF Puzzles for Kids & Adults";
    const description =
        "Download free dot to dot printables as PDF. Easy to extreme difficulty puzzles for all ages — animals, nature, fantasy and more. Or turn any photo into your own custom dot-to-dot in seconds.";
    const path = "/dot-to-dot-printable/";

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
    return <DotToDotPrintableClient locale={locale} allItems={allItems} />;
}
