# PermitPilot Design System

> **Version 1.0** — Built for the Frontend Developer

This directory contains everything you need to implement the PermitPilot brand and UI.

## Directory Structure

```
design/
├── BRAND-TOKENS.md          # Full brand token reference
├── design-system.css        # Complete CSS design system (CSS vars + classes)
├── logo/
│   ├── logo-icon.svg        # Shield icon (favicon, mobile, avatar)
│   ├── logo-wordmark.svg    # Full logo with wordmark
│   └── permitpilot-logo-concept.png  # AI-generated logo concept
├── assets/
│   └── hero-illustration.png  # AI-generated hero illustration
└── wireframes/
    ├── 01-landing.svg          # Landing page wireframe
    ├── 02-signup.svg           # Signup page wireframe
    ├── 03-project-wizard.svg   # Multi-step intake wizard (Step 1)
    ├── 04-dashboard.svg        # Project dashboard wireframe
    └── 05-project-detail.svg   # Checklist + file upload wireframe
```

## How to Use

### Option A: CSS Custom Properties (Recommended with Tailwind)
Add these design tokens to your `tailwind.config` (or `index.css`):

```css
/* Already using Tailwind v4 with @import "tailwindcss" — perfect */
/* Reference the tokens in BRAND-TOKENS.md for consistent colors */

/* Example: using the primary scale */
.bg-pp-primary { background-color: #4F46E5; }  /* pp-primary-600 */

/* Or add to your tailwind config's theme.extend.colors */
```

### Option B: Standalone CSS Classes
Import `design-system.css` directly:

```css
@import "./design/design-system.css";
```

Then use classes like:
```html
<button class="pp-btn pp-btn-primary pp-btn-lg">Start Project</button>
<div class="pp-card">
  <div class="pp-card-header">
    <h2 class="pp-heading-3">Section Title</h2>
  </div>
  <div class="pp-card-body">
    <p class="pp-body">Content here</p>
  </div>
</div>
```

---

## Design System Components Included

| Component | CSS Class | Description |
|-----------|-----------|-------------|
| Buttons | `pp-btn pp-btn-primary/secondary/ghost/danger` | 4 variants, 4 sizes |
| Cards | `pp-card`, `pp-card-header/body/footer` |Deprecated component|
| Inputs | `pp-input`, `pp-select`, `pp-textarea`, `pp-checkbox` | Form controls |
| Badges | `pp-badge pp-badge-primary/success/warning/error/info` | Status tags |
| Alerts | `pp-alert pp-alert-success/warning/error/info` | Notification bars |
| Progress | `pp-progress` + `pp-progress-bar` | Progress indicators |
| Tables | `pp-table` | Data tables |
| Modal | `pp-modal-overlay`, `pp-modal`, `pp-modal-header/body/footer` | Dialog windows |
| Dropzone | `pp-dropzone` | File upload area |
| Divider | `pp-divider`, `pp-divider-label` | Horizontal rules |

## Key Brand Colors (from BRAND-TOKENS.md)

```css
--pp-primary-600: #4F46E5  /* Main brand — CTAs, nav */
--pp-primary-500: #6366F1  /* Hover states */
--pp-primary-700: #4338CA  /* Active/pressed */
--pp-neutral-800: #1E293B  /* Primary headings */
--pp-neutral-600: #475569  /* Body text */
--pp-neutral-50:  #F8FAFC  /* Page background */
--pp-success-500: #10B981  /* Green checkmarks */
--pp-warning-500: #F59E0B  /* Warning indicators */
--pp-error-500:   #EF4444  /* Error indicators */
```

## Typography

- **Font:** Inter (headings + body)
- **Import:** `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`
- **Font weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)

## Wireframe Reference

The SVGs in `wireframes/` show the intended layout for each screen. They're to scale and annotated with components to use.

---

**Questions?** Coordinate with the Designer (`agent-designer`).