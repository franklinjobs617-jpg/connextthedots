import jsPDF from "jspdf";

/**
 * Professional Export Utilities for Bead Art
 * Designed with a "First Principles" approach to physical crafting.
 */

// Helper to get a unique symbol for a color index
// We use a set of high-contrast symbols for the manual
const SYMBOLS = [
    "●", "■", "▲", "◆", "★", "♣", "♠", "♥", "♦", "✖",
    "✚", "✱", "▼", "◀", "▶", "◉", "◎", "⊕", "⊗", "⊿"
];

export const getSymbol = (index: number) => {
    // If we run out of symbols, we just use letters
    if (index < SYMBOLS.length) return SYMBOLS[index];
    const alphaIndex = index - SYMBOLS.length;
    return String.fromCharCode(65 + (alphaIndex % 26)) + (Math.floor(alphaIndex / 26) || "");
};

/**
 * Generate a high-quality pattern image with rulers and symbols.
 */
export const generatePatternImage = async (
    grid: (string | null)[][],
    palette: any[],
    cellSize: number = 20
): Promise<string> => {
    const width = grid[0].length;
    const height = grid.length;
    const offset = 30; // Ruler offset

    const canvas = document.createElement("canvas");
    canvas.width = width * cellSize + offset;
    canvas.height = height * cellSize + offset;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Rulers
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, offset);
    ctx.fillRect(0, 0, offset, canvas.height);

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, offset);
    ctx.strokeRect(0, 0, offset, canvas.height);

    ctx.fillStyle = "#64748b";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // X Ruler
    for (let x = 0; x < width; x++) {
        if ((x + 1) % 5 === 0 || x === 0 || x === width - 1) {
            ctx.fillText((x + 1).toString(), offset + x * cellSize + cellSize / 2, offset / 2);
        }
    }
    // Y Ruler
    for (let y = 0; y < height; y++) {
        if ((y + 1) % 5 === 0 || y === 0 || y === height - 1) {
            ctx.fillText((y + 1).toString(), offset / 2, offset + y * cellSize + cellSize / 2);
        }
    }

    // Draw Grid and Beads
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const rx = offset + x * cellSize;
            const ry = offset + y * cellSize;

            // Draw cell border
            ctx.strokeStyle = (x % 5 === 4 || y % 5 === 4) ? "#94a3b8" : "#e2e8f0";
            ctx.lineWidth = (x % 5 === 4 || y % 5 === 4) ? 1.5 : 0.5;
            ctx.strokeRect(rx, ry, cellSize, cellSize);

            if (cell) {
                const colorObj = palette.find(p => p.id === cell);
                if (colorObj) {
                    const cx = rx + cellSize / 2;
                    const cy = ry + cellSize / 2;

                    // Draw Bead Circle
                    ctx.strokeStyle = colorObj.color;
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.arc(cx, cy, cellSize / 2 - 2, 0, Math.PI * 2);
                    ctx.stroke();

                    // Draw Text Code (very small)
                    ctx.fillStyle = "#334155";
                    ctx.font = "bold 8px sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(colorObj.code, cx, cy);
                }
            }
        });
    });

    return canvas.toDataURL("image/png");
};

/**
 * Generate a realistic ironed effect
 */
export const generateFinishedEffect = async (
    grid: (string | null)[][],
    palette: any[],
    cellSize: number = 20
): Promise<string> => {
    const width = grid[0].length;
    const height = grid.length;

    const canvas = document.createElement("canvas");
    canvas.width = width * cellSize;
    canvas.height = height * cellSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                const colorObj = palette.find(p => p.id === cell);
                if (colorObj) {
                    const rx = x * cellSize;
                    const ry = y * cellSize;
                    const cx = rx + cellSize / 2;
                    const cy = ry + cellSize / 2;

                    // "Ironed" look: beads melt into squares with rounded corners
                    const meltSize = cellSize - 0.5;
                    ctx.fillStyle = colorObj.color;

                    // Rounded Rect for melting effect
                    const r = 4;
                    ctx.beginPath();
                    ctx.moveTo(rx + r, ry);
                    ctx.lineTo(rx + meltSize - r, ry);
                    ctx.quadraticCurveTo(rx + meltSize, ry, rx + meltSize, ry + r);
                    ctx.lineTo(rx + meltSize, ry + meltSize - r);
                    ctx.quadraticCurveTo(rx + meltSize, ry + meltSize, rx + meltSize - r, ry + meltSize);
                    ctx.lineTo(rx + r, ry + meltSize);
                    ctx.quadraticCurveTo(rx, ry + meltSize, rx, ry + meltSize - r);
                    ctx.lineTo(rx, ry + r);
                    ctx.quadraticCurveTo(rx, ry, rx + r, ry);
                    ctx.closePath();
                    ctx.fill();

                    // Center hole (shrunk when ironed)
                    ctx.fillStyle = "rgba(0,0,0,0.15)";
                    ctx.beginPath();
                    ctx.arc(cx, cy, cellSize / 8, 0, Math.PI * 2);
                    ctx.fill();

                    // Subtle highlight
                    ctx.strokeStyle = "rgba(255,255,255,0.2)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(cx - 1, cy - 1, cellSize / 2 - 2, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        });
    });

    return canvas.toDataURL("image/png");
};

/**
 * Generate professional Material List
 */
export const generateMaterialList = async (stats: any[]): Promise<string> => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = Math.max(600, stats.length * 40 + 200);
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Styling
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("MATERIAL INVENTORY", 50, 70);

    ctx.fillStyle = "#64748b";
    ctx.font = "16px sans-serif";
    ctx.fillText("Essential guide for bead preparation", 50, 100);

    // Table headers
    const headers = ["SYMBOL", "COLOR", "NAME", "CODE", "COUNT", "EST. BAGS"];
    const xPositions = [50, 150, 250, 450, 580, 700];

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 12px sans-serif";
    headers.forEach((h, i) => ctx.fillText(h, xPositions[i], 160));

    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 175);
    ctx.lineTo(750, 175);
    ctx.stroke();

    stats.forEach((s, i) => {
        const y = 210 + i * 40;

        // Symbol
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(getSymbol(i), xPositions[0] + 20, y);
        ctx.textAlign = "left";

        // Color Block
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(xPositions[1] + 15, y - 5, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e2e8f0";
        ctx.stroke();

        // Details
        ctx.fillStyle = "#334155";
        ctx.font = "14px sans-serif";
        ctx.fillText(s.name, xPositions[2], y);

        ctx.font = "14px monospace";
        ctx.fillText(`#${s.code}`, xPositions[3], y);

        ctx.font = "bold 14px sans-serif";
        ctx.fillText(`${s.count} pcs`, xPositions[4], y);

        const bags = Math.ceil(s.count / 1000);
        ctx.fillStyle = "#0284c7";
        ctx.fillText(`${bags} bag${bags > 1 ? 's' : ''}`, xPositions[5], y);
    });

    return canvas.toDataURL("image/png");
};

/**
 * Generate Multi-page PDF Instruction Manual
 */
export const generateProfessionalPDF = async (
    title: string,
    grid: (string | null)[][],
    stats: any[],
    palette: any[]
) => {
    const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Page 1: COVER ---
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageWidth, 60, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("ConnextTheDots", 20, 30);
    doc.setFontSize(14);
    doc.text("Instructional Guide & Pattern Manual", 20, 45);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(22);
    doc.text(title || "Project Manual", 20, 85);

    // Main Preview (Finished effect)
    const previewImg = await generateFinishedEffect(grid, palette, 5);
    const imgWidth = 120;
    const imgHeight = (grid.length / grid[0].length) * imgWidth;
    doc.addImage(previewImg, "PNG", (pageWidth - imgWidth) / 2, 100, imgWidth, imgHeight);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Grid Size: ${grid[0].length} x ${grid.length}`, 20, 95);
    doc.text(`Total Beads: ${stats.reduce((acc, s) => acc + s.count, 0)}`, 20, 100);

    // Footer
    doc.setFontSize(8);
    doc.text("Generated by ConnextTheDots - Your Ultimate Bead Art Companion", pageWidth / 2, pageHeight - 15, { align: "center" });

    // --- Page 2: INVENTORY & SHOPPING LIST ---
    doc.addPage();
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("Material Inventory", 20, 25);

    const materialImg = await generateMaterialList(stats);
    // Adjust scale to fit page
    doc.addImage(materialImg, "PNG", 15, 40, 180, 0);

    // --- Page 3+: PAGINATED ASSEMBLY GUIDE ---
    // Standard pegboard is 29x29
    const BOARD_SIZE = 29;
    const cols = Math.ceil(grid[0].length / BOARD_SIZE);
    const rows = Math.ceil(grid.length / BOARD_SIZE);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            doc.addPage();

            const startX = c * BOARD_SIZE;
            const startY = r * BOARD_SIZE;
            const endX = Math.min(startX + BOARD_SIZE, grid[0].length);
            const endY = Math.min(startY + BOARD_SIZE, grid.length);

            // Sub-grid extraction
            const subGrid = grid.slice(startY, endY).map(row => row.slice(startX, endX));

            doc.setFontSize(16);
            doc.setTextColor(30, 41, 59);
            doc.text(`Assembly Board: Row ${r + 1}, Col ${c + 1}`, 20, 20);
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text(`Coordinate: (${startX + 1}, ${startY + 1}) to (${endX}, ${endY})`, 20, 27);

            const subPattern = await generatePatternImage(subGrid, palette, 25); // Large cells for printing
            doc.addImage(subPattern, "PNG", 10, 40, 190, 0);

            // Helpful tip
            doc.setDrawColor(241, 245, 249);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(20, pageHeight - 35, pageWidth - 40, 20, 3, 3, "FD");
            doc.setTextColor(71, 85, 105);
            doc.setFontSize(9);
            doc.text("Pro Tip: Place your transparent pegboard directly over this printed page to see where each bead goes.", pageWidth / 2, pageHeight - 23, { align: "center" });
        }
    }

    doc.save(`${title || 'Project'}-Manual.pdf`);
};
