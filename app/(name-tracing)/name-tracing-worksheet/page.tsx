import type { Metadata } from 'next';
import { connection } from 'next/server';
import { CANONICAL_URL } from '@/lib/name-tracing/settings';
import NameTracingClient from './NameTracingClient';
import NameTracingChrome from '@/components/name-tracing/NameTracingChrome';
import { EXAMPLE_RESOURCES } from '@/lib/name-tracing/example-resources';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Name Tracing Worksheet Generator — A4 & US Letter',
  description: 'Create a single-page dotted name worksheet. Choose practice rows, guide lines and A4 or US Letter, then preview and download a PDF.',
  robots: { index: process.env.VERCEL_ENV === 'production', follow: process.env.VERCEL_ENV === 'production' },
  alternates: { canonical: CANONICAL_URL },
};
export default async function NameTracingPage() {
  await connection();
  return <NameTracingChrome tool={<NameTracingClient />} examples={EXAMPLE_RESOURCES} />;
}
