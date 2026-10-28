import { OriginalSheetPage, originalSheetMetadata, type OriginalSheetProps } from "@/components/printables/OriginalSheetPage";
import { originalSheet } from "@/lib/original-sheets";

const item = originalSheet("elephant-100");
export function generateMetadata(props: OriginalSheetProps) { return originalSheetMetadata(item, props); }
export default function Page(props: OriginalSheetProps) { return <OriginalSheetPage {...props} item={item} />; }
