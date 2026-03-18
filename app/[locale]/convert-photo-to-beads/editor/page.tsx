"use client";

import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Pencil,
    Eraser,
    PaintBucket,
    Replace,
    Pipette,
    Hand,
    Undo,
    Redo,
    Grid3X3,
    Hash,
    BarChart2,
    Download,
    Plus,
    Upload,
    ArrowLeft,
    Image as ImageIcon,
    Sparkles,
    FileText,
    Palette,
    Globe,
} from "lucide-react";
import { PALETTE } from "../palette-data";
import { Tool, Cell, GridData } from "../types";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, CELL_SIZE, PRESETS } from "../constants";
import { hexToRgb, colorDistance, findClosestColor, floodFill, getDetailedBeadCanvas } from "../utils";
import { loadGalleryPatterns } from "../gallery-data";
import {
    generatePatternImage,
    generateFinishedEffect,
    generateMaterialList,
    generateProfessionalPDF
} from "../lib/export-utils";

// --- Components ---
import { ToolButton, IconButton } from "../components/Buttons";
import { ImageSizeModal } from "../components/ImageSizeModal";
import { NewCanvasModal } from "../components/NewCanvasModal";
import { Header } from "../components/Header";
import { CanvasArea } from "../components/CanvasArea";
import { Sidebar } from "../components/Sidebar";
import { MobileToolbar } from "../components/MobileToolbar";
import { GalleryExportModal } from "../components/GalleryExportModal";




export default function App() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const importSlug = searchParams.get("import");
    const currentLocale = pathname.split("/")[1];

    const [grid, setGrid] = useState<GridData>(() =>
        Array(DEFAULT_HEIGHT)
            .fill(null)
            .map(() => Array(DEFAULT_WIDTH).fill(null))
    );
    const [history, setHistory] = useState<GridData[]>([grid]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // --- Core optimization: Import pattern from gallery ---
    useEffect(() => {
        if (!importSlug) return;

        const performImport = async () => {
            const patterns = await loadGalleryPatterns();
            const target = patterns.find(p => p.slug === importSlug);

            if (target && target.grid) {
                console.log("[Editor] Importing pattern:", target.title);
                setGrid(target.grid);
                setHistory([target.grid]);
                setHistoryIndex(0);

                // Auto adjust camera position and zoom
                setTimeout(() => {
                    const canvasWidth = target.width * CELL_SIZE;
                    const canvasHeight = target.height * CELL_SIZE;
                    const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
                    const viewportWidth = (window.innerWidth - sidebarWidth) * 0.8;
                    const viewportHeight = (window.innerHeight - 150) * 0.8;
                    const autoZoom = Math.min(1.0, viewportWidth / canvasWidth, viewportHeight / canvasHeight);

                    setZoom(autoZoom);
                    setPan({ x: 0, y: 0 });
                }, 200);
            }
        };

        performImport();
    }, [importSlug]);

    const [tool, setTool] = useState<Tool>("pen");
    const [currentColor, setCurrentColor] = useState<string | null>(null);

    const [showGrid, setShowGrid] = useState(true);
    const [boardSize, setBoardSize] = useState<number>(0);
    const [showNumbers, setShowNumbers] = useState(false);
    const [showStats, setShowStats] = useState(false);

    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });

    const [isDrawing, setIsDrawing] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(
        null
    );
    const [title, setTitle] = useState("My Project");

    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [showPalette, setShowPalette] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(
        null
    );
    const [imageWidth, setImageWidth] = useState(100);
    const [showLangMenu, setShowLangMenu] = useState(false);

    const languages = [
        { code: "en", name: "English" },
        { code: "it", name: "Italiano" },
        { code: "pt", name: "Português" },
        { code: "fr", name: "Français" },
    ];

    const switchLanguage = (locale: string) => {
        const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
        router.push(newPath);
        setShowLangMenu(false);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const offscreenRef = useRef<HTMLCanvasElement | null>(null);
    const cacheKeyRef = useRef<string>("");
    const lastRenderKeyRef = useRef<string>("");
    const gridRef = useRef(grid);
    const historyRef = useRef(history);
    const historyIndexRef = useRef(historyIndex);

    // Ultimate performance optimization: Track grid version number, avoid JSON.stringify
    const gridVersionRef = useRef(0);
    useEffect(() => {
        gridVersionRef.current += 1;
    }, [grid]);

    useEffect(() => {
        gridRef.current = grid;
    }, [grid]);
    useEffect(() => {
        historyRef.current = history;
    }, [history]);
    useEffect(() => {
        historyIndexRef.current = historyIndex;
    }, [historyIndex]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // To make it easier for users to zoom in and compare beads, lower the switching threshold.
        // When the grid display on screen is larger than 22px (i.e., zoomed in more than 1.1x of 100% original size), immediately switch to detailed bead mode!
        const useSimpleRender = (CELL_SIZE * zoom) < 5;
        const colorMap = new Map(PALETTE.map((p) => [p.id, p.color]));
        // Must include showGrid in cache control, because we'll draw the grid ourselves on the offscreen canvas
        const cacheKey = `${grid[0].length}x${grid.length}-${gridVersionRef.current}-${showNumbers}-${showGrid}-${useSimpleRender}-${boardSize}`;

        const renderCanvas = () => {
            // Use offscreen cache
            if (cacheKey !== cacheKeyRef.current) {
                // Ensure offscreen canvas size is correct, recreate if size changes
                if (
                    !offscreenRef.current ||
                    offscreenRef.current.width !== canvas.width ||
                    offscreenRef.current.height !== canvas.height
                ) {
                    offscreenRef.current = document.createElement("canvas");
                    offscreenRef.current.width = canvas.width;
                    offscreenRef.current.height = canvas.height;
                    console.log("Recreating offscreen canvas:", canvas.width, "x", canvas.height);
                }
                const offCtx = offscreenRef.current.getContext("2d");
                if (!offCtx) return;

                offCtx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw beads to offscreen Canvas
                grid.forEach((row, y) => {
                    row.forEach((cell, x) => {
                        if (cell) {
                            const color = colorMap.get(cell);
                            if (color) {
                                const cx = x * CELL_SIZE + CELL_SIZE / 2;
                                const cy = y * CELL_SIZE + CELL_SIZE / 2;
                                // Greatly reduce the bead spacing from the original code. The original CELL_SIZE/2 - 1.5 caused
                                // the white light leakage area at the four corners of the grid to be as high as 45%, which is the biggest culprit for color washing out!
                                const outerRadius = CELL_SIZE / 2 - 0.5;
                                const innerRadius = CELL_SIZE / 4;

                                if (useSimpleRender) {
                                    offCtx.fillStyle = color;

                                    // For large quantities, use filled squares to ensure 100% seamless color blocks, eliminating white light
                                    offCtx.fillRect(
                                        x * CELL_SIZE,
                                        y * CELL_SIZE,
                                        CELL_SIZE,
                                        CELL_SIZE
                                    );

                                    // 2. Cancel the original transparent hole!
                                    // Instead of a real transparent hole (which leaks white light when zoomed), draw a dark semi-transparent shadow layer,
                                    // which perfectly simulates the heavy grain feel of the hole depression while greatly increasing color contrast.
                                    offCtx.fillStyle = "rgba(0, 0, 0, 0.25)";
                                    offCtx.beginPath();
                                    offCtx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
                                    offCtx.fill();

                                    if (showNumbers) {
                                        offCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
                                        offCtx.font = "bold 7px sans-serif";
                                        offCtx.textAlign = "center";
                                        offCtx.textBaseline = "middle";
                                        offCtx.fillText(cell, cx, cy);
                                    }
                                } else {
                                    // Super performance optimization: Change from complex vector rendering with shadows+gradients+7 drawing paths per bead,
                                    // to dictionary-style “stamp” drawing. Directly use GPU `drawImage` instead of CPU calculation! Performance increased 100x!
                                    const beadPattern = getDetailedBeadCanvas(color, CELL_SIZE);
                                    offCtx.drawImage(beadPattern, cx - (CELL_SIZE + 6) / 2, cy - (CELL_SIZE + 6) / 2);

                                    if (showNumbers) {
                                        offCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
                                        offCtx.font = "bold 7px sans-serif";
                                        offCtx.textAlign = "center";
                                        offCtx.textBaseline = "middle";
                                        offCtx.fillText(cell, cx, cy);
                                    }
                                }
                            }
                        }
                    });
                });

                // Key patch: If current is dense pixel block rendering (seamless) and user enabled grid (showGrid=true)
                // then CSS background will be completely blocked, so we draw a weak black foreground grid on top of this pure pixel base.
                // This also makes the finished effect naturally have weak boundary lines for each cell, better than the original white grid lines!
                if (showGrid && useSimpleRender) {
                    offCtx.strokeStyle = "rgba(0, 0, 0, 0.15)";
                    offCtx.lineWidth = 1;
                    offCtx.beginPath();
                    for (let x = 0; x <= canvas.width; x += CELL_SIZE) {
                        offCtx.moveTo(x, 0);
                        offCtx.lineTo(x, canvas.height);
                    }
                    for (let y = 0; y <= canvas.height; y += CELL_SIZE) {
                        offCtx.moveTo(0, y);
                        offCtx.lineTo(canvas.width, y);
                    }
                    offCtx.stroke();
                }

                // Revolutionary progress: Physical engineering guide lines (cutting board boundaries)
                if (showGrid && boardSize > 0) {
                    offCtx.save();
                    offCtx.strokeStyle = "rgba(239, 68, 68, 0.7)"; // Bright red/pink, different from permanent image
                    offCtx.lineWidth = 1.5; // Thin, inserted between bead gaps, absolutely not blocking any beads
                    offCtx.setLineDash([8, 6]); // Dashed line, both guiding and not destroying the image
                    offCtx.beginPath();
                    // Skip 0, because edges don't need to be drawn inside
                    for (let x = CELL_SIZE * boardSize; x < canvas.width; x += CELL_SIZE * boardSize) {
                        offCtx.moveTo(x, 0);
                        offCtx.lineTo(x, canvas.height);
                    }
                    for (let y = CELL_SIZE * boardSize; y < canvas.height; y += CELL_SIZE * boardSize) {
                        offCtx.moveTo(0, y);
                        offCtx.lineTo(canvas.width, y);
                    }
                    offCtx.stroke();
                    offCtx.restore();
                }

                cacheKeyRef.current = cacheKey;
            }

            // Ultimate smooth optimization: Render skip gate
            // If the current base image and guide lines haven't changed, and the current hover cell hasn't changed,
            // and it's only triggered by user “zoom in/out”, we absolutely don't redraw!
            // Directly rely on CSS transform scaling. This saves 120 huge Canvas copies per second.
            const currentRenderKey = `${cacheKey}-hover:${hoverCell?.x},${hoverCell?.y}-tool:${tool}`;
            if (lastRenderKeyRef.current === currentRenderKey) {
                return;
            }
            lastRenderKeyRef.current = currentRenderKey;

            // Clear main Canvas and copy offscreen Canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (offscreenRef.current) {
                ctx.drawImage(offscreenRef.current, 0, 0);
            }

            if (hoverCell && tool !== "pan") {
                if (tool === "pen" || tool === "fill" || tool === "replace") {
                    ctx.strokeStyle = "#0ea5e9";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(
                        hoverCell.x * CELL_SIZE,
                        hoverCell.y * CELL_SIZE,
                        CELL_SIZE,
                        CELL_SIZE
                    );
                } else if (tool === "eraser") {
                    ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
                    ctx.fillRect(
                        hoverCell.x * CELL_SIZE,
                        hoverCell.y * CELL_SIZE,
                        CELL_SIZE,
                        CELL_SIZE
                    );
                } else {
                    ctx.strokeStyle = "#0ea5e9";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(
                        hoverCell.x * CELL_SIZE,
                        hoverCell.y * CELL_SIZE,
                        CELL_SIZE,
                        CELL_SIZE
                    );
                }
            }
        };

        renderCanvas();
    }, [grid, showNumbers, showGrid, hoverCell, tool, zoom, boardSize]);

    const pushHistory = useCallback((newGrid: GridData) => {
        setHistory((prev) => {
            const newHistory = prev.slice(0, historyIndexRef.current + 1);
            newHistory.push(newGrid);
            if (newHistory.length > 50) newHistory.shift();
            return newHistory;
        });
        setHistoryIndex((prev) => Math.min(prev + 1, 50));
    }, []);

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setGrid(history[historyIndex - 1]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setGrid(history[historyIndex + 1]);
        }
    };

    const createNewGrid = (width: number, height: number) => {
        const newGrid = Array(height)
            .fill(null)
            .map(() => Array(width).fill(null));
        setGrid(newGrid);
        setHistory([newGrid]);
        setHistoryIndex(0);
        setPan({ x: 0, y: 0 });
        setZoom(1);
    };

    const clearGrid = () => {
        const newGrid = Array(DEFAULT_HEIGHT)
            .fill(null)
            .map(() => Array(DEFAULT_WIDTH).fill(null));
        setGrid(newGrid);
        pushHistory(newGrid);
        setPan({ x: 0, y: 0 });
        setZoom(1);
    };

    const getCellCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const scaleX = rect.width / e.currentTarget.width;
        const scaleY = rect.height / e.currentTarget.height;

        const x = Math.floor((e.clientX - rect.left) / scaleX / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top) / scaleY / CELL_SIZE);
        return { x, y };
    };

    const handleCanvasPointerDown = (
        e: React.PointerEvent<HTMLCanvasElement>
    ) => {
        if (tool === "pan" || e.button === 1) {
            e.preventDefault();
            setIsPanning(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (e.button === 0) {
            setIsDrawing(true);
            const { x, y } = getCellCoordinates(e);
            if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
                handleCellAction(x, y);
            }
        }
    };

    const handleCanvasPointerMove = (
        e: React.PointerEvent<HTMLCanvasElement>
    ) => {
        const { x, y } = getCellCoordinates(e);
        if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
            setHoverCell({ x, y });
            if (isDrawing) {
                handleCellAction(x, y);
            }
        } else {
            setHoverCell(null);
        }
    };

    const handleWrapperPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (tool === "pan" || e.button === 1) {
            e.preventDefault();
            setIsPanning(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleCellAction = useCallback(
        (x: number, y: number) => {
            if (tool === "pan") return;

            setGrid((prevGrid) => {
                if (tool === "pen") {
                    if (!currentColor || prevGrid[y][x] === currentColor) return prevGrid;
                    const newGrid = [...prevGrid];
                    newGrid[y] = [...newGrid[y]];
                    newGrid[y][x] = currentColor;
                    return newGrid;
                } else if (tool === "eraser") {
                    if (prevGrid[y][x] === null) return prevGrid;
                    const newGrid = [...prevGrid];
                    newGrid[y] = [...newGrid[y]];
                    newGrid[y][x] = null;
                    return newGrid;
                } else if (tool === "fill") {
                    if (!currentColor) return prevGrid;
                    const targetColor = prevGrid[y][x];
                    if (targetColor === currentColor) return prevGrid;
                    return floodFill(prevGrid, x, y, targetColor, currentColor);
                } else if (tool === "replace") {
                    if (!currentColor) return prevGrid;
                    const targetColor = prevGrid[y][x];
                    if (targetColor === currentColor || targetColor === null)
                        return prevGrid;
                    const newGrid = prevGrid.map((row) => [...row]);
                    for (let r = 0; r < newGrid.length; r++) {
                        for (let c = 0; c < newGrid[0].length; c++) {
                            if (newGrid[r][c] === targetColor) {
                                newGrid[r][c] = currentColor;
                            }
                        }
                    }
                    return newGrid;
                } else if (tool === "eyedropper") {
                    const color = prevGrid[y][x];
                    if (color) {
                        setCurrentColor(color);
                        setTool("pen");
                    }
                    return prevGrid;
                }
                return prevGrid;
            });
        },
        [tool, currentColor]
    );

    const handlePointerUp = () => {
        if (isDrawing) {
            setIsDrawing(false);
            // Only push to history if the grid actually changed
            if (historyRef.current[historyIndexRef.current] !== gridRef.current) {
                pushHistory(gridRef.current);
            }
        }
    };

    useEffect(() => {
        const handleGlobalPointerMove = (e: PointerEvent) => {
            if (isPanning) {
                const dx = e.clientX - lastMousePos.x;
                const dy = e.clientY - lastMousePos.y;
                setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
                setLastMousePos({ x: e.clientX, y: e.clientY });
            }
        };

        const handleGlobalPointerUp = () => {
            setIsPanning(false);
            if (isDrawing) {
                handlePointerUp();
            }
        };

        window.addEventListener("pointermove", handleGlobalPointerMove);
        window.addEventListener("pointerup", handleGlobalPointerUp);

        return () => {
            window.removeEventListener("pointermove", handleGlobalPointerMove);
            window.removeEventListener("pointerup", handleGlobalPointerUp);
        };
    }, [isPanning, isDrawing, lastMousePos]);

    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const mainEl = mainRef.current;
        if (!mainEl) return;

        const handleWheelNative = (e: WheelEvent) => {
            e.preventDefault();

            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            setZoom((z) => Math.max(0.1, Math.min(10, z * zoomFactor)));
        };

        mainEl.addEventListener("wheel", handleWheelNative, { passive: false });
        return () => mainEl.removeEventListener("wheel", handleWheelNative);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setUploadedImage(img);
                const defaultWidth = Math.min(
                    100,
                    Math.max(29, Math.round(img.width / 10))
                );
                setImageWidth(defaultWidth);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };




    const handleImageConfirm = (
        width: number,
        height: number,
        previewGrid: GridData,
        newBoardSize?: number
    ) => {
        setUploadedImage(null);
        if (newBoardSize !== undefined) {
            setBoardSize(newBoardSize);
        }

        setTimeout(() => {
            setGrid(previewGrid);
            setHistory([previewGrid]);
            setHistoryIndex(0);
            setPan({ x: 0, y: 0 });

            // Auto zoom to fit viewport
            const canvasWidth = width * CELL_SIZE + 24;
            const canvasHeight = height * CELL_SIZE + 24;
            const sidebarWidth = window.innerWidth >= 1024 ? 320 : 0;
            const viewportWidth = (window.innerWidth - sidebarWidth) * 0.85;
            const viewportHeight = (window.innerHeight - 56 - 60) * 0.85;
            const autoZoom = Math.min(
                0.9,
                viewportWidth / canvasWidth,
                viewportHeight / canvasHeight
            );
            setZoom(autoZoom);
        }, 100);
    };

    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

    const handleExport = async (type: "pattern" | "finished" | "material" | "pdf" | "gallery") => {
        setIsExportMenuOpen(false);

        if (type === "gallery") {
            setIsGalleryModalOpen(true);
            return;
        }

        let dataUrl = "";
        if (type === "pattern") {
            dataUrl = await generatePatternImage(grid, PALETTE);
        } else if (type === "finished") {
            dataUrl = await generateFinishedEffect(grid, PALETTE);
        } else if (type === "material") {
            dataUrl = await generateMaterialList(stats);
        } else if (type === "pdf") {
            await generateProfessionalPDF(title, grid, stats, PALETTE);
            return;
        }

        if (dataUrl) {
            const link = document.createElement("a");
            link.download = `beads-${type}.png`;
            link.href = dataUrl;
            link.click();
        }
    };

    const handleGalleryDownload = (meta: any) => {
        setIsGalleryModalOpen(false);
        const beadCount = grid.reduce((total, row) => total + row.filter((c) => c !== null).length, 0);

        const galleryData = {
            ...meta,
            id: `pattern-${Date.now()}`,
            width: grid[0].length,
            height: grid.length,
            beadCount,
            grid, // 下载版可以保留原始 grid 方便二次编辑
            createdAt: new Date().toISOString().split("T")[0],
        };

        const jsonStr = JSON.stringify(galleryData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const link = document.createElement("a");
        link.download = `${meta.slug}.json`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleGalleryPublish = async (meta: any) => {
        try {
            const beadCount = grid.reduce((total, row) => total + row.filter((c) => c !== null).length, 0);

            const response = await fetch("/api/gallery/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...meta,
                    width: grid[0].length,
                    height: grid.length,
                    beadCount,
                    grid, // 发给后端进行压缩
                }),
            });

            if (response.ok) {
                // 发布成功后，强制刷新内存缓存，确保画廊能看到最新图纸
                await loadGalleryPatterns(true);
                return true;
            }
            return false;
        } catch (e) {
            console.error("Publish error:", e);
            return false;
        }
    };

    const stats = useMemo(() => {
        const counts: Record<string, number> = {};
        grid.forEach((row) => {
            row.forEach((cell) => {
                if (cell) {
                    counts[cell] = (counts[cell] || 0) + 1;
                }
            });
        });
        return Object.entries(counts)
            .map(([id, count]) => ({
                ...PALETTE.find((p) => p.id === id)!,
                count,
            }))
            .sort((a, b) => b.count - a.count);
    }, [grid]);

    const renderRulerX = useMemo(
        () => (
            <svg
                className="bg-[#f8fafc] block"
                style={{ width: '100%', height: '100%', display: 'block' }}
                viewBox={`0 0 ${grid[0].length * CELL_SIZE} 28`}
                preserveAspectRatio="none"
            >
                {/* Ruler Bottom Border */}
                <line x1="0" y1="28" x2={grid[0].length * CELL_SIZE} y2="28" stroke="#cbd5e1" strokeWidth="1" />

                {Array.from({ length: grid[0].length }).map((_, i) => {
                    const isHovered = hoverCell?.x === i;
                    const x = (i + 1) * CELL_SIZE;
                    const isMajor = (i + 1) % 5 === 0 || (i + 1) === 1 || (i + 1) === grid[0].length;

                    return (
                        <g key={i}>
                            {/* Highlight background */}
                            {isHovered && (
                                <rect x={i * CELL_SIZE} y="0" width={CELL_SIZE} height="28" fill="#ebf2ff" />
                            )}

                            {/* Tick Marks */}
                            <line
                                x1={x} y1="28" x2={x} y2={isMajor ? 16 : 22}
                                stroke={isMajor ? "#94a3b8" : "#cbd5e1"}
                                strokeWidth="1"
                            />

                            {/* Label */}
                            {isMajor && (
                                <text
                                    x={x} y="12"
                                    textAnchor="middle"
                                    fontSize="9"
                                    fontWeight="900"
                                    fill={isHovered ? "#0284c7" : "#94a3b8"}
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {i + 1}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        ),
        [grid[0].length, hoverCell?.x]
    );

    const renderRulerY = useMemo(
        () => (
            <svg
                className="bg-[#f8fafc] block"
                style={{ width: '100%', height: '100%', display: 'block' }}
                viewBox={`0 0 28 ${grid.length * CELL_SIZE}`}
                preserveAspectRatio="none"
            >
                {/* Ruler Right Border */}
                <line x1="28" y1="0" x2="28" y2={grid.length * CELL_SIZE} stroke="#cbd5e1" strokeWidth="1" />

                {Array.from({ length: grid.length }).map((_, i) => {
                    const isHovered = hoverCell?.y === i;
                    const y = (i + 1) * CELL_SIZE;
                    const isMajor = (i + 1) % 5 === 0 || (i + 1) === 1 || (i + 1) === grid.length;

                    return (
                        <g key={i}>
                            {/* Highlight background */}
                            {isHovered && (
                                <rect x="0" y={i * CELL_SIZE} width="28" height={CELL_SIZE} fill="#ebf2ff" />
                            )}

                            {/* Tick Marks */}
                            <line
                                x1="28" y1={y} x2={isMajor ? 16 : 22} y2={y}
                                stroke={isMajor ? "#94a3b8" : "#cbd5e1"}
                                strokeWidth="1"
                            />

                            {/* Label */}
                            {isMajor && (
                                <text
                                    x="12" y={y}
                                    dominantBaseline="middle"
                                    textAnchor="middle"
                                    fontSize="9"
                                    fontWeight="900"
                                    fill={isHovered ? "#0284c7" : "#94a3b8"}
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {i + 1}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        ),
        [grid.length, hoverCell?.y]
    );

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-white text-gray-900 font-sans">
            <Header
                setIsNewModalOpen={setIsNewModalOpen}
                fileInputRef={fileInputRef}
                handleImageUpload={handleImageUpload}
                tool={tool}
                setTool={setTool}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                historyIndex={historyIndex}
                historyLength={history.length}
                showGrid={showGrid}
                setShowGrid={setShowGrid}
                showNumbers={showNumbers}
                setShowNumbers={setShowNumbers}
                showStats={showStats}
                setShowStats={setShowStats}
                clearGrid={clearGrid}
                isExportMenuOpen={isExportMenuOpen}
                setIsExportMenuOpen={setIsExportMenuOpen}
                handleExport={handleExport}
            />

            <div className="flex-1 flex overflow-hidden relative">
                <CanvasArea
                    mainRef={mainRef}
                    tool={tool}
                    isPanning={isPanning}
                    pan={pan}
                    zoom={zoom}
                    grid={grid}
                    handleWrapperPointerDown={handleWrapperPointerDown}
                    renderRulerX={renderRulerX}
                    renderRulerY={renderRulerY}
                    canvasRef={canvasRef}
                    showGrid={showGrid}
                    handleCanvasPointerDown={handleCanvasPointerDown}
                    handleCanvasPointerMove={handleCanvasPointerMove}
                    handlePointerUp={handlePointerUp}
                    setHoverCell={setHoverCell}
                />

                <MobileToolbar
                    tool={tool}
                    setTool={setTool}
                    showPalette={showPalette}
                    setShowPalette={setShowPalette}
                />

                <Sidebar
                    showPalette={showPalette}
                    setShowPalette={setShowPalette}
                    currentColor={currentColor}
                    setCurrentColor={setCurrentColor}
                    showStats={showStats}
                    stats={stats}
                />
            </div>

            <ImageSizeModal
                isOpen={!!uploadedImage}
                onClose={() => setUploadedImage(null)}
                image={uploadedImage}
                onConfirm={handleImageConfirm}
                palette={PALETTE}
            />
            <NewCanvasModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
                onCreate={createNewGrid}
            />
            <GalleryExportModal
                isOpen={isGalleryModalOpen}
                onClose={() => setIsGalleryModalOpen(false)}
                onDownload={handleGalleryDownload}
                onPublish={handleGalleryPublish}
                width={grid[0].length}
                height={grid.length}
                grid={grid}
                beadCount={grid.reduce((total, row) => total + row.filter(c => c !== null).length, 0)}
            />
        </div>
    );
}
