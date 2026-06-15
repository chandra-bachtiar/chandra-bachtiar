/* Chandra Bachtiar — portfolio interactions
   Pure vanilla JS, no deps. Loaded with `defer` so DOM is ready. */

(() => {
    'use strict';

    const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = matchMedia('(hover: none)').matches;

    // Mark JS as ready so CSS can hide [data-reveal] / [data-words] > *
    // (no-JS users get visible content as a fallback).
    if (!prefersReduce) document.body.classList.add('js-ready');

    // === Word-by-word stagger setup =============================
    // Each [data-words] container holds inline spans. We add
    // transition-delay to each so the reveal cascades.
    const wordEls = document.querySelectorAll('[data-words]');
    wordEls.forEach((el) => {
        // gather direct inline-flow descendants (text nodes + spans)
        const kids = [...el.childNodes].filter((n) => {
            if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
            if (n.nodeType === Node.ELEMENT_NODE) {
                const tag = n.tagName.toLowerCase();
                return tag === 'span' || tag === 'em' || tag === 'b' || tag === 'i' || tag === 'strong';
            }
            return false;
        });
        let i = 0;
        for (const k of kids) {
            if (k.nodeType === Node.ELEMENT_NODE) {
                k.style.transitionDelay = `${i * 20}ms`;
                i++;
            } else {
                // text node — split into word spans
                const text = k.textContent;
                const frag = document.createDocumentFragment();
                const tokens = text.split(/(\s+)/);
                let j = 0;
                for (const tok of tokens) {
                    if (!tok) continue;
                    if (/^\s+$/.test(tok)) {
                        frag.append(tok);
                    } else {
                        const s = document.createElement('span');
                        s.textContent = tok;
                        s.style.transitionDelay = `${(i + j) * 20}ms`;
                        frag.append(s);
                        j++;
                    }
                }
                k.replaceWith(frag);
                i += j;
            }
        }
    });

    // === Custom cursor ===========================================
    const cursor = document.querySelector('.cursor');
    if (cursor && !isTouch) {
        const dot = cursor.querySelector('.cursor__dot');
        const ring = cursor.querySelector('.cursor__ring');
        const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
        const dotPos = { x: mouse.x, y: mouse.y };
        const ringPos = { x: mouse.x, y: mouse.y };

        addEventListener('pointermove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        addEventListener('pointerdown', () => cursor.classList.add('is-down'));
        addEventListener('pointerup', () => cursor.classList.remove('is-down'));

        const hoverables = 'a, button, [data-tilt], [data-more], [data-close]';
        document.body.addEventListener('pointerover', (e) => {
            if (e.target.closest(hoverables)) cursor.classList.add('is-hover');
        });
        document.body.addEventListener('pointerout', (e) => {
            if (e.target.closest(hoverables)) cursor.classList.remove('is-hover');
        });

        const tick = () => {
            dotPos.x += (mouse.x - dotPos.x) * 0.6;
            dotPos.y += (mouse.y - dotPos.y) * 0.6;
            dot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px) translate(-50%, -50%)`;
            ringPos.x += (mouse.x - ringPos.x) * 0.18;
            ringPos.y += (mouse.y - ringPos.y) * 0.18;
            ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    // === Backdrop blobs follow mouse (subtle parallax) ===========
    const blobs = document.querySelectorAll('.blob');
    if (blobs.length && !isTouch && !prefersReduce) {
        const win = { w: innerWidth, h: innerHeight };
        addEventListener('resize', () => { win.w = innerWidth; win.h = innerHeight; });
        const blobPos = Array.from(blobs).map(() => ({ x: 0, y: 0 }));
        const blobMouse = { x: 0, y: 0 };
        addEventListener('pointermove', (e) => {
            blobMouse.x = (e.clientX / win.w - 0.5) * 2;
            blobMouse.y = (e.clientY / win.h - 0.5) * 2;
        }, { passive: true });
        const tickBlobs = () => {
            blobs.forEach((b, i) => {
                const k = 0.025 + i * 0.012;
                const tx = blobMouse.x * (40 + i * 30);
                const ty = blobMouse.y * (40 + i * 30);
                blobPos[i].x += (tx - blobPos[i].x) * k;
                blobPos[i].y += (ty - blobPos[i].y) * k;
                b.style.translate = `${blobPos[i].x}px ${blobPos[i].y}px`;
            });
            requestAnimationFrame(tickBlobs);
        };
        requestAnimationFrame(tickBlobs);
    }

    // === Magnetic "More about me" button =========================
    const more = document.querySelector('[data-more]');
    if (more && !isTouch && !prefersReduce) {
        const MAG = 0.35;
        let rect = null;
        const onMove = (e) => {
            if (!rect) rect = more.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) * MAG;
            const dy = (e.clientY - cy) * MAG;
            more.style.setProperty('--mx', `${dx}px`);
            more.style.setProperty('--my', `${dy}px`);
        };
        const onLeave = () => {
            more.style.setProperty('--mx', `0px`);
            more.style.setProperty('--my', `0px`);
            rect = null;
        };
        more.addEventListener('pointermove', onMove);
        more.addEventListener('pointerleave', onLeave);
        more.addEventListener('pointerenter', () => rect = more.getBoundingClientRect());
    }

    // === Overlay: open/close with curtain transition ============
    const overlay = document.querySelector('[data-overlay]');
    const moreBtn = document.querySelector('[data-more]');
    const closeBtn = document.querySelector('[data-close]');
    const focusableSel = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

    let lastFocus = null;
    let firstSectionRevealed = false;

    const revealAll = () => {
        document.querySelectorAll('[data-reveal], [data-words]').forEach((el) => {
            el.classList.add('is-in');
        });
        document.querySelectorAll('[data-count]').forEach(animateCount);
    };

    const openOverlay = () => {
        if (!overlay) return;
        lastFocus = document.activeElement;
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        moreBtn?.setAttribute('aria-expanded', 'true');
        document.body.classList.add('ov-open');
        setTimeout(() => closeBtn?.focus({ preventScroll: true }), 100);
        // Fire reveals: first section immediately, rest on scroll
        if (!firstSectionRevealed) {
            firstSectionRevealed = true;
            setTimeout(revealAll, 500);
        }
    };

    const closeOverlay = () => {
        if (!overlay) return;
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        moreBtn?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('ov-open');
        overlay.scrollTo({ top: 0 });
        // Reset reveals for next open
        document.querySelectorAll('[data-reveal].is-in, [data-words].is-in').forEach((el) => {
            el.classList.remove('is-in');
        });
        document.querySelectorAll('[data-count][data-counted]').forEach((el) => {
            el.textContent = '0';
            delete el.dataset.counted;
        });
        firstSectionRevealed = false;
        setTimeout(() => lastFocus?.focus?.({ preventScroll: true }), 50);
    };

    moreBtn?.addEventListener('click', openOverlay);
    closeBtn?.addEventListener('click', closeOverlay);

    addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay?.classList.contains('is-open')) closeOverlay();
    });

    overlay?.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        const focusables = [...overlay.querySelectorAll(focusableSel)]
            .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
        }
    });

    // === Reveal-on-scroll using IntersectionObserver ============
    const revealEls = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => observer.observe(el));

    // Word-reveal observer — adds is-in to the container so its child
    // spans (already styled with [data-words] span.is-in CSS rules) animate.
    const wordObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                wordObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    wordEls.forEach((el) => wordObserver.observe(el));

    // === Count-up animation for stats ===========================
    const animateCount = (el) => {
        if (el.dataset.counted) return;
        el.dataset.counted = '1';
        const target = parseInt(el.dataset.count, 10) || 0;
        const dur = 1400;
        const start = performance.now();
        const tick = (t) => {
            const p = Math.min((t - start) / dur, 1);
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            el.textContent = Math.floor(eased * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = String(target);
        };
        requestAnimationFrame(tick);
    };
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('[data-count]').forEach(animateCount);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.ov-stats').forEach((el) => statObserver.observe(el));

    // === 3D Tilt for cards ======================================
    const tilts = document.querySelectorAll('[data-tilt]');
    if (!prefersReduce && !isTouch) {
        tilts.forEach((el) => {
            let raf = null;
            el.addEventListener('pointermove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rx = (0.5 - y) * 8;
                const ry = (x - 0.5) * 12;
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    el.style.setProperty('--rx', `${rx}deg`);
                    el.style.setProperty('--ry', `${ry}deg`);
                    el.style.setProperty('--mx', `${x * 100}%`);
                    el.style.setProperty('--my', `${y * 100}%`);
                });
            });
            el.addEventListener('pointerleave', () => {
                cancelAnimationFrame(raf);
                el.style.setProperty('--rx', `0deg`);
                el.style.setProperty('--ry', `0deg`);
                el.style.setProperty('--mx', `50%`);
                el.style.setProperty('--my', '50%');
            });
        });
    }

    // Default spotlight position for stat cards
    document.querySelectorAll('.ov-stat').forEach((el) => {
        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '50%');
    });

    // === Magnetic scroll — progress dots =========================
    const sections = [...document.querySelectorAll('[data-section]')];
    const dots = [...document.querySelectorAll('[data-progress-dot]')];
    if (sections.length === dots.length && sections.length) {
        const setActive = (idx) => {
            dots.forEach((d, i) => d.classList.toggle('is-in', i === idx));
        };
        // Track which section is most visible. With mandatory scroll-snap
        // each section fills the viewport when snapped.
        const sectionObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    const idx = sections.indexOf(entry.target);
                    if (idx >= 0) setActive(idx);
                }
            });
        }, { threshold: [0.5, 0.6, 0.7] });
        sections.forEach((s) => sectionObs.observe(s));

        // Click a dot to scroll to that section
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                sections[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    // === Eased overlay scroll (wheel only) =======================
    // Lerp-driven scroll on .overlay when wheel is used. Touch and
    // prefers-reduced-motion both keep native behavior.
    if (overlay && !prefersReduce && !isTouch) {
        const SCROLL_EASE = 0.1;
        let targetScroll = overlay.scrollTop;
        let currentScroll = overlay.scrollTop;
        let lerpRaf = null;
        const tick = () => {
            const diff = targetScroll - currentScroll;
            if (Math.abs(diff) < 0.5) {
                currentScroll = targetScroll;
                overlay.scrollTop = currentScroll;
                lerpRaf = null;
                return;
            }
            currentScroll += diff * SCROLL_EASE;
            overlay.scrollTop = currentScroll;
            lerpRaf = requestAnimationFrame(tick);
        };
        overlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            const max = overlay.scrollHeight - overlay.clientHeight;
            targetScroll = Math.max(0, Math.min(max, targetScroll + e.deltaY));
            if (!lerpRaf) lerpRaf = requestAnimationFrame(tick);
        }, { passive: false });
    }
})();
