import type { Metadata } from 'next';
import { connection } from 'next/server';
import { CANONICAL_URL } from '@/lib/name-tracing/settings';
import NameTracingClient from './NameTracingClient';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Name Tracing Worksheet Generator — A4 & US Letter',
  description: 'Create a single-page dotted name worksheet. Choose practice rows, guide lines and A4 or US Letter, then preview and download a PDF.',
  robots: { index: process.env.VERCEL_ENV === 'production', follow: process.env.VERCEL_ENV === 'production' },
  alternates: { canonical: CANONICAL_URL },
};
export default async function NameTracingPage() {
  await connection();
  return <NameTracingClient />;
}
