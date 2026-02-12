import { Metadata } from "next";
import { redirect } from "next/navigation";
import HowToMakeClient from "./HowToMakeContent";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

// 2. 动态生成 SEO 元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEs = locale === "es";

    const title = isEs
        ? "Cómo Crear Fichas de Unir Puntos Personalizadas Online | Guía Paso a Paso"
        : "Make Custom Dot to Dot Worksheets Online | Step-by-Step Guide";

    const description = isEs
        ? "Aprende el proceso paso a paso para crear tus propios dibujos de unir puntos para imprimir desde cualquier foto usando nuestro generador gratuito. Ideal para maestros y padres."
        : "Learn the step-by-step process to make your own custom connect the dots printables from any photo or image using our free online generator tool. Perfect for teachers and parents.";

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

// 3. 处理逻辑与重定向
export default async function Page({ params }: Props) {
    const { locale } = await params;

    return <HowToMakeClient locale={locale} />;
}