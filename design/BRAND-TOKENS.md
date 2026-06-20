# PermitPilot Brand Design Tokens

> **Version:** 1.0
> **Status:** Ratified Design System
> **Last Updated:** 2026-06-17

---

## 1. Logo & Brand Mark

### Primary Logo (Icon + Wordmark)
- **File:** `logo/logo-wordmark.svg`
- **Icon-only:** `logo/logo-icon.svg` (use for favicon, mobile icon, avatar)
- **Minimum clear space:** 16px around the icon-mark on all sides
- **Minimum size:** 24px icon-only, 120px wordmark

### Logo Usage
- **Light background:** Full color logo (indigo + slate)
- **Dark background:** White/light version of the icon, white wordmark
- **Do not:** Recolor, add effects, rotate, or distort the logo

---

## 2. Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--pp-primary-50` | `#EEF2FF` | Light backgrounds, hover states |
| `--pp-primary-100` | `#E0E7FF` | Tag backgrounds, table highlights |
| `--pp-primary-200` | `#C7D2FE` | Borders, subtle accents |
| `--pp-primary-300` | `#A5B4FC` | Hover borders, progress tracks |
| `--pp-primary-400` | `#818CF8` | Links, secondary actions |
| `--pp-primary-500` | `#6366F1` | Primary buttons, active states |
| `--pp-primary-600` | `#4F46E5` | **Primary brand color** — CTAs, nav |
| `--pp-primary-700` | `#4338CA` | Button hover, link hover |
| `--pp-primary-800` | `#3730A3` | Active/pressed states |
| `--pp-primary-900` | `#312E81` | Deepest brand tone |

### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--pp-accent-blue` | `#3B82F6` | Info badges, secondary CTAs |
| `--pp-accent-teal` | `#0D9488` | Supporting highlights |
| `--pp-accent-amber` | `#D97706` | Warning badges, gold accents |
| `--pp-accent-purple` | `#7C3AED` | Pro/Contractor tier headers |

### Neutral / Slate Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `--pp-neutral-50` | `#F8FAFC` | Page backgrounds |
| `--pp-neutral-100` | `#F1F5F9` | Card backgrounds, input backgrounds |
| `--pp-neutral-200` | `#E2E8F0` | Borders, dividers |
| `--pp-neutral-300` | `#CBD5E1` | Disabled borders |
| `--pp-neutral-400` | `#94A3B8` | Placeholder text |
| `--pp-neutral-500` | `#64748B` | Secondary text |
| `--pp-neutral-600` | `#475569` | Body text |
| `--pp-neutral-700` | `#334155` | Heading text |
| `--pp-neutral-800` | `#1E293B` | Primary heading, dark text |
| `--pp-neutral-900` | `#0F172A` | Strongest text, hero headings |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--pp-success-50` | `#ECFDF5` | Success alert bg |
| `--pp-success-500` | `#10B981` | Success indicators, checkmarks |
| `--pp-success-800` | `#065F46` | Success alert text |
| `--pp-warning-50` | `#FFFBEB` | Warning alert bg |
| `--pp-warning-500` | `#F59E0B` | Warning indicators |
| `--pp-warning-800` | `#92400E` | Warning alert text |
| `--pp-error-50` | `#FEF2F2` | Error alert bg |
| `--pp-error-500` | `#EF4444` | Error indicators |
| `--pp-error-800` | `#991B1B` | Error alert text |
| `--pp-info-50` | `#EFF6FF` | Info alert bg |
| `--pp-info-500` | `#3B82F6` | Info indicators |

---

## 3. Typography

### Font Family
- **Primary:** Inter (headings + body)
  - Import: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`
- **Monospace:** JetBrains Mono or `SF Mono` for code references

### Type Scale

| Token | Size | Weight | Line Height | Used For |
|-------|------|--------|-------------|----------|
| `--pp-text-xs` | 0.75rem (12px) | 500 / 600 / 700 | 1.4 | Captions, tags, legal |
| `--pp-text-sm` | 0.875rem (14px) | 500 / 600 | 1.5 | Body text, nav links |
| `--pp-text-base` | 1rem (16px) | 400 / 500 | 1.6 | Paragraphs, form labels |
| `--pp-text-lg` | 1.125rem (18px) | 500 / 600 | 1.6 | Larger body, card subtitles |
| `--pp-text-xl` | 1.25rem (20px) | 600 / 700 | 1.4 | Section headers |
| `--pp-text-2xl` | 1.5rem (24px) | 700 / 800 | 1.3 | Card titles |
| `--pp-text-3xl` | 1.875rem (30px) | 800 | 1.25 | Page headings |
| `--pp-text-4xl` | 2.25rem (36px) | 800 / 900 | 1.15 | Hero headings |
| `--pp-text-5xl` | 3rem (48px) | 900 | 1.1 | Large hero |
| `--pp-text-6xl` | 3.75rem (60px) | 900 | 1.05 | Landing hero |

### Font Weights
- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700
- **Extrabold:** 800
- **Black:** 900

---

## 4. Spacing System (4px grid)

| Token | Rem | Px |
|-------|-----|----|
| `--pp-space-1` | 0.25rem | 4px |
| `--pp-space-2` | 0.5rem | 8px |
| `--pp-space-3` | 0.75rem | 12px |
| `--pp-space-4` | 1rem | 16px |
| `--pp-space-5` | 1.25rem | 20px |
| `--pp-space-6` | 1.5rem | 24px |
| `--pp-space-8` | 2rem | 32px |
| `--pp-space-10` | 2.5rem | 40px |
| `--pp-space-12` | 3rem | 48px |
| `--pp-space-16` | 4rem | 64px |
| `--pp-space-20` | 5rem | 80px |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--pp-radius-sm` | 0.375rem (6px) | Small buttons, tags |
| `--pp-radius-md` | 0.5rem (8px) | Inputs, cards |
| `--pp-radius-lg` | 0.75rem (12px) | Modals, large cards |
| `--pp-radius-xl` | 1rem (16px) | Featured cards |
| `--pp-radius-2xl` | 1.5rem (24px) | Hero containers |
| `--pp-radius-full` | 9999px | Pills, badges |

---

## 6. Shadows

| Token | Value |
|-------|-------|
| `--pp-shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--pp-shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` |
| `--pp-shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` |
| `--pp-shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1)` |
| `--pp-shadow-glow` | `0 0 20px rgb(79 70 229 / 0.15)` |

---

## 7. Animation

| Token | Value |
|-------|-------|
| `--pp-transition-fast` | 150ms ease |
| `--pp-transition-base` | 200ms ease |
| `--pp-transition-slow` | 300ms ease |
| `--pp-transition-spring` | 300ms cubic-bezier(0.34, 1.56, 0.64, 1) |