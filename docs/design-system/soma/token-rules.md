# Soma — token rules

## Color

**Collections:** Primitives (single mode) → Semantic (Light/Dark). Semantic always aliases to Primitive, never hardcoded hex.

**Known ramp inconsistency (documented):** "Base" shade varies by ramp — blue `/800`, grey `/500`, others `/700`.

### Primitive ramp contrast (2026-09-01)

- Steps `/100`–`/900` should descend evenly in relative luminance (shared ladder ≈0.92→0.84→0.72→0.56→0.40→0.26→0.15→0.08→0.03). No skinny mid-ramp cliffs (esp. green/yellow/teal 400→500) and no flat 500→600. Chromatic `/400`–`/700` use cleaner, more vivid mid-ramp chroma for Care App — professional, not neon. Soft `/100`–`/300` unchanged. **`/800` sits clearly darker than `/700`** on the shared ladder (~0.08 Y, AAA ~8.5–10 vs white) — not a near twin of the base. **`blue/800`** brand hex is locked (`#002380`).
- **`/100` parity:** all ramps share a similar light tint weight (≈AAA 19–20 vs black) — no nearly-white outliers next to visibly tinted peers.
- **Shared mid chroma ladder (`/400`–`/700`):** purple · orange · blue · teal stay on one OKLab chroma curve — `/400` ≈0.098 · `/500` ≈0.148 · **`/600` apex ≈0.188** · `/700` ≈0.168. **Status ramps** (green · yellow · red) sit a step more chromatic in `/300`–`/500` so success / warning / danger read clearly; **`/500`–`/700` sit slightly brighter** (lemon/status vivid). **`blue/800` stays brand `#002380`**. **Blue** **`/400` `#7EB6FF`** · **`/500` `#4B95FF`** · **`/600` `#2B78F5`** · **`/700` `#1F52C4`**. **Teal** **`/400` `#5ED2D2`** · **`/500` `#2BBFBF`** · **`/600` `#00A5A5`** · **`/700` `#1F7C7C`** · **`/800` `#0E5555`**. **Green** locks hue ≈147°; **`/400` `#6EDB82`**, **`/500` `#3ACC5C`** interpolate to **`/600` `#16B04A`** · **`/700` `#0E8640`** · **`/800` `#045623`**. **Yellow lights** `/100` **`#FDF9E1`** · `/200` **`#F9F0C3`** — butter pastels for Soft fills. **Yellow** `/300` **`#F4E392`** · `/400` **`#F0D033`** · `/500` **`#E8C000`** · `/600` **`#D0A800`** · `/700` **`#A3890B`** · `/800` **`#75600A`** — vivid gold `/700` (status ink); `/800` white-on-color AA. **Orange** **`/400` `#FFB65E`** · **`/500` `#FF9B2E`** · **`/600` `#E87A00`** · **`/700` `#B85A00`** · **`/800` `#8A4016`**. **Red lights** stay rose; **`/300`–`/500`** climb scarlet (`#FFCBCA` · `#FF9B96` · `#FF6F68`); **`/600` `#F24646`** · **`/700` `#D13238`** · **`/800` `#A4242A`**. **Purple** **`/400` `#C9A8FA`** · **`/500` `#B57CF5`** · **`/600` `#9B58E6`** · **`/700` `#7D3FC0`** · **`/800` `#592C8A`**. **`/800` deepens toward shared ladder ~0.08 Y** (2026-09-04) so base vs deep reads as a real step; orange/red `/800` unchanged.
- **`/700` = deeper base** (AA ≥4.5 vs white for chromatic bases; purple–red targets ≈5.3–5.5). Slightly less chroma than `/600`. Grey follows its own neutral scale. **Yellow exception:** `/700` stays vivid gold for status ink (Soft Alert icon/accent) and may fail white-text AA — use **`/800`** for white-on-warning.
- Contrast labels on Colors: best ratio — dark ink on light swatches, white on dark (crossover when white wins).
- Mid steps may fail white text — expected for high-chroma yellow/orange; pair with dark foreground or use `/700+` for on-color text (**yellow:** `/800`).
- **Colors page labels:** under-swatch name / hex / rgb always use the doc greys (navy · mid · muted) — never bind them to white/black from the swatch. Only the on-swatch contrast chip flips ink.

### Warm ramp hue separation (2026-09-01)

Visually distinct hues — do not share coral/terracotta mid-tones:

| Ramp | Role | Hue intent | Apex `/600` | Base `/700` |
|---|---|---|---|---|
| `yellow` | Warning | Soft lemon → gold → umber | `#D0A800` | `#A3890B` |
| `orange` | Warm accent | Apricot → tangerine → rust | `#E87A00` | `#B85A00` |
| `red` | Danger | Rose → scarlet → crimson | `#F24646` | `#D13238` |
| `purple` | Accent | Lilac → violet → plum | `#9B58E6` | `#7D3FC0` |
| `green` | Success | Mint → foliage → forest | `#16B04A` | `#0E8640` |

- **Yellow** locks lemon/gold (~50–52°) — butter lights, gold mids, umber darks; never olive/ochre that reads as tangerine. `/600`–`/700` stay below orange/red chroma so warning does not collide with accent.
- **Orange** locks tangerine (~32–35°) — apricot lights, amber mids, rust darks.
- **Red** locks rose/scarlet (~347–358°) — rose lights (`/100`–`/200`), scarlet from `/300`, true red mids (`/500`–`/700`) — never candy pink or coral that reads as orange.
- **Yellow** is warning semantics (`surface/warning/*`, `border/warning/*`). Orange stays a warm primitive — not a second warning ramp.

### Utility transparent ramps (2026-08-31)

- **Ramps:** `coolDarkTransparent` · `coolLightTransparent` — scrims, overlays, elevation shadow color.
- **Base colors:** `#101D38` (coolDark) · `#E0E8F5` (coolLight).
- **Steps `/10`–`/90`:** grey-parity weights, not literal opacity percentages. Each step is calibrated so that when composited — coolDark over white, coolLight over `grey/900` — it visually matches `grey/100`–`grey/900`.
- **Alphas (both ramps):** `/10` 0.05 · `/20` 0.08 · `/30` 0.18 · `/40` 0.41 · `/50` 0.63 · `/60` 0.76 · `/70` 0.85 · `/80` 0.96 · `/90` 1.00.
- **Elevation:** `shadow.*` color binds `coolDarkTransparent`; lowering `/10`–`/20` lightens shadow tint (was heavier at literal 10%–20%).

### Brand and danger transparent primitives (2026-09-04)

- **Ramps:** `brandDarkTransparent/20` · `brandLightTransparent/20` · `brandActiveTransparent/20` · `dangerDarkTransparent/20` · `dangerLightTransparent/20` · `dangerActiveTransparent/20` — Primitives collection.
- **Base RGB:** `blue/800` · `blue/400` · `blue/600` · `red/700` · `red/400` · `red/600` respectively.
- **`/20` step:** **literal 20% alpha** on that base — not grey-parity weights like `coolDarkTransparent` / `coolLightTransparent`. Half of prior `/40` (0.40 → 0.20) so disabled reads lighter beside enabled CTAs.
- **Purpose:** light-mode faded brand/danger ink (`brandDark*` · `dangerDark*`); dark-mode faded brand/danger ink (`brandLight*` · `dangerLight*`); dark-mode contained disabled fills (`brandActive*` · `dangerActive*`).
- **Semantic aliases (no opacity on semantic):**
  - `action/primary/disabled` — Light `brandDarkTransparent/20`; Dark `brandActiveTransparent/20`
  - `action/danger/disabled` — Light `dangerDarkTransparent/20`; Dark `dangerActiveTransparent/20`

**Changed 2026-09-14:** Disabled transparent steps renamed `/40` → `/20` (literal 20% alpha — half of prior 40%).

### Dark-mode foreground pattern (brand, danger, success, accent)

| State | Text/icon on colored fills |
|---|---|
| Default / hover / pressed | grey/900 or black |

Pressed fills are lighter than hover in dark mode, so foreground stays dark — same as rest/hover. Do not switch pressed labels to white.

Also applied: `text.onWarning`, `text.onInfo`, `icon.on*` families.

### Dark-mode contained action ramp

Rest → hover → pressed **lightens**, matching `action/primary` (`blue/600` → `/500` → `/400`):

| Token | Dark pressed |
|---|---|
| `action/secondBrand/pressed` | `purple/400` |
| `action/danger/pressed` | `red/400` |
| `action/success/pressed` | `green/400` |

Light mode still darkens rest → hover → pressed.

### Presence — `status/online` (2026-08-31)

Own role — do not substitute `action/success` / `icon/success`. One ramp lighter than prior for small-dot visibility:

| Mode | Alias |
|---|---|
| Light | `green/600` (was `action/success` → `green/700`) |
| Dark | `green/300` (was `green/400`) |

### Action ghost fills (2026-08-31)

Outlined and text Button hover/pressed — not contained.

| Token | Light | Dark |
|---|---|---|
| `action/ghost/hover` | `coolDarkTransparent/10` | `coolLightTransparent/10` |
| `action/ghost/pressed` | `coolDarkTransparent/20` | `coolLightTransparent/20` |

### Invisible-fill rule

Never bind a dark-mode fill to a ramp's `/900` if it must read as a distinct surface against `grey/900`. Safe floor: `/800` or lighter.

**Fixed examples:** `surface.info.subtle` `/900` → `/800`; `surface.accent` / `action.secondBrand` purple steps adjusted.

### Exception — Soft Badge visual play (2026-08-24)

Not an accessibility fix. Soft Badge dark fills (via **`surface/{tone}/soft`**) and the shared `border.*.subtle` aliases are a **visual** exception to the `/800` floor. Revisit before treating these as contrast-compliant.

**Changed 2026-09-09:** Soft Badge chromatic fills bind **`surface/{tone}/soft`** (`/100` light · `/900` dark), not **`surface/{tone}/subtle`**. Neutral and Disabled Soft stay on **`surface/subtle`**. **`surface/*/subtle`** aliases unchanged for other consumers.

**Brand surface ladder (light mode):**

| Token | Light | Use |
|---|---|---|
| `surface/brand/soft` | `blue/100` | Soft badges (chromatic), chat bubbles, AI summary body, soft brand panels, **Alert Soft** |
| `surface/brand/subtle` | `blue/200` | Tinted rows, stronger brand fill |

**Alert Soft surfaces (light `/100`, dark `/900`):** `surface/brand/soft` · `surface/success/soft` · `surface/warning/soft` · `surface/danger/soft` · `surface/accent/soft` — alias `green/100` · `yellow/100` · `red/100` · `purple/100` (light) and tone `/900` (dark). Use **`/soft`**, not `surface/{tone}/subtle` (`/200`), for Alert and **Soft Badge** chromatic fills. **Alert Soft stroke:** bind **`border/{tone}/subtle`** (light `/300`; see Soft borders table) — not grey **`border/subtle`**.

`surface/*/soft` aliases tone `/900` in dark (Soft Badge visual exception). **`surface/*/subtle`** dark aliases below are unchanged — tinted rows, View switcher Soft track, etc. **`surface/ai/gradient/*`** stays AI-only for sparkle-card gradients; do not use for generic fills.

**Dark fills** (`surface/*/soft`; light `/100`) — Soft Badge chromatic + Alert Soft:

| Token | Dark |
|---|---|
| `surface/brand/soft` | `blue/900` |
| `surface/accent/soft` | `purple/900` |
| `surface/success/soft` | `green/900` |
| `surface/warning/soft` | `yellow/900` |
| `surface/danger/soft` | `red/900` |

**Dark fills** (`surface/*/subtle`; light stays `/200`):

| Token | Dark |
|---|---|
| `surface/brand/subtle` | `blue/900` |
| `surface/accent/subtle` | `purple/900` |
| `surface/success/subtle` | `green/900` |
| `surface/warning/subtle` | `yellow/900` |
| `surface/danger/subtle` | `red/900` |

**Soft borders** (`border/{tone}/subtle`):

| Tone | Light | Dark |
|---|---|---|
| Neutral | `grey/300` | `grey/700` |
| Success | `green/300` | `green/800` |
| Warning | `yellow/300` | `yellow/800` |
| Danger | `red/300` | `red/800` |
| Brand | `blue/300` | `blue/700` |
| Accent | `purple/300` | `purple/700` |

Do not bind Soft Badge strokes to primitives. Bind `border/{tone}/subtle`. These aliases also tint any other consumer of the same tokens.

### Intentionally correct

- `surface.overlayDark` — higher opacity in dark mode is correct for scrims.
- `text.tertiary.onBrand` (dark) — deliberately flagged, not fixed; AA-large-only or drop use.

### Primary action (aligns with Nova)

- Light: `blue/800`
- Dark: `blue/600`
- Do not use `blue/700` for primary action (stale).

### Brand and danger text/icon (2026-09-04)

**`text/brand`** — light `blue/800` · dark `blue/400`. Brand emphasis on default surfaces; outlined and text Button labels; Alert secondary (text Button).

**`text/brand/subtle`** — lighter brand ink where full emphasis is too strong (unchanged).

**`text/brand/disabled`** — light `brandDarkTransparent/20`; dark `brandLightTransparent/20`. Disabled must read as a **faded brand shade**, not a mid-ramp sky blue (`/300`–`/500`). Mid-ramp blues shift chroma/hue away from navy. Outlined and text Button disabled labels; Colors map row `text.brand.disabled`.

**Danger parallels:** `text/danger/subtle`; **`text/danger/disabled`** — light `dangerDarkTransparent/20`; dark `dangerLightTransparent/20`. **`icon/brand/disabled`** and **`icon/danger/disabled`** alias the matching text tokens.

**Icon tone aliases (light, 2026-09-04):** `icon/brand` → `blue/800` (navy — matches `text/brand` / outlined Brand buttons); `icon/success` → `green/600`; `icon/warning` → `yellow/700`; `icon/danger` → `red/600` — status mids for Soft Alert icons; brand stays navy.

**Changed 2026-09-14:** **`yellow/700`** `#A3890B` · **`/800`** `#75600A`; Light **`icon/warning`** → `yellow/700` (vivid status ink; white-on-warning uses `/800`).

**Button disabled** — **Contained** — fill `action/primary/disabled` or `action/danger/disabled` (no stroke); label/icon **`text/onBrand`** / **`icon/onBrand`** (or onDanger) — solid white, not faded ink. Fill is brand/danger @ **20%**. **Outlined and text** — faded `text/{tone}/disabled` / `icon/{tone}/disabled` via transparent ramps; outlined stroke binds disabled foreground; text (ghost) disabled has **no fill**. Do not use shared grey disabled on Buttons. Chips, Badges, and other controls still use cross-tone disabled grey.

## Spacing

**Primitives:** `space0`–`space96` (0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96).

**Semantic roles:** `inset.*`, `stack.*`, `inline.*`, `section.*` — confirm exact px in Figma before binding; not all steps enumerated here.

## Typography

- Font: **Figtree**. Root: **16px** (`htmlFontSize`). `fontSize/base = 14` is MUI scale factor — both intentional.
- **body1:** 14 / **20** (`lineHeight/20`), **Regular 400** — prose only. Do not use `lineHeight/22` on body1. Interactive list labels (Select / Menu) use **subtitle2** (Medium 500), not body1.
- **body2:** 12 / 18, **Regular 400** — compact multi-line prose.
- **caption:** 12 / 16 (`lineHeight/16`), **Regular 400**, 0.75rem — dense meta / helpers / tip lines. Prefer over body2 when line-height should stay tight. Bind the **caption** text style (not `fontSize/12` alone).
- `fontWeight/light (300)` removed.
- **h1:** SemiBold (600), not Medium — corrected for hierarchy.
- Line-height is a **separate scale** from Spacing; vertical rhythm uses `stack.*` outside the text box.
- `overline` (11px) — label-only exception to 12px reading floor.
- Non-tokenizable in Figma: tabular figures (Display), uppercase on overline — CSS implementation notes.

## Elevation

- Tokens: `shadow.xs` through `shadow.3xl`, plus `shadow.inner`, `shadow.soft`. Default: `shadow.md`.
- **Alerts:** bind **`shadow.lg`** on the root (`clipsContent = true`; shadow still paints outside). **Soft** — **`border/{tone}/subtle`**; **Outlined** — grey **`border/subtle`**.
- Shadow **color** binds to `coolDarkTransparent` ramp (grey-parity `/10`–`/90`; see Color → Utility transparent ramps); blur/offset identical across modes.
- Dark mode: ~2-step higher opacity on same ramp (cap `/90`).
- Known weak point: shadow-only dark elevation may still read subtle — next step is surface-tint overlay, not more opacity.

## Radius

| Token | px |
|---|---|
| radius.none | 0 |
| radius.xxs | 2 |
| radius.xs | 4 |
| radius.sm | 6 |
| radius.md | 8 |
| radius.lg | 10 |
| radius.xl | 12 |
| radius.2xl | 16 |
| radius.3xl | 20 |
| radius.4xl | 24 |
| radius.full | 9999 |

- Buttons, Tags: `radius.full` (pill).
- Cards/panels: `radius.md` suggested default — confirm on migration.
- **Chips:** `radius.sm` (small, 24px height) / `radius.md` (medium, 32px) — intentional deviation from pill shape.
