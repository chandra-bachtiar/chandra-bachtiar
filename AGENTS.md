# AGENTS.md

## Project Overview

This repository is a static personal portfolio website for Chandra Bachtiar.

Stack:
- HTML
- CSS
- Vanilla JavaScript
- No package manager
- No build step
- No frontend framework
- No backend/API
- No test runner

Main files:
- `index.html` contains page structure/content.
- `style.css` contains all visual styling, layout, animations, and responsive rules.
- `app.js` contains all behavior: first-paint loader, custom cursor, backdrop
  parallax, magnetic buttons, word-reveal stagger, overlay open/close,
  intersection-observer reveals, count-up animation, 3D card tilt, scroll
  progress indicator, overlay decorative parallax, and the name text-scramble.
- `image.png` / `image.webp` / `image@2x.webp` are the avatar assets. `<picture>`
  in `index.html` serves the webp variants; the png is the favicon.
- `README.md` is the GitHub profile README, separate from the website.

## Concept

Landing = single minimalist card. The "More about me" button opens a full-viewport
overlay (7 sections + footer) that is intentionally denser and more decorated
than the landing. The contrast is the point: calm on entry, rich on demand.

Overlay sections, in order:
1. Hero (greeting + meta)
2. About
3. Stats (count-up)
4. Experience (timeline)
5. Selected work (project cards with 3D tilt)
6. Stack (marquee)
7. CTA
+ Footer (contact, socials, back-to-top)

## Development Rules

Keep this project simple. Do not introduce frameworks, bundlers, package
managers, or new architecture unless explicitly requested.

Prefer minimal, direct edits:
- HTML changes in `index.html`
- Visual/layout changes in `style.css`
- Interaction changes in `app.js`

Avoid unnecessary abstraction. This is a small static site.

## HTML Guidelines

When editing `index.html`:
- Preserve the landing card and the `data-overlay` experience.
- Overlay sections carry `data-section` and an `ov-section` class. The
  progress dots map 1:1 to these.
- Keep accessibility basics:
  - descriptive `alt` text for images
  - `aria-label` for icon-only buttons/links
  - `aria-controls` / `aria-expanded` on the "More about me" button
  - `aria-hidden` on purely decorative nodes (`.overlay__noise`, `.ov-deco`,
    blobs, rings, etc.)
- Do not add inline scripts or inline styles unless there is a clear, small reason.

## CSS Guidelines

When editing `style.css`:
- Reuse existing CSS custom properties in `:root`.
- The two visual contexts are intentionally different:
  - Landing (`--bg`, `--fg`, `--muted`, `--card`): light card on a soft
    background with subtle floating blobs.
  - Overlay (`--ov-bg`, `--ov-fg`, `--ov-muted`, `--ov-line`, `--ov-accent`,
    `--ov-accent-2`): dark canvas with lime accent and decorative glows.
- Keep responsive behavior intact.
- Verify breakpoints:
  - `max-width: 768px`
  - `max-width: 480px`
- Avoid adding duplicate selectors; update existing rules when possible.
- Keep animations performant: prefer `transform` and `opacity`. The decorative
  glows/grid use long CSS animations — they are `will-change: transform` and
  stay GPU-friendly.
- Reveal mechanics:
  - `[data-reveal]` fades + slides up; observed by IntersectionObserver.
  - `[data-words]` cascades its child spans (word-by-word stagger) when the
    container becomes visible. `app.js` rewrites plain text nodes into spans
    so the CSS `body.js-ready [data-words] > *` selector catches them.
  - With JS disabled, `body.js-ready` is never set, so everything stays visible.

## JavaScript Guidelines

When editing `app.js`:
- The whole file is wrapped in an IIFE. No globals, no `DOMContentLoaded`
  needed because the script tag uses `defer`.
- Guard DOM access when elements may not exist.
- Skip work on `prefers-reduced-motion: reduce` and on `(hover: none)`.
- Do not add real form submission unless explicitly requested.
- For real form submission, validate input and never expose secrets.

## UX And Accessibility

Maintain:
- responsive layout at all breakpoints
- focus visibility (the global `*:focus-visible` outline is on lime accent)
- the "More about me" button has `aria-controls` + `aria-expanded`; the
  overlay uses `aria-hidden` toggled on open/close
- ESC closes the overlay; Tab focus is trapped inside it
- the custom cursor is hidden via `(hover: none)` media query
- the card centers via flexbox; the keyframe animation must not add a `-50%`
  Y offset (the body, not the card, is the positioning context)

## Security Rules

This is a static frontend project, but still:
- Never commit secrets, tokens, API keys, credentials, or private config.
- Do not place private email/API credentials in JS.
- External images/fonts/icons must use trusted HTTPS URLs.
- If adding external scripts, explain why and prefer avoiding them.

## Validation

There is no automated test/build command.

Before finishing changes:
- Open `index.html` in a browser.
- Check console for JS errors.
- Test desktop layout.
- Test mobile layout (390, 480, 768 widths).
- Test "More about me" open/close (button, ESC, focus return).
- Test reveal, count-up, magnetic, tilt, marquee.
- Test scroll-snap feel (proximity, not mandatory).
- Verify `prefers-reduced-motion` still shows all content.
- Verify no broken image/link regressions.

## Git Rules

- Do not commit unless explicitly requested.
- Do not rewrite history.
- Do not run destructive git commands.
- Preserve unrelated user changes.
- Keep commits focused when requested.

## Code Style

- 4-space indentation in HTML/CSS/JS.
- Single quotes in JS.
- Plain CSS, no preprocessors.
- Clear class names (`ov-` prefix for overlay nodes, `ov-{section}__{elem}`
  for descendants).
- Minimal comments; only explain non-obvious behavior.

## Change Philosophy

Best change = smallest correct change.

Priorities:
1. Preserve current site behavior.
2. Keep UI responsive.
3. Keep the landing simple / overlay rich contrast.
4. Avoid new dependencies.
5. Keep code readable for a static-site workflow.
