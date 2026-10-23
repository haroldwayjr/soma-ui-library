# Soma — motion

**Canonical doc:** [`docs/motion.md`](../../motion.md)

Duration + easing primitives/semantics and component recipes live there. Do not maintain a second full copy in CareApp — update the library doc, then keep this pointer current.

## Tooltip (recipe summary)

Full recipe in [`docs/motion.md`](../../motion.md). Care App prototype wires the same tokens as `--tip-*` in CareApp `prototypes/tool-rail-panels/styles.css`.

| State | Duration | Easing |
|---|---|---|
| Enter (opacity + ~4px settle **emerging away from the parent**) | `motion.duration.normal` (150ms) | `motion.easing.emphasized` |
| Leave (opacity + settle) | `motion.duration.fast` (100ms) | `motion.easing.exit` |

- **Applies to:** Figma **`Tooltip`** Simple | Rich and composed tips that share that surface (badge tips, meter info tips, rail / composer chrome tips, IHP tip show).
- **Hover-intent:** default **200ms** enter delay on all tips (not a duration token). Leave immediate. Open-by-default / coach skips delay.
- **Reduced motion:** durations → `0`; state change only (no fade/settle).
- **Not this recipe:** Popover / menu dropdown, Dialog / modal, Progress reveal.

See also `component-notes.md` · Tooltip · Badge + hover tip.

## Skeleton (recipe summary)

Full recipe in [`docs/motion.md`](../../motion.md#skeleton). Care App prototype: `.skeleton` / `@keyframes shimmer` in `prototypes/tool-rail-panels/styles.css`.

| Property | Duration | Easing |
|---|---|---|
| Sheen band travel (loop) | **1100ms** cycle | `linear` |

- **Applies to:** `Skeleton` Appearance=Shimmer in product (Figma is static preview only).
- **Not a semantic duration:** loop cycle, same class as Spinner — do not map to `motion.duration.reveal` / `slow`.
- **Reduced motion:** Rest / pause (no traveling sheen).
- **Converge:** product legacy 2.6s ease-in-out → **1100ms linear**.
- **Not this recipe:** Button `Icon / Spinner`, chrome `Spinner`, Progress value / reveal.

See also `component-notes.md` · Skeletons.

