# Design System — Color Palette

> **Note:** This document keeps the alternative teal/orange palette for reference.
> The palette currently active in `style.css` is **Dark + Lime** (see the
> "Active Palette" section below). Visual decision: a minimal light landing with
> a dark, electric-lime overlay for contrast.

## Active Palette (in use)

| Token | Hex | Usage |
|---------|---------|--------|
| `--bg` | `#fafafa` | Landing background |
| `--card` | `#ffffff` | Landing card surface |
| `--fg` | `#0a0a0a` | Landing text |
| `--muted` | `#6b6b6b` | Landing secondary text |
| `--ov-bg` | `#0a0a0a` | Overlay background |
| `--ov-fg` | `#f5f5f5` | Overlay text |
| `--ov-muted` | `#888` | Overlay secondary text |
| `--ov-accent` | `#c8ff00` | Lime accent (CTA, active dot, focus) |
| `--ov-accent-2` | `#ff5b3a` | Orange accent (decoration, gradients) |
| `--ov-line` | `rgba(255,255,255,0.08)` | Hairline dividers |

Used ratio:
- 55% → dark overlay
- 25% → light landing
- 12% → lime accent
- 8% → orange accent

---

## Alt Palette (teal/orange — legacy reference)

This palette combines modern neutrals with calm teal and energetic orange accents.
It fits dashboards, SaaS apps, internal systems, and modern websites.

---

## Color Tokens

| Token | Hex | Preview | Usage |
|---------|---------|---------|---------|
| `gray-50` | `#F5F5F5` | ⬜ | Main background |
| `primary-500` | `#76ABAE` | 🟦 | Primary action, link, highlight |
| `neutral-900` | `#303841` | ⬛ | Main text, navbar, footer |
| `accent-500` | `#FF5722` | 🟧 | CTA, alert, emphasis |

---

## Semantic Colors

### Background

```css
--background: #F5F5F5;
```

Used for:

- Page background
- Card container
- Section wrapper

### Primary

```css
--primary: #76ABAE;
```

Used for:

- Button primary
- Active menu
- Link
- Status information

### Neutral

```css
--neutral: #303841;
```

Used for:

- Heading
- Body text
- Sidebar
- Navigation bar

### Accent

```css
--accent: #FF5722;
```

Used for:

- Call-to-action
- Warning indicator
- Important badges
- Specific hover states

---

## CSS Variables

```css
:root {
  --color-background: #F5F5F5;
  --color-primary: #76ABAE;
  --color-neutral: #303841;
  --color-accent: #FF5722;

  --text-primary: #303841;
  --text-secondary: #76ABAE;
  --surface: #FFFFFF;
}
```

---

## Recommended Usage Ratio

```text
60% → #F5F5F5 (Background)
25% → #303841 (Text & Structure)
10% → #76ABAE (Primary Elements)
5%  → #FF5722 (Accent & CTA)
```

---

## Button Examples

### Primary Button

```css
background: #76ABAE;
color: white;
```

### Secondary Button

```css
background: #303841;
color: white;
```

### CTA Button

```css
background: #FF5722;
color: white;
```

---

## Accessibility

| Combination | Contrast |
|-------------|-----------|
| `#303841` on `#F5F5F5` | Excellent ✅ |
| `#FFFFFF` on `#303841` | Excellent ✅ |
| `#FFFFFF` on `#76ABAE` | Good ✅ |
| `#FFFFFF` on `#FF5722` | Good ✅ |

---

## Brand Personality

- **Modern**
- **Professional**
- **Clean**
- **Trustworthy**
- **Energetic**
- **Tech-Friendly**

---

## Palette Preview

```text
#F5F5F5  ██████████████████████
#76ABAE  ██████████████████████
#303841  ██████████████████████
#FF5722  ██████████████████████
```
