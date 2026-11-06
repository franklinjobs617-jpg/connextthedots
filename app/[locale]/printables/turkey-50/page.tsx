import { OriginalSheetPage, originalSheetMetadata, type OriginalSheetProps } from "@/components/printables/OriginalSheetPage";
import { originalSheet } from "@/lib/original-sheets";

const item = originalSheet("turkey-50");
export async function generateMetadata(props: OriginalSheetProps) {
    const metadata = await originalSheetMetadata(item, props);
    const production = process.env.VERCEL_ENV === "production";
    return { ...metadata, robots: { index: production, follow: production } };
}
export default function Page(props: OriginalSheetProps) { return <OriginalSheetPage {...props} item={item} />; }
