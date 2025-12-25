document.addEventListener("DOMContentLoaded", () => {
  // === State and Constants ===
  const MAX_WIDTH = 2480,
    MAX_HEIGHT = 3508;
  const DEFAULT_CONFIG = {
    type: "123",
    fontSize: 20,
    hint: "original",
    eraseThickness: 5,
    dotRadius: 5,
    dotColor: "#000000",
  };
  let state = {
    originalImage: null,
    canvasDimensions: { width: MAX_WIDTH, height: MAX_HEIGHT },
    dots: [],
    draggedDotIndex: -1,
    config: { ...DEFAULT_CONFIG },
    internalHintImage: null,
    pendingFile: null, // [New] Store file temporarily while user selects type
  };

  //  AI 每日限制逻辑
  const MAX_DAILY_LIMIT = 3;
  const STORAGE_KEY = 'ai_gen_daily_usage'; 

  const getUsageData = () => {
    const today = new Date().toLocaleDateString();
    let data = null;
    try { data = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) {}
    
    // 如果没有数据或日期不是今天，重置为0
    if (!data || data.date !== today) {
      data = { date: today, count: 0 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    return data;
  };

  const updateLimitUI = () => {
    const data = getUsageData();
    const remaining = Math.max(0, MAX_DAILY_LIMIT - data.count);
    
    // 1. 更新卡片右上角的数字
    const creditsLabel = document.getElementById('ai-credits-count');
    if (creditsLabel) creditsLabel.textContent = remaining;

    // 2. 处理卡片本身的状态 (遮罩和点击)
    const limitMask = document.getElementById('ai-limit-mask');
    const aiCard = document.getElementById('ai-choice-card');
    
    if (remaining === 0) {
      if (aiCard) {
        aiCard.classList.add('cursor-not-allowed', 'opacity-70');
        // 移除 hover 效果
        aiCard.classList.remove('hover:shadow-lg', 'hover:border-primary');
      }
      if (limitMask) {
        limitMask.classList.remove('hidden');
        limitMask.classList.add('flex');
      }
    } else {
      if (aiCard) {
        aiCard.classList.remove('cursor-not-allowed', 'opacity-70');
        aiCard.classList.add('hover:shadow-lg', 'hover:border-primary');
      }
      if (limitMask) {
        limitMask.classList.add('hidden');
        limitMask.classList.remove('flex');
      }
    }
  };

  const incrementUsage = () => {
    const data = getUsageData();
    if (data.count < MAX_DAILY_LIMIT) {
      data.count++;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      updateLimitUI(); // 立即更新 UI
    }
  };


  const getRenderScale = () => {
    if (!state.canvasDimensions || state.canvasDimensions.width === 0) return 1;
    return Math.max(1, state.canvasDimensions.width / 800);
  };

  // === DOM Element References ===
  const step1ChoiceArea = document.getElementById("step1-choice-area");
  const uploadChoiceCard = document.getElementById("upload-choice-card");
  const aiChoiceCard = document.getElementById("ai-choice-card");
  const actionUiContainer = document.getElementById("action-ui-container");
  const uploadTemplate = document.getElementById("upload-template");
  const aiGenerateTemplate = document.getElementById("ai-generate-template");
  const inspirationArea = document.getElementById("inspiration-area");

  // Modal References
  const imageTypeModal = document.getElementById("image-type-modal");
  const btnSelectPhoto = document.getElementById("btn-select-photo");
  const btnSelectDrawing = document.getElementById("btn-select-drawing");
  const rmbgLoader = document.getElementById("rmbg-loader");
  const modalActions = document.getElementById("modal-actions");

  const generatorMainArea = document.getElementById("generator-main-area");
  const sourceImageInfo = document.getElementById("source-image-info");
  const currentFilename = document.getElementById("current-filename");
  const changeImageBtn = document.getElementById("change-image-btn");
  const drawCanvas = document.getElementById("draw-canvas"),
    drawCtx = drawCanvas.getContext("2d");
  const canvasLoader = document.getElementById("canvas-loader");
  const pointsCounter = document.getElementById("points-counter");
  const clearBtn = document.getElementById("clear-btn");
  const hintTypeRadios = document.getElementById("hint-type-radios");
  const dotCountSlider = document.getElementById("dot-count-slider"),
    pointsNumberInput = document.getElementById("points-number-input");
  const pointsMinusBtn = document.getElementById("points-minus-btn"),
    pointsPlusBtn = document.getElementById("points-plus-btn");
  const fontSizeSlider = document.getElementById("font-size-slider"),
    fontSizeValue = document.getElementById("font-size-value");
  const thicknessContainer = document.getElementById("thickness-container"),
    thicknessSlider = document.getElementById("thicknessSlider"),
    thicknessValue = document.getElementById("thicknessValue");
  const dotSizeSlider = document.getElementById("dot-size-slider"),
    dotSizeValue = document.getElementById("dot-size-value");
  const dotColorPicker = document.getElementById("dot-color-picker");
  const downloadPngBtn = document.getElementById("download-png-btn"),
    downloadPdfBtn = document.getElementById("download-pdf-btn");
  const opencvStatus = document.getElementById("opencv-status");

  let imageLoader,
    dropZone,
    aiPromptInput,
    generateAiImageBtn,
    aiStatusArea,
    aiStatusMessage;

  // --- Utility Functions ---
  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };
  const getEventPos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };
  const distance = (p1, p2) =>
    Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  const getLabel = (index) =>
    state.config.type === "ABC"
      ? String.fromCharCode(65 + index)
      : (index + 1).toString();
  const updateClearButton = () => {
    if (clearBtn) clearBtn.disabled = state.dots.length === 0;
  };

  const drawDots = (context, dots, config = {}) => {
    const scale = getRenderScale();
    const scaledLineWidth = 1.5 * scale;
    dots.forEach((dot) => {
      context.beginPath();
      context.arc(dot.x, dot.y, config.radius * scale, 0, 2 * Math.PI);
      context.fillStyle = config.color;
      context.strokeStyle = "black";
      context.lineWidth = scaledLineWidth;
      context.fill();
      context.stroke();
    });
  };

  const calculateCentroid = (dots) => {
    if (dots.length === 0) {
      return {
        x: state.canvasDimensions.width / 2,
        y: state.canvasDimensions.height / 2,
      };
    }
    const total = dots.reduce(
      (acc, dot) => ({ x: acc.x + dot.x, y: acc.y + dot.y }),
      { x: 0, y: 0 }
    );
    return { x: total.x / dots.length, y: total.y / dots.length };
  };

  const drawNumbers = (context, dots, centroid) => {
    const scale = getRenderScale();
    const scaledFontSize = state.config.fontSize * scale;
    const scaledDotRadius = state.config.dotRadius * scale;
    context.fillStyle = "black";
    context.font = `${scaledFontSize}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    dots.forEach((dot, index) => {
      const dx = dot.x - centroid.x;
      const dy = dot.y - centroid.y;
      const magnitude = Math.sqrt(dx * dx + dy * dy);
      let nx = 0,
        ny = -1;
      if (magnitude > 0) {
        nx = dx / magnitude;
        ny = dy / magnitude;
      }
      const offset = scaledDotRadius + scaledFontSize * 0.75;
      const labelX = dot.x + nx * offset;
      const labelY = dot.y + ny * offset;
      context.fillText(getLabel(index), labelX, labelY);
    });
  };

  // --- Core Drawing ---
  const redrawDrawCanvas = () => {
    const context = drawCtx,
      canvas = drawCanvas;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (state.config.hint === "original" && state.originalImage) {
      context.drawImage(
        state.originalImage,
        0,
        0,
        state.canvasDimensions.width,
        state.canvasDimensions.height
      );
    } else if (state.config.hint === "trace" && state.originalImage) {
      context.globalAlpha = 0.3;
      context.drawImage(
        state.originalImage,
        0,
        0,
        state.canvasDimensions.width,
        state.canvasDimensions.height
      );
      context.globalAlpha = 1.0;
    } else if (state.config.hint === "internal" && state.internalHintImage) {
      context.drawImage(
        state.internalHintImage,
        0,
        0,
        state.canvasDimensions.width,
        state.canvasDimensions.height
      );
    }
    const centroid = calculateCentroid(state.dots);
    drawDots(context, state.dots, {
      color: state.config.dotColor,
      radius: state.config.dotRadius,
    });
    drawNumbers(context, state.dots, centroid);
    pointsCounter.textContent = state.dots.length;
    updateClearButton();
  };

  const updateConfigAndRedraw = () => {
    state.config.fontSize = parseInt(fontSizeSlider.value, 10);
    state.config.dotRadius = parseInt(dotSizeSlider.value, 10);
    state.config.dotColor = dotColorPicker.value;
    state.config.hint = document.querySelector(
      'input[name="hint-type"]:checked'
    ).value;
    state.config.eraseThickness = parseInt(thicknessSlider.value, 10);
    fontSizeValue.textContent = fontSizeSlider.value;
    dotSizeValue.textContent = dotSizeSlider.value;
    thicknessValue.textContent = thicknessSlider.value;
    thicknessContainer.classList.toggle(
      "hidden",
      state.config.hint !== "internal"
    );
    state.internalHintImage =
      state.config.hint === "internal" && typeof cv !== "undefined"
        ? generateInternalHintImage(state.config.eraseThickness)
        : null;
    redrawDrawCanvas();
  };

  const generateInternalHintImage = (thickness) => {
    if (!state.originalImage || typeof cv === "undefined") return null;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = state.canvasDimensions.width;
    tempCanvas.height = state.canvasDimensions.height;
    tempCanvas
      .getContext("2d")
      .drawImage(
        state.originalImage,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );
    let src,
      gray,
      binary,
      contours,
      hierarchy,
      resultMat = null;
    try {
      src = cv.imread(tempCanvas);
      resultMat = src.clone();
      gray = new cv.Mat();
      binary = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(
        gray,
        binary,
        127,
        255,
        cv.THRESH_BINARY_INV | cv.THRESH_OTSU
      );
      contours = new cv.MatVector();
      hierarchy = new cv.Mat();
      cv.findContours(
        binary,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );
      const scale = getRenderScale();
      cv.drawContours(
        resultMat,
        contours,
        -1,
        new cv.Scalar(255, 255, 255, 255),
        thickness * scale
      );
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = state.canvasDimensions.width;
      offscreenCanvas.height = state.canvasDimensions.height;
      cv.imshow(offscreenCanvas, resultMat);
      return offscreenCanvas;
    } catch (error) {
      console.error("Hint image generation error:", error);
      return null;
    } finally {
      if (src) src.delete();
      if (gray) gray.delete();
      if (binary) binary.delete();
      if (contours) contours.delete();
      if (hierarchy) hierarchy.delete();
      if (resultMat) resultMat.delete();
    }
  };

  const resetGeneratorState = () => {
    state.originalImage = null;
    state.dots = [];
    state.draggedDotIndex = -1;
    state.pendingFile = null;
    state.config = { ...DEFAULT_CONFIG };
    updatePointsValue(25, false);
    dotSizeSlider.value = DEFAULT_CONFIG.dotRadius;
    dotSizeValue.textContent = DEFAULT_CONFIG.dotRadius.toString();
    dotColorPicker.value = DEFAULT_CONFIG.dotColor;
    fontSizeSlider.value = DEFAULT_CONFIG.fontSize;
    fontSizeValue.textContent = DEFAULT_CONFIG.fontSize.toString();
    document.querySelector(
      'input[name="hint-type"][value="original"]'
    ).checked = true;
    generatorMainArea.classList.add("hidden");
    step1ChoiceArea.classList.remove("hidden");
    inspirationArea.classList.remove("hidden");
    actionUiContainer.innerHTML = "";
    uploadChoiceCard.classList.remove("border-primary");
    aiChoiceCard.classList.remove("border-primary");
    uploadChoiceCard.classList.add("border-gray-300");
    aiChoiceCard.classList.add("border-gray-300");
    sourceImageInfo.classList.add("hidden");
    if (clearBtn) clearBtn.disabled = true;
    downloadPngBtn.disabled = true;
    downloadPdfBtn.disabled = true;
    thicknessContainer.classList.add("hidden");
    redrawDrawCanvas();
  };

  // ============================================
  // [New Logic] File Handling & Modal Interception
  // ============================================

  // 1. Entry point: User selects file
  const handleFile = (file, isFromAI = false) => {
    if (!file || !file.type.startsWith("image/")) return;

    // If it's an AI image or example image, treat as simple drawing immediately
    if (isFromAI) {
      loadImageToCanvas(file);
      return;
    }

    // Store file and show modal for user decision
    state.pendingFile = file;
    imageTypeModal.classList.remove("hidden");
  };

  // 2. Logic to actually load the image into the editor (The "Old" handleFile logic)
  const loadImageToCanvas = (file) => {
    const reader = new FileReader();
    reader.onerror = () => alert("Error reading file.");
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => alert("Cannot load image file.");
      img.onload = () => {
        state.originalImage = img;
        const scale = Math.min(
          MAX_WIDTH / img.naturalWidth,
          MAX_HEIGHT / img.naturalHeight
        );
        state.canvasDimensions = {
          width: img.naturalWidth * scale,
          height: img.naturalHeight * scale,
        };
        drawCanvas.width = state.canvasDimensions.width;
        drawCanvas.height = state.canvasDimensions.height;
        state.dots = [];

        step1ChoiceArea.classList.add("hidden");
        inspirationArea.classList.add("hidden");
        generatorMainArea.classList.remove("hidden");
        currentFilename.textContent = file.name;
        sourceImageInfo.classList.remove("hidden");
        downloadPngBtn.disabled = false;
        downloadPdfBtn.disabled = false;

        if (opencvScriptLoaded) {
          canvasLoader.querySelector("p").textContent = "Auto-detecting...";
          runAutoDetect();
        } else {
          canvasLoader.classList.remove("hidden");
          canvasLoader.querySelector("p").textContent =
            "Waiting for generator to load...";
          loadOpenCv();
        }
        updateConfigAndRedraw();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // 3. Background Removal API Logic
  const removeBackgroundWithApi = async (file) => {
    const API_ENDPOINT = "https://ytdlp.vistaflyer.com/api/remove-background";

    // Actual Implementation structure assuming a standard multipart form endpoint
    try {
      const formData = new FormData();
      formData.append("file", file); // Adjust 'file' key based on your API requirements

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`API Error: ${response.status} - ${err}`);
      }

      return await response.blob();
    } catch (e) {
      throw e;
    }
  };

  // 4. Modal Event Listeners
  btnSelectDrawing.addEventListener("click", () => {
    imageTypeModal.classList.add("hidden");
    if (state.pendingFile) {
      loadImageToCanvas(state.pendingFile);
      state.pendingFile = null;
    }
  });

  btnSelectPhoto.addEventListener("click", async () => {
    if (!state.pendingFile) return;

    // Show loader state
    modalActions.classList.add("hidden");
    rmbgLoader.classList.remove("hidden");

    try {
      // Call the background removal interface
      const processedBlob = await removeBackgroundWithApi(state.pendingFile);

      // Create a new File object from the blob to pass to loader
      const processedFile = new File(
        [processedBlob],
        "processed_" + state.pendingFile.name,
        { type: "image/png" }
      );

      imageTypeModal.classList.add("hidden");
      loadImageToCanvas(processedFile);
    } catch (error) {
      console.error("Background removal failed:", error);
      alert(
        "Failed to remove background: " +
          error.message +
          ". Using original image."
      );
      imageTypeModal.classList.add("hidden");
      loadImageToCanvas(state.pendingFile);
    } finally {
      // Reset modal state
      modalActions.classList.remove("hidden");
      rmbgLoader.classList.add("hidden");
      state.pendingFile = null;
    }
  });

  // --- Auto-Detect Logic ---
  const runAutoDetect = () => {
    if (!state.originalImage || typeof cv === "undefined") {
      console.log("OpenCV not ready or no image, skipping auto-detect.");
      return;
    }
    canvasLoader.classList.remove("hidden");

    // 使用 requestAnimationFrame 或 setTimeout 给 UI 线程喘息时间，防止卡顿
    setTimeout(() => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = state.canvasDimensions.width;
      tempCanvas.height = state.canvasDimensions.height;
      const ctx = tempCanvas.getContext("2d");
      ctx.drawImage(
        state.originalImage,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );

      let src, gray, binary, contours, hierarchy, channels, alpha, kernel;
      try {
        src = cv.imread(tempCanvas);
        gray = new cv.Mat();
        binary = new cv.Mat();
        contours = new cv.MatVector();
        hierarchy = new cv.Mat();

        // 1. 处理透明通道或灰度 (保持你原有的逻辑，但增加了膨胀预处理)
        channels = new cv.MatVector();
        cv.split(src, channels);
        alpha = channels.get(3);
        let minMax = cv.minMaxLoc(alpha);

        if (minMax.minVal < 250) {
          // 透明图片：提取 Alpha 通道
          cv.threshold(alpha, binary, 10, 255, cv.THRESH_BINARY);
        } else {
          // 不透明图片：灰度化 + Otsu 阈值 + 反转
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
          cv.threshold(
            gray,
            binary,
            127,
            255,
            cv.THRESH_BINARY_INV | cv.THRESH_OTSU
          );
        }

        // --- 关键修复 1: 膨胀 (Dilation) ---
        // 这有助于连接断裂的线条，使非封闭轮廓更容易被识别为整体
        kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
        cv.dilate(binary, binary, kernel); // 膨胀操作

        // 2. 查找轮廓
        cv.findContours(
          binary,
          contours,
          hierarchy,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_SIMPLE
        );

        if (contours.size() === 0) throw new Error("No contours found.");

        // 3. 收集所有轮廓上的原始点
        let allRawPoints = [];
        for (let i = 0; i < contours.size(); i++) {
          const contour = contours.get(i);
          // 过滤掉太小的噪点
          if (
            cv.contourArea(contour) > 50 ||
            cv.arcLength(contour, false) > 50
          ) {
            // 使用极小的 epsilon 做一次多边形逼近，目的是平滑一下，但保留绝大多数形状细节
            const simplified = new cv.Mat();
            const perimeter = cv.arcLength(contour, true);
            cv.approxPolyDP(contour, simplified, perimeter * 0.005, true); // 0.005 意味着保留很高精度

            for (let j = 0; j < simplified.data32S.length; j += 2) {
              allRawPoints.push({
                x: simplified.data32S[j],
                y: simplified.data32S[j + 1],
              });
            }
            simplified.delete();
          }
        }

        if (allRawPoints.length === 0)
          throw new Error("No points found after filtering.");

        // --- 关键修复 2: 最近邻排序 (Nearest Neighbor Sorting) ---
        // 解决点乱跳的问题。从最上方的点开始，依次找最近的点。
        let sortedPoints = [];

        // 找到起始点（Y轴最小的点，即最上面的点）
        let startIndex = 0;
        let minY = Infinity;
        for (let i = 0; i < allRawPoints.length; i++) {
          if (allRawPoints[i].y < minY) {
            minY = allRawPoints[i].y;
            startIndex = i;
          }
        }

        // 开始排序
        let currentPoint = allRawPoints[startIndex];
        sortedPoints.push(currentPoint);
        allRawPoints.splice(startIndex, 1); // 移除已处理的点

        while (allRawPoints.length > 0) {
          let nearestIndex = -1;
          let minDist = Infinity;

          // 在剩余点中找最近的
          // 优化：为了性能，如果点非常多，这里可以用空间索引，但对于几千个点，暴力循环通常也没问题
          for (let i = 0; i < allRawPoints.length; i++) {
            const d =
              (currentPoint.x - allRawPoints[i].x) ** 2 +
              (currentPoint.y - allRawPoints[i].y) ** 2;
            if (d < minDist) {
              minDist = d;
              nearestIndex = i;
            }
          }

          // 如果最近的点距离太远（说明可能跳到了另一个不相关的断裂线条），可以做特殊处理
          // 这里为了简单，我们强制连接，这通常能解决大部分问题
          currentPoint = allRawPoints[nearestIndex];
          sortedPoints.push(currentPoint);
          allRawPoints.splice(nearestIndex, 1);
        }

        // --- 关键修复 3: 均匀采样 (Uniform Resampling) ---
        // 严格控制点数等于用户输入的值 (例如 25)
        const targetCount = parseInt(pointsNumberInput.value, 10) || 25;
        const finalDots = [];

        if (sortedPoints.length <= targetCount) {
          // 如果原始点比目标还少，就全部保留
          state.dots = sortedPoints;
        } else {
          // 如果原始点很多，按比例均匀抽取
          // 例如：总共 1000 个点，要 25 个，则每隔 40 个取一个
          const step = sortedPoints.length / targetCount;
          for (let i = 0; i < targetCount; i++) {
            const index = Math.min(
              Math.floor(i * step),
              sortedPoints.length - 1
            );
            finalDots.push(sortedPoints[index]);
          }
          state.dots = finalDots;
        }

        redrawDrawCanvas();
      } catch (error) {
        console.error("Processing error:", error);
        // 失败时不要弹窗打扰用户，通常是因为图片太复杂或完全空白
      } finally {
        // 内存清理 (非常重要，防止 OpenCV 内存泄漏)
        if (src) src.delete();
        if (gray) gray.delete();
        if (binary) binary.delete();
        if (contours) contours.delete();
        if (hierarchy) hierarchy.delete();
        if (channels) channels.delete();
        if (alpha) alpha.delete();
        if (kernel) kernel.delete();

        canvasLoader.classList.add("hidden");
      }
    }, 50);
  };
  const debouncedAutoDetect = debounce(runAutoDetect, 400);

  // --- OpenCV Loading ---
  let opencvScriptLoaded = false;
  const interactionEvents = ["scroll", "click", "touchstart", "keydown"];
  function onOpenCvReady() {
    if (opencvStatus) {
      opencvStatus.textContent = "Generator Ready!";
      opencvStatus.classList.remove("text-gray-400", "text-red-500");
      opencvStatus.classList.add("text-green-500");
    }
    if (dropZone) {
      dropZone.classList.remove(
        "opacity-50",
        "pointer-events-none",
        "cursor-not-allowed"
      );
      dropZone.style.cursor = "pointer";
      dropZone.style.opacity = "1";
      dropZone.style.pointerEvents = "auto";
      const label = dropZone.querySelector('label[for="image-loader"]');
      if (label) label.classList.remove("cursor-not-allowed");
    }
    opencvScriptLoaded = true;
    if (
      state.originalImage &&
      generatorMainArea.classList.contains("hidden") === false
    ) {
      console.log(
        "OpenCV is ready. Starting auto-detection for the pending image."
      );
      canvasLoader.querySelector("p").textContent = "Auto-detecting...";
      runAutoDetect();
    }
  }
  function removeInteractionListeners() {
    interactionEvents.forEach((event) => {
      document.removeEventListener(event, loadOpenCv);
    });
  }
  function loadOpenCv() {
    if (
      opencvScriptLoaded ||
      document.querySelector('script[src*="opencv.js"]')
    )
      return;
    if (opencvStatus) {
      opencvStatus.textContent = "Loading generator...";
      opencvStatus.classList.add("text-gray-500");
    }
    const script = document.createElement("script");
    script.src =
      "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/opencv.js";
    script.async = true;
    script.onload = onOpenCvReady;
    script.onerror = () => {
      if (opencvStatus) {
        opencvStatus.textContent = "Error: Failed to load generator.";
        opencvStatus.classList.add("text-red-500");
      }
      if (aiStatusMessage) {
        aiStatusMessage.textContent =
          "Error loading components. Please refresh.";
      }
    };
    document.body.appendChild(script);
    removeInteractionListeners();
  }
  function setupInteractionListeners() {
    interactionEvents.forEach((event) => {
      document.addEventListener(event, loadOpenCv, {
        once: true,
        passive: true,
      });
    });
  }
  if (opencvStatus) {
    opencvStatus.textContent = "Generator will load on first interaction...";
  }
  setupInteractionListeners();

  // --- AI Generation ---
  async function generateAiImageFromLocalBackend(userPrompt) {
    if (!aiStatusArea || !generateAiImageBtn || !aiStatusMessage) return;
    aiStatusArea.classList.remove("hidden");
    aiStatusArea.querySelector("#ai-loader").classList.remove("hidden");
    generateAiImageBtn.disabled = true;
    generateAiImageBtn.querySelector("#generate-button-text").textContent =
      "Generating...";
    aiStatusMessage.textContent = `Generating image for "${userPrompt}"... This may take a moment.`;
    const apiEndpoint = "https://connectthedotsprintable.online/api/doubao";
    const finalPrompt = `${userPrompt}, bold outline, simple line art, for coloring book, black and white, minimal shading, white background`;
    try {
      const imageResponse = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, size: "1024x1024" }),
      });
      if (!imageResponse.ok) {
        let errorText = "An unknown API error occurred.";
        try {
          const errorJson = await imageResponse.json();
          errorText =
            errorJson.error || errorJson.message || JSON.stringify(errorJson);
        } catch (e) {
          errorText = imageResponse.statusText;
        }
        throw new Error(`API Error: ${imageResponse.status} - ${errorText}`);
      }
      aiStatusMessage.textContent = "Processing image...";
      const blob = await imageResponse.blob();
      if (!blob.type.startsWith("image/")) {
        throw new Error("Received data is not a valid image.");
      }
      const filename = `AI_${userPrompt.substring(0, 15).replace(/\W/g, "_")}.${
        blob.type.split("/")[1] || "png"
      }`;
      const file = new File([blob], filename, { type: blob.type });
      // Pass flag true to indicate AI generation (skips modal)
      handleFile(file, true);
    } catch (error) {
      console.error("AI Generation Error:", error);
      aiStatusMessage.textContent = `Error: ${error.message}`;
    } finally {
      if (generateAiImageBtn) {
        generateAiImageBtn.disabled = false;
        generateAiImageBtn.querySelector("#generate-button-text").textContent =
          "Generate Image";
      }
      if (aiStatusArea) {
        aiStatusArea.querySelector("#ai-loader").classList.add("hidden");
      }
    }
  }

  // --- Setup UI ---
  function setupActionUI(type) {
    actionUiContainer.innerHTML = "";
    if (type === "upload") {
      actionUiContainer.appendChild(
        uploadTemplate.firstElementChild.cloneNode(true)
      );
      imageLoader = document.getElementById("image-loader");
      dropZone = document.getElementById("drop-zone");
      imageLoader.addEventListener("change", (e) =>
        handleFile(e.target.files[0])
      );
      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("bg-gray-100", "border-primary");
      });
      dropZone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dropZone.classList.remove("bg-gray-100", "border-primary");
      });
      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("bg-gray-100", "border-primary");
        handleFile(e.dataTransfer.files[0]);
      });
      if (opencvScriptLoaded) {
        dropZone.classList.remove(
          "opacity-50",
          "pointer-events-none",
          "cursor-not-allowed"
        );
        dropZone.style.cursor = "pointer";
        dropZone.style.opacity = "1";
        dropZone.style.pointerEvents = "auto";
        dropZone
          .querySelector('label[for="image-loader"]')
          .classList.remove("cursor-not-allowed");
      }
    } else if (type === "ai") {
      actionUiContainer.appendChild(
        aiGenerateTemplate.firstElementChild.cloneNode(true)
      );
      aiPromptInput = document.getElementById("ai-prompt-input");
      generateAiImageBtn = document.getElementById("generate-ai-image-btn");
      aiStatusArea = document.getElementById("ai-status-area");
      aiStatusMessage = document.getElementById("ai-status-message");
        // 生成按钮点击事件
      generateAiImageBtn.addEventListener("click", () => {
        const prompt = aiPromptInput.value.trim();
        
        if (prompt.length < 5) {
          alert("Please enter a longer, descriptive prompt.");
          return;
        }

        // 2.检查 OpenCV 是否加载
        if (!opencvScriptLoaded) {
          alert("Generator is still loading. Please wait for the 'Generator Ready!' message.");
          loadOpenCv();
          return;
        }

        // 3.检查每日限制
        const usage = getUsageData();
        if (usage.count >= MAX_DAILY_LIMIT) {
          alert("Daily limit reached (3/3). Please come back tomorrow!");
          updateLimitUI(); // 再次确保 UI 同步
          return;
        }

        // 4.扣除次数并开始生成
        incrementUsage(); 
        generateAiImageFromLocalBackend(prompt);
      });
    } 
  }

  uploadChoiceCard.addEventListener("click", () => {
    uploadChoiceCard.classList.remove("border-gray-300");
    uploadChoiceCard.classList.add("border-primary");
    aiChoiceCard.classList.remove("border-primary");
    aiChoiceCard.classList.add("border-gray-300");
    setupActionUI("upload");
  });
  aiChoiceCard.addEventListener("click", () => {
     if (getUsageData().count >= MAX_DAILY_LIMIT) {
      return; 
    }
    aiChoiceCard.classList.remove("border-gray-300");
    aiChoiceCard.classList.add("border-primary");
    uploadChoiceCard.classList.remove("border-primary");
    uploadChoiceCard.classList.add("border-gray-300");
    setupActionUI("ai");
  });

  const exampleImages = document.querySelectorAll("#examples-content img");
  async function handleExampleImageClick(event) {
    const imgElement = event.currentTarget;
    const imageUrl = imgElement.src;
    const filename = imageUrl.split("/").pop() || "example-image.webp";
    try {
      const response = await fetch(imageUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type });
      handleFile(file, true); // Treat examples like AI (skip modal)
    } catch (error) {
      console.error("Error fetching example image:", error);
      alert("Could not load the example image. Please check your connection.");
    }
  }
  exampleImages.forEach((img) =>
    img.addEventListener("click", handleExampleImageClick)
  );

  if (changeImageBtn)
    changeImageBtn.addEventListener("click", resetGeneratorState);

  const updatePointsValue = (value, triggerDetect = true) => {
    let numValue = parseInt(value, 10);
    if (isNaN(numValue)) numValue = 25;
    const min = parseInt(dotCountSlider.min, 10);
    const max = parseInt(dotCountSlider.max, 10);
    numValue = Math.max(min, Math.min(max, numValue));
    dotCountSlider.value = numValue;
    pointsNumberInput.value = numValue;
    if (state.originalImage && triggerDetect) debouncedAutoDetect();
  };
  pointsMinusBtn.addEventListener("click", () =>
    updatePointsValue(parseInt(pointsNumberInput.value, 10) - 1)
  );
  pointsPlusBtn.addEventListener("click", () =>
    updatePointsValue(parseInt(pointsNumberInput.value, 10) + 1)
  );
  dotCountSlider.addEventListener("input", (e) =>
    updatePointsValue(e.target.value)
  );
  pointsNumberInput.addEventListener("input", (e) =>
    updatePointsValue(e.target.value, false)
  );
  pointsNumberInput.addEventListener("blur", (e) => {
    if (e.target.value === "") updatePointsValue(25);
    else updatePointsValue(e.target.value);
  });
  [
    fontSizeSlider,
    dotSizeSlider,
    dotColorPicker,
    hintTypeRadios,
    thicknessSlider,
  ].forEach((el) => el.addEventListener("input", updateConfigAndRedraw));
  clearBtn.addEventListener("click", () => {
    if (state.originalImage) {
      state.dots = [];
      updateConfigAndRedraw();
    }
  });

  // Canvas Interactions
  let lastTapTime = 0,
    aDotWasJustDeleted = false;
  const handleDrawStart = (e) => {
    if (!state.originalImage) return;
    e.preventDefault();
    aDotWasJustDeleted = false;
    const currentTime = new Date().getTime();
    if (currentTime - lastTapTime < 300) {
      const pos = getEventPos(drawCanvas, e);
      const dotIndexToDelete = state.dots.findIndex(
        (dot) => distance(dot, pos) < state.config.dotRadius + 10
      );
      if (dotIndexToDelete !== -1) {
        state.dots.splice(dotIndexToDelete, 1);
        redrawDrawCanvas();
        aDotWasJustDeleted = true;
      }
      lastTapTime = 0;
      return;
    }
    lastTapTime = currentTime;
    const pos = getEventPos(drawCanvas, e);
    state.draggedDotIndex = state.dots.findIndex(
      (dot) => distance(dot, pos) < state.config.dotRadius + 10
    );
    if (state.draggedDotIndex !== -1) drawCanvas.style.cursor = "grabbing";
  };
  const handleDrawMove = (e) => {
    if (state.draggedDotIndex === -1) return;
    e.preventDefault();
    state.dots[state.draggedDotIndex] = getEventPos(drawCanvas, e);
    redrawDrawCanvas();
  };
  const handleDrawEnd = (e) => {
    if (
      state.draggedDotIndex === -1 &&
      state.originalImage &&
      !aDotWasJustDeleted
    ) {
      const clientX = e.changedTouches
        ? e.changedTouches[0].clientX
        : e.clientX;
      const clientY = e.changedTouches
        ? e.changedTouches[0].clientY
        : e.clientY;
      const rect = drawCanvas.getBoundingClientRect();
      state.dots.push({
        x: (clientX - rect.left) * (drawCanvas.width / rect.width),
        y: (clientY - rect.top) * (drawCanvas.height / rect.height),
      });
    }
    state.draggedDotIndex = -1;
    drawCanvas.style.cursor = "crosshair";
    redrawDrawCanvas();
  };
  drawCanvas.addEventListener("mousedown", handleDrawStart);
  drawCanvas.addEventListener("mousemove", handleDrawMove);
  drawCanvas.addEventListener("mouseup", handleDrawEnd);
  drawCanvas.addEventListener("touchstart", handleDrawStart, {
    passive: false,
  });
  drawCanvas.addEventListener("touchmove", handleDrawMove, { passive: false });
  drawCanvas.addEventListener("touchend", handleDrawEnd);

  const handleDownload = (format) => {
    const canvas = drawCanvas,
      filename = `connect-the-dots.${format}`;
    if (format === "png") {
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else if (format === "pdf") {
      if (typeof window.jspdf === "undefined") {
        alert("PDF library is not loaded yet.");
        return;
      }
      const { jsPDF } = window.jspdf;
      const imgData = canvas.toDataURL("image/png");
      const orientation = canvas.width > canvas.height ? "l" : "p";
      const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const widthRatio = pageWidth / canvas.width;
      const heightRatio = pageHeight / canvas.height;
      const ratio = widthRatio < heightRatio ? widthRatio : heightRatio;
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      doc.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      doc.save(filename);
    }
  };
  downloadPngBtn.addEventListener("click", () => handleDownload("png"));
  downloadPdfBtn.addEventListener("click", () => handleDownload("pdf"));

  resetGeneratorState();
   updateLimitUI();
});

document.addEventListener("DOMContentLoaded", function () {
    const downloadBtns = ["download-png-btn", "download-pdf-btn"];
  
    downloadBtns.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", function () {
          console.log("Download triggered: " + id);
          // 这里的延迟是为了让浏览器先处理下载弹窗，再显示提示
          setTimeout(() => {
            showSuccessToast();
          }, 1000);
        });
      }
    });
  
    function showSuccessToast() {
      if (document.getElementById('success-toast-node')) return;
  
      // 创建 Toast 元素
      const toast = document.createElement("div");
      toast.id = "success-toast-node";
      
      Object.assign(toast.style, {
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '999999',
        backgroundColor: 'white',
        border: '1px solid #bbf7d0',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: '0.5rem',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        minWidth: '280px',
        transition: 'all 0.5s ease'
      });
  
      toast.innerHTML = `
        <div style="background-color: #f0fdf4; border-radius: 9999px; padding: 4px;">
          <svg style="width: 20px; height: 20px; color: #16a34a;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div style="flex-grow: 1;">
          <p style="margin: 0; font-size: 14px; font-weight: 700; color: #1f2937;">Download Started!</p>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">Love this tool? <a href="https://ko-fi.com/connectthedotsprintable" target="_blank" style="color: #4f46e5; text-decoration: underline; font-weight: bold;">Buy us a crayon!</a></p>
        </div>
        <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#9ca3af; cursor:pointer; font-size:18px;">&times;</button>
      `;
  
      document.body.appendChild(toast);
  
      toast.animate([
        { transform: 'translateX(-50%) translateY(-20px)', opacity: 0 },
        { transform: 'translateX(-50%) translateY(0)', opacity: 1 }
      ], {
        duration: 500,
        easing: 'ease-out'
      });
  
      // 6秒后自动移除
      setTimeout(() => {
        if (toast.parentElement) {
          toast.style.opacity = "0";
          toast.style.transform = "translateX(-50%) translateY(-20px)";
          setTimeout(() => toast.remove(), 500);
        }
      }, 6000);
    }
  });