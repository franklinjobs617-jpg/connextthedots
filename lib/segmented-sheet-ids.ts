/** Exact English-only candidates; no change to existing language policy. */
export const defaultSegmentedSheetIds = ["tufted-owl-study-207", "hilltop-observatory-202"] as const;

// Add a new ID here only with its frozen asset contract and registry record.
export const segmentedSheetIds = [...defaultSegmentedSheetIds, "dragonfly-water-lily", "christmas-candle-window"] as const;

/** Adults opts into the approved additions; other callers keep the original pair. */
export const adultDiscoverySheetIds: readonly string[] = [
    ...defaultSegmentedSheetIds, "dragonfly-water-lily", "christmas-candle-window",
];
