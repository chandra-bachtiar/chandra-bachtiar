# Implementation V1 — Overlay Design Upgrade

## Goal

Improve the overlay from “rich but slightly noisy” into a more intentional, premium **Engineering Dossier / Command Center** experience.

Primary direction:
- Landing stays simple, calm, and minimal.
- Overlay becomes dense, interactive, and memorable.
- Effects support hierarchy instead of feeling random.
- Keep vanilla HTML/CSS/JS only.
- No dependencies, no framework, no build step.

## Current Problems

1. Overlay has many effects, but hierarchy is uneven.
2. Some decorative elements feel generic or disconnected from content.
3. Hero lacks a refined second visual beat after removing terminal/chips/operating-mode panels.
4. About section still feels like normal cards.
5. Project cards use identical fake windows, making them less custom.
6. Some animations are infinite and may create visual noise.
7. Stack orbit is interesting but can feel gimmicky.
8. CTA is stable but could feel more final and memorable.

## Design Direction

Use one cohesive concept:

**Engineering Dossier / Command Center**

Visual language:
- Matte dark canvas.
- Thin technical lines.
- Dossier annotations.
- Telemetry.
- Mission-log timeline.
- Product system cards.
- Controlled lime accent.
- Orange as secondary warning/highlight.
- Motion feels like scan, calibrate, lock-in.

Avoid:
- Random chips.
- Meme terminal copy.
- Generic “build / ship / scale” labels.
- Too many glowing moving parts.
- Repeated decorative patterns with no purpose.

## Phase 1 — Reduce Motion Noise

### Objective

Keep the overlay impressive while reducing constant visual competition.

### Current Infinite / Repeating Motion To Audit

- Landing blobs.
- Overlay grid drift.
- Overlay glows.
- Rings.
- Radar.
- Availability dot pulse.
- Scroll line.
- Marquee.
- Orbit.
- CTA signal lights.
- Section scanlines.

### Steps

1. Keep as always-on:
   - slow overlay grid drift
   - marquee
   - one subtle background glow layer

2. Convert to active-only:
   - hero radar ring
   - stack orbit/map
   - CTA signal lights
   - section-specific scan effects

3. Slow or soften:
   - glow animations
   - ring rotation
   - availability dot pulse

4. Update CSS:
   - make `.ov-hero::after` animate only under `.ov-hero.is-active`
   - make stack orbit/map animate only under `.ov-stack.is-active`
   - make CTA signal pulse slower or run once
   - reduce opacity of background glows

### Acceptance Criteria

- Overlay still feels alive.
- No section feels constantly blinking.
- User attention goes to current section content.
- Reduced-motion remains safe.

## Phase 2 — Hero Ghost Kinetic Phrase

### Objective

Give the Hero a strong visual second beat without adding generic panels/chips.

### Already Removed

- `Build / Ship / Scale`
- `$ npm run ship`
- `Operating mode`

### Add

Add a large ghost phrase behind or around the title.

Recommended copy:

```text
SYSTEMS THAT SHIP
```

Alternative copy:
- `CALM PRODUCTS`
- `FAST TEAMS`
- `BUILD WITH CLARITY`

### HTML

Inside `.ov-hero`:

```html
<span class="ov-hero__ghost" aria-hidden="true">Systems that ship</span>
```

### CSS Direction

- Huge uppercase text.
- Transparent fill.
- Thin stroke.
- Low opacity.
- Positioned behind hero title.
- Active sweep animation.
- Mobile hidden or scaled safely.

Suggested styling:

```css
.ov-hero__ghost {
    position: absolute;
    left: 28px;
    bottom: 12vh;
    z-index: -1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.08);
    font-size: clamp(70px, 16vw, 220px);
    font-weight: 800;
    line-height: 0.9;
    letter-spacing: -0.07em;
    text-transform: uppercase;
    opacity: 0.45;
    pointer-events: none;
}
```

### Acceptance Criteria

- Hero feels cinematic.
- No cheesy copy.
- Text does not reduce readability.
- Mobile layout remains safe.

## Phase 3 — About Annotation Layout

### Objective

Make About feel like a dossier page, not standard card stack.

### Current Structure

```html
<div class="ov-about__principles">
    <span>Reliable systems</span>
    <span>Clear architecture</span>
    <span>Calm delivery</span>
</div>
```

### Replace With

```html
<div class="ov-about__annotations" data-reveal>
    <span><b>01</b> Reliable systems</span>
    <span><b>02</b> Clear architecture</span>
    <span><b>03</b> Calm delivery</span>
</div>
```

### CSS Direction

- Smaller annotation labels.
- Asymmetric placement.
- Connector hairlines.
- Slight rotation.
- Not large card blocks.
- Active reveal from side.

### Remove

- `.ov-about__principles`
- `principleDrift`

### Acceptance Criteria

- About feels editorial.
- Principle content stays readable.
- Design feels custom, not like generic cards.
- Mobile stacks annotations below text.

## Phase 4 — Project Card Unique Motifs

### Objective

Make each project card visually distinct.

### Current Problem

All cards use identical `.ov-card__window`, so the projects feel templated.

### Replace With Per-Card Motifs

Add modifier classes:

```html
<article class="ov-card ov-card--wide ov-card--launch" data-reveal data-tilt>
<article class="ov-card ov-card--inventory" data-reveal data-tilt>
<article class="ov-card ov-card--code" data-reveal data-tilt>
<article class="ov-card ov-card--agents ov-card--wide" data-reveal data-tilt>
```

### Shared Markup

Each card gets one visual span:

```html
<span class="ov-card__visual" aria-hidden="true"></span>
```

### Naowledge — Launch Motif

Visual direction:
- diagonal launch stripe
- domain pill
- subtle upward trajectory line

CSS targets:
- `.ov-card--launch .ov-card__visual`
- `.ov-card--launch::before`

### Food Merchant — Inventory Motif

Visual direction:
- stock bars
- low-stock alert dot
- small product grid

CSS targets:
- `.ov-card--inventory .ov-card__visual`
- pseudo bars via `::before` / `::after`

### This Page — Code Motif

Visual direction:
- braces / grid
- tiny code rows
- pure HTML/CSS/JS feel

CSS targets:
- `.ov-card--code .ov-card__visual`

### Pipeline Agents — Node Graph Motif

Visual direction:
- connected nodes
- pipeline line
- auto-review flow

CSS targets:
- `.ov-card--agents .ov-card__visual`

### Remove

- `.ov-card__window`
- window pseudo dots/progress

### Acceptance Criteria

- Each project looks different at a glance.
- Cards still align in bento layout.
- Hover remains subtle and premium.
- No large markup bloat.

## Phase 5 — Stack Orbit Into System Map

### Objective

Make the Stack section meaningful, not gimmicky.

### Current Orbit

- React
- Node
- DB
- Edge

### Recommended Replacement

Replace orbit with an architecture flow:

```html
<div class="ov-stack__map" aria-hidden="true">
    <span>UI</span>
    <i></i>
    <span>API</span>
    <i></i>
    <span>DB</span>
    <i></i>
    <span>Edge</span>
</div>
```

### CSS Direction

- Horizontal or diagonal flow.
- Connector lines.
- Active pulse moves across connectors.
- Hidden or simplified on mobile.

### Acceptance Criteria

- Section explains stack as architecture flow.
- Still visually interesting.
- Not random orbit decoration.

## Phase 6 — CTA Final Halo

### Objective

Make CTA feel like the final destination of the overlay.

### Add

```html
<span class="ov-cta__halo" aria-hidden="true"></span>
```

### CSS Direction

- Large radial halo behind CTA.
- Subtle rotating gradient ring.
- Active section settles it into view.
- Button stays clean.

### CTA Signal

Current signal dots are okay but can look decorative.

Recommended choices:
1. Remove dots if halo is strong enough.
2. Or add labels:
   - `Signal open`
   - `Usually fast`

Preferred:
- keep panel
- keep button
- add halo
- remove or soften blinking dots

### Acceptance Criteria

- CTA feels like culmination.
- No weird blinking.
- Button remains readable and clear.

## Phase 7 — Responsive Pass

### Breakpoints

Verify:
- `390px`
- `480px`
- `768px`
- desktop

### Rules

1. Hide or simplify heavy visuals:
   - hero ghost if too large
   - stack map/orbit
   - large section frames

2. Ensure no horizontal overflow.

3. Timeline cards must not collide with indexes/current badge.

4. Project motifs must not cover text.

5. CTA halo must not overflow badly.

### CSS Targets

Update existing:

```css
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }
```

## Phase 8 — Accessibility / Motion

### Check

1. Focus states remain visible.
2. Overlay close still works with ESC.
3. Focus returns to More button.
4. Reduced motion:
   - all core content visible
   - no heavy motion required
5. Decorative elements have `aria-hidden="true"`.

### CSS

Improve reduced motion if needed:

```css
@media (prefers-reduced-motion: reduce) {
    .ov-hero__ghost,
    .ov-stack__map,
    .ov-cta__halo {
        animation: none !important;
    }
}
```

## Phase 9 — Validation

### JavaScript Syntax

Run:

```bash
node --check app.js
```

### HTML Tag Balance

Run:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('index.html','utf8'); const stack=[]; const voidTags=new Set(['img','br','hr','source','meta','link','input','area','base','col','embed','param','track','wbr']); const re=/<\\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g; let m; while((m=re.exec(html))){const t=m[1].toLowerCase(); const c=m[0].startsWith('</'); const s=m[0].endsWith('/>')||voidTags.has(t); if(c){if(stack.at(-1)===t)stack.pop(); else {console.log('mismatch',t,stack.at(-1)); process.exit(1)}} else if(!s) stack.push(t)} console.log(stack.length?'unclosed '+stack.join(','):'HTML OK')"
```

### Manual Test Checklist

- Landing card remains centered.
- More button hover still readable.
- Portal open works.
- Portal close works.
- ESC closes overlay.
- Focus returns to More button.
- Section scroll works.
- Progress dots work.
- Mobile layout works at 390/480/768.
- Reduced motion shows all content.
- No horizontal overflow.
- Console has no JS errors.

## Implementation Order

1. Phase 1 — Reduce animation noise.
2. Phase 2 — Hero ghost kinetic phrase.
3. Phase 3 — About annotations.
4. Phase 4 — Project unique motifs.
5. Phase 5 — Stack system map.
6. Phase 6 — CTA final halo.
7. Phase 7 — responsive pass.
8. Phase 8 — accessibility / motion pass.
9. Phase 9 — validation.

## Success Criteria

The final overlay should feel:
- intentional
- premium
- technical
- memorable
- not noisy
- not generic
- clearly richer than landing

The landing should remain:
- simple
- calm
- fast
- readable
- centered

## Non-Goals

- No new dependencies.
- No framework.
- No build step.
- No backend/API.
- No contact form submission.
- No external scripts.
