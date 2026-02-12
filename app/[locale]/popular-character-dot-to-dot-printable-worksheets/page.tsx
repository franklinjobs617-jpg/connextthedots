import type { Metadata } from "next";
import PageContent from "./PageContent";
import { getAlternates, getUrl } from "@/lib/metadata";
type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {

    const { locale } = await params;
    const path = "popular-character-dot-to-dot-printable-worksheets";
    return {
        title: "Connect The Dots - Popular Character Dot to Dots for Kids - Online & Printable Worksheets",
        description: "Explore our massive collection of free printable dot to dots for kids. Featuring popular characters like Goku, Pokemon, and Barbie. Download PDF worksheets or play online for effective learning and fun!",

        authors: [{ name: "Connect the Dots Printable" }],
        alternates: getAlternates(locale, path),

        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),

            title: "Connect The Dots - Popular Character Dot to Dots for Kids - Online & Printable Worksheets",
            description: "Explore our massive collection of free printable dot to dots for kids. Featuring popular characters like Goku, Pokemon, and Barbie. Download PDF worksheets or play online for effective learning and fun!",

        },
    }
};

export default function PopularCharacterPage() {
    return <PageContent />;
}