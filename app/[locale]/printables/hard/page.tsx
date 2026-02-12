import { Metadata } from "next";
import { redirect } from "next/navigation";
import HardPageClient from "./HardPageClient";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: { locale: string };
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEs = locale === "es";

    const title = isEs
        ? "Ejercicios de Unir Puntos Difíciles para Adultos - Gratis y PDF"
        : "Extreme Mandala | Extreme Dot to Dot Printable (200-300 Dots)";

    const description = isEs
        ? "Desafía tu mente con dibujos de unir puntos extremos. Fichas de alta dificultad para adultos y expertos. Descarga instantánea en HD."
        : "Extreme difficulty complex mandala design for adults. A truly intricate challenge.";

    const path = "/printables/hard/";
    return {
        title,
        description,
        alternates: getAlternates(locale, path),

        openGraph: {
            title,
            description,
            url: getUrl(locale, path),
            images: [
                {
                    url: "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/printable/7-Extreme-Difficulty-Mandala-Connect-the-Dots-Design-for-Adults-Over-200-dots.avif",
                    alt: isEs ? "Mandala Extremo" : "Extreme Mandala",
                },
            ],
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;

    if (locale === "de") {
        redirect("/printables/hard");
    }

    return <HardPageClient locale={locale} />;
}