import manifest from './example-manifest.json';
import previews from './example-previews.json';
// Fixed fictional examples only. Never pass live worksheet state to display modules.
export const EXAMPLE_RESOURCES = manifest.map(asset => ({ ...asset, previewDataUri: previews[asset.id as keyof typeof previews] }));
export type ExampleResource = (typeof EXAMPLE_RESOURCES)[number];
