# Soma — motion (duration + easing)

**Status:** Docs-first v1 for eng adoption. Figma motion variables not published yet. Values normalized from the Care App `tool-rail-panels` prototype (not every legacy ms value).

**Scope:** Duration and easing tokens only. No stagger, spring, or page-transition language in this pass.

**Primary consumers:** Accordion · Progress (Bar / Circle) · Switch.

## Rules

1. Components consume **semantic** tokens (`motion.duration.*`, `motion.easing.*`) — never raw ms or ad-hoc curves in product code.
2. Prefer the smallest duration that still reads as intentional. When unsure: `normal` for chrome, `moderate` for layout/value change.
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

### Easing

| Primitive | Value | Feel |
|---|---|---|
| `easing/standard` | `cubic-bezier(0.2, 0, 0, 1)` | Color, opacity, progress fill |
| `easing/emphasized` | `cubic-bezier(0.16, 1, 0.3, 1)` | Enter, thumb, chevron with presence |
| `easing/exit` | `cubic-bezier(0.4, 0, 1, 1)` | Leave / collapse |

Prototype already uses `emphasized` and `exit` curves widely; `standard` replaces scattered `ease` / one-off curves for color and determinate progress.

## Semantic tokens

| Semantic | Alias | CSS custom property |
|---|---|---|
| `motion.duration.fast` | `duration/100` | `--motion-duration-fast` |
| `motion.duration.normal` | `duration/150` | `--motion-duration-normal` |
| `motion.duration.moderate` | `duration/200` | `--motion-duration-moderate` |
| `motion.duration.slow` | `duration/250` | `--motion-duration-slow` |
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

Determinate value changes only. Spinner / indeterminate cycles stay on Loading Indicators.

| Property | Duration | Easing |
|---|---|---|
| Bar width / arc length (value update) | `motion.duration.moderate` | `motion.easing.standard` |
| Label / % text swap (if crossfaded) | `motion.duration.normal` | `motion.easing.standard` |

Do **not** ship a ~900ms first-paint “grow” as the Progress token — that is prototype meter intro only. Value updates stay on `moderate` + `standard`.

Reduced motion: set value instantly (no width/arc tween).

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
| Progress meter first paint | 900ms grow | **Not a v1 token** — intro only |
| Panel content fade reveal | 200ms ease | `moderate` + `standard` |

## Out of scope (later)

- Stagger / delay scale
- Overlay / drawer / panel enter distances
- Shared menu/popover recipe (values above are hints only)
- Figma variable collection + Motions page
- Per-component duration tokens (`duration.accordion`) — prefer roles above
- Foundation browser page under `#/ui-library/foundation/motion` (tokens live here first)

## Related

- Soma UI Library: [README](../README.md)
- Care App prototype provenance: `prototypes/tool-rail-panels/styles.css` in CareApp
- Figma: [Soma Design System](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System)
