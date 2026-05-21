import type { Metadata } from "next";
import AnimalContent from "./AnimalContent";
import { getAlternates, getUrl } from "@/lib/metadata";

type Props = {
    params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const path = "/free-animal-dot-to-dot-printables-pdf/";

    return {
        title: "Free Animal Dot-to-Dot Printables | PDF Worksheets for Kids and Adults",
        description: "Download free animal dot-to-dot printables in PDF format. Browse rabbit, dog, cat, turtle, fox, owl, bear, dolphin, whale, giraffe, koala, frog, snail, and squirrel worksheets.",
        keywords: "animal dot to dot printables, animal connect the dots printable, free animal dot to dot pdf, printable animal dot to dot worksheets",
        authors: [{ name: "Connect the Dots Printable" }],
        alternates: getAlternates(locale, path),
        openGraph: {
            siteName: "ConnectTheDotsPrintable.online",
            url: getUrl(locale, path),
            title: "Free Animal Dot-to-Dot Printables | PDF Worksheets for Kids and Adults",
            description: "Download printable animal worksheets featuring rabbits, dogs, cats, turtles, foxes, owls, bears, ocean animals, and more.",
        },
    };
}

export default function AnimalDotToDotPage() {
    return <AnimalContent />;
}
