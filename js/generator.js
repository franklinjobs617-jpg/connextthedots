document.addEventListener('DOMContentLoaded', () => {
    // === State and Constants ===
    const MAX_WIDTH = 2480, MAX_HEIGHT = 3508;
    const DEFAULT_CONFIG = { type: '123', fontSize: 20, hint: 'original', eraseThickness: 5, dotRadius: 5, dotColor: '#000000' };
    let state = {
        originalImage: null, canvasDimensions: { width: MAX_WIDTH, height: MAX_HEIGHT },
        dots: [], draggedDotIndex: -1,
        config: { ...DEFAULT_CONFIG },
        internalHintImage: null,
        pendingFile: null // [New] Store file temporarily while user selects type
    };

    const getRenderScale = () => {
        if (!state.canvasDimensions || state.canvasDimensions.width === 0) return 1;
        return Math.max(1, state.canvasDimensions.width / 800);
    };

    // === DOM Element References ===
    const step1ChoiceArea = document.getElementById('step1-choice-area');
    const uploadChoiceCard = document.getElementById('upload-choice-card');
    const aiChoiceCard = document.getElementById('ai-choice-card');
    const actionUiContainer = document.getElementById('action-ui-container');
    const uploadTemplate = document.getElementById('upload-template');
    const aiGenerateTemplate = document.getElementById('ai-generate-template');
    const inspirationArea = document.getElementById('inspiration-area');

    // Modal References
    const imageTypeModal = document.getElementById('image-type-modal');
    const btnSelectPhoto = document.getElementById('btn-select-photo');
    const btnSelectDrawing = document.getElementById('btn-select-drawing');
    const rmbgLoader = document.getElementById('rmbg-loader');
    const modalActions = document.getElementById('modal-actions');

    const generatorMainArea = document.getElementById('generator-main-area');
    const sourceImageInfo = document.getElementById('source-image-info');
    const currentFilename = document.getElementById('current-filename');
    const changeImageBtn = document.getElementById('change-image-btn');
    const drawCanvas = document.getElementById('draw-canvas'), drawCtx = drawCanvas.getContext('2d');
    const canvasLoader = document.getElementById('canvas-loader');
    const pointsCounter = document.getElementById('points-counter');
    const clearBtn = document.getElementById('clear-btn');
    const hintTypeRadios = document.getElementById('hint-type-radios');
    const dotCountSlider = document.getElementById('dot-count-slider'), pointsNumberInput = document.getElementById('points-number-input');
    const pointsMinusBtn = document.getElementById('points-minus-btn'), pointsPlusBtn = document.getElementById('points-plus-btn');
    const fontSizeSlider = document.getElementById('font-size-slider'), fontSizeValue = document.getElementById('font-size-value');
    const thicknessContainer = document.getElementById('thickness-container'), thicknessSlider = document.getElementById('thicknessSlider'), thicknessValue = document.getElementById('thicknessValue');
    const dotSizeSlider = document.getElementById('dot-size-slider'), dotSizeValue = document.getElementById('dot-size-value');
    const dotColorPicker = document.getElementById('dot-color-picker');
    const downloadPngBtn = document.getElementById('download-png-btn'), downloadPdfBtn = document.getElementById('download-pdf-btn');
    const opencvStatus = document.getElementById('opencv-status');

    let imageLoader, dropZone, aiPromptInput, generateAiImageBtn, aiStatusArea, aiStatusMessage;

    // --- Utility Functions ---
    const debounce = (func, delay) => { let timeout; return function (...args) { const context = this; clearTimeout(timeout); timeout = setTimeout(() => func.apply(context, args), delay); }; };
    const getEventPos = (canvas, evt) => { const rect = canvas.getBoundingClientRect(); const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX; const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY; return { x: (clientX - rect.left) * (canvas.width / rect.width), y: (clientY - rect.top) * (canvas.height / rect.height) }; };
    const distance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    const getLabel = (index) => state.config.type === 'ABC' ? String.fromCharCode(65 + index) : (index + 1).toString();
    const updateClearButton = () => { if (clearBtn) clearBtn.disabled = state.dots.length === 0; };

    const drawDots = (context, dots, config = {}) => {
        const scale = getRenderScale();
        const scaledLineWidth = 1.5 * scale;
        dots.forEach(dot => {
            context.beginPath();
            context.arc(dot.x, dot.y, config.radius * scale, 0, 2 * Math.PI);
            context.fillStyle = config.color;
            context.strokeStyle = 'black';
            context.lineWidth = scaledLineWidth;
            context.fill();
            context.stroke();
        });
    };

    const calculateCentroid = (dots) => { if (dots.length === 0) { return { x: state.canvasDimensions.width / 2, y: state.canvasDimensions.height / 2 }; } const total = dots.reduce((acc, dot) => ({ x: acc.x + dot.x, y: acc.y + dot.y }), { x: 0, y: 0 }); return { x: total.x / dots.length, y: total.y / dots.length }; };

    const drawNumbers = (context, dots, centroid) => {
        const scale = getRenderScale();
        const scaledFontSize = state.config.fontSize * scale;
        const scaledDotRadius = state.config.dotRadius * scale;
        context.fillStyle = 'black';
        context.font = `${scaledFontSize}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        dots.forEach((dot, index) => {
            const dx = dot.x - centroid.x;
            const dy = dot.y - centroid.y;
            const magnitude = Math.sqrt(dx * dx + dy * dy);
            let nx = 0, ny = -1;
            if (magnitude > 0) { nx = dx / magnitude; ny = dy / magnitude; }
            const offset = scaledDotRadius + scaledFontSize * 0.75;
            const labelX = dot.x + nx * offset;
            const labelY = dot.y + ny * offset;
            context.fillText(getLabel(index), labelX, labelY);
        });
    };

    // --- Core Drawing ---
    const redrawDrawCanvas = () => {
        const context = drawCtx, canvas = drawCanvas; context.clearRect(0, 0, canvas.width, canvas.height); if (state.config.hint === 'original' && state.originalImage) { context.drawImage(state.originalImage, 0, 0, state.canvasDimensions.width, state.canvasDimensions.height); } else if (state.config.hint === 'trace' && state.originalImage) { context.globalAlpha = 0.3; context.drawImage(state.originalImage, 0, 0, state.canvasDimensions.width, state.canvasDimensions.height); context.globalAlpha = 1.0; } else if (state.config.hint === 'internal' && state.internalHintImage) { context.drawImage(state.internalHintImage, 0, 0, state.canvasDimensions.width, state.canvasDimensions.height); } const centroid = calculateCentroid(state.dots);
        drawDots(context, state.dots, { color: state.config.dotColor, radius: state.config.dotRadius }); drawNumbers(context, state.dots, centroid); pointsCounter.textContent = state.dots.length; updateClearButton();
    };

    const updateConfigAndRedraw = () => { state.config.fontSize = parseInt(fontSizeSlider.value, 10); state.config.dotRadius = parseInt(dotSizeSlider.value, 10); state.config.dotColor = dotColorPicker.value; state.config.hint = document.querySelector('input[name="hint-type"]:checked').value; state.config.eraseThickness = parseInt(thicknessSlider.value, 10); fontSizeValue.textContent = fontSizeSlider.value; dotSizeValue.textContent = dotSizeSlider.value; thicknessValue.textContent = thicknessSlider.value; thicknessContainer.classList.toggle('hidden', state.config.hint !== 'internal'); state.internalHintImage = (state.config.hint === 'internal' && typeof cv !== 'undefined') ? generateInternalHintImage(state.config.eraseThickness) : null; redrawDrawCanvas(); };

    const generateInternalHintImage = (thickness) => {
        if (!state.originalImage || typeof cv === 'undefined') return null;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = state.canvasDimensions.width; tempCanvas.height = state.canvasDimensions.height; tempCanvas.getContext('2d').drawImage(state.originalImage, 0, 0, tempCanvas.width, tempCanvas.height);
        let src, gray, binary, contours, hierarchy, resultMat = null;
        try {
            src = cv.imread(tempCanvas); resultMat = src.clone(); gray = new cv.Mat(); binary = new cv.Mat(); cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
            cv.threshold(gray, binary, 127, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);
            contours = new cv.MatVector(); hierarchy = new cv.Mat();
            cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
            const scale = getRenderScale();
            cv.drawContours(resultMat, contours, -1, new cv.Scalar(255, 255, 255, 255), thickness * scale);
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = state.canvasDimensions.width; offscreenCanvas.height = state.canvasDimensions.height;
            cv.imshow(offscreenCanvas, resultMat); return offscreenCanvas;
        } catch (error) { console.error("Hint image generation error:", error); return null; } finally { if (src) src.delete(); if (gray) gray.delete(); if (binary) binary.delete(); if (contours) contours.delete(); if (hierarchy) hierarchy.delete(); if (resultMat) resultMat.delete(); }
    };

    const resetGeneratorState = () => {
        state.originalImage = null; state.dots = []; state.draggedDotIndex = -1; state.pendingFile = null;
        state.config = { ...DEFAULT_CONFIG };
        updatePointsValue(25, false);
        dotSizeSlider.value = DEFAULT_CONFIG.dotRadius; dotSizeValue.textContent = DEFAULT_CONFIG.dotRadius.toString();
        dotColorPicker.value = DEFAULT_CONFIG.dotColor;
        fontSizeSlider.value = DEFAULT_CONFIG.fontSize; fontSizeValue.textContent = DEFAULT_CONFIG.fontSize.toString();
        document.querySelector('input[name="hint-type"][value="original"]').checked = true;
        generatorMainArea.classList.add('hidden');
        step1ChoiceArea.classList.remove('hidden');
        inspirationArea.classList.remove('hidden');
        actionUiContainer.innerHTML = '';
        uploadChoiceCard.classList.remove('border-primary'); aiChoiceCard.classList.remove('border-primary');
        uploadChoiceCard.classList.add('border-gray-300'); aiChoiceCard.classList.add('border-gray-300');
        sourceImageInfo.classList.add('hidden');
        if (clearBtn) clearBtn.disabled = true;
        downloadPngBtn.disabled = true; downloadPdfBtn.disabled = true;
        thicknessContainer.classList.add('hidden');
        redrawDrawCanvas();
    };

    // ============================================
    // [New Logic] File Handling & Modal Interception
    // ============================================

    // 1. Entry point: User selects file
    const handleFile = (file, isFromAI = false) => {
        if (!file || !file.type.startsWith('image/')) return;

        // If it's an AI image or example image, treat as simple drawing immediately
        if (isFromAI) {
            loadImageToCanvas(file);
            return;
        }

        // Store file and show modal for user decision
        state.pendingFile = file;
        imageTypeModal.classList.remove('hidden');
    };

    // 2. Logic to actually load the image into the editor (The "Old" handleFile logic)
    const loadImageToCanvas = (file) => {
        const reader = new FileReader();
        reader.onerror = () => alert('Error reading file.');
        reader.onload = (event) => {
            const img = new Image();
            img.onerror = () => alert('Cannot load image file.');
            img.onload = () => {
                state.originalImage = img;
                const scale = Math.min(MAX_WIDTH / img.naturalWidth, MAX_HEIGHT / img.naturalHeight);
                state.canvasDimensions = { width: img.naturalWidth * scale, height: img.naturalHeight * scale };
                drawCanvas.width = state.canvasDimensions.width; drawCanvas.height = state.canvasDimensions.height;
                state.dots = [];

                step1ChoiceArea.classList.add('hidden');
                inspirationArea.classList.add('hidden');
                generatorMainArea.classList.remove('hidden');
                currentFilename.textContent = file.name;
                sourceImageInfo.classList.remove('hidden');
                downloadPngBtn.disabled = false;
                downloadPdfBtn.disabled = false;

                if (opencvScriptLoaded) {
                    canvasLoader.querySelector('p').textContent = 'Auto-detecting...';
                    runAutoDetect();
                } else {
                    canvasLoader.classList.remove('hidden');
                    canvasLoader.querySelector('p').textContent = 'Waiting for generator to load...';
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
        const API_ENDPOINT = 'http://localhost:8000/remove-bg';


        // Actual Implementation structure assuming a standard multipart form endpoint
        try {
            const formData = new FormData();
            formData.append('file', file); // Adjust 'file' key based on your API requirements

            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                body: formData
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
    btnSelectDrawing.addEventListener('click', () => {
        imageTypeModal.classList.add('hidden');
        if (state.pendingFile) {
            loadImageToCanvas(state.pendingFile);
            state.pendingFile = null;
        }
    });

    btnSelectPhoto.addEventListener('click', async () => {
        if (!state.pendingFile) return;

        // Show loader state
        modalActions.classList.add('hidden');
        rmbgLoader.classList.remove('hidden');

        try {
            // Call the background removal interface
            const processedBlob = await removeBackgroundWithApi(state.pendingFile);

            // Create a new File object from the blob to pass to loader
            const processedFile = new File([processedBlob], "processed_" + state.pendingFile.name, { type: "image/png" });

            imageTypeModal.classList.add('hidden');
            loadImageToCanvas(processedFile);
        } catch (error) {
            console.error("Background removal failed:", error);
            alert("Failed to remove background: " + error.message + ". Using original image.");
            imageTypeModal.classList.add('hidden');
            loadImageToCanvas(state.pendingFile);
        } finally {
            // Reset modal state
            modalActions.classList.remove('hidden');
            rmbgLoader.classList.add('hidden');
            state.pendingFile = null;
        }
    });


    // --- Auto-Detect Logic ---
    const runAutoDetect = () => {
        if (!state.originalImage || typeof cv === 'undefined') { console.log("OpenCV not ready or no image, skipping auto-detect."); return; }
        canvasLoader.classList.remove('hidden');
        setTimeout(() => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = state.canvasDimensions.width;
            tempCanvas.height = state.canvasDimensions.height;
            tempCanvas.getContext('2d').drawImage(state.originalImage, 0, 0, tempCanvas.width, tempCanvas.height);

            let src, gray, binary, contours, hierarchy, channels, alpha, allDots = [];
            try {
                src = cv.imread(tempCanvas);
                gray = new cv.Mat();
                binary = new cv.Mat();
                contours = new cv.MatVector();
                hierarchy = new cv.Mat();

                // --- New Logic: Handle Transparent Images (Result of remove-bg) ---
                channels = new cv.MatVector();
                cv.split(src, channels);
                alpha = channels.get(3);

                // Check if image has transparency (min alpha < 250 to allow for some noise)
                let minMax = cv.minMaxLoc(alpha);

                if (minMax.minVal < 250) {
                    // Use Alpha channel for contours: Transparent pixels have low alpha.
                    // Threshold: Any pixel with alpha > 10 is considered part of the object (White/255)
                    // This allows correct contour detection on transparent backgrounds.
                    cv.threshold(alpha, binary, 10, 255, cv.THRESH_BINARY);
                } else {
                    // Original Logic for Opaque Images: Grayscale + Otsu + Invert
                    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
                    cv.threshold(gray, binary, 127, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);
                }
                // -----------------------------------------------------------------

                cv.findContours(binary, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
                if (contours.size() === 0) throw new Error("No contours found.");

                let significantContours = [], totalPerimeter = 0;
                for (let i = 0; i < contours.size(); i++) {
                    const contour = contours.get(i);
                    if (cv.contourArea(contour) > 100) {
                        significantContours.push(contour);
                        totalPerimeter += cv.arcLength(contour, true);
                    } else {
                        contour.delete();
                    }
                }

                if (significantContours.length === 0) throw new Error("No significant contours found after filtering.");
                significantContours.sort((a, b) => cv.boundingRect(a).x - cv.boundingRect(b).x);

                for (const contour of significantContours) {
                    const simplifiedContour = new cv.Mat();
                    const perimeter = cv.arcLength(contour, true);
                    if (perimeter === 0) continue;
                    const targetPointCount = Math.max(3, Math.round(parseInt(pointsNumberInput.value, 10) * (perimeter / totalPerimeter)));
                    let minEpsilon = 0, maxEpsilon = perimeter * 0.1, currentEpsilon = maxEpsilon / 2;
                    for (let i = 0; i < 20; i++) {
                        cv.approxPolyDP(contour, simplifiedContour, currentEpsilon, true);
                        const count = simplifiedContour.rows;
                        if (count > targetPointCount) minEpsilon = currentEpsilon;
                        else if (count < targetPointCount) maxEpsilon = currentEpsilon;
                        else break;
                        currentEpsilon = (minEpsilon + maxEpsilon) / 2;
                    }
                    let contourDots = [];
                    for (let i = 0; i < simplifiedContour.data32S.length; i += 2) contourDots.push({ x: simplifiedContour.data32S[i], y: simplifiedContour.data32S[i + 1] });
                    if (contourDots.length > 0) {
                        let topPointIndex = 0;
                        for (let i = 1; i < contourDots.length; i++) {
                            if (contourDots[i].y < contourDots[topPointIndex].y) topPointIndex = i;
                        }
                        contourDots = contourDots.slice(topPointIndex).concat(contourDots.slice(0, topPointIndex));
                    }
                    allDots = allDots.concat(contourDots);
                    simplifiedContour.delete();
                }
                state.dots = allDots;
                redrawDrawCanvas();
            } catch (error) {
                console.error(error);
                alert(`Contour detection failed: ${error.message}`);
            } finally {
                if (src) src.delete();
                if (gray) gray.delete();
                if (binary) binary.delete();
                if (contours) contours.delete();
                if (hierarchy) hierarchy.delete();
                if (channels) channels.delete();
                if (alpha) alpha.delete();
                canvasLoader.classList.add('hidden');
            }
        }, 50);
    };
    const debouncedAutoDetect = debounce(runAutoDetect, 400);

    // --- OpenCV Loading ---
    let opencvScriptLoaded = false;
    const interactionEvents = ['scroll', 'click', 'touchstart', 'keydown'];
    function onOpenCvReady() {
        if (opencvStatus) {
            opencvStatus.textContent = 'Generator Ready!';
            opencvStatus.classList.remove('text-gray-400', 'text-red-500');
            opencvStatus.classList.add('text-green-500');
        }
        if (dropZone) {
            dropZone.classList.remove('opacity-50', 'pointer-events-none', 'cursor-not-allowed');
            dropZone.style.cursor = 'pointer';
            dropZone.style.opacity = '1';
            dropZone.style.pointerEvents = 'auto';
            const label = dropZone.querySelector('label[for="image-loader"]');
            if (label) label.classList.remove('cursor-not-allowed');
        }
        opencvScriptLoaded = true;
        if (state.originalImage && generatorMainArea.classList.contains('hidden') === false) {
            console.log('OpenCV is ready. Starting auto-detection for the pending image.');
            canvasLoader.querySelector('p').textContent = 'Auto-detecting...';
            runAutoDetect();
        }
    } function removeInteractionListeners() { interactionEvents.forEach(event => { document.removeEventListener(event, loadOpenCv); }); }
    function loadOpenCv() {
        if (opencvScriptLoaded || document.querySelector('script[src*="opencv.js"]')) return;
        if (opencvStatus) { opencvStatus.textContent = 'Loading generator...'; opencvStatus.classList.add('text-gray-500'); }
        const script = document.createElement('script');
        script.src = 'https://pub-476193f3c5084ebaabd517e2c8788715.r2.dev/opencv.js';
        script.async = true; script.onload = onOpenCvReady;
        script.onerror = () => { if (opencvStatus) { opencvStatus.textContent = 'Error: Failed to load generator.'; opencvStatus.classList.add('text-red-500'); } if (aiStatusMessage) { aiStatusMessage.textContent = 'Error loading components. Please refresh.' } };
        document.body.appendChild(script);
        removeInteractionListeners();
    }
    function setupInteractionListeners() { interactionEvents.forEach(event => { document.addEventListener(event, loadOpenCv, { once: true, passive: true }); }); }
    if (opencvStatus) { opencvStatus.textContent = 'Generator will load on first interaction...'; }
    setupInteractionListeners();

    // --- AI Generation ---
    async function generateAiImageFromLocalBackend(userPrompt) {
        if (!aiStatusArea || !generateAiImageBtn || !aiStatusMessage) return;
        aiStatusArea.classList.remove('hidden');
        aiStatusArea.querySelector('#ai-loader').classList.remove('hidden');
        generateAiImageBtn.disabled = true;
        generateAiImageBtn.querySelector('#generate-button-text').textContent = 'Generating...';
        aiStatusMessage.textContent = `Generating image for "${userPrompt}"... This may take a moment.`;
        const apiEndpoint = 'https://connectthedotsprintable.online/api/doubao';
        const finalPrompt = `${userPrompt}, bold outline, simple line art, for coloring book, black and white, minimal shading, white background`;
        try {
            const imageResponse = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: finalPrompt, size: "1024x1024" })
            });
            if (!imageResponse.ok) {
                let errorText = "An unknown API error occurred.";
                try { const errorJson = await imageResponse.json(); errorText = errorJson.error || errorJson.message || JSON.stringify(errorJson); } catch (e) { errorText = imageResponse.statusText; }
                throw new Error(`API Error: ${imageResponse.status} - ${errorText}`);
            }
            aiStatusMessage.textContent = 'Processing image...';
            const blob = await imageResponse.blob();
            if (!blob.type.startsWith('image/')) { throw new Error('Received data is not a valid image.'); }
            const filename = `AI_${userPrompt.substring(0, 15).replace(/\W/g, '_')}.${blob.type.split('/')[1] || 'png'}`;
            const file = new File([blob], filename, { type: blob.type });
            // Pass flag true to indicate AI generation (skips modal)
            handleFile(file, true);
        } catch (error) {
            console.error("AI Generation Error:", error);
            aiStatusMessage.textContent = `Error: ${error.message}`;
        } finally {
            if (generateAiImageBtn) {
                generateAiImageBtn.disabled = false;
                generateAiImageBtn.querySelector('#generate-button-text').textContent = 'Generate Image';
            }
            if (aiStatusArea) {
                aiStatusArea.querySelector('#ai-loader').classList.add('hidden');
            }
        }
    }

    // --- Setup UI ---
    function setupActionUI(type) {
        actionUiContainer.innerHTML = '';
        if (type === 'upload') {
            actionUiContainer.appendChild(uploadTemplate.firstElementChild.cloneNode(true));
            imageLoader = document.getElementById('image-loader');
            dropZone = document.getElementById('drop-zone');
            imageLoader.addEventListener('change', (e) => handleFile(e.target.files[0]));
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('bg-gray-100', 'border-primary'); });
            dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); dropZone.classList.remove('bg-gray-100', 'border-primary'); });
            dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('bg-gray-100', 'border-primary'); handleFile(e.dataTransfer.files[0]); });
            if (opencvScriptLoaded) {
                dropZone.classList.remove('opacity-50', 'pointer-events-none', 'cursor-not-allowed');
                dropZone.style.cursor = 'pointer'; dropZone.style.opacity = '1'; dropZone.style.pointerEvents = 'auto';
                dropZone.querySelector('label[for="image-loader"]').classList.remove('cursor-not-allowed');
            }
        } else if (type === 'ai') {
            actionUiContainer.appendChild(aiGenerateTemplate.firstElementChild.cloneNode(true));
            aiPromptInput = document.getElementById('ai-prompt-input');
            generateAiImageBtn = document.getElementById('generate-ai-image-btn');
            aiStatusArea = document.getElementById('ai-status-area');
            aiStatusMessage = document.getElementById('ai-status-message');
            generateAiImageBtn.addEventListener('click', () => {
                const prompt = aiPromptInput.value.trim();
                if (prompt.length < 5) { alert("Please enter a longer, descriptive prompt."); return; }
                if (!opencvScriptLoaded) { alert("Generator is still loading. Please wait for the 'Generator Ready!' message."); loadOpenCv(); return; }
                generateAiImageFromLocalBackend(prompt);
            });
        }
    }

    uploadChoiceCard.addEventListener('click', () => {
        uploadChoiceCard.classList.remove('border-gray-300'); uploadChoiceCard.classList.add('border-primary');
        aiChoiceCard.classList.remove('border-primary'); aiChoiceCard.classList.add('border-gray-300');
        setupActionUI('upload');
    });
    aiChoiceCard.addEventListener('click', () => {
        aiChoiceCard.classList.remove('border-gray-300'); aiChoiceCard.classList.add('border-primary');
        uploadChoiceCard.classList.remove('border-primary'); uploadChoiceCard.classList.add('border-gray-300');
        setupActionUI('ai');
    });

    const exampleImages = document.querySelectorAll('#examples-content img');
    async function handleExampleImageClick(event) {
        const imgElement = event.currentTarget; const imageUrl = imgElement.src; const filename = imageUrl.split('/').pop() || 'example-image.webp';
        try {
            const response = await fetch(imageUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const blob = await response.blob();
            const file = new File([blob], filename, { type: blob.type });
            handleFile(file, true); // Treat examples like AI (skip modal)
        } catch (error) {
            console.error('Error fetching example image:', error);
            alert('Could not load the example image. Please check your connection.');
        }
    }
    exampleImages.forEach(img => img.addEventListener('click', handleExampleImageClick));

    if (changeImageBtn) changeImageBtn.addEventListener('click', resetGeneratorState);

    const updatePointsValue = (value, triggerDetect = true) => { let numValue = parseInt(value, 10); if (isNaN(numValue)) numValue = 25; const min = parseInt(dotCountSlider.min, 10); const max = parseInt(dotCountSlider.max, 10); numValue = Math.max(min, Math.min(max, numValue)); dotCountSlider.value = numValue; pointsNumberInput.value = numValue; if (state.originalImage && triggerDetect) debouncedAutoDetect(); };
    pointsMinusBtn.addEventListener('click', () => updatePointsValue(parseInt(pointsNumberInput.value, 10) - 1));
    pointsPlusBtn.addEventListener('click', () => updatePointsValue(parseInt(pointsNumberInput.value, 10) + 1));
    dotCountSlider.addEventListener('input', (e) => updatePointsValue(e.target.value));
    pointsNumberInput.addEventListener('input', (e) => updatePointsValue(e.target.value, false));
    pointsNumberInput.addEventListener('blur', (e) => { if (e.target.value === '') updatePointsValue(25); else updatePointsValue(e.target.value); });
    [fontSizeSlider, dotSizeSlider, dotColorPicker, hintTypeRadios, thicknessSlider].forEach(el => el.addEventListener('input', updateConfigAndRedraw));
    clearBtn.addEventListener('click', () => { if (state.originalImage) { state.dots = []; updateConfigAndRedraw(); } });

    // Canvas Interactions
    let lastTapTime = 0, aDotWasJustDeleted = false;
    const handleDrawStart = (e) => { if (!state.originalImage) return; e.preventDefault(); aDotWasJustDeleted = false; const currentTime = new Date().getTime(); if (currentTime - lastTapTime < 300) { const pos = getEventPos(drawCanvas, e); const dotIndexToDelete = state.dots.findIndex(dot => distance(dot, pos) < state.config.dotRadius + 10); if (dotIndexToDelete !== -1) { state.dots.splice(dotIndexToDelete, 1); redrawDrawCanvas(); aDotWasJustDeleted = true; } lastTapTime = 0; return; } lastTapTime = currentTime; const pos = getEventPos(drawCanvas, e); state.draggedDotIndex = state.dots.findIndex(dot => distance(dot, pos) < state.config.dotRadius + 10); if (state.draggedDotIndex !== -1) drawCanvas.style.cursor = 'grabbing'; };
    const handleDrawMove = (e) => { if (state.draggedDotIndex === -1) return; e.preventDefault(); state.dots[state.draggedDotIndex] = getEventPos(drawCanvas, e); redrawDrawCanvas(); };
    const handleDrawEnd = (e) => { if (state.draggedDotIndex === -1 && state.originalImage && !aDotWasJustDeleted) { const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX; const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY; const rect = drawCanvas.getBoundingClientRect(); state.dots.push({ x: (clientX - rect.left) * (drawCanvas.width / rect.width), y: (clientY - rect.top) * (drawCanvas.height / rect.height) }); } state.draggedDotIndex = -1; drawCanvas.style.cursor = 'crosshair'; redrawDrawCanvas(); };
    drawCanvas.addEventListener('mousedown', handleDrawStart); drawCanvas.addEventListener('mousemove', handleDrawMove); drawCanvas.addEventListener('mouseup', handleDrawEnd);
    drawCanvas.addEventListener('touchstart', handleDrawStart, { passive: false }); drawCanvas.addEventListener('touchmove', handleDrawMove, { passive: false }); drawCanvas.addEventListener('touchend', handleDrawEnd);

    const handleDownload = (format) => {
        const canvas = drawCanvas, filename = `connect-the-dots.${format}`;
        if (format === 'png') {
            const link = document.createElement('a'); link.download = filename; link.href = canvas.toDataURL('image/png'); link.click();
        } else if (format === 'pdf') {
            if (typeof window.jspdf === 'undefined') { alert('PDF library is not loaded yet.'); return; }
            const { jsPDF } = window.jspdf;
            const imgData = canvas.toDataURL('image/png');
            const orientation = canvas.width > canvas.height ? 'l' : 'p';
            const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio < heightRatio ? widthRatio : heightRatio;
            const imgWidth = canvas.width * ratio;
            const imgHeight = canvas.height * ratio;
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;
            doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            doc.save(filename);
        }
    };
    downloadPngBtn.addEventListener('click', () => handleDownload('png'));
    downloadPdfBtn.addEventListener('click', () => handleDownload('pdf'));

    resetGeneratorState();
});