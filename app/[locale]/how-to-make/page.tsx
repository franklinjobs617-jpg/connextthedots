import { Metadata } from "next";
import HowToMakeClient from "./HowToMakeContent";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEs = locale === "es";

    const title = isEs
        ? "Cómo Crear Fichas de Unir Puntos Personalizadas Online | Guía Paso a Paso"
        : "How to Make Your Own Dot-to-Dot Worksheet from a Photo";

    const description = isEs
        ? "Aprende el proceso paso a paso para crear tus propios dibujos de unir puntos para imprimir desde cualquier foto usando nuestro generador gratuito. Ideal para maestros y padres."
        : "Learn how to make your own connect-the-dots worksheet from a photo, drawing, or outline. Follow the step-by-step process, then generate and print your custom puzzle online.";

    const path = "/how-to-make/";

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
    return <HowToMakeClient locale={locale} />;
}
