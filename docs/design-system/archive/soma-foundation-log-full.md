# Soma Design System — Foundation Decisions Log (archive)

**Purpose:** Full historical reference from the initial Soma token build-out. For day-to-day work, use the distilled docs in `docs/design-system/soma/` instead.

**File:** [Soma Design System](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System) (`hB1NzwMnZt2ALeR0OslaWi`)

**Archived from:** Claude Project source, 2026-08-11 foundation log  
**CareApp archive date:** 2026-08-24

**Status as of archive:** Colors, Spacing, Typography, Elevation, Radius foundations built and published to a private, team-scoped library. Buttons and Chips components in progress. Icon and Grid foundation work scoped but not confirmed built. Checkbox / Control indicator fixes applied 2026-08-24 (see `component-notes.md` and Figma changelog).

---

## 1. File & Library Structure

- Soma lives in its **own Figma file**, intentionally separated from the legacy "MUI for Figma v9.0.0" vendor kit file, to avoid inheriting vendor-internal variables, naming collisions, and update risk from an upstream library.
- Figma Variables are **file-level, not page-level** — duplicating a page does not fork tokens. Any future "v2"-style duplication must duplicate the actual Variable Collection, not just the page.
- Published as a **Figma library**, scoped to **"everyone at [Team]"** — the narrowest audience tier Figma offers (no per-person scoping exists). Intentionally not published at Workspace or Organization level yet.
- Each foundation area (Colors, Spacing, Typography, Elevation, Radius) has been built and published **incrementally**, each as its own verified step — not bundled into one giant first publish. Publish history should stay granular for traceability.
- ⚠️ Found mid-project: some documentation frames (e.g. a "Token chip" component, some Buttons page elements) were instances of components from **other files** ("Anatomy: IH Design System," the old MUI kit). These carry risk of silent upstream changes and inconsistent token binding. Worth auditing the file periodically for stray external instances. **This same risk surfaced again during the Icons (§10) and Grids (§11) work below — see those sections for status.**

---

## 2. Naming Convention (established and non-negotiable going forward)

- **Primitives** use slash notation with nesting: `blue/600`, `coolDarkTransparent/40`.
- **Semantic tokens** (and all other token families — Spacing Semantic, Typography, Elevation, Radius) use **dot notation**: `text.onBrand`, `inset.md`, `shadow.md`, `radius.full`.
- Any hyphenated names found in reference material (`shadow-md`, `focus-visible`) get converted to dots when brought into Soma (`shadow.md`, `focus.visible`).
- **Exception:** CSS custom-property documentation (e.g. `--button-{tone}-{variant}-{bg|fg|border}`) correctly stays hyphenated — that's a different, valid convention for that layer and should not be converted.

---

## 3. Color Tokens

### Structure

Two Variable Collections:

- **Primitives** — single mode. Raw ramps: brand/blue, white/black, blue/purple/orange/teal/green/yellow/red/grey (100–900 each), plus `coolDarkTransparent` and `coolLightTransparent` (10–90 alpha ramps).
- **Semantic** — Light/Dark modes. Every semantic token aliases to a Primitive, never a hardcoded hex.

### Known primitive ramp inconsistency (documented, not "fixed")

"Base" shade lands on a different step per ramp — blue uses `/800` as base, grey uses `/500`, all others use `/700`. Not changed; flagged with descriptions on each base variable. If no real rationale exists per ramp, worth a future review.

### Contrast fixes applied (dark mode)

The core recurring bug pattern this whole project surfaced: **light-mode-tuned fill shades reused in dark mode with a fixed white foreground fails contrast**, because dark-mode fills are lightened for visibility against a dark canvas, but text color didn't follow. Fixed via **state-aware, mode-aware foreground tokens** rather than changing fill values (changing fills instead breaks the fill's own contrast against the dark canvas — a separate WCAG 1.4.11 problem).

Applied uniformly across brand, danger, success, and accent:

| Token family | Dark mode default/hover text | Dark mode pressed text |
|---|---|---|
| text/icon.onBrand | grey/900 (near-black) | white |
| text/icon.onDanger | black | white |
| text/icon.onSuccess | black | white |
| text/icon.onAccent (new) | black | white |

- `surface.brand.pressed` (dark): fill changed `blue/700` → `blue/800` (blue/700 didn't have enough contrast margin with white text).
- `action.success.pressed` (dark): fill changed `green/700` → `green/800` for the same margin reason.
- `text.secondary.onBrand` (dark): `grey/700` → `grey/800` (grey/700 failed contrast against the *default* brand fill, not just hover — was calibrated against the wrong reference state originally).
- `text.tertiary.onBrand` (dark): **left as-is, deliberately flagged, not fixed.** Making it pass full AA would make it visually indistinguishable from secondary text, defeating the tertiary tier. Open product decision: accept AA-large-only (≥3:1, headline-only, never body text) or drop tertiary-on-brand use entirely. **Not resolved.**

### Invisible-fill bug (found and fixed twice — same root cause)

Any dark-mode "subtle/tinted" or "default" fill using the **darkest step of a ramp (`/900`)** against the `grey/900` dark canvas is nearly invisible (~1.0–1.1:1 contrast) — fails WCAG 1.4.11 for fills that must read as a distinct surface.

Fixed:

- `surface.info.subtle`, `surface.success.subtle`, `surface.danger.subtle`, `surface.warning.subtle` (dark): `/900` → `/800` per ramp.
- `surface.accent` / `action.secondBrand` default (dark): `purple/900` → `purple/700` / `purple/600` respectively.

**Rule of thumb going forward:** never bind a dark-mode fill to a ramp's `/900` step if it needs to visually separate from the `grey/900` canvas. `/800` and lighter is the safe floor for "still reads as dark, but distinct."

### `surface.overlayDark` — NOT a bug (confirmed correct)

Scrim/modal overlay opacity increasing from 60%→80% between light/dark mode is intentional and correct — a semi-transparent scrim over arbitrary content needs *more* opacity in dark mode to produce visible dimming, unlike a flat surface fill. Don't "fix" this if it resurfaces in review.

### Newly added tokens (gap-filling)

Originally missing, now built with the same default/hover=black, pressed=white pattern:

- `action.warning` (+ hover/pressed/disabled), `text.onWarning`, `icon.onWarning`
- `action.info` (+ hover/pressed/disabled), `text.onInfo`, `icon.onInfo`
  - Note: `action.info.pressed` (dark) intentionally set to `teal/800`, not `teal/700` — teal/700 with white text only cleared 4.88:1, too thin a margin.
- `border.accent` — purple/700 (light) / purple/600 (dark), mirrored from `action.secondBrand`'s default fill values (same pattern as `border.brand` mirroring `action.primary`).

### Still-open gaps (documented, not resolved — do not silently fix)

- `focus.ring` has no success/warning/info variant (only default + danger). Assumed intentional (danger-only focus rings are a common pattern) — confirm before building more. **This gap directly blocks tone-matched focus rings for Chips (§9) — flagged again there.**
- `surface.selected` (color-only tint, both modes) has genuinely low contrast against canvas. **Rule, not a token fix:** selected state must always pair with a border/icon/weight change — never rely on background tint alone (WCAG 1.4.1). This belongs in component-level guidelines, not a token value. **Applied directly in the Chips selected-state spec (§9).**
- `text.tertiary.onBrand` — see above, unresolved by design.
- `border.success` / `border.info` / `border.warning` / `border.danger` are not explicitly enumerated anywhere in this log (only `border.brand` and `border.accent` are named). Unclear whether they exist. **Needs confirmation before Chips' outlined variant can bind to them — see §9.**

---

## 4. Spacing Tokens

Two collections, single mode (spacing doesn't change by theme):

- **Spacing** (primitives): `space0` through `space96` (0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96).
- **Spacing Semantic**: aliases grouped by role —
  - `inset.xs/sm/md/lg/xl` (padding)
  - `stack.xs/sm/md/lg/xl` (vertical gaps)
  - `inline.xs/sm/md` (horizontal gaps)
  - `section.sm/md/lg` (large section breaks)

No contrast/accessibility issues apply to spacing. No open gaps currently flagged.

**Note:** exact px values per named step (e.g. which `inset.*` step equals 24px) are not enumerated in this log. Any future work binding a specific pixel value (Grids, §11; Chips, §9) needs to confirm the exact step directly in Figma rather than assume.

---

## 5. Typography Tokens

Font: **Figtree**. Base rem root: **16px** (`htmlFontSize`). Separately, `fontSize/base = 14` is MUI's internal type-scale factor — **two distinct, intentional numbers, not an error** — documented explicitly on the Typography page to prevent future "fixing."

### Structure

- **Typography** collection (primitives, single mode): `fontFamily/body`, `fontWeight/regular(400)/medium(500)/semibold(600)/bold(700)`, full `fontSize` and `lineHeight` numeric scales.
  - `fontWeight/light (300)` was **removed** — unused anywhere in the actual type scale.
- **Text Styles** (not a second variable collection — Figma doesn't support binding a full "text style" as a single variable, so font size/weight/line-height are bound individually per field on named Text Styles): displayLarge/Medium/Small, h1–h6, subtitle1/2, body1/2, button, caption, overline.

### Fix applied

**h1 corrected from Medium(500) → SemiBold(600).** Original spec had h1 lighter-weight than h2–h6 despite sitting above them in hierarchy — inconsistent with the system's own stated principle ("differentiate same-size styles by weight, not size" / "keep heading levels consecutive"). Confirm this wasn't a deliberate stylistic choice if challenged later.

### Documented, not changed

- **Line-height is intentionally a separate scale from Spacing** — not required to land on the 4px spacing grid. Vertical rhythm *between* text blocks is controlled by `stack.*` spacing tokens applied outside the text box (margin/gap), not by adjusting line-height values. This is a documented boundary, added as a note on the Typography page.
- `overline` (11px) is intentionally below the system's own stated "never below 12px for reading" floor — acceptable because it's label-only, never body/paragraph text. Documented as an explicit exception, not a violation.
- Two properties can't be tokenized in Figma at all — documented as implementation notes for engineering, not tokens: **tabular figures** on Display styles (CSS `font-variant-numeric`), and **uppercase transform** on `overline` (CSS `text-transform`).

### Regression encountered and fixed

A rebinding pass once **inverted text colors** on the Spacing and Typography documentation pages (white-on-white / dark-mode value applied on a light-mode frame), making body text invisible. Root cause: broad "rebind to nearest match" instructions without page-by-page verification. Fixed by scoping a narrow, page-limited correction pass and explicitly locking untouched pages (Colors) out of scope. **Lesson: any future token rebinding pass should be scoped to one page at a time with an explicit "do not touch other pages" instruction, and verified with a manual spot-check before considering it done.**

### Exact point sizes per named style — not enumerated here

Beyond `overline` (11px) and the `htmlFontSize`/`fontSize/base` distinction above, this log does not record the exact point size of every Text Style (caption, body1/2, button, h1–h6, etc.). **This gap surfaced directly during the Chips redesign (§9)** — chip label sizing couldn't be bound with confidence to a specific style without a direct Figma check.

---

## 6. Elevation / Shadow Tokens

**Naming:** `shadow.xs, sm, md, lg, xl, 2xl, 3xl` + special tokens `shadow.inner`, `shadow.soft`. `shadow.md` is the stated default for cards/panels.

### Structure

**Elevation** collection, **Light/Dark modes** (added after initial single-mode build). Shadow **color** is bound to steps of the `coolDarkTransparent` primitive ramp (reusing the existing scrim-color primitive rather than inventing a new black) — blur/spread/x/y offset stay numeric, unbound to color tokens, and **identical between Light and Dark mode**.

### Dark mode fix

Light-mode shadow opacity is close to invisible against the `grey/900` dark canvas (same low-contrast-fill problem as the color tokens above, applied to shadows). Fixed by shifting each token's dark-mode color to a **~2-step higher opacity** on the same `coolDarkTransparent` ramp than its light-mode counterpart (capped at `/90`, the ramp's ceiling).

### Known limitation (flagged, not resolved)

Shadow-based elevation may still read as too subtle on dark surfaces even after the opacity boost — this is a known weak point of shadow-only dark-mode elevation generally. If visual QA finds `shadow.md` still too faint against `grey/900`, the documented next step is a **supplementary surface-tint overlay** approach for elevated dark cards, not further opacity increases (over-boosting starts reading as a dirty edge rather than intentional elevation).

### Broken icon asset (fixed)

The loading spinner icon on button components rendered as a solid malformed square rather than a spinner — root cause was a broken/detached component instance or flattened vector, not a color/token issue. Reconnected/rebuilt as a proper icon.

---

## 7. Radius Tokens

**Structure:** Single **Radius** collection, single mode (radius doesn't change by theme).

Full scale (16px rem root, consistent with Typography):

| Token | rem | px |
|---|---|---|
| radius.none | 0 | 0 |
| radius.xxs | 0.125 | 2 |
| radius.xs | 0.25 | 4 |
| radius.sm | 0.375 | 6 |
| radius.md | 0.5 | 8 |
| radius.lg | 0.625 | 10 |
| radius.xl | 0.75 | 12 |
| radius.2xl | 1 | 16 |
| radius.3xl | 1.25 | 20 |
| radius.4xl | 1.5 | 24 |
| radius.full | — | 9999 |

**History note:** a minimal 5-token version (`none/sm/md/lg/full`) was created first during the Buttons component pass, then expanded to the full scale above. `radius.lg`'s value changed in the expansion (verify no existing Buttons-page binding broke as a result — was flagged for confirmation, resolution not yet confirmed in this doc).

`radius.full` is used for pill-shaped buttons and tags. `radius.md` is the suggested general default for cards/panels — confirm this default during actual component migration, it was a placeholder recommendation, not a deeply reviewed decision.

**Reversed for Chips (documented 2026-08-11):** Chips moved off `radius.full` to a rounded-rectangle treatment — `radius.sm` (small chip, 24px height) / `radius.md` (medium chip, 32px height) — to visually distinguish compact/filter-style chips from pill-shaped primary actions and tags. This was a deliberate decision made during the Chip redesign, not an oversight. Buttons and Tags are unaffected and remain `radius.full`. Don't revert this back to `radius.full` if it resurfaces in review — the deviation from Buttons/Tags is intentional. See §9 (Chips) for full anatomy.

---

## 8. Buttons (component-level, first real consumer of the tokens)

- Tones: brand, danger, success. Variants: contained, outlined, text (ghost). States: default, hover, focus-visible → **renamed `focus.visible`**, pressed, disabled, loading.
- **Disabled state bug (fixed):** disabled buttons were rendering with per-tone styling (e.g., a danger-disabled button looked different from a brand-disabled button) and used near-invisible borders with too-dark text — internally inconsistent with the system's own disabled tokens. Fixed: **disabled must look identical across all tones** — `surface.disabled` (fill) / `border.disabled` (border) / `text.disabled` (text+icon), always, regardless of tone. Note: disabled controls are WCAG-exempt from the 4.5:1 contrast requirement — this was a consistency fix, not a contrast-ratio fix.
- Anatomy spec: container min-height ≥44px (medium, for reliable tap targets in clinical workflows), pill shape (`radius.full`), padding `inset.md`/`inset.sm`, icon gap `inline.xs`, focus ring 2px + 2px offset (`focus.ring` / `focus.ring.danger`).
- **Flagged, unresolved:**
  - Code-example documentation imports from `@nova/ui`, inconsistent with the system's actual name "Soma" — needs a naming decision, not silently renamed.
  - The Buttons page currently demonstrates only **one color mode** — no Light/Dark toggle shown yet, despite the token system underneath fully supporting both. Open documentation-structure question: should every component page get a mode toggle?

---

## 9. Chips (component-level — in progress)

**Status: redesign scoped and specified; Figma execution and token-binding audit not yet confirmed.** Treat the details below as the agreed direction, not as verified-built fact, until a Cursor/Figma audit report comes back.

### Background

The prior Chips documentation was directly authored against MUI v9's Chip system (MUI palette names, MUI variant/API language, an "Implementation (MUI v9)" section referencing `styleOverrides`/`slotProps`). This is being fully replaced — MUI references removed, tones remapped to Soma's own vocabulary, and the shape changed from full-pill to a rounded rectangle (see §7 reversal above).

### Tone remap (MUI → Soma)

| Old (MUI) | New (Soma) | Fill / text |
|---|---|---|
| default | neutral | `surface.subtle` / `text.secondary` / `border.subtle` — no dedicated "neutral" action-token family exists; this uses base tokens rather than a new one |
| primary | brand | `surface.brand` / `text.onBrand` / `border.brand` |
| secondary | accent | `surface.accent` / `text.onAccent` / `border.accent` |
| success | success | `surface.success.subtle` / `text.onSuccess` |
| info | info | `surface.info.subtle` / `text.onInfo` |
| warning | warning | `surface.warning.subtle` / `text.onWarning` |
| error | danger | `surface.danger.subtle` / `text.onDanger` |

`border.success` / `border.info` / `border.warning` / `border.danger` existence is **unconfirmed** (see §3 gap) — the outlined chip variant cannot bind to these until confirmed or filed as a token request.

### Shape and sizing (proposed)

- **Small:** 24px height, `radius.sm`, padding `inset.sm`, internal gap `inline.xs`, leading icon ~16px, delete-icon hit target padded to ≥24×24px regardless of visual icon size (WCAG 2.2 SC 2.5.8, AA).
- **Medium:** 32px height, `radius.md`, padding `inset.md`, internal gap `inline.sm`, leading icon ~18–20px.
- Exact `inset.*`/`inline.*` step matches and exact Text Style point sizes for chip labels are **not yet confirmed** — see the Typography gap noted in §5.
- Small chip's ~16px leading icon doesn't cleanly match any ratified icon-size step (see §10) — flagged as a possible exception case, not yet resolved.

### Rules carried over / newly applied

- **Disabled must be identical across all tones** (`surface.disabled` / `border.disabled` / `text.disabled`) — the prior MUI-era spec described per-tone opacity fading (~38–50%) for disabled chips, which is the same inconsistency bug already fixed on Buttons (§8). Fixed the same way here, not re-derived.
- **Selected/toggled state must pair a tint change with a border or icon change** — never background tint alone, per the `surface.selected` rule in §3.
- **Focus ring is never removed; pressed wins over hover; hover/pressed never fire while disabled** — same interaction rules as Buttons' state matrix, applied to Chips.
- Tone-matched focus rings for success/warning/info/accent chips are **blocked on the same `focus.ring` gap noted in §3** (only default + danger variants exist). Filed as a token gap, not invented.

### Implementation note

The old "Implementation (MUI v9)" section is removed outright, not translated. Chip has no direct Base UI headless primitive the way Button does — it's documented as a custom composed component, following the same spec structure as Button (Scope / Anatomy / Props / State matrix / Tokens consumed + gaps / Acceptance criteria).

---

## 10. Icons (foundation — scoped, not yet confirmed built)

**Status: this category did not exist in Soma as of the last version of this doc (see prior §11 wording). Work has been scoped to build it, replacing the Care App's inherited MUI Material Icons page with Streamline. Execution not yet confirmed.**

- **Style decision (made):** Streamline Regular only — the filled/emphasis ("outlined vs. filled") two-style system from Material is dropped entirely, not translated 1:1. Streamline Regular is a single-weight stroke family.
- **Proposed size scale (unratified):** `icon.sm` = 20px, `icon.md` = 24px (default), `icon.lg` = 32px — carried over from the old Care App documentation's viewport note, not a previously-ratified Soma decision. Needs team confirmation before being treated as settled.
- **Proposed color tokens:** `icon.default` (aliased to the same primitive as `text.primary` per mode) and `icon.disabled` (aliased to `text.disabled`) — proposed only if no equivalent already exists; needs a direct check before creating, to avoid duplicating something already built. Icons sitting on colored surfaces reuse the already-established `icon.onBrand` / `icon.onDanger` / `icon.onSuccess` / `icon.onWarning` / `icon.onInfo` tokens from §3 rather than a new set.
- **Provenance flag:** the pre-existing Icons documentation page (referencing MUI v9 Material Icons) may include frames or components that are instances from another file, matching the same stray-external-instance pattern already found once in this file (§1). Needs auditing before being edited or treated as locally authoritative.
- **Not yet resolved:** whether any Streamline icon name has no direct match to what's currently documented as "used in Care App," and whether the small chip's ~16px icon need (§9) should be folded into this scale as a new smaller step, or treated as a one-off exception.

---

## 11. Grids (foundation — scoped, not yet confirmed built)

**Status: a page specifying breakpoint grids (Large ≥1200px, Medium ≥768px, X-Large ≥1440px, Small ≥600px, Sidebar-fluid) was found already existing in this file. This directly contradicts the prior version of this doc's claim that no grid system had been built yet (see updated §14) — provenance is unconfirmed.**

- **Findings so far:** margin and gutter are both specified at 24px across the audited breakpoints; column counts and content-area widths vary per breakpoint as documented on the page itself.
- **Provenance flag:** unclear whether this page is locally authored Soma work or inherited/templated content — same audit concern as the Icons page (§10) and the general stray-instance risk noted in §1. Do not treat its numbers as final until confirmed.
- **Tokenization decision (made):** margin → `inset.*`, gutter → `inline.*` — reusing existing Spacing Semantic roles rather than introducing a new `grid.*` namespace. Exact step match to the 24px values found is **unconfirmed** — `inline.*` is documented (§4) as only going up to `md` (no `lg`/`xl`), so a 24px gutter needs a real check against actual step values, not an assumption that it fits.
- **Open technical question:** whether Figma's Layout Grid style properties (margin, gutter, column count) can bind live to Number variables in this file's Figma version, or whether they can only be documented as static numbers annotated against the token they represent (the same pattern already used for Elevation's shadow offsets, §6). Not yet confirmed either way.

---

## 12. Recurring Patterns / Lessons Worth Generalizing

1. **The single most common bug this whole build surfaced:** a dark-mode fill gets lightened for visibility against a dark canvas, but its paired foreground (text/icon) color doesn't get updated to match — inherited from a light-mode assumption. Always re-check foreground contrast per-state, per-mode, not just per-token.
2. **Second most common bug:** a dark-mode fill uses the darkest available ramp step (often `/900`) to "look dark," which makes it nearly invisible against an equally-dark canvas. The fix is almost always to move one or two steps lighter (`/800` or `/700`), not to invent a new primitive.
3. **Pressed states often break the pattern** that fixed default/hover — because pressed fills are typically darker than default/hover, they sometimes land back on the *other* side of the black-vs-white-text threshold. Never assume a fix for default/hover automatically covers pressed; check it separately every time.
4. Whenever a "finish the last mile" pass is scoped too broadly (e.g., "rebind all matching colors across the file"), it risks touching pages that were already correct. **Every rebinding/cleanup prompt should explicitly name which pages are in scope and instruct the tool to leave everything else untouched**, with a required "confirm no other page was touched" step in the completion report.
5. Foundational token categories have kept surfacing gaps one at a time as each new component page gets built (Typography needed its own layer distinct from color/spacing; Elevation needed shadow-color binding; Radius didn't exist at all until Buttons needed it). Icons and Grids (§10, §11) are the same pattern recurring again. **Before starting the next component page, it's worth proactively checking what other foundational categories (z-index, motion/animation duration) might be referenced by name in old reference docs but don't exist yet in Soma** — cheaper to catch in one sweep than repeatedly one at a time.
6. **Newly generalized:** before treating any existing documentation page as ground truth — including a page that appears to already contain a finished spec, like the Grids page found in §11 or the Icons page in §10 — audit whether it's locally authored or an instance/import from elsewhere. A polished-looking page is not the same as a verified one.
7. **Newly generalized:** when a redesign deliberately reverses a previously "settled" rule (e.g., Chips moving off `radius.full`, §7), document the reversal explicitly with a date and rationale in the same section as the original rule, rather than quietly editing the original line. This preserves the reasoning for why otherwise-similar components (here, Buttons/Tags vs. Chips) now diverge.

---

## 13. Publishing & Governance

- Figma **publish ≠ public.** Publishing a library only makes it available to enable in files that already have access to it — actual privacy is controlled by file/project sharing permissions, checked *before* publishing.
- Each foundation area was published as its own step, with a description of changes, after manual verification (checking the Variables panel directly, not just trusting a tool's text summary of success). **Chips, Icons, and Grids should each get their own incremental publish step once confirmed, following this same pattern — not bundled together or bundled with unrelated changes.**
- **Verification pattern used throughout:** after any Cursor/MCP write, manually select an affected layer in Figma and check the right-side panel for a linked-variable icon (not just a plausible-looking flat value) before considering a change actually complete.

---

## 14. Explicitly Out of Scope / Not Yet Started

- No dark-mode design work has been done for any component beyond the token layer itself (Buttons page shows light mode only).
- **Updated:** icon system and grid system are no longer flatly "not started" — both have been scoped (§10, §11), but neither is confirmed built, tokenized, or published yet. Do not treat either as done until an execution/audit report confirms it.
- No z-index scale or motion/animation tokens have been built yet — these remain genuinely not started, with no scoping work done on either.
- No connection exists yet between this Figma file and any code repository (GitHub, Style Dictionary, Tokens Studio, etc.) — all decisions in this document currently exist **only in Figma**, not in any exported JSON/CSS/markdown. If a code-side token pipeline exists or gets built, it needs a full audit against this document, not an assumption that it's already in sync.
