import type { Metadata } from "next";
import DMCAContent from "./DMCAContent";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const path = "/dmca/";

    return {
        title: "DMCA Policy | ConnectTheDotsPrintable.online",
        description:
            "Review our DMCA policy and learn how to submit copyright takedown notices and counter-notifications.",
        alternates: getAlternates(locale, path),
        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title: "DMCA Policy | ConnectTheDotsPrintable.online",
            description:
                "Review our DMCA policy and learn how to submit copyright takedown notices and counter-notifications.",
        },
    };
}

export default function DMCAPage() {
    return <DMCAContent />;
}
