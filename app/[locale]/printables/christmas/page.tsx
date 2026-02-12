import { Metadata } from "next";
import { redirect } from "next/navigation";
import ChristmasPageClient from "./ChristmasPageClient";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: { locale: string };
};



export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEs = locale === "es";

    const title = isEs
        ? "Dibujos de Unir Puntos de Navidad para Imprimir: Fichas Gratis del 1 al 100"
        : "Connect the Dots Printable Christmas: Festive Themes & Holiday Focus Activity Guid";

    const description = isEs
        ? "¡Descarga gratis tus dibujos de unir puntos de Navidad para imprimir! Ofrecemos fichas educativas del 1 al 20 y del 1 al 100, ideales para niños y adultos."
        : "Get free watermark-free connect the dots printables for kids & adults. Create custom dot-to-dot activities with our generator, instant download in PDF/HD image.";

    const path = "printables/christmas/";

    return {
        title,
        description,
        alternates: getAlternates(locale, path),

        openGraph: {
            title,
            description,
            url: getUrl(locale, path),
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;


    return <ChristmasPageClient locale={locale} />;
}