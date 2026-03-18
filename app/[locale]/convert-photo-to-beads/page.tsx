import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LandingClient from "./components/LandingClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "beadsLanding" });

  return {
    title: `Free Perler Bead Patterns | Simple & Printable Patterns Maker`,
    description: `Download hundreds of free perler bead patterns or create custom ones with our pattern maker. Simple and printable designs for all ages.`,
    keywords:
      "perler bead patterns, free perler bead patterns, simple perler bead patterns, printable perler bead patterns, 14x14 perler bead patterns",
    openGraph: {
      title: "Free Perler Bead Patterns & Pattern Maker",
      description:
        "Convert photos into custom, printable perler bead patterns instantly.",
      type: "website",
    },
  };
}

export default function BeadsLandingPage() {
  return <LandingClient />;
}
