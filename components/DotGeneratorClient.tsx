"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { jsPDF } from "jspdf";

interface DotGeneratorProps {
  locale: string;
  user?: any;
}

interface DotGeneratorProps {
  locale: string;
  user?: any;
}

// 全局类型声明
declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: object) => void;
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

export default function DotGeneratorClient({
  locale,
  user,
}: DotGeneratorProps) {
  const router = useRouter();
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
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

    const showTip = (
      message: string,
      type: "info" | "success" | "error" = "info"
    ) => {
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
        const res = await fetch(RMBG_API_URL, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("API Error");
        return await res.blob();
      } catch (e) {
        console.error("BG Removal Failed:", e);
        throw e;
      }
    };

    const applyHighDefSketchLogic = async (
      imgEl: HTMLImageElement
    ): Promise<File> => {
      const cv = window.cv;
      const MAX_PROC_SIZE = 1500;
      let scaleToFit = Math.min(
        1.0,
        MAX_PROC_SIZE / Math.max(imgEl.width, imgEl.height)
      );

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

        let paddedSrc = new cv.Mat(
          origH,
          origW,
          cv.CV_8UC4,
          new cv.Scalar(255, 255, 255, 0)
        );
        mats.push(paddedSrc);

        let resizedInner = new cv.Mat();
        mats.push(resizedInner);
        cv.resize(
          src,
          resizedInner,
          new cv.Size(targetW, targetH),
          0,
          0,
          cv.INTER_AREA
        );

        let rect = new cv.Rect(offsetX, offsetY, targetW, targetH);
        let roi = paddedSrc.roi(rect);
        mats.push(roi);
        resizedInner.copyTo(roi);

        let bigW = origW * SKETCH_CONFIG.SuperScale;
        let bigH = origH * SKETCH_CONFIG.SuperScale;
        let bigSrc = new cv.Mat();
        mats.push(bigSrc);
        cv.resize(
          paddedSrc,
          bigSrc,
          new cv.Size(bigW, bigH),
          0,
          0,
          cv.INTER_CUBIC
        );

        let bigGray = new cv.Mat();
        mats.push(bigGray);
        cv.cvtColor(bigSrc, bigGray, cv.COLOR_RGBA2GRAY);

        let bigSketch = new cv.Mat();
        mats.push(bigSketch);
        let bigB = SKETCH_CONFIG.BlockSize * SKETCH_CONFIG.SuperScale;
        if (bigB % 2 === 0) bigB++;
        cv.adaptiveThreshold(
          bigGray,
          bigSketch,
          255,
          cv.ADAPTIVE_THRESH_GAUSSIAN_C,
          cv.THRESH_BINARY,
          bigB,
          SKETCH_CONFIG.C
        );

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
        cv.findContours(
          mask,
          contours,
          hierarchy,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_SIMPLE
        );
        for (let i = 0; i < contours.size(); ++i) {
          cv.drawContours(
            bigSketch,
            contours,
            i,
            new cv.Scalar(0, 0, 0, 255),
            SKETCH_CONFIG.SuperScale,
            cv.LINE_AA
          );
        }

        let finalSketch = new cv.Mat();
        mats.push(finalSketch);
        cv.resize(
          bigSketch,
          finalSketch,
          new cv.Size(origW, origH),
          0,
          0,
          cv.INTER_AREA
        );

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
              resolve(
                new File([blob], "processed_sketch.png", { type: "image/png" })
              );
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
          try {
            m.delete();
          } catch (i) {}
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
          const scale =
            Math.max(
              1,
              TARGET_MIN_WIDTH / Math.max(img.naturalWidth, img.naturalHeight)
            ) || 1;

          drawCanvas.width = Math.floor(img.naturalWidth * scale);
          drawCanvas.height = Math.floor(img.naturalHeight * scale);

          state.dots = [];
          state.history = [];
          state.internalHintImage = null;

          if (
            state.config.hint === "internal" &&
            typeof window.cv !== "undefined"
          ) {
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
        const processScale = Math.min(
          1,
          processWidth / Math.max(drawCanvas.width, drawCanvas.height)
        );

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
        cv.adaptiveThreshold(
          gray,
          binary,
          255,
          cv.ADAPTIVE_THRESH_GAUSSIAN_C,
          cv.THRESH_BINARY_INV,
          11,
          2
        );

        let M = cv.Mat.ones(3, 3, cv.CV_8U);
        cv.dilate(binary, binary, M);

        cv.findContours(
          binary,
          contours,
          hierarchy,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_NONE
        );

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
          cv.approxPolyDP(
            mainContour,
            approx,
            cv.arcLength(mainContour, true) * 0.001,
            true
          );

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

        const targetCount = dotCountSlider
          ? parseInt(dotCountSlider.value)
          : 25;
        state.dots =
          allPoints.length > 0 ? resampleDots(allPoints, targetCount) : [];

        saveHistory();
        redraw();
        updateDotCountUI();
      } catch (e) {
        console.error("Auto detect runtime error:", e);
      } finally {
        toggleLoader(false);
        if (userRef.current && state.dots.length > 0) {
          autoSavePuzzle();
        }
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
      return result.length < minCount
        ? interpolatePoints(result, minCount)
        : result;
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
        const t =
          segmentLength === 0
            ? 0
            : (targetDist - segmentStartDist) / segmentLength;

        newPoints.push({
          x:
            closedPoints[j].x + (closedPoints[j + 1].x - closedPoints[j].x) * t,
          y:
            closedPoints[j].y + (closedPoints[j + 1].y - closedPoints[j].y) * t,
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
        const w = drawCanvas!.width,
          h = drawCanvas!.height;
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
        cv.threshold(
          gray,
          binary,
          127,
          255,
          cv.THRESH_BINARY_INV | cv.THRESH_OTSU
        );
        cv.findContours(
          binary,
          contours,
          hierarchy,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_SIMPLE
        );

        const thickness = Math.max(2, state.config.eraseThickness * (w / 1000));
        cv.drawContours(
          src,
          contours,
          -1,
          new cv.Scalar(255, 255, 255, 255),
          thickness
        );

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
          ctx.drawImage(
            state.originalImage,
            0,
            0,
            drawCanvas.width,
            drawCanvas.height
          );
        } else if (state.config.hint === "internal") {
          ctx.drawImage(
            state.internalHintImage || state.originalImage,
            0,
            0,
            drawCanvas.width,
            drawCanvas.height
          );
        } else {
          ctx.drawImage(
            state.originalImage,
            0,
            0,
            drawCanvas.width,
            drawCanvas.height
          );
        }
        ctx.restore();
      }

      const scale = Math.max(0.5, drawCanvas.width / 1000);
      const r = state.config.dotRadius * scale;
      const fontSize = state.config.fontSize * scale;

      ctx.font = `bold ${fontSize}px Poppins, Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let centerX = 0,
        centerY = 0;
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

        const dx = dot.x - centerX || 1,
          dy = dot.y - centerY || 1;
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

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

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
      drawCanvas.addEventListener(
        "mousedown",
        handleInputStart as EventListener
      );
      drawCanvas.addEventListener(
        "mousemove",
        handleInputMove as EventListener
      );
      drawCanvas.addEventListener("mouseup", handleInputEnd);
      drawCanvas.addEventListener(
        "touchstart",
        handleInputStart as EventListener,
        { passive: false }
      );
      drawCanvas.addEventListener(
        "touchmove",
        handleInputMove as EventListener,
        { passive: false }
      );
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
          dotCountDisplay.textContent = `${
            (e.target as HTMLInputElement).value
          } Dots`;
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

        if (
          typeof window !== "undefined" &&
          window.confirm(
            "Are you sure you want to clear all dots? This cannot be undone."
          )
        ) {
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
    // ★ 2. AI 生成核心事件
    if (heroAiGoBtn) {
      // 注意：如果是未登录状态，上面的 onclick 会覆盖这个事件，这是正确的。
      heroAiGoBtn.addEventListener("click", async (e) => {
        if (!userRef.current) return;

        e.preventDefault();
        const prompt = heroAiInput?.value.trim() || "";
        if (prompt.length < 3)
          return showTip("Please enter a description.", "error");

        trackEvent("ai_generate_start", { prompt_length: prompt.length });

        heroAiGoBtn.disabled = true;
        heroAiGoBtn.innerHTML =
          '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

        switchView("editor");
        toggleLoader(true, "AI is creating your puzzle...");

        try {
          const token = localStorage.getItem("auth_token");
          const res = await fetch("/api/doubao", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              prompt:
                prompt +
                ", simple black and white line art, coloring book style, white background, no shading, clear outlines",
            }),
          });

          if (!res.ok) throw new Error("AI Generation failed");
          const blob = await res.blob();
          trackEvent("ai_generate_success");

          // 扣除积分
          const newCredits = (
            parseInt(userRef.current.credits, 10) - 1
          ).toString();
          userRef.current.credits = newCredits;
          localStorage.setItem("app_user", JSON.stringify(userRef.current));

          const aiFile = new File([blob], `ai_${Date.now()}.png`, {
            type: blob.type,
          });
          // 调用之前存在的 loadFileToCanvas 方法
          // loadFileToCanvas(aiFile);
        } catch (e: any) {
          trackEvent("ai_generate_fail", { error: e.message });

          showTip(e.message, "error");
          switchView("landing");
        } finally {
          toggleLoader(false);
        }
      });
    }

    // ★ 3. 下载后的 Upsell 弹窗
    const showUpsellTip = () => {
      const currentUser = userRef.current;
      if (String(currentUser?.plan || "free").toLowerCase() !== "free") return; // 付费用户不打扰

      const existingTip = document.getElementById("upsell-toast");
      if (existingTip) existingTip.remove();

      const toast = document.createElement("div");
      toast.id = "upsell-toast";
      toast.className = `fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl flex flex-col p-5 cursor-pointer transform transition-all duration-500 translate-y-[120%] border border-slate-700`;

      toast.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-brand-blue flex items-center gap-2">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    Download Complete!
                </h4>
                <button id="close-toast" class="text-slate-400 hover:text-white"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <p class="text-sm text-slate-300 mb-4">
                Want to remove the watermark and unlock extreme difficulty puzzles?
            </p>
            <a href="/pricing" class="bg-brand-blue text-center text-white font-bold py-2 rounded-lg hover:bg-indigo-600 transition">Upgrade to Premium</a>
        `;

      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.remove("translate-y-[120%]"));

      toast.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest("#close-toast")) {
          toast.classList.add("translate-y-[120%]");
          setTimeout(() => toast.remove(), 500);
        }
      });
      setTimeout(() => {
        toast.classList.add("translate-y-[120%]");
        setTimeout(() => toast.remove(), 500);
      }, 10000);
    };
    const dl = async (fmt: "png" | "pdf", event?: Event) => {
      if (!state.originalImage || !drawCanvas)
        return showTip("Please create a puzzle first!", "error");

      const activeBtn = event?.currentTarget as HTMLButtonElement | null;
      const originalText = activeBtn ? activeBtn.innerHTML : "";

      if (activeBtn) {
        activeBtn.disabled = true;
        activeBtn.innerHTML =
          '<span class="flex items-center gap-2"><svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</span>';
      }

      trackEvent("download_result", {
        file_format: fmt,
        dots_count: state.dots.length,
        hint_mode: state.config.hint,
      });

      try {
        const currentUser = userRef.current;
        const isPremium = currentUser && String(currentUser.plan || "free").toLowerCase() !== "free";

        if (fmt === "png") {
          await new Promise<void>((resolve) => {
            // ★ 核心逻辑：离屏渲染加水印
            let exportCanvas = drawCanvas;

            // 如果不是付费会员，克隆一个 Canvas 打水印
            if (!isPremium) {
              exportCanvas = document.createElement("canvas");
              exportCanvas.width = drawCanvas.width;
              exportCanvas.height = drawCanvas.height;
              const exportCtx = exportCanvas.getContext("2d");

              if (exportCtx) {
                // 1. 把原画板的内容复制过来
                exportCtx.drawImage(drawCanvas, 0, 0);

                // 2. 设置水印字体样式 (根据图片宽度自适应大小)
                const fontSize = Math.max(16, exportCanvas.width * 0.025);
                exportCtx.font = `bold ${fontSize}px sans-serif`;
                exportCtx.fillStyle = "rgba(150, 150, 150, 0.8)"; // 半透明浅灰色
                exportCtx.textAlign = "center";
                exportCtx.textBaseline = "bottom";

                // 3. 在图片正下方居中画上域名
                exportCtx.fillText(
                  "connectthedotsprintable.online",
                  exportCanvas.width / 2,
                  exportCanvas.height - fontSize / 2 // 距离底部留一点间距
                );
              }
            }

            // ★ 从带水印的临时 Canvas (或原 Canvas) 下载
            exportCanvas.toBlob((blob) => {
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
              resolve();
            }, "image/png");
          });
        } else if (fmt === "pdf") {
          // PDF 逻辑保持不变
          const isLandscape = drawCanvas!.width > drawCanvas!.height;
          const doc = new jsPDF({
            orientation: isLandscape ? "l" : "p",
            unit: "mm",
            format: "a4",
          });
          const pdfW = doc.internal.pageSize.getWidth();
          const pdfH = doc.internal.pageSize.getHeight();
          const ratio = Math.min(
            pdfW / drawCanvas!.width,
            pdfH / drawCanvas!.height
          );
          const w = drawCanvas!.width * ratio;
          const h = drawCanvas!.height * ratio;

          doc.addImage(
            drawCanvas!.toDataURL("image/png"),
            "PNG",
            (pdfW - w) / 2,
            (pdfH - h) / 2,
            w,
            h
          );

          // 非 Premium 用户强制加水印
          if (!isPremium) {
            doc.setFontSize(20);
            doc.setTextColor(150, 150, 150);
            doc.text(
              "Created by ConnectTheDotsPrintable.online",
              pdfW / 2,
              pdfH - 5,
              { align: "center" }
            );
          }

          doc.save("connect-dots.pdf");
        }

        // 触发 Upsell 弹窗 (引导付费去水印)
        setTimeout(showUpsellTip, 1500);
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        if (activeBtn) {
          activeBtn.disabled = false;
          activeBtn.innerHTML = originalText;
        }
      }
    };

    const saveToGallery = async () => {
      if (!state.originalImage || !drawCanvas)
        return showTip("Please create a puzzle first!", "error");
      if (!userRef.current) return showTip("Please login to save to gallery", "error");

      const title = prompt("Enter puzzle title:");
      if (!title) return;

      try {
        toggleLoader(true, "Saving to gallery...");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", "");
        formData.append("difficulty", "medium");
        formData.append("dotCount", state.dots.length.toString());
        formData.append("width", drawCanvas.width.toString());
        formData.append("height", drawCanvas.height.toString());
        formData.append("settings", JSON.stringify(state.config));

        const originalBlob = await new Promise<Blob>((resolve) => {
          const canvas = document.createElement("canvas");
          canvas.width = state.originalImage!.width;
          canvas.height = state.originalImage!.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(state.originalImage!, 0, 0);
          canvas.toBlob((blob) => resolve(blob!), "image/jpeg");
        });

        const puzzleBlob = await new Promise<Blob>((resolve) => {
          drawCanvas.toBlob((blob) => resolve(blob!), "image/png");
        });

        formData.append("originalImage", originalBlob, "original.jpg");
        formData.append("puzzleImage", puzzleBlob, "puzzle.png");

        const res = await fetch("/api/connect-dots/save", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          showTip("Saved successfully!", "success");
        } else {
          showTip("Failed to save", "error");
        }
      } catch (error) {
        showTip("Failed to save", "error");
      } finally {
        toggleLoader(false);
      }
    };

    const autoSavePuzzle = async () => {
      if (!state.originalImage || !drawCanvas) return;

      try {
        const formData = new FormData();
        formData.append("title", `Puzzle ${Date.now()}`);
        formData.append("description", "");
        formData.append("difficulty", "medium");
        formData.append("dotCount", state.dots.length.toString());
        formData.append("width", drawCanvas.width.toString());
        formData.append("height", drawCanvas.height.toString());
        formData.append("settings", JSON.stringify(state.config));

        const originalBlob = await new Promise<Blob>((resolve) => {
          const canvas = document.createElement("canvas");
          canvas.width = state.originalImage!.width;
          canvas.height = state.originalImage!.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(state.originalImage!, 0, 0);
          canvas.toBlob((blob) => resolve(blob!), "image/jpeg");
        });

        const puzzleBlob = await new Promise<Blob>((resolve) => {
          drawCanvas.toBlob((blob) => resolve(blob!), "image/png");
        });

        formData.append("originalImage", originalBlob, "original.jpg");
        formData.append("puzzleImage", puzzleBlob, "puzzle.png");

        const token = localStorage.getItem("auth_token");
        await fetch("/api/connect-dots/save", {
          method: "POST",
          body: formData,
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
      } catch (error) {
        console.error("Auto save failed:", error);
      }
    };

    let cvCallbacks: Array<() => void> = [];
    const loadOpenCv = (cb?: () => void) => {
      if (cvReady) {
        if (cb) cb();
        return;
      }
      if (cb) cvCallbacks.push(cb);
      if (document.querySelector('script[src*="opencv.js"]')) return;

      const script = document.createElement("script");
      script.src =
        "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/opencv.js";
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
    const setupAiHandler = () => {
      // 轮询检查按钮是否存在 (因为 React 渲染可能比这个 useEffect 慢一点点)
      const interval = setInterval(() => {
        const btn = getEl("hero-ai-go-btn");
        if (btn) {
          if (btn.getAttribute("data-listener-attached") === "true") {
            clearInterval(interval);
            return;
          }
          // 标记已绑定
          btn.setAttribute("data-listener-attached", "true");
          clearInterval(interval);

          // 绑定事件：只负责生成，不负责 UI 状态
          btn.addEventListener("click", async (e) => {
            e.preventDefault();

            // 双重保险
            if (!userRef.current || parseInt(userRef.current.credits) <= 0)
              return;

            const input = getEl("hero-ai-input") as HTMLInputElement;
            const prompt = input?.value.trim() || "";
            if (prompt.length < 2) {
              alert("Please enter a description.");
              return;
            }

            // 1. 设置 Loading
            const originalHtml = btn.innerHTML;
            btn.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
            (btn as HTMLButtonElement).disabled = true;

            // ★ 2. 修复图片不显示：先切换视图，确保 Canvas 可见
            switchView("editor");
            toggleLoader(true, "AI is creating your puzzle...");

            try {
              // 清空 Canvas 防止残影
              if (drawCanvas && ctx)
                ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

              const token = localStorage.getItem("auth_token");
              const res = await fetch("/api/doubao", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  prompt:
                    prompt +
                    ", simple black and white line art, coloring book style,pure white background,no paper texture, no shading, clear outlines",
                }),
              });

              if (!res.ok) throw new Error("AI Generation failed");
              const blob = await res.blob();

              if (blob.type.indexOf("image") === -1)
                throw new Error("Invalid image received");

              if (userRef.current) {
                const newCredits = (
                  parseInt(userRef.current.credits) - 1
                ).toString();
                userRef.current.credits = newCredits;
                localStorage.setItem(
                  "app_user",
                  JSON.stringify(userRef.current)
                );
                window.dispatchEvent(new CustomEvent("auth-updated"));
              }

              const aiFile = new File([blob], `ai_${Date.now()}.png`, {
                type: blob.type,
              });

              // ★ 3. 延迟一点点，给 DOM 渲染留出时间
              setTimeout(() => {
                loadFileToCanvas(aiFile);
              }, 100);
            } catch (e: any) {
              console.error(e);
              showTip(e.message, "error");
              switchView("landing"); // 失败回退
            } finally {
              toggleLoader(false);
              (btn as HTMLButtonElement).disabled = false;
              btn.innerHTML = originalHtml;
            }
          });
        }
      }, 500); // 每 500ms 检查一次
    };
    const setupHeroTabs = () => {
      // 由于我们在 HomeContent 里面控制了 AI 面板的显示，这里只需要处理 Upload 相关的逻辑
      // 或者保留原有的逻辑，只是这次我们不需要再手动 hidden panel-ai 了，因为 HomeContent 的 JSX 会处理

      // 为了兼容性，这里建议：只保留 Tab 点击的样式切换，内容的显隐交给 React 或保留原生逻辑
      const tabUpload = getEl("tab-upload");
      const tabAi = getEl("tab-ai");
      const tabBg = getEl("tab-bg");
      const panelUpload = getEl("panel-upload");
      const panelAi = getEl("panel-ai");

      if (tabUpload && tabAi && tabBg && panelUpload && panelAi) {
        tabUpload.onclick = () => {
          tabBg.style.transform = "translateX(0)";
          tabUpload.classList.replace("text-slate-500", "text-slate-800");
          tabAi.classList.replace("text-slate-800", "text-slate-500");
          panelAi.classList.add("hidden");
          panelUpload.classList.remove("hidden");
        };
        tabAi.onclick = () => {
          tabBg.style.transform = "translateX(100%)";
          tabAi.classList.replace("text-slate-500", "text-slate-800");
          tabUpload.classList.replace("text-slate-800", "text-slate-500");
          panelUpload.classList.add("hidden");
          panelAi.classList.remove("hidden");

          // 尝试绑定 AI 按钮（如果之前没绑上的话）
          setupAiHandler();
        };
      }
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
          if (btn.id === "tool-add" && !isActive)
            btn.classList.add("text-brand-blue");
        });
        if (drawCanvas)
          drawCanvas.style.cursor = tool === "move" ? "grab" : "crosshair";
      };

      if (toolAdd) toolAdd.addEventListener("click", () => setActive("add"));
      if (toolMove) toolMove.addEventListener("click", () => setActive("move"));
      if (toolDel) toolDel.addEventListener("click", () => setActive("del"));
      if (undoBtn) undoBtn.addEventListener("click", performUndo);
      setActive("add");
    };

    const setupPresets = () => {
      const presetConfigs: any = {
        easy: {
          count: 25,
          font: 28,
          dotRadius: 8,
          hint: "trace",
          desc: "Perfect for kids (20-30 dots, large font)",
        },
        medium: {
          count: 55,
          font: 20,
          dotRadius: 6,
          hint: "trace",
          desc: "Standard difficulty (50-60 dots)",
        },
        hard: {
          count: 90,
          font: 14,
          dotRadius: 4,
          hint: "trace",
          desc: "Expert challenge (80+ dots, no hints)",
        },
      };

      presetButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          presetButtons.forEach((b) => {
            b.classList.remove(
              "active",
              "border-brand-blue",
              "bg-indigo-50",
              "bg-indigo-50/50"
            );
            b.classList.add("border-transparent", "bg-slate-50");
            const span = b.querySelector("span:last-child");
            if (span)
              span.classList.replace("text-brand-blue", "text-slate-600");
          });

          btn.classList.add("active", "border-brand-blue", "bg-indigo-50");
          btn.classList.remove("border-transparent", "bg-slate-50");
          const span = btn.querySelector("span:last-child");
          if (span) span.classList.replace("text-slate-600", "text-brand-blue");

          const presetType = (btn as HTMLElement).dataset.preset;
          const config = presetConfigs[presetType || "easy"];

          if (dotCountSlider) {
            dotCountSlider.value = `${config.count}`;
            if (dotCountDisplay)
              dotCountDisplay.textContent = `${config.count} Dots`;
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
          for (let radio of radios as any) {
            if (radio.value === config.hint) {
              radio.checked = true;
              updateConfig("hint", config.hint);
              if (thicknessContainer) {
                config.hint === "internal"
                  ? thicknessContainer.classList.remove("hidden")
                  : thicknessContainer.classList.add("hidden");
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
      const pcVideo = document.getElementById(
        "demo-video-pc"
      ) as HTMLVideoElement | null;
      const mobileVideo = document.getElementById(
        "demo-video-mobile"
      ) as HTMLVideoElement | null;
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
      setupHeroTabs();
      setupToolbar();
      loadOpenCv();
      setupPresets();
      updateDemoVideoOverlay();
      updateDemoTabs();
      setupAiHandler();
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
        if (thicknessValue)
          thicknessValue.textContent = `${DEFAULT_CONFIG.eraseThickness}`;
      }

      const defaultPresetBtn = document.querySelector(
        '.preset-btn-js[data-preset="easy"]'
      );
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

    if (backToHomeBtn)
      backToHomeBtn.addEventListener("click", () => switchView("landing"));

    if (sidebarPngBtn)
      sidebarPngBtn.addEventListener("click", (e) => dl("png", e));
    if (sidebarPdfBtn)
      sidebarPdfBtn.addEventListener("click", (e) => dl("pdf", e));
    if (mobilePdfBtn)
      mobilePdfBtn.addEventListener("click", (e) => dl("pdf", e));
    if (mobilePngBtn)
      mobilePngBtn.addEventListener("click", (e) => dl("png", e));

    const saveGalleryBtn = getEl("save-to-gallery-btn");
    if (saveGalleryBtn) saveGalleryBtn.addEventListener("click", saveToGallery);

    init();
  }, []);

  return null;
}
