
// Mobile menu toggle
document
    .getElementById("mobile-menu-button")
    .addEventListener("click", function () {
        const mobileMenu = document.getElementById("mobile-menu");
        mobileMenu.classList.toggle("hidden");
    });

// FAQ toggles
document.querySelectorAll(".faq-toggle").forEach((toggle) => {
    toggle.addEventListener("click", function () {
        const content = this.nextElementSibling;
        const icon = this.querySelector("svg"); // Changed to select svg

        content.classList.toggle("hidden");
        // Simple rotation for the icon as an example
        icon.classList.toggle("rotate-45");
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId !== "#") {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                });
            }
        }
    });
});

// --- ADDED: Image Download Logic ---
async function downloadImage(url, filename) {
    try {
        // Fetch the image data as a blob
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok.");
        const blob = await response.blob();

        const objectUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = objectUrl;
        a.download = filename || "printable.png"; // Use provided filename or a default
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
    } catch (error) {
        console.error("Download failed:", error);
        alert(
            "Sorry, the image could not be downloaded. Please check the console for errors."
        );
    }
}

document.querySelectorAll(".download-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent the default link behavior

        // Get the image URL and filename from the data attributes
        const imageUrl = this.dataset.imgSrc;
        const filename = this.dataset.filename;

        if (imageUrl) {
            downloadImage(imageUrl, filename);
        } else {
            console.error(
                "No image source (data-img-src) found for this button."
            );
        }
    });
});

const imageLoader = document.getElementById("imageLoader");
const fileNameSpan = document.getElementById("fileName");
const hintRadios = document.querySelectorAll('input[name="imageHint"]');
const thresholdSlider = document.getElementById("thresholdSlider");
const pointCountSlider = document.getElementById("pointCountSlider");
const traceAmountSlider = document.getElementById("traceAmountSlider");
const previewContainer = document.getElementById("previewContainer");
const placeholder = document.getElementById("placeholder");
// The other canvases are kept for potential off-screen drawing but won't be displayed.
// dotsCanvas is our main, visible canvas.
const dotsCanvas = document.getElementById("dotsCanvas");
const loader = document.getElementById("loader");
const downloadBtn = document.getElementById("downloadBtn");

// --- Global Variables ---
let originalImage = null;
let currentPoints = [];
let allContours = null;

// --- OpenCV Initialization ---
function onOpenCvReady() {
    if (loader)
        loader.textContent = "";
}
const cvInterval = setInterval(() => {
    if (typeof cv !== "undefined") {
        onOpenCvReady();
        clearInterval(cvInterval);
    }
}, 100);

// --- Event Listeners ---
if (imageLoader)
    imageLoader.addEventListener("change", handleImageUpload);
if (hintRadios)
    hintRadios.forEach((radio) =>
        radio.addEventListener("change", updateDisplay)
    );
if (downloadBtn) downloadBtn.addEventListener("click", handleDownload);

// --- Main Functions ---
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) {
        if (fileNameSpan) fileNameSpan.textContent = "No file chosen";
        return;
    }
    if (fileNameSpan) fileNameSpan.textContent = file.name;
    const reader = new FileReader();
    reader.onload = function (event) {
        originalImage = new Image();
        originalImage.onload = () => {
            if (placeholder) placeholder.style.display = "none";
            // Defer OpenCV loading until first use
            loadOpenCVIfNeeded(processImage);
        };
        originalImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

let openCvLoaded = false;
function loadOpenCVIfNeeded(callback) {
    if (openCvLoaded && typeof cv !== 'undefined') {
        callback();
        return;
    }

    if (loader) loader.textContent = "Loading image processor...";
    const script = document.createElement('script');
    script.src = './js/opencv.js';
    script.async = true;
    script.onload = () => {
        openCvLoaded = true;
        if (loader) loader.textContent = "";
        // Wait for cv to be ready
        const checkCv = setInterval(() => {
            if (typeof cv.imread !== 'undefined') {
                clearInterval(checkCv);
                callback();
            }
        }, 100);
    };
    script.onerror = () => {
        if (loader) loader.textContent = "Error loading image processor.";
        alert("Failed to load image processing library.");
    };
    document.body.appendChild(script);
}


function handleDownload() {
    if (!originalImage || dotsCanvas.style.display === "none") return;
    const link = document.createElement("a");
    link.download = "connect-the-dots.png";
    link.href = dotsCanvas.toDataURL("image/png");
    link.click();
}

function processImage() {
    if (!originalImage || typeof cv === "undefined") return;

    if (downloadBtn) downloadBtn.disabled = false;

    // 1. Calculate the responsive display size based on the container width.
    const maxWidth = previewContainer.clientWidth;
    let displayW = originalImage.width;
    let displayH = originalImage.height;

    if (originalImage.width > maxWidth) {
        const scaleRatio = maxWidth / originalImage.width;
        displayW = maxWidth;
        displayH = Math.floor(originalImage.height * scaleRatio);
    }

    // 2. Set the container and the main canvas to this responsive size.
    previewContainer.style.aspectRatio = displayW / displayH;
    dotsCanvas.width = displayW;
    dotsCanvas.height = displayH;

    // 3. Create a resized image in memory (Mat object) for processing.
    // All subsequent OpenCV operations use this resized version.
    let src = cv.imread(originalImage);
    let resizedSrc = new cv.Mat();
    cv.resize(
        src,
        resizedSrc,
        new cv.Size(displayW, displayH),
        0,
        0,
        cv.INTER_AREA
    );

    let gray = new cv.Mat(),
        binary = new cv.Mat(),
        contours = new cv.MatVector(),
        hierarchy = new cv.Mat();
    cv.cvtColor(resizedSrc, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(
        gray,
        binary,
        parseInt(thresholdSlider.value, 10),
        255,
        cv.THRESH_BINARY_INV
    );
    cv.findContours(
        binary,
        contours,
        hierarchy,
        cv.RETR_CCOMP,
        cv.CHAIN_APPROX_NONE
    );

    if (allContours) allContours.delete();
    allContours = contours.clone();

    // 4. Find the longest contour from the resized image.
    let mainContour = null;
    if (contours.size() > 0) {
        let maxLength = 0,
            longestContourIndex = -1;
        for (let i = 0; i < contours.size(); i++) {
            let len = cv.arcLength(contours.get(i), true);
            if (len > maxLength) {
                maxLength = len;
                longestContourIndex = i;
            }
        }
        if (longestContourIndex !== -1)
            mainContour = contours.get(longestContourIndex);
    }

    // 5. Calculate point positions based on the resized contour.
    currentPoints = [];
    if (mainContour) {
        const perimeter = cv.arcLength(mainContour, true);
        const targetPointCount = parseInt(pointCountSlider.value, 10);
        if (perimeter > 0) {
            const step = perimeter / targetPointCount;
            const contourPoints = [];
            for (let i = 0; i < mainContour.data32S.length; i += 2)
                contourPoints.push({
                    x: mainContour.data32S[i],
                    y: mainContour.data32S[i + 1],
                });
            if (contourPoints.length > 1) contourPoints.push(contourPoints[0]);

            let accumulatedDistance = 0,
                targetIndex = 0;
            const targetDistances = Array.from(
                { length: targetPointCount },
                (_, i) => i * step
            );

            if (contourPoints.length > 0) {
                currentPoints.push(contourPoints[0]);
                targetIndex++;
            }

            for (let i = 1; i < contourPoints.length; i++) {
                const p1 = contourPoints[i - 1],
                    p2 = contourPoints[i];
                const segmentLength = Math.sqrt(
                    Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
                );
                while (
                    targetIndex < targetDistances.length &&
                    accumulatedDistance + segmentLength >=
                    targetDistances[targetIndex]
                ) {
                    const distanceNeeded =
                        targetDistances[targetIndex] - accumulatedDistance;
                    const ratio =
                        segmentLength > 0 ? distanceNeeded / segmentLength : 0;
                    currentPoints.push({
                        x: p1.x + ratio * (p2.x - p1.x),
                        y: p1.y + ratio * (p2.y - p1.y),
                    });
                    targetIndex++;
                }
                accumulatedDistance += segmentLength;
            }
        }
    }

    updateDisplay();

    // 7. Clean up memory.
    src.delete();
    resizedSrc.delete();
    gray.delete();
    binary.delete();
    contours.delete();
    hierarchy.delete();
}

function updateDisplay() {
    if (!originalImage) return;

    const selectedHint = document.querySelector(
        'input[name="imageHint"]:checked'
    ).value;
    const mainCtx = dotsCanvas.getContext("2d");

    mainCtx.fillStyle = "white";
    mainCtx.fillRect(0, 0, dotsCanvas.width, dotsCanvas.height);

    dotsCanvas.style.display = "block";

    if (selectedHint === "contrast") {
        drawContrastBackgroundOn(mainCtx);
        drawTraceBackgroundOn(mainCtx);
    } else if (selectedHint === "trace") {
        drawTraceBackgroundOn(mainCtx);
    }

    drawDotsAndNumbersOn(mainCtx, currentPoints);
}

function drawDotsAndNumbersOn(ctx, points) {
    if (!points || points.length === 0) return;
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    points.forEach((point, index) => {
        if (!point) return;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(index + 1, point.x, point.y - 15);
    });
}

function drawTraceBackgroundOn(ctx) {
    if (!allContours) return;
    const traceAmount = parseInt(traceAmountSlider.value, 10) / 100;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = 1;
    for (let i = 0; i < allContours.size(); ++i) {
        const contour = allContours.get(i);
        if (contour.rows < 2) continue;
        const pointsToDraw = Math.floor(contour.rows * traceAmount);
        if (pointsToDraw < 1) continue;
        ctx.beginPath();
        ctx.moveTo(contour.data32S[0], contour.data32S[1]);
        for (let j = 2; j < pointsToDraw * 2; j += 2) {
            ctx.lineTo(contour.data32S[j], contour.data32S[j + 1]);
        }
        ctx.stroke();
    }
}

function drawContrastBackgroundOn(ctx) {
    const canvas = ctx.canvas;
    const threshold = parseInt(thresholdSlider.value, 10);

    // Draw the original image, scaled to fit the responsive canvas.
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const brightness =
            0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const color = brightness <= threshold ? 0 : 255;
        data[i] = data[i + 1] = data[i + 2] = color;
        data[i + 3] = 255; // Ensure full opacity
    }
    ctx.putImageData(imageData, 0, 0);
}

// --- Debounced Slider Handling for Performance ---
let debounceTimer;
function debouncedProcessImage() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (originalImage) {
            loadOpenCVIfNeeded(processImage);
        }
    }, 150); // A bit more delay for sliders
}
[thresholdSlider, pointCountSlider, traceAmountSlider].forEach(
    (slider) => {
        if (slider) {
            slider.addEventListener("input", (e) => {
                const span = e.target.parentElement.querySelector("span");
                if (span) span.textContent = e.target.value;
                debouncedProcessImage();
            });
        }
    }
);
