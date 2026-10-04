/* ==========================================================================
   PORTFOLIO INTERACTIVE CORE & DATA STORE
   ========================================================================== */

const projectsData = [
    {
        id: "defnet",
        number: "01",
        title: "DefNet Network Scanner & Asset Management Platform",
        category: "FULL-STACK · NETWORK SECURITY · IOT",
        shortTitle: "DEFNET\nSCANNER",
        description:
            "Architected a defense-grade asset tracking and network diagnostic platform for Vehicle Factory Jabalpur (AVNL, Ministry of Defence, Govt. of India). Integrated a localized Python network engine utilizing Scapy for live subnet host discovery, mapped real-time room-wise hardware inventory with React 18 and Chart.js, and engineered a backend PHP REST API with MySQL implementing Role-Based Access Control (RBAC), server activity logs, and exportable PDF/CSV telemetry reports.",
        tech: [
            "React 18",
            "PHP REST API",
            "MySQL 8.0",
            "Python (Scapy)",
            "Chart.js",
            "RBAC Security",
            "Subnet Discovery"
        ],
        highlights: [
            "Localized Python (Scapy) IP/ARP scanner engine for real-time live host discovery across enterprise subnets",
            "Interactive hardware inventory visualization across distinct facility rooms with Chart.js telemetry",
            "Defense-grade backend REST API with Role-Based Access Control (RBAC) and immutable server audit logs"
        ],
        pipeline: [
            { step: "01 / CAPTURE", title: "Scapy Subnet Engine", desc: "Broadcasts localized ARP/ICMP packet sweeps to discover live network IP, MAC, and device vendor identities." },
            { step: "02 / BACKEND", title: "PHP REST & MySQL 8.0", desc: "Validates RBAC permissions, normalizes asset state models, and writes encrypted security audit logs." },
            { step: "03 / FRONTEND", title: "React 18 & Chart.js", desc: "Renders live room-wise hardware asset distribution maps with responsive telemetry dashboards." }
        ],
        badge: "Defense IT & Systems",
        link: "https://github.com/upasana15-k/defnet-scanner",
        colorClass: "project-blue"
    },

    {
        id: "aipose",
        number: "02",
        title: "AI Photography Pose Assistant & Real-Time Director",
        category: "AI · COMPUTER VISION · EDGE COMPUTE · WASM",
        shortTitle: "AI POSE\nASSISTANT",
        description:
            "Architected an on-device computer vision engine utilizing MediaPipe Pose Landmarker to dynamically extract and parse 33 normalized 3D skeletal geometry joints from live video feeds. Engineered a prioritized InstructionEngine with hysteresis and anti-flicker debouncing algorithms to calculate joint alignment differentials and supply real-time posture corrections, alongside a hands-free auto-capture pipeline (≥700ms stability check) and spoken voice direction.",
        tech: [
            "React 18",
            "MediaPipe Pose",
            "WebAssembly",
            "WebGPU",
            "Vite",
            "Vitest",
            "Edge AI"
        ],
        highlights: [
            "Real-time 33-point 3D skeletal landmark extraction running entirely on-device via WebAssembly/WebGPU",
            "Custom InstructionEngine with hysteresis & anti-flicker debouncing for real-time posture guidance",
            "Hands-free auto-capture pipeline with ≥700ms stability score check & sudden motion cancellation"
        ],
        pipeline: [
            { step: "01 / VISION", title: "MediaPipe 33-Point Engine", desc: "Runs on-device via WebAssembly/WebGPU to extract normalized (X, Y, Z) joint coordinates at 60 FPS." },
            { step: "02 / INSTRUCTION", title: "Hysteresis Differential", desc: "Calculates angular differentials between user posture and target aesthetic reference poses." },
            { step: "03 / CAPTURE", title: "Stability Hold Pipeline", desc: "Triggers auto-capture upon achieving ≥700ms continuous stability with motion cancelation." }
        ],
        badge: "Edge AI & Vision",
        link: "https://github.com/upasana15-k/ai-photographer",
        colorClass: "project-lavender"
    },

    {
        id: "bookmark",
        number: "03",
        title: "Bookmark Web App",
        category: "FRONTEND · REACT.JS · WEB APP",
        shortTitle: "BOOKMARK\nAPP",
        description:
            "Built a personal bookmark manager web application using React.js with modular component architecture and local storage persistence. Designed a clean, organized UI allowing users to save, categorize, and manage web links efficiently. Focused on responsive layout and reusable component design patterns.",
        tech: [
            "React.js",
            "CSS3 / Responsive UI",
            "Local Storage",
            "Component Design",
            "Git / GitHub"
        ],
        highlights: [
            "Modular React.js component architecture for clean and scalable UI",
            "Local storage persistence for bookmarks across sessions",
            "Responsive and intuitive link management interface"
        ],
        pipeline: [
            { step: "01 / UI DESIGN", title: "Clean Interface Layout", desc: "Designed a minimal, user-friendly bookmark manager layout with category organization." },
            { step: "02 / REACT COMPONENTS", title: "Modular Architecture", desc: "Built reusable React.js components for bookmark cards, category filters, and add/edit forms." },
            { step: "03 / PERSISTENCE", title: "Local Storage Layer", desc: "Implemented browser-side local storage for persistent bookmark data across sessions." }
        ],
        badge: "Frontend & Web App",
        link: "https://github.com/upasana15-k/Bookmarks",
        colorClass: "project-emerald"
    },

    {
        id: "mythic",
        number: "04",
        title: "Mythic Gesture Engine — Real-Time CV & GPU VFX System",
        category: "AI · COMPUTER VISION · GPU VFX · PYTHON",
        shortTitle: "MYTHIC\nENGINE",
        description:
            "Architected a real-time computer vision and GPU visual effects engine in Python transforming live webcam hand gestures into cinematic mythological magic spells. Engineered adaptive self-learning calibration (24s wizard), orientation-independent palm-relative vector mathematics (V = WRIST → MIDDLE_MCP), vectorized 20,000+ GPU particle simulation with ModernGL (OpenGL 3.3), dynamic environment color grading transforming physical rooms into elemental realms, and cinema-grade procedural DSP elemental audio synthesis.",
        tech: [
            "Python 3.10+",
            "ModernGL (OpenGL 3.3)",
            "MediaPipe Hands",
            "NumPy (Vectorized SoA)",
            "DSP Audio Synthesis",
            "Real-Time LUT Grading",
            "Computer Vision"
        ],
        highlights: [
            "Real-time 21-point 3D hand tracking with orientation-independent palm-relative vector math",
            "Adaptive self-learning calibration wizard learning user hand anatomy & joint thresholds",
            "Vectorized 20,000+ particle physics simulation at 60 FPS using NumPy SoA & ModernGL shaders",
            "Dynamic camera background color grading transforming physical room into elemental mythic realms",
            "Cinema-grade procedural elemental DSP audio synthesis (42Hz supernova bass, Tesla coil arcs)"
        ],
        pipeline: [
            { step: "01 / VISION & VECTOR", title: "MediaPipe & Palm Math", desc: "Extracts 21 3D landmarks and projects knuckles along palm vector axis (V = WRIST → MIDDLE_MCP) for pose-invariant recognition." },
            { step: "02 / GPU COMPUTE", title: "ModernGL & 20k Particles", desc: "Simulates 20,000+ particles at 60 FPS via NumPy Struct-of-Arrays (SoA) and ModernGL OpenGL 3.3 compute passes." },
            { step: "03 / VFX & DSP AUDIO", title: "Atmosphere Grading & Audio", desc: "Applies real-time camera LUT grading and generates procedural DSP elemental sound waves (Tesla arcs, 42Hz sub-bass)." }
        ],
        badge: "GPU VFX & Vision",
        link: "https://github.com/upasana15-k/mythic-gesture-engine",
        colorClass: "project-amber"
    }
];

/* ==========================================================================
   CERTIFICATE DATA (TATA | FORAGE - GENAI POWERED DATA ANALYTICS)
   ========================================================================== */

const certificateData = {
    id: "tata-forage-cert",
    title: "GenAI Powered Data Analytics Job Simulation",
    issuer: "Tata · Forage",
    issuerBadge: "Tata · Forage Certified",
    date: "June 30th, 2026",
    recipient: "Upasana Kudape",
    enrolmentCode: "tf4Hf3scPF95sNkCf",
    userCode: "6a4282f5a18d20d0140298c4",
    signatory: "Tom Brunskill, Co-Founder of Forage",
    description:
        "Over the period of June 2026, Upasana Kudape completed practical job simulation tasks in GenAI-Powered Data Analytics designed by Tata and Forage. Demonstrated applied competencies in exploratory data analysis, AI delinquency risk prediction, business reporting, data storytelling, and collections strategy implementation.",
    tasks: [
        "Exploratory data analysis and risk profiling",
        "Predicting delinquency with AI",
        "Business report and data storytelling for collections strategy",
        "Implementing an AI-driven collections strategy"
    ],
    skills: ["GenAI", "Data Analytics", "Risk Profiling", "Predictive AI Modeling", "Data Storytelling", "AI Collections Strategy"],
    imagePath: "assets/images/tata_forage_certificate.png",
    pdfPath: "assets/Tata_Forage_GenAI_Certificate.pdf",
    verificationUrl: "assets/Tata_Forage_GenAI_Certificate.pdf",
    status: "Verified Certificate of Completion"
};


/* ==========================================================================
   WEB AUDIO SYNTHESIZER (HAPTIC SOUND EFFECTS)
   ========================================================================== */

let audioCtx = null;
let isAudioMuted = localStorage.getItem("portfolio_audio_muted") === "true";

function initAudioContext() {
    if (!audioCtx && typeof window.AudioContext !== "undefined") {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
}

function playHapticSound(type = "click") {
    if (isAudioMuted) return;
    try {
        initAudioContext();
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === "click") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === "toggle") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(780, now + 0.07);
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            osc.start(now);
            osc.stop(now + 0.07);
        } else if (type === "success") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(880, now + 0.06);
            gain.gain.setValueAtTime(0.07, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        }
    } catch (e) {
        // Audio error ignored silently
    }
}

// Audio Toggle Button
const audioToggleBtn = document.getElementById("audioToggleBtn");
if (isAudioMuted) {
    document.body.classList.add("audio-muted");
}

if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", () => {
        isAudioMuted = !isAudioMuted;
        localStorage.setItem("portfolio_audio_muted", isAudioMuted);
        document.body.classList.toggle("audio-muted", isAudioMuted);
        if (!isAudioMuted) playHapticSound("toggle");
    });
}


/* ==========================================================================
   MULTI-THEME ENGINE (5 Themes)
   ========================================================================== */

const THEMES = [
    {
        id: "aurora",
        name: "Aurora Violet",
        tag: "Light",
        palette: ["#6d28d9", "#f0eff8", "#ec4899"]
    },
    {
        id: "eclipse",
        name: "Eclipse Dark",
        tag: "Dark",
        palette: ["#8b5cf6", "#09090f", "#a78bfa"]
    },
    {
        id: "future",
        name: "Future Tech",
        tag: "Cyberpunk",
        palette: ["#00e5ff", "#020c14", "#39ff14"]
    },
    {
        id: "classic",
        name: "Classic Editorial",
        tag: "Warm",
        palette: ["#b5470e", "#fdf6e3", "#2d6a4f"]
    },
    {
        id: "retro",
        name: "Retro Terminal",
        tag: "CRT",
        palette: ["#00ff41", "#000d00", "#39ff14"]
    }
];

let currentThemeId = localStorage.getItem("portfolio_theme") || "aurora";

// Normalise legacy values
if (currentThemeId === "light") currentThemeId = "aurora";
if (currentThemeId === "dark")  currentThemeId = "eclipse";

const themePickerBtn    = document.getElementById("themePickerBtn");
const themePickerPanel  = document.getElementById("themePickerPanel");
const themeOptionsList  = document.getElementById("themeOptionsList");
const themeSwatchDot    = document.getElementById("themeSwatchDot");
const themePickerLabel  = document.getElementById("themePickerLabel");
const themePickerWrapper = document.getElementById("themePickerWrapper");

function applyTheme(themeId) {
    currentThemeId = themeId;
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("portfolio_theme", themeId);
    syncPickerUI();
}

function syncPickerUI() {
    const t = THEMES.find(th => th.id === currentThemeId) || THEMES[0];

    // Update swatch dot color
    if (themeSwatchDot) themeSwatchDot.style.background = t.palette[0];

    // Update button label
    if (themePickerLabel) themePickerLabel.textContent = t.name;

    // Update active state in list
    if (themeOptionsList) {
        themeOptionsList.querySelectorAll(".theme-option").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.themeId === currentThemeId);
        });
    }
}

function buildThemePanel() {
    if (!themeOptionsList) return;
    themeOptionsList.innerHTML = "";

    THEMES.forEach(t => {
        const btn = document.createElement("button");
        btn.className = "theme-option";
        btn.dataset.themeId = t.id;
        btn.type = "button";
        btn.setAttribute("role", "menuitem");
        btn.innerHTML = `
            <span class="t-palette">
                <span style="background:${t.palette[0]}"></span>
                <span style="background:${t.palette[1]}; border:1px solid #ffffff22;"></span>
                <span style="background:${t.palette[2]}"></span>
            </span>
            <span class="t-name">${t.name}</span>
            <span class="t-tag">${t.tag}</span>
        `;
        btn.addEventListener("click", () => {
            playHapticSound("toggle");
            applyTheme(t.id);
            closeThemePicker();
        });
        themeOptionsList.appendChild(btn);
    });

    syncPickerUI();
}

function openThemePicker() {
    if (!themePickerPanel) return;
    themePickerPanel.classList.add("open");
    themePickerBtn && themePickerBtn.setAttribute("aria-expanded", "true");
}

function closeThemePicker() {
    if (!themePickerPanel) return;
    themePickerPanel.classList.remove("open");
    themePickerBtn && themePickerBtn.setAttribute("aria-expanded", "false");
}

function toggleThemePicker() {
    themePickerPanel && themePickerPanel.classList.contains("open")
        ? closeThemePicker()
        : openThemePicker();
}

// Boot
applyTheme(currentThemeId);
buildThemePanel();

// Toggle button click
if (themePickerBtn) {
    themePickerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        playHapticSound("click");
        toggleThemePicker();
    });
}

// Close on outside click
document.addEventListener("click", (e) => {
    if (themePickerWrapper && !themePickerWrapper.contains(e.target)) {
        closeThemePicker();
    }
});

// Keep backward-compat ref for command palette
const themeToggleBtn = { click: () => {
    const idx = THEMES.findIndex(t => t.id === currentThemeId);
    applyTheme(THEMES[(idx + 1) % THEMES.length].id);
    playHapticSound("toggle");
} };


/* ==========================================================================
   CUSTOM MOUSE CURSOR WITH INTERPOLATION
   ========================================================================== */

const cursorDot = document.getElementById("cursorDot");
const cursorOutline = document.getElementById("cursorOutline");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = mouseX;
let outlineY = mouseY;
let isCursorVisible = false;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isCursorVisible) {
        isCursorVisible = true;
        document.body.classList.add("cursor-active");
    }

    if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }
}, { passive: true });

function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;

    if (cursorOutline) {
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
    }

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Magnetic & Hover Element State
const interactiveElements = document.querySelectorAll("a, button, .project-card, .skill-tag, .tilt-card, [data-magnetic]");

interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
    });
});


/* ==========================================================================
   INTERACTIVE HERO CANVAS: POSE & NETWORK VISUALIZATION
   ========================================================================== */

const heroCanvas = document.getElementById("heroCanvas");

if (heroCanvas) {
    const ctx = heroCanvas.getContext("2d");
    let width, height;
    let nodes = [];
    let canvasMouse = { x: -1000, y: -1000, radius: 140 };

    function resizeCanvas() {
        width = heroCanvas.width = heroCanvas.offsetWidth;
        height = heroCanvas.height = heroCanvas.offsetHeight;
        initNodes();
    }

    function initNodes() {
        nodes = [];
        const count = Math.min(36, Math.floor((width * height) / 22000));
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 3 + 2,
                isJoint: i % 4 === 0
            });
        }
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    heroCanvas.addEventListener("mousemove", (e) => {
        const rect = heroCanvas.getBoundingClientRect();
        canvasMouse.x = e.clientX - rect.left;
        canvasMouse.y = e.clientY - rect.top;
    }, { passive: true });

    heroCanvas.addEventListener("mouseleave", () => {
        canvasMouse.x = -1000;
        canvasMouse.y = -1000;
    });

    heroCanvas.addEventListener("click", (e) => {
        playHapticSound("click");
        const rect = heroCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Push nearby nodes outwards
        nodes.forEach((node) => {
            const dx = node.x - clickX;
            const dy = node.y - clickY;
            const dist = Math.hypot(dx, dy);
            if (dist < 180) {
                const angle = Math.atan2(dy, dx);
                node.vx += Math.cos(angle) * 3;
                node.vy += Math.sin(angle) * 3;
            }
        });
    });

    function drawCanvas() {
        ctx.clearRect(0, 0, width, height);

        // Read theme-aware colors from CSS variables
        const style = getComputedStyle(document.documentElement);
        const nodeColor      = style.getPropertyValue("--canvas-node").trim()      || "#4f46e5";
        const lineColor      = style.getPropertyValue("--canvas-line").trim()      || "rgba(79,70,229,0.1)";
        const mouseLineColor = style.getPropertyValue("--canvas-mouse-line").trim()|| "rgba(79,70,229,0.3)";

        // Update & draw nodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            node.x += node.vx;
            node.y += node.vy;

            // Bounce on edges
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            // Mouse interaction
            const dx = canvasMouse.x - node.x;
            const dy = canvasMouse.y - node.y;
            const dist = Math.hypot(dx, dy);

            if (dist < canvasMouse.radius) {
                ctx.beginPath();
                ctx.strokeStyle = mouseLineColor;
                ctx.lineWidth = 1.2;
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(canvasMouse.x, canvasMouse.y);
                ctx.stroke();
            }

            // Draw Node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = nodeColor;
            ctx.fill();

            // Connect nearby nodes
            for (let j = i + 1; j < nodes.length; j++) {
                const other = nodes[j];
                const ndx = node.x - other.x;
                const ndy = node.y - other.y;
                const nDist = Math.hypot(ndx, ndy);

                if (nDist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(drawCanvas);
    }
    drawCanvas();
}


/* ==========================================================================
   SCROLL PROGRESS BAR & SCROLL-SPY NAVIGATION
   ========================================================================== */

const scrollProgressBar = document.getElementById("scrollProgressBar");
const navSections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-item");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (scrollProgressBar) {
        scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // ScrollSpy Active Link Tracking
    let currentActive = "";
    navSections.forEach((sec) => {
        const top = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        if (scrollTop >= top && scrollTop < top + height) {
            currentActive = sec.getAttribute("id");
        }
    });

    navItems.forEach((item) => {
        const href = item.getAttribute("href");
        item.classList.toggle("active", href === `#${currentActive}`);
    });
}, { passive: true });


/* ==========================================================================
   ANIMATED STATS COUNTER ON SCROLL
   ========================================================================== */

const statNumbers = document.querySelectorAll(".stat-number");
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statNumbers.forEach((statEl) => {
                const target = parseInt(statEl.getAttribute("data-count"), 10);
                const prefix = statEl.getAttribute("data-prefix") || "";
                const suffix = statEl.getAttribute("data-suffix") || "";
                const duration = 1600;
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out expo
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const currentVal = Math.floor(easeProgress * target);

                    statEl.textContent = `${prefix}${currentVal}${suffix}`;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        statEl.textContent = `${prefix}${target}${suffix}`;
                    }
                }

                requestAnimationFrame(updateCount);
            });
        }
    });
}, { threshold: 0.25 });

const statsStrip = document.getElementById("statsStrip");
if (statsStrip) {
    statsObserver.observe(statsStrip);
}


/* ==========================================================================
   PROJECT CAROUSEL ENGINE
   ========================================================================== */

const projectTrack = document.getElementById("projectTrack");
const projectSlides = document.querySelectorAll(".project-slide");
const projectCounter = document.getElementById("projectCounter");
const projectTitle = document.getElementById("projectTitle");
const projectDescription = document.getElementById("projectDescription");
const projectTagsList = document.getElementById("projectTagsList");
const projectHighlightsBox = document.getElementById("projectHighlightsBox");
const projectBadge = document.getElementById("projectBadge");
const projectLink = document.getElementById("projectLink");
const progressFill = document.getElementById("progressFill");
const navigationButtons = document.querySelectorAll(".project-nav-item");
const projectCarousel = document.querySelector(".project-carousel");

let currentProject = 0;
let isAnimating = false;

function moveProjectTrack() {
    if (!projectTrack || !projectCarousel || projectSlides.length === 0) return;

    const activeSlide = projectSlides[currentProject];
    if (!activeSlide) return;

    const carouselWidth = projectCarousel.clientWidth;
    const slideWidth = activeSlide.offsetWidth;
    const slideLeft = activeSlide.offsetLeft;

    const centerOffset = (carouselWidth - slideWidth) / 2;
    const translateX = slideLeft - centerOffset;

    projectTrack.style.transform = `translate3d(${-translateX}px, 0, 0)`;
}

function updateProjectInformation(index) {
    const project = projectsData[index];
    if (!project) return;

    if (projectCounter) {
        projectCounter.textContent = `${project.number} / ${String(projectsData.length).padStart(2, "0")}`;
    }

    if (projectTitle) {
        projectTitle.textContent = project.title;
    }
    if (projectDescription) {
        projectDescription.textContent = project.description;
    }
    if (projectBadge) {
        projectBadge.textContent = project.badge || "Featured Project";
    }

    if (projectTagsList) {
        projectTagsList.innerHTML = "";
        project.tech.forEach((techItem) => {
            const span = document.createElement("span");
            span.className = "project-tech";
            span.textContent = techItem.toUpperCase();
            projectTagsList.appendChild(span);
        });
    }

    if (projectHighlightsBox) {
        projectHighlightsBox.innerHTML = "";
        if (project.highlights && project.highlights.length > 0) {
            const ul = document.createElement("ul");
            ul.className = "project-card-mini-highlights";
            project.highlights.forEach((hl) => {
                const li = document.createElement("li");
                li.textContent = hl;
                ul.appendChild(li);
            });
            projectHighlightsBox.appendChild(ul);
        }
    }

    if (projectLink) {
        projectLink.href = project.link;
    }

    navigationButtons.forEach((button, btnIndex) => {
        button.classList.toggle("active", btnIndex === currentProject);
    });

    if (progressFill) {
        const progress = ((index + 1) / projectsData.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

function updateActiveCard() {
    projectSlides.forEach((slide, index) => {
        const isActive = index === currentProject;
        slide.classList.toggle("active", isActive);
        slide.setAttribute("aria-selected", isActive ? "true" : "false");
    });
}

function changeProject(newIndex) {
    if (isAnimating || newIndex === currentProject) return;
    if (newIndex < 0 || newIndex >= projectsData.length) return;

    playHapticSound("click");
    isAnimating = true;
    currentProject = newIndex;

    updateActiveCard();
    updateProjectInformation(currentProject);
    moveProjectTrack();

    setTimeout(() => {
        isAnimating = false;
    }, 650);
}

// Slide Click Handlers
projectSlides.forEach((slide, index) => {
    slide.addEventListener("click", () => {
        if (index !== currentProject) {
            changeProject(index);
        } else {
            // Open modal deep-dive when clicking already active card
            openProjectModal(projectsData[currentProject]);
        }
    });
});

// Navigation Button Handlers
navigationButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        changeProject(index);
    });
});

// Touch Swipe Detection
let touchStartX = 0;
let touchEndX = 0;

if (projectCarousel) {
    projectCarousel.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    projectCarousel.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 40) {
            changeProject((currentProject + 1) % projectsData.length);
        } else if (touchEndX > touchStartX + 40) {
            changeProject((currentProject - 1 + projectsData.length) % projectsData.length);
        }
    }, { passive: true });
}


/* ==========================================================================
   INTERACTIVE 3D PERSPECTIVE TILT CARDS
   ========================================================================== */

const tiltCards = document.querySelectorAll(".tilt-card");

tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
    });
});


/* ==========================================================================
   PROJECT DEEP-DIVE ARCHITECTURE MODAL
   ========================================================================== */

const projectModal = document.getElementById("projectModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDiagramContainer = document.getElementById("modalDiagramContainer");
const modalBulletsList = document.getElementById("modalBulletsList");
const modalTechCloud = document.getElementById("modalTechCloud");
const modalRepoBtn = document.getElementById("modalRepoBtn");
const projectInspectTriggerBtn = document.getElementById("projectInspectTriggerBtn");

function openProjectModal(project) {
    if (!projectModal) return;
    playHapticSound("toggle");

    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalRepoBtn.href = project.link;

    // Build Diagram Pipeline Nodes
    modalDiagramContainer.innerHTML = "";
    project.pipeline.forEach((p) => {
        const node = document.createElement("div");
        node.className = "pipeline-node";
        node.innerHTML = `
            <span class="pipeline-step">${p.step}</span>
            <strong>${p.title}</strong>
            <p>${p.desc}</p>
        `;
        modalDiagramContainer.appendChild(node);
    });

    // Build Bullets List
    modalBulletsList.innerHTML = "";
    project.highlights.forEach((hl) => {
        const li = document.createElement("li");
        li.textContent = hl;
        modalBulletsList.appendChild(li);
    });

    // Build Tech Cloud
    modalTechCloud.innerHTML = "";
    project.tech.forEach((t) => {
        const span = document.createElement("span");
        span.textContent = t;
        modalTechCloud.appendChild(span);
    });

    projectModal.classList.add("open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove("open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

if (projectInspectTriggerBtn) {
    projectInspectTriggerBtn.addEventListener("click", () => {
        openProjectModal(projectsData[currentProject]);
    });
}

if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProjectModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeProjectModal);


/* ==========================================================================
   COMMAND PALETTE (CTRL+K / ⌘K)
   ========================================================================== */

const cmdPalette = document.getElementById("cmdPalette");
const cmdTriggerBtn = document.getElementById("cmdTriggerBtn");
const heroCmdBtn = document.getElementById("heroCmdBtn");
const cmdBackdrop = document.getElementById("cmdBackdrop");
const cmdInput = document.getElementById("cmdInput");
const cmdResults = document.getElementById("cmdResults");

const commandList = [
    { title: "DefNet Network Scanner & Asset Platform", cat: "Project", icon: "🛡️", action: () => { changeProject(0); openProjectModal(projectsData[0]); } },
    { title: "AI Photography Pose Assistant (MediaPipe)", cat: "Project", icon: "📸", action: () => { changeProject(1); openProjectModal(projectsData[1]); } },
    { title: "Bookmark Web App (React.js)", cat: "Project", icon: "🔖", action: () => { changeProject(2); openProjectModal(projectsData[2]); } },
    { title: "Mythic Gesture Engine (CV + GPU VFX)", cat: "Project", icon: "🪄", action: () => { changeProject(3); openProjectModal(projectsData[3]); } },
    { title: "Tata | Forage GenAI Job Simulation Certificate", cat: "Certificate", icon: "📜", action: () => { scrollToSection("certificates"); openCertModal(); } },
    { title: "Go to Selected Work (4 Projects)", cat: "Navigate", icon: "💼", action: () => scrollToSection("work") },
    { title: "Go to Experience & Leadership", cat: "Navigate", icon: "🏛️", action: () => scrollToSection("experience") },
    { title: "Go to Technical Skills Matrix", cat: "Navigate", icon: "⚡", action: () => scrollToSection("skills") },
    { title: "Go to Education (JEC Jabalpur)", cat: "Navigate", icon: "🎓", action: () => scrollToSection("education") },
    { title: "Go to Verified Certificate (Tata | Forage)", cat: "Navigate", icon: "📜", action: () => scrollToSection("certificates") },
    { title: "Go to About & Bio", cat: "Navigate", icon: "👤", action: () => scrollToSection("about") },
    { title: "Go to Contact", cat: "Navigate", icon: "✉️", action: () => scrollToSection("contact") },
    { title: "Copy Email (0201cs231108@gmail.com)", cat: "Action", icon: "📋", action: () => copyEmailToClipboard() },
    { title: "Toggle Theme (Cycle Themes)",           cat: "Action", icon: "🎨", action: () => { themeToggleBtn.click(); } },
    { title: "Theme: Aurora Violet (Light)",          cat: "Theme",  icon: "🔮", action: () => applyTheme("aurora") },
    { title: "Theme: Eclipse Dark",                   cat: "Theme",  icon: "🌑", action: () => applyTheme("eclipse") },
    { title: "Theme: Future Tech (Cyberpunk)",        cat: "Theme",  icon: "⚡", action: () => applyTheme("future") },
    { title: "Theme: Classic Editorial (Warm Sepia)", cat: "Theme",  icon: "📜", action: () => applyTheme("classic") },
    { title: "Theme: Retro Terminal (CRT Green)",     cat: "Theme",  icon: "💻", action: () => applyTheme("retro") },
    { title: "Toggle Sound Effects", cat: "Action", icon: "🔊", action: () => audioToggleBtn?.click() },
    { title: "Open GitHub Profile (upasana15-k)", cat: "External", icon: "↗", action: () => window.open("https://github.com/upasana15-k", "_blank") },
    { title: "Open LinkedIn Profile", cat: "External", icon: "↗", action: () => window.open("https://linkedin.com", "_blank") }
];

let selectedCmdIndex = 0;

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: "smooth" });
    }
}

function renderCommandResults(filter = "") {
    if (!cmdResults) return;
    const query = filter.toLowerCase().trim();
    const filtered = commandList.filter((cmd) => cmd.title.toLowerCase().includes(query) || cmd.cat.toLowerCase().includes(query));

    cmdResults.innerHTML = "";
    if (filtered.length === 0) {
        cmdResults.innerHTML = `<div class="cmd-item" style="color: var(--text-muted); pointer-events: none;">No matching commands found.</div>`;
        return;
    }

    selectedCmdIndex = 0;
    filtered.forEach((cmd, idx) => {
        const item = document.createElement("div");
        item.className = `cmd-item ${idx === selectedCmdIndex ? "selected" : ""}`;
        item.innerHTML = `
            <div class="cmd-item-left">
                <span class="cmd-item-icon">${cmd.icon}</span>
                <span>${cmd.title}</span>
            </div>
            <span class="cmd-item-cat">${cmd.cat}</span>
        `;
        item.addEventListener("click", () => {
            closeCmdPalette();
            cmd.action();
        });
        cmdResults.appendChild(item);
    });
}

function openCmdPalette() {
    if (!cmdPalette) return;
    playHapticSound("toggle");
    cmdPalette.classList.add("open");
    cmdPalette.setAttribute("aria-hidden", "false");
    cmdInput.value = "";
    renderCommandResults();
    setTimeout(() => cmdInput.focus(), 50);
}

function closeCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove("open");
    cmdPalette.setAttribute("aria-hidden", "true");
}

if (cmdTriggerBtn) cmdTriggerBtn.addEventListener("click", openCmdPalette);
if (heroCmdBtn) heroCmdBtn.addEventListener("click", openCmdPalette);
if (cmdBackdrop) cmdBackdrop.addEventListener("click", closeCmdPalette);

if (cmdInput) {
    cmdInput.addEventListener("input", (e) => {
        renderCommandResults(e.target.value);
    });

    cmdInput.addEventListener("keydown", (e) => {
        const items = cmdResults.querySelectorAll(".cmd-item:not([style*='pointer-events'])");
        if (items.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedCmdIndex = (selectedCmdIndex + 1) % items.length;
            updateCmdSelection(items);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedCmdIndex = (selectedCmdIndex - 1 + items.length) % items.length;
            updateCmdSelection(items);
        } else if (e.key === "Enter") {
            e.preventDefault();
            items[selectedCmdIndex]?.click();
        }
    });
}

function updateCmdSelection(items) {
    items.forEach((item, idx) => {
        item.classList.toggle("selected", idx === selectedCmdIndex);
    });
}


/* ==========================================================================
   GLOBAL KEYBOARD SHORTCUTS
   ========================================================================== */

document.addEventListener("keydown", (e) => {
    // Cmd + K or Ctrl + K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (cmdPalette.classList.contains("open")) {
            closeCmdPalette();
        } else {
            openCmdPalette();
        }
        return;
    }

    if (e.key === "Escape") {
        closeCmdPalette();
        closeProjectModal();
        closeCertModal();
        closeMobileMenu();
        closeThemePicker();
        return;
    }

    const activeTag = document.activeElement ? document.activeElement.tagName : "";
    if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;

    if (e.key === "ArrowRight") {
        changeProject((currentProject + 1) % projectsData.length);
    } else if (e.key === "ArrowLeft") {
        changeProject((currentProject - 1 + projectsData.length) % projectsData.length);
    }
});


/* ==========================================================================
   INTERACTIVE SKILLS MATRIX SEARCH & FILTER CHIPS
   ========================================================================== */

const skillsSearchInput = document.getElementById("skillsSearchInput");
const filterChips = document.querySelectorAll(".filter-chip");
const skillBoxes = document.querySelectorAll(".skill-category-box");
const allSkillTags = document.querySelectorAll(".skill-tag");

// Category Filter Click
filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        playHapticSound("click");
        filterChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");

        const filter = chip.getAttribute("data-filter");
        skillBoxes.forEach((box) => {
            const cat = box.getAttribute("data-category");
            if (filter === "all" || cat === filter) {
                box.classList.remove("hidden");
            } else {
                box.classList.add("hidden");
            }
        });
    });
});

// Live Search Input for Skills
if (skillsSearchInput) {
    skillsSearchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        allSkillTags.forEach((tag) => {
            const skillName = (tag.getAttribute("data-skill") || tag.textContent).toLowerCase();
            if (query === "" || skillName.includes(query)) {
                tag.classList.remove("dimmed");
            } else {
                tag.classList.add("dimmed");
            }
        });
    });
}


/* ==========================================================================
   MOBILE MENU DRAWER
   ========================================================================== */

const menuToggle = document.getElementById("menuToggle");
const mobileDrawer = document.getElementById("mobileDrawer");
const drawerClose = document.getElementById("drawerClose");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

function openMobileMenu() {
    if (!mobileDrawer) return;
    playHapticSound("click");
    mobileDrawer.classList.add("open");
    mobileDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove("open");
    mobileDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

if (menuToggle) menuToggle.addEventListener("click", openMobileMenu);
if (drawerClose) drawerClose.addEventListener("click", closeMobileMenu);
mobileNavLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));


/* ==========================================================================
   COPY EMAIL TO CLIPBOARD WITH TOAST
   ========================================================================== */

const copyEmailBtn = document.getElementById("copyEmailBtn");
const copyEmailText = document.getElementById("copyEmailText");
const toastNotification = document.getElementById("toastNotification");
const emailAddress = "0201cs231108@gmail.com";

function showToast(message) {
    if (!toastNotification) return;
    playHapticSound("success");
    toastNotification.textContent = message;
    toastNotification.classList.add("show");

    setTimeout(() => {
        toastNotification.classList.remove("show");
    }, 3200);
}

async function copyEmailToClipboard() {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(emailAddress);
        } else {
            const textarea = document.createElement("textarea");
            textarea.value = emailAddress;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }

        if (copyEmailText) {
            copyEmailText.textContent = "Copied! ✓";
            setTimeout(() => {
                copyEmailText.textContent = "Copy Email 📋";
            }, 2500);
        }

        showToast(`Copied ${emailAddress} to clipboard!`);
    } catch (err) {
        showToast(`Email: ${emailAddress}`);
    }
}

if (copyEmailBtn) copyEmailBtn.addEventListener("click", copyEmailToClipboard);


/* ==========================================================================
   SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */

const revealSections = document.querySelectorAll(".reveal-section");

const sectionRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
        }
    });
}, { threshold: 0.12 });

revealSections.forEach((sec) => sectionRevealObserver.observe(sec));


/* ==========================================================================
   CERTIFICATE INSPECTION MODAL ENGINE (TATA | FORAGE)
   ========================================================================== */

const certModal = document.getElementById("certModal");
const certModalCloseBtn = document.getElementById("certModalCloseBtn");
const certModalBackdrop = document.getElementById("certModalBackdrop");
const certModalVerifyBtn = document.getElementById("certModalVerifyBtn");
const certInspectBtn = document.getElementById("certInspectBtn");
const certPreviewClick = document.getElementById("certPreviewClick");

function openCertModal() {
    if (!certModal) return;
    playHapticSound("toggle");

    certModal.classList.add("open");
    certModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove("open");
    certModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

if (certModalCloseBtn) certModalCloseBtn.addEventListener("click", closeCertModal);
if (certModalBackdrop) certModalBackdrop.addEventListener("click", closeCertModal);
if (certInspectBtn) certInspectBtn.addEventListener("click", openCertModal);
if (certPreviewClick) certPreviewClick.addEventListener("click", openCertModal);


/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

function initApp() {
    currentProject = 0;
    updateActiveCard();
    updateProjectInformation(currentProject);

    requestAnimationFrame(() => {
        moveProjectTrack();
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}