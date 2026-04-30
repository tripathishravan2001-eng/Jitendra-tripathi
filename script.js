/* ============================================================
   JEETENDRA TRIPATHI — Enhanced Script
   ============================================================ */

/* ── Globals ── */
let selectedService = "";
let dynamicPhone = "917489062196"; // Used for WhatsApp links

/* Detect touch-only devices (no hover) */
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

/* ══════════════════════════════════════════════════════════
   0. DYNAMIC SETTINGS FROM ADMIN (localStorage)
══════════════════════════════════════════════════════════ */
(function applyDynamicSettings() {
    const saved = localStorage.getItem('panditjiSettings');
    if (!saved) return;
    
    try {
        const settings = JSON.parse(saved);
        
        // Text updates
        if(settings.tagline) {
            const el = document.getElementById('tagline');
            if(el) el.innerHTML = settings.tagline;
        }
            if(settings.intro) {
                const el = document.getElementById('intro');
                if(el) el.innerHTML = settings.intro;
            }
            if(settings.aboutText) {
                const el = document.getElementById('aboutText');
                if(el) el.innerHTML = settings.aboutText;
            }
            if(settings.aboutSubText) {
                const el = document.getElementById('aboutSubText');
                if(el) el.innerHTML = settings.aboutSubText;
            }
            
            // Stats
            if(settings.expYears) {
                const el = document.querySelector('.about-stats .stat:nth-child(1) .stat-num');
                if(el) el.dataset.target = settings.expYears;
            }
            if(settings.familiesServed) {
                const el = document.querySelector('.about-stats .stat:nth-child(2) .stat-num');
                if(el) el.dataset.target = settings.familiesServed;
            }
            if(settings.ritualsPerformed) {
                const el = document.querySelector('.about-stats .stat:nth-child(3) .stat-num');
                if(el) el.dataset.target = settings.ritualsPerformed;
            }
            
            // Contact info
            if(settings.phoneNumber) {
                let pNum = settings.phoneNumber === "+91 XXXXX XXXXX" ? "+91 7489062196" : settings.phoneNumber;
                const el = document.querySelector('#contact-phone p');
                if(el) el.textContent = pNum;
            }
            if(settings.whatsappNumber) {
                let wNum = settings.whatsappNumber === "91XXXXXXXXXX" ? "917489062196" : settings.whatsappNumber;
                const el = document.querySelector('#contact-whatsapp p');
                if(el) el.textContent = "+" + wNum;
                dynamicPhone = wNum;
            }
            if(settings.locationText) {
                const el = document.querySelector('#contact-location p');
                if(el) el.textContent = settings.locationText;
            }
            
            // Social Media Links
            if(settings.linkFacebook) {
                const el = document.getElementById('linkFacebook');
                if(el) el.href = settings.linkFacebook;
            }
            if(settings.linkInstagram) {
                const el = document.getElementById('linkInstagram');
                if(el) el.href = settings.linkInstagram;
            }
            if(settings.linkYoutube) {
                const el = document.getElementById('linkYoutube');
                if(el) el.href = settings.linkYoutube;
            }

            // Image
            if(settings.aboutImage) {
                const img = document.querySelector('.about-image-frame img');
                if(img) img.src = settings.aboutImage;
            }
            
            // Gallery
            if(settings.galleryImages && settings.galleryImages.length > 0) {
                const track = document.querySelector('.gallery-track');
                if(track) {
                    track.innerHTML = '';
                    // Set 1
                    settings.galleryImages.forEach(src => {
                        const img = document.createElement('img');
                        img.src = src;
                        img.alt = "Gallery Image";
                        track.appendChild(img);
                    });
                    // Set 2 for seamless loop
                    settings.galleryImages.forEach(src => {
                        const img = document.createElement('img');
                        img.src = src;
                        img.alt = "Gallery Image";
                        img.setAttribute('aria-hidden', 'true');
                        track.appendChild(img);
                    });
                }
            }
            

            
        // Update English translations map so language toggle doesn't revert to old defaults
        if (typeof translations !== 'undefined' && translations.en) {
            if(settings.tagline) translations.en.tagline = settings.tagline;
            if(settings.intro) translations.en.intro = settings.intro;
            if(settings.aboutText) translations.en.aboutText = settings.aboutText;
            if(settings.aboutSubText) translations.en.aboutSubText = settings.aboutSubText;
        }

    } catch(e) {
        console.error("Error applying settings", e);
    }
})();

/* ══════════════════════════════════════════════════════════
   1. SCROLL PROGRESS BAR
══════════════════════════════════════════════════════════ */
const scrollBar = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = pct + "%";
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   2. NAVBAR — Glass on Scroll
══════════════════════════════════════════════════════════ */
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   3. SMOOTH NAV LINKS (prevent default jump)
══════════════════════════════════════════════════════════ */
function smoothNav(id) {
    event && event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
}

function scrollToSection(id) {
    smoothNav(id);
}

/* ══════════════════════════════════════════════════════════
   4. MOBILE HAMBURGER MENU
══════════════════════════════════════════════════════════ */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

function toggleMenu() {
    const isOpen = mobileMenu.classList.contains("open");
    if (isOpen) {
        closeMobileMenu();
    } else {
        mobileMenu.classList.add("open");
        hamburger.classList.add("open");
        document.body.style.overflow = "hidden";
    }
}

function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
    document.body.style.overflow = "";
}

/* Close on Escape */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeMobileMenu();
        closeModal();
    }
});

/* ══════════════════════════════════════════════════════════
   5. HERO PARTICLE SYSTEM
══════════════════════════════════════════════════════════ */
(function createParticles() {
    const container = document.getElementById("heroParticles");
    if (!container) return;

    const PARTICLE_COUNT = 55;
    const colors = [
        "rgba(255, 140, 0, 0.7)",
        "rgba(212, 160, 23, 0.6)",
        "rgba(255, 200, 80, 0.5)",
        "rgba(255, 69, 0, 0.5)",
        "rgba(255, 255, 200, 0.4)",
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement("div");
        p.classList.add("hero-particle");

        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 14;
        const dur = Math.random() * 14 + 8;
        const color = colors[Math.floor(Math.random() * colors.length)];

        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            bottom: -10px;
            background: ${color};
            box-shadow: 0 0 ${size * 3}px ${color};
            animation-delay: ${delay}s;
            animation-duration: ${dur}s;
        `;
        container.appendChild(p);
    }
})();

/* ══════════════════════════════════════════════════════════
   6. SCROLL REVEAL OBSERVER
══════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
});

document.querySelectorAll(".reveal, .reveal-right").forEach((el) => {
    revealObserver.observe(el);
});

/* ══════════════════════════════════════════════════════════
   7. ANIMATED COUNTER
══════════════════════════════════════════════════════════ */
function animateCounter(el, targetRaw, duration = 1800) {
    const targetStr = String(targetRaw);
    const targetNum = parseInt(targetStr.replace(/[^0-9]/g, ''), 10) || 0;
    const suffix = targetStr.replace(/[0-9,]/g, ''); // Extract non-numeric suffix like + or k

    const start = performance.now();
    const startVal = 0;

    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startVal + eased * (targetNum - startVal));
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = targetNum.toLocaleString() + suffix;
    }

    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const targetRaw = el.dataset.target;
            animateCounter(el, targetRaw);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-num").forEach((el) => {
    counterObserver.observe(el);
});

/* ══════════════════════════════════════════════════════════
   8. BOOKING MODAL
══════════════════════════════════════════════════════════ */
function openBooking(service) {
    selectedService = service;
    document.getElementById("service").value = service;
    const modal = document.getElementById("bookingModal");
    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    // Reset & focus first interactive field
    setTimeout(() => {
        const dateField = document.getElementById("date");
        if (dateField) dateField.focus();
    }, 400);
}

function closeModal() {
    const modal = document.getElementById("bookingModal");
    const content = modal.querySelector(".modal-content");

    // Exit animation
    content.style.animation = "modalSlideOut 0.3s cubic-bezier(0.4, 0, 1, 1) both";

    setTimeout(() => {
        modal.classList.remove("open");
        content.style.animation = "";
        document.body.style.overflow = "";
    }, 280);
}

function closeModalOutside(e) {
    if (e.target === document.getElementById("bookingModal")) {
        closeModal();
    }
}

// Inject slide-out keyframe dynamically
const style = document.createElement("style");
style.textContent = `
    @keyframes modalSlideOut {
        from { opacity: 1; transform: translateY(0) scale(1); }
        to   { opacity: 0; transform: translateY(40px) scale(0.93); }
    }
`;
document.head.appendChild(style);

/* ── Auto-format Date Input ── */
const dateInput = document.getElementById("date");
if (dateInput) {
    dateInput.addEventListener("input", function(e) {
        if (e.inputType === "deleteContentBackward") return;
        let v = e.target.value;
        if (v.match(/^\d{2}$/) !== null) {
            e.target.value = v + '/';
        } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
            e.target.value = v + '/';
        }
    });
}

/* ── Booking Form Submit ── */
document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const name = document.getElementById("name") ? document.getElementById("name").value : "";
    const userPhone = document.getElementById("userPhone") ? document.getElementById("userPhone").value : "";
    const location = document.getElementById("location").value;

    let formattedDate = date;

    const message = `🙏 *Booking Request*
━━━━━━━━━━━━━━━
📿 *Service:* ${service}
👤 *Name:* ${name}
📞 *Phone:* ${userPhone}
📅 *Date:* ${formattedDate}
⏰ *Time:* ${time}
📍 *Location:* ${location}
━━━━━━━━━━━━━━━
Sent from panditjeetendratripathi.com`;

    const phone = "917489062196";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Visual feedback before opening
    const btn = this.querySelector(".btn-submit span");
    btn.textContent = "Opening WhatsApp…";

    setTimeout(() => {
        window.open(url, "_blank");
        closeModal();
        this.reset();
        btn.textContent = "Confirm via WhatsApp";
    }, 600);
});

/* ══════════════════════════════════════════════════════════
   9. WHATSAPP DIRECT
══════════════════════════════════════════════════════════ */
function whatsappDirect() {
    const phone = "917489062196";
    const message = "🙏 Namaste Panditji! I would like to enquire about your services.";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
}

/* ══════════════════════════════════════════════════════════
   10. LANGUAGE TOGGLE
══════════════════════════════════════════════════════════ */
const translations = {
    en: {
        tagline: "Bringing Divine Blessings<br>to Your Life",
        intro: "Experienced Pujari, Kathavachak & Astrologer",
        aboutText: "Pandit Jeetendra Tripathi is a highly experienced spiritual guide specializing in Vedic rituals, Kathas, astrology, and vastu consultation.",
        aboutSubText: "With over 25 years of devoted practice, Panditji has guided thousands of families through sacred ceremonies, bringing peace, prosperity, and divine blessings into their lives. Rooted in the rich Vedic tradition, his work bridges ancient scripture with the needs of modern families.",
    },
    hi: {
        tagline: "आपके जीवन में<br>ईश्वरीय कृपा का संचार",
        intro: "अनुभवी पुजारी, कथावाचक और ज्योतिषी",
        aboutText: "पंडित जीतेंद्र त्रिपाठी एक अनुभवी आध्यात्मिक मार्गदर्शक हैं जो वैदिक अनुष्ठानों, कथाओं, ज्योतिष और वास्तु परामर्श में विशेषज्ञ हैं।",
        aboutSubText: "25 से अधिक वर्षों की समर्पित साधना के साथ, पंडितजी ने हजारों परिवारों को पवित्र संस्कारों के माध्यम से मार्गदर्शन किया है।",
    }
};

function setLang(lang) {
    const t = translations[lang];
    if (!t) return;

    const fadeTargets = ["tagline", "intro", "aboutText", "aboutSubText"];
    fadeTargets.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.opacity = "0";
        el.style.transform = "translateY(8px)";
        el.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        setTimeout(() => {
            el.innerHTML = t[id] || el.innerHTML;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }, 300);
    });

    // Update active button state
    document.querySelectorAll(".lang-btn").forEach((btn) => btn.classList.remove("active"));
    const activeBtn = document.getElementById(`btn-${lang}`);
    if (activeBtn) activeBtn.classList.add("active");
}

/* ══════════════════════════════════════════════════════════
   11. CARD TILT EFFECT (subtle 3D on mouse move — desktop only)
══════════════════════════════════════════════════════════ */
if (!isTouch) {
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -8;
            const rotateY = ((x - cx) / cx) * 8;
            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
            card.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        });
    });
}

/* ══════════════════════════════════════════════════════════
   12. GALLERY ITEM — Click pulse + touch overlay toggle
══════════════════════════════════════════════════════════ */
document.querySelectorAll(".gallery-item").forEach((item) => {
    if (isTouch) {
        /* On touch: first tap shows overlay, second tap follows through */
        const overlay = item.querySelector(".gallery-overlay");
        item.addEventListener("touchend", (e) => {
            const isVisible = parseFloat(getComputedStyle(overlay).opacity) > 0.7;
            if (!isVisible) {
                /* Show overlay — cancel any navigation */
                e.preventDefault();
                document.querySelectorAll(".gallery-item .gallery-overlay").forEach((o) => {
                    o.style.opacity = "0.6";
                    o.querySelector("span").style.transform = "translateY(0)";
                });
                overlay.style.opacity = "1";
            }
        }, { passive: false });
    } else {
        item.addEventListener("click", () => {
            item.style.transform = "scale(0.97)";
            setTimeout(() => { item.style.transform = ""; }, 200);
        });
    }
});

/* ══════════════════════════════════════════════════════════
   13. ACTIVE NAV HIGHLIGHT ON SCROLL
══════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navAnchors.forEach((a) => {
                a.style.color = "";
                if (a.getAttribute("href") === `#${entry.target.id}`) {
                    a.style.color = "var(--gold-light)";
                }
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach((s) => sectionObserver.observe(s));

/* ══════════════════════════════════════════════════════════
   14. PAGE LOAD ENTRANCE — fade body in
══════════════════════════════════════════════════════════ */
document.body.style.opacity = "0";
document.body.style.transition = "opacity 0.6s ease";
window.addEventListener("load", () => {
    document.body.style.opacity = "1";
});

/* ══════════════════════════════════════════════════════════
   15. GALLERY SLIDESHOW
══════════════════════════════════════════════════════════ */
(function initGallery() {
    const images = [
        { src: "jal 6.jpg", caption: "Sacred Ritual" },
        { src: "jal.jpg", caption: "Divine Ceremony" },
        { src: "jal1.jpg", caption: "Vedic Tradition" },
        { src: "jal2.jpg", caption: "Spiritual Gathering" },
        { src: "jal3.jpg", caption: "Holy Puja" },
        { src: "jal4.jpg", caption: "Blessed Moments" },
        { src: "jal5.jpg", caption: "Devotional Prayers" },
        { src: "jal8.png", caption: "Auspicious Event" },
    ];

    const ANIM_MS = 480;
    const AUTO_DELAY = 4200;

    const stage = document.getElementById("gslStage");
    const captionEl = document.getElementById("gslCaption");
    const currentEl = document.getElementById("gslCurrent");
    const totalEl = document.getElementById("gslTotal");
    const dotsWrap = document.getElementById("gslDots");

    if (!stage) return;

    /* Build two image layers inside the stage (before overlay) */
    function makeImg(z) {
        const img = document.createElement("img");
        img.className = "gsl-img";
        img.style.cssText = `position:absolute;inset:0;width:100%;height:100%;` +
            `object-fit:cover;object-position:center;display:block;` +
            `border-radius:inherit;z-index:${z};will-change:transform,opacity;`;
        const overlay = stage.querySelector(".gsl-overlay");
        stage.insertBefore(img, overlay);
        return img;
    }

    let imgBack = makeImg(1);   // incoming (hidden)
    let imgFront = makeImg(2);   // current  (visible)

    /* Load first image */
    imgFront.src = images[0].src;
    imgFront.alt = images[0].caption;
    imgFront.style.opacity = "1";
    imgFront.style.transform = "translateX(0)";
    imgBack.style.opacity = "0";
    if (captionEl) {
        captionEl.textContent = images[0].caption;
        captionEl.classList.add("visible");
    }

    let current = 0;
    let isAnimating = false;
    let autoTimer = null;

    totalEl.textContent = images.length;

    /* Build dot indicators */
    images.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "gsl-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Go to image ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    function getDots() { return dotsWrap.querySelectorAll(".gsl-dot"); }

    function goTo(index, direction = "next") {
        if (isAnimating) return;
        const next = ((index % images.length) + images.length) % images.length;
        if (next === current) return;

        isAnimating = true;

        const inFrom = direction === "prev" ? "-70px" : "70px";
        const outTo = direction === "prev" ? "70px" : "-70px";
        const easing = "cubic-bezier(0.4, 0, 0.2, 1)";
        const trans = `opacity ${ANIM_MS}ms ease, transform ${ANIM_MS}ms ${easing}`;

        /* Stage back layer off-screen, load new image */
        imgBack.style.transition = "none";
        imgBack.style.opacity = "0";
        imgBack.style.transform = `translateX(${inFrom})`;
        imgBack.src = images[next].src;
        imgBack.alt = images[next].caption;

        /* Caption fades out */
        if (captionEl) captionEl.classList.remove("visible");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                /* Animate back IN, front OUT simultaneously */
                imgBack.style.transition = trans;
                imgBack.style.opacity = "1";
                imgBack.style.transform = "translateX(0)";

                imgFront.style.transition = trans;
                imgFront.style.opacity = "0";
                imgFront.style.transform = `translateX(${outTo})`;

                setTimeout(() => {
                    /* Swap roles */
                    [imgFront, imgBack] = [imgBack, imgFront];
                    imgFront.style.zIndex = "2";
                    imgBack.style.zIndex = "1";

                    /* Reset old front silently */
                    imgBack.style.transition = "none";
                    imgBack.style.opacity = "0";
                    imgBack.style.transform = "translateX(0)";

                    current = next;

                    /* Update UI */
                    if (captionEl) {
                        captionEl.textContent = images[current].caption;
                        captionEl.classList.add("visible");
                    }
                    currentEl.textContent = current + 1;
                    getDots().forEach((d, i) => d.classList.toggle("active", i === current));

                    isAnimating = false;
                }, ANIM_MS + 40);
            });
        });

        restartAuto();
    }

    function galleryNextFn() { goTo(current + 1, "next"); }
    function galleryPrevFn() { goTo(current - 1, "prev"); }

    window.gslNext = galleryNextFn;
    window.gslPrev = galleryPrevFn;

    function startAuto() { autoTimer = setInterval(galleryNextFn, AUTO_DELAY); }
    function restartAuto() { clearInterval(autoTimer); startAuto(); }
    startAuto();

    /* Pause on hover */
    stage.addEventListener("mouseenter", () => clearInterval(autoTimer));
    stage.addEventListener("mouseleave", () => startAuto());

    /* Keyboard arrows */
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") galleryNextFn();
        if (e.key === "ArrowLeft") galleryPrevFn();
    });

    /* Touch swipe */
    let touchStartX = 0;
    stage.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    stage.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
            if (dx < 0) galleryNextFn();
            else galleryPrevFn();
        }
    }, { passive: true });

    /* Preload all images */
    images.forEach(({ src }) => { const p = new Image(); p.src = src; });
})();

/* ══════════════════════════════════════════════════════════
   13. DARK MODE
══════════════════════════════════════════════════════════ */
function toggleTheme() {
    const body = document.documentElement;
    const btn = document.getElementById('btn-theme');
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        btn.textContent = '🌙';
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        btn.textContent = '☀️';
    }
}

// Load saved theme
(function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const btn = document.getElementById('btn-theme');
        if (btn) btn.textContent = '☀️';
    }
})();