document.addEventListener("DOMContentLoaded", () => {
    // 1. CONFIG & STATE
    const DEFAULT_CONFIG = {
        fontSize: 20,
        dotRadius: 6,
        dotColor: "#000000",
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

    let cvReady = false;
    let debounceTimer = null;
    const MAX_DAILY_LIMIT = 3;
    const STORAGE_KEY = 'ai_gen_daily_usage';

    // --- GA4 埋点辅助函数 (新增) ---
    const trackEvent = (eventName, params = {}) => {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, params);
        }
    };

    // 2. DOM ELEMENTS
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

    // Editor Canvas
    const drawCanvas = getEl("draw-canvas");
    const ctx = drawCanvas ? drawCanvas.getContext("2d") : null;
    const canvasLoader = getEl("canvas-loader");

    // Tools
    const toolAdd = getEl("tool-add");
    const toolMove = getEl("tool-move");
    const toolDel = getEl("tool-del");
    const undoBtn = getEl("undo-btn");

    // Controls
    const dotCountSlider = getEl("dot-count-slider");
    const dotCountDisplay = getEl("dot-count-display");
    const pointsMinusBtn = getEl("points-minus-btn");
    const pointsPlusBtn = getEl("points-plus-btn");

    const fontSizeSlider = getEl("font-size-slider");
    const fontSizeValue = getEl("font-size-value");
    const dotSizeSlider = getEl("dot-size-slider");
    const dotSizeValue = getEl("dot-size-value");
    const dotColorPicker = getEl("dot-color-picker");

    const hintRadios = document.querySelectorAll('input[name="hint-type"]');
    const thicknessContainer = getEl("thickness-container");
    const thicknessSlider = getEl("thicknessSlider");
    const thicknessValue = getEl("thicknessValue");

    // Actions
    const clearBtn = getEl("clear-btn");

    // Download Buttons (Fixed IDs)
    const sidebarPngBtn = getEl("sidebar-download-png-btn");
    const sidebarPdfBtn = getEl("sidebar-download-pdf-btn");
    const mobilePdfBtn = getEl("mobile-download-pdf-btn");

    // Presets & Advanced
    const presetButtons = document.querySelectorAll('.preset-btn-js');
    const presetDesc = getEl('preset-desc');
    const toggleAdvBtn = getEl('toggle-advanced-btn');
    const advancedContent = getEl('advanced-content');
    const advArrow = getEl('advanced-arrow');

    // 3. UI UTILS & DONATION TOAST
    const showTip = (message, type = 'info') => {
        const oldTip = document.getElementById('custom-tip');
        if (oldTip) oldTip.remove();

        const tip = document.createElement('div');
        tip.id = 'custom-tip';
        let bgClass = type === 'error' ? 'bg-red-500' : (type === 'success' ? 'bg-green-500' : 'bg-slate-800');

        tip.className = `fixed top-24 left-1/2 -translate-x-1/2 z-[9999] ${bgClass} text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 opacity-0`;
        tip.innerHTML = `<span class="font-medium text-sm">${message}</span>`;
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

    // Buy Me a Coffee Toast Logic
    const showDonationTip = () => {
        const existingTip = document.getElementById('donation-toast');
        if (existingTip) existingTip.remove();

        const toast = document.createElement('div');
        toast.id = 'donation-toast';
        toast.className = `
            fixed top-24 right-4 z-[100] max-w-sm w-auto 
            bg-white border-l-4 border-[#FF5E5B] rounded-lg shadow-2xl 
            flex items-center gap-4 p-4 pr-10 cursor-pointer 
            transform transition-all duration-500 translate-x-[120%]
            hover:scale-102 group
        `;

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
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-[120%]');
            toast.classList.add('translate-x-0');
        });

        toast.addEventListener('click', (e) => {
            if (e.target.closest('#close-toast')) {
                removeToast();
                return;
            }
            window.open('https://ko-fi.com/connectthedotsprintable', '_blank');
        });

        const removeToast = () => {
            toast.classList.remove('translate-x-0');
            toast.classList.add('translate-x-[120%]');
            setTimeout(() => {
                if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
            }, 500);
        };

        setTimeout(removeToast, 8000);
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
        window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank');

        data.extra = (data.extra || 0) + 3;
        data.shareDate = today;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        updateAiCreditsUI();
        showTip("Success! 3 credits added.", 'success');
    };

    // 4. INITIALIZATION
    const init = () => {
        updateAiCreditsUI();
        setupHeroTabs();
        setupToolbar();
        loadOpenCv();
        setupPresets();
        setupAdvancedToggle();

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
            dotCountSlider.max = 200;
            dotCountSlider.min = 5;
            dotCountSlider.value = 25;
        }

        if (thicknessSlider) {
            thicknessSlider.value = DEFAULT_CONFIG.eraseThickness;
            if (thicknessValue) thicknessValue.textContent = DEFAULT_CONFIG.eraseThickness;
        }

        const defaultPresetBtn = document.querySelector('.preset-btn-js[data-preset="easy"]');
        if (defaultPresetBtn) defaultPresetBtn.click();
    };

    const setupHeroTabs = () => {
        if (!tabUpload || !tabAi) return;
        const setActive = (isAiMode) => {
            if (isAiMode) {
                // GA: 切换模式事件
                trackEvent('select_mode', { mode: 'ai_gen' });
                tabBg.style.transform = 'translateX(100%)';
                tabAi.classList.replace('text-slate-500', 'text-slate-800');
                tabUpload.classList.replace('text-slate-800', 'text-slate-500');
                panelUpload.classList.replace('active', 'inactive');
                panelAi.classList.replace('inactive', 'active');
                setTimeout(() => heroAiInput?.focus(), 100);
            } else {
                // GA: 切换模式事件
                trackEvent('select_mode', { mode: 'upload' })
                tabBg.style.transform = 'translateX(0)';
                tabUpload.classList.replace('text-slate-500', 'text-slate-800');
                tabAi.classList.replace('text-slate-800', 'text-slate-500');
                panelAi.classList.replace('active', 'inactive');
                panelUpload.classList.replace('inactive', 'active');
            }
        };
        tabUpload.addEventListener("click", () => setActive(false));
        tabAi.addEventListener("click", () => setActive(true));
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

    // 5. PRESETS & ADVANCED
    const setupPresets = () => {
        const presetConfigs = {
            easy: { count: 25, font: 28, dotRadius: 8, hint: 'internal', desc: "Perfect for kids (20-30 dots, large font)" },
            medium: { count: 55, font: 20, dotRadius: 6, hint: 'internal', desc: "Standard difficulty (50-60 dots)" },
            hard: { count: 90, font: 14, dotRadius: 4, hint: 'no', desc: "Expert challenge (80+ dots, no hints)" }
        };

        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                presetButtons.forEach(b => {
                    b.classList.remove('active', 'border-brand-blue', 'bg-indigo-50', 'bg-indigo-50/50');
                    b.classList.add('border-transparent', 'bg-slate-50');
                    b.querySelector('span:last-child').classList.replace('text-brand-blue', 'text-slate-600');
                });

                btn.classList.add('active', 'border-brand-blue', 'bg-indigo-50');
                btn.classList.remove('border-transparent', 'bg-slate-50');
                btn.querySelector('span:last-child').classList.replace('text-slate-600', 'text-brand-blue');

                const config = presetConfigs[btn.dataset.preset];
                if (presetDesc) presetDesc.textContent = config.desc;

                if (dotCountSlider) {
                    dotCountSlider.value = config.count;
                    if (dotCountDisplay) dotCountDisplay.textContent = `${config.count} Dots`;
                }
                if (fontSizeSlider) {
                    fontSizeSlider.value = config.font;
                    if (fontSizeValue) fontSizeValue.textContent = config.font;
                }
                if (dotSizeSlider) {
                    dotSizeSlider.value = config.dotRadius;
                    if (dotSizeValue) dotSizeValue.textContent = config.dotRadius;
                }

                state.config.fontSize = config.font;
                state.config.dotRadius = config.dotRadius;

                const radios = document.getElementsByName('hint-type');
                for (let radio of radios) {
                    if (radio.value === config.hint) {
                        radio.checked = true;
                        updateConfig('hint', config.hint);
                        if (thicknessContainer) {
                            config.hint === 'internal' ? thicknessContainer.classList.remove('hidden') : thicknessContainer.classList.add('hidden');
                        }
                        break;
                    }
                }

                if (state.originalImage && typeof cv !== 'undefined') {
                    if (canvasLoader) canvasLoader.classList.remove('hidden');
                    setTimeout(runAutoDetect, 50);
                } else {
                    redraw();
                }
            });
        });
    };

    const setupAdvancedToggle = () => {
        if (toggleAdvBtn && advancedContent) {
            toggleAdvBtn.addEventListener('click', () => {
                const isHidden = advancedContent.classList.contains('hidden');
                isHidden ? advancedContent.classList.remove('hidden') : advancedContent.classList.add('hidden');
                if (advArrow) advArrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
            });
        }
    };

    // 6. FILE HANDLING
    const handleFile = (file, isProcessed = false) => {
        if (!file || !file.type.startsWith('image/')) return showTip("Please upload a valid image file.", "error");

        // GA: 用户主动上传图片
        if (!isProcessed) {
            trackEvent('user_upload_image', {
                file_type: file.type,
                file_size: Math.round(file.size / 1024) + 'KB'
            });
        }

        loadFileToCanvas(file);
    };

    const loadFileToCanvas = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                state.originalImage = img;
                const TARGET_MIN_WIDTH = 2000;
                const scale = Math.max(1, TARGET_MIN_WIDTH / Math.max(img.naturalWidth, img.naturalHeight));

                drawCanvas.width = Math.floor(img.naturalWidth * scale);
                drawCanvas.height = Math.floor(img.naturalHeight * scale);

                state.dots = [];
                state.history = [];
                state.internalHintImage = null;

                switchView('editor');

                if (state.config.hint === 'internal' && typeof cv !== 'undefined') {
                    setTimeout(() => {
                        state.internalHintImage = generateInternalHintImage();
                        redraw();
                    }, 50);
                } else {
                    redraw();
                }

                canvasLoader.classList.remove('hidden');
                const startDetect = () => setTimeout(runAutoDetect, 200);
                typeof cv !== 'undefined' ? startDetect() : loadOpenCv(startDetect);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    if (heroFileInput) heroFileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

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

    if (heroAiGoBtn) heroAiGoBtn.addEventListener('click', async () => {
        const prompt = heroAiInput.value.trim();
        if (prompt.length < 3) return showTip("Please enter a description.", "error");

        // GA: AI 生成开始
        trackEvent('ai_generate_start', {
            prompt_length: prompt.length
        });

        const usage = getAiUsage();
        if (usage.count >= (MAX_DAILY_LIMIT + (usage.extra || 0))) {
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
        if (ctx) ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

        try {
            const res = await fetch("https://connectthedotsprintable.online/api/doubao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: prompt + ", simple black and white line art, coloring book style, white background",
                    size: "1024x1024"
                })
            });

            if (!res.ok) throw new Error(await res.text());
            const blob = await res.blob();

            // GA: AI 生成成功
            trackEvent('ai_generate_success');

            incrementAiUsage();

            const loaderText = canvasLoader.querySelector('p');
            if (loaderText) loaderText.textContent = "Creating magic...";
            loadFileToCanvas(new File([blob], "ai.png", { type: blob.type }));

        } catch (e) {
            console.error("AI Gen Error:", e);
            // GA: AI 生成失败
            trackEvent('ai_generate_fail', { error: e.message });

            showTip("AI Generation failed. Please try again.", "error");
            switchView('landing');
            if (canvasLoader) canvasLoader.classList.add('hidden');
        } finally {
            heroAiGoBtn.innerHTML = originalHtml;
            heroAiGoBtn.disabled = false;
        }
    });

    // 7. OPENCV LOGIC
    const loadOpenCv = (cb) => {
        if (cvReady) {
            if (cb) cb();
            return;
        }
        if (document.querySelector('script[src*="opencv.js"]')) {
            if (typeof cv !== 'undefined' && !cvReady) {
                cv['onRuntimeInitialized'] = () => {
                    cvReady = true;
                    if (cb) cb();
                };
            }
            return;
        }
        const script = document.createElement('script');
        script.src = "https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/opencv.js";
        script.async = true;
        window.Module = {
            onRuntimeInitialized: function () {
                cvReady = true;
                if (cb) cb();
                if (state.originalImage) {
                    canvasLoader.classList.remove('hidden');
                    runAutoDetect();
                }
            }
        };
        document.body.appendChild(script);
    };

    const runAutoDetect = () => {
        if (!state.originalImage) return;
        if (typeof cv === 'undefined' || !cvReady) {
            setTimeout(runAutoDetect, 500);
            return;
        }

        try {
            const loaderText = canvasLoader.querySelector('p');
            if (loaderText) loaderText.textContent = "Processing lines...";

            const tempCanvas = document.createElement("canvas");
            const processWidth = 1000;
            const processScale = Math.min(1, processWidth / Math.max(drawCanvas.width, drawCanvas.height));

            const w = Math.floor(drawCanvas.width * processScale);
            const h = Math.floor(drawCanvas.height * processScale);

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
                        y: approx.data32S[j * 2 + 1] / processScale
                    });
                }
                approx.delete();
            }

            src.delete(); gray.delete(); binary.delete(); contours.delete(); hierarchy.delete(); M.delete();

            const targetCount = parseInt(dotCountSlider.value) || 25;
            state.dots = allPoints.length > 0 ? resampleDots(allPoints, targetCount) : [];

            saveHistory();
            redraw();
            updateDotCountUI();

        } catch (e) {
            console.error("Auto detect runtime error:", e);
        } finally {
            canvasLoader.classList.add('hidden');
        }
    };

    const resampleDots = (points, targetCount) => {
        if (points.length < 2) return points;
        if (points.length < targetCount * 2) points = interpolatePoints(points, targetCount * 3);

        const closedPoints = [...points, points[0]];
        let totalLength = 0;
        const cumLengths = [0];

        for (let i = 0; i < closedPoints.length - 1; i++) {
            totalLength += Math.hypot(closedPoints[i + 1].x - closedPoints[i].x, closedPoints[i + 1].y - closedPoints[i].y);
            cumLengths.push(totalLength);
        }

        const step = totalLength / targetCount;
        const newPoints = [];

        for (let i = 0; i < targetCount; i++) {
            const targetDist = i * step;
            let j = 0;
            while (j < cumLengths.length - 1 && cumLengths[j + 1] < targetDist) j++;

            const segmentStartDist = cumLengths[j];
            const segmentLength = cumLengths[j + 1] - cumLengths[j];
            const t = segmentLength === 0 ? 0 : (targetDist - segmentStartDist) / segmentLength;

            newPoints.push({
                x: closedPoints[j].x + (closedPoints[j + 1].x - closedPoints[j].x) * t,
                y: closedPoints[j].y + (closedPoints[j + 1].y - closedPoints[j].y) * t
            });
        }
        return newPoints;
    };

    const interpolatePoints = (points, minCount) => {
        let result = [];
        for (let i = 0; i < points.length - 1; i++) {
            result.push(points[i]);
            result.push({ x: (points[i].x + points[i + 1].x) / 2, y: (points[i].y + points[i + 1].y) / 2 });
        }
        result.push(points[points.length - 1]);
        return result.length < minCount ? interpolatePoints(result, minCount) : result;
    };

    const generateInternalHintImage = () => {
        if (!state.originalImage || typeof cv === "undefined" || !cvReady) return null;
        try {
            const tempCanvas = document.createElement("canvas");
            const w = drawCanvas.width, h = drawCanvas.height;
            tempCanvas.width = w; tempCanvas.height = h;

            const tCtx = tempCanvas.getContext("2d");
            tCtx.fillStyle = "#FFFFFF";
            tCtx.fillRect(0, 0, w, h);
            tCtx.drawImage(state.originalImage, 0, 0, w, h);

            let src = cv.matFromImageData(tCtx.getImageData(0, 0, w, h));
            let gray = new cv.Mat(), binary = new cv.Mat(), contours = new cv.MatVector(), hierarchy = new cv.Mat();

            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
            cv.threshold(gray, binary, 127, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);
            cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

            const thickness = Math.max(2, state.config.eraseThickness * (w / 1000));
            cv.drawContours(src, contours, -1, new cv.Scalar(255, 255, 255, 255), thickness);

            const outputCanvas = document.createElement("canvas");
            outputCanvas.width = w; outputCanvas.height = h;
            cv.imshow(outputCanvas, src);

            src.delete(); gray.delete(); binary.delete(); contours.delete(); hierarchy.delete();
            return outputCanvas;
        } catch (e) {
            console.error("Internal Lines Error:", e);
            return null;
        }
    };

    // 8. DRAWING & INTERACTION
    const setupToolbar = () => {
        const setActive = (tool) => {
            state.activeTool = tool;
            [toolAdd, toolMove, toolDel].forEach(btn => {
                const isActive = btn.id === `tool-${tool}`;
                btn.classList.toggle('bg-brand-blue', isActive);
                btn.classList.toggle('text-white', isActive);
                btn.classList.toggle('bg-slate-700', !isActive);
                if (btn.id === 'tool-add' && !isActive) btn.classList.add('text-brand-blue');
            });
            if (drawCanvas) drawCanvas.style.cursor = tool === 'move' ? 'grab' : 'crosshair';
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

        return {
            x: (clientX - rect.left - offsetX) * (drawCanvas.width / displayWidth),
            y: (clientY - rect.top - offsetY) * (drawCanvas.height / displayHeight)
        };
    };

    const handleInputStart = (e) => {
        if (!state.originalImage) return;
        if (e.type === 'touchstart') e.preventDefault();
        const pos = getEventPos(e);
        const scale = Math.max(1, drawCanvas.width / 1000);
        const hitRadius = (state.config.dotRadius * scale) + (20 * scale);
        const idx = state.dots.findIndex(d => Math.hypot(d.x - pos.x, d.y - pos.y) < hitRadius);

        if (state.activeTool === 'del' && idx !== -1) {
            state.dots.splice(idx, 1);
            saveHistory(); redraw(); updateDotCountUI();
        } else if (state.activeTool === 'move' && idx !== -1) {
            state.draggedDotIndex = idx;
            drawCanvas.style.cursor = 'grabbing';
        } else if (state.activeTool === 'add' && idx === -1) {
            state.dots.push(pos);
            saveHistory(); redraw(); updateDotCountUI();
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

        if (state.config.hint !== 'no' && state.originalImage) {
            ctx.save();
            if (state.config.hint === 'trace') {
                ctx.globalAlpha = 0.3;
                ctx.drawImage(state.originalImage, 0, 0, drawCanvas.width, drawCanvas.height);
            } else if (state.config.hint === 'internal') {
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
            state.dots.forEach(d => { centerX += d.x; centerY += d.y; });
            centerX /= state.dots.length;
            centerY /= state.dots.length;
        } else {
            centerX = drawCanvas.width / 2; centerY = drawCanvas.height / 2;
        }

        state.dots.forEach((dot, i) => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
            ctx.fillStyle = state.config.dotColor;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2 * scale;
            ctx.stroke();

            const dx = dot.x - centerX || 1, dy = dot.y - centerY || 1;
            const len = Math.hypot(dx, dy);
            const offset = r + (fontSize * 0.8);
            const labelX = dot.x + (dx / len * offset), labelY = dot.y + (dy / len * offset);

            ctx.fillStyle = "#000";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3 * scale;
            ctx.strokeText(i + 1, labelX, labelY);
            ctx.fillText(i + 1, labelX, labelY);
        });
    };

    // 9. CONTROLS
    const updateConfig = (key, val) => {
        state.config[key] = val;
        if ((key === 'hint' && val === 'internal') || (key === 'eraseThickness' && state.config.hint === 'internal')) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                state.internalHintImage = generateInternalHintImage();
                redraw();
            }, 50);
        } else {
            redraw();
        }
        if (key === 'hint' && val !== 'internal') state.internalHintImage = null;
    };

    fontSizeSlider?.addEventListener('input', (e) => {
        if (fontSizeValue) fontSizeValue.textContent = e.target.value;
        updateConfig('fontSize', parseInt(e.target.value));
    });
    dotSizeSlider?.addEventListener('input', (e) => {
        if (dotSizeValue) dotSizeValue.textContent = e.target.value;
        updateConfig('dotRadius', parseInt(e.target.value));
    });
    thicknessSlider?.addEventListener('input', (e) => {
        if (thicknessValue) thicknessValue.textContent = e.target.value;
        updateConfig('eraseThickness', parseInt(e.target.value));
    });
    dotColorPicker?.addEventListener('input', (e) => updateConfig('dotColor', e.target.value));

    hintRadios.forEach(r => r.addEventListener('change', (e) => {
        updateConfig('hint', e.target.value);
        if (thicknessContainer) thicknessContainer.classList.toggle('hidden', e.target.value !== 'internal');
    }));

    dotCountSlider?.addEventListener('input', (e) => {
        if (dotCountDisplay) dotCountDisplay.textContent = `${e.target.value} Dots`;
    });
    dotCountSlider?.addEventListener('change', () => {
        if (typeof cv !== 'undefined' && state.originalImage) {
            canvasLoader.classList.remove('hidden');
            setTimeout(runAutoDetect, 50);
        }
    });

    const updateDotCountUI = () => {
        if (dotCountDisplay) dotCountDisplay.textContent = `${state.dots.length} Dots`;
    };

    pointsPlusBtn?.addEventListener('click', () => {
        let val = parseInt(dotCountSlider.value);
        if (val < 200) { dotCountSlider.value = ++val; dotCountDisplay.textContent = `${val} Dots`; dotCountSlider.dispatchEvent(new Event('change')); }
    });
    pointsMinusBtn?.addEventListener('click', () => {
        let val = parseInt(dotCountSlider.value);
        if (val > 5) { dotCountSlider.value = --val; dotCountDisplay.textContent = `${val} Dots`; dotCountSlider.dispatchEvent(new Event('change')); }
    });

    clearBtn?.addEventListener('click', () => {
        if (confirm("Clear dots?")) {
            saveHistory(); state.dots = []; redraw(); updateDotCountUI();
        }
    });

    const saveHistory = () => {
        if (state.history.length > 20) state.history.shift();
        state.history.push(JSON.parse(JSON.stringify(state.dots)));
    };
    const performUndo = () => {
        if (state.history.length > 0) {
            state.dots = state.history.pop();
            redraw(); updateDotCountUI();
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

    // === 修复后的 updateAiCreditsUI 函数 ===
    const updateAiCreditsUI = () => {
        const data = getAiUsage();
        const limit = MAX_DAILY_LIMIT + (data.extra || 0);
        const remaining = Math.max(0, limit - data.count);

        if (heroAiCredits) heroAiCredits.textContent = remaining;

        let msgContainer = document.getElementById('ai-limit-msg');

        if (remaining <= 0) {
            // 1. 禁用按钮样式
            heroAiGoBtn.classList.remove('bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'hover:shadow-lg', 'hover:scale-105');
            heroAiGoBtn.style.backgroundColor = '#94a3b8'; // Slate 400
            heroAiGoBtn.style.color = '#fff';
            heroAiGoBtn.style.cursor = 'default';
            heroAiGoBtn.disabled = true;

            const lockSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline mb-0.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
            heroAiGoBtn.innerHTML = `<span>Limit Reached</span> ${lockSvg}`;

            // 2. 显示分享解锁链接
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

                    // --- 修复开始：使用 parentElement 替代 closest('p') ---
                    // 获取显示剩余次数的父级容器 (div)
                    const creditsParent = heroAiCredits.parentElement; 
                    
                    if (creditsParent && creditsParent.parentNode) {
                        // 将提示插入到 creditsParent 的后面
                        creditsParent.parentNode.insertBefore(msgContainer, creditsParent.nextSibling);
                        
                        // --- 修复：添加空值检查，确保元素存在再绑定事件 ---
                        const shareBtn = document.getElementById('inline-share-btn');
                        if (shareBtn) {
                            shareBtn.addEventListener('click', handleShareUnlock);
                        }
                    }
                    // --- 修复结束 ---
                }
            } else {
                // 如果今天已经分享过，隐藏提示
                if (msgContainer) msgContainer.remove();
            }
        } else {
            // 恢复按钮状态
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

        // GA: 记录下载事件
        trackEvent('download_result', {
            file_format: fmt,
            dots_count: state.dots.length,
            hint_mode: state.config.hint
        });

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

        // Trigger Donation Toast after download
        setTimeout(showDonationTip, 2000);
    };

    if (sidebarPngBtn) sidebarPngBtn.addEventListener('click', () => dl("png"));
    if (sidebarPdfBtn) sidebarPdfBtn.addEventListener('click', () => dl("pdf"));
    if (mobilePdfBtn) mobilePdfBtn.addEventListener('click', () => dl("pdf"));
    // 新增：监听移动端图片下载按钮
    const mobilePngBtn = getEl("mobile-download-png-btn");
    if (mobilePngBtn) mobilePngBtn.addEventListener('click', () => dl("png"));

    init();
});