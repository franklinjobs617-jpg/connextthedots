import manifest from './example-manifest.json';
import previews from './example-previews.json';
import type { ExampleAsset } from '@/components/name-tracing/example-types';
// Fixed fictional examples only. Never pass live worksheet state to display modules.
export const EXAMPLE_RESOURCES: readonly ExampleAsset[] = manifest.map(asset => ({
  id: asset.id as ExampleAsset['id'], displayName: asset.sampleName as ExampleAsset['displayName'],
  paper: asset.paper as ExampleAsset['paper'], status: 'ready', actualRows: asset.rows,
  fontSizePt: asset.fontSizePt, rowPitchPt: asset.rowPitchPt, guides: true,
  pdfHref: asset.pdfPath,
  preview: { dataUri: previews[asset.id as keyof typeof previews], width: asset.previewWidth, height: asset.previewHeight, alt: `${asset.sampleName}, ${asset.paper === 'a4' ? 'A4' : 'US Letter'}: ${asset.rows} dotted practice rows, guide lines on` },
}));
