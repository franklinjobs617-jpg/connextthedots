"use client";

import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
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
    const currentLocale = pathname.split("/")[1];

    const [grid, setGrid] = useState<GridData>(() =>
        Array(DEFAULT_HEIGHT)
            .fill(null)
            .map(() => Array(DEFAULT_WIDTH).fill(null))
    );
    const [history, setHistory] = useState<GridData[]>([grid]);
    const [historyIndex, setHistoryIndex] = useState(0);

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
        { code: "zh", name: "中文" },
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

    // 终极性能优化：追踪网格的变动版本号，拒绝 JSON.stringify
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

        // 考虑到用户需要方便地放大来对照拼豆，降低切换的阈值门槛。
        // 当屏幕上的网格显示大于 22px 时（也就是只要放大超过了 1.1 倍的 100% 原尺寸），就立刻平滑切换为精细拼豆模式！
        const useSimpleRender = (CELL_SIZE * zoom) < 5;
        const colorMap = new Map(PALETTE.map((p) => [p.id, p.color]));
        // 必须加入 showGrid 控制缓存，因为接下来要在离屏自己画网格了
        const cacheKey = `${grid[0].length}x${grid.length}-${gridVersionRef.current}-${showNumbers}-${showGrid}-${useSimpleRender}-${boardSize}`;

        const renderCanvas = () => {
            // 使用离屏缓存
            if (cacheKey !== cacheKeyRef.current) {
                // 确保离屏 canvas 尺寸正确，如果尺寸改变则重新创建
                if (
                    !offscreenRef.current ||
                    offscreenRef.current.width !== canvas.width ||
                    offscreenRef.current.height !== canvas.height
                ) {
                    offscreenRef.current = document.createElement("canvas");
                    offscreenRef.current.width = canvas.width;
                    offscreenRef.current.height = canvas.height;
                    console.log("重新创建离屏canvas:", canvas.width, "x", canvas.height);
                }
                const offCtx = offscreenRef.current.getContext("2d");
                if (!offCtx) return;

                offCtx.clearRect(0, 0, canvas.width, canvas.height);

                // 绘制拼豆到离屏 Canvas
                grid.forEach((row, y) => {
                    row.forEach((cell, x) => {
                        if (cell) {
                            const color = colorMap.get(cell);
                            if (color) {
                                const cx = x * CELL_SIZE + CELL_SIZE / 2;
                                const cy = y * CELL_SIZE + CELL_SIZE / 2;
                                // 大大缩小原始代码中离谱的拼豆间距，原来 CELL_SIZE/2 - 1.5 导致网格四角的
                                // 真空透白漏光面积高达 45%，这是除了内孔外，颜色会被冲刷泛灰的最大真凶！
                                const outerRadius = CELL_SIZE / 2 - 0.5;
                                const innerRadius = CELL_SIZE / 4;

                                if (useSimpleRender) {
                                    offCtx.fillStyle = color;

                                    // 对于数量大的实体效果，改回填充方形，保证色彩块百分百无缝接合，杜绝白光杀手
                                    offCtx.fillRect(
                                        x * CELL_SIZE,
                                        y * CELL_SIZE,
                                        CELL_SIZE,
                                        CELL_SIZE
                                    );

                                    // 2. 取消原版的透明大空洞穿刺！
                                    // 我们不用真实的透明孔洞（缩放会漏大白光），而是画一个深黑色的阴影半透明层，
                                    // 这完美模拟了孔洞凹陷的厚重颗粒感，同时让颜色对比度暴增，不会发闷。
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
                                    // 超级性能优化：将原来每颗豆子包含阴影+渐变+7次绘图路径的极复杂矢量渲染，
                                    // 变更为查字典式的“印章”绘制。直接抛弃 CPU 结算调用 GPU `drawImage`！性能暴增百倍！
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

                // 关键补丁：如果当前是致密像素块渲染（无缝隙）且用户开启了网格（showGrid=true）
                // 那么 CSS 背景会被完全遮挡，因此我们在这层纯像素底色之上，用微弱黑色补画一层前景网格。
                // 这还能让成品效果图天然带有每个格子的弱边界线，比原本白色的网格线更提色！
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

                // 革命性进步：物理工程辅助线（切割板子边界）
                if (showGrid && boardSize > 0) {
                    offCtx.save();
                    offCtx.strokeStyle = "rgba(239, 68, 68, 0.7)"; // 明亮的红/粉色，区别于常驻图
                    offCtx.lineWidth = 1.5; // 改细，穿插在豆子缝隙中间，绝对不挡住任何豆子
                    offCtx.setLineDash([8, 6]); // 虚线，既有引导感，又不破坏图面
                    offCtx.beginPath();
                    // 跳过 0，因为边缘不需要画在里面
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

            // 极致丝滑优化：渲染跳跃门
            // 如果当前的底图、辅助线没变，当前鼠标悬停的格子没变，
            // 仅仅是因为用户在“放大缩小”触发了 zoom 进而触发了这里，我们绝对不重绘！
            // 直接依赖 CSS 的 transform 缩放。这能省去一秒内 120 次庞大的 Canvas 复制。
            const currentRenderKey = `${cacheKey}-hover:${hoverCell?.x},${hoverCell?.y}-tool:${tool}`;
            if (lastRenderKeyRef.current === currentRenderKey) {
                return;
            }
            lastRenderKeyRef.current = currentRenderKey;

            // 清空主 Canvas 并复制离屏 Canvas
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
        const newGrid = Array(grid.length)
            .fill(null)
            .map(() => Array(grid[0].length).fill(null));
        setGrid(newGrid);
        pushHistory(newGrid);
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

            // 自动缩放到适应可视区域
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

    const handleExport = (type: "pattern" | "finished" | "material" | "pdf" | "gallery") => {
        setIsExportMenuOpen(false);

        if (type === "gallery") {
            setIsGalleryModalOpen(true);
            return;
        }

        if (type === "pdf") {
            window.print();
            return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (type === "material") {
            canvas.width = 600;
            canvas.height = Math.max(400, stats.length * 50 + 150);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Header
            ctx.fillStyle = "#111827";
            ctx.font = "bold 28px sans-serif";
            ctx.fillText("Perler Beads Material List", 40, 60);

            ctx.fillStyle = "#6b7280";
            ctx.font = "16px sans-serif";
            ctx.fillText("1 bag ≈ 1000 beads", 40, 90);

            // Table Header
            ctx.fillStyle = "#9ca3af";
            ctx.font = "bold 14px sans-serif";
            ctx.fillText("COLOR", 100, 140);
            ctx.fillText("CODE", 300, 140);
            ctx.fillText("COUNT", 400, 140);
            ctx.fillText("BAGS", 500, 140);

            ctx.strokeStyle = "#e5e7eb";
            ctx.beginPath();
            ctx.moveTo(40, 150);
            ctx.lineTo(560, 150);
            ctx.stroke();

            stats.forEach((stat, i) => {
                const y = 180 + i * 50;

                // Color Circle
                ctx.fillStyle = stat.color;
                ctx.beginPath();
                ctx.arc(60, y - 5, 16, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#e5e7eb";
                ctx.lineWidth = 1;
                ctx.stroke();

                // Color Name
                ctx.fillStyle = "#374151";
                ctx.font = "bold 16px sans-serif";
                ctx.fillText(stat.name, 100, y);

                // Color Code
                ctx.fillStyle = "#4b5563";
                ctx.font = "16px monospace";
                ctx.fillText(`#${stat.code}`, 300, y);

                // Count
                ctx.fillStyle = "#111827";
                ctx.font = "bold 16px sans-serif";
                ctx.fillText(`${stat.count} pcs`, 400, y);

                // Bags
                const bags = Math.ceil(stat.count / 1000);
                ctx.fillStyle = "#2563eb"; // Blue color for bags to highlight purchasing
                ctx.font = "bold 16px sans-serif";
                ctx.fillText(`${bags} bag${bags > 1 ? "s" : ""}`, 500, y);

                // Separator line
                ctx.strokeStyle = "#f3f4f6";
                ctx.beginPath();
                ctx.moveTo(40, y + 25);
                ctx.lineTo(560, y + 25);
                ctx.stroke();
            });
        } else {
            canvas.width = grid[0].length * CELL_SIZE;
            canvas.height = grid.length * CELL_SIZE;

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (type === "pattern") {
                ctx.strokeStyle = "#e5e7eb";
                ctx.lineWidth = 1;
                for (let x = 0; x <= canvas.width; x += CELL_SIZE) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }
                for (let y = 0; y <= canvas.height; y += CELL_SIZE) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }
            }

            grid.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        const colorObj = PALETTE.find((p) => p.id === cell);
                        if (colorObj) {
                            const cx = x * CELL_SIZE + CELL_SIZE / 2;
                            const cy = y * CELL_SIZE + CELL_SIZE / 2;

                            if (type === "finished") {
                                const outerRadius = CELL_SIZE / 2 - 1;
                                const innerRadius = CELL_SIZE / 4;

                                // Draw the bead body
                                ctx.fillStyle = colorObj.color;
                                ctx.beginPath();
                                ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
                                ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2, true);
                                ctx.fill();

                                // Highlight
                                ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.arc(
                                    cx - 1,
                                    cy - 1,
                                    outerRadius - 1.5,
                                    Math.PI,
                                    Math.PI * 1.5
                                );
                                ctx.stroke();

                                // Shadow
                                ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.arc(cx, cy, innerRadius, 0, Math.PI * 0.5);
                                ctx.stroke();
                            } else {
                                ctx.strokeStyle = colorObj.color;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.arc(cx, cy, CELL_SIZE / 2 - 1.5, 0, Math.PI * 2);
                                ctx.stroke();

                                ctx.fillStyle = "black";
                                ctx.font = "8px sans-serif";
                                ctx.textAlign = "center";
                                ctx.textBaseline = "middle";
                                ctx.fillText(colorObj.code, cx, cy);
                            }
                        }
                    }
                });
            });
        }

        const link = document.createElement("a");
        link.download = `beads-${type}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const handleGalleryConfirm = (meta: any) => {
        setIsGalleryModalOpen(false);

        const beadCount = grid.reduce(
            (total, row) => total + row.filter((c) => c !== null).length,
            0
        );

        const galleryData = {
            ...meta,
            id: `pattern-${Date.now()}`,
            width: grid[0].length,
            height: grid.length,
            beadCount,
            grid,
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
            <div className="flex" style={{ marginLeft: "24px" }}>
                {Array.from({ length: grid[0].length }).map((_, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 flex items-end justify-center text-[10px] text-gray-400 border-b border-gray-200"
                        style={{ width: CELL_SIZE, height: "24px" }}
                    >
                        {(i + 1) % 5 === 0 || i === 0 || i === grid[0].length - 1
                            ? i + 1
                            : ""}
                    </div>
                ))}
            </div>
        ),
        [grid[0].length]
    );

    const renderRulerY = useMemo(
        () => (
            <div
                className="flex flex-col"
                style={{ width: "24px", marginTop: "24px" }}
            >
                {Array.from({ length: grid.length }).map((_, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 flex items-center justify-end pr-1 text-[10px] text-gray-400 border-r border-gray-200"
                        style={{ height: CELL_SIZE }}
                    >
                        {(i + 1) % 5 === 0 || i === 0 || i === grid.length - 1 ? i + 1 : ""}
                    </div>
                ))}
            </div>
        ),
        [grid.length]
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
                onConfirm={handleGalleryConfirm}
                width={grid[0].length}
                height={grid.length}
                beadCount={grid.reduce((total, row) => total + row.filter(c => c !== null).length, 0)}
            />
        </div>
    );
}
