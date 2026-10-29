import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Collection from './Collection';

type Props = { params: Promise<{ locale: string }> };
const canonical = 'https://connectthedotsprintable.online/skip-counting-dot-to-dot/';
const title = 'Skip-Counting Dot-to-Dot: Count by 2, 5 & 10 | Free PDFs';
const description = 'Choose six original skip-counting connect-the-dots worksheets. Count by 2, 5 or 10, with A4 and US Letter puzzle PDFs and matching answers.';
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if ((await params).locale !== 'en') notFound();
  return { metadataBase: new URL('https://connectthedotsprintable.online'), title, description, alternates: { canonical, languages: {} }, robots: { index: true, follow: true }, openGraph: { title, description, url: canonical, type: 'website', images: ['/skip-counting/rocket-by-2/v1/rocket-by-2-A4-Puzzle.png'] }, twitter: { card: 'summary_large_image', title, description, images: ['/skip-counting/rocket-by-2/v1/rocket-by-2-A4-Puzzle.png'] } };
}
export default async function Page({ params }: Props) {
  if ((await params).locale !== 'en') notFound();
  return <main className="min-h-screen bg-slate-50 text-slate-900"><div className="mx-auto max-w-6xl px-4 py-12">
    <nav aria-label="Breadcrumb" className="mb-6 text-sm"><Link href="/">Home</Link> / <Link href="/printable-connect-the-dots/">Printables</Link> / Skip-counting</nav>
    <p className="font-semibold text-blue-700">Original printable collection · English</p>
    <h1 className="mt-3 text-4xl font-extrabold">Skip-Counting Dot-to-Dot</h1>
    <p className="mt-5 max-w-3xl text-lg leading-relaxed">Choose a picture, count by 2, 5 or 10, and join the labels in that sequence. All six worksheets start at the step itself, never zero. Download a puzzle for your paper size and check your connections with its matching answer.</p>
    <Collection />
    <section className="mt-10 max-w-3xl space-y-4 leading-relaxed" aria-labelledby="print-instructions"><h2 id="print-instructions" className="text-2xl font-bold">How to print and connect</h2>
      <ol className="list-decimal space-y-3 pl-6"><li>Choose the counting step and picture, then A4 (210 × 297 mm) or US Letter (8.5 × 11 inches).</li><li>Download the puzzle PDF. Select matching paper and Actual size / 100% in your PDF print dialog. The footer check line should measure 50 mm.</li><li>Start at 2, 5 or 10 as shown. Add the same step to find the next label; do not connect to the nearest dot unless it is next in the sequence.</li><li>After the final value, join back to the starting value as stated on every sheet. Open the matching answer to compare your picture.</li></ol>
      <p>These are sequence-following activities. Grade alignment, learning outcomes and completion time have not been measured. Physical printing and independent human complete solving are NOT TESTED.</p>
      <p>© 2026 ConnectTheDotsPrintable.online. Free to download and print for personal and educational use. Commercial use requires prior written permission; see <Link className="underline" href="/terms/">Terms of Service</Link>.</p>
    </section>
  </div></main>;
}
