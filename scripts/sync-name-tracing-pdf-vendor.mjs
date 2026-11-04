// Reproduce only this tool's unmodified, pinned MIT-licensed browser distribution.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const pkg = JSON.parse(await readFile('node_modules/jspdf/package.json', 'utf8'));
const bytes = await readFile('node_modules/jspdf/dist/jspdf.umd.min.js');
const hash = createHash('sha256').update(bytes).digest('hex');
if (pkg.version !== '4.2.0' || hash !== 'db83fc811c81a9c9c218f1787ba52fc9b4d0d0fbe51184ce3a4a4f8a7ba9a091') throw new Error('Unexpected jsPDF distribution; do not update silently.');
const dir = 'public/name-tracing/vendor/v1';
await mkdir(dir, { recursive: true });
await writeFile(`${dir}/jspdf-4.2.0.db83fc811c81.umd.min.js`, bytes);
await writeFile(`${dir}/LICENSE.txt`, await readFile('node_modules/jspdf/LICENSE'));
