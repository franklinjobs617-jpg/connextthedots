/** Static, synthetic example data supplied by C11's frozen resource manifest.
 * Never pass the user's current name, Canvas, Blob or generator state here. */
export interface ExampleAsset {
  id: 'emma-a4' | 'emma-letter' | 'alex-a4' | 'alex-letter';
  displayName: 'Emma' | 'Alex';
  paper: 'a4' | 'letter';
  status: 'g0-prototype' | 'placeholder' | 'ready';
  actualRows?: number;
  fontSizePt?: number;
  rowPitchPt?: number;
  guides: true;
  preview?: { dataUri: string; width: number; height: number; alt: string };
  pdfHref: string | null;
}

export function hasPngPreview(asset: ExampleAsset): boolean {
  const preview = asset.preview;
  return Boolean(preview && Number.isInteger(preview.width) && preview.width > 0
    && Number.isInteger(preview.height) && preview.height > 0
    && /^data:image\/png;base64,iVBORw0KGgo[A-Za-z0-9+/]*={0,2}$/.test(preview.dataUri));
}

export function hasReadyDownload(asset: ExampleAsset): boolean {
  // Exact paths are C11's responsibility. Reject query/hash, traversal and remote URLs.
  return asset.status === 'ready' && hasPngPreview(asset)
    && Number.isInteger(asset.actualRows) && asset.actualRows! >= 1 && asset.actualRows! <= 8
    && Boolean(asset.pdfHref?.startsWith('/name-tracing/examples/v1/')
      && /^\/[a-zA-Z0-9_/-]+\.pdf$/.test(asset.pdfHref) && !asset.pdfHref.includes('//'));
}
