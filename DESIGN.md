# Design System — Color Palette

## Overview

Palet warna ini menggabungkan nuansa netral modern dengan aksen teal yang tenang dan oranye yang energik. Cocok untuk dashboard, aplikasi SaaS, sistem internal, maupun website modern.

---

## Color Tokens

| Token | Hex | Preview | Usage |
|---------|---------|---------|---------|
| `gray-50` | `#F5F5F5` | ⬜ | Background utama |
| `primary-500` | `#76ABAE` | 🟦 | Primary action, link, highlight |
| `neutral-900` | `#303841` | ⬛ | Text utama, navbar, footer |
| `accent-500` | `#FF5722` | 🟧 | CTA, alert, emphasis |

---

## Semantic Colors

### Background

```css
--background: #F5F5F5;
```

Digunakan untuk:

- Page background
- Card container
- Section wrapper

### Primary

```css
--primary: #76ABAE;
```

Digunakan untuk:

- Button primary
- Active menu
- Link
- Status information

### Neutral

```css
--neutral: #303841;
```

Digunakan untuk:

- Heading
- Body text
- Sidebar
- Navigation bar

### Accent

```css
--accent: #FF5722;
```

Digunakan untuk:

- Call-to-action
- Warning indicator
- Badge penting
- Hover state tertentu

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
