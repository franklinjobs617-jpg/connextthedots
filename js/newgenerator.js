document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. CONFIG & STATE / 配置与状态
    // ==========================================
    const DEFAULT_CONFIG = {
        fontSize: 20,
        dotRadius: 6,
        dotColor: "#000000",
        // --- 修改点：默认选中 Internal Lines，橡皮擦大小 11 ---
        hint: "internal",
        eraseThickness: 11
    };

    let state = {
        originalImage: null,
        internalHintImage: null,
        dots: [],
        history: [],
        activeTool: 'add',
        draggedDotIndex: -1,
        config: { ...DEFAULT_CONFIG },
        pendingFile: null
    };

    let cvReady = false; // 全局 OpenCV 就绪标志
    let debounceTimer = null; // 用于防抖的计时器
    const MAX_DAILY_LIMIT = 3;
    const STORAGE_KEY = 'ai_gen_daily_usage';

    // ==========================================
    // 2. DOM ELEMENTS
    // ==========================================
    const getEl = (id) => document.getElementById(id);

    // Views
    const landingView = getEl("landing-view");
    const editorView = getEl("editor-view");
    const backToHomeBtn = getEl("back-to-home");

    // Landing UI
    const tabUpload = getEl("tab-upload");
    const tabAi = getEl("tab-ai");
    const tabBg = getEl("tab-bg");
    const panelUpload = getEl("panel-upload");
    const panelAi = getEl("panel-ai");
    const heroFileInput = getEl("hero-file-input");
    const heroAiInput = getEl("hero-ai-input");
    const heroAiGoBtn = getEl("hero-ai-go-btn");
    const heroAiCredits = getEl("hero-ai-credits");

    // Modals
    const imageTypeModal = getEl("image-type-modal");
    const btnSelectPhoto = getEl("btn-select-photo");
    const btnSelectDrawing = getEl("btn-select-drawing");
    const rmbgLoader = getEl("rmbg-loader");
    const modalActions = getEl("modal-actions");

    // Editor
    const drawCanvas = getEl("draw-canvas");
    const ctx = drawCanvas ? drawCanvas.getContext("2d") : null;
    const canvasLoader = getEl("canvas-loader");

    // Toolbar
    const toolAdd = getEl("tool-add");
    const toolMove = getEl("tool-move");
    const toolDel = getEl("tool-del");
    const undoBtn = getEl("undo-btn");

    // Controls
    const dotCountSlider = getEl("dot-count-slider");
    const dotCountDisplay = getEl("dot-count-display");
    const pointsMinusBtn = getEl("points-minus-btn");
    const pointsPlusBtn = getEl("points-plus-btn");
    const pointsNumberInput = getEl("points-number-input"); // 虽然隐藏，但逻辑中会用到

    const fontSizeSlider = getEl("font-size-slider");
    const fontSizeValue = getEl("font-size-value");
    const dotSizeSlider = getEl("dot-size-slider");
    const dotSizeValue = getEl("dot-size-value");
    const dotColorPicker = getEl("dot-color-picker");

    const hintRadios = document.querySelectorAll('input[name="hint-type"]');
    const thicknessContainer = getEl("thickness-container");
    const thicknessSlider = getEl("thicknessSlider");
    const thicknessValue = getEl("thicknessValue");

    const clearBtn = getEl("clear-btn");
    const downloadPngBtn = getEl("download-png-btn");
    const downloadPdfBtn = getEl("download-pdf-btn");

    // ==========================================
    // 3. UI UTILS (TOAST & INLINE TIPS)
    // ==========================================

    // 显示顶部提示框
    const showTip = (message, type = 'info') => {
        const oldTip = document.getElementById('custom-tip');
        if (oldTip) oldTip.remove();

        const tip = document.createElement('div');
        tip.id = 'custom-tip';

        let bgClass = 'bg-slate-800';
        let iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';

        if (type === 'error') {
            bgClass = 'bg-red-500';
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        } else if (type === 'success') {
            bgClass = 'bg-green-500';
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        }

        tip.className = `fixed top-24 left-1/2 -translate-x-1/2 z-[9999] ${bgClass} text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 opacity-0`;
        tip.innerHTML = `${iconSvg} <span class="font-medium text-sm">${message}</span>`;

        document.body.appendChild(tip);

        requestAnimationFrame(() => {
            tip.classList.remove('opacity-0');
            tip.classList.add('opacity-100', 'translate-y-2');
        });

        setTimeout(() => {
            tip.classList.remove('opacity-100', 'translate-y-2');
            tip.classList.add('opacity-0');
            setTimeout(() => tip.remove(), 300);
        }, 3000);
    };

    // 处理分享解锁逻辑
    const handleShareUnlock = () => {
        const data = getAiUsage();
        const today = new Date().toLocaleDateString();

        if (data.shareDate === today) {
            showTip("You have already claimed today's bonus!", "info");
            updateAiCreditsUI();
            return;
        }

        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent("Check out this Free Connect the Dots Generator!");
        // 在新窗口打开 Reddit 分享
        window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank');

        // 增加额度
        data.extra = (data.extra || 0) + 3;
        data.shareDate = today;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

        updateAiCreditsUI();
        showTip("Success! 3 credits added.", 'success');
    };

    // ==========================================
    // 4. INITIALIZATION / 初始化
    // ==========================================

    const init = () => {
        updateAiCreditsUI();
        setupHeroTabs();
        setupToolbar();
        // 尝试预加载 OpenCV，但不阻塞
        loadOpenCv();

        // 强制设置 Canvas 父容器样式，确保居中
        if (drawCanvas && drawCanvas.parentElement) {
            const parent = drawCanvas.parentElement;
            parent.style.display = "flex";
            parent.style.justifyContent = "center";
            parent.style.alignItems = "center";
            parent.style.width = "100%";
            parent.style.height = "100%";
            parent.style.overflow = "hidden";

            drawCanvas.style.maxWidth = "100%";
            drawCanvas.style.maxHeight = "100%";
            drawCanvas.style.width = "auto";
            drawCanvas.style.height = "auto";
            drawCanvas.style.objectFit = "contain";
            drawCanvas.style.display = "block";
        }

        // 初始化滑块范围
        if (dotCountSlider) {
            dotCountSlider.max = 200;
            dotCountSlider.min = 5;
            dotCountSlider.value = 25;
        }

        // --- 初始化 UI 状态以匹配默认配置 ---
        if (thicknessSlider) {
            thicknessSlider.value = DEFAULT_CONFIG.eraseThickness;
            if (thicknessValue) thicknessValue.textContent = DEFAULT_CONFIG.eraseThickness;
        }

        if (thicknessContainer && DEFAULT_CONFIG.hint === 'internal') {
            thicknessContainer.classList.remove('hidden');
        }

        const defaultRadio = document.querySelector(`input[name="hint-type"][value="${DEFAULT_CONFIG.hint}"]`);
        if (defaultRadio) defaultRadio.checked = true;
    };

    const setupHeroTabs = () => {
        if (!tabUpload || !tabAi) return;

        tabUpload.addEventListener("click", () => {
            tabBg.style.transform = 'translateX(0)';
            tabUpload.classList.replace('text-slate-500', 'text-white');
            tabAi.classList.replace('text-white', 'text-slate-500');
            panelAi.classList.replace('active', 'inactive');
            panelUpload.classList.replace('inactive', 'active');
        });

        tabAi.addEventListener("click", () => {
            tabBg.style.transform = 'translateX(100%)';
            tabUpload.classList.replace('text-white', 'text-slate-500');
            tabAi.classList.replace('text-slate-500', 'text-white');
            panelUpload.classList.replace('active', 'inactive');
            panelAi.classList.replace('inactive', 'active');
            setTimeout(() => heroAiInput?.focus(), 100);
        });
    };

    const switchView = (view) => {
        if (view === 'editor') {
            landingView.classList.add('hidden');
            editorView.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            editorView.classList.add('hidden');
            landingView.classList.remove('hidden');
            resetState();
        }
    };

    if (backToHomeBtn) backToHomeBtn.addEventListener("click", () => switchView('landing'));

    const resetState = () => {
        state.originalImage = null;
        state.internalHintImage = null;
        state.dots = [];
        state.history = [];
        if (heroFileInput) heroFileInput.value = "";
    };

    // ==========================================
    // 5. FILE HANDLING / 文件处理
    // ==========================================

    const handleFile = (file, isProcessed = false) => {
        if (!file || !file.type.startsWith('image/')) return showTip("Please upload a valid image file.", "error");

        // --- 逻辑：直接进入画布，不弹窗 ---
        loadFileToCanvas(file);
    };

    const loadFileToCanvas = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                state.originalImage = img;
                drawCanvas.width = img.naturalWidth;
                drawCanvas.height = img.naturalHeight;
                state.dots = [];
                state.history = [];
                state.internalHintImage = null;

                switchView('editor');

                // --- 预生成内部线条提示 ---
                if (state.config.hint === 'internal' && typeof cv !== 'undefined') {
                    setTimeout(() => {
                        state.internalHintImage = generateInternalHintImage();
                        redraw();
                    }, 50);
                } else {
                    redraw();
                }

                // --- 开始自动检测 ---
                canvasLoader.classList.remove('hidden');
                const startDetect = () => setTimeout(runAutoDetect, 200);

                if (typeof cv !== 'undefined') startDetect();
                else loadOpenCv(startDetect);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    if (heroFileInput) heroFileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    // 示例图片点击
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                const res = await fetch(btn.dataset.src, { cache: "no-store" });
                const blob = await res.blob();
                handleFile(new File([blob], "preset.webp", { type: blob.type }), true);
            } catch (e) {
                showTip("Failed to load preset.", "error");
            }
        });
    });

    // 模态框按钮逻辑（虽然 handleFile 跳过了模态框，但保留逻辑以备不时之需）
    if (btnSelectDrawing) btnSelectDrawing.addEventListener('click', () => {
        imageTypeModal.classList.add('hidden');
        if (state.pendingFile) loadFileToCanvas(state.pendingFile);
    });

    if (btnSelectPhoto) btnSelectPhoto.addEventListener('click', async () => {
        modalActions.classList.add('hidden');
        rmbgLoader.classList.remove('hidden');
        try {
            const formData = new FormData();
            formData.append("file", state.pendingFile);
            const res = await fetch("https://ytdlp.vistaflyer.com/api/remove-background", { method: "POST", body: formData });
            if (!res.ok) throw new Error();
            const blob = await res.blob();
            loadFileToCanvas(new File([blob], "nobg.png", { type: "image/png" }));
        } catch (e) {
            showTip("Background removal failed, using original.", "error");
            loadFileToCanvas(state.pendingFile);
        } finally {
            imageTypeModal.classList.add('hidden');
            modalActions.classList.remove('hidden');
            rmbgLoader.classList.add('hidden');
        }
    });

    // AI 生成逻辑
    if (heroAiGoBtn) heroAiGoBtn.addEventListener('click', async () => {
        const prompt = heroAiInput.value.trim();

        if (prompt.length < 3) return showTip("Please enter a description.", "error");

        const usage = getAiUsage();
        const currentLimit = MAX_DAILY_LIMIT + (usage.extra || 0);

        if (usage.count >= currentLimit) {
            showTip("Daily limit reached. Share below to unlock!", "info");
            return;
        }

        const originalHtml = heroAiGoBtn.innerHTML;
        heroAiGoBtn.disabled = true;
        heroAiGoBtn.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

        switchView('editor');
        if (canvasLoader) {
            canvasLoader.classList.remove('hidden');
            const loaderText = canvasLoader.querySelector('p');
            if (loaderText) loaderText.textContent = "AI is creating your puzzle...";
        }
        if (ctx && drawCanvas) ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

        try {
            const res = await fetch("https://connectthedotsprintable.online/api/doubao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: prompt + ", simple black and white line art, coloring book style, white background",
                    size: "1024x1024"
                })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || res.statusText);
            }

            const blob = await res.blob();
            incrementAiUsage();

            const loaderText = canvasLoader.querySelector('p');
            if (loaderText) loaderText.textContent = "Creating magic...";

            loadFileToCanvas(new File([blob], "ai.png", { type: blob.type }));

        } catch (e) {
            console.error("AI Gen Error:", e);
            showTip("AI Generation failed. Please try again.", "error");
            switchView('landing');
            if (canvasLoader) canvasLoader.classList.add('hidden');
        } finally {
            heroAiGoBtn.innerHTML = originalHtml;
            heroAiGoBtn.disabled = false;
        }
    });

    // ==========================================
    // 6. OPENCV LOGIC / OpenCV 逻辑
    // ==========================================

    const loadOpenCv = (cb) => {
        // 1. 如果已经准备好，直接回调
        if (cvReady) {
            if (cb) cb();
            return;
        }

        // 2. 检查是否已经有 script 标签但还没 ready
        if (document.querySelector('script[src*="opencv.js"]')) {
            if (typeof cv !== 'undefined' && !cvReady) {
                cv['onRuntimeInitialized'] = () => {
                    cvReady = true;
                    console.log("OpenCV Ready (Late Bind)");
                    if (cb) cb();
                };
            }
            return;
        }

        // 3. 首次加载
        const script = document.createElement('script');
        script.src = "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/opencv.js";
        script.async = true;

        // 关键：在全局 cv 对象被创建前定义配置
        window.Module = {
            onRuntimeInitialized: function () {
                cvReady = true;
                console.log("OpenCV Ready!");
                if (cb) cb();
                // 如果当前有等待处理的图片，重新触发检测
                if (state.originalImage) {
                    canvasLoader.classList.remove('hidden');
                    runAutoDetect();
                }
            }
        };

        document.body.appendChild(script);
    };

    const runAutoDetect = () => {
        // 安全检查 1: 图片是否加载
        if (!state.originalImage) return;

        // 安全检查 2: OpenCV 是否完全就绪
        if (typeof cv === 'undefined' || !cvReady) {
            console.log("OpenCV not ready yet, waiting...");
            canvasLoader.classList.remove('hidden');
            const loaderText = canvasLoader.querySelector('p');
            if (loaderText) loaderText.textContent = "Loading Engine...";

            // 500ms 后重试
            setTimeout(runAutoDetect, 500);
            return;
        }

        try {
            // 恢复 Loading 文字
            const loaderText = canvasLoader.querySelector('p');
            if (loaderText) loaderText.textContent = "Processing lines...";

            const tempCanvas = document.createElement("canvas");

            // 安全检查 3: 确保尺寸是整数
            const processScale = Math.min(1, 1000 / Math.max(state.originalImage.naturalWidth, state.originalImage.naturalHeight));
            const w = Math.floor(state.originalImage.naturalWidth * processScale);
            const h = Math.floor(state.originalImage.naturalHeight * processScale);

            if (w === 0 || h === 0) return;

            tempCanvas.width = w;
            tempCanvas.height = h;

            const tCtx = tempCanvas.getContext("2d");
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

            let allPoints = [];
            let maxArea = 0;
            let maxContourIndex = -1;

            for (let i = 0; i < contours.size(); i++) {
                let cnt = contours.get(i);
                if (cv.contourArea(cnt) > 100) {
                    if (cv.contourArea(cnt) > maxArea) {
                        maxArea = cv.contourArea(cnt);
                        maxContourIndex = i;
                    }
                }
            }

            if (maxContourIndex !== -1) {
                let mainContour = contours.get(maxContourIndex);
                let approx = new cv.Mat();
                cv.approxPolyDP(mainContour, approx, cv.arcLength(mainContour, true) * 0.001, true);

                for (let j = 0; j < approx.rows; j++) {
                    allPoints.push({
                        x: approx.data32S[j * 2] / processScale,
                        y: approx.data32S[j * 2 + 1] / processScale
                    });
                }
                approx.delete();
            }

            // Memory Cleanup
            src.delete(); gray.delete(); binary.delete(); contours.delete(); hierarchy.delete(); M.delete();

            const targetCount = parseInt(dotCountSlider.value) || 25;

            if (allPoints.length > 0) {
                state.dots = resampleDots(allPoints, targetCount);
            } else {
                state.dots = [];
            }

            saveHistory();
            redraw();
            dotCountDisplay.textContent = `${state.dots.length} Dots`;

        } catch (e) {
            console.error("Auto detect runtime error:", e);
        } finally {
            canvasLoader.classList.add('hidden');
        }
    };


    const resampleDots = (points, targetCount) => {
        if (points.length < 2) return points;
        if (points.length < targetCount * 2) {
            points = interpolatePoints(points, targetCount * 3);
        }

        const closedPoints = [...points, points[0]];
        let totalLength = 0;
        const cumLengths = [0];

        for (let i = 0; i < closedPoints.length - 1; i++) {
            const dist = Math.hypot(closedPoints[i + 1].x - closedPoints[i].x, closedPoints[i + 1].y - closedPoints[i].y);
            totalLength += dist;
            cumLengths.push(totalLength);
        }

        const step = totalLength / targetCount;
        const newPoints = [];

        for (let i = 0; i < targetCount; i++) {
            const targetDist = i * step;
            let j = 0;
            while (j < cumLengths.length - 1 && cumLengths[j + 1] < targetDist) {
                j++;
            }

            const segmentStartDist = cumLengths[j];
            const segmentLength = cumLengths[j + 1] - cumLengths[j];
            const t = (segmentLength === 0) ? 0 : (targetDist - segmentStartDist) / segmentLength;

            const p1 = closedPoints[j];
            const p2 = closedPoints[j + 1];

            newPoints.push({
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t
            });
        }
        return newPoints;
    };

    const interpolatePoints = (points, minCount) => {
        let result = [];
        for (let i = 0; i < points.length - 1; i++) {
            result.push(points[i]);
            const p1 = points[i];
            const p2 = points[i + 1];
            result.push({
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2
            });
        }
        result.push(points[points.length - 1]);
        if (result.length < minCount) {
            return interpolatePoints(result, minCount);
        }
        return result;
    };

    const generateInternalHintImage = () => {
        // 1. 基础检查
        if (!state.originalImage || typeof cv === "undefined" || !cvReady) return null;

        try {
            const tempCanvas = document.createElement("canvas");
            const w = Math.floor(state.originalImage.naturalWidth);
            const h = Math.floor(state.originalImage.naturalHeight);

            tempCanvas.width = w;
            tempCanvas.height = h;

            const tCtx = tempCanvas.getContext("2d");

            // --- 步骤 A: 强制白底 (防止 AI 图片透明通道问题) ---
            tCtx.fillStyle = "#FFFFFF";
            tCtx.fillRect(0, 0, w, h);
            tCtx.drawImage(state.originalImage, 0, 0, w, h);

            let imgData = tCtx.getImageData(0, 0, w, h);
            let src = cv.matFromImageData(imgData);

            let gray = new cv.Mat();
            let binary = new cv.Mat();
            let contours = new cv.MatVector();
            let hierarchy = new cv.Mat();

            // --- 步骤 B: 灰度化 ---
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

            // --- 步骤 C: 阈值处理 (使用 Otsu 算法以适应 AI 线稿) ---
            // 这一步确保线条被清晰地提取出来
            cv.threshold(gray, binary, 127, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

            // --- 步骤 D: 关键修改 - 只提取最外层轮廓 ---
            // 使用 cv.RETR_EXTERNAL 而不是 cv.RETR_LIST
            // 这样内部的眼睛、细节会被忽略，不会被擦除
            cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

            // --- 步骤 E: 绘制遮罩 (擦除效果) ---
            // 计算擦除笔触的粗细
            const thickness = Math.max(2, state.config.eraseThickness * (w / 1000));
            const whiteColor = new cv.Scalar(255, 255, 255, 255);

            // 在原图上，沿着最外层轮廓画白线，达到"擦除/变淡"外轮廓的效果
            // 内部线条因为没被选中，所以保持原样
            cv.drawContours(src, contours, -1, whiteColor, thickness);

            const outputCanvas = document.createElement("canvas");
            outputCanvas.width = w;
            outputCanvas.height = h;
            cv.imshow(outputCanvas, src);

            // 内存清理
            src.delete(); gray.delete(); binary.delete(); contours.delete(); hierarchy.delete();

            return outputCanvas;
        } catch (e) {
            console.error("Internal Lines Error:", e);
            return null;
        }
    };

    // ==========================================
    // 7. DRAWING & INTERACTION / 绘图与交互
    // ==========================================

    const setupToolbar = () => {
        const setActive = (tool) => {
            state.activeTool = tool;
            [toolAdd, toolMove, toolDel].forEach(btn => {
                if (btn && btn.id === `tool-${tool}`) {
                    btn.classList.add('bg-brand-blue', 'text-white');
                    btn.classList.remove('bg-slate-700', 'text-brand-blue');
                } else if (btn) {
                    btn.classList.remove('bg-brand-blue', 'text-white');
                    btn.classList.add('bg-slate-700');
                    if (btn.id === 'tool-add') btn.classList.add('text-brand-blue');
                }
            });
            if (drawCanvas) {
                drawCanvas.style.cursor = tool === 'move' ? 'grab' : (tool === 'del' ? 'crosshair' : 'crosshair');
            }
        };

        if (toolAdd) toolAdd.addEventListener('click', () => setActive('add'));
        if (toolMove) toolMove.addEventListener('click', () => setActive('move'));
        if (toolDel) toolDel.addEventListener('click', () => setActive('del'));
        if (undoBtn) undoBtn.addEventListener('click', performUndo);
        setActive('add');
    };

    const getEventPos = (e) => {
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

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const relX = clientX - rect.left;
        const relY = clientY - rect.top;

        return {
            x: (relX - offsetX) * (drawCanvas.width / displayWidth),
            y: (relY - offsetY) * (drawCanvas.height / displayHeight)
        };
    };

    const handleInputStart = (e) => {
        if (!state.originalImage) return;
        if (e.type === 'touchstart') e.preventDefault();

        const pos = getEventPos(e);
        const scale = Math.max(1, drawCanvas.width / 1000);
        const hitRadius = (state.config.dotRadius * scale) + (20 * scale);

        const idx = state.dots.findIndex(d => Math.hypot(d.x - pos.x, d.y - pos.y) < hitRadius);

        if (state.activeTool === 'del') {
            if (idx !== -1) {
                state.dots.splice(idx, 1);
                saveHistory();
                redraw();
                updateDotCountUI();
            }
        } else if (state.activeTool === 'move') {
            if (idx !== -1) {
                state.draggedDotIndex = idx;
                drawCanvas.style.cursor = 'grabbing';
            }
        } else if (state.activeTool === 'add') {
            if (idx === -1) {
                state.dots.push(pos);
                saveHistory();
                redraw();
                updateDotCountUI();
            }
        }
    };

    const handleInputMove = (e) => {
        if (state.activeTool === 'move' && state.draggedDotIndex !== -1) {
            if (e.type === 'touchmove') e.preventDefault();
            state.dots[state.draggedDotIndex] = getEventPos(e);
            redraw();
        }
    };

    const handleInputEnd = () => {
        if (state.activeTool === 'move' && state.draggedDotIndex !== -1) {
            state.draggedDotIndex = -1;
            drawCanvas.style.cursor = 'grab';
            saveHistory();
        }
    };

    if (drawCanvas) {
        drawCanvas.addEventListener('mousedown', handleInputStart);
        drawCanvas.addEventListener('mousemove', handleInputMove);
        drawCanvas.addEventListener('mouseup', handleInputEnd);
        drawCanvas.addEventListener('touchstart', handleInputStart, { passive: false });
        drawCanvas.addEventListener('touchmove', handleInputMove, { passive: false });
        drawCanvas.addEventListener('touchend', handleInputEnd);
    }

    const redraw = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

        // 1. Draw Background
        if (state.config.hint !== 'no' && state.originalImage) {
            ctx.save();
            if (state.config.hint === 'trace') {
                ctx.globalAlpha = 0.3;
                ctx.drawImage(state.originalImage, 0, 0);
            } else if (state.config.hint === 'internal') {
                if (state.internalHintImage) {
                    ctx.drawImage(state.internalHintImage, 0, 0);
                } else {
                    ctx.drawImage(state.originalImage, 0, 0);
                }
            } else {
                ctx.drawImage(state.originalImage, 0, 0);
            }
            ctx.restore();
        }

        // 2. Draw Dots & Numbers
        const scale = Math.max(0.5, drawCanvas.width / 1000);
        const r = state.config.dotRadius * scale;
        const fontSize = state.config.fontSize * scale;

        ctx.font = `bold ${fontSize}px Poppins, Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let centerX = 0, centerY = 0;
        if (state.dots.length > 0) {
            state.dots.forEach(d => { centerX += d.x; centerY += d.y; });
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
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2 * scale;
            ctx.stroke();

            let dx = dot.x - centerX;
            let dy = dot.y - centerY;
            if (dx === 0 && dy === 0) { dx = 1; dy = 1; }
            const len = Math.sqrt(dx * dx + dy * dy);
            const dirX = dx / len;
            const dirY = dy / len;

            const offset = r + (fontSize * 0.8);
            const labelX = dot.x + (dirX * offset);
            const labelY = dot.y + (dirY * offset);

            ctx.fillStyle = "#000";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3 * scale;
            ctx.strokeText(i + 1, labelX, labelY);
            ctx.fillText(i + 1, labelX, labelY);
        });
    };

    // ==========================================
    // 8. CONTROLS / 控制面板
    // ==========================================

    const updateConfig = (key, val) => {
        state.config[key] = val;

        // 防抖处理内部线条生成
        if ((key === 'hint' && val === 'internal') || (key === 'eraseThickness' && state.config.hint === 'internal')) {
            if (state.config.hint === 'internal') {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    state.internalHintImage = generateInternalHintImage();
                    redraw();
                }, 50);
            }
        } else {
            redraw();
        }

        if (key === 'hint' && val !== 'internal') {
            state.internalHintImage = null;
        }
    };

    if (fontSizeSlider) fontSizeSlider.addEventListener('input', (e) => {
        fontSizeValue.textContent = e.target.value;
        updateConfig('fontSize', parseInt(e.target.value));
    });
    if (dotSizeSlider) dotSizeSlider.addEventListener('input', (e) => {
        dotSizeValue.textContent = e.target.value;
        updateConfig('dotRadius', parseInt(e.target.value));
    });
    if (thicknessSlider) thicknessSlider.addEventListener('input', (e) => {
        thicknessValue.textContent = e.target.value;
        updateConfig('eraseThickness', parseInt(e.target.value));
    });

    if (dotColorPicker) dotColorPicker.addEventListener('input', (e) => updateConfig('dotColor', e.target.value));

    hintRadios.forEach(r => r.addEventListener('change', (e) => {
        updateConfig('hint', e.target.value);
        if (e.target.value === 'internal') thicknessContainer.classList.remove('hidden');
        else thicknessContainer.classList.add('hidden');
    }));

    if (dotCountSlider) {
        dotCountSlider.addEventListener('input', (e) => {
            dotCountDisplay.textContent = `${e.target.value} Dots`;
        });

        dotCountSlider.addEventListener('change', (e) => {
            if (typeof cv !== 'undefined' && state.originalImage) {
                canvasLoader.classList.remove('hidden');
                setTimeout(runAutoDetect, 50);
            }
        });
    }

    const updateDotCountUI = () => {
        if (dotCountDisplay) dotCountDisplay.textContent = `${state.dots.length} Dots`;
    };

    if (pointsPlusBtn) pointsPlusBtn.addEventListener('click', () => {
        let val = parseInt(dotCountSlider.value);
        if (val < 200) {
            val++;
            dotCountSlider.value = val;
            dotCountDisplay.textContent = `${val} Dots`;
            dotCountSlider.dispatchEvent(new Event('change'));
        }
    });
    if (pointsMinusBtn) pointsMinusBtn.addEventListener('click', () => {
        let val = parseInt(dotCountSlider.value);
        if (val > 5) {
            val--;
            dotCountSlider.value = val;
            dotCountDisplay.textContent = `${val} Dots`;
            dotCountSlider.dispatchEvent(new Event('change'));
        }
    });

    if (clearBtn) clearBtn.addEventListener('click', () => {
        if (confirm("Clear dots?")) {
            saveHistory();
            state.dots = [];
            redraw();
            updateDotCountUI();
        }
    });

    const saveHistory = () => {
        if (state.history.length > 20) state.history.shift();
        state.history.push(JSON.parse(JSON.stringify(state.dots)));
    };
    const performUndo = () => {
        if (state.history.length > 0) {
            state.dots = state.history.pop();
            redraw();
            updateDotCountUI();
        }
    };

    const getAiUsage = () => {
        const today = new Date().toLocaleDateString();
        let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        if (data.date !== today) {
            data = { date: today, count: 0, extra: 0, shareDate: null };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
        return data;
    };
    const incrementAiUsage = () => {
        const data = getAiUsage();
        data.count++;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        updateAiCreditsUI();
    };

    // === 更新 AI 额度 UI 及分享逻辑 ===
    const updateAiCreditsUI = () => {
        const data = getAiUsage();
        const limit = MAX_DAILY_LIMIT + (data.extra || 0);
        const remaining = Math.max(0, limit - data.count);

        if (heroAiCredits) heroAiCredits.textContent = remaining;

        let msgContainer = document.getElementById('ai-limit-msg');

        if (remaining <= 0) {
            // 禁用按钮
            heroAiGoBtn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'hover:shadow-lg', 'hover:scale-105');
            heroAiGoBtn.style.backgroundColor = '#94a3b8'; // Slate 400
            heroAiGoBtn.style.color = '#fff';
            heroAiGoBtn.style.cursor = 'default';
            heroAiGoBtn.disabled = true;

            const lockSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline mb-0.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
            heroAiGoBtn.innerHTML = `<span>Limit Reached</span> ${lockSvg}`;

            const today = new Date().toLocaleDateString();
            if (data.shareDate !== today) {
                if (!msgContainer) {
                    msgContainer = document.createElement('div');
                    msgContainer.id = 'ai-limit-msg';
                    msgContainer.className = "text-center mt-4 text-sm text-slate-500 animate-in fade-in slide-in-from-top-1";

                    const shareSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>';

                    msgContainer.innerHTML = `
                        <span>Daily limit used. </span>
                        <button id="inline-share-btn" class="inline-flex items-center gap-1 text-[#FF4500] hover:text-[#cc3700] font-bold hover:underline cursor-pointer transition-colors relative z-20" style="background:none; border:none; padding:0;">
                            ${shareSvg} Share to unlock +3
                        </button>
                    `;

                    const creditsEl = heroAiCredits.closest('p');
                    if (creditsEl && creditsEl.parentNode) {
                        creditsEl.parentNode.insertBefore(msgContainer, creditsEl.nextSibling);
                    }

                    document.getElementById('inline-share-btn').addEventListener('click', handleShareUnlock);
                }
            } else {
                if (msgContainer) msgContainer.remove();
            }
        } else {
            heroAiGoBtn.style.backgroundColor = '';
            heroAiGoBtn.style.color = '';
            heroAiGoBtn.style.cursor = '';
            heroAiGoBtn.disabled = false;
            heroAiGoBtn.classList.add('bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'hover:shadow-lg', 'hover:scale-105');
            const arrowSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
            heroAiGoBtn.innerHTML = `<span>Generate</span> ${arrowSvg}`;

            if (msgContainer) msgContainer.remove();
        }
    };

    const dl = (fmt) => {
        if (!state.originalImage) return;
        if (fmt === "png") {
            const link = document.createElement("a");
            link.target = "_blank";
            link.download = "connect-dots.png";
            link.href = drawCanvas.toDataURL("image/png");
            link.click();
        } else if (fmt === "pdf" && window.jspdf) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ orientation: drawCanvas.width > drawCanvas.height ? 'l' : 'p', unit: 'mm', format: 'a4' });
            const pdfW = doc.internal.pageSize.getWidth();
            const pdfH = doc.internal.pageSize.getHeight();
            const ratio = Math.min(pdfW / drawCanvas.width, pdfH / drawCanvas.height);
            const w = drawCanvas.width * ratio;
            const h = drawCanvas.height * ratio;
            doc.addImage(drawCanvas.toDataURL("image/png"), 'PNG', (pdfW - w) / 2, (pdfH - h) / 2, w, h);
            doc.save("connect-dots.pdf");
        }
    };
    if (downloadPngBtn) downloadPngBtn.addEventListener('click', (e) => dl("png"));
    if (downloadPdfBtn) downloadPdfBtn.addEventListener('click', (e) => dl("pdf"));

    init();
});