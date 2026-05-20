import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { openclipartStandaloneManifest } from "./source-assets/openclipart-standalone-manifest.mjs";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "public", "generated", "dot-to-dot", "standalone-openclipart");
const LIB_OUTPUT = path.join(ROOT, "lib", "generated-standalone-printables.json");
const RENDER_SIZE = 1200;
const FOREGROUND_ALPHA_THRESHOLD = 12;
const MAX_TRACE_MULTIPLIER = 12;

const DIFFICULTY_TAGS = {
  Easy: "bg-green-600",
  Medium: "bg-yellow-600",
  Hard: "bg-orange-600",
  Extreme: "bg-red-700",
};

const OPENCLIPART_LICENSE_URL = "https://openclipart.org/share";
const OPENCLIPART_LICENSE_NAME = "Public Domain (Openclipart)";

const neighborOffsets = [
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
];

function ensureArray(value) {
  return Array.isArray(value) ? value : [value];
}

function getIndex(width, x, y) {
  return y * width + x;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toTitleCase(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

function extractMetadataFromHtml(html, fallbackTitle) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const authorMatch = html.match(/By\s*<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/i);
  const rawTitle = titleMatch?.[1]?.replace(/\s+-\s+Openclipart\s*$/i, "").trim();

  return {
    sourceTitle: rawTitle || fallbackTitle,
    sourceCredit: authorMatch?.[2]?.trim() || "Openclipart contributor",
  };
}

async function renderSvg(svgText) {
  const svgBuffer = Buffer.from(svgText);
  const renderer = sharp(svgBuffer, { density: 300, limitInputPixels: false }).resize(RENDER_SIZE, RENDER_SIZE, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  const referencePng = await renderer
    .clone()
    .flatten({ background: "#ffffff" })
    .png()
    .toBuffer();

  const { data, info } = await renderer
    .clone()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return {
    referencePng,
    rawPixels: data,
    width: info.width,
    height: info.height,
  };
}

async function renderBufferToWebp(buffer, options = {}) {
  return sharp(buffer)
    .webp(options)
    .toBuffer();
}

function buildForegroundMask(rawPixels, width, height) {
  const alphaMask = new Uint8Array(width * height);
  const darkMask = new Uint8Array(width * height);
  let alphaCount = 0;
  let darkCount = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const baseIndex = getIndex(width, x, y) * 4;
      const alpha = rawPixels[baseIndex + 3];
      const luminance = (rawPixels[baseIndex] * 0.299) + (rawPixels[baseIndex + 1] * 0.587) + (rawPixels[baseIndex + 2] * 0.114);

      if (alpha > FOREGROUND_ALPHA_THRESHOLD) {
        alphaMask[getIndex(width, x, y)] = 1;
        alphaCount += 1;
      }

      if (alpha > FOREGROUND_ALPHA_THRESHOLD && luminance < 248) {
        darkMask[getIndex(width, x, y)] = 1;
        darkCount += 1;
      }
    }
  }

  const alphaCoverage = alphaCount / (width * height);
  return alphaCoverage > 0.72 && darkCount > 0 ? darkMask : alphaMask;
}

function findLargestConnectedComponent(mask, width, height) {
  const visited = new Uint8Array(mask.length);
  let bestComponent = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const startIndex = getIndex(width, x, y);
      if (!mask[startIndex] || visited[startIndex]) {
        continue;
      }

      const queue = [startIndex];
      const component = [];
      visited[startIndex] = 1;

      for (let pointer = 0; pointer < queue.length; pointer += 1) {
        const currentIndex = queue[pointer];
        const currentX = currentIndex % width;
        const currentY = Math.floor(currentIndex / width);
        component.push(currentIndex);

        for (const [dx, dy] of neighborOffsets) {
          const nextX = currentX + dx;
          const nextY = currentY + dy;
          if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) {
            continue;
          }

          const nextIndex = getIndex(width, nextX, nextY);
          if (mask[nextIndex] && !visited[nextIndex]) {
            visited[nextIndex] = 1;
            queue.push(nextIndex);
          }
        }
      }

      if (component.length > bestComponent.length) {
        bestComponent = component;
      }
    }
  }

  const componentMask = new Uint8Array(mask.length);
  for (const index of bestComponent) {
    componentMask[index] = 1;
  }

  return componentMask;
}

function isBoundaryPixel(componentMask, width, height, x, y) {
  if (!componentMask[getIndex(width, x, y)]) {
    return false;
  }

  for (const [dx, dy] of neighborOffsets) {
    const nextX = x + dx;
    const nextY = y + dy;
    if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) {
      return true;
    }
    if (!componentMask[getIndex(width, nextX, nextY)]) {
      return true;
    }
  }

  return false;
}

function padMask(mask, width, height) {
  const paddedWidth = width + 2;
  const paddedHeight = height + 2;
  const padded = new Uint8Array(paddedWidth * paddedHeight);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      padded[getIndex(paddedWidth, x + 1, y + 1)] = mask[getIndex(width, x, y)];
    }
  }

  return { padded, paddedWidth, paddedHeight };
}

function traceBoundary(componentMask, width, height) {
  const { padded, paddedWidth, paddedHeight } = padMask(componentMask, width, height);
  let start = null;

  for (let y = 0; y < paddedHeight && !start; y += 1) {
    for (let x = 0; x < paddedWidth; x += 1) {
      if (isBoundaryPixel(padded, paddedWidth, paddedHeight, x, y)) {
        start = { x, y };
        break;
      }
    }
  }

  if (!start) {
    return [];
  }

  let current = start;
  let backtrack = { x: start.x - 1, y: start.y };
  let firstNext = null;
  const contour = [{ x: start.x - 1, y: start.y - 1 }];
  const maxIterations = Math.max(5000, contour.length * MAX_TRACE_MULTIPLIER, width * height);

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    const relativeBacktrackX = backtrack.x - current.x;
    const relativeBacktrackY = backtrack.y - current.y;
    const backtrackIndex = neighborOffsets.findIndex(
      ([dx, dy]) => dx === relativeBacktrackX && dy === relativeBacktrackY
    );

    const startSearchIndex = backtrackIndex === -1 ? 0 : (backtrackIndex + 1) % neighborOffsets.length;
    let nextPoint = null;
    let nextBacktrack = null;

    for (let step = 0; step < neighborOffsets.length; step += 1) {
      const neighborIndex = (startSearchIndex + step) % neighborOffsets.length;
      const [dx, dy] = neighborOffsets[neighborIndex];
      const candidate = { x: current.x + dx, y: current.y + dy };

      if (candidate.x < 0 || candidate.x >= paddedWidth || candidate.y < 0 || candidate.y >= paddedHeight) {
        continue;
      }

      if (padded[getIndex(paddedWidth, candidate.x, candidate.y)]) {
        nextPoint = candidate;
        const previousNeighborIndex =
          (neighborIndex - 1 + neighborOffsets.length) % neighborOffsets.length;
        const [backtrackDx, backtrackDy] = neighborOffsets[previousNeighborIndex];
        nextBacktrack = {
          x: current.x + backtrackDx,
          y: current.y + backtrackDy,
        };
        break;
      }
    }

    if (!nextPoint || !nextBacktrack) {
      break;
    }

    if (!firstNext) {
      firstNext = nextPoint;
    } else if (
      current.x === start.x &&
      current.y === start.y &&
      nextPoint.x === firstNext.x &&
      nextPoint.y === firstNext.y
    ) {
      break;
    }

    current = nextPoint;
    backtrack = nextBacktrack;
    contour.push({ x: current.x - 1, y: current.y - 1 });
  }

  return contour.filter((point) => point.x >= 0 && point.y >= 0 && point.x < width && point.y < height);
}

function fallbackBoundary(componentMask, width, height) {
  const boundary = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (isBoundaryPixel(componentMask, width, height, x, y)) {
        boundary.push({ x, y });
      }
    }
  }

  if (boundary.length < 3) {
    return boundary;
  }

  const center = boundary.reduce(
    (accumulator, point) => ({
      x: accumulator.x + point.x / boundary.length,
      y: accumulator.y + point.y / boundary.length,
    }),
    { x: 0, y: 0 }
  );

  return boundary.sort((a, b) => {
    const angleA = Math.atan2(a.y - center.y, a.x - center.x);
    const angleB = Math.atan2(b.y - center.y, b.x - center.x);
    return angleA - angleB;
  });
}

function getDistance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}

function simplifyContour(points) {
  if (points.length < 3) {
    return points;
  }

  const simplified = [points[0]];
  let previous = points[0];

  for (let i = 1; i < points.length; i += 1) {
    if (getDistance(previous, points[i]) >= 2.5) {
      simplified.push(points[i]);
      previous = points[i];
    }
  }

  return simplified.length >= 3 ? simplified : points;
}

function getBoundingBox(componentMask, width, height) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let count = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!componentMask[getIndex(width, x, y)]) {
        continue;
      }

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      count += 1;
    }
  }

  if (!count) {
    return { left: 0, top: 0, width, height };
  }

  const padX = Math.max(36, Math.round((maxX - minX + 1) * 0.12));
  const padY = Math.max(36, Math.round((maxY - minY + 1) * 0.12));

  const left = Math.max(0, minX - padX);
  const top = Math.max(0, minY - padY);
  const right = Math.min(width, maxX + padX + 1);
  const bottom = Math.min(height, maxY + padY + 1);

  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  };
}

function transformPoints(points, cropBox, outputSize) {
  const scale = Math.min(outputSize / cropBox.width, outputSize / cropBox.height);
  const renderedWidth = cropBox.width * scale;
  const renderedHeight = cropBox.height * scale;
  const offsetX = (outputSize - renderedWidth) / 2;
  const offsetY = (outputSize - renderedHeight) / 2;

  return points.map((point) => ({
    x: ((point.x - cropBox.left) * scale) + offsetX,
    y: ((point.y - cropBox.top) * scale) + offsetY,
  }));
}

function resampleClosedContour(points, targetCount) {
  if (points.length <= targetCount) {
    return points;
  }

  const closedPoints = [...points, points[0]];
  const cumulative = [0];

  for (let i = 1; i < closedPoints.length; i += 1) {
    cumulative.push(cumulative[i - 1] + getDistance(closedPoints[i - 1], closedPoints[i]));
  }

  const totalLength = cumulative[cumulative.length - 1];
  const result = [];

  for (let i = 0; i < targetCount; i += 1) {
    const targetDistance = (i / targetCount) * totalLength;
    let segmentIndex = 1;

    while (segmentIndex < cumulative.length && cumulative[segmentIndex] < targetDistance) {
      segmentIndex += 1;
    }

    const previousDistance = cumulative[segmentIndex - 1];
    const nextDistance = cumulative[segmentIndex];
    const ratio =
      nextDistance === previousDistance
        ? 0
        : (targetDistance - previousDistance) / (nextDistance - previousDistance);
    const start = closedPoints[segmentIndex - 1];
    const end = closedPoints[segmentIndex];

    result.push({
      x: start.x + ((end.x - start.x) * ratio),
      y: start.y + ((end.y - start.y) * ratio),
    });
  }

  return result;
}

function buildPuzzleSvg(points, title, width, height) {
  const radius = Math.max(5, Math.round(Math.min(width, height) * 0.006));
  const fontSize = Math.max(18, Math.round(Math.min(width, height) * 0.022));
  const dotMarkup = points
    .map((point, index) => {
      const labelX = Math.min(width - 12, point.x + radius + 6);
      const labelY = Math.max(24, point.y - radius - 4);

      return `
        <circle cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="${radius}" fill="#111111" />
        <text x="${labelX.toFixed(2)}" y="${labelY.toFixed(2)}" font-size="${fontSize}" font-family="Arial, Helvetica, sans-serif" fill="#111111">${index + 1}</text>
      `;
    })
    .join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#ffffff" />
      <title>${escapeXml(title)} Dot to Dot Puzzle</title>
      ${dotMarkup}
    </svg>
  `;
}

function buildSolutionSvg(contour, title, width, height) {
  const polylinePoints = contour.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#ffffff" />
      <title>${escapeXml(title)} Solved Outline</title>
      <polyline
        points="${polylinePoints}"
        fill="none"
        stroke="#111111"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `;
}

async function renderSvgToWebp(svgMarkup, options = {}) {
  return sharp(Buffer.from(svgMarkup)).webp(options).toBuffer();
}

async function createPreviewSheet(entries) {
  const thumbWidth = 280;
  const thumbHeight = 280;
  const gap = 32;
  const columns = 3;
  const rows = entries.length;
  const sheetWidth = (thumbWidth * columns) + (gap * (columns + 1));
  const sheetHeight = (thumbHeight * rows) + (gap * (rows + 1));
  const composites = [];

  for (let row = 0; row < rows; row += 1) {
    const entry = entries[row];
    const images = [
      entry.referencePath,
      entry.puzzlePath,
      entry.solutionPath,
    ];

    for (let column = 0; column < images.length; column += 1) {
      const buffer = await sharp(images[column])
        .resize(thumbWidth, thumbHeight, {
          fit: "contain",
          background: "#ffffff",
        })
        .png()
        .toBuffer();

      composites.push({
        input: buffer,
        left: gap + (column * (thumbWidth + gap)),
        top: gap + (row * (thumbHeight + gap)),
      });
    }
  }

  await sharp({
    create: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 4,
      background: "#f8fafc",
    },
  })
    .composite(composites)
    .webp({ nearLossless: true, quality: 92 })
    .toFile(path.join(OUTPUT_DIR, "overview.webp"));
}

async function main() {
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const generatedItems = [];
  const previewEntries = [];

  for (const entry of openclipartStandaloneManifest) {
    const detailUrl = `https://openclipart.org/detail/${entry.openclipartId}`;
    const downloadUrl = `https://openclipart.org/download/${entry.openclipartId}`;

    console.log(`Generating ${entry.slug}...`);
    const [detailHtml, svgText] = await Promise.all([fetchText(detailUrl), fetchText(downloadUrl)]);
    const metadata = extractMetadataFromHtml(detailHtml, entry.title || toTitleCase(entry.slug));
    const rendered = await renderSvg(svgText);

    const baseMask = buildForegroundMask(rendered.rawPixels, rendered.width, rendered.height);
    const componentMask = findLargestConnectedComponent(baseMask, rendered.width, rendered.height);
    let contour = traceBoundary(componentMask, rendered.width, rendered.height);

    if (contour.length < 32) {
      contour = fallbackBoundary(componentMask, rendered.width, rendered.height);
    }

    contour = simplifyContour(contour);
    const sampledDots = resampleClosedContour(contour, entry.dotCount);

    if (sampledDots.length < Math.max(12, Math.floor(entry.dotCount * 0.8))) {
      throw new Error(`Contour sampling failed for ${entry.slug}`);
    }

    const cropBox = getBoundingBox(componentMask, rendered.width, rendered.height);
    const transformedContour = transformPoints(contour, cropBox, RENDER_SIZE);
    const transformedDots = transformPoints(sampledDots, cropBox, RENDER_SIZE);

    const referenceFilename = `${entry.slug}-reference.webp`;
    const puzzleFilename = `${entry.slug}-puzzle.webp`;
    const solutionFilename = `${entry.slug}-solution.webp`;

    const referencePath = path.join(OUTPUT_DIR, referenceFilename);
    const puzzlePath = path.join(OUTPUT_DIR, puzzleFilename);
    const solutionPath = path.join(OUTPUT_DIR, solutionFilename);

    const puzzleSvg = buildPuzzleSvg(transformedDots, entry.title, RENDER_SIZE, RENDER_SIZE);
    const solutionSvg = buildSolutionSvg(transformedContour, entry.title, RENDER_SIZE, RENDER_SIZE);
    const normalizedReferencePng = await sharp(rendered.referencePng)
      .extract(cropBox)
      .resize(RENDER_SIZE, RENDER_SIZE, {
        fit: "contain",
        background: "#ffffff",
      })
      .png()
      .toBuffer();

    await Promise.all([
      renderBufferToWebp(normalizedReferencePng, {
        nearLossless: true,
        quality: 92,
        alphaQuality: 100,
      }).then((buffer) => fs.writeFile(referencePath, buffer)),
      renderSvgToWebp(puzzleSvg, {
        lossless: true,
        quality: 100,
        alphaQuality: 100,
      }).then((buffer) => fs.writeFile(puzzlePath, buffer)),
      renderSvgToWebp(solutionSvg, {
        lossless: true,
        quality: 100,
        alphaQuality: 100,
      }).then((buffer) => fs.writeFile(solutionPath, buffer)),
      fs.writeFile(path.join(OUTPUT_DIR, `${entry.slug}.svg`), svgText),
    ]);

    const publicBase = `/generated/dot-to-dot/standalone-openclipart`;
    generatedItems.push({
      id: entry.slug,
      title: entry.title,
      description: `Free printable ${entry.title.toLowerCase()} dot to dot puzzle generated from a complete public domain Openclipart source. Includes the reference image, numbered puzzle, and solved outline.`,
      difficulty: entry.difficulty,
      tagColor: DIFFICULTY_TAGS[entry.difficulty] || "bg-green-600",
      imageUrl: `${publicBase}/${puzzleFilename}`,
      imageSrcset: `${publicBase}/${puzzleFilename} ${rendered.width}w`,
      altText: `${entry.title} dot to dot printable puzzle`,
      detailPage: `/printables/${entry.slug}/`,
      solutionUrl: `${publicBase}/${solutionFilename}`,
      solutionAltText: `${entry.title} solved outline`,
      referenceImageUrl: `${publicBase}/${referenceFilename}`,
      sourceUrl: detailUrl,
      sourceCredit: metadata.sourceCredit,
      sourceTitle: metadata.sourceTitle,
      licenseName: OPENCLIPART_LICENSE_NAME,
      licenseUrl: OPENCLIPART_LICENSE_URL,
      category: ensureArray(entry.category),
      dotRange: [1, entry.dotCount],
      ageRecommendation: entry.ageRecommendation,
      popularity: entry.popularity,
    });

    previewEntries.push({ referencePath, puzzlePath, solutionPath });
  }

  await fs.writeFile(LIB_OUTPUT, `${JSON.stringify(generatedItems, null, 2)}\n`);
  await createPreviewSheet(previewEntries);

  console.log(`Generated ${generatedItems.length} standalone printable items.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
