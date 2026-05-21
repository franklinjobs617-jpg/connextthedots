import type { Metadata } from "next";
import ChristmasContent from "./ChristmasContent";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const path = "/christmas-printables/";

    return {
        title: "Free Christmas Connect-the-Dots Printables | Easy and Hard PDF Worksheets",
        description: "Download free Christmas connect-the-dots printables featuring Santa, trees, ornaments, and holiday scenes. Choose easy kids worksheets or harder printable puzzles for older kids and adults.",
        alternates: getAlternates(locale, path),
        openGraph: {
            url: getUrl(locale, path),
            title: "Free Christmas Connect-the-Dots Printables | Easy and Hard PDF Worksheets",
            description: "Printable Christmas PDF worksheets for Santa, ornaments, trees, and holiday classroom activities.",
        },
    };
}

export default async function Page() {
    return <ChristmasContent />;
}
