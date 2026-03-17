'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Pencil, Eraser, PaintBucket, Replace, Pipette, Hand,
  Undo, Redo, Grid3X3, Hash, BarChart2, Download,
  Plus, Upload, ArrowLeft, Image as ImageIcon, Sparkles, FileText, Palette, Globe
} from 'lucide-react';
import {PALETTE} from './palette-data';


type Tool = 'pen' | 'eraser' | 'fill' | 'replace' | 'eyedropper' | 'pan';
type Cell = string | null;
type GridData = Cell[][];

const DEFAULT_WIDTH = 29;
const DEFAULT_HEIGHT = 29;
const CELL_SIZE = 20;

// --- Helpers ---
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function colorDistance(c1: {r: number, g: number, b: number}, c2: {r: number, g: number, b: number}) {
  const rmean = (c1.r + c2.r) / 2;
  const r = c1.r - c2.r;
  const g = c1.g - c2.g;
  const b = c1.b - c2.b;
  return Math.sqrt((2 + rmean / 256) * r * r + 4 * g * g + (2 + (255 - rmean) / 256) * b * b);
}

const colorCache = new Map<string, typeof PALETTE[0]>();

function findClosestColor(r: number, g: number, b: number, palette: typeof PALETTE) {
  const key = `${r},${g},${b}`;
  if (colorCache.has(key)) {
    return colorCache.get(key)!;
  }

  let minDistance = Infinity;
  let closestColor = palette[0];
  for (const p of palette) {
    const pRgb = hexToRgb(p.color);
    if (!pRgb) continue;
    const distance = colorDistance({r, g, b}, pRgb);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = p;
    }
  }
  
  colorCache.set(key, closestColor);
  return closestColor;
}

function floodFill(grid: GridData, startX: number, startY: number, targetColorId: string | null, replacementColorId: string | null): GridData {
  if (targetColorId === replacementColorId) return grid;
  if (startX < 0 || startX >= grid[0].length || startY < 0 || startY >= grid.length) return grid;
  if (grid[startY][startX] !== targetColorId) return grid;

  const newGrid = grid.map(row => [...row]);
  const queue = [{ x: startX, y: startY }];
  newGrid[startY][startX] = replacementColorId;

  while (queue.length > 0) {
    const { x: cx, y: cy } = queue.shift()!;
    const neighbors = [{ x: cx + 1, y: cy }, { x: cx - 1, y: cy }, { x: cx, y: cy + 1 }, { x: cx, y: cy - 1 }];

    for (const n of neighbors) {
      if (n.x >= 0 && n.x < newGrid[0].length && n.y >= 0 && n.y < newGrid.length) {
        if (newGrid[n.y][n.x] === targetColorId) {
          newGrid[n.y][n.x] = replacementColorId;
          queue.push(n);
        }
      }
    }
  }
  return newGrid;
}

// --- Components ---
const ToolButton = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all active:scale-95 ${
      active 
        ? 'bg-white text-blue-600 shadow-sm font-semibold ring-1 ring-black/5' 
        : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 active:bg-gray-200'
    }`}
  >
    <Icon size={16} />
    <span>{label}</span>
  </button>
);

const IconButton = ({ icon: Icon, active, onClick, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-md transition-all active:scale-95 ${
      active 
        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
        : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 active:bg-gray-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''}`}
  >
    <Icon size={18} />
  </button>
);

const PRESETS = [
  { name: 'Standard (29×29)', width: 29, height: 29 },
  { name: 'Mini (28×28)', width: 28, height: 28 },
  { name: 'Super Pegboard (49×49)', width: 49, height: 49 },
  { name: 'Custom', width: 0, height: 0 },
];

const ImageSizeModal = ({ isOpen, onClose, image, onConfirm }: any) => {
  const [width, setWidth] = useState(100);
  const [previewGrid, setPreviewGrid] = useState<GridData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const height = Math.round((image?.height / image?.width) * width) || 100;

  useEffect(() => {
    if (!image || !isOpen) return;

    if (isProcessing) return;

    const timer = setTimeout(() => {
      setIsProcessing(true);

      requestAnimationFrame(() => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const newGrid: GridData = Array(height).fill(null).map(() => Array(width).fill(null));

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            if (a > 128) {
              const closest = findClosestColor(r, g, b, PALETTE);
              newGrid[y][x] = closest.id;
            }
          }
        }

        setPreviewGrid(newGrid);
        setIsProcessing(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [width, height, image, isOpen]);

  useEffect(() => {
    if (!previewGrid || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colorMap = new Map(PALETTE.map(p => [p.id, p.color]));
    const maxSize = 400;
    const scale = Math.min(1, maxSize / Math.max(width * CELL_SIZE, height * CELL_SIZE));
    const cellSize = Math.max(CELL_SIZE * scale, 2);

    canvas.width = width * cellSize;
    canvas.height = height * cellSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    previewGrid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const color = colorMap.get(cell);
          if (color) {
            const cx = x * cellSize + cellSize / 2;
            const cy = y * cellSize + cellSize / 2;
            const outerRadius = Math.max(cellSize / 2 - 1, 0.5);

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
    });
  }, [previewGrid, width, height]);

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-4 md:p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">选择拼豆尺寸</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
              {isProcessing ? (
                <div className="text-gray-500">处理中...</div>
              ) : (
                <canvas ref={previewCanvasRef} className="max-w-full" />
              )}
            </div>
          </div>

          <div className="lg:w-80 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                宽度（颗）: {width} px
              </label>
              <input
                type="range"
                min="20"
                max="200"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>20</span>
                <span>200</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                高度（颗）: <span className="font-semibold">{height} 颗（自动）</span>
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
              <p className="font-medium mb-1">提示：</p>
              <p>调整尺寸时保持宽高比，宽度下一步将被颗粒化使用。</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                取消
              </button>
              <button
                onClick={() => previewGrid && onConfirm(width, height, previewGrid)}
                disabled={!previewGrid}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewCanvasModal = ({ isOpen, onClose, onCreate }: any) => {
  const [presetIndex, setPresetIndex] = useState(0);
  const [boardsX, setBoardsX] = useState(1);
  const [boardsY, setBoardsY] = useState(1);
  const [customWidth, setCustomWidth] = useState(29);
  const [customHeight, setCustomHeight] = useState(29);

  if (!isOpen) return null;

  const handleCreate = () => {
    let w, h;
    if (PRESETS[presetIndex].name === 'Custom') {
      w = customWidth;
      h = customHeight;
    } else {
      w = PRESETS[presetIndex].width * boardsX;
      h = PRESETS[presetIndex].height * boardsY;
    }
    onCreate(w, h);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">新建拼豆板</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">拼豆板预设</label>
            <select 
              value={presetIndex} 
              onChange={(e) => setPresetIndex(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {PRESETS.map((p, i) => (
                <option key={i} value={i}>{p.name}</option>
              ))}
            </select>
          </div>

          {PRESETS[presetIndex].name === 'Custom' ? (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">宽度 (珠子数)</label>
                <input 
                  type="number" 
                  min="1" max="200"
                  value={customWidth} 
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">高度 (珠子数)</label>
                <input 
                  type="number" 
                  min="1" max="200"
                  value={customHeight} 
                  onChange={(e) => setCustomHeight(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">横向拼接板数</label>
                <select 
                  value={boardsX} 
                  onChange={(e) => setBoardsX(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">纵向拼接板数</label>
                <select 
                  value={boardsY} 
                  onChange={(e) => setBoardsY(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md">
            取消
          </button>
          <button onClick={handleCreate} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            创建
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const [grid, setGrid] = useState<GridData>(() =>
    Array(DEFAULT_HEIGHT).fill(null).map(() => Array(DEFAULT_WIDTH).fill(null))
  );
  const [history, setHistory] = useState<GridData[]>([grid]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [tool, setTool] = useState<Tool>('pen');
  const [currentColor, setCurrentColor] = useState<string | null>(null);
  
  const [showGrid, setShowGrid] = useState(true);
  const [showNumbers, setShowNumbers] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [hoverCell, setHoverCell] = useState<{ x: number, y: number } | null>(null);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [imageWidth, setImageWidth] = useState(100);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'fr', name: 'Français' },
  ];

  const switchLanguage = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
    setShowLangMenu(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const cacheKeyRef = useRef<string>('');
  const gridRef = useRef(grid);
  const historyRef = useRef(history);
  const historyIndexRef = useRef(historyIndex);

  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { historyIndexRef.current = historyIndex; }, [historyIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colorMap = new Map(PALETTE.map(p => [p.id, p.color]));
    const cacheKey = `${grid[0].length}x${grid.length}-${JSON.stringify(grid)}-${showNumbers}`;

    const renderCanvas = () => {
      // 使用离屏缓存
      if (cacheKey !== cacheKeyRef.current) {
        // 确保离屏 canvas 尺寸正确，如果尺寸改变则重新创建
        if (!offscreenRef.current ||
            offscreenRef.current.width !== canvas.width ||
            offscreenRef.current.height !== canvas.height) {
          offscreenRef.current = document.createElement('canvas');
          offscreenRef.current.width = canvas.width;
          offscreenRef.current.height = canvas.height;
          console.log('重新创建离屏canvas:', canvas.width, 'x', canvas.height);
        }
        const offCtx = offscreenRef.current.getContext('2d');
        if (!offCtx) return;

        offCtx.clearRect(0, 0, canvas.width, canvas.height);

        const totalCells = grid.length * grid[0].length;
        const useSimpleRender = totalCells > 5000;

        // 绘制拼豆到离屏 Canvas
        grid.forEach((row, y) => {
          row.forEach((cell, x) => {
            if (cell) {
              const color = colorMap.get(cell);
              if (color) {
                const cx = x * CELL_SIZE + CELL_SIZE / 2;
                const cy = y * CELL_SIZE + CELL_SIZE / 2;
                const outerRadius = CELL_SIZE / 2 - 1.5;
                const innerRadius = CELL_SIZE / 5;

                if (useSimpleRender) {
                  offCtx.fillStyle = color;
                  offCtx.beginPath();
                  offCtx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
                  offCtx.arc(cx, cy, innerRadius, 0, Math.PI * 2, true);
                  offCtx.fill();

                  if (showNumbers) {
                    offCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    offCtx.font = 'bold 7px sans-serif';
                    offCtx.textAlign = 'center';
                    offCtx.textBaseline = 'middle';
                    offCtx.fillText(cell, cx, cy);
                  }
                } else {
                  offCtx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                  offCtx.shadowBlur = 2;
                  offCtx.shadowOffsetX = 1;
                  offCtx.shadowOffsetY = 1;

                  offCtx.fillStyle = color;
                  offCtx.beginPath();
                  offCtx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
                  offCtx.arc(cx, cy, innerRadius, 0, Math.PI * 2, true);
                  offCtx.fill();

                  offCtx.shadowColor = 'transparent';
                  offCtx.shadowBlur = 0;

                  const highlightGradient = offCtx.createRadialGradient(
                    cx - outerRadius * 0.3, cy - outerRadius * 0.3, 0,
                    cx - outerRadius * 0.3, cy - outerRadius * 0.3, outerRadius * 0.6
                  );
                  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
                  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                  offCtx.fillStyle = highlightGradient;
                  offCtx.beginPath();
                  offCtx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
                  offCtx.arc(cx, cy, innerRadius, 0, Math.PI * 2, true);
                  offCtx.fill();

                  offCtx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
                  offCtx.lineWidth = 1.5;
                  offCtx.beginPath();
                  offCtx.arc(cx, cy, outerRadius, Math.PI * 0.2, Math.PI * 0.8);
                  offCtx.stroke();

                  const holeGradient = offCtx.createRadialGradient(
                    cx, cy, innerRadius * 0.5,
                    cx, cy, innerRadius
                  );
                  holeGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
                  holeGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');

                  offCtx.fillStyle = holeGradient;
                  offCtx.beginPath();
                  offCtx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
                  offCtx.fill();

                  offCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                  offCtx.lineWidth = 0.5;
                  offCtx.beginPath();
                  offCtx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
                  offCtx.stroke();

                  if (showNumbers) {
                    offCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    offCtx.font = 'bold 7px sans-serif';
                    offCtx.textAlign = 'center';
                    offCtx.textBaseline = 'middle';
                    offCtx.fillText(cell, cx, cy);
                  }
                }
              }
            }
          });
        });
        cacheKeyRef.current = cacheKey;
      }

      // 清空主 Canvas 并复制离屏 Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (offscreenRef.current) {
        ctx.drawImage(offscreenRef.current, 0, 0);
      }

      if (hoverCell && tool !== 'pan') {
        if (tool === 'pen' || tool === 'fill' || tool === 'replace') {
          ctx.strokeStyle = '#0ea5e9';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            hoverCell.x * CELL_SIZE,
            hoverCell.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
          );
        } else if (tool === 'eraser') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
          ctx.fillRect(hoverCell.x * CELL_SIZE, hoverCell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else {
          ctx.strokeStyle = '#0ea5e9';
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
  }, [grid, showNumbers, hoverCell, tool]);

  const pushHistory = useCallback((newGrid: GridData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndexRef.current + 1);
      newHistory.push(newGrid);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 50));
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
    const newGrid = Array(height).fill(null).map(() => Array(width).fill(null));
    setGrid(newGrid);
    setHistory([newGrid]);
    setHistoryIndex(0);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const clearGrid = () => {
    const newGrid = Array(grid.length).fill(null).map(() => Array(grid[0].length).fill(null));
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

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === 'pan' || e.button === 1) {
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

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
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
    if (tool === 'pan' || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCellAction = useCallback((x: number, y: number) => {
    if (tool === 'pan') return;

    setGrid(prevGrid => {
      if (tool === 'pen') {
        if (!currentColor || prevGrid[y][x] === currentColor) return prevGrid;
        const newGrid = [...prevGrid];
        newGrid[y] = [...newGrid[y]];
        newGrid[y][x] = currentColor;
        return newGrid;
      } else if (tool === 'eraser') {
        if (prevGrid[y][x] === null) return prevGrid;
        const newGrid = [...prevGrid];
        newGrid[y] = [...newGrid[y]];
        newGrid[y][x] = null;
        return newGrid;
      } else if (tool === 'fill') {
        if (!currentColor) return prevGrid;
        const targetColor = prevGrid[y][x];
        if (targetColor === currentColor) return prevGrid;
        return floodFill(prevGrid, x, y, targetColor, currentColor);
      } else if (tool === 'replace') {
        if (!currentColor) return prevGrid;
        const targetColor = prevGrid[y][x];
        if (targetColor === currentColor || targetColor === null) return prevGrid;
        const newGrid = prevGrid.map(row => [...row]);
        for (let r = 0; r < newGrid.length; r++) {
          for (let c = 0; c < newGrid[0].length; c++) {
            if (newGrid[r][c] === targetColor) {
              newGrid[r][c] = currentColor;
            }
          }
        }
        return newGrid;
      } else if (tool === 'eyedropper') {
        const color = prevGrid[y][x];
        if (color) {
          setCurrentColor(color);
          setTool('pen');
        }
        return prevGrid;
      }
      return prevGrid;
    });
  }, [tool, currentColor]);

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
        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleGlobalPointerUp = () => {
      setIsPanning(false);
      if (isDrawing) {
        handlePointerUp();
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isPanning, isDrawing, lastMousePos]);

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(z => Math.max(0.1, Math.min(10, z * zoomFactor)));
    };

    mainEl.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => mainEl.removeEventListener('wheel', handleWheelNative);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        const defaultWidth = Math.min(100, Math.max(29, Math.round(img.width / 10)));
        setImageWidth(defaultWidth);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageConfirm = (width: number, height: number, previewGrid: GridData) => {
    setUploadedImage(null);

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
      const autoZoom = Math.min(0.9, viewportWidth / canvasWidth, viewportHeight / canvasHeight);
      setZoom(autoZoom);
    }, 100);
  };

  const handleExport = (type: 'pattern' | 'finished' | 'material' | 'pdf') => {
    setIsExportMenuOpen(false);
    
    if (type === 'pdf') {
      window.print();
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (type === 'material') {
      canvas.width = 600;
      canvas.height = Math.max(400, stats.length * 50 + 150);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Header
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('Perler Beads Material List', 40, 60);
      
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px sans-serif';
      ctx.fillText('1 bag ≈ 1000 beads', 40, 90);

      // Table Header
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('COLOR', 100, 140);
      ctx.fillText('CODE', 300, 140);
      ctx.fillText('COUNT', 400, 140);
      ctx.fillText('BAGS', 500, 140);
      
      ctx.strokeStyle = '#e5e7eb';
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
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Color Name
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(stat.name, 100, y);
        
        // Color Code
        ctx.fillStyle = '#4b5563';
        ctx.font = '16px monospace';
        ctx.fillText(`#${stat.code}`, 300, y);
        
        // Count
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`${stat.count} pcs`, 400, y);
        
        // Bags
        const bags = Math.ceil(stat.count / 1000);
        ctx.fillStyle = '#2563eb'; // Blue color for bags to highlight purchasing
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`${bags} bag${bags > 1 ? 's' : ''}`, 500, y);

        // Separator line
        ctx.strokeStyle = '#f3f4f6';
        ctx.beginPath();
        ctx.moveTo(40, y + 25);
        ctx.lineTo(560, y + 25);
        ctx.stroke();
      });
    } else {
      canvas.width = grid[0].length * CELL_SIZE;
      canvas.height = grid.length * CELL_SIZE;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (type === 'pattern') {
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let x = 0; x <= canvas.width; x += CELL_SIZE) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += CELL_SIZE) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
      }

      grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const colorObj = PALETTE.find(p => p.id === cell);
            if (colorObj) {
              const cx = x * CELL_SIZE + CELL_SIZE / 2;
              const cy = y * CELL_SIZE + CELL_SIZE / 2;

              if (type === 'finished') {
                const outerRadius = CELL_SIZE / 2 - 1;
                const innerRadius = CELL_SIZE / 4;

                // Draw the bead body
                ctx.fillStyle = colorObj.color;
                ctx.beginPath();
                ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
                ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2, true);
                ctx.fill();

                // Highlight
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(cx - 1, cy - 1, outerRadius - 1.5, Math.PI, Math.PI * 1.5);
                ctx.stroke();

                // Shadow
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
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

                ctx.fillStyle = 'black';
                ctx.font = '8px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(cell, cx, cy);
              }
            }
          }
        });
      });
    }

    const link = document.createElement('a');
    link.download = `beads-${type}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell) {
          counts[cell] = (counts[cell] || 0) + 1;
        }
      });
    });
    return Object.entries(counts)
      .map(([id, count]) => ({
        ...PALETTE.find(p => p.id === id)!,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }, [grid]);

  const renderRulerX = useMemo(() => (
    <div className="flex" style={{ marginLeft: '24px' }}>
      {Array.from({ length: grid[0].length }).map((_, i) => (
        <div key={i} className="flex-shrink-0 flex items-end justify-center text-[10px] text-gray-400 border-b border-gray-200" style={{ width: CELL_SIZE, height: '24px' }}>
          {(i + 1) % 5 === 0 || i === 0 || i === grid[0].length - 1 ? i + 1 : ''}
        </div>
      ))}
    </div>
  ), [grid[0].length]);

  const renderRulerY = useMemo(() => (
    <div className="flex flex-col" style={{ width: '24px', marginTop: '24px' }}>
      {Array.from({ length: grid.length }).map((_, i) => (
        <div key={i} className="flex-shrink-0 flex items-center justify-end pr-1 text-[10px] text-gray-400 border-r border-gray-200" style={{ height: CELL_SIZE }}>
          {(i + 1) % 5 === 0 || i === 0 || i === grid.length - 1 ? i + 1 : ''}
        </div>
      ))}
    </div>
  ), [grid.length]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-white text-gray-900 font-sans">
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-2 md:px-4 shrink-0 shadow-sm relative z-50">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setIsNewModalOpen(true)} className="flex items-center gap-1 px-2 md:px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all">
            <Plus size={16} />
            <span className="hidden sm:inline">New</span>
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 px-2 md:px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all">
            <Upload size={16} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
          <ToolButton icon={Pencil} label="Pen" active={tool === 'pen'} onClick={() => setTool('pen')} />
          <ToolButton icon={Eraser} label="Eraser" active={tool === 'eraser'} onClick={() => setTool('eraser')} />
          <ToolButton icon={PaintBucket} label="Fill" active={tool === 'fill'} onClick={() => setTool('fill')} />
          <ToolButton icon={Replace} label="Replace" active={tool === 'replace'} onClick={() => setTool('replace')} />
          <ToolButton icon={Pipette} label="Eyedropper" active={tool === 'eyedropper'} onClick={() => setTool('eyedropper')} />
          <ToolButton icon={Hand} label="Pan" active={tool === 'pan'} onClick={() => setTool('pan')} />
        </div>

        <div className="flex items-center gap-1 md:gap-4">
          <div className="flex items-center gap-1">
            <IconButton icon={Undo} onClick={handleUndo} disabled={historyIndex === 0} />
            <IconButton icon={Redo} onClick={handleRedo} disabled={historyIndex === history.length - 1} />
          </div>
          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
          <div className="flex items-center gap-1 hidden md:flex">
            <IconButton icon={Grid3X3} active={showGrid} onClick={() => setShowGrid(!showGrid)} />
            <IconButton icon={Hash} active={showNumbers} onClick={() => setShowNumbers(!showNumbers)} />
            <IconButton icon={BarChart2} active={showStats} onClick={() => setShowStats(!showStats)} />
          </div>
          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
          <div className="flex items-center gap-1 md:gap-2 relative">
            <button onClick={clearGrid} className="px-2 md:px-4 py-1.5 text-red-500 border border-red-200 rounded-md text-sm font-medium hover:bg-red-50 active:bg-red-100 active:scale-95 transition-all hidden md:block">
              Clear
            </button>
            <button onClick={() => setIsExportMenuOpen(!isExportMenuOpen)} className="flex items-center gap-1 px-2 md:px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 active:bg-blue-700 active:scale-95 transition-all">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>

            {isExportMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <button
                  onClick={() => handleExport('pattern')}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-lg shrink-0">
                    <ImageIcon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">图案图片</div>
                    <div className="text-xs text-gray-500 mt-0.5">包含网格和色号</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('finished')}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">成品效果图</div>
                    <div className="text-xs text-gray-500 mt-0.5">模拟熨烫完成后的效果</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('material')}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg shrink-0">
                    <BarChart2 size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">材料清单</div>
                    <div className="text-xs text-gray-500 mt-0.5">颜色统计和符号</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100 mt-1 pt-3"
                >
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-lg shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">导出 PDF</div>
                    <div className="text-xs text-gray-500 mt-0.5">可打印的小册子</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <main
          ref={mainRef}
          className={`flex-1 overflow-hidden bg-[#f4f5f7] relative ${
            tool === 'pan' ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
          }`}
          style={{ touchAction: 'none' }}
        >
          <div 
            className="absolute top-1/2 left-1/2 origin-center"
            style={{
              transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
              willChange: 'transform'
            }}
          >
            <div 
              className="relative bg-white shadow-sm border border-gray-200"
              style={{
                width: grid[0].length * CELL_SIZE + 24,
                height: grid.length * CELL_SIZE + 24,
              }}
              onPointerDown={handleWrapperPointerDown}
            >
              <div className="absolute top-0 left-0 w-full h-6 bg-gray-50 flex pointer-events-none">
                <div className="w-6 h-6 border-r border-b border-gray-200 bg-gray-50"></div>
                {renderRulerX}
              </div>
              <div className="absolute top-0 left-0 w-6 h-full bg-gray-50 flex flex-col pt-6 pointer-events-none">
                {renderRulerY}
              </div>
              
              <canvas
                ref={canvasRef}
                className={`absolute top-6 left-6 touch-none ${
                  tool === 'pan' 
                    ? isPanning ? 'cursor-grabbing' : 'cursor-grab' 
                    : tool === 'eyedropper' ? 'cursor-crosshair' 
                    : 'cursor-none'
                }`}
                width={grid[0].length * CELL_SIZE}
                height={grid.length * CELL_SIZE}
                style={{
                  width: grid[0].length * CELL_SIZE,
                  height: grid.length * CELL_SIZE,
                  backgroundImage: showGrid ? `
                    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                  ` : 'none',
                  backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
                }}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={() => {
                  handlePointerUp();
                  setHoverCell(null);
                }}
              />
            </div>
          </div>
        </main>

        {/* Mobile Toolbar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-50 flex items-center justify-around">
          <IconButton icon={Pencil} active={tool === 'pen'} onClick={() => setTool('pen')} />
          <IconButton icon={Eraser} active={tool === 'eraser'} onClick={() => setTool('eraser')} />
          <IconButton icon={PaintBucket} active={tool === 'fill'} onClick={() => setTool('fill')} />
          <IconButton icon={Replace} active={tool === 'replace'} onClick={() => setTool('replace')} />
          <IconButton icon={Pipette} active={tool === 'eyedropper'} onClick={() => setTool('eyedropper')} />
          <IconButton icon={Hand} active={tool === 'pan'} onClick={() => setTool('pan')} />
          <IconButton icon={Palette} active={showPalette} onClick={() => setShowPalette(!showPalette)} />
        </div>

        <aside className={`${showPalette ? 'fixed' : 'hidden'} lg:relative lg:flex w-full lg:w-80 bg-white border-l border-gray-200 flex-col h-full shrink-0 z-40 inset-0 top-14 lg:top-0`}>
          <button
            onClick={() => setShowPalette(false)}
            className="lg:hidden absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
          <div className="p-4 border-b border-gray-200">
            <select className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500">
              <option>Mard Beads</option>
              <option>Perler Beads</option>
              <option>Hama Beads</option>
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">调色板 (MARD)</h3>
              <span className="text-xs text-gray-400">{PALETTE.length}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {PALETTE.map(p => (
                <button
                  key={p.id}
                  onClick={() => setCurrentColor(p.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div 
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      currentColor === p.id 
                        ? 'border-blue-500 scale-110 shadow-md ring-2 ring-blue-500/20' 
                        : 'border-transparent shadow-sm hover:scale-110 hover:border-gray-300 hover:shadow-md'
                    }`}
                    style={{ backgroundColor: p.color }}
                  >
                    <div className="w-full h-full rounded-full border-[6px] border-white/20 mix-blend-overlay"></div>
                  </div>
                  <span className="text-[10px] text-gray-500 group-hover:text-gray-900">#{p.code}</span>
                </button>
              ))}
            </div>
          </div>

          {(showStats || stats.length > 0) && (
            <div className="h-1/3 border-t border-gray-200 p-4 overflow-y-auto bg-gray-50">
              <h3 className="text-sm font-medium text-gray-500 mb-4">库存 ({stats.length})</h3>
              {stats.length === 0 ? (
                <div className="text-center text-sm text-gray-400 mt-10">
                  Start drawing to generate the list
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.map(s => (
                    <div key={s.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: s.color }}></div>
                        <span className="text-gray-700">#{s.code} {s.name}</span>
                      </div>
                      <span className="text-gray-500">{s.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
      <ImageSizeModal
        isOpen={!!uploadedImage}
        onClose={() => setUploadedImage(null)}
        image={uploadedImage}
        onConfirm={handleImageConfirm}
      />
      <NewCanvasModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
        onCreate={createNewGrid} 
      />
    </div>
  );
}
