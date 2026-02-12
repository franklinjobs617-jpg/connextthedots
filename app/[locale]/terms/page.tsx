import type { Metadata } from "next";
import TermsContent from "./TermsContent";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {

    const { locale } = await params;
    const path = "/christmas-printables/";

    return {
        title: "Terms of Service | ConnectTheDotsPrintable.online",
        description: "Read our terms of service to understand the rules and guidelines for using our connect the dots printable generator and website.",
        alternates: getAlternates(locale, path),

        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title: "Terms of Service | ConnectTheDotsPrintable.online",
            description: "Read our terms of service to understand the rules and guidelines for using our connect the dots printable generator and website.",

        },
    };
}
export default function TermsPage() {
    return <TermsContent />;
}