# Soma — open items

Do not silently fix these — confirm or file explicitly.

## Color tokens

- [ ] `focus.ring` — only default + danger exist; success/warning/accent variants unconfirmed. Chips Focus visible uses `focus/ring`.
- [x] `border.success` / `border.warning` / `border.danger` / `border.accent` — exist (Badge / other). Chips no longer bind tone borders (Neutral Filled/Outlined only as of 2026-09-03). `border.info` still unconfirmed.
- [ ] `text.tertiary.onBrand` (dark) — product decision: AA-large-only or drop use.
- [ ] `surface.selected` — low contrast; rule is component-level pairing with border/icon, not a token fix.

## Typography

- [ ] Exact point sizes per Text Style not logged — confirm in Figma before binding.
- [ ] `radius.lg` value changed during radius expansion — confirm no broken Buttons bindings.

## Components / foundations

- [x] Chips — Filled/Outlined only (Badge color tones removed 2026-09-03) × Rest/Hover/Focus visible/Pressed/Disabled in Figma. Selected still not a variant.
- [ ] **Accordion / Disclosure** — APD Compare needs collapsed “Additional Plans” and “Task List” headers; currently composed (label + chevron). No published Accordion. **`IHP Tips / Disclosure`** ([`3634:1700`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3634-1700)) is a separate composed App pattern for IHP tips show/hide (Expanded | Collapsed) on **Compare · IHP tips inline** · **Compare · IHP tips collapsed**; Tooltip pattern (**`Tooltip` Rich** open by default + **Close** dismiss; **Alert Soft Brand Mini** reopens) remains on **Compare table** · **Compare · Select open**.
- [ ] **Side panel / Drawer** — Compare Plans chrome (title, Export, Close, optional back) is a composed frame on Chat Assist context slot; no Drawer master.
- [ ] **Plan select card** — checkbox + title + meta + optional Badge; composed for APD Select plans.
- [ ] **URL / Copy link field** — employer benefits link row; composed (bordered frame + link icon + Copy button).
- [ ] **Comparison table** — 3-col plan compare with section headers + Select triggers in column headers; Table / Row is Care-queue shaped — APD used Cell · text + composed rows.
- [ ] **Select / Item trailing status** — “Current” / “in use” meta on plan picker items; overlay text today (no trailing slot).
- [ ] **Chat composer** — production **circular send** still open (+ Start Chat Note where shown). **Done in Figma (2026-10-09):** App master **[`Chat / Composer`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=4547-3386)** — Content Empty | Filled | Multiline, **`Show rewrite`**; composed **Message field** (`radius/xl`, HUG **40–128**) with **Attach** Button (text / brand / small / iconOnly, **`add`** xs) + text slot + **Rewrite** (outlined / brand / iconOnly, **`edit.sparkle`** sm) + Send; row gap 8, bottom-align when multiline. **Chat assist**, **Chat tasks**, and **APD compare plans** example Composer frames instance the master.
- [x] **Chat / Response timer** — master + placed on Chat assist / APD / Chat tasks headers (2026-10-09).
- [x] **`icon/actions/edit.sparkle`** — Icons library (actions grid + Category · Actions); outline xs–lg + bold xs (2026-10-09).
- [x] **`Chat / Clean up`** — **removed 2026-10-09** (App master deleted; use Rewrite Button + `edit.sparkle`).
- [ ] **Empty state CTAs** — `Empty state` and **Table / Empty state** still instance orphaned `Button/outlined/secondary/*` (`9:11454` / `9:11458`). Live **Button** set is `Tone=brand | danger` only — no secondary. Confirm: restore `Tone=secondary`, or remint empties to `Variant=outlined, Tone=brand`, then delete orphans.
- [ ] **Table / Empty state → pattern** — keep the table-scoped name; rebuild internals as **`Empty state` Compact · Icon · One** (FILL width) so Member search and Tables stay on the shared master. Do not delete the table wrapper name.
- [x] **IHP tips (Tooltip pattern)** — Compare table · Select open: **`Tooltip` Rich** open by default (`Tooltip · IHP tips`) + composed **Close** dismiss; **Alert Soft Brand Mini** (“Share these tips with member”) reopens after dismiss. Not an Alert content variant. **`Tooltip / Callout` removed 2026-09-10.**
- [x] **IHP Tips / Disclosure** — App component: inline Expanded | Collapsed disclosure under IHP plan column; composed (Accordion unpublished). Frames **Compare · IHP tips inline** · **Compare · IHP tips collapsed**. Coexists with Tooltip pattern on compare frames — do not replace one with the other. Added 2026-09-09.
- [ ] Icons — foundation scoped, not confirmed built or published.
- [ ] Icons stroke-clip pipeline — library fixed 2026-08-24; still enforce inset-or-fill + `clipsContent=false` in `assets/icons/streamline*` import scripts so the next batch doesn’t regress.
- [ ] Grids — page exists, provenance unconfirmed; numbers not ratified.
- [ ] Dark-mode component docs beyond token layer — not started (Buttons light-only).
- [ ] z-index scale — not started.
- [ ] Motion / animation tokens — not started.
- [ ] Figma ↔ code pipeline — no export/sync; all decisions Figma-only until pipeline exists.

## Documentation / naming

- [ ] Buttons code examples import `@nova/ui` — naming inconsistency with "Soma"; needs decision.
- [ ] Component pages mode toggle — should every page get Light/Dark toggle?

## External instance audit

- [ ] Periodic file-wide audit for stray instances from other files (IH Design System, MUI kit, etc.).
