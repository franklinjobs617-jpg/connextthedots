import { Metadata } from "next";
import CorePageClient from "./CorePageClient";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEs = locale === "es";

    const title = isEs
        ? "Fichas de Unir Puntos para Imprimir Gratis | Dibujos de Unir Puntos para Niños"
        : "Connect the Dots Printable: The Ultimate Source for Every Difficulty Level & Theme";

    const description = isEs
        ? "Descarga gratis cientos de dibujos de unir puntos. Puzzles para niños y adultos listos para imprimir en formato PDF de alta calidad."
        : "Get free watermark-free connect the dots printables for kids & adults. Create custom dot-to-dot activities with our generator, instant download in PDF/HD image.";
    const path = "/printables/core/";

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
                    url: `/images/og-image.png`,
                    alt: isEs ? "Vista previa del Generador de Dibujos" : "Connect the Dots Generator Preview",
                },
            ],
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;

    return <CorePageClient locale={locale} />;
}