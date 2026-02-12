import type { Metadata } from "next";
import AnimalContent from "./AnimalContent";
import { getAlternates, getUrl } from "@/lib/metadata";
type Props = {
    params: { locale: string };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {

    const { locale } = await params;
    const path = "free-animal-dot-to-dot-printables-pdf";

    return {
        title: "Animal Dot to Dot Printables - Free Downloadable PDF Sheets",
        description: "Download 100+ free animal dot to dot printables for kids & adults. High-quality PDF worksheets featuring Husky, Bat, Ostrich & more. Perfect for learning!",
        keywords: "connect the dots printable, dot to dot printables, dot to dot worksheets, free printable connect the dots, connect the dots print",
        authors: [{ name: "Connect the Dots Printable" }],
        alternates: getAlternates(locale, path),
        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title: "Animal Dot to Dot Printables - Free Downloadable PDF Sheets",
            description: "Download 100+ free animal dot to dot printables for kids & adults. High-quality PDF worksheets featuring Husky, Bat, Ostrich & more. Perfect for learning!",
        },
    };
}
export default function AnimalDotToDotPage() {

    return <AnimalContent />;
}