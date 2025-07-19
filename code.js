document.addEventListener('DOMContentLoaded', () => {
    // Click Sound Logic
    const clickSound = document.getElementById('click-sound');
    const playClickSound = () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(error => { /* Autoplay was prevented */ });
        }
    };

    const clickableSelectors = 'button, a.cta-button, a.sidebar-link, a.main-link, a.page-link, .tool-card, .theme-switcher .switch, .modal .close-btn, .footer-socials a, .sidebar-toggle, .mobile-menu-toggle, .logo, .drop-zone';
    
    // Add click sound to existing elements
    document.querySelectorAll(clickableSelectors).forEach(element => {
        element.addEventListener('click', playClickSound);
    });

    // Use MutationObserver to add sound to dynamically created elements (like in the modal)
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        // Check if the node itself is clickable
                        if (node.matches(clickableSelectors)) {
                            node.addEventListener('click', playClickSound);
                        }
                        // Check for clickable children
                        node.querySelectorAll(clickableSelectors).forEach(element => {
                            element.addEventListener('click', playClickSound);
                        });
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // --- Original Script Logic Starts Here ---

    // Note: To make the multiple native ads work correctly...
    let nativeAdCounter = 1;
    document.querySelectorAll('[id^="container-fd31bbebc1a0969f799516a51fddc752_"]').forEach(el => {
        nativeAdCounter++;
        console.log(`Found a duplicate native ad container. It might not be populated by the script.`);
    });
    
    const body = document.body;

    const createConfetti = () => {
        const confettiWrapper = document.getElementById('confetti-wrapper');
        if (!confettiWrapper) return;
        const confettiCount = 150;
        const colors = ['#F48AAE', '#8B61F8', '#5AE3D3', '#3B7DF8', '#FFFFFF'];
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            const duration = Math.random() * 3 + 4;
            confetti.style.animationDuration = `${duration}s`;
            const delay = Math.random() * 2;
            confetti.style.animationDelay = `${delay}s`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confettiWrapper.appendChild(confetti);
        }
        setTimeout(() => { if(confettiWrapper) { confettiWrapper.innerHTML = ''; } }, 8000); 
    };
    createConfetti();

    const starfieldCanvas = document.getElementById('starfield-canvas');
    const starfieldCtx = starfieldCanvas.getContext('2d');
    const nebulaCanvas = document.getElementById('nebula-canvas');
    const nebulaCtx = nebulaCanvas.getContext('2d');
    let stars = [], comets = [], animationFrameId;
    const mouse = { x: undefined, y: undefined };

    function setupCanvases() {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        [starfieldCanvas, nebulaCanvas].forEach(canvas => {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            canvas.getContext('2d').scale(dpr, dpr);
        });
    }

    function drawNebula() {
        nebulaCtx.clearRect(0, 0, nebulaCanvas.width, nebulaCanvas.height);
        const nebulaColors = [{ r: 106, g: 61, b: 248 }, { r: 244, g: 138, b: 174 }, { r: 20, g: 30, b: 80 }];
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const radius = Math.random() * (window.innerWidth / 4) + (window.innerWidth / 10);
            const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            const gradient = nebulaCtx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`);
            gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            nebulaCtx.fillStyle = gradient;
            nebulaCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        }
    }

    function createStars() {
        stars = [];
        const starCount = Math.floor((window.innerWidth * window.innerHeight) / 2500);
        const starColors = ['#FFFFFF', '#FFDDC1', '#A9C2FF', '#FFFAE1'];
        for (let i = 0; i < starCount; i++) {
            const layer = Math.ceil(Math.random() * 3);
            const originalRadius = (Math.random() * 0.8 + 0.5) * layer;
            stars.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, radius: originalRadius, originalRadius, color: starColors[Math.floor(Math.random() * starColors.length)], velocity: 0.3 * layer, pulseDirection: Math.random() > 0.5 ? 1 : -1, pulseSpeed: Math.random() * 0.015 });
        }
    }

    function createComets() {
        comets = [];
        for (let i = 0; i < 15; i++) {
             comets.push({ x: Math.random() * window.innerWidth, y: Math.random() * -window.innerHeight, length: Math.random() * 300 + 150, radius: Math.random() * 2 + 1, velocity: { x: (Math.random() - 0.5) * 10, y: Math.random() * 10 + 10 } });
        }
    }

    function drawAnimatedElements() {
        starfieldCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const theme = body.getAttribute('data-theme') || 'dark';
        const lightThemeMultiplier = theme === 'light' ? 0.4 : 1;
        stars.forEach(star => {
            starfieldCtx.beginPath();
            starfieldCtx.fillStyle = star.color;
            starfieldCtx.globalAlpha = lightThemeMultiplier * (star.radius / star.originalRadius * 0.8 + 0.2);
            starfieldCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            starfieldCtx.fill();
        });
        starfieldCtx.globalAlpha = 1;
        comets.forEach(comet => {
            const gradient = starfieldCtx.createLinearGradient(comet.x, comet.y, comet.x - comet.velocity.x * (comet.length/15), comet.y - comet.velocity.y * (comet.length/15));
            const cometHeadColor = theme === 'light' ? `rgba(59, 125, 248, ${0.8 * lightThemeMultiplier})` : `rgba(200, 220, 255, 0.9)`;
            gradient.addColorStop(0, cometHeadColor);
            gradient.addColorStop(1, "transparent");
            starfieldCtx.beginPath();
            starfieldCtx.moveTo(comet.x, comet.y);
            starfieldCtx.lineTo(comet.x - comet.velocity.x * (comet.length/15), comet.y - comet.velocity.y * (comet.length/15));
            starfieldCtx.strokeStyle = gradient;
            starfieldCtx.lineWidth = comet.radius;
            starfieldCtx.stroke();
        });
        if (mouse.x !== undefined && mouse.y !== undefined) {
             for (let i = 0; i < stars.length; i++) {
                const dx = stars[i].x - mouse.x;
                const dy = stars[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    starfieldCtx.beginPath();
                    starfieldCtx.moveTo(mouse.x, mouse.y);
                    starfieldCtx.lineTo(stars[i].x, stars[i].y);
                    const opacity = 1 - (distance / 150);
                    const lineColor = theme === 'light' ? `rgba(0, 0, 0, ${opacity * 0.3})` : `rgba(255, 255, 255, ${opacity * 0.3})`;
                    starfieldCtx.strokeStyle = lineColor;
                    starfieldCtx.lineWidth = 0.5;
                    starfieldCtx.stroke();
                }
             }
        }
    }

    function update() {
        stars.forEach(star => {
            star.y += star.velocity;
            if (star.y > window.innerHeight + star.radius) {
                star.y = -star.radius;
                star.x = Math.random() * window.innerWidth;
            }
            star.radius += star.pulseSpeed * star.pulseDirection;
            if (star.radius > star.originalRadius * 1.5 || star.radius < star.originalRadius * 0.5) {
                star.pulseDirection *= -1;
            }
        });
        comets.forEach(comet => {
            comet.x += comet.velocity.x;
            comet.y += comet.velocity.y;
            if (comet.y > window.innerHeight + 50 || comet.x < -50 || comet.x > window.innerWidth + 50) {
                comet.x = Math.random() * window.innerWidth;
                comet.y = Math.random() * -window.innerHeight / 2;
            }
        });
    }

    function animate() {
        drawAnimatedElements();
        update();
        animationFrameId = requestAnimationFrame(animate);
    }

    function initAnimation() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        setupCanvases();
        drawNebula();
        createStars();
        createComets();
        animate();
    }
    
    window.addEventListener('resize', initAnimation);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = undefined; mouse.y = undefined; });
    initAnimation();
    
    // --- UI and Tool Logic Starts Here ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') themeToggle.checked = true;
    } else { body.setAttribute('data-theme', 'dark'); }
    themeToggle.addEventListener('change', () => {
        let theme = themeToggle.checked ? 'light' : 'dark';
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle-btn');
    sidebarToggleBtn.addEventListener('click', () => body.classList.toggle('sidebar-collapsed'));
    mobileMenuToggleBtn.addEventListener('click', (e) => { e.stopPropagation(); body.classList.toggle('sidebar-open') });
    
    const mainContent = document.getElementById('main-content-wrapper');
    const policyContent = document.getElementById('policy-content-wrapper');
    const mainLinks = document.querySelectorAll('.main-link');
    const pageLinks = document.querySelectorAll('.page-link');
    const navLinks = document.querySelectorAll('#main-nav a');
    const showMainContent = () => { mainContent.style.display = 'block'; policyContent.style.display = 'none'; };
    const showPolicyPage = (targetId) => { mainContent.style.display = 'none'; policyContent.style.display = 'block'; document.querySelectorAll('.page-content').forEach(p => p.style.display = 'none'); const target = document.querySelector(targetId); if (target) target.style.display = 'block'; window.scrollTo(0, 0); };
    mainLinks.forEach(link => link.addEventListener('click', e => { e.preventDefault(); showMainContent(); const targetId = link.getAttribute('href'); const targetEl = document.querySelector(targetId); if(targetEl) targetEl.scrollIntoView({ behavior: 'smooth' }); navLinks.forEach(n => n.classList.remove('active-link')); const activeNav = document.querySelector(`#main-nav a[href="${targetId}"]`); if(activeNav) activeNav.classList.add('active-link'); if (body.classList.contains('sidebar-open')) body.classList.remove('sidebar-open'); }));
    pageLinks.forEach(link => link.addEventListener('click', e => { e.preventDefault(); const targetId = link.getAttribute('href'); showPolicyPage(targetId); navLinks.forEach(n => n.classList.remove('active-link')); }));
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const toolCards = document.querySelectorAll('.tool-card');
    const adGridItems = document.querySelectorAll('.ad-grid-item');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showMainContent();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            
            let visibleTools = 0;
            toolCards.forEach(card => {
                const cardCats = card.dataset.category.split(' ');
                const isVisible = (category === 'all' || cardCats.includes(category));
                card.style.display = isVisible ? 'flex' : 'none';
                if (isVisible) {
                    visibleTools++;
                }
            });

            adGridItems.forEach(ad => {
                 ad.style.display = 'block';
            });
            
            const toolsSection = document.querySelector('#tools');
            if (toolsSection) toolsSection.scrollIntoView({ behavior: 'smooth' });
            if (window.innerWidth <= 768 && body.classList.contains('sidebar-open')) body.classList.remove('sidebar-open');
        });
    });

    const toolModal = document.getElementById('tool-modal');
    const toolModalTitle = document.getElementById('tool-modal-title');
    const toolInterfaceContent = document.getElementById('tool-interface-content');
    const closeModal = (modal) => { modal.style.display = 'none'; toolInterfaceContent.innerHTML = ''; };
    document.querySelector('.modal .close-btn').addEventListener('click', (e) => closeModal(e.target.closest('.modal')));
    window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) closeModal(e.target); });
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', () => {
            const toolId = card.dataset.tool;
            toolModalTitle.innerText = card.querySelector('h3').innerText;
            setupToolInterface(toolId);
            toolModal.style.display = 'flex';
        });
    });
    
    const setupToolInterface = (toolId) => {
        let html = '';
        const fileToolUI = (isMultiple = false, accept = "*") => `<div class="drop-zone" id="drop-zone"><p class="drop-zone-text">File(s) yahan drag aur drop karein, ya select karne ke liye click karein</p><div id="file-list"></div><input type="file" id="file-input" ${isMultiple ? 'multiple' : ''} accept="${accept}" hidden></div><div id="tool-specific-controls"></div><div class="processing-status" id="processing-status" style="display:none;"></div><button id="process-btn" class="cta-button" style="width:100%; display:none; border-radius:8px;">Process Karein</button><div id="tool-results" class="tool-results"></div>`;
        const textToTextUI = (inPlaceholder, outPlaceholder, btnText) => `<textarea id="text-input" class="tool-textarea" placeholder="${inPlaceholder}"></textarea><div id="tool-specific-controls"></div><button id="process-btn" class="cta-button" style="width:100%; border-radius:8px;">${btnText}</button><textarea id="tool-output" class="tool-textarea" placeholder="${outPlaceholder}" readonly style="margin-top:1rem;"></textarea>`;

        switch (toolId) {
            case 'merge-pdf': html = fileToolUI(true, ".pdf"); break;
            case 'split-pdf': html = fileToolUI(false, ".pdf"); break;
            case 'word-to-pdf': html = fileToolUI(false, ".docx, .doc"); break;
            case 'excel-to-pdf': html = fileToolUI(false, ".xlsx, .xls"); break;
            case 'pdf-to-jpg': html = fileToolUI(false, ".pdf"); break;
            case 'jpg-to-pdf': html = fileToolUI(true, "image/jpeg, image/png"); break;
            case 'compress-image': html = fileToolUI(false, "image/jpeg, image/png"); break;
            case 'text-to-speech': html = `<textarea id="tts-input" class="tool-textarea" placeholder="Yahan text enter karein..."></textarea><button id="tts-speak-btn" class="cta-button" style="width:100%; border-radius:8px;">Bolein</button>`; break;
            case 'speech-to-text': html = `<textarea id="stt-output" class="tool-textarea" placeholder="Bolna shuru karne ke liye button dabayein..."></textarea><button id="stt-btn" class="cta-button speech-btn" style="width:100%; border-radius:8px;">Record Karein</button>`; break;
            case 'qr-generator': html = `<textarea id="qr-input" class="tool-textarea" placeholder="URL ya text enter karein..."></textarea><button id="qr-generate-btn" class="cta-button" style="width:100%; border-radius:8px;">QR Code Banayein</button><div class="tool-output" id="tool-output" style="text-align:center; padding: 1rem; display:none;"><canvas id="qr-code-canvas"></canvas><br><a id="qr-download-link" class="download-button" style="display:none; margin-top:1rem; width:auto;">Download QR</a></div>`; break;
            case 'password-generator': html = `<div class="tool-controls"><label for="pw-length">Length: <span id="pw-length-val">12</span></label><input type="range" id="pw-length" min="8" max="32" value="12"></div><div class="tool-controls"><input type="checkbox" id="pw-nums" checked> <label for="pw-nums">Numbers (0-9)</label></div><div class="tool-controls"><input type="checkbox" id="pw-syms" checked> <label for="pw-syms">Symbols (!@#)</label></div><div id="tool-output" class="tool-output" style="text-align:center; font-weight:bold; font-size: 1.2rem; letter-spacing: 1px; user-select: all; cursor: copy;"></div><button id="pw-generate-btn" class="cta-button" style="width:100%; border-radius:8px;">Generate New</button>`; break;
            case 'word-counter': html = `<textarea id="wc-input" class="tool-textarea" placeholder="Ginti ke liye yahan text paste karein..."></textarea><div id="tool-output" class="tool-output">Words: 0 | Characters: 0 | Sentences: 0 | Paragraphs: 0</div>`; break;
            case 'age-calculator': html = `<div class="tool-controls" style="justify-content: center;"><label for="dob-input">Apni Janam Tithi Chunein:</label><input type="date" id="dob-input"></div><button id="age-calc-btn" class="cta-button" style="width:100%; border-radius:8px;">Calculate Karein</button><div id="tool-output" class="tool-output" style="text-align:center; font-size: 1.2rem; display:none;"></div>`; break;
            case 'bmi-calculator': html = `<div class="tool-controls"><label for="bmi-height">Height (cm):</label><input type="number" id="bmi-height" placeholder="170" style="flex:1"></div><div class="tool-controls"><label for="bmi-weight">Weight (kg):</label><input type="number" id="bmi-weight" placeholder="65" style="flex:1"></div><button id="bmi-calc-btn" class="cta-button" style="width:100%; border-radius:8px;">Calculate Karein</button><div id="tool-output" class="tool-output" style="text-align:center; font-size: 1.2rem; display:none;"></div>`; break;
            case 'color-picker': html = `<p style="text-align:center;">Rang chunne ke liye color wheel par click karein.</p><div style="display:flex; justify-content:center; align-items:center; gap: 1rem; margin-top:1rem;"><input type="color" id="color-input" value="#f58cbf" style="width: 80px; height: 80px; border:none; background:none; cursor:pointer;"><div id="tool-output" class="tool-output" style="flex-grow:1; text-align:center; font-weight: bold;">#f58cbf</div></div>`; break;
            case 'gpa-calculator': html = `<div id="gpa-courses"></div><button id="add-course-btn" class="cta-button" style="border-radius:8px;font-size:0.9rem;padding:0.8rem 1.2rem;width:auto;">Add Course</button><button id="gpa-calc-btn" class="cta-button" style="width:100%;border-radius:8px;margin-top:1rem;">Calculate GPA</button><div id="tool-output" class="tool-output" style="text-align:center;font-size:1.5rem;font-weight:bold;display:none;"></div>`; break;
            case 'citation-generator': html = `<div class="tool-controls" style="flex-direction:column; align-items:stretch; gap:1rem;"><div class="tool-controls"><label>Style:</label><select id="cite-style"><option>APA</option><option>MLA</option></select></div><div class="tool-controls"><label>Source:</label><select id="cite-source"><option>Website</option><option>Book</option></select></div><div id="cite-fields"></div></div><button id="process-btn" class="cta-button" style="width:100%;border-radius:8px;margin-top:1rem;">Generate Citation</button><div id="tool-output" class="tool-output" style="display:none; text-align:left; user-select:all; cursor:copy;"></div>`; break;
            case 'text-summarizer': html = textToTextUI("Lamba text yahan paste karein...", "Summary yahan dikhegi...", "Summarize Karein"); break;
            case 'study-timer': html = `<div id="timer-display" style="font-size:5rem; text-align:center; font-weight:bold;">25:00</div><div class="tool-controls" style="justify-content:center;"><button id="start-pause-btn" class="cta-button" style="border-radius:8px;">Start</button><button id="reset-btn" class="cta-button" style="border-radius:8px;">Reset</button></div><div id="session-count" style="text-align:center; margin-top:1rem; color:var(--subtext-color);">Sessions: 0</div>`; break;
            case 'ocr-tool': html = fileToolUI(false, "image/*"); break;
            case 'compress-pdf': html = fileToolUI(false, ".pdf"); break;
            case 'convert-image': html = fileToolUI(false, "image/*"); break;
            case 'case-converter': html = `<textarea id="text-input" class="tool-textarea" placeholder="Apna text yahan paste karein..."></textarea><div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:1rem;"><button class="cta-button" data-case="upper" style="flex-grow:1; border-radius:8px; font-size:0.9rem; padding:0.8rem;">UPPERCASE</button><button class="cta-button" data-case="lower" style="flex-grow:1; border-radius:8px; font-size:0.9rem; padding:0.8rem;">lowercase</button><button class="cta-button" data-case="title" style="flex-grow:1; border-radius:8px; font-size:0.9rem; padding:0.8rem;">Title Case</button><button class="cta-button" data-case="sentence" style="flex-grow:1; border-radius:8px; font-size:0.9rem; padding:0.8rem;">Sentence case</button></div><textarea id="tool-output" class="tool-textarea" readonly style="margin-top:1rem;"></textarea>`; break;
            case 'hash-generator': html = textToTextUI("Hash karne ke liye text enter karein...", "Hashes yahan dikhenge...", "Generate Hashes"); break;
            case 'json-formatter': html = textToTextUI("Apna JSON yahan paste karein...", "Formatted JSON yahan dikhega...", "Format JSON"); break;
            case 'base64-converter': html = `<textarea id="text-input" class="tool-textarea" placeholder="Text ya Base64 string enter karein..."></textarea><div style="display:flex; gap:10px; margin-top:1rem;"><button id="encode-btn" class="cta-button" style="flex-grow:1; border-radius:8px;">Encode</button><button id="decode-btn" class="cta-button" style="flex-grow:1; border-radius:8px;">Decode</button></div><textarea id="tool-output" class="tool-textarea" readonly style="margin-top:1rem;"></textarea>`; break;
            case 'pdf-watermark': html = fileToolUI(false, ".pdf"); break;
            case 'favicon-generator': html = fileToolUI(false, "image/png, image/jpeg"); break;
            case 'random-picker': html = `<textarea id="text-input" class="tool-textarea" placeholder="Har line mein ek item likhein..."></textarea><button id="process-btn" class="cta-button" style="width:100%; border-radius:8px;">Ek Item Chunein</button><div id="tool-output" class="tool-output" style="text-align:center; font-size: 1.5rem; font-weight: bold; display:none;"></div>`; break;
            case 'css-gradient': html = `<div id="gradient-preview" style="height: 150px; border-radius: 8px; border: 1px solid var(--card-border);"></div><div class="tool-controls" style="margin-top: 1rem; justify-content: space-around;"><label>Color 1: <input type="color" id="grad-color1" value="#F48AAE"></label><label>Color 2: <input type="color" id="grad-color2" value="#8B61F8"></label></div><div class="tool-controls" style="margin-top: 1rem;"><label>Angle:</label><input type="range" id="grad-angle" min="0" max="360" value="90"><span id="grad-angle-val">90°</span></div><textarea id="tool-output" class="tool-textarea" readonly style="margin-top:1rem;"></textarea>`; break;
            case 'emi-calculator': html = `<div class="tool-controls" style="flex-direction:column; align-items:stretch; gap: 1rem;"><div class="tool-controls"><label>Loan Amount (₹):</label><input type="number" id="emi-principal" placeholder="100000"></div><div class="tool-controls"><label>Interest Rate (%/year):</label><input type="number" id="emi-rate" placeholder="8.5"></div><div class="tool-controls"><label>Loan Term (years):</label><input type="number" id="emi-years" placeholder="5"></div></div><button id="process-btn" class="cta-button" style="width:100%; border-radius:8px; margin-top: 1rem;">Calculate EMI</button><div id="tool-output" class="tool-output" style="display:none; text-align: left;"></div>`; break;
            case 'unix-converter': html = `<div class="tool-controls" style="flex-direction:column; align-items:stretch; gap: 1rem;"><h4>Timestamp to Date</h4><input type="number" id="unix-ts-input" placeholder="Enter Unix Timestamp..."><button id="unix-now-btn" class="cta-button" style="border-radius:8px;font-size:0.8rem;padding:0.5rem 1rem;">Current Time</button><p id="unix-date-output" style="text-align:center;"></p><hr style="border-color:var(--card-border); width:100%;"><h4>Date to Timestamp</h4><input type="datetime-local" id="unix-date-input"><p id="unix-ts-output" style="text-align:center;"></p></div>`; break;
            default: html = `<p>Tool not found.</p>`; break;
        }
        toolInterfaceContent.innerHTML = html;
        addToolEventListeners(toolId);
    };

    const addToolEventListeners = (toolId) => {
        const outputDiv = document.getElementById('tool-output'); 
        const textInput = document.getElementById('text-input');
        const processBtn = document.getElementById('process-btn'); 
        const processingStatus = document.getElementById('processing-status'); 
        const resultsDiv = document.getElementById('tool-results'); 
        let selectedFiles = []; 
        const formatBytes = (bytes, decimals = 2) => { if (bytes === 0) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]; }; 
        
        if (document.getElementById('drop-zone')) { 
            const dropZone = document.getElementById('drop-zone'); 
            const fileInput = document.getElementById('file-input'); 
            const fileListDiv = document.getElementById('file-list'); 
            const resetState = () => { if(resultsDiv) { resultsDiv.style.display = 'none'; resultsDiv.innerHTML = ''; } if(processingStatus) processingStatus.style.display = 'none'; }; 
            const updateFileList = () => { fileListDiv.innerHTML = selectedFiles.map(f => `<p>${f.name} (${formatBytes(f.size)})</p>`).join(''); if(processBtn) processBtn.style.display = selectedFiles.length > 0 ? 'block' : 'none'; resetState(); }; 
            const handleFiles = (files) => { const newFiles = Array.from(files); if (fileInput.multiple) { selectedFiles.push(...newFiles); } else { selectedFiles = newFiles.slice(0, 1); } updateFileList(); }; 
            dropZone.addEventListener('click', () => fileInput.click()); 
            fileInput.addEventListener('change', (e) => handleFiles(e.target.files)); 
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => dropZone.addEventListener(eventName, (e) => {e.preventDefault(); e.stopPropagation();}, false)); 
            dropZone.addEventListener('dragenter', () => dropZone.classList.add('dragover')); 
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover')); 
            dropZone.addEventListener('drop', (e) => { dropZone.classList.remove('dragover'); handleFiles(e.dataTransfer.files); }); 
        } 
        
        const showStatus = (message) => { if(!processingStatus) return; processingStatus.style.display = 'block'; processingStatus.innerHTML = `<p class="status-item active">${message}</p>`; }; 
        const showDownloadLink = (blob, filename, container) => { container.style.display = 'block'; const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.className = 'download-button'; a.textContent = `Download ${filename}`; container.innerHTML = ''; container.appendChild(a); }; 
        const processWith = async (toolLogic) => { if (!processBtn) return; processBtn.addEventListener('click', async () => { if (selectedFiles.length === 0) { alert('Kripya file(s) chunein.'); return; } processBtn.disabled = true; processBtn.textContent = 'Processing...'; if(resultsDiv) { resultsDiv.style.display = 'none'; resultsDiv.innerHTML = ''; } try { await toolLogic(); } catch(err) { console.error("Tool Error:", err); showStatus(`Ek error aayi: ${err.message}`); } finally { processBtn.disabled = false; processBtn.textContent = 'Process Karein'; } }); }; 
        
        // All tool logic cases go here (switch(toolId)...)
        switch (toolId) { 
            case 'merge-pdf': processWith(async () => { if (selectedFiles.length < 2) { showStatus('Kripya merge karne ke liye kam se kam 2 PDF files chunein.'); return; } showStatus('PDFs load ho rahi hain...'); const { PDFDocument } = PDFLib; const mergedPdf = await PDFDocument.create(); for (const [index, file] of selectedFiles.entries()) { showStatus(`File ${index + 1}/${selectedFiles.length} process ho rahi hai...`); const arrayBuffer = await file.arrayBuffer(); const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true }); const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices()); copiedPages.forEach(page => mergedPdf.addPage(page)); } showStatus('Final PDF banayi ja rahi hai...'); const mergedPdfBytes = await mergedPdf.save(); showStatus('Ho gaya!'); showDownloadLink(new Blob([mergedPdfBytes], { type: 'application/pdf' }), 'merged.pdf', resultsDiv); }); break; 
            case 'split-pdf': processWith(async () => { showStatus('PDF load ho rahi hai...'); const { PDFDocument } = PDFLib; const arrayBuffer = await selectedFiles[0].arrayBuffer(); const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true }); const pageCount = pdfDoc.getPageCount(); if (pageCount < 2) { showStatus('Split karne ke liye PDF mein 1 se zyada page hone chahiye.'); return; } resultsDiv.style.display = "block"; resultsDiv.innerHTML = '<h4>Results:</h4><div class="results-grid"></div>'; const grid = resultsDiv.querySelector('.results-grid'); for (let i = 0; i < pageCount; i++) { showStatus(`Page ${i + 1}/${pageCount} split ho raha hai...`); const subDoc = await PDFDocument.create(); const [copiedPage] = await subDoc.copyPages(pdfDoc, [i]); subDoc.addPage(copiedPage); const pdfBytes = await subDoc.save(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })); a.download = `page_${i + 1}_of_${pageCount}.pdf`; a.className = 'download-button'; a.textContent = `Page ${i + 1}`; grid.appendChild(a); } showStatus(`Ho gaya! ${pageCount} pages split ho gaye.`); }); break; 
            case 'word-to-pdf': processWith(async () => { showStatus('Word file ko HTML mein convert kiya ja raha hai...'); const arrayBuffer = await selectedFiles[0].arrayBuffer(); const result = await mammoth.convertToHtml({ arrayBuffer }); showStatus('HTML se PDF banayi ja rahi hai...'); const element = document.createElement('div'); element.innerHTML = result.value; await html2pdf().from(element).set({ margin: 1, filename: `converted-${selectedFiles[0].name.replace(/\.docx?/, '')}.pdf`, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } }).save(); showStatus('Ho gaya! Download shuru ho jayega.'); }); break; 
            case 'excel-to-pdf': processWith(async () => { showStatus('Excel file padhi ja rahi hai...'); const data = await selectedFiles[0].arrayBuffer(); const workbook = XLSX.read(data); const sheetName = workbook.SheetNames[0]; const worksheet = workbook.Sheets[sheetName]; showStatus('HTML table banayi ja rahi hai...'); const html = XLSX.utils.sheet_to_html(worksheet); const element = document.createElement('div'); element.innerHTML = `<style>body{font-family:sans-serif;}table{border-collapse:collapse;width:100%;}td,th{border:1px solid #999;padding:8px;text-align:left;}</style>${html}`; showStatus('HTML se PDF banayi ja rahi hai...'); await html2pdf().from(element).set({ margin: 0.5, filename: `converted-${selectedFiles[0].name.replace(/\.xlsx?/, '')}.pdf`, jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' } }).save(); showStatus('Ho gaya! Download shuru ho jayega.'); }); break; 
            case 'pdf-to-jpg': document.getElementById('tool-specific-controls').innerHTML = `<div class="tool-controls" style="justify-content:center;"><label>Format Chunein:</label><select id="img-format"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></div>`; processWith(async () => { showStatus('PDF load ho rahi hai...'); resultsDiv.style.display = "block"; resultsDiv.innerHTML = '<h4>Results:</h4><div class="results-grid"></div>'; const grid = resultsDiv.querySelector('.results-grid'); const arrayBuffer = await selectedFiles[0].arrayBuffer(); const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise; const format = document.getElementById('img-format').value; const ext = format.split('/')[1]; for (let i = 1; i <= pdf.numPages; i++) { showStatus(`Page ${i}/${pdf.numPages} convert ho raha hai...`); const page = await pdf.getPage(i); const viewport = page.getViewport({ scale: 2.0 }); const canvas = document.createElement('canvas'); const context = canvas.getContext('2d'); canvas.height = viewport.height; canvas.width = viewport.width; await page.render({ canvasContext: context, viewport: viewport }).promise; const a = document.createElement('a'); a.href = canvas.toDataURL(format, 0.9); a.download = `page_${i}.${ext}`; a.className = 'download-button'; a.textContent = `Page ${i}`; grid.appendChild(a); } showStatus(`Ho gaya! ${pdf.numPages} pages convert ho gaye.`); }); break; 
            case 'jpg-to-pdf': processWith(async () => { showStatus('Images load ho rahi hain...'); const { PDFDocument } = PDFLib; const pdfDoc = await PDFDocument.create(); for (const [index, file] of selectedFiles.entries()) { showStatus(`Image ${index + 1}/${selectedFiles.length} process ho rahi hai...`); const arrayBuffer = await file.arrayBuffer(); let image; if (file.type === 'image/png') { image = await pdfDoc.embedPng(arrayBuffer); } else { image = await pdfDoc.embedJpg(arrayBuffer); } const page = pdfDoc.addPage([image.width, image.height]); page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height }); } showStatus('Final PDF banayi ja rahi hai...'); const pdfBytes = await pdfDoc.save(); showStatus('Ho gaya!'); showDownloadLink(new Blob([pdfBytes], { type: 'application/pdf' }), 'converted-images.pdf', resultsDiv); }); break; 
            case 'compress-image': const controls = document.getElementById('tool-specific-controls'); controls.innerHTML = `<div class="tool-controls"><label for="quality-range">Quality: <span id="quality-val">0.8</span></label><input type="range" id="quality-range" min="0.1" max="1" step="0.05" value="0.8"></div>`; document.getElementById('quality-range').addEventListener('input', (e) => { document.getElementById('quality-val').textContent = e.target.value; }); processWith(() => new Promise((resolve, reject) => { showStatus('Image compress ho rahi hai...'); const file = selectedFiles[0]; const originalSize = file.size; const quality = parseFloat(document.getElementById('quality-range').value); const reader = new FileReader(); reader.onload = (e) => { const img = new Image(); img.onload = () => { const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height; canvas.getContext('2d').drawImage(img, 0, 0); canvas.toBlob((blob) => { if (!blob) { return reject(new Error("Canvas to Blob conversion failed.")); } const newSize = blob.size; const reduction = Math.max(0, (((originalSize - newSize) / originalSize) * 100)).toFixed(1); showStatus(`Ho gaya! Size ${reduction}% kam hua.`); showDownloadLink(blob, `compressed-${file.name}`, resultsDiv); resolve(); }, 'image/jpeg', quality); }; img.onerror = () => reject(new Error("Image load error.")); img.src = e.target.result; }; reader.onerror = () => reject(new Error("File read error.")); reader.readAsDataURL(file); })); break; 
            case 'word-counter': document.getElementById('wc-input').addEventListener('input', (e) => { const text = e.target.value; const words = text.match(/\b\w+\b/g)?.length || 0; const chars = text.length; const sentences = text.match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g)?.length || 0; const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim().length > 0 ? 1 : 0); outputDiv.textContent = `Words: ${words} | Characters: ${chars} | Sentences: ${sentences} | Paragraphs: ${paragraphs}`; }); break; 
            case 'age-calculator': document.getElementById('age-calc-btn').addEventListener('click', () => { const dobString = document.getElementById('dob-input').value; if (!dobString) { alert('Kripya janam tithi chunein.'); return; } const dob = new Date(dobString); const today = new Date(); if(dob > today) { alert('Janam tithi bhavishya ki nahi ho sakti.'); return; } let ageYears = today.getFullYear() - dob.getFullYear(); let ageMonths = today.getMonth() - dob.getMonth(); let ageDays = today.getDate() - dob.getDate(); if (ageDays < 0) { ageMonths--; ageDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); } if (ageMonths < 0) { ageYears--; ageMonths += 12; } outputDiv.style.display = 'block'; outputDiv.textContent = `${ageYears} Saal, ${ageMonths} Mahine, ${ageDays} Din`; }); break; 
            case 'bmi-calculator': document.getElementById('bmi-calc-btn').addEventListener('click', () => { const height = parseFloat(document.getElementById('bmi-height').value); const weight = parseFloat(document.getElementById('bmi-weight').value); if (!height || !weight || height <= 0 || weight <= 0) { alert('Sahi height aur weight enter karein.'); return; } const bmi = weight / ((height / 100) ** 2); let category = ''; if (bmi < 18.5) category = 'Underweight'; else if (bmi < 25) category = 'Normal weight'; else if (bmi < 30) category = 'Overweight'; else category = 'Obesity'; outputDiv.style.display = 'block'; outputDiv.textContent = `Aapka BMI: ${bmi.toFixed(2)} (${category})`; }); break; 
            case 'speech-to-text': const sttBtn = document.getElementById('stt-btn'); const sttOutput = document.getElementById('stt-output'); const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; if (SpeechRecognition) { const recognition = new SpeechRecognition(); recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'hi-IN'; let isRecording = false; let finalTranscript = ''; recognition.onresult = (event) => { let interimTranscript = ''; for (let i = event.resultIndex; i < event.results.length; ++i) { if (event.results[i].isFinal) { finalTranscript += event.results[i][0].transcript; } else { interimTranscript += event.results[i][0].transcript; } } sttOutput.value = finalTranscript + interimTranscript; }; recognition.onend = () => { if (isRecording) { recognition.start(); } }; sttBtn.addEventListener('click', () => { isRecording = !isRecording; if (isRecording) { finalTranscript = sttOutput.value; recognition.start(); sttBtn.textContent = 'Recording... (Stop karne ke liye click karein)'; sttBtn.classList.add('recording'); } else { recognition.stop(); sttBtn.textContent = 'Record Karein'; sttBtn.classList.remove('recording'); } }); } else { sttBtn.disabled = true; sttBtn.textContent = 'Browser Supported Nahi Hai'; } break; 
            case 'text-to-speech': document.getElementById('tts-speak-btn').addEventListener('click', () => { const text = document.getElementById('tts-input').value; if (text.trim() === '') { alert('Kuch bolne ke liye text enter karein.'); return; } speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'hi-IN'; speechSynthesis.speak(utterance); }); break; 
            case 'qr-generator': document.getElementById('qr-generate-btn').addEventListener('click', () => { const data = document.getElementById('qr-input').value.trim(); if (data === '') { alert('QR code banane ke liye text ya URL enter karein.'); return; } const qrCanvas = document.getElementById('qr-code-canvas'); const downloadLink = document.getElementById('qr-download-link'); outputDiv.style.display = 'block'; downloadLink.style.display = 'inline-block'; const qr = new Image(); qr.crossOrigin = "anonymous"; qr.onload = () => { const ctx = qrCanvas.getContext('2d'); qrCanvas.width=150; qrCanvas.height=150; ctx.drawImage(qr, 0, 0, 150, 150); downloadLink.href = qrCanvas.toDataURL("image/png"); downloadLink.download = "qrcode.png"; }; qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`; }); break; 
            case 'password-generator': const range = document.getElementById('pw-length'), val = document.getElementById('pw-length-val'); const generate = () => { const len = parseInt(range.value); const useN = document.getElementById('pw-nums').checked, useS = document.getElementById('pw-syms').checked; const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' + (useN ? '0123456789' : '') + (useS ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : ''); if (chars.length < 52) { outputDiv.textContent = "Ek option chunein!"; return; } outputDiv.textContent = Array(len).fill(chars).map(x => x[Math.floor(Math.random() * x.length)]).join(''); }; range.addEventListener('input', () => { val.textContent = range.value; generate(); }); document.getElementById('pw-generate-btn').addEventListener('click', generate); document.querySelectorAll('#pw-nums, #pw-syms').forEach(el => el.addEventListener('change', generate)); outputDiv.addEventListener('click', () => { navigator.clipboard.writeText(outputDiv.textContent).then(() => { alert('Password clipboard mein copy ho gaya!'); }); }); generate(); break; 
            case 'color-picker': document.getElementById('color-input').addEventListener('input', (e) => outputDiv.textContent = e.target.value); break; 
            case 'gpa-calculator':
                const coursesDiv = document.getElementById('gpa-courses');
                const addCourseBtn = document.getElementById('add-course-btn');
                const gpaCalcBtn = document.getElementById('gpa-calc-btn');
                const gpaOutput = document.getElementById('tool-output');
                const addCourseRow = () => {
                    const row = document.createElement('div');
                    row.className = 'tool-controls';
                    row.style.gap = '5px';
                    row.innerHTML = `<input type="text" placeholder="Course Name" style="flex:3;"><input type="number" placeholder="Credits" style="flex:1;"><input type="number" placeholder="Grade (4.0 scale)" style="flex:1;" step="0.1"><button style="background:var(--glow-primary);color:white;border:none;border-radius:4px;padding:0.5rem;cursor:pointer;">&times;</button>`;
                    coursesDiv.appendChild(row);
                    row.querySelector('button').addEventListener('click', () => row.remove());
                };
                addCourseBtn.addEventListener('click', addCourseRow);
                gpaCalcBtn.addEventListener('click', () => {
                    let totalCredits = 0, totalPoints = 0;
                    coursesDiv.querySelectorAll('.tool-controls').forEach(row => {
                        const credits = parseFloat(row.children[1].value);
                        const grade = parseFloat(row.children[2].value);
                        if(credits > 0 && grade >= 0) {
                            totalCredits += credits;
                            totalPoints += credits * grade;
                        }
                    });
                    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
                    gpaOutput.style.display = 'block';
                    gpaOutput.textContent = `Aapka GPA: ${gpa}`;
                });
                addCourseRow(); addCourseRow(); addCourseRow();
                break;
            case 'citation-generator':
                const styleSelect = document.getElementById('cite-style');
                const sourceSelect = document.getElementById('cite-source');
                const fieldsDiv = document.getElementById('cite-fields');
                const renderFields = () => {
                    const source = sourceSelect.value;
                    fieldsDiv.innerHTML = (source === 'Website') ? `<input type="text" id="cite-author" placeholder="Author (e.g., Kumar, A.)"><input type="text" id="cite-year" placeholder="Prakashan ka Saal (e.g., 2023)"><input type="text" id="cite-title" placeholder="Page ka Title"><input type="text" id="cite-site" placeholder="Website ka Naam"><input type="url" id="cite-url" placeholder="URL">` : `<input type="text" id="cite-author" placeholder="Author (e.g., Sharma, R.)"><input type="text" id="cite-year" placeholder="Prakashan ka Saal (e.g., 2021)"><input type="text" id="cite-title" placeholder="Kitab ka Title"><input type="text" id="cite-publisher" placeholder="Publisher ka Naam">`;
                };
                sourceSelect.addEventListener('change', renderFields);
                processBtn.addEventListener('click', () => {
                    const style = styleSelect.value;
                    const source = sourceSelect.value;
                    const author = document.getElementById('cite-author').value || 'N.p.';
                    const year = document.getElementById('cite-year').value || 'n.d.';
                    const title = document.getElementById('cite-title').value || 'Untitled';
                    let citation = '';
                    if(source === 'Website') {
                        const site = document.getElementById('cite-site').value || 'Website';
                        const url = document.getElementById('cite-url').value;
                        if(style === 'APA') citation = `${author}. (${year}). <i>${title}</i>. ${site}. Retrieved from ${url}`;
                        else citation = `${author}. "${title}." <i>${site}</i>, ${year}, ${url}.`;
                    } else {
                        const publisher = document.getElementById('cite-publisher').value || 'Publisher';
                        if(style === 'APA') citation = `${author}. (${year}). <i>${title}</i>. ${publisher}.`;
                        else citation = `${author}. <i>${title}</i>. ${publisher}, ${year}.`;
                    }
                    outputDiv.style.display = 'block';
                    outputDiv.innerHTML = citation;
                });
                renderFields();
                break;
            case 'text-summarizer':
                 processBtn.addEventListener('click', () => {
                    const text = textInput.value;
                    if(!text.trim()){ alert("Kripya text enter karein."); return; }
                    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
                    if(sentences.length < 3) { document.getElementById('tool-output').value = text; return; }
                    const stopWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'but', 'ka', 'ki', 'ke', 'hai', 'mein', 'par', 'aur']);
                    const wordFreq = {};
                    text.toLowerCase().split(/\W+/).forEach(word => { if(!stopWords.has(word)) wordFreq[word] = (wordFreq[word] || 0) + 1; });
                    const sentenceScores = sentences.map(sentence => ({ sentence, score: sentence.toLowerCase().split(/\W+/).reduce((acc, word) => acc + (wordFreq[word] || 0), 0) }));
                    sentenceScores.sort((a, b) => b.score - a.score);
                    document.getElementById('tool-output').value = sentenceScores.slice(0, Math.max(1, Math.floor(sentences.length / 3))).map(item => item.sentence).join(' ');
                 });
                break;
            case 'study-timer':
                let timerInterval; let timeLeft = 25 * 60; let isRunning = false; let sessions = 0;
                const timerDisplay = document.getElementById('timer-display');
                const startPauseBtn = document.getElementById('start-pause-btn');
                const resetBtn = document.getElementById('reset-btn');
                const sessionCount = document.getElementById('session-count');
                const updateDisplay = () => {
                    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                    const seconds = (timeLeft % 60).toString().padStart(2, '0');
                    timerDisplay.textContent = `${minutes}:${seconds}`;
                    document.title = `${minutes}:${seconds} - Study Timer`;
                };
                startPauseBtn.addEventListener('click', () => {
                    isRunning = !isRunning;
                    if(isRunning) {
                        startPauseBtn.textContent = 'Pause';
                        timerInterval = setInterval(() => {
                            timeLeft--;
                            if(timeLeft < 0) {
                                clearInterval(timerInterval);
                                alert("Session complete! Take a break.");
                                sessions++;
                                sessionCount.textContent = `Sessions: ${sessions}`;
                                timeLeft = 25 * 60;
                                isRunning = false;
                                startPauseBtn.textContent = 'Start';
                            }
                            updateDisplay();
                        }, 1000);
                    } else {
                        startPauseBtn.textContent = 'Start';
                        clearInterval(timerInterval);
                    }
                });
                resetBtn.addEventListener('click', () => {
                    clearInterval(timerInterval);
                    isRunning = false;
                    timeLeft = 25 * 60;
                    startPauseBtn.textContent = 'Start';
                    updateDisplay();
                });
                break;
            case 'ocr-tool':
                processWith(async () => {
                    showStatus('Image se text nikala ja raha hai... Ismein samay lag sakta hai.');
                    const { data: { text } } = await Tesseract.recognize(
                        selectedFiles[0],
                        'eng+hin', 
                        { logger: m => showStatus(`${m.status}: ${Math.round(m.progress * 100)}%`) }
                    );
                    showStatus('Ho gaya!');
                    resultsDiv.style.display = "block";
                    resultsDiv.innerHTML = `<textarea class="tool-textarea" readonly>${text}</textarea>`;
                });
                break;
            // ... (rest of the tool logic cases)
        }
    };
});