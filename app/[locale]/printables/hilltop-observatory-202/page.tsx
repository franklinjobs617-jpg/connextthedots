import { OriginalSheetPage, originalSheetMetadata, type OriginalSheetProps } from "@/components/printables/OriginalSheetPage";
import { segmentedSheet, segmentedSheets } from "@/lib/segmented-sheets";

const item = segmentedSheet("hilltop-observatory-202");
export function generateMetadata(props: OriginalSheetProps) { return originalSheetMetadata(item, props); }
export default function Page(props: OriginalSheetProps) { return <OriginalSheetPage {...props} item={item} related={segmentedSheets} />; }
