import React from "react";
import {
  Plus, Upload, Pencil, Eraser, PaintBucket, Replace, Pipette, Hand, Undo, Redo,
  Grid3X3, Hash, BarChart2, Download, Image as ImageIcon, Sparkles, FileText
} from "lucide-react";
import { ToolButton, IconButton } from "./Buttons";

interface HeaderProps {
  setIsNewModalOpen: (val: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tool: string;
  setTool: (tool: any) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  historyIndex: number;
  historyLength: number;
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  showNumbers: boolean;
  setShowNumbers: (val: boolean) => void;
  showStats: boolean;
  setShowStats: (val: boolean) => void;
  clearGrid: () => void;
  isExportMenuOpen: boolean;
  setIsExportMenuOpen: (val: boolean) => void;
  handleExport: (type: any) => void;
}

export const Header = ({
  setIsNewModalOpen,
  fileInputRef,
  handleImageUpload,
  tool,
  setTool,
  handleUndo,
  handleRedo,
  historyIndex,
  historyLength,
  showGrid,
  setShowGrid,
  showNumbers,
  setShowNumbers,
  showStats,
  setShowStats,
  clearGrid,
  isExportMenuOpen,
  setIsExportMenuOpen,
  handleExport
}: HeaderProps) => {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-2 md:px-4 shrink-0 shadow-sm relative z-50">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-1 px-2 md:px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 px-2 md:px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Upload</span>
        </button>
      </div>

      <div className="hidden lg:flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
        <ToolButton icon={Pencil} label="Pen" active={tool === "pen"} onClick={() => setTool("pen")} />
        <ToolButton icon={Eraser} label="Eraser" active={tool === "eraser"} onClick={() => setTool("eraser")} />
        <ToolButton icon={PaintBucket} label="Fill" active={tool === "fill"} onClick={() => setTool("fill")} />
        <ToolButton icon={Replace} label="Replace" active={tool === "replace"} onClick={() => setTool("replace")} />
        <ToolButton icon={Pipette} label="Eyedropper" active={tool === "eyedropper"} onClick={() => setTool("eyedropper")} />
        <ToolButton icon={Hand} label="Pan" active={tool === "pan"} onClick={() => setTool("pan")} />
      </div>

      <div className="flex items-center gap-1 md:gap-4">
        <div className="flex items-center gap-1">
          <IconButton icon={Undo} onClick={handleUndo} disabled={historyIndex === 0} />
          <IconButton icon={Redo} onClick={handleRedo} disabled={historyIndex === historyLength - 1} />
        </div>
        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
        <div className="flex items-center gap-1 hidden md:flex">
          <IconButton icon={Grid3X3} active={showGrid} onClick={() => setShowGrid(!showGrid)} />
          <IconButton icon={Hash} active={showNumbers} onClick={() => setShowNumbers(!showNumbers)} />
          <IconButton icon={BarChart2} active={showStats} onClick={() => setShowStats(!showStats)} />
        </div>
        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
        <div className="flex items-center gap-1 md:gap-2 relative">
          <button
            onClick={clearGrid}
            className="px-2 md:px-4 py-1.5 text-red-500 border border-red-200 rounded-md text-sm font-medium hover:bg-red-50 active:bg-red-100 active:scale-95 transition-all hidden md:block"
          >
            Clear
          </button>
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="flex items-center gap-1 px-2 md:px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 active:bg-blue-700 active:scale-95 transition-all"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>

          {isExportMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <button
                onClick={() => handleExport("pattern")}
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
                onClick={() => handleExport("finished")}
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
                onClick={() => handleExport("material")}
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
                onClick={() => handleExport("pdf")}
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

              <button
                onClick={() => handleExport("gallery")}
                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-purple-50 transition-colors text-left border-t border-gray-100 mt-1 pt-3"
              >
                <div className="p-2 bg-purple-50 text-purple-500 rounded-lg shrink-0">
                  <Download size={18} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">导出画廊 JSON</div>
                  <div className="text-xs text-gray-500 mt-0.5">导出 grid 数据用于画廊展示</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
