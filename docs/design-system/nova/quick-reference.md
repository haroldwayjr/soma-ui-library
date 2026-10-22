# Nova — quick reference

Nova is Included Health's design system for the Care App, packaged as `@nova/ui`. This repo (CareApp) is a local prototype; the **canonical package** lives in `ConsultingMD/nova-care-app` under `libs/ui`.

## Stack (settled)

| Layer | Choice |
|---|---|
| Primitives | Base UI (headless) — a11y and behavior from Base UI |
| Styling | Vanilla Extract only — no inline hex/rgb in components |
| Theming | Token-based light + dark via `data-theme` / OS preference |
| Font | Figtree, bundled locally in the package |
| Accessibility | **WCAG 2.2 AA** (not 2.1 — stale docs saying 2.1 are wrong). **Exception (2026-08-24):** Soma Soft Badge dark `surface/*/soft` `/900` fills and `/300` light borders are a **visual play**, not an a11y fix. |

## Markdown in repo, code local

**Commit as Markdown (design artifacts):** specs, ADRs, prompts, checklists, guidance under `libs/ui/docs/`.

**Engineering PR only (never direct design push):** `*.tsx`, `*.css.ts`, token source, Storybook, `package.json`, font binaries, raw Figma exports, `.mdx`.

Rule of thumb: if it compiles, renders, or themes → eng PR. If it's `.md` → safe to commit.

## Key paths (nova-care-app)

| Path | Purpose |
|---|---|
| `libs/ui/docs/TOKENS.md` | Token system documentation |
| `libs/ui/docs/DEFINITION-OF-DONE.md` | Per-component DoD |
| `libs/ui/docs/ACCESSIBILITY.md` | ARIA, keyboard, WCAG 2.2 AA |
| `libs/ui/docs/COMPONENT-STATUS.md` | Status table |
| `libs/ui/docs/prompts/nova-ui-component.md` | Standardized build prompt = acceptance gate |
| `libs/ui/docs/templates/COMPONENT.spec.md` | Spec template |
| `libs/ui/docs/adr/` | ADR-001 through ADR-004 |

## Prompts as acceptance criteria

- Maintain the **reusable** component prompt — not a running log of one-off prompts.
- Provenance lives in commit messages / PR descriptions.
- Optional: Provenance line in each `COMPONENT.spec.md` if audit becomes required.

## People

- Harold Way Jr — Staff Product Designer; design system lead
- Japheth Gonzalez, Stephen Gay, Tanya Chiu — design system collaborators
- Divya Clement, Chloe Wang — Care Team flow collaborators
- Matt — engineering; semantic spacing pushback

## Assistant preferences

- Tight, scoped, copy-paste-ready Cursor prompts with guardrails.
- Design-system-first — no one-off styles.
- **Soma UI builds:** semantic tokens + typography styles + library components only — never primitives, typed hex, or freehand fonts. If a component/token/style is missing, state the gap before building. See `docs/design-system/soma/component-notes.md` · `quick-reference.md` · `token-rules.md`.
- Data-dense layouts over marketing whitespace.
- Figma writes: use write-capable Figma MCP; demos in Audit file `Vj1nqOqRqajNecKjw4vSoF`.

## CareApp (this repo) note

CareApp currently uses **MUI v9** (`@mui/material`). Nova docs describe the target stack. When implementing here, align visual language with Soma tokens; migrate to `@nova/ui` patterns when the package is available in this repo.

**Soma icons:** Streamline **Regular 3.0** outline (24px grid, 1.5px stroke); **Bold 3.0** fill at xs only (`streamline-bold/`), never Regular-to-fill. Keep all size variants visible. Pair `*.alt` with its base. `icon/actions/check.circle` = **Check Circle 1** (check inside the ring), not Ultimate Check Circle. `icon/misc/light.mode` = **Light Mode Dark Light** (sun + crescent), not Light Mode Bw. Interior strokes T-join the outline — inset **½ stroke** at junctions (calendar rails, dumbbell bars in `icon/health/fitness`); one pass only, never multi-loop auto-inset. Refresh is **Button Refresh Arrow**. Filter is **Filter Sort Lines Descending**. Icon-only more (table rows, card overflow) is `icon/navigation/more.vertical` **xs bold**, not outline. `arrow.corner.left` / `arrow.corner.right` match `arrow.left` / `arrow.right` rotated 45°; at 24 the shaft is 14 and the chevron is 18.05 × 9.02 at 45°. Dropped: hand.wash, lungs, pregnancy, surgery, plus any set with no Regular+Bold 3.0 catalog pair. xs bold uses evenodd fills (911, heart). See `docs/design-system/soma/component-notes.md`.

**Soma Checkbox:** Drawn 1.5px check and dash, same width, centered. `icon/onBrand`; focus ring only on Focus visible.

**Soma Field.Error:** Error helper icon is `icon/danger`, not `icon/default`. Library `icon/status/error` stays default ink.

**Soma dark surface subtle:** All tones bind `/900` — brand `blue/900`, accent `purple/900`, success `green/900`, warning `yellow/900`, danger `red/900`.

**Soma warm primitives:** Yellow = lemon/gold warning (`#EDC93A` `/400` → `#E0B800` `/500` → `#C9A000` `/600` → `#8A7300` `/700`). Orange = tangerine accent (`#E87A00` `/600` → `#B85A00` `/700`). Red = rose/scarlet danger (`#F24646` `/600` → `#D13238` `/700`). Green success `/600` `#16B04A`. **`blue/800` locked `#002380`**; dark primary `blue/600` `#2B78F5`. Yellow ~52° vs orange ~34° — see `token-rules.md`.

**Soma Design Process:** 1920×1080 deck on the Design Process page — idea → Soma-aligned build. [Figma](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=2737-30957).

**Soma Chat / Message:** `Group` = None · Start · Middle · End for consecutive same-side bubbles. None/Start show identity; Middle/End hide name and fade the 20px avatar slot. Inner cluster corners `radius/xxs`; outer `radius/3xl`. Stack grouped bubbles `stack/xs` (4). Layout: `Content` FILL max 520, `Bubble` HUG max 480, body text HEIGHT-wrap — never FIXED skinny content. See `docs/design-system/soma/component-notes.md`.

**Soma brand surfaces:** `surface/brand/soft` = `blue/100` (Soft badges chromatic, chat bubbles, light brand wash). `surface/brand/subtle` = `blue/200` (tinted rows, stronger brand fill). Soft Badge chromatic fills bind `surface/{tone}/soft` (Neutral / Disabled → `surface/subtle`). Colors semantic mapping: `surface.brand.soft` · `surface.brand.subtle` (brand tree). `surface/ai` tree (`tealSoft` · `teal` · `blueSoft` · `purple`) = AI card fill-wash stops for paint style `gradient/ai/surface`. **Card / AI:** Card Style Default|AI → `Card.Root` variant default|ai; **`Card.Ai`** = composed recipe. Props `format` · `showLink` · `expanded` (Figma Link None|More|Less); collapsed max 3; sparkles xs bold + **`icon/ai`** (purple/600); stroke `gradient/ai/border` (`border.ai.start` → `border.ai.end`). Gradients foundation separate from solid primitives.

**Soma Button:** Tones Brand and Danger only (no Success). Contained brand labels are `text/onBrand`. Outlined and text (ghost) brand labels are `text/brand` / `icon/brand`, not `action/primary` or `text/primary`.

**Soma dark action.pressed:** Danger and secondBrand press to `/400`. On-fill text stays `grey/900`. (Button has no Success tone.)

**Soma dark action/secondary/hover:** `grey/800`.

**Soma body1:** 14 / 20 (`lineHeight/20`).

**Soma Badge:** Leading-icon examples use `icon/status/star` (outline). Soft/Outlined Rest bind `icon/{tone}` (Neutral `icon/default`); Solid Rest `icon/on{Tone}` (Neutral `icon/inverse`); Disabled `icon/disabled`.

**Soma Chip:** Filled = Badge Soft, Outlined = Badge Outlined. Tones Neutral / Brand / Accent / Success / Warning / Danger. States Rest, Hover, Focus visible, Pressed, Disabled. Masters grid matches Badge sticker (tone rows, slot columns, variant/state bands). Width hugs label plus dismiss or trailing icon; 4px label–dismiss gap. Medium dismiss: 2px top/bottom/right so the dismiss focus ring sits flush in the end-cap. Small leading avatar is 16px (scale the 20px Avatar sm root). Focus: `focus/ring` (Danger: `focus/ring/danger`).

**Soma Close:** Glyph is `icon/tertiary`, not `icon/default`.

**Soma Popover:** Close is Default size, not Compact. Glyph `icon/tertiary`.

**Soma Modal:** Close is Large (20px glyph, 32 hit), not Default. Glyph `icon/tertiary`.

**Soma Empty state:** Clear filters is outlined secondary; `stack/md` between body and CTA; copy stack unfilled.

**Soma Alert:** Tones Brand · Success · Warning · Danger. Soft = `surface/{tone}/soft` (`/100` light); Outlined = `surface/default`. **Grey chrome:** `border/subtle` + `shadow.md` on all tones (not tone-colored borders). **`Show accent`** toggles 4px left bar. Leading icons **xs bold** in a 24 Icon slot (tone on vector fills only — never on the `_bold` frame); Close **top-right** on multiline. Content includes **One action inline** / **Two actions inline** (title-only, CTAs vertically centered). **`Show secondary`** for optional Dismiss on inline one-action. Primary = contained **Brand** (Success/Warning too) or **Danger** — no green/yellow buttons; labels `text/onBrand`. Secondary = Button text/small with **`text/brand`** label. Inner frames unfilled. Dark sticker examples Soft-only. See `soma/component-notes.md`.

**Soma Avatar:** Size sm (20) · md (32) · lg (40); Content Image · Initials · Silhouette; Show presence. **Photo INSTANCE_SWAP** when Content=Image — Default + 10 named library members (Maya Chen, Jordan Ellis, Sam Okonkwo, Priya Nair, Luis Andrade, Alex Rivera, Dana Whitfield, Kenji Sato, Amara Diallo, Noah Patel). Pick Photo in the instance panel; do not detach or copy fills. See `soma/component-notes.md`.

**Soma Profile Menu:** L1 = account items + status nav row (chevron → L2). L2 = **Availability** (5) + **Work activity** (12). Avatar presence 12px (Online | Offline | Away | Busy). Menu signals 14px: green Available (`status/online` = `green/600` light · `green/300` dark), gray Unavailable, yellow Away tier, red work activity. See `component-notes.md`.

**Soma Care Plans example:** Overview **right** (340) + Tool rail. Tabs: default · Activity timeline · Care Pathways (Filters popover, Add modal, Active status menu, Maternity Standard Care). See `soma/component-notes.md`.

**Soma Tables:** No outer border. Header `surface/subtle` with top `radius/md`; rows use bottom `border/hairline` only.
