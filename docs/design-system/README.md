# Design system reference

Standing context for Soma (Figma). Load on demand with `@docs/design-system/...` — not injected every session.

## When to use which doc

| Task | Attach |
|---|---|
| Figma token/component work in Soma | `@docs/design-system/soma/quick-reference.md` |
| Color, spacing, typography, radius rules | `@docs/design-system/soma/token-rules.md` |
| Buttons, Chips, Icons, Checkbox, Grids | `@docs/design-system/soma/component-notes.md` |
| Open gaps, unconfirmed items | `@docs/design-system/soma/open-items.md` |

## Repos and files

| System | Where it lives |
|---|---|
| **Soma (Figma)** | [Soma Design System](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System) — file key `hB1NzwMnZt2ALeR0OslaWi` |
| **This repo** | Component browser + design-system notes under `docs/design-system/soma/` |

## Cursor rules

| Rule | Scope |
|---|---|
| `soma-docs.mdc` | On demand — points to `docs/design-system/soma/` |

## Maintenance

- Update distilled docs when a decision changes.
- Do not duplicate these notes as always-on Cursor rules; attach with `@` when needed.
