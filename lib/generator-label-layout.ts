/** Position number labels only: point order and coordinates are never changed. */
export interface GeneratorPoint { x: number; y: number }
export interface GeneratorLabel extends GeneratorPoint {
  text: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export function layoutGeneratorLabels(
  points: readonly GeneratorPoint[],
  width: number,
  height: number,
  fontSize: number,
  radius: number,
  measureWidth: (text: string) => number,
): { labels: GeneratorLabel[]; crowded: boolean } {
  if (!points.length) return { labels: [], crowded: false };
  const center = points.reduce((a, p) => ({ x: a.x + p.x / points.length, y: a.y + p.y / points.length }), { x: 0, y: 0 });
  const orientation = points.reduce((sum, p, i) => {
    const next = points[(i + 1) % points.length];
    return sum + p.x * next.y - next.x * p.y;
  }, 0) >= 0 ? 1 : -1;
  const padding = Math.max(3, fontSize * 0.08);
  const labels: GeneratorLabel[] = [];
  let crowded = false;
  const angles = [0, 0.35, -0.35, 0.7, -0.7, 1.05, -1.05, 1.57, -1.57, Math.PI];
  const overlap = (a: GeneratorLabel, b: GeneratorLabel) =>
    Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
    Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

  points.forEach((point, index) => {
    const text = String(index + 1);
    const halfWidth = measureWidth(text) / 2 + padding;
    const halfHeight = fontSize * 0.6 + padding;
    const previous = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const direction = dx || dy
      ? Math.atan2(-orientation * dx, orientation * dy)
      : Math.atan2(point.y - center.y, point.x - center.x);
    let best: GeneratorLabel | undefined;
    let bestPenalty = Infinity;
    search: for (const distance of [0.9, 1.4, 2, 2.8, 3.8, 5, 7]) {
      for (const angle of angles) {
        const x = Math.max(halfWidth, Math.min(width - halfWidth, point.x + Math.cos(direction + angle) * (radius + fontSize * distance)));
        const y = Math.max(halfHeight, Math.min(height - halfHeight, point.y + Math.sin(direction + angle) * (radius + fontSize * distance)));
        const label = { text, x, y, left: x - halfWidth, top: y - halfHeight, right: x + halfWidth, bottom: y + halfHeight };
        let penalty = labels.reduce((sum, other) => sum + overlap(label, other), 0);
        // Avoid putting a number over a neighbouring dot as well as over text.
        const ownDistance = (point.x - x) ** 2 + (point.y - y) ** 2;
        for (const dot of points) {
          // A number should remain closest to its own dot, not just be legible.
          if (dot !== point && (dot.x - x) ** 2 + (dot.y - y) ** 2 <= ownDistance) penalty += fontSize ** 2;
          const dx = dot.x - Math.max(label.left, Math.min(label.right, dot.x));
          const dy = dot.y - Math.max(label.top, Math.min(label.bottom, dot.y));
          if (dx * dx + dy * dy < (radius + padding) ** 2) penalty += fontSize ** 2;
        }
        if (label.left < 0 || label.top < 0 || label.right > width || label.bottom > height) penalty += fontSize ** 2;
        if (penalty < bestPenalty) { best = label; bestPenalty = penalty; }
        if (penalty === 0) break search;
      }
    }
    if (best) labels.push(best);
    if (bestPenalty > 0) crowded = true;
  });
  return { labels, crowded };
}
