# Soma — quick reference

**Figma file:** [Soma Design System](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System) (`hB1NzwMnZt2ALeR0OslaWi`)

**Status:** Colors, Spacing, Typography, Elevation, Radius foundations built and published (team-scoped library). Buttons and Chips in progress. **Spinner / Spinner Inverted:** indeterminate only; xs–lg, Bare | Labeled, Style Track | Line. **Chips:** Filled | Outlined only (Badge color tones removed 2026-09-03). **Trailing:** None | Dismiss | Chevron (mutually exclusive). **Dismiss / Chevron controls:** shared shell (Medium 24 / Small 16); glyph 10 / 8; ink `icon/tertiary`; Hover well + Focus ring. Dismiss = close xs bold; Chevron = chevron.down xs outline. **Button tones:** Brand and Danger only (Success removed 2026-08-31). **Button disabled:** contained — `action/{tone}/disabled` fill + `onBrand`/`onDanger` (white); outlined/text — `text|icon/{tone}/disabled` via `brand*Transparent/20` / `danger*Transparent/20` (not shared grey disabled). **Colors map:** `text.brand` family (`.subtle`, `.disabled`) + `icon.brand.disabled` / `icon.danger.disabled`. **Button ghost fills:** outlined/text hover → `action/ghost/hover`; pressed → `action/ghost/pressed` (contained stays opaque `action/{tone}/*`). **Button States docs:** live Button instances (not detached). **Button width:** hugs label (all variants/states); with leading/trailing icon stay **HUG** — `FIXED` width smaller than content collapses optical side padding while the pad field still shows 16. **Button focus:** 2px ring, 2px outside (`focus/ring` / `focus/ring/danger`). **Button iconOnly:** small → xs (~1); medium → sm (1.5). Size switch updates icon via exposed nested instances. iconOnly always shows leading icon; `Show leading icon` applies to label layout only. **`Button / Filter` count badge:** wrapper hugs Button; badge absolute top-right (not fixed to the 40×40 icon box). Deprecated filter still forbidden. Icons and Grids scoped, not confirmed built. Not org-wide yet.

## File and library structure

- Soma is its **own Figma file**, separated from the legacy MUI-for-Figma vendor kit.
- Variables are **file-level** — duplicating a page does not fork tokens. Duplicate the Variable Collection for a true fork.
- Published incrementally per foundation area; keep publish history granular.
- Audit periodically for **stray external instances** (Anatomy: IH Design System, old MUI kit, etc.).

## Build rules (non-negotiable)

When building or editing **any** Soma master, variant, sticker, or app frame (Chat tasks, Chat Assist, APD, Care Plans, …):

1. **Semantic tokens only** — bind `text/*`, `icon/*`, `surface/*`, `border/*`, `action/*`, `radius/*`, `inset` / `stack` / `inline`, `shadow.*`, etc. **Never** bind color primitives (`blue/600`, `grey/900`, …) or type raw numbers/hex on UI. Raw Corner radius `12` is wrong even if px matches — use **`radius/xl`**. Cards/panels → **`radius/md`** unless a recipe says otherwise.
2. **No native hex. No native fonts.** Figtree only via published Soma **text styles** (`body1`, `subtitle2`, `caption`, `h5`, …). No Inter, system, or freehand Figtree with unbound size/weight/line-height. Do not hand-bind `fontSize/*` + `lineHeight/*` instead of a text style.
3. **Library components only** — instance published masters; do not detach to restyle.
4. **Gap gate** — if a needed component, variant, semantic token, or text style is missing: **state the gap first** (chat + `open-items.md`) **before** building anything custom. No silent invention or “close enough” freehand chrome.
5. **Done check** — panel shows linked-variable icons on **semantic** tokens (not primitives, not flat numbers/hex); text has a Soma style; chrome is live instances.

Full rules: `component-notes.md` · token tables: `token-rules.md`.

## Naming (non-negotiable)

| Layer | Convention | Example |
|---|---|---|
| Primitives | Slash nesting | `blue/600`, `coolDarkTransparent/40` |
| Semantic + other families | Dot notation | `text.onBrand`, `inset.md`, `shadow.md`, `radius.full` |
| Hyphens in reference material | Convert to dots | `shadow-md` → `shadow.md` |
| CSS custom properties | Stay hyphenated | `--button-brand-contained-bg` |

**Utility transparent ramps:** `coolDarkTransparent` / `coolLightTransparent` — `/10`–`/90` are grey-parity steps (`grey/100`–`/900` visual weight when composited), not literal opacity %.

**Primitive ramp parity:** `/400`–`/700` vivid-but-professional mid chroma; soft `/100`–`/300` unchanged; **`/800` clearly darker than `/700`** (~0.08 Y, not a near twin of base); **`blue/800` locked `#002380`**. Green hue ≈147°; `/400` `#6EDB82`, `/500` `#3ACC5C`, `/600` `#16B04A`, `/800` `#045623`. Yellow `/400` `#F0D033`, `/500` `#E8C000`, `/600` `#D0A800`, `/700` `#A3890B`, `/800` `#75600A`. Purple `/800` `#592C8A`; teal `/800` `#0E5555`. Status ramps (green · yellow · red) are a step more chromatic in `/300`–`/500`; `/500`–`/700` sit slightly brighter. See `token-rules.md`.

## Verification after any Figma write

1. Select an affected layer — confirm linked-variable icon in the panel, not a flat hex.
2. Scope rebinding passes to **one page at a time**; explicitly lock other pages out of scope.
3. Re-check foreground contrast **per state, per mode** — not just default.
4. **Icon batches:** zoom rectangular glyphs (calendar, messages) — no beveled/cut corners; interior dividers T-join the wall (½-stroke inset, not 1×). See Icons stroke-clip rule in `component-notes.md`. `icon/actions/empty.trash` is Streamline **Bin 2** (not the EMPTY-letter Bin). `icon/actions/refresh` is **Button Refresh Arrow** (not Synchronize Refresh Arrow 2). `icon/navigation/filter` is **Filter Sort Lines Descending**. `icon/actions/edit` is **Pencil**; `icon/actions/edit.alt` is **Common File Text Edit** (document + pencil — not a second Pencil). `icon/misc/sun` is Streamline **Weather Sun** (not Uv Sun). `icon/actions/upload` is **Upload Bottom** (not Upload Menu); `icon/actions/download` is **Download Bottom** (not Download Arrow). Navigation arrows use **round** caps/joins; shaft meets the chevron. `icon/navigation/arrow.corner.left` / `arrow.corner.right` — 45° shaft 14 and chevron 18.05 × 9.02 at Size=md; other sizes scale.
5. Finish with changelog entry (node `1016:14943`).

## Recurring bug patterns

1. **Dark-mode fill lightened, foreground not updated** — always re-check text/icon per state and mode.
2. **Dark fills on `/900` against `grey/900` canvas** — nearly invisible; use `/800` or lighter for distinct surfaces.
3. **Pressed state breaks default/hover fix** — check pressed separately every time.
4. **Broad rebinding passes** — touch only named pages; confirm nothing else changed.
5. **Polished page ≠ verified** — audit provenance before treating Grids/Icons pages as authoritative.
6. **Deliberate rule reversals** — document with date and rationale (e.g. Chips off `radius.full`).
7. **UI with primitives / hex / custom type / freehand chrome** — e.g. fill bound to `blue/600` instead of `action/brand`, Corner radius typed as `12` instead of **`radius/xl`**, or unbound Figtree. Bind **semantic** tokens + text styles; instance library components only. Missing piece → state the gap before building. See **Build rules** above.

## Publishing

- Publish ≠ public; sharing permissions control access.
- Each foundation area gets its own publish step with description after manual verification.
- Chips, Icons, Grids each get their own publish when confirmed — do not bundle.

## Typography

- Font: **Figtree**. Rem root **16px** (`htmlFontSize`); `fontSize/base = 14` is the MUI scale factor (both intentional).
- **caption:** 12 / 16, **Regular 400**, 0.75rem — dense meta, helpers, tip lines. Distinct from **body2** (12 / 18 prose) and from **subtitle3** (12 / 16 Medium). Bind the **caption** text style, not the `fontSize/12` primitive alone. See `token-rules.md` · `component-notes.md`.

## Profile Menu / StatusSelector

- **L1** `Profile Menu / Panel`: Account Settings · separator · **Profile Menu / Status nav** (signal + label + chevron) · Admin · Get help · Logout.
- **L2** `Profile Menu / Status Panel`: back chevron · **Availability** (5) · **Work activity** (12) — no duplicate Status section.
- Avatar presence **12px** (Online | Offline | Away | Busy). Menu **StatusSelector / Signal** **14px** in 20×20 frame.
- Signal tiers: `status/online` (`green/600` light · `green/300` dark) · `icon/disabled` · `icon/warning` (Away from Desk, Break, Meal) · `status/busy` (work activity).
- Full rules: `component-notes.md`.

## App Shell / Header actions

- Trailing header icons — theme, notifications, settings; **Nav=Menu** hamburger — bind **`icon/tertiary`**. Avatar and tab labels unchanged. See `component-notes.md`.

## Theme Menu

- **Deliberate exception:** **Menu / Popup** chrome + **Select / Item** rows (leading icon + trailing check) — System · Light · Dark. Not RadioItem; not a form Select / Field / Trigger. Icons: desktop · sun · moon. See `component-notes.md`.

## Menu / Panel

- Dropdowns → Assembled menus: **`Menu / Panel`** recipe masters only — Actions · Share · Account · View options · Sort by. Keep **`Menu / Popup`** as the surface master (do not rename — Base UI `Menu.Popup`). Theme stays **`Theme Menu / Panel`**. See `component-notes.md`.

## Menu vs Select

- **Menu / RadioItem** — exclusive choice inside a menu (Sort by, Density).
- **Theme Menu** — exception: Menu popup + Select / Item (icon + check), not RadioItem.
- **Select / Popup** — exclusive choice as a form/filter field (Assignee, etc.). Both stay; different jobs. Select / Item check = `check.bold` xs bold, `icon/brand`. Item labels = **subtitle2** (Medium), matching Menu. **body1** stays Regular for prose. See `component-notes.md`.

## Tables

- No outer table border. Header row **36px** — `surface/subtle` + top `radius/md`; row bottom `border/hairline` only. See `component-notes.md`.

## Lists / List Item

- [Lists](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1660-36665): **Compact / Single** = property rows (label · trailing value). **Compact / Multi** = Care Team person rows (**Avatar** md Leading · name · role; trailing off). No nested `surface/subtle` / outlined list well — Card/panel chrome only. See `component-notes.md`.

## Empty states

- [Empty states (WIP)](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3973-19911): `Empty state` — Size Compact · Default · Large × Media Icon · Illustration × Actions None · One · Two; root unfilled; icon well `surface/subtle` + `radius/full`; CTA outlined secondary (Two adds contained brand primary). Prefer over **Table / Empty state** for new work; **Compact · Icon · One** = table parity. See `component-notes.md`.

## Tabs

- **Tabs.List:** Size Compact | Nav (global only — not per tab); Style Hairline (`border/subtle`) | None (App Shell). Active indicator spans full tab width. Focus visible: `radius.sm` all corners + 2px inside `focus/ring`. Eight slots; **Show tab 3–8** to add items. Nested tabs FILL list height. **Type:** Rest etc. **`body1`**; Active **`h5`** + **`text/brand`**. See `component-notes.md`.

## Steppers

- [Steppers](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3232-52949): `Stepper / Indicator` + `Stepper / Step` — Tone Success · Brand; State Completed · Current · Upcoming; Layout Center · Inline · Vertical. Not Tabs or View switcher. See `component-notes.md`.

## Progress indicators

- [Progress Indicators](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1156-16401): **`Progress Circle`** ([Progress circles](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=4280-19824)) — sm · md · lg × Full | Semi × Brand | Success × Bare | Labeled × Progress 0–100 (linked value + arc); Label wraps. **`Progress Bar`** — linear determinate (same page). Indeterminate waits → **`Spinner`** / **`Spinner Inverted`** on Spinners. See `component-notes.md`.

## Loading indicators

- [Spinners](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3323-54489): `Spinner` · `Spinner Inverted` — xs · sm · md · lg; Bare | Labeled; Style Track | Line. Indeterminate only; prefer **Progress Bar** or **Progress Circle** on Progress Indicators when percent/duration is known. See `component-notes.md`.

## View switcher

- [View switcher](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3255-27450): Soft track | Elevated; Selected Case | Task | View 3 | View 4; `Show view 3/4`; 40px (matches Select/Button medium); track and segment `radius/sm` (6); Elevated selected thumb `shadow.sm`; flush pad 0; `border/subtle`. See `component-notes.md`.

## Tool rail

- [App components · Tool rail](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3171-48231): `Tool rail` (56) + `Rail / Icon` + states matrix. See `component-notes.md`.

## Text links

- [Text links](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1253-6995): **`Link`** Size **small** (`subtitle3` 12) · **medium** (`subtitle2` 14) · **large** (`h5`) — Hover = label underline + `action/primary/hover` (no fill); Rest / Focus / Disabled plain; Focus = `focus/ring` only. See `component-notes.md`.

## Accordions

- [Accordions](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=5315-58202): **`Accordion`** — Chevron **Leading** (default) | Trailing; Open; State; Body Description | List. **`Show meta`** + **`Meta`**. **`Show leading badge`** (after Title, Soft Warning) / **`Show trailing badge`** (Soft Neutral). Trailing edit icon **`icon/tertiary`**. Width: Fill in auto-layout parents (masters FIXED/min 200, internals FILL). Body=List → exposed **`Accordion / List body`**. See `component-notes.md`.

## Modals / Dialog

- [Modals](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1427-23823): `Dialog` Intent=Default | Destructive. Default = info + brand CTA; Destructive = error + danger CTA. No Warning/Success Dialog — use Alert for non-blocking status. See `component-notes.md`.

## Tooltips

- [Tooltips](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=702-6775): **`Tooltip`** (inverse hover/focus Simple | Rich). Text props **Label** · **Title** · **Description** (Side/Align keep copy). Root **FIXED** width (**minWidth** Simple 120 · Rich 160) + HUG height — drag edges wider to reflow. Persistent tips (e.g. IHP MCA) — **`Tooltip` Rich** open by default + composed **Close** dismiss; **Alert Soft Info Mini (Inline)** reopens after dismiss. **`Tooltip / Callout` removed 2026-09-10** — do not use. Footer actions → Popover. See `component-notes.md`.

## Logos

- [Logos](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3323-54623): `Logo / Dot` · `Logo / Dot / Lockup` · `Logo / Included Health` · `Logo / Care App`. See `component-notes.md`.

## Chat / Message

- [Chat bubbles](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3171-46189): `Chat / Message`; agent identity → `Logo / Dot` on Logos. Group corners + sides. **`Show timestamp`** (default false) + **`Timestamp`** text — caption / `text/tertiary` under the bubble. See `component-notes.md`.

## Chat / Response timer

- App components Masters — [`Chat / Response timer`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=4519-1751): Active count-up (“Member response time” | “Your response time”) or Closed dual stamp; Chat header trailing. See `component-notes.md`.

## Chat composer

- App components Masters — [`Chat / Composer`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=4547-3386): **Content** Empty · Filled · Multiline; **`Show rewrite`** (default true); master width **800**. Composed **Message field** (**HUG** **40–128**, **`surface/default`** + **`border/strong`**, **`radius/xl` (12)**) — message/placeholder **`body1`** (placeholder **`text/tertiary`**, value **`text/primary`**, same typography bindings as Text Input); MCA demo copy (`Write a reply to the member...`); **Attach** Button (text / brand / **small** / iconOnly, **`add`** **xs**) inside + text slot; **Rewrite** (outlined / brand / medium / iconOnly, **`edit.sparkle`** sm) + **Send** (contained / brand / medium labeled Button); row gap **8**, actions bottom-align on multiline. Not Text Input leading-icon attach. **Chat assist**, **Chat tasks**, and **APD compare plans** Composer frames instance this master. **`Chat / Clean up` removed 2026-10-09.** See `component-notes.md`.
- **Style / Modern:** [`Chat / Composer / Modern`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=5002-36752) (`5002:36752`) — `Chat.ComposerModern`; Content Empty · Filled · Multiline; **`Show rewrite`**; growing textarea + bottom toolbar inside one bordered **`radius/xl`** shell: Attach left, text Rewrite + circular contained Send right. Default placeholder `Write a message...`; classic remains `Chat.Composer`.

## App examples — APD compare plans

- [APD compare plans (WIP)](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3535-18169): Chat Assist shell + Compare panel. Frames — **Select plans** · **Compare table** · **Compare · Select open** · **Compare · IHP tips inline** · **Compare · IHP tips collapsed**. **IHP tips — two patterns:** (1) **Tooltip + Alert trigger** — **`Tooltip` Rich** open by default (`Tooltip · IHP tips`) + **Close** dismiss; **Alert Soft Info Mini (Inline)** reopens on Compare table · Select open; (2) **Inline disclosure** — **`IHP Tips / Disclosure`** (Expanded | Collapsed) on inline/collapsed frames. Gaps in `open-items.md`. See `component-notes.md`.

## App examples — Care Plans

- [Care Plans (WIP)](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=2777-37242): Overview **right** (340) + Tool rail. Frames — default · **Activity** · **Care Pathways** (+ Filters / Add / Status menu overlays). See `component-notes.md`.

## Brand surface ladder

**Changed 2026-09-09:** Soft Badge chromatic fills → **`surface/{tone}/soft`** (Neutral / Disabled → **`surface/subtle`**). **`surface/*/subtle`** unchanged for tinted rows, etc.

| Token | Light | Semantic mapping | Use |
|---|---|---|---|
| `surface/brand/soft` | `blue/100` | `surface.brand.soft` | Soft badges (chromatic), chat bubbles, AI summary, soft brand panels |
| `surface/brand/subtle` | `blue/200` | `surface.brand.subtle` | Tinted rows, stronger brand fill |

`surface/ai` tree (`tealSoft` · `teal` · `blueSoft` · `purple`) — stop semantics for paint style **`gradient/ai/surface`** (active **teal** + **purple**). Stroke: **`border/ai/start`** · **`border/ai/end`** (`gradient/ai/border`).

## Card / AI

- Card Style Default|AI → `Card.Root` variant default|ai; **`Card.Ai`** = composed recipe. Sparkles **xs bold** + **`icon/ai`** (purple/600). Stroke **`gradient/ai/border`**. Figma **Link** None|More|Less → `showLink` + `expanded`; collapsed max **3**. Gradients board [`5035:503`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=5035-503). See `component-notes.md`.

## Card / Plan · Card / Provider

- Composed selectable tiles on [Cards](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1388-22329) — not base `Card` axes. **Selected** False|True; chrome unselected `surface/raised` + `border/subtle` → selected `surface/brand/soft` + `border/brand`; pad **`inset/lg`**; **`radius/md`**; **`shadow.sm`**; nested **Checkbox / Control**.
- **Card / Plan** [`6596:592`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=6596-592): Title `h5` + Meta `caption`; optional Soft Accent Badge (`Show badge`). APD Select plans.
- **Card / Provider** [`6606:937`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=6606-937): Avatar **lg**; Header **MIN** (Avatar centers with checkbox); **`Link` large** (`h5`) + **`Button`** text/**tertiary**/small/iconOnly **`icon/actions/copy`** (`icon/tertiary` — rebind after Leading swap); Specialty `caption` (gap **0**); Soft Success + Neutral badges; Practice **`subtitle3`** **`•`** Address/distance **`caption`**; Phone **`caption`**/`text/brand`. Gaps: header→badges **8**, badges→details **16**. See `component-notes.md`.
- **Link** sizes: **large** (`h5`) · medium (`subtitle2`) · small. **Button** quiet icon actions: text / **tertiary** / small / iconOnly (`icon/tertiary`).
