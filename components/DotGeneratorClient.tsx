'use client';

import { useEffect, useRef } from "react";
import { useRouter } from "@/i18n/routing";
interface DotGeneratorProps {
  locale: string; user?: any;
}
// 全局类型声明
declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, params?: object) => void;
    Module: any;
    jspdf: any;
    cv: any;
  }
}

interface Point {
  x: number;
  y: number;
}

interface Config {
  fontSize: number;
  dotRadius: number;
  dotColor: string;
  hint: string;
  eraseThickness: number;
}

interface State {
  originalImage: HTMLImageElement | null;
  internalHintImage: HTMLCanvasElement | null;
  dots: Point[];
  history: Point[][];
  activeTool: "add" | "move" | "del";
  draggedDotIndex: number;
  config: Config;
  pendingFile: File | null;
}

export default function DotGeneratorClient({ locale, user }: DotGeneratorProps) {
  const router = useRouter();
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
    window.dispatchEvent(new CustomEvent('auth-updated'));
  }, [user]);

  useEffect(() => {
    // 逻辑代码保持不变，仅修复类型
    const DEFAULT_CONFIG: Config = {
      fontSize: 20,
      dotRadius: 6,
      dotColor: "#000000",
      hint: "internal",
      eraseThickness: 11,
    };

    const SKETCH_CONFIG = {
      C: 7,
      BlockSize: 13,
      Padding: 10,
      SuperScale: 3,
    };

    const RMBG_API_URL = "https://ytdlp.vistaflyer.com/api/remove-background";

    let state: State = {
      originalImage: null,
      internalHintImage: null,
      dots: [],
      history: [],
      activeTool: "add",
      draggedDotIndex: -1,
      config: { ...DEFAULT_CONFIG },
      pendingFile: null,
    };

    let cvReady = false;
    let debounceTimer: NodeJS.Timeout | null = null;
    const MAX_DAILY_LIMIT = 1;
    const STORAGE_KEY = "ai_gen_daily_usage";

    const trackEvent = (eventName: string, params: object = {}) => {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
      }
    };

    const getEl = (id: string) => document.getElementById(id);

    // Views
    const landingView = getEl("landing-view");
    const editorView = getEl("editor-view");
    const backToHomeBtn = getEl("back-to-home");
    const feedbackbtn = getEl("feedback-toggle-button");

    // Landing UI
    const tabUpload = getEl("tab-upload");
    const tabAi = getEl("tab-ai");
    const tabBg = getEl("tab-bg");
    const panelUpload = getEl("panel-upload");
    const panelAi = getEl("panel-ai");
    const heroFileInput = getEl("hero-file-input") as HTMLInputElement | null;
    const heroAiInput = getEl("hero-ai-input") as HTMLInputElement | null;
    const heroAiGoBtn = getEl("hero-ai-go-btn") as HTMLButtonElement | null;
    const heroAiCredits = getEl("hero-ai-credits");

    // Editor Canvas
    const drawCanvas = getEl("draw-canvas") as HTMLCanvasElement | null;
    const ctx = drawCanvas ? drawCanvas.getContext("2d") : null;
    const canvasLoader = getEl("canvas-loader");

    // Tools
    const toolAdd = getEl("tool-add");
    const toolMove = getEl("tool-move");
    const toolDel = getEl("tool-del");
    const undoBtn = getEl("undo-btn");

    // Controls
    const dotCountSlider = getEl("dot-count-slider") as HTMLInputElement | null;
    const dotCountDisplay = getEl("dot-count-display");
    const pointsMinusBtn = getEl("points-minus-btn");
    const pointsPlusBtn = getEl("points-plus-btn");

    const fontSizeSlider = getEl("font-size-slider") as HTMLInputElement | null;
    const fontSizeValue = getEl("font-size-value");
    const dotSizeSlider = getEl("dot-size-slider") as HTMLInputElement | null;
    const dotSizeValue = getEl("dot-size-value");
    const dotColorPicker = getEl("dot-color-picker") as HTMLInputElement | null;

    const hintRadios = document.querySelectorAll('input[name="hint-type"]');
    const thicknessContainer = getEl("thickness-container");
    const thicknessSlider = getEl("thicknessSlider") as HTMLInputElement | null;
    const thicknessValue = getEl("thicknessValue");

    // Actions
    const clearBtn = getEl("clear-btn");

    // Download Buttons
    const sidebarPngBtn = getEl("sidebar-download-png-btn");
    const sidebarPdfBtn = getEl("sidebar-download-pdf-btn");
    const mobilePdfBtn = getEl("mobile-download-pdf-btn");
    const mobilePngBtn = getEl("mobile-download-png-btn");

    // Presets & Advanced
    const presetButtons = document.querySelectorAll(".preset-btn-js");

    const showTip = (message: string, type: "info" | "success" | "error" = "info") => {
      const oldTip = document.getElementById("custom-tip");
      if (oldTip) oldTip.remove();

      const tip = document.createElement("div");
      tip.id = "custom-tip";
      let bgClass =
        type === "error"
          ? "bg-red-500"
          : type === "success"
            ? "bg-green-500"
            : "bg-slate-800";

      tip.className = `fixed top-24 left-1/2 -translate-x-1/2 z-[9999] ${bgClass} text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 opacity-0`;
      tip.innerHTML = `<span class="font-medium text-sm">${message}</span>`;
      document.body.appendChild(tip);

      requestAnimationFrame(() => {
        tip.classList.remove("opacity-0");
        tip.classList.add("opacity-100", "translate-y-2");
      });
      setTimeout(() => {
        tip.classList.remove("opacity-100", "translate-y-2");
        tip.classList.add("opacity-0");
        setTimeout(() => tip.remove(), 300);
      }, 3000);
    };

    const toggleLoader = (show: boolean, text: string = "Processing...") => {
      if (!canvasLoader) return;
      if (show) {
        canvasLoader.classList.remove("hidden");
        const p = canvasLoader.querySelector("p");
        if (p) p.textContent = text;
      } else {
        canvasLoader.classList.add("hidden");
      }
    };

    const detectIsPhoto = (imgElement: HTMLImageElement) => {
      if (typeof window.cv === "undefined" || !cvReady) return false;
      const cv = window.cv;
      try {
        let src = cv.imread(imgElement);
        let hsv = new cv.Mat();
        cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB);
        cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);

        let planes = new cv.MatVector();
        cv.split(hsv, planes);
        let s = planes.get(1);
        let mean = cv.mean(s);
        let avgSaturation = mean[0];

        src.delete();
        hsv.delete();
        planes.delete();
        s.delete();

        console.log("Image Saturation:", avgSaturation);
        return avgSaturation > 15;
      } catch (e) {
        console.error("Detection failed:", e);
        return false;
      }
    };

    const removeBackgroundApi = async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch(RMBG_API_URL, { method: "POST", body: formData });
        if (!res.ok) throw new Error("API Error");
        return await res.blob();
      } catch (e) {
        console.error("BG Removal Failed:", e);
        throw e;
      }
    };

    const applyHighDefSketchLogic = async (imgEl: HTMLImageElement): Promise<File> => {
      const cv = window.cv;
      const MAX_PROC_SIZE = 1500;
      let scaleToFit = Math.min(1.0, MAX_PROC_SIZE / Math.max(imgEl.width, imgEl.height));

      let canvas = document.createElement("canvas");
      canvas.width = imgEl.width * scaleToFit;
      canvas.height = imgEl.height * scaleToFit;
      let ctx2 = canvas.getContext("2d");
      if (!ctx2) throw new Error("Could not get context");
      ctx2.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

      let src = cv.imread(canvas);
      let origW = src.cols;
      let origH = src.rows;
      let mats: any[] = [src];

      try {
        if (src.type() !== cv.CV_8UC4) {
          let tmp = new cv.Mat();
          cv.cvtColor(src, tmp, cv.COLOR_RGB2RGBA);
          src.delete();
          src = tmp;
          mats[0] = src;
        }

        let padPercent = SKETCH_CONFIG.Padding / 100;
        let targetW = Math.floor(origW * (1 - padPercent));
        let targetH = Math.floor(origH * (1 - padPercent));
        let offsetX = Math.floor((origW - targetW) / 2);
        let offsetY = Math.floor((origH - targetH) / 2);

        let paddedSrc = new cv.Mat(origH, origW, cv.CV_8UC4, new cv.Scalar(255, 255, 255, 0));
        mats.push(paddedSrc);

        let resizedInner = new cv.Mat();
        mats.push(resizedInner);
        cv.resize(src, resizedInner, new cv.Size(targetW, targetH), 0, 0, cv.INTER_AREA);

        let rect = new cv.Rect(offsetX, offsetY, targetW, targetH);
        let roi = paddedSrc.roi(rect);
        mats.push(roi);
        resizedInner.copyTo(roi);

        let bigW = origW * SKETCH_CONFIG.SuperScale;
        let bigH = origH * SKETCH_CONFIG.SuperScale;
        let bigSrc = new cv.Mat();
        mats.push(bigSrc);
        cv.resize(paddedSrc, bigSrc, new cv.Size(bigW, bigH), 0, 0, cv.INTER_CUBIC);

        let bigGray = new cv.Mat();
        mats.push(bigGray);
        cv.cvtColor(bigSrc, bigGray, cv.COLOR_RGBA2GRAY);

        let bigSketch = new cv.Mat();
        mats.push(bigSketch);
        let bigB = SKETCH_CONFIG.BlockSize * SKETCH_CONFIG.SuperScale;
        if (bigB % 2 === 0) bigB++;
        cv.adaptiveThreshold(bigGray, bigSketch, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, bigB, SKETCH_CONFIG.C);

        let rgbaPlanes = new cv.MatVector();
        cv.split(bigSrc, rgbaPlanes);
        let alpha = rgbaPlanes.get(3);

        let mask = new cv.Mat();
        mats.push(mask);
        cv.threshold(alpha, mask, 10, 255, cv.THRESH_BINARY);

        let maskInv = new cv.Mat();
        mats.push(maskInv);
        cv.bitwise_not(mask, maskInv);
        bigSketch.setTo(new cv.Scalar(255, 255, 255, 255), maskInv);

        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        for (let i = 0; i < contours.size(); ++i) {
          cv.drawContours(bigSketch, contours, i, new cv.Scalar(0, 0, 0, 255), SKETCH_CONFIG.SuperScale, cv.LINE_AA);
        }

        let finalSketch = new cv.Mat();
        mats.push(finalSketch);
        cv.resize(bigSketch, finalSketch, new cv.Size(origW, origH), 0, 0, cv.INTER_AREA);

        const outputCanvas = document.createElement("canvas");
        cv.imshow(outputCanvas, finalSketch);

        mats.forEach((m) => m.delete());
        rgbaPlanes.delete();
        alpha.delete();
        contours.delete();
        hierarchy.delete();

        return new Promise((resolve) => {
          outputCanvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], "processed_sketch.png", { type: "image/png" }));
            }
          }, "image/png");
        });
      } catch (e: any) {
        let msg = e;
        if (typeof e === "number") {
          msg = cv.exceptionFromPtr(e).msg;
        }
        console.error("Critical OpenCV Error:", msg);
        mats.forEach((m) => {
          try { m.delete(); } catch (i) { }
        });
        throw new Error(msg);
      }
    };

    const loadImageEl = (f: Blob | File): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(f);
        img.onload = () => resolve(img);
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Image load failed"));
        };
        img.src = url;
      });
    };

    const switchView = (view: "landing" | "editor") => {
      if (!landingView || !editorView) return;
      if (view === "editor") {
        landingView.classList.add("hidden");
        editorView.classList.remove("hidden");
        if (feedbackbtn) feedbackbtn.classList.add("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        editorView.classList.add("hidden");
        landingView.classList.remove("hidden");
        if (feedbackbtn) feedbackbtn.classList.remove("hidden");
        resetState();
      }
    };

    const resetState = () => {
      state.originalImage = null;
      state.internalHintImage = null;
      state.dots = [];
      state.history = [];
      if (heroFileInput) heroFileInput.value = "";
    };

    const loadFileToCanvas = (file: File | Blob) => {
      if (!drawCanvas) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          state.originalImage = img;
          const TARGET_MIN_WIDTH = 2000;
          const scale = Math.max(1, TARGET_MIN_WIDTH / Math.max(img.naturalWidth, img.naturalHeight)) || 1;

          drawCanvas.width = Math.floor(img.naturalWidth * scale);
          drawCanvas.height = Math.floor(img.naturalHeight * scale);

          state.dots = [];
          state.history = [];
          state.internalHintImage = null;

          if (state.config.hint === "internal" && typeof window.cv !== "undefined") {
            state.internalHintImage = generateInternalHintImage();
          }

          redraw();

          if (canvasLoader) {
            canvasLoader.classList.remove("hidden");
            setTimeout(runAutoDetect, 200);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    };

    const handleFile = async (file: File) => {
      if (!file || !file.type.startsWith("image/"))
        return showTip("Please upload a valid image file.", "error");

      trackEvent("user_upload_image", {
        file_type: file.type,
        file_size: Math.round(file.size / 1024) + "KB",
      });

      switchView("editor");
      toggleLoader(true, "Analyzing image...");

      try {
        if (typeof window.cv === "undefined" || !cvReady) {
          await new Promise<void>((resolve) => loadOpenCv(resolve));
        }

        const tempImg = await loadImageEl(file);
        const isPhoto = detectIsPhoto(tempImg);
        let fileToProcess: File | Blob = file;

        if (isPhoto) {
          toggleLoader(true, "Removing background...");
          try {
            const noBgBlob = await removeBackgroundApi(file);
            toggleLoader(true, "Refining sketch...");
            const noBgImg = await loadImageEl(noBgBlob);
            fileToProcess = await applyHighDefSketchLogic(noBgImg);
            URL.revokeObjectURL(noBgImg.src);
          } catch (err) {
            console.error("DEBUG - Photo Process Failed:", err);
            showTip("Sketch conversion failed, using original.", "info");
            fileToProcess = file;
          }
        }

        toggleLoader(true, "Creating dots...");
        loadFileToCanvas(fileToProcess);
        URL.revokeObjectURL(tempImg.src);
      } catch (e) {
        console.error("DEBUG - Global Workflow Error:", e);
        showTip("An error occurred.", "error");
        toggleLoader(false);
      }
    };

    const runAutoDetect = () => {
      if (!state.originalImage || !drawCanvas) return;
      const cv = window.cv;
      if (typeof cv === "undefined" || !cvReady) {
        setTimeout(runAutoDetect, 500);
        return;
      }

      try {
        toggleLoader(true, "Detecting lines...");

        const tempCanvas = document.createElement("canvas");
        const processWidth = 1000;
        const processScale = Math.min(1, processWidth / Math.max(drawCanvas.width, drawCanvas.height));

        const w = Math.floor(drawCanvas.width * processScale);
        const h = Math.floor(drawCanvas.height * processScale);

        if (w === 0 || h === 0) return;

        tempCanvas.width = w;
        tempCanvas.height = h;

        const tCtx = tempCanvas.getContext("2d");
        if (!tCtx) return;
        tCtx.drawImage(state.originalImage, 0, 0, w, h);

        let imgData = tCtx.getImageData(0, 0, w, h);
        let src = cv.matFromImageData(imgData);

        let gray = new cv.Mat();
        let binary = new cv.Mat();
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();

        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        cv.adaptiveThreshold(gray, binary, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2);

        let M = cv.Mat.ones(3, 3, cv.CV_8U);
        cv.dilate(binary, binary, M);

        cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE);

        let allPoints: Point[] = [];
        let maxArea = 0;
        let maxContourIndex = -1;

        for (let i = 0; i < contours.size(); i++) {
          let cnt = contours.get(i);
          if (cv.contourArea(cnt) > 100 && cv.contourArea(cnt) > maxArea) {
            maxArea = cv.contourArea(cnt);
            maxContourIndex = i;
          }
        }

        if (maxContourIndex !== -1) {
          let mainContour = contours.get(maxContourIndex);
          let approx = new cv.Mat();
          cv.approxPolyDP(mainContour, approx, cv.arcLength(mainContour, true) * 0.001, true);

          for (let j = 0; j < approx.rows; j++) {
            allPoints.push({
              x: approx.data32S[j * 2] / processScale,
              y: approx.data32S[j * 2 + 1] / processScale,
            });
          }
          approx.delete();
        }

        src.delete();
        gray.delete();
        binary.delete();
        contours.delete();
        hierarchy.delete();
        M.delete();

        const targetCount = dotCountSlider ? parseInt(dotCountSlider.value) : 25;
        state.dots = allPoints.length > 0 ? resampleDots(allPoints, targetCount) : [];

        saveHistory();
        redraw();
        updateDotCountUI();
      } catch (e) {
        console.error("Auto detect runtime error:", e);
      } finally {
        toggleLoader(false);
      }
    };

    const interpolatePoints = (points: Point[], minCount: number): Point[] => {
      let result: Point[] = [];
      for (let i = 0; i < points.length - 1; i++) {
        result.push(points[i]);
        result.push({
          x: (points[i].x + points[i + 1].x) / 2,
          y: (points[i].y + points[i + 1].y) / 2,
        });
      }
      result.push(points[points.length - 1]);
      return result.length < minCount ? interpolatePoints(result, minCount) : result;
    };

    const resampleDots = (points: Point[], targetCount: number): Point[] => {
      if (points.length < 2) return points;
      if (points.length < targetCount * 2)
        points = interpolatePoints(points, targetCount * 3);

      const closedPoints = [...points, points[0]];
      let totalLength = 0;
      const cumLengths = [0];

      for (let i = 0; i < closedPoints.length - 1; i++) {
        totalLength += Math.hypot(
          closedPoints[i + 1].x - closedPoints[i].x,
          closedPoints[i + 1].y - closedPoints[i].y
        );
        cumLengths.push(totalLength);
      }

      const step = totalLength / targetCount;
      const newPoints: Point[] = [];

      for (let i = 0; i < targetCount; i++) {
        const targetDist = i * step;
        let j = 0;
        while (j < cumLengths.length - 1 && cumLengths[j + 1] < targetDist) j++;

        const segmentStartDist = cumLengths[j];
        const segmentLength = cumLengths[j + 1] - cumLengths[j];
        const t = segmentLength === 0 ? 0 : (targetDist - segmentStartDist) / segmentLength;

        newPoints.push({
          x: closedPoints[j].x + (closedPoints[j + 1].x - closedPoints[j].x) * t,
          y: closedPoints[j].y + (closedPoints[j + 1].y - closedPoints[j].y) * t,
        });
      }
      return newPoints;
    };

    const generateInternalHintImage = (): HTMLCanvasElement | null => {
      const cv = window.cv;
      if (!state.originalImage || typeof cv === "undefined" || !cvReady)
        return null;
      try {
        const tempCanvas = document.createElement("canvas");
        const w = drawCanvas!.width, h = drawCanvas!.height;
        tempCanvas.width = w;
        tempCanvas.height = h;

        const tCtx = tempCanvas.getContext("2d");
        if (!tCtx) return null;
        tCtx.fillStyle = "#FFFFFF";
        tCtx.fillRect(0, 0, w, h);
        tCtx.drawImage(state.originalImage, 0, 0, w, h);

        let src = cv.matFromImageData(tCtx.getImageData(0, 0, w, h));
        let gray = new cv.Mat(),
          binary = new cv.Mat(),
          contours = new cv.MatVector(),
          hierarchy = new cv.Mat();

        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        cv.threshold(gray, binary, 127, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);
        cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        const thickness = Math.max(2, state.config.eraseThickness * (w / 1000));
        cv.drawContours(src, contours, -1, new cv.Scalar(255, 255, 255, 255), thickness);

        const outputCanvas = document.createElement("canvas");
        outputCanvas.width = w;
        outputCanvas.height = h;
        cv.imshow(outputCanvas, src);

        src.delete();
        gray.delete();
        binary.delete();
        contours.delete();
        hierarchy.delete();
        return outputCanvas;
      } catch (e) {
        console.error("Internal Lines Error:", e);
        return null;
      }
    };

    const redraw = () => {
      if (!ctx || !drawCanvas) return;
      ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

      if (state.config.hint !== "no" && state.originalImage) {
        ctx.save();
        if (state.config.hint === "trace") {
          ctx.globalAlpha = 0.3;
          ctx.drawImage(state.originalImage, 0, 0, drawCanvas.width, drawCanvas.height);
        } else if (state.config.hint === "internal") {
          ctx.drawImage(state.internalHintImage || state.originalImage, 0, 0, drawCanvas.width, drawCanvas.height);
        } else {
          ctx.drawImage(state.originalImage, 0, 0, drawCanvas.width, drawCanvas.height);
        }
        ctx.restore();
      }

      const scale = Math.max(0.5, drawCanvas.width / 1000);
      const r = state.config.dotRadius * scale;
      const fontSize = state.config.fontSize * scale;

      ctx.font = `bold ${fontSize}px Poppins, Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let centerX = 0, centerY = 0;
      if (state.dots.length > 0) {
        state.dots.forEach((d) => {
          centerX += d.x;
          centerY += d.y;
        });
        centerX /= state.dots.length;
        centerY /= state.dots.length;
      } else {
        centerX = drawCanvas.width / 2;
        centerY = drawCanvas.height / 2;
      }

      state.dots.forEach((dot, i) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
        ctx.fillStyle = state.config.dotColor;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2 * scale;
        ctx.stroke();

        const dx = dot.x - centerX || 1, dy = dot.y - centerY || 1;
        const len = Math.hypot(dx, dy);
        const offset = r + fontSize * 0.8;
        const labelX = dot.x + (dx / len) * offset,
          labelY = dot.y + (dy / len) * offset;

        ctx.fillStyle = "#000";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3 * scale;
        ctx.strokeText((i + 1).toString(), labelX, labelY);
        ctx.fillText((i + 1).toString(), labelX, labelY);
      });
    };

    const getEventPos = (e: MouseEvent | TouchEvent): Point => {
      if (!drawCanvas) return { x: 0, y: 0 };
      const rect = drawCanvas.getBoundingClientRect();
      const canvasRatio = drawCanvas.width / drawCanvas.height;
      const rectRatio = rect.width / rect.height;
      let displayWidth, displayHeight, offsetX, offsetY;

      if (canvasRatio > rectRatio) {
        displayWidth = rect.width;
        displayHeight = rect.width / canvasRatio;
        offsetX = 0;
        offsetY = (rect.height - displayHeight) / 2;
      } else {
        displayHeight = rect.height;
        displayWidth = rect.height * canvasRatio;
        offsetX = (rect.width - displayWidth) / 2;
        offsetY = 0;
      }

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      return {
        x: ((clientX - rect.left - offsetX) * drawCanvas.width) / displayWidth,
        y: ((clientY - rect.top - offsetY) * drawCanvas.height) / displayHeight,
      };
    };

    const saveHistory = () => {
      if (state.history.length > 20) state.history.shift();
      state.history.push(JSON.parse(JSON.stringify(state.dots)));
    };

    const performUndo = () => {
      if (state.history.length > 0) {
        const last = state.history.pop();
        if (last) state.dots = last;
        redraw();
        updateDotCountUI();
      }
    };

    const updateDotCountUI = () => {
      if (dotCountDisplay) {
        dotCountDisplay.textContent = `${state.dots.length} Dots`;
      }
    };

    const handleInputStart = (e: MouseEvent | TouchEvent) => {
      if (!state.originalImage || !drawCanvas) return;
      if (e.type === "touchstart") (e as TouchEvent).preventDefault();
      const pos = getEventPos(e);
      const scale = Math.max(1, drawCanvas.width / 1000);
      const hitRadius = state.config.dotRadius * scale + 20 * scale;
      const idx = state.dots.findIndex(
        (d) => Math.hypot(d.x - pos.x, d.y - pos.y) < hitRadius
      );

      if (state.activeTool === "del" && idx !== -1) {
        state.dots.splice(idx, 1);
        saveHistory();
        redraw();
        updateDotCountUI();
      } else if (state.activeTool === "move" && idx !== -1) {
        state.draggedDotIndex = idx;
        drawCanvas.style.cursor = "grabbing";
      } else if (state.activeTool === "add" && idx === -1) {
        state.dots.push(pos);
        saveHistory();
        redraw();
        updateDotCountUI();
      }
    };

    const handleInputMove = (e: MouseEvent | TouchEvent) => {
      if (state.activeTool === "move" && state.draggedDotIndex !== -1) {
        if (e.type === "touchmove") (e as TouchEvent).preventDefault();
        state.dots[state.draggedDotIndex] = getEventPos(e);
        redraw();
      }
    };

    const handleInputEnd = () => {
      if (state.activeTool === "move" && state.draggedDotIndex !== -1) {
        state.draggedDotIndex = -1;
        if (drawCanvas) drawCanvas.style.cursor = "grab";
        saveHistory();
      }
    };

    if (drawCanvas) {
      drawCanvas.addEventListener("mousedown", handleInputStart as EventListener);
      drawCanvas.addEventListener("mousemove", handleInputMove as EventListener);
      drawCanvas.addEventListener("mouseup", handleInputEnd);
      drawCanvas.addEventListener("touchstart", handleInputStart as EventListener, { passive: false });
      drawCanvas.addEventListener("touchmove", handleInputMove as EventListener, { passive: false });
      drawCanvas.addEventListener("touchend", handleInputEnd);
    }

    const updateConfig = (key: keyof Config, val: any) => {
      (state.config as any)[key] = val;
      if (
        (key === "hint" && val === "internal") ||
        (key === "eraseThickness" && state.config.hint === "internal")
      ) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          state.internalHintImage = generateInternalHintImage();
          redraw();
        }, 50);
      } else {
        redraw();
      }
      if (key === "hint" && val !== "internal") state.internalHintImage = null;
    };

    if (fontSizeSlider) {
      fontSizeSlider.addEventListener("input", (e) => {
        const val = (e.target as HTMLInputElement).value;
        if (fontSizeValue) fontSizeValue.textContent = val;
        updateConfig("fontSize", parseInt(val, 10));
      });
    }
    if (dotSizeSlider) {
      dotSizeSlider.addEventListener("input", (e) => {
        const val = (e.target as HTMLInputElement).value;
        if (dotSizeValue) dotSizeValue.textContent = val;
        updateConfig("dotRadius", parseInt(val, 10));
      });
    }
    if (thicknessSlider) {
      thicknessSlider.addEventListener("input", (e) => {
        const val = (e.target as HTMLInputElement).value;
        if (thicknessValue) thicknessValue.textContent = val;
        updateConfig("eraseThickness", parseInt(val, 10));
      });
    }
    if (dotColorPicker) {
      dotColorPicker.addEventListener("input", (e) =>
        updateConfig("dotColor", (e.target as HTMLInputElement).value)
      );
    }

    hintRadios.forEach((r) =>
      r.addEventListener("change", (e) => {
        const val = (e.target as HTMLInputElement).value;
        updateConfig("hint", val);
        if (thicknessContainer)
          thicknessContainer.classList.toggle("hidden", val !== "internal");
      })
    );

    if (dotCountSlider) {
      dotCountSlider.addEventListener("input", (e) => {
        if (dotCountDisplay)
          dotCountDisplay.textContent = `${(e.target as HTMLInputElement).value} Dots`;
      });
      dotCountSlider.addEventListener("change", () => {
        if (typeof window.cv !== "undefined" && state.originalImage) {
          toggleLoader(true, "Updating dots...");
          setTimeout(runAutoDetect, 50);
        }
      });
    }

    if (pointsPlusBtn && dotCountSlider && dotCountDisplay) {
      pointsPlusBtn.addEventListener("click", () => {
        let val = parseInt(dotCountSlider.value, 10);
        if (val < 200) {
          dotCountSlider.value = `${++val}`;
          dotCountDisplay.textContent = `${val} Dots`;
          dotCountSlider.dispatchEvent(new Event("change"));
        }
      });
    }

    if (pointsMinusBtn && dotCountSlider && dotCountDisplay) {
      pointsMinusBtn.addEventListener("click", () => {
        let val = parseInt(dotCountSlider.value, 10);
        if (val > 5) {
          dotCountSlider.value = `${--val}`;
          dotCountDisplay.textContent = `${val} Dots`;
          dotCountSlider.dispatchEvent(new Event("change"));
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (typeof window !== "undefined" && window.confirm("Are you sure you want to clear all dots? This cannot be undone.")) {
          trackEvent("clear_canvas", { dots_before: state.dots.length });
          saveHistory();
          state.dots = [];
          redraw();
          updateDotCountUI();
          if (dotCountSlider) {
            dotCountSlider.value = "0";
          }
          showTip("Canvas cleared. You can Undo if needed.", "success");
        }
      });
    }

    const getAiUsage = () => {
      const today = new Date().toLocaleDateString();
      let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (data.date !== today) {
        data = { date: today, count: 0, extra: 0, shareDate: null };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      return data;
    };
    // AI Generation (Doubao) Logic - Kept roughly same but unified loader
    if (heroAiGoBtn) {
      heroAiGoBtn.addEventListener('click', async (e) => {
        // 阻止默认事件
        e.preventDefault();

        // 如果该按钮被 updateAiCreditsUI 动态绑定了 onclick (例如跳转到 Pricing)，则不再执行生成逻辑
        if (heroAiGoBtn.onclick) return;

        const currentUser = userRef.current; // 拿到最新用户状态

        // ==========================================
        // 1. 优先判断额度 (区分已登录用户和未登录游客)
        // ==========================================
        if (currentUser) {
          // 已登录用户：判断数据库里的 credits
          const credits = parseInt(currentUser.credits || "0", 10);
          if (credits <= 0) {
            router.push("/pricing");
            return;
          }
        } else {
          // 游客：判断本地 localStorage 的使用次数
          const usage = getAiUsage();
          const limit = MAX_DAILY_LIMIT + (usage.extra || 0);
          if (usage.count >= limit) {
            showTip("Daily limit reached. Share below to unlock!", "info");
            return;
          }
        }

        // ==========================================
        // 2. 校验输入提示词
        // ==========================================
        const prompt = heroAiInput?.value.trim() || "";
        if (prompt.length < 3) {
          return showTip("Please enter a description.", "error");
        }

        // GA 埋点：AI 生成开始
        trackEvent('ai_generate_start', { prompt_length: prompt.length });

        // ==========================================
        // 3. 更新 UI 为加载状态
        // ==========================================
        heroAiGoBtn.disabled = true;
        heroAiGoBtn.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

        switchView('editor');
        toggleLoader(true, "AI is creating your puzzle...");

        if (drawCanvas && ctx) {
          ctx.clearRect(0, 0, drawCanvas.width || 0, drawCanvas.height);
        }

        try {
          // ==========================================
          // 4. 准备请求头并携带 Token
          // ==========================================
          const token = localStorage.getItem("auth_token");

          // 声明 headers，动态添加 Authorization
          const headers: HeadersInit = {
            "Content-Type": "application/json"
          };
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }

          // 发送请求到后端
          const res = await fetch("/api/doubao", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              prompt: prompt + ", simple black and white line art, coloring book style, white background, no shading, clear outlines",
            })
          });

          // ==========================================
          // 5. 错误处理
          // ==========================================
          if (!res.ok) {
            const errorText = await res.text();
            let errorMessage = "AI Generation failed";
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.error || errorJson.message || errorMessage;
            } catch (err) {
              errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
          }

          // 解析图片流
          const blob = await res.blob();
          if (blob.size < 100) {
            throw new Error("Received an invalid image file.");
          }

          // 埋点：AI 生成成功
          trackEvent('ai_generate_success');

          // ==========================================
          // 6. 前端扣除积分并更新 UI (后端此时已经扣除了数据库)
          // ==========================================
          if (currentUser) {
            // 已登录用户：本地修改积分 -1
            const newCredits = (parseInt(currentUser.credits || "0", 10) - 1).toString();
            currentUser.credits = newCredits;

            // 同步回 localStorage 避免刷新短暂闪烁旧数据
            const savedStr = localStorage.getItem("app_user");
            if (savedStr) {
              try {
                const savedUser = JSON.parse(savedStr);
                savedUser.credits = newCredits;
                localStorage.setItem("app_user", JSON.stringify(savedUser));
              } catch (e) {
                console.error("Failed to update app_user in localStorage", e);
              }
            }
            // 刷新数字和按钮状态
            updateAiCreditsUI();
          } else {
            // 游客：增加本地使用次数
            incrementAiUsage();
          }

          // ==========================================
          // 7. 渲染生成的图片到画布
          // ==========================================
          const aiFile = new File([blob], `ai_${Date.now()}.png`, { type: blob.type });
          loadFileToCanvas(aiFile);

        } catch (e: any) {
          console.error("AI Gen Error:", e);
          trackEvent('ai_generate_fail', { error: e.message });
          showTip(e.message || "AI Generation failed. Please try again.", "error");

          // 失败后退回首页视图
          switchView('landing');

          // 失败后将按钮恢复为可点击状态
          updateAiCreditsUI();
        } finally {
          toggleLoader(false);
        }
      });
    }
    const incrementAiUsage = () => {
      const data = getAiUsage();
      data.count++;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      updateAiCreditsUI();
    };
    const handleShareUnlock = () => {
      const data = getAiUsage();
      const today = new Date().toLocaleDateString();

      if (data.shareDate === today) {
        showTip("You have already claimed today's bonus!", "info");
        return;
      }

      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent("Check out this Free Connect the Dots Generator!");
      window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, "_blank");

      data.extra = (data.extra || 0) + 1;
      data.shareDate = today;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      updateAiCreditsUI();
      showTip("Success! 3 credits added.", "success");
    };

    const updateAiCreditsUI = () => {
      const currentUser = userRef.current; // 获取当前用户

      if (currentUser) {
        // ============================
        // 1. 已登录用户逻辑
        // ============================
        const credits = parseInt(currentUser.credits || "0", 10);
        if (heroAiCredits) heroAiCredits.textContent = credits.toString();

        let msgContainer = document.getElementById("ai-limit-msg");
        if (!heroAiGoBtn) return;

        if (credits <= 0) {
          // 积分不足
          heroAiGoBtn.style.cursor = "default";
          heroAiGoBtn.disabled = true;

          const lockSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" stroke-linejoin="round" class="inline mb-0.5 ml-1"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';

          heroAiGoBtn.innerHTML = `<span>Get More Credits</span>${lockSvg}`;
          heroAiGoBtn.disabled = false;
          heroAiGoBtn.style.cursor = 'pointer';
          heroAiGoBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push("/pricing");
          };

          // 显示提示文字
          if (!msgContainer) {
            msgContainer = document.createElement("div");
            msgContainer.id = "ai-limit-msg";
            msgContainer.className = "text-center mt-4 text-sm text-slate-500 animate-in fade-in slide-in-from-top-1";
            msgContainer.innerHTML = `<span>Insufficient credits. </span><a href="/pricing" class="text-brand-blue font-bold hover:underline">Upgrade</a>`;
            const creditsParent = heroAiCredits ? heroAiCredits.parentElement : null;
            if (creditsParent && creditsParent.parentNode) {
              creditsParent.parentNode.insertBefore(msgContainer, creditsParent.nextSibling);
            }
          }
        } else {
          // 积分充足
          heroAiGoBtn.style.backgroundColor = "";
          heroAiGoBtn.style.color = "";
          heroAiGoBtn.style.cursor = "";
          heroAiGoBtn.disabled = false;
          heroAiGoBtn.classList.add("bg-gradient-to-r", "from-purple-600", "to-pink-600", "hover:shadow-lg", "hover:scale-105");
          const arrowSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" stroke-linejoin="round" class="inline"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
          heroAiGoBtn.innerHTML = `<span>Generate</span> ${arrowSvg}`;
          heroAiGoBtn.onclick = null; // 恢复事件流
          if (msgContainer) msgContainer.remove();
        }

      } else {
        // ============================
        // 2. 未登录游客逻辑 (保留你原有的逻辑)
        // ============================
        const data = getAiUsage();
        const limit = MAX_DAILY_LIMIT + (data.extra || 0);
        const remaining = Math.max(0, limit - data.count);

        if (heroAiCredits) heroAiCredits.textContent = remaining.toString();

        let msgContainer = document.getElementById("ai-limit-msg");
        if (!heroAiGoBtn) return;

        if (remaining <= 0) {
          heroAiGoBtn.style.cursor = "default";
          heroAiGoBtn.disabled = true;

          const lockSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" stroke-linejoin="round" class="inline mb-0.5 ml-1"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
          heroAiGoBtn.innerHTML = `<span>Get More Credits</span>${lockSvg}`;
          heroAiGoBtn.disabled = false;
          heroAiGoBtn.style.cursor = 'pointer';

          heroAiGoBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push("/pricing");
          };

          const today = new Date().toLocaleDateString();
          if (data.shareDate !== today) {
            if (!msgContainer) {
              msgContainer = document.createElement("div");
              msgContainer.id = "ai-limit-msg";
              msgContainer.className = "text-center mt-4 text-sm text-slate-500 animate-in fade-in slide-in-from-top-1";
              const shareSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>';
              msgContainer.innerHTML = `<span>Daily limit used. </span><button id="inline-share-btn" class="inline-flex items-center gap-1 text-[#FF4500] hover:text-[#cc3700] font-bold hover:underline cursor-pointer transition-colors relative z-20" style="background:none; border:none; padding:0;">${shareSvg} Share to unlock +1</button>`;
              const creditsParent = heroAiCredits ? heroAiCredits.parentElement : null;
              if (creditsParent && creditsParent.parentNode) {
                creditsParent.parentNode.insertBefore(msgContainer, creditsParent.nextSibling);
                const shareBtn = document.getElementById("inline-share-btn");
                if (shareBtn) shareBtn.addEventListener("click", handleShareUnlock);
              }
            }
          } else {
            if (msgContainer) msgContainer.remove();
          }
        } else {
          heroAiGoBtn.style.backgroundColor = "";
          heroAiGoBtn.style.color = "";
          heroAiGoBtn.style.cursor = "";
          heroAiGoBtn.disabled = false;
          heroAiGoBtn.classList.add("bg-gradient-to-r", "from-purple-600", "to-pink-600", "hover:shadow-lg", "hover:scale-105");
          const arrowSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" stroke-linejoin="round" class="inline"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
          heroAiGoBtn.innerHTML = `<span>Generate</span> ${arrowSvg}`;
          if (msgContainer) msgContainer.remove();
        }
      }
    };

    // ★ 增加一个事件监听，当上面 useEffect 触发 'auth-updated' 时重新刷新UI
    window.addEventListener('auth-updated', updateAiCreditsUI);

    const showDonationTip = () => {
      const existingTip = document.getElementById("donation-toast");
      if (existingTip) existingTip.remove();

      const toast = document.createElement("div");
      toast.id = "donation-toast";
      toast.className = `fixed top-24 right-4 z-[100] max-w-sm w-auto bg-white border-l-4 border-[#FF5E5B] rounded-lg shadow-2xl flex items-center gap-4 p-4 pr-10 cursor-pointer transform transition-all duration-500 translate-x-[120%] hover:scale-102 group`;

      toast.innerHTML = `
          <div class="flex-shrink-0 w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#FF5E5B]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="w-5 h-5 animate-pulse">
                  <path d="M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z"/>
              </svg>
          </div>
          <div>
              <h4 class="font-bold text-gray-800 text-sm">Download Complete! 🎉</h4>
              <p class="text-xs text-slate-500 mt-1 group-hover:text-[#FF5E5B] transition-colors">
                  Happy with the result? <br>
                  <span class="underline decoration-[#FF5E5B] decoration-2">Buy me a coffee ($5)</span>
              </p>
          </div>
          <button id="close-toast" class="absolute top-2 right-2 text-gray-300 hover:text-gray-500 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path strokeLinecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
      `;

      document.body.appendChild(toast);
      requestAnimationFrame(() => {
        toast.classList.remove("translate-x-[120%]");
        toast.classList.add("translate-x-0");
      });

      const removeToast = () => {
        toast.classList.remove("translate-x-0");
        toast.classList.add("translate-x-[120%]");
        setTimeout(() => { if (toast && toast.parentNode) toast.parentNode.removeChild(toast); }, 500);
      };

      toast.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest("#close-toast")) {
          removeToast();
          return;
        }
        window.open("https://ko-fi.com/connectthedotsprintable", "_blank");
      });
      setTimeout(removeToast, 8000);
    };

    const dl = async (fmt: "png" | "pdf", event?: Event) => {
      if (!state.originalImage || !drawCanvas)
        return showTip("Please create a puzzle first!", "error");

      const activeBtn = event?.currentTarget as HTMLButtonElement | null;
      const originalText = activeBtn ? activeBtn.innerHTML : "";

      if (activeBtn) {
        activeBtn.disabled = true;
        activeBtn.innerHTML = '<span class="flex items-center gap-2">Processing...</span>';
      }
      trackEvent("download_result", {
        file_format: fmt,
        dots_count: state.dots.length,
        hint_mode: state.config.hint,
      });
      try {
        if (fmt === "png") {
          drawCanvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = `connect-dots-${Date.now()}.png`;
              link.href = url;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
          }, "image/png");
        } else if (fmt === "pdf") {
          if (!window.jspdf) throw new Error("jsPDF not loaded");
          const { jsPDF } = window.jspdf;
          await new Promise<void>((resolve) => {
            setTimeout(() => {
              const isLandscape = drawCanvas.width > drawCanvas.height;
              const doc = new jsPDF({
                orientation: isLandscape ? "l" : "p",
                unit: "mm",
                format: "a4",
              });
              const pdfW = doc.internal.pageSize.getWidth();
              const pdfH = doc.internal.pageSize.getHeight();
              const ratio = Math.min(pdfW / drawCanvas.width, pdfH / drawCanvas.height);
              const w = drawCanvas.width * ratio;
              const h = drawCanvas.height * ratio;
              doc.addImage(drawCanvas.toDataURL("image/png"), "PNG", (pdfW - w) / 2, (pdfH - h) / 2, w, h);
              doc.save("connect-dots.pdf");
              resolve();
            }, 100);
          });
        }
        setTimeout(showDonationTip, 2000);
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        if (activeBtn) {
          activeBtn.disabled = false;
          activeBtn.innerHTML = originalText;
        }
      }
    };

    let cvCallbacks: Array<() => void> = [];
    const loadOpenCv = (cb?: () => void) => {
      if (cvReady) { if (cb) cb(); return; }
      if (cb) cvCallbacks.push(cb);
      if (document.querySelector('script[src*="opencv.js"]')) return;

      const script = document.createElement("script");
      script.src = "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/opencv.js";
      script.async = true;
      window.Module = {
        onRuntimeInitialized: function () {
          cvReady = true;
          console.log("OpenCV Ready");
          window.cv = (window as any).cv; // 确保全局引用
          while (cvCallbacks.length > 0) {
            const callback = cvCallbacks.shift();
            if (callback) callback();
          }
        },
      };
      document.body.appendChild(script);
    };

    const setupHeroTabs = () => {
      if (!tabUpload || !tabAi || !tabBg || !panelUpload || !panelAi) return;

      const setActive = (isAiMode: boolean) => {
        if (isAiMode) {
          trackEvent("select_mode", { mode: "ai_gen" });
          // 滑块移动
          (tabBg as HTMLElement).style.transform = "translateX(100%)";

          // 切换按钮颜色
          tabAi.classList.remove("text-slate-500");
          tabAi.classList.add("text-slate-800");
          tabUpload.classList.remove("text-slate-800");
          tabUpload.classList.add("text-slate-500");

          // 【核心修复】：切换面板状态
          panelUpload.classList.remove("active");
          panelUpload.classList.add("inactive");

          panelAi.classList.remove("inactive");
          panelAi.classList.add("active");
          // 如果你之前手动加了 hidden，这里也要确保去掉
          panelAi.classList.remove("hidden");

          setTimeout(() => heroAiInput?.focus(), 100);
        } else {
          trackEvent("select_mode", { mode: "upload" });
          // 滑块复位
          (tabBg as HTMLElement).style.transform = "translateX(0)";

          // 切换按钮颜色
          tabUpload.classList.remove("text-slate-500");
          tabUpload.classList.add("text-slate-800");
          tabAi.classList.remove("text-slate-800");
          tabAi.classList.add("text-slate-500");

          // 【核心修复】：切换面板状态
          panelAi.classList.remove("active");
          panelAi.classList.add("inactive");

          panelUpload.classList.remove("inactive");
          panelUpload.classList.add("active");
        }
      };

      tabUpload.addEventListener("click", () => setActive(false));
      tabAi.addEventListener("click", () => setActive(true));
    };

    const setupToolbar = () => {
      const setActive = (tool: "add" | "move" | "del") => {
        state.activeTool = tool;
        [toolAdd, toolMove, toolDel].forEach((btn) => {
          if (!btn) return;
          const isActive = btn.id === `tool-${tool}`;
          btn.classList.toggle("bg-brand-blue", isActive);
          btn.classList.toggle("text-white", isActive);
          btn.classList.toggle("bg-slate-700", !isActive);
          if (btn.id === "tool-add" && !isActive) btn.classList.add("text-brand-blue");
        });
        if (drawCanvas) drawCanvas.style.cursor = tool === "move" ? "grab" : "crosshair";
      };

      if (toolAdd) toolAdd.addEventListener("click", () => setActive("add"));
      if (toolMove) toolMove.addEventListener("click", () => setActive("move"));
      if (toolDel) toolDel.addEventListener("click", () => setActive("del"));
      if (undoBtn) undoBtn.addEventListener("click", performUndo);
      setActive("add");
    };

    const setupPresets = () => {
      const presetConfigs: any = {
        easy: { count: 25, font: 28, dotRadius: 8, hint: "trace", desc: "Perfect for kids (20-30 dots, large font)" },
        medium: { count: 55, font: 20, dotRadius: 6, hint: "trace", desc: "Standard difficulty (50-60 dots)" },
        hard: { count: 90, font: 14, dotRadius: 4, hint: "trace", desc: "Expert challenge (80+ dots, no hints)" },
      };

      presetButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          presetButtons.forEach((b) => {
            b.classList.remove("active", "border-brand-blue", "bg-indigo-50", "bg-indigo-50/50");
            b.classList.add("border-transparent", "bg-slate-50");
            const span = b.querySelector("span:last-child");
            if (span) span.classList.replace("text-brand-blue", "text-slate-600");
          });

          btn.classList.add("active", "border-brand-blue", "bg-indigo-50");
          btn.classList.remove("border-transparent", "bg-slate-50");
          const span = btn.querySelector("span:last-child");
          if (span) span.classList.replace("text-slate-600", "text-brand-blue");

          const presetType = (btn as HTMLElement).dataset.preset;
          const config = presetConfigs[presetType || 'easy'];

          if (dotCountSlider) {
            dotCountSlider.value = `${config.count}`;
            if (dotCountDisplay) dotCountDisplay.textContent = `${config.count} Dots`;
          }
          if (fontSizeSlider) {
            fontSizeSlider.value = `${config.font}`;
            if (fontSizeValue) fontSizeValue.textContent = config.font;
          }
          if (dotSizeSlider) {
            dotSizeSlider.value = `${config.dotRadius}`;
            if (dotSizeValue) dotSizeValue.textContent = config.dotRadius;
          }

          state.config.fontSize = config.font;
          state.config.dotRadius = config.dotRadius;

          const radios = document.getElementsByName("hint-type");
          for (let radio of (radios as any)) {
            if (radio.value === config.hint) {
              radio.checked = true;
              updateConfig("hint", config.hint);
              if (thicknessContainer) {
                config.hint === "internal" ? thicknessContainer.classList.remove("hidden") : thicknessContainer.classList.add("hidden");
              }
              break;
            }
          }

          if (state.originalImage && typeof window.cv !== "undefined") {
            toggleLoader(true, "Updating...");
            setTimeout(runAutoDetect, 50);
          } else {
            redraw();
          }
        });
      });
    };

    const updateDemoVideoOverlay = () => {
      const pcVideo = document.getElementById("demo-video-pc") as HTMLVideoElement | null;
      const mobileVideo = document.getElementById("demo-video-mobile") as HTMLVideoElement | null;
      const pcOverlay = document.getElementById("video-overlay");
      const mobileOverlay = document.getElementById("mobile-video-overlay");

      if (pcOverlay && pcVideo) {
        pcOverlay.addEventListener("click", () => {
          pcVideo.play();
          pcOverlay.classList.add("opacity-0", "pointer-events-none");
        });
      }
      if (mobileOverlay && mobileVideo) {
        mobileOverlay.addEventListener("click", () => {
          mobileVideo.play();
          mobileOverlay.classList.add("opacity-0", "pointer-events-none");
        });
      }
    };

    const updateDemoTabs = () => {
      const demoTabs = document.getElementById("demo-tabs");
      if (!demoTabs) return;
      const buttons = demoTabs.querySelectorAll(".tab-button-tailwind");
      const pcContent = document.getElementById("pc-content");
      const mobileContent = document.getElementById("mobile-content");

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const tab = btn.getAttribute("data-tab");
          buttons.forEach((b) => {
            b.classList.remove("bg-brand-blue", "text-white", "shadow-md");
            b.classList.add("text-slate-500");
          });
          btn.classList.add("bg-brand-blue", "text-white", "shadow-md");
          btn.classList.remove("text-slate-500");

          if (tab === "pc") {
            if (pcContent) pcContent.classList.remove("hidden");
            if (mobileContent) mobileContent.classList.add("hidden");
          } else {
            if (pcContent) pcContent.classList.add("hidden");
            if (mobileContent) mobileContent.classList.remove("hidden");
          }
        });
      });
    };

    const init = () => {
      updateAiCreditsUI();
      setupHeroTabs();
      setupToolbar();
      loadOpenCv();
      setupPresets();
      updateDemoVideoOverlay();
      updateDemoTabs();

      if (drawCanvas && drawCanvas.parentElement) {
        const parent = drawCanvas.parentElement;
        parent.style.display = "flex";
        parent.style.justifyContent = "center";
        parent.style.alignItems = "center";
        parent.style.width = "100%";
        parent.style.height = "100%";
        parent.style.overflow = "hidden";

        drawCanvas.style.width = "100%";
        drawCanvas.style.height = "100%";
        drawCanvas.style.objectFit = "contain";
      }

      if (dotCountSlider) {
        dotCountSlider.max = "200";
        dotCountSlider.min = "5";
        dotCountSlider.value = "25";
      }

      if (thicknessSlider) {
        thicknessSlider.value = `${DEFAULT_CONFIG.eraseThickness}`;
        if (thicknessValue) thicknessValue.textContent = `${DEFAULT_CONFIG.eraseThickness}`;
      }

      const defaultPresetBtn = document.querySelector('.preset-btn-js[data-preset="easy"]');
      if (defaultPresetBtn) (defaultPresetBtn as HTMLElement).click();
    };

    if (heroFileInput) {
      heroFileInput.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) handleFile(target.files[0]);
      });
    }

    document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          toggleLoader(true, "Loading preset...");
          const src = (btn as HTMLElement).dataset.src;
          if (!src) return;
          const res = await fetch(src, { cache: "no-store" });
          const blob = await res.blob();

          switchView("editor");
          handleFile(new File([blob], "preset.webp", { type: blob.type }));
        } catch (e) {
          showTip("Failed to load preset.", "error");
          toggleLoader(false);
        }
      });
    });

    if (backToHomeBtn) backToHomeBtn.addEventListener("click", () => switchView("landing"));

    if (sidebarPngBtn) sidebarPngBtn.addEventListener("click", (e) => dl("png", e));
    if (sidebarPdfBtn) sidebarPdfBtn.addEventListener("click", (e) => dl("pdf", e));
    if (mobilePdfBtn) mobilePdfBtn.addEventListener("click", (e) => dl("pdf", e));
    if (mobilePngBtn) mobilePngBtn.addEventListener("click", (e) => dl("png", e));

    init();
  }, []);

  return null;
}