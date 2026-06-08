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
- `script.js` contains DOM behavior, canvas animation, mobile menu, scroll effects, contact form simulation, and EN/ID translations.
- `image.png` is used as the hero/profile visual.
- `README.md` is the GitHub profile README, separate from the website.

## Development Rules

Keep this project simple. Do not introduce frameworks, bundlers, package managers, or new architecture unless explicitly requested.

Prefer minimal, direct edits:
- HTML changes in `index.html`
- Visual/layout changes in `style.css`
- Interaction/i18n changes in `script.js`

Avoid unnecessary abstraction. This is a small static site.

## HTML Guidelines

When editing `index.html`:
- Preserve semantic section structure: `home`, `about`, `experience`, `projects`, `contact`.
- Keep navigation anchors aligned with section IDs.
- Add `data-i18n` for any user-facing text that must support EN/ID language toggle.
- Keep accessibility basics:
- descriptive `alt` text for images
- `aria-label` for icon-only buttons/links
- valid form labels
- usable keyboard/focus behavior
- Do not add inline scripts or inline styles unless there is a clear, small reason.

## CSS Guidelines

When editing `style.css`:
- Reuse existing CSS custom properties in `:root`.
- Preserve dark visual language:
- black/dark background
- blue accent
- muted secondary text
- card/border styling
- Keep responsive behavior intact.
- Verify desktop and mobile breakpoints:
- `max-width: 1024px`
- `max-width: 768px`
- Avoid large redesigns unless requested.
- Avoid adding duplicate selectors; update existing rules when possible.
- Keep animations performant:
- prefer `transform` and `opacity`
- avoid layout-heavy animation where possible

## JavaScript Guidelines

When editing `script.js`:
- Keep behavior inside `DOMContentLoaded`.
- Use vanilla JS only.
- Guard DOM access when elements may not exist.
- Keep i18n keys synchronized:
- every `data-i18n` key in HTML must exist in both `translations.en` and `translations.id`
- every visible translated string should be updated through `updateLanguage`
- Avoid global variables outside the current pattern unless needed.
- Do not add real form submission unless explicitly requested.
- If contact form becomes real, validate input and avoid exposing secrets/client-side API keys.

## i18n Rules

Language support currently includes:
- English: `translations.en`
- Indonesian: `translations.id`

When adding/changing translated content:
- Update both languages.
- Keep tone professional, concise, portfolio-oriented.
- Ensure language toggle active state still works.
- Do not leave placeholder copy in one language.

## UX And Accessibility

Maintain:
- responsive mobile header/sidebar behavior
- smooth anchor scrolling
- active nav state on scroll
- readable contrast
- usable form labels
- hidden custom cursor on mobile

Be careful with:
- canvas animation performance
- excessive motion
- focus visibility
- mobile viewport spacing

## Security Rules

This is a static frontend project, but still:
- Never commit secrets, tokens, API keys, credentials, or private config.
- Do not place private email/API credentials in JS.
- External images/fonts/icons must use trusted HTTPS URLs.
- If adding external scripts, explain why and prefer avoiding them.

## Validation

There is no automated test/build command.

Before finishing changes:
- Open `index.html` in browser if possible.
- Check console for JS errors.
- Test desktop layout.
- Test mobile layout.
- Test language toggle.
- Test mobile menu open/close.
- Test section nav links.
- Test contact form simulation.
- Verify no broken image/link regressions.

## Git Rules

- Do not commit unless explicitly requested.
- Do not rewrite history.
- Do not run destructive git commands.
- Preserve unrelated user changes.
- Keep commits focused when requested.

## Code Style

Follow existing style:
- 4-space indentation in HTML/CSS/JS.
- Single quotes are common in JS.
- Plain CSS, no preprocessors.
- Clear class names.
- Minimal comments; only explain non-obvious behavior.

## Change Philosophy

Best change = smallest correct change.

Priorities:
1. Preserve current site behavior.
2. Keep UI responsive.
3. Keep language toggle consistent.
4. Avoid new dependencies.
5. Keep code readable for a static-site workflow.
