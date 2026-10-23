# Soma — motion (duration + easing)

**Status:** Docs-first v1 for eng adoption. Figma motion variables not published yet. Values normalized from the Care App `tool-rail-panels` prototype (not every legacy ms value).

**Scope:** Duration and easing tokens only. No full stagger scale, spring, or page-transition language in this pass. Progress **reveal** (first-paint grow), **Tooltip** enter/leave, **Modal / Dialog** open/close, and **Skeleton** sheen loop are included.

**Primary consumers:** Accordion · Progress (Bar / Circle) · Switch · Tooltip · Modal · Skeleton.

## Rules

1. Components consume **semantic** tokens (`motion.duration.*`, `motion.easing.*`) — never raw ms or ad-hoc curves in product code.
2. Prefer the smallest duration that still reads as intentional. When unsure: `normal` for chrome, `moderate` for layout/value change. Use **`reveal`** only for first-paint / intro fills — not for every value tweak.
3. Exits may use the same duration as enters, but must use **`motion.easing.exit`** (faster perceived leave).
4. **`prefers-reduced-motion: reduce`** → set interactive durations to `0` (or disable transition/animation). Keep state changes instant; do not substitute a long fade.
5. Indeterminate **Spinner** loops stay component-owned (no formal recipe yet). **Skeleton** sheen is documented below as a fixed cycle — not a `motion.duration.*` role. Always honor reduced motion (pause or static Rest).

## Primitives

Single-mode steps (like spacing px). Semantic aliases point here.

### Duration

| Primitive | Value | Notes |
|---|---|---|
| `duration/100` | 100ms | Press / snap / exit floor |
| `duration/150` | 150ms | Hover color, chevron, most micro chrome |
| `duration/200` | 200ms | Thumb slide, progress value, short layout |
| `duration/250` | 250ms | Accordion body open/close when height animates |
| `duration/900` | 900ms | Progress / meter first-paint grow (reveal) |

### Easing

| Primitive | Value | Feel |
|---|---|---|
| `easing/standard` | `cubic-bezier(0.2, 0, 0, 1)` | Color, opacity, progress **value** fill |
| `easing/emphasized` | `cubic-bezier(0.16, 1, 0.3, 1)` | Enter, thumb, chevron, progress **reveal** |
| `easing/exit` | `cubic-bezier(0.4, 0, 1, 1)` | Leave / collapse |

Prototype already uses `emphasized` and `exit` curves widely; `standard` replaces scattered `ease` / one-off curves for color and determinate progress value updates. Progress reveal normalizes the prototype’s near-emphasized curve (`0.22, 1, 0.36, 1`) onto **`easing/emphasized`**.

## Semantic tokens

| Semantic | Alias | CSS custom property |
|---|---|---|
| `motion.duration.fast` | `duration/100` | `--motion-duration-fast` |
| `motion.duration.normal` | `duration/150` | `--motion-duration-normal` |
| `motion.duration.moderate` | `duration/200` | `--motion-duration-moderate` |
| `motion.duration.slow` | `duration/250` | `--motion-duration-slow` |
| `motion.duration.reveal` | `duration/900` | `--motion-duration-reveal` |
| `motion.easing.standard` | `easing/standard` | `--motion-easing-standard` |
| `motion.easing.emphasized` | `easing/emphasized` | `--motion-easing-emphasized` |
| `motion.easing.exit` | `easing/exit` | `--motion-easing-exit` |

Nova / `@nova/ui` may prefix (`--soma-motion-…` or `--sys-motion-…`) — keep the **token path** (`motion.duration.normal`) stable; only the CSS name may differ. Confirm final CSS names in `libs/ui/docs/TOKENS.md` when mirrored.

### Suggested CSS variables (copy-paste)

```css
:root {
  --motion-duration-fast: 100ms;
  --motion-duration-normal: 150ms;
  --motion-duration-moderate: 200ms;
  --motion-duration-slow: 250ms;
  --motion-duration-reveal: 900ms;
  --motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --motion-easing-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-easing-exit: cubic-bezier(0.4, 0, 1, 1);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration-fast: 0ms;
    --motion-duration-normal: 0ms;
    --motion-duration-moderate: 0ms;
    --motion-duration-slow: 0ms;
    --motion-duration-reveal: 0ms;
  }
}
```

## Component recipes

### Switch

Binary on/off control (not View switcher).

| Property | Duration | Easing |
|---|---|---|
| Thumb position | `motion.duration.moderate` | `motion.easing.emphasized` |
| Track / thumb color | `motion.duration.normal` | `motion.easing.standard` |
| Press scale (if used) | `motion.duration.fast` | `motion.easing.standard` |

Reduced motion: jump thumb and colors with no transition.

### Progress (Bar / Circle)

Two distinct motions — do not use reveal for every value change.

#### Value update

When spent / percent changes after the bar is already on screen (live data refresh).

| Property | Duration | Easing |
|---|---|---|
| Bar width / arc length | `motion.duration.moderate` | `motion.easing.standard` |
| Label / % text swap (if crossfaded) | `motion.duration.normal` | `motion.easing.standard` |

#### Reveal (first paint / intro grow)

Left-to-right fill from empty → current value when the meter **first appears** — e.g. Care App Insurance Activity deductible / out-of-pocket bars after panel load or network mode swap that remounts meters.

| Property | Duration | Easing |
|---|---|---|
| Bar fill grow (`scaleX` 0→1 or width 0→value) | `motion.duration.reveal` | `motion.easing.emphasized` |

**When to use reveal**

- First paint of a determinate meter in a panel, card, or section
- Remount that should feel like a fresh load (Insurance Activity meters)

**When not to**

- Incremental value updates → use **value update** (`moderate` + `standard`)
- Indeterminate waits → Spinner (Loading Indicators), not Progress reveal

**Optional cascade (pattern, not a delay token scale yet)**  
Insurance Activity staggers sibling meters ~70ms apart (prototype delays 50 / 120 / 190 / 260ms). Safe default if cascading: `delay = index × 70ms`, capped so the last bar still finishes soon after the first. Full delay tokens remain out of scope.

Reduced motion: show final fill instantly (no grow, no stagger).

### Accordion

Published Accordion master still open in Soma Figma; recipe applies to disclosure / composed accordion in product and Nova.

| Property | Duration | Easing |
|---|---|---|
| Chevron rotate | `motion.duration.normal` | `motion.easing.emphasized` |
| Body expand (height / grid-template) | `motion.duration.slow` | `motion.easing.emphasized` |
| Body collapse | `motion.duration.moderate` | `motion.easing.exit` |

If height is not animated (`display` toggle only), still animate the chevron with `normal` + `emphasized`.

Reduced motion: toggle open/closed instantly; chevron may snap with no rotate tween.

### Tooltip

Inverse hover/focus hint — Figma **`Tooltip`** (Simple | Rich). Same recipe for composed tips that share that surface (badge tips, meter info tips, rail / composer chrome tips, IHP tip show after dismiss).

| Property | Duration | Easing |
|---|---|---|
| Enter (opacity + settle translate) | `motion.duration.normal` | `motion.easing.emphasized` |
| Leave (opacity + settle translate) | `motion.duration.fast` | `motion.easing.exit` |

**Settle:** ~4px along the open axis, **emerging away from the parent** into the tip’s rest position (same distance for all sides). Below → start `translateY(-4px)`; above → start `translateY(4px)`; side (e.g. tool rail left) → start toward the anchor on X. Do not dock toward the parent, and do not invent per-surface curves or ad-hoc `ease`.

**Hover-intent delay** (default — not a duration token): **200ms** before *enter* on **all** tips so tips don’t flash on pointer sweep. Leave has no intent delay. Persistent / open-by-default tips (e.g. IHP coach) skip the intent delay. Reduced motion → delay `0`.

**Reduced motion:** interactive durations → `0` (token override); tip appears/disappears with state only — no fade or settle.

**Not this recipe:** Popover / menu dropdown (still out of scope). Progress meter reveal. Modal / Dialog (recipe below).

### Modal

Centered dialog + scrim (Figma **Modal.Popup**; Care App enrollment, confirm, manage Care Team). Same recipe for any full-scrim dialog that shares that surface.

| Property | Duration | Easing |
|---|---|---|
| Enter — scrim opacity | `motion.duration.moderate` | `motion.easing.standard` |
| Enter — dialog (opacity + settle) | `motion.duration.moderate` | `motion.easing.emphasized` |
| Leave — scrim opacity | `motion.duration.moderate` | `motion.easing.exit` |
| Leave — dialog (opacity + settle) | `motion.duration.moderate` | `motion.easing.exit` |

**Settle:** **12px** on Y — dialog emerges from slightly below rest (`translateY(12px)` → `0`) on enter; reverse on leave (`0` → `translateY(12px)`). No scale. Scrim is opacity only (Light `rgba(16, 29, 56, 0.45)` / Dark heavier). Scrim and dialog start together — no stagger.

**Content swap** (dialog already open; e.g. enrollment → confirm): keep scrim up; dialog only — opacity ~0.72→1 + `translateY(6px)`→0, **`motion.duration.normal`** + **`motion.easing.emphasized`**. Do not tear down `is-open` (avoids scrim flash).

**Prototype note:** `tool-rail-panels` plays enter (`modal-scrim-in` / `modal-fade-up`, 200ms `ease`) and content-swap (`modal-content-swap`, 160ms emphasized). Leave currently removes `is-open` with no exit tween — eng should implement leave with the table above (same duration, `exit` easing, reverse settle).

**Reduced motion:** interactive durations → `0`; show/hide dialog + scrim with state only — no fade or settle.

**Not this recipe:** Drawer / side panel slide. Menu / popover. Tooltip.

### Skeleton

Content-shaped loading placeholders (`Skeleton` Block · Line · Circle; Care recipes Panel · List row · Accordion header). Figma **Appearance=Shimmer** is a **static** sheen preview — product animates the band.

| Property | Duration | Easing |
|---|---|---|
| Sheen band travel (loop) | **1100ms** cycle | `linear` |

**Mechanics (prototype):** soft gradient band (`transparent` → `skeleton/shimmer` → `transparent`) translates across `skeleton/base` (`translateX(-100%)` → `translateX(100%)`), `animation-iteration-count: infinite`. Peak highlight stays lighter than the bone (Light ~white @ 0.75; Dark soft cool ~0.1).

**Why not a semantic duration:** Loop cycles sit outside enter/leave/reveal roles (same class as Spinner). Do not map sheen to `motion.duration.reveal` or stretch `slow`. If product and prototype diverge (e.g. legacy 2.6s ease-in-out), converge on **1100ms linear**.

**Reduced motion:** freeze on Rest (no traveling sheen) or pause the animation; do not substitute a long fade.

**Not this recipe:** Button loading (`Icon / Spinner`). Short chrome indeterminate waits (`Spinner`). Determinate meters (`Progress` value / reveal).

## Prototype → token map (reference)

| Prototype pattern | Approx. legacy | Token |
|---|---|---|
| Hover fill / color | 140ms ease | `normal` + `standard` |
| Accordion / task-list chevron | 160ms ease | `normal` + `emphasized` |
| Menu / popover enter | 180ms emphasized | `moderate` + `emphasized` (menus; not in v1 recipe set) |
| Menu / popover leave | 120ms exit | `fast` + `exit` |
| View switcher thumb | 220ms custom ease | `moderate` + `emphasized` |
| Progress meter first paint (Insurance Activity) | 900ms grow + stagger | `reveal` + `emphasized` |
| Progress value change (post-load) | — | `moderate` + `standard` |
| Panel content fade reveal | 200ms ease | `moderate` + `standard` |
| Tooltip enter (opacity + 4px settle) | 150ms emphasized | `normal` + `emphasized` |
| Tooltip leave | 100ms exit | `fast` + `exit` |
| Tooltip hover-intent (default, all tips) | 200ms delay | not a duration token |
| Modal / Dialog enter (scrim + fade-up 12px) | 200ms ease | `moderate` + `standard` (scrim) / `emphasized` (dialog) |
| Modal / Dialog leave | — (prototype snaps) | `moderate` + `exit` (implement) |
| Modal content swap (scrim stays) | 160ms emphasized | `normal` + `emphasized` |
| Skeleton sheen loop | 1100ms linear infinite | cycle (not a semantic duration role) |

## Out of scope (later)

- Formal delay / stagger token scale (pattern note above only)
- Drawer / side panel enter distances (Modal / Dialog recipe covers centered scrim dialogs only)
- Shared menu/popover recipe (values above are hints only; **Tooltip** is a recipe — do not reuse menu timings for tips)
- Figma variable collection + Motions page
- Per-component duration tokens (`duration.accordion`) — prefer roles above
- Foundation browser page under `#/ui-library/foundation/motion` (tokens live here first)

## Related

- Soma UI Library: [README](../README.md)
- Care App prototype provenance: `prototypes/tool-rail-panels/styles.css` (`.ins-progress` / `ins-meter-grow`; `.modal-layer` / `modal-fade-up` / `modal-scrim-in`; `.skeleton` / `@keyframes shimmer`)
- Figma: [Soma Design System](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System)
