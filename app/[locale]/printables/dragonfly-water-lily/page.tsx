import { notFound } from "next/navigation";
import { OriginalSheetPage, originalSheetMetadata, type OriginalSheetProps } from "@/components/printables/OriginalSheetPage";
import { findSegmentedSheet, segmentedSheets } from "@/lib/segmented-sheets";

export async function generateMetadata(props: OriginalSheetProps) {
    const item = findSegmentedSheet("dragonfly-water-lily");
    if (!item) notFound();
    const metadata = await originalSheetMetadata(item, props);
    const production = process.env.VERCEL_ENV === "production";
    return { ...metadata, robots: { index: production, follow: production } };
}

export default function Page(props: OriginalSheetProps) {
    const item = findSegmentedSheet("dragonfly-water-lily");
    if (!item) notFound();
    return <OriginalSheetPage {...props} item={item} related={segmentedSheets} />;
}
