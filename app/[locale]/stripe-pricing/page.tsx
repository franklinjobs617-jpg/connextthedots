import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import StripePricingContent from "./StripePricingContent";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const path = "/stripe-pricing";
    const t = await getTranslations({ locale, namespace: "pricing" });

    return {
        title: `Stripe / PayPal ${t("title")}`,
        description: t("description"),
        robots: {
            index: false,
            follow: false,
        },
        alternates: getAlternates(locale, path),
        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title: `Stripe / PayPal ${t("title")}`,
            description: t("description"),
        },
    };
}

export default function StripePricingPage() {
    return <StripePricingContent />;
}
