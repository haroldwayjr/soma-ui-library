# Design system reference (CareApp)

Standing context for Soma (Figma) and Nova (code). Load on demand with `@docs/design-system/...` — not injected every session.

## When to use which doc

| Task | Attach |
|---|---|
| Figma token/component work in Soma | `@docs/design-system/soma/quick-reference.md` |
| Color, spacing, typography, radius rules | `@docs/design-system/soma/token-rules.md` |
| Buttons, Chips, Icons, Checkbox, Grids | `@docs/design-system/soma/component-notes.md` |
| Open gaps, unconfirmed items | `@docs/design-system/soma/open-items.md` |
| Nova / `@nova/ui` implementation | `@docs/design-system/nova/quick-reference.md` |
| Token layering, spacing taxonomy debate | `@docs/design-system/nova/token-architecture.md` |
| Writing or reviewing component specs | `@docs/design-system/nova/component-spec-conventions.md` |
| Full historical Soma log (294 lines) | `@docs/design-system/archive/soma-foundation-log-full.md` |

## Repos and files

| System | Where it lives |
|---|---|
| **Soma (Figma)** | [Soma Design System](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System) — file key `hB1NzwMnZt2ALeR0OslaWi` |
| **Soma changelog** | Figma node `1016:14943` — enforced by `.cursor/rules/soma-changelog.mdc` |
| **Nova package (canonical)** | `ConsultingMD/nova-care-app` → `libs/ui` (`@nova/ui`) |
| **This repo (CareApp)** | Local Care App prototype; currently MUI v9; targets Nova stack over time |
| **Figma demos / audits** | Audit file `Vj1nqOqRqajNecKjw4vSoF` — not the shared MUI-for-Figma library |

## Cursor rules in this repo

| Rule | Scope |
|---|---|
| `soma-changelog.mdc` | Always on — update Figma changelog after Soma edits |
| `soma-figma.mdc` | On demand — points to `docs/design-system/soma/` |
| `careapp-react.mdc` | `src/**/*.{ts,tsx}` — points to `docs/design-system/nova/` |

## Maintenance

- Update distilled docs when a decision changes; append Soma changelog for Figma work.
- Canonical Nova ADRs and templates remain in `nova-care-app` under `libs/ui/docs/`.
- Do not duplicate ~440 lines as always-on Cursor rules.
