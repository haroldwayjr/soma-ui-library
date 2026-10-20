# Soma — motion (duration + easing)

**Status:** Docs-first v1 for eng adoption. Figma motion variables not published yet. Values normalized from the Care App `tool-rail-panels` prototype (not every legacy ms value).

**Scope:** Duration and easing tokens only. No full stagger scale, spring, or page-transition language in this pass. Progress **reveal** (first-paint grow) is included.

**Primary consumers:** Accordion · Progress (Bar / Circle) · Switch.

## Rules

1. Components consume **semantic** tokens (`motion.duration.*`, `motion.easing.*`) — never raw ms or ad-hoc curves in product code.
2. Prefer the smallest duration that still reads as intentional. When unsure: `normal` for chrome, `moderate` for layout/value change. Use **`reveal`** only for first-paint / intro fills — not for every value tweak.
3. Exits may use the same duration as enters, but must use **`motion.easing.exit`** (faster perceived leave).
4. **`prefers-reduced-motion: reduce`** → set interactive durations to `0` (or disable transition/animation). Keep state changes instant; do not substitute a long fade.
5. Indeterminate loops (Spinner) are out of scope here — they keep their own cycle timing; still honor reduced motion (pause or static).

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

## Out of scope (later)

- Formal delay / stagger token scale (pattern note above only)
- Overlay / drawer / panel enter distances
- Shared menu/popover recipe (values above are hints only)
- Figma variable collection + Motions page
- Per-component duration tokens (`duration.accordion`) — prefer roles above
- Foundation browser page under `#/ui-library/foundation/motion` (tokens live here first)

## Related

- Soma UI Library: [README](../README.md)
- Care App prototype provenance: `prototypes/tool-rail-panels/styles.css` (`.ins-progress` / `ins-meter-grow`)
- Figma: [Soma Design System](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System)
