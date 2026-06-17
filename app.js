/* Chandra Bachtiar — portfolio interactions
   Pure vanilla JS, no deps. Loaded with `defer` so DOM is ready. */

(() => {
    'use strict';

    const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = matchMedia('(hover: none)').matches;

    // Mark JS as ready so CSS can hide [data-reveal] / [data-words] > *
    // (no-JS users get visible content as a fallback).
    if (!prefersReduce) document.body.classList.add('js-ready');

    // === First-paint loader =====================================
    // Fade out on window.load so heavy assets (image.png) get a moment
    // to decode before the page reveals. Respects prefers-reduced-motion
    // by skipping the transition.
    const loader = document.querySelector('.loader');
    const hideLoader = () => {
        if (!loader) return;
        if (prefersReduce) {
            loader.remove();
        } else {
            loader.classList.add('is-out');
            setTimeout(() => loader.remove(), 1400);
        }
    };
    if (document.readyState === 'complete') hideLoader();
    else window.addEventListener('load', hideLoader, { once: true });

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
    const MAG = 0.35;
    const bindMagnetic = (el, strength = MAG) => {
        if (!el || isTouch || prefersReduce) return;
        let rect = null;
        el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); });
        el.addEventListener('pointermove', (e) => {
            if (!rect) rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            el.style.setProperty('--mx', `${(e.clientX - cx) * strength}px`);
            el.style.setProperty('--my', `${(e.clientY - cy) * strength}px`);
            el.style.setProperty('--px', `${e.clientX - rect.left}px`);
            el.style.setProperty('--py', `${e.clientY - rect.top}px`);
        });
        el.addEventListener('pointerleave', () => {
            el.style.setProperty('--mx', '0px');
            el.style.setProperty('--my', '0px');
            el.style.setProperty('--px', '50%');
            el.style.setProperty('--py', '50%');
            rect = null;
        });
    };
    bindMagnetic(more, 0.35);
    // CTA button: magnetic on the small CTA (in addition to tilt)
    document.querySelectorAll('[data-magnetic]').forEach((el) => bindMagnetic(el, 0.2));

    // === Overlay: open/close with curtain transition ============
    const overlay = document.querySelector('[data-overlay]');
    const moreBtn = document.querySelector('[data-more]');
    const closeBtn = document.querySelector('[data-close]');
    const focusableSel = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

    let lastFocus = null;
    let firstSectionRevealed = false;
    let resetOverlayTimer = null;

    const setPortalOrigin = () => {
        if (!overlay || !moreBtn) return;
        const rect = moreBtn.getBoundingClientRect();
        overlay.style.setProperty('--portal-x', `${rect.left + rect.width / 2}px`);
        overlay.style.setProperty('--portal-y', `${rect.top + rect.height / 2}px`);
    };

    const revealAll = () => {
        overlay?.querySelectorAll('[data-reveal], [data-words]').forEach((el) => {
            el.classList.add('is-in');
        });
        overlay?.querySelectorAll('[data-count]').forEach(animateCount);
    };

    const openOverlay = () => {
        if (!overlay) return;
        lastFocus = document.activeElement;
        setPortalOrigin();
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        moreBtn?.setAttribute('aria-expanded', 'true');
        document.body.classList.add('ov-open');
        if (resetOverlayTimer) {
            clearTimeout(resetOverlayTimer);
            resetOverlayTimer = null;
        }
        setTimeout(() => closeBtn?.focus({ preventScroll: true }), 100);
        // Fire reveals: first section immediately, rest on scroll
        if (!firstSectionRevealed) {
            firstSectionRevealed = true;
            setTimeout(revealAll, 500);
        }
    };

    const closeOverlay = () => {
        if (!overlay) return;
        setPortalOrigin();
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        moreBtn?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('ov-open');
        // Reset after the curtain finishes closing, so content does not vanish mid-animation.
        if (resetOverlayTimer) clearTimeout(resetOverlayTimer);
        resetOverlayTimer = setTimeout(() => {
            overlay.scrollTo({ top: 0 });
            overlay.querySelectorAll('[data-reveal].is-in, [data-words].is-in').forEach((el) => {
                el.classList.remove('is-in');
            });
            overlay.querySelectorAll('[data-count][data-counted]').forEach((el) => {
                el.textContent = '0';
                delete el.dataset.counted;
            });
            firstSectionRevealed = false;
            resetOverlayTimer = null;
        }, 1100);
        setTimeout(() => lastFocus?.focus?.({ preventScroll: true }), 50);
    };

    moreBtn?.addEventListener('click', openOverlay);
    closeBtn?.addEventListener('click', closeOverlay);

    // "Back to top" in footer scrolls overlay to section 0 (not close).
    overlay?.querySelector('[data-scroll-top]')?.addEventListener('click', (e) => {
        e.preventDefault();
        sections[0]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

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
        // Reduced-motion: jump straight to the final value, no animation.
        if (prefersReduce) {
            el.textContent = String(target);
            return;
        }
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

    // === Overlay decorative parallax =============================
    // Translate the deco layers based on overlay scroll position so
    // the background feels alive. transform-only, no layout cost.
    const deco = overlay?.querySelector('.ov-deco');
    if (deco && overlay && !prefersReduce) {
        const glows = deco.querySelectorAll('.ov-glow');
        const rings = deco.querySelectorAll('.ov-ring');
        const grid = deco.querySelector('.ov-grid');
        let decoRaf = null;
        const applyDeco = () => {
            const max = overlay.scrollHeight - overlay.clientHeight || 1;
            const p = Math.min(Math.max(overlay.scrollTop / max, 0), 1);
            overlay.style.setProperty('--ov-scroll', p.toFixed(4));
            glows.forEach((g, i) => {
                const k = (i + 1) * 60;
                g.style.translate = `0 ${p * k}px`;
            });
            rings.forEach((r, i) => {
                r.style.translate = `0 ${p * (i === 0 ? 120 : -80)}px`;
            });
            if (grid) grid.style.opacity = String(0.5 + p * 0.3);
            decoRaf = null;
        };
        overlay.addEventListener('scroll', () => {
            if (decoRaf) return;
            decoRaf = requestAnimationFrame(applyDeco);
        }, { passive: true });
        applyDeco();
    }

    // === Footer year stamp =======================================
    const yearEl = document.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // === Magnetic scroll — progress dots =========================
    const sections = [...document.querySelectorAll('[data-section]')];
    const dots = [...document.querySelectorAll('[data-progress-dot]')];
    if (sections.length === dots.length && sections.length) {
        const setActive = (idx) => {
            dots.forEach((d, i) => d.classList.toggle('is-in', i === idx));
            sections.forEach((s, i) => s.classList.toggle('is-active', i === idx));
            overlay?.style.setProperty('--active-section', String(idx));
        };
        setActive(0);
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

    // === Overlay scroll =========================================
    // Native scrolling is used intentionally: a JS lerp ("eased") scroll
    // fights the browser's scroll-snap and feels laggy on trackpads.
    // CSS `scroll-behavior: smooth` + proximity snap handle smoothness.

    // === Name: text scramble on hover ============================
    const nameEl = document.querySelector('.name');
    if (nameEl && !isTouch && !prefersReduce) {
        const original = nameEl.textContent;
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        let raf = null;
        let frame = 0;
        const total = 16;
        const step = () => {
            const out = original.split('').map((ch, i) => {
                if (ch === ' ') return ' ';
                if (i < frame / 2) return original[i];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            nameEl.textContent = out;
            frame += 1;
            if (frame <= total) {
                raf = requestAnimationFrame(step);
            } else {
                nameEl.textContent = original;
                raf = null;
            }
        };
        nameEl.addEventListener('pointerenter', () => {
            if (raf) cancelAnimationFrame(raf);
            frame = 0;
            raf = requestAnimationFrame(step);
        });
        nameEl.addEventListener('pointerleave', () => {
            if (raf) cancelAnimationFrame(raf);
            nameEl.textContent = original;
            raf = null;
        });
    }
})();
