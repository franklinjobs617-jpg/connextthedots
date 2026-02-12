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
        title: "Free Connect the Dots Printable Christmas: Hard & Easy Puzzles",
        description: "Grab your free, high-quality connect the dots printable Christmas collection! We offer easy, hard, and adult puzzles, including tree and Santa designs. Print the perfect activity!",
        alternates: getAlternates(locale, path),
        openGraph: {
            url: getUrl(locale, path),
            title: "Free Connect the Dots Generator & Printable Worksheets",
            description: "Get free watermark-free connect the dots printables for kids & adults. Create custom dot-to-dot activities with our generator, instant download in PDF/HD image."
        },
    };
}
export default async function Page({ params }: Props) {

    return <ChristmasContent />;
}