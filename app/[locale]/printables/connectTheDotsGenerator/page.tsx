import { Metadata } from "next";
import GeneratorPageClient from "./GeneratorPageClient";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return [{ locale: "en" }, { locale: "es" }, { locale: "de" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEs = locale === "es";
    const isDe = locale === "de";

    const title = isEs
        ? "Generador de Dibujos de Unir Puntos Gratis | Crea Fichas Online Personalizadas"
        : isDe
            ? "Punkt-zu-Punkt Generator | Eigene Druckvorlagen Online Erstellen"
            : "Connect the Dots Generator | Create Custom Printable Worksheets Online";

    const description = isEs
        ? "Crea fichas de unir puntos personalizadas desde cualquier imagen. Ajusta la dificultad, genera una vista previa y descarga tu dibujo para imprimir."
        : isDe
            ? "Erstelle eigene Punkt-zu-Punkt Arbeitsblätter aus Bildern. Passe die Punktzahl an, prüfe die Vorschau und lade deine Druckvorlage herunter."
            : "Turn any image into a printable dot-to-dot worksheet. Adjust the dot count, review the preview, and download a clean puzzle for kids or adults.";

    const path = "/printables/connectTheDotsGenerator/";

    return {
        title,
        description,
        alternates: getAlternates(locale, path),
        openGraph: {
            title,
            description,
            url: getUrl(locale, path),
            siteName: "ConnectTheDotsPrintable.online",
            type: "website",
            images: [{ url: "https://connectthedotsprintable.online/images/og-image.jpg" }],
        },
        other: {
            "google-adsense-account": "ca-pub-3383070348689557",
        },
    };
}

export default async function Page({ params }: Props) {
    const { locale } = await params;

    return <GeneratorPageClient locale={locale} />;
}
