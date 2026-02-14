import type { Metadata } from "next";
import MountainLandscapeClient from "./MountainLandscapeClient";
import { getAlternates, getUrl } from "@/lib/metadata";


type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {

    const { locale } = await params;
    const path = "/printables/adults/";

    return {
        title: "Mountain Landscape | Hard Dot to Dot Printable (100-200 Dots)",
        description: "Advanced printable mountain landscape dot to dot for adults. Discover a scenic view.",
        alternates: getAlternates(locale, path),

        openGraph: {
            title: "Mountain Landscape | Hard Dot to Dot Printable (100-200 Dots)",
            description: "Advanced printable mountain landscape dot to dot for adults. Discover a scenic view.",
            url: getUrl(locale, path),
            type: "article",
            images: [
                {
                    url: "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif",
                    width: 600,
                    height: 600,
                    alt: "Printable hard connect the dots puzzle: Mountain Landscape (Dots: 100-200).",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Mountain Landscape | Hard Dot to Dot Printable (100-200 Dots)",
            description: "Advanced printable mountain landscape dot to dot for adults. Discover a scenic view.",
            images: ["https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/6-Advanced-Mountain-Landscape-Connect-the-Dots-Design-for-Adults-Over-100-dots.avif"],
        },

    };
}
export default function Page() {
    return <MountainLandscapeClient />;
}