import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";
import { getAlternates, getUrl } from "@/lib/metadata";
type Props = {
    params: { locale: string };
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {

    const { locale } = await params;
    const path = "/privacy/";

    return {
        title: "Privacy Policy | ConnectTheDotsPrintable.online",
        description: "Read our privacy policy to understand how we collect, use, and protect your information when using our connect the dots printable generator.",
        alternates: getAlternates(locale, path),

        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title: "Privacy Policy | ConnectTheDotsPrintable.online",
            description: "Read our privacy policy to understand how we collect, use, and protect your information when using our connect the dots printable generator.",

        },
    };
}

export default function PrivacyPage() {
    return <PrivacyContent />;
}