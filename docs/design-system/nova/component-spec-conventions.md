# Nova — component spec conventions

Each component gets a `*.spec.md` in `libs/ui/src/<component>/`, from `docs/templates/COMPONENT.spec.md`. **Button spec is the reference example.**

## Required sections

1. **Scope** — lead with what the component is **not** (not a link, not a toggle, etc.).
2. **Anatomy** — root + slots.
3. **Props** — minimal typed table + **deliberately absent** list (no `render`/`as`, no token-shaped props, no `fullWidth`).
4. **State matrix** — rest / hover / pressed / focus-visible / focus-pointer / disabled / loading / icon-only.
5. **Tokens consumed** + **token gaps** — file requests instead of reaching into ramp steps.
6. **Acceptance criteria** — rendering, states, a11y, files touched.

## Interaction rules (from state matrix)

- Hover and pressed never fire while disabled or loading.
- Loading is **not** disabled — stays focusable; use `aria-disabled` + JS intercept, not `disabled` attribute.
- Focus ring is never removed.
- Pressed wins over hover.

## Accessibility checklist

- Target: **WCAG 2.2 AA** in spec text (not 2.1).
- Text contrast: ≥4.5:1 normal, ≥3:1 large (≥24px or ≥18.66px bold). Button labels = normal unless explicitly large.
- **Focus column:** measure ring vs adjacent color ≥3:1 (SC 1.4.11, 2.4.13) — not label-vs-fill from rest state.
- SC 2.4.11 Focus Not Obscured — relevant for toolbar buttons.
- Disabled controls exempt from contrast (SC 1.4.3).
- Consider `forced-colors` / Windows High Contrast for rings and borders.

## Spec pitfalls

- Don't advertise prop combinations in the type union that can't ship yet.
- Don't assert "semantic tokens only" then use `space[n]` primitives — flag as interim or resolve.
- Scope contrast testing to color-bearing axes (variant × tone × theme), not size.
- WCAG version must be 2.2 everywhere.

## Standardized build prompt

`libs/ui/docs/prompts/nova-ui-component.md` — Role → Constraints → Input (linked spec) → Task → Acceptance → Report back.

Guardrails: Base UI, Vanilla Extract, semantic tokens, light + dark, WCAG 2.2 AA, minimal diffs, update `COMPONENT-STATUS.md`, stop and report if an AC cannot be met.

Report-back: files changed, per-ID AC pass/fail, Storybook touched, residual risks, semantic-tokens-only confirmation.

## Soma spec parity (Figma)

Soma component pages follow the same structure: Scope / Anatomy / Props / State matrix / Tokens + gaps / Acceptance criteria. Chip has no Base UI primitive — document as custom composed component.
