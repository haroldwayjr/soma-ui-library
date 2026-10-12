# Nova — token architecture

## Color — two-layer model (favored)

**Approach 1 — Primitive → Semantic (2 layers):** Primitives are single ramps; Semantic collection carries Light/Dark and maps each token per mode. One mode toggle flips a whole screen. Clean CSS mapping (`var(--sys-color-...)`).

**Approach 2 — Primitive → Palette → Semantic (3 layers):** Adds Palette with duplicated light/dark ramps. To behave correctly, semantic layer still needs Light/Dark modes — extra variables with no benefit for pure light/dark.

**Conclusion:** Approach 1 favored unless a concrete palette-layer need emerges. Semantic layer only pays off if **enforced** — teams reaching into raw ramp steps get cost without benefit.

### Settled color values

- Light primary action: `blue/800`. Dark: `blue/600`. **`blue/700` is stale** for primary.
- Grey ramp starts at `grey/100` — no `grey/50`.
- Reference hex (demos): `grey/100` #F3F4F6, `grey/200` #E5E7EB, `grey/700` #374151, `grey/900` #121212, `blue/600` #2B78F5, `blue/800` #002380, `white` #FFFFFF.
- Component styles: **semantic tokens only** — no primitives, no literals. Exceptions: 1px borders, 2px focus outline/offset until promoted.

**Demo semantic set:** `bg/surface`, `text/primary`, `border/subtle`, `action/primary`, `text/on-action`.

### Soma ↔ Nova alignment

Soma Figma uses dot notation (`text.onBrand`); Nova demos may use slash notation (`text/on-action`). Same two-layer intent — confirm exact names in `libs/ui/docs/TOKENS.md` before implementing.

## Spacing

**Current:** Raw primitives (`space4`, `space8`, …) with "Typical use" notes + proposed semantic layer.

**Why semantic spacing:** Primitives name pixels; semantic names encode **role** (padding vs gap vs section rhythm). Worth keeping only with lint blocking raw `space*`.

### Taxonomy (OPEN — leaning toward 3 groups)

| Proposed | Replaces | Role |
|---|---|---|
| `inset` | `inset` | Padding inside a container |
| `gap` | `stack` + `inline` | Space between siblings (flex/grid `gap`) |
| `section` | `section` | Space between major page regions |

Do **not** collapse `section` into `gap` — page rhythm is a distinct role. Pair with decision rules + lint.

Soma still documents four groups (`inset` / `stack` / `inline` / `section`) until ratified.

## Blocked token roles (Button example)

- `action.ghost.*` and `action.danger.*` — do not ship ghost/danger variants until tokens land.
- Build shipped subset; omit unimplementable types from the public API.

## Open decisions

- [ ] Color layering — final ratification pending working session.
- [ ] Spacing taxonomy 4→3 — not ratified; enforcement is precondition.
- [ ] Optional tightenings to `nova-ui-component.md` prompt.
