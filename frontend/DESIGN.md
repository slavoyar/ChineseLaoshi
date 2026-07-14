---
name: Chinese Laoshi
description: A focused Mandarin study tool where characters lead and chrome stays quiet.
colors:
  background: "#020817"
  foreground: "#f8fafc"
  card: "#020817"
  card-foreground: "#f8fafc"
  primary: "#f8fafc"
  primary-foreground: "#0f172a"
  secondary: "#1e293b"
  secondary-foreground: "#f8fafc"
  muted: "#1e293b"
  muted-foreground: "#94a3b8"
  accent: "#1e293b"
  accent-foreground: "#f8fafc"
  destructive: "#7f1d1d"
  destructive-foreground: "#f8fafc"
  border: "#1e293b"
  input: "#1e293b"
  ring: "#cbd5e1"
  progress-mid: "#4ade80"
  progress-high: "#22c55e"
  progress-label: "#16a34a"
  delete: "#ef4444"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
  micro:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "16px"
  full: "9999px"
spacing:
  tile: "96px"
  tile-sm: "104px"
  tile-gap: "8px"
  panel-padding: "20px"
  panel-padding-md: "40px"
  input-height: "40px"
  header-height: "80px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "{spacing.input-height}"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "{spacing.input-height}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px"
    size: "40px"
  input-default:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "{spacing.input-height}"
  tile-group:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "8px"
    size: "{spacing.tile}"
  tile-word:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "8px"
    size: "{spacing.tile}"
---

# Design System: Chinese Laoshi

## 1. Overview

**Creative North Star: "The Character Stage"**

Chinese Laoshi is a study tool, not a dashboard. The interface is a dark, quiet stage where Mandarin characters take center position and everything else — navigation, metadata, actions — stays in supporting roles. Built on shadcn/ui (slate base) with Tailwind CSS variables, the system favors familiar product patterns over decorative novelty: square tiles for vocabulary, bordered content panels, Lucide icons, and state-rich controls that feel trustworthy on phone, tablet, and desktop.

Dark mode is the default experience (`class="dark"` on `<html>`). Surfaces are flat and tonal; depth comes from border contrast and layered neutrals, not heavy shadows. Motion is brief (150–200 ms) and functional — hover reveals, dialog enter/exit, skeleton pulse — always gated behind `prefers-reduced-motion`.

The system explicitly rejects childish gamification, generic SaaS dashboard aesthetics applied to a learning tool, and cluttered interfaces that compete with the characters being studied.

**Key Characteristics:**

- **Characters first** — Chinese glyphs render at `text-2xl` on word tiles; English metadata stays micro-sized beneath.
- **Tile-native layout** — Groups and words share a 96–104 px square tile grid with consistent internal structure.
- **Restrained accent** — Primary (inverted light-on-dark) drives actions; green signals mastery progress only.
- **Task density without noise** — Content width capped (`md:w-9/12`, `xl:w-7/12`); panels use generous padding without nested cards.
- **Touch-ready targets** — Tiles, icon buttons (40 px), and header controls sized for finger input.

## 2. Colors

A cool slate-dark palette: near-black blue background, light foreground, and stepped neutral surfaces. One semantic green family marks learning progress; red is reserved for destructive actions and delete affordances.

### Primary

- **Stage Light** (#f8fafc / hsl(210 40% 98%)): Primary buttons, focus-adjacent highlights, and the inverted accent in dark mode. Used for committed actions (Create, Delete confirm) — not decoration.
- **Stage Ink** (#0f172a / hsl(222.2 47.4% 11.2%)): Text on primary-filled controls.

### Secondary (optional; omit if the project has only one accent)

- **Panel Slate** (#1e293b / hsl(217.2 32.6% 17.5%)): Tile backgrounds, secondary buttons, muted surfaces, borders, and inputs. The workhorse neutral layer for interactive tiles and hover states (`hover:bg-accent` resolves here).

### Tertiary (optional)

- **Mastery Green** (#4ade80 mid, #22c55e high, #16a34a label): Progress borders, divider lines, and percent labels on word tiles when recall exceeds 50%. Never used for generic success toasts or decorative accents.

### Neutral

- **Midnight Canvas** (#020817 / hsl(222.2 84% 4.9%)): Page background, card shell, dialog surface.
- **Soft Ink** (#f8fafc): Primary body text, tile character glyphs, headings.
- **Supporting Gray** (#94a3b8 / hsl(215 20.2% 65.1%)): Secondary copy — transcriptions, word counts, placeholders, back links. Must remain readable on secondary surfaces (≥4.5:1 against #1e293b).
- **Focus Ring** (#cbd5e1 / hsl(212.7 26.8% 83.9%)): 2 px focus-visible ring on interactive elements.
- **Danger Deep** (#7f1d1d / hsl(0 62.8% 30.6%)): Destructive button fill; tile delete uses brighter red (#ef4444) at icon level for scannability.

### Named Rules (optional, powerful)

**The Character Spotlight Rule.** Primary and green accents combined occupy ≤15% of any study screen. If color is everywhere, characters stop feeling like the hero.

**The Progress Green Rule.** Green appears only on word-tile mastery indicators (border, divider line, percent label) and inline save confirmations. It never decorates navigation, headers, or empty states.

## 3. Typography

**Display Font:** System UI stack (`ui-sans-serif, system-ui, sans-serif`)
**Body Font:** System UI stack (same family throughout)
**Label/Mono Font:** None — single-family product UI

**Character:** Clean, familiar, zero friction. No display/body pairing; hierarchy is size and weight, not font contrast. Chinese characters inherit the same stack and rely on size (`text-2xl`) for prominence.

### Hierarchy

- **Display** (medium, 1.5rem / 24px, line-height 1): Chinese characters on word tiles; the visual anchor of each tile.
- **Headline** (semibold, 1.125rem / 18px, line-height 1, tracking -0.025em): Dialog and alert titles (`DialogTitle`, `AlertDialogTitle`).
- **Title** (regular–bold, 1.5rem / 24px, line-height 1.25): Page and section headings — app name in header (`font-bold`), "Groups", editable group names.
- **Body** (regular, 0.875rem / 14px, line-height 1.5): Buttons, inputs, labels, descriptions, back links. Default UI reading size.
- **Label** (medium, 0.75rem / 12px, line-height 1.25): Tile translations, group names, form field labels.
- **Micro** (medium, 0.625rem / 10px, line-height 1.25): Transcriptions, word counts, create-tile captions. Use sparingly; never for primary content.

### Named Rules (optional)

**The One Voice Rule.** A single sans family carries every role. Display fonts in buttons, labels, or data tables are prohibited.

**The Character Scale Rule.** Chinese glyphs on tiles must be at least 1.5rem. Supporting Latin/Cyrillic metadata stays at micro or label sizes beneath — never the same size as the character.

## 4. Elevation

Flat-by-default with tonal layering. The app does not use ambient card shadows on content surfaces; depth is communicated through `border` (#1e293b), `bg-secondary` tiles on `bg-card` panels, and occasional `shadow-lg` on modal overlays only.

Dialogs and alert dialogs (`DialogContent`, `AlertDialogContent`) use `shadow-lg` plus an 80% black scrim (`bg-black/80`) to lift above the stage. Hover states shift background color (`hover:bg-accent`, `hover:bg-secondary/80`) rather than raising elements. Word tiles add a 2 px top/side border tint for progress — structural color, not shadow.

### Shadow Vocabulary (if applicable)

- **Modal lift** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` via Tailwind `shadow-lg`): Dialogs and alert dialogs only.
- **Icon drop** (`filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))`): Delete icon on tile hover for legibility against tile backgrounds.

### Named Rules (optional)

**The Flat Stage Rule.** Surfaces at rest have no shadow. Elevation appears only as a modal response — never on tiles, list rows, or content panels.

## 5. Components

Product UI built on shadcn/ui + Radix primitives. Lucide icons at 16 px (`h-4 w-4`) in controls, 24–28 px in tiles.

### Buttons

- **Shape:** Gently rounded (6px / `rounded-md`), inline-flex, gap-2 for icon+label.
- **Primary:** Stage Light fill, Stage Ink text, h-10 (40px), px-4. Hover: 90% opacity. Disabled: 50% opacity, no pointer events.
- **Hover / Focus:** `transition-colors`; focus-visible ring 2px `{ring}` with 2px offset. No transform lift.
- **Outline:** 1px `{input}` border, background fill, hover accent surface.
- **Secondary:** Panel Slate fill, hover 80% opacity.
- **Ghost:** No fill; hover accent. Used for icon actions (edit, delete reveal).
- **Destructive:** Danger Deep fill for irreversible confirm actions.
- **Link:** Primary-colored underline on hover.

### Chips (if used)

Not used in current surfaces. Prefer tile metadata text at micro/label sizes instead.

### Cards / Containers

- **Corner Style:** Content panels use generous 16px radius (`rounded-2xl`); tiles use 8px (`rounded-lg`).
- **Background:** `bg-card` panels with 1px `border`; tiles use `bg-secondary`.
- **Shadow Strategy:** None on panels/tiles; see Elevation for modals.
- **Border:** 1px `{border}` default; create tiles use 2px dashed `{muted-foreground}` at 40% opacity.
- **Internal Padding:** Panels p-5 (20px), md:p-10 (40px); tiles p-2 (8px).
- **Content width:** Centered `m-auto`, constrained to 75% at md and ~58% at xl breakpoints.

### Inputs / Fields

- **Style:** h-10, 1px `{input}` border, `{background}` fill, 6px radius, px-3. Placeholder `{muted-foreground}`.
- **Focus:** 2px ring `{ring}`, ring-offset on `{background}`.
- **Error / Disabled:** Disabled inputs at 50% opacity; destructive styling reserved for confirm flows, not inline field errors yet.
- **Inline edit:** Group title uses borderless transparent input with bottom border `primary/40`, expanding to full primary on focus.

### Navigation

- **Header:** Fixed 80px height, bottom border, `bg-card`. App name (中国老师) as bold 1.5rem button left; user chip with circular primary avatar (32px icon wrapper) right.
- **Back links:** `text-sm text-muted-foreground` with ArrowLeft icon; hover foreground. Focus ring consistent with buttons.
- **Sign out:** Ghost icon button, muted default, accent hover.

### Tile Grid (signature pattern)

- **Grid:** `flex flex-wrap justify-center gap-2` (8px, 10px at sm).
- **Tile size:** `aspect-square w-24` (96px), `sm:w-[104px]`. Shared via `tileItemClassName`.
- **Group tile:** Secondary fill, centered Lucide group icon (28px), name at label size, word count at micro. Entire tile is clickable; delete button reveals on hover/focus-within.
- **Word tile:** Secondary fill, character at display size centered, transcription micro + translation label below, progress bar footer (0.5px lines + centered percent). Top/side border color reflects mastery (see Progress Green).
- **Create tile:** Dashed 2px border, secondary/50 background, Plus icon 24px, micro caption ("Create group" / "Add word"). Hover: solid secondary, primary/50 border tint.
- **Delete affordance:** Ghost icon button, absolute top-right, red-500, opacity 0 → 100 on group/card hover or focus-within. 150ms opacity transition; `motion-reduce:transition-none`.

### Dialogs

- **Overlay:** Fixed full-screen, z-50, black/80, fade in/out 200ms.
- **Content:** Centered, max-w-lg, border, p-6, sm:rounded-lg, zoom-in-95 entrance.
- **Structure:** Header (title left on sm+), body grid gap-4, footer reverse-column on mobile.
- **Close:** Absolute top-right X, opacity 70 → 100 hover.

### Skeleton / Loading

- **Tile skeleton:** Matches tile dimensions — secondary bordered shell, pulse rectangles for icon and text lines.
- **Pulse:** `animate-pulse` on `bg-muted`; disabled under `motion-reduce`.
- **Never** center-page spinners for list content; skeleton tiles preserve layout stability.

## 6. Do's and Don'ts

### Do:

- **Do** keep Chinese characters at `text-2xl` or larger on study surfaces; metadata stays at `text-xs` / `text-[10px]`.
- **Do** use the shared tile grid constants (`tileGridClassName`, `tileItemClassName`) for any new collection UI.
- **Do** apply green only through `getProgressStyles()` semantics for word mastery — border, line, and label together.
- **Do** reveal destructive actions on hover/focus-within of the parent tile, not persistently visible.
- **Do** honor `prefers-reduced-motion` on every transition and skeleton animation.
- **Do** use skeleton tile grids matching final layout while groups or words load.
- **Do** keep primary actions to one per dialog footer; Cancel is always outline variant.

### Don't:

- **Don't** use childish gamification — cartoon mascots, excessive badges, Duolingo-style streak guilt, or babyish color palettes.
- **Don't** apply generic SaaS dashboard aesthetics to study screens — no hero metrics, no gradient accents, no decorative chart colors on non-analytics views.
- **Don't** clutter interfaces so chrome competes with characters — avoid nested cards, redundant eyebrows, or side-stripe borders on tiles.
- **Don't** use gradient text, glassmorphism, or heavy shadows on tiles and panels.
- **Don't** show delete buttons at full opacity by default on touch lists — use the reveal pattern.
- **Don't** introduce a second accent color family beyond green-for-progress and red-for-destructive.
- **Don't** use display or serif fonts for UI labels, buttons, or data.
- **Don't** gate content visibility on entrance animations — default state must be fully readable without JS-driven reveals.
