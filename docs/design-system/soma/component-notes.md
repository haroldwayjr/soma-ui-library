# Soma — component notes

## Mockups / app examples (non-negotiable)

Applies to every new or edited app frame — including [Chat tasks](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=4490-39171), Chat Assist, APD, Care Plans, and any other product mock. Same bar as masters: tokens + library components only.

### Tokens — bind, never type raw values

- **Radius, spacing, color, elevation:** bind Soma variables. A raw number in the panel (e.g. Corner radius `12`) is a bug even when the px matches a token — bind **`radius/xl`** (12), not a hardcoded `12`. Same for gap/padding (`inset.*` / `stack.*` / `inline.*`), fills/strokes (semantic color), and shadows (`shadow.*`).
- **Common radius map:** `radius/xxs` 2 · `xs` 4 · `sm` 6 · `md` 8 · `lg` 10 · `xl` 12 · `2xl` 16 · `3xl` 20 · `4xl` 24 · `full` pill. Cards / side panels default **`radius/md`** unless the component recipe says otherwise (composer Message field → **`radius/xl`**; pills → **`radius/full`**).
- **Do not** leave unbound hex, “mixed,” or local styles that duplicate a published token.

### Typography — styles only

- Apply published Soma **text styles** (`body1`, `body2`, `subtitle2`, `caption`, `h3`–`h5`, etc.) with their typography variable bindings.
- Font is **Figtree** via those styles — never Inter, system, or freehand Figtree with unbound size / weight / line-height.
- Prefer the style that matches the job (e.g. interactive labels → **subtitle2**; prose → **body1**; dense meta → **caption**) — see Typography below and `token-rules.md`.

### Components — library first; ask before inventing

- **Instance** published Soma masters from the library. Prefer variants and nested INSTANCE_SWAP over detaching or rebuilding chrome.
- **Do not** invent new components, parallel masters, or one-off patterns for a mock. If nothing fits: stop and ask (or note the gap in `open-items.md`) — do not ship a custom frame that looks “close enough.”
- **Do not** detach instances to restyle. Override exposed props / nested swaps only.
- Compose from existing pieces (Button, Tabs, Text Input, Card, Chat / Message, Chat / Composer, etc.) the way documented app examples already do.

### Acceptance check (before calling a mock done)

1. Spot-check Corner radius, Gap, Padding, Fill, Stroke — linked-variable icon in the panel, not flat numbers/hex.
2. Spot-check text — Soma text style applied; no custom font family or unbound type scale.
3. Spot-check chrome — live library instances, not detached or freehand rebuilds.

## Color primitives (see `token-rules.md`)

- **Yellow** = warning (lemon → gold). **`/200` `#F9F0C3`** is the pastel subtle fill. **`/400` `#F0D033`** interpolates `/300`→`/500` — gold, not khaki. **Orange** = warm accent (apricot → tangerine). **Red** = danger (rose → scarlet) — yellow reads lemon/gold; orange reads amber/tangerine; red reads rose then scarlet, not candy pink.
- **Mid-ramp (2026-09-04):** `/400`–`/700` use cleaner, more vivid chroma — professional, not neon. Soft `/100`–`/200` unchanged. Status ramps (green · yellow · red) are a step more chromatic in `/300`–`/500` than purple · orange · blue · teal; **`/500`–`/700` sit slightly brighter** (lemon/status vivid). **`/800` deepens** toward shared ladder ~0.08 Y for clear variance from `/700` base (yellow `#75600A` · green `#045623` · purple `#592C8A` · teal `#0E5555`; orange/red unchanged). **`blue/800` stays brand `#002380`**. **Blue** `/600` `#2B78F5`. **Green** hue ≈147°; **`/400` `#6EDB82`**, **`/500` `#3ACC5C`**, **`/600` `#16B04A`**, **`/700` `#0E8640`** — foliage, not sage or neon. **Yellow** `/300` `#F4E392`, `/400` `#F0D033`, `/500` `#E8C000`, `/600` `#D0A800`, `/700` `#A3890B`, `/800` `#75600A` — vivid gold status base. **Red** `/600` `#F24646`, `/700` `#D13238`.
- **`/700`** is the deeper AA base on purple–red–orange. Soft Badge / warning surfaces keep aliasing into `yellow/*`.
- Colors docs: under-swatch labels use fixed navy/grey — only the contrast chip uses white on dark fills.

## Typography

- **body1:** 14 / 20 (`lineHeight/20`), **Regular 400** — prose only (paragraphs, descriptions, helpers). Do not use for interactive list labels.
- **body2:** 12 / 18, **Regular 400** — compact multi-line prose at the 12px floor.
- **subtitle2:** 14 / 20, **Medium 500** — compact UI labels at body size (Select / Menu item labels, field item labels).
- **caption:** 12 / 16 (`lineHeight/16`), **Regular 400**, 0.75rem — dense meta, timestamps, field helpers / errors, tip lines. Same size as **subtitle3** / **subtitle4**; tighter than **body2**. Prefer caption for short dense UI copy; body2 for wrapped 12px reading. Not the `fontSize/12` primitive alone — bind the **caption** text style.

## Tooltip

- Figma: [Tooltips](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=702-6775).
- **Sticker Masters:** `❖ Tooltip` panel (dashed `surface/default` + `border/subtle`) — same icon + label pattern as Spinner / Progress Circle. Variant grid: columns **Start · Center · End**, rows **Top → Bottom → Left → Right**, **Simple** then **Rich**, even cell spacing. Mode Light · Dark wrap so both panels fit the sheet.
- **`Tooltip`** — inverse hover/focus hint (`surface/inverse`). Content **Simple** | **Rich** (title + description). Side × Align arrow placements. Published name is **Tooltip** (not Popup); nested `Tooltip.Popup` frames are Base UI anatomy slots only.
- **Text props:** **Label** (Simple) · **Title** · **Description** (Rich). Bind copy through these props — Side / Align swaps keep content. Switching Content Simple ↔ Rich uses different props (Label vs Title/Description); re-enter copy when changing Content type.
- **Layout:** Root width **FIXED** (drag-resizable) + height **HUG**; Popup FILL × HUG; text `textAutoResize=HEIGHT` + FILL. **minWidth** Simple **120** · Rich **160** (Left/Right root +6 for arrow). No maxWidth — drag horizontal edges wider and copy reflows. Left/Right arrow track stays **FIXED 6** wide (never FILL). Never HUG width on the root (blocks drag-resize) and never FIXED skinny width on Label.
- **Dismiss:** Default dismiss is pointer leave / blur. For **persistent tips** that open by default (e.g. IHP MCA tips), compose shared **Close** on the open Tooltip and keep Soft Brand Mini Alert as the re-open trigger — do not add a Callout component.
- **IHP tips (APD compare):** Open by default under the IHP column as **`Tooltip`** (`Content=Rich`, Side=Bottom, Align=Start) + **Close** dismiss. Trigger **Alert Soft Brand Mini** (“Share these tips with member”) reopens the Tooltip after dismiss. No separate Callout / Popover for this pattern.
- **vs Popover:** Tooltip = hint or persistent tip callout (title/body; optional composed Close). Need Accept/Cancel or links → **Popover / Popup**. Blocking confirm → **Dialog**.
- **Do not** duplicate Simple variants (e.g. Shortcut/⌘K twins) — conflicting property combos reset instance content.

**Fixed 2026-10-09:** Align **Start · Center · End** arrow tracks were swapped (Center used Start inset; Start used Center) — restored MIN+8 / CENTER / MAX+8.
**Changed 2026-10-09:** Simple **minWidth 120** · Rich **160** (Left/Right root +6).
**Changed 2026-10-07:** Masters sticker ❖ panel; variants on an even Side × Align grid (Simple then Rich); Mode Light/Dark wrap to fit.
**Fixed 2026-10-06:** Removed 12 duplicate Simple variants; exposed Label / Title / Description text props so Side / Align retains copy.
**Changed 2026-10-06:** Root width **FIXED** (drag-resizable) + height HUG; Simple **minWidth 200** · Rich **232**; wrap + drag-widen.
**Changed 2026-09-10:** Inverse hover set renamed **`Tooltip / Popup` → `Tooltip`**.
**Changed 2026-09-10:** Removed **`Tooltip / Callout`**; IHP tips use **`Tooltip` Rich** + composed **Close**; Mini Alert reopens after dismiss.
**Removed 2026-09-10:** `Tooltip / Callout` (duplicated Tooltip — do not reintroduce).

## Popover

- Close control uses nested **`icon/navigation/close` Size=sm** (20px), ink **`icon/tertiary`** — not Compact / Default (12/16) and not `icon/default`. Prefer Close **Size=Large** when the shared dismiss set maps Large → sm glyph.

## Modal / Dialog

- Figma: [Modals](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1427-23823). Master set: `Dialog` — **Intent=Default | Destructive**.
- Close control uses **Size=Large** (20px `icon/sm`, 32×32 hit), not Default or Compact. Nested glyph **Size=sm**, ink **`icon/tertiary`**. Booleans: **Show leading icon**, **Show close**.
- **Chrome (both intents):** Scrim `surface/overlayDark`; popup `surface/raised`, `radius.md`, `shadow.xl`, `border/subtle`, pad `inset/xl`. Focus trap + scroll lock (`modal=true`). z-index/modal = 1300.
- **Intent=Default** — confirmation / content. Leading `icon/status/info` (**md outline**) bound to **`icon/brand`**. Primary CTA Button **contained / brand**. Backdrop click + Escape dismiss OK.
- **Intent=Destructive** — irreversible / destructive confirm (AlertDialog recipe). Leading `icon/status/error` (**md outline**) bound to **`icon/danger`**. Primary CTA Button **contained / danger**. Prefer **`disablePointerDismissal=true`** (Escape only — no backdrop dismiss).
- **Not a tone matrix.** No Warning or Success Dialog. Caution that is not destructive → **Alert** (or Default Dialog + warning icon only when you must interrupt). Success feedback → toast / Alert, not a modal Intent.
- **vs Alert / Popover:** Alert = non-blocking status (Brand · Success · Warning · Danger). Popover = anchored, non-modal. Dialog = blocking confirmation/content only.
- **Do not** invent a Warning Button tone for Dialog — Buttons stay **brand | danger** only.

**Changed 2026-09-08:** `Dialog` Intent=Default | Destructive; Destructive = error icon + danger CTA (not a full Alert tone set).

## Close

- Shared dismiss. Hit ≥24×24 (WCAG 2.5.8). Compact 12px / 24 — dense headers only. **Default path for Popover / Modal / Tooltip / toast / dense overlay dismiss:** nested glyph **Size=sm** (20px) + ink **`icon/tertiary`** (Close **Large** 20 / 32 when using the shared size set — not Default 16). Large also covers Modal / Alert dialog.
- Glyph binds **`icon/tertiary`**, not `icon/default`. Library `icon/navigation/close` stays default ink; override at the Close instance.
- **Context panel / right-rail card header dismiss — do not use shared Close.** Use live **`Button`** — `Variant=text`, `Tone=secondary`, `Size=small`, `Layout=iconOnly` (**36×36**). Leading **`icon/navigation/close`** (swap exposed Leading; Chat panels use Size=sm outline in the slot — follow live instances). **Alignment:** panel keeps **`inset/md` (16)** pad; header trailing actions are absolute, pinned **MAX / CENTER**, with **10px** optical bleed into the right pad so the close **glyph** aligns with content (AI summary, fields). Header `paddingRight` = trailing width − 10. Panel **`clipsContent=false`**.

**Changed 2026-09-09:** Panel / Popover / card dismiss uses **Size=sm** close glyph + **`icon/tertiary`** (not Default 16 / Compact).
**Changed 2026-10-12:** Context panel dismiss → Button text/secondary/small/iconOnly; glyph aligned to content edge via 10px header bleed.

## Chat / Message

- Figma: [Chat bubbles](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3171-46189). Master: `Chat / Message`; agent identity uses `Logo / Dot` from [Logos](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3323-54623).
- **Sides:** Member left (`surface/subtle` bubble); Agent left (**text-only** — no bubble); Specialist right (`surface/brand/subtle` bubble). Identity on the first row; 20px avatar / `Logo / Dot` slot.
- **Agent (all Group states):** No bubble chrome — clear `Bubble` fill, padding, strokes, effects, and corner radii. Body sits as plain text under the sender name (`Logo / Dot` + “Dot”). `Content` is unfilled (inherits the thread surface). Keep `Bubble` as the HUG text slot with `maxWidth` 680; body `textAutoResize=HEIGHT` + FILL, `maxWidth` 648. Do not reintroduce `surface/subtle` (or any fill) on Agent.
- **Agent identity align:** `Sender row` **minHeight 20** (matches `Logo / Dot`) with **counter-axis CENTER** so the 12/16 caption centers on the mark. Root stays **counter-axis MIN** so the logo tracks the name row — not the message body.
- **Layout (non-negotiable):** root hugs height; `Content` is **FILL** with `maxWidth` 720 (never FIXED skinny width); `Bubble` **HUG** with `maxWidth` 680; body text `textAutoResize=HEIGHT` + FILL, `maxWidth` 648. Sized for the Chat Assist thread (~948) — long Specialist lines wrap less tightly than the old 520/480/456 caps. Short copy stays short; long copy wraps inside the cap — never a tall skinny column.
- **Member / Specialist — Standalone (`Group=None`):** 2px tail on the avatar-side top corner (`radius/xxs`); other corners `radius/3xl`.
- **Group** (consecutive same-side messages — iMessage/WhatsApp cluster, Soma tokens): `None` · `Start` · `Middle` · `End`. Not a nested group component — set **Group** on each message.
  - **Start:** identity visible; Member/Specialist outer corners `radius/3xl`; inner bottom `radius/xxs`. Agent Start is text-only (identity + body; no radii).
  - **Middle / End:** hide name; keep the 20px slot at opacity 0 so rows stay aligned. Member/Specialist Middle: both inner corners `radius/xxs`. End: inner top `radius/xxs`, inner bottom `radius/3xl`. Agent Middle/End stay text-only (no radii).
  - Specialist mirrors on the right edge.
- **Thread gap:** `stack/xs` (4) between grouped messages; `stack/sm` (8) or more between different senders / after `End`. Do not leave instance height overrides — they overlap the next row.

**Changed 2026-10-09:** Agent — text-only across None · Start · Middle · End (no bubble fill, padding, or radii); Member and Specialist bubbles unchanged. Agent `Sender row` minHeight 20 + CENTER so Logo / Dot and caption share a vertical center. Content / Bubble / Body maxWidth **720 / 680 / 648** (was 520 / 480 / 456).
**Added 2026-08-26:** `Group` variant on `Chat / Message`.
**Fixed 2026-08-31:** Member `Content` was FIXED ~88px; instances had stuck height overrides.
**Fixed 2026-09-10:** Chat Assist/APD instances — cleared stuck Body height overrides and ghost Avatar photo slots after Photo INSTANCE_SWAP; restored root/Content/Bubble HUG; restored Group Middle/End identity slot opacity 0 (was reset to 1 by Avatar swap); group cluster gap stack/xs (4).

## Chat / Response timer

- Figma: App components Masters — [`Chat / Response timer`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=4519-1751) (`4519:1751`).
- **Mode=Active** × **Respondent=Member | Advocate** — indefinite count-up (not countdown). Icon well `surface/subtle` + `radius/full` + `icon/comms/clock` sm outline (`icon/default`); label **caption** `text/secondary`; value **h5** `text/primary`. Labels: “Member response time” / “Your response time”. Gap **`inline/sm`**.
- **Turn rule:** show the party who must respond next — Member when the advocate last sent; Advocate when the member last sent. No urgency / warning / danger tones.
- **Mode=Closed** — dual stamp “Member Replied” | “You Replied” with relative ages (e.g. `62d`); labels **caption** `text/secondary`; ages **h5** `text/primary`; hairline **`border/hairline`**; gap **`inline/md`**; vertical pad **`inset/sm`**; no clock. Use for ended / historical chats.
- **Text props:** Value · Member value · Advocate value.
- Placed on Chat header (trailing) across Chat assist, APD compare plans, and Chat tasks example frames.

**Added 2026-10-09:** `Chat / Response timer` Active Member/Advocate + Closed dual stamp.
**Changed 2026-10-09:** Active labels “Member response time” / “Your response time”.
**Fixed 2026-10-12:** Timer values bind text style **h5** (was unbound SemiBold 14/20); labels stay **caption**.

## Chat composer

- Figma: App components Masters — [`Chat / Composer`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=4547-3386) (`4547:3386`).
- **Variants:** **Content=Empty** · **Filled** · **Multiline**. **`Show rewrite`** boolean (default true).
- **Anatomy:** Composed **Message field** (`radius/xl` (12), **HUG** **min 40** · **max 128**) — **Attach** **Button** + text slot inside the chrome — + **Rewrite** **Button** + **Send** **Button** (contained / brand / medium / label + send icon). **Chat assist**, **Chat tasks**, and **APD compare plans** example frames instance this master inside their Composer frames. **Not** a **Text Input** instance with a leading-icon slot on the composer master.
- **Composer row:** horizontal auto-layout, gap **8**, **`counterAxisAlignItems=MAX`** — **Rewrite** and **Send** **bottom-align** when the message field grows multiline; message field height **HUG** (**min 40** · **max 128**).
- **Text Input master (`464:4302`):** height **HUG** (`counterAxisSizingMode=AUTO`); **`minHeight` 40**, **`maxHeight` 128**; vertical pad **10**; **`counterAxisAlignItems=MIN`** — leading icon **top-aligns with the first line** of text when **`Show leading icon`** is used. Master corner radius stays **`radius/sm` (6)** for general forms — composer **Message field** does not rely on Text Input leading-icon props.
- **Message field:** composed chrome — fill **`surface/default`**, stroke **`border/strong`**, **`radius/xl` (12)**; horizontal auto-layout with **Attach** + text slot; vertical scale **HUG** (**min 40** · **max 128**). Pad binds spacing tokens — **`inset/xs`** (4) top · bottom · left, **`inset/md`** (12) right. No raw `2` / unbound pad. **Text slot** pad **`inset/sm`** (8) top · bottom · left. **Empty / Filled:** counter-axis **CENTER** so the **36** Attach sits optically middle in the field. **Multiline:** counter-axis **MIN** so Attach stays with the first line as the field grows. Not a pill. Do not swap a form **Text Input** with **`Show leading icon`** for attach on the composer master.
- **Composer row gap:** **`inline/sm`** (8) — bound, not a raw `8`.
- **Type (message / placeholder):** **`body1`** (Figtree Regular 14 / 20) with typography variable bindings (`fontSize/14`, `lineHeight/20`, etc.) — same recipe as **Text Input** value and placeholder slots. Placeholder ink **`text/tertiary`**; entered value **`text/primary`**.
- **Attach (`+`):** live **`Button`** — `Variant=text`, `Tone=brand`, `Size=small` (**36**), `Layout=iconOnly`. Leading **`icon/actions/add`** **xs** (swap exposed Leading instance). Sits **inside** the composed Message field (not Text Input leading-icon slot). Full Button states. Remove the external Attach paperclip from the composer row.
- **Rewrite:** live **`Button`** — `Variant=outlined`, `Tone=brand`, `Size=medium`, `Layout=iconOnly`. Leading **`icon/actions/edit.sparkle`** **sm** (swap exposed Leading instance). Instance name **Rewrite**; place **left of Send**.
- **Send:** trailing primary on the composer row; example frames still use the composed send control. Production **circular send** remains open — see `open-items.md`.
- **Width:** Master variants **FIXED 800** (was 720) — Message field **FILL**s the row; Rewrite + Send stay hug/fixed. Instances should **FILL** the chat column (not stay stuck at 720).
- **Demo copy (Content variants, MCA voice):** **Empty** — placeholder `Write a reply to the member...`. **Filled** — `I found three in-network cardiologists near Oakland — want me to share them?` **Multiline** — same opener + `Two have morning openings next week.` + `I can include telehealth options as well.` (vertical growth + bottom-aligned actions). Not member-asking-for-help copy.

**Added 2026-10-09:** App master **`Chat / Composer`** — Content Empty | Filled | Multiline; **`Show rewrite`**; Message field + Rewrite + Send row (gap 8, bottom-aligned actions).
**Removed 2026-10-09:** App master **`Chat / Clean up`** (circular broom + `icon/actions/clean`) — replaced by Rewrite Button + `edit.sparkle`.
**Changed 2026-10-09:** Composed Message field (**`surface/default`**, **`border/strong`**, **`radius/xl`**, HUG **40–128**; pad **`inset/xs`** · **`inset/md`** · **`inset/xs`** · **`inset/xs`**) with **Attach** Button (text / brand / **small** / iconOnly, **`add`** **xs**) inside — Empty/Filled **CENTER** Attach; Multiline **MIN**; Text slot **`inset/sm`**; row gap **`inline/sm`**; supersedes Text Input leading-icon attach on the composer master; message/placeholder **`body1`** + Text Input typography bindings, placeholder **`text/tertiary`** / value **`text/primary`**; MCA Empty · Filled · Multiline demo copy; master width **800**; **Rewrite** → outlined / brand / iconOnly (`edit.sparkle` sm); composer rows bottom-align Rewrite + Send; Text Input master vertical scale unchanged for forms (**min 40 · max 128 · pad 10 · HUG**).

## Logos

- Figma: [Logos](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3323-54623). Masters: `Logo / Dot` · `Logo / Dot / Lockup` · `Logo / Included Health` · `Logo / Care App`.
- **`Logo / Dot`** — 20×20 assistant mark for Chat / Message agent identity; not an Avatar.
- **`Logo / Dot / Lockup`** — mark + “Dot” wordmark (Figtree Medium, `text/primary`).
- **`Logo / Included Health`** — Style IH / Blue · IH / White · DOD (Soma-local; App Shell may still nest Anatomy `Brand logo mark` until migrated).
- **`Logo / Care App`** — IH / Blue mark + “Care App” wordmark (Figtree SemiBold 18 / `text/brand`), App Shell header lockup.
- **When to use**
  - **Dot** — Chat agent identity (20×20); never a member Avatar
  - **Dot / Lockup** — Dot headings and empty states
  - **Included Health** — Brand mark: Blue default · White on brand/dark · DOD for DoD only
  - **Care App** — App Shell header lockup (mark + wordmark)
- **`Logo / Dot` master** and **`Logo / Included Health` set** live on the Logos sticker Masters row (not off-page). Style demos below stay instances.

## Avatar

- Figma: [Avatar](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=943-13210).
- **Size:** sm (20) · md (32) · lg (40). **Content:** Image · Initials · Silhouette. **Show presence** boolean.
- **Photo INSTANCE_SWAP** (Content=Image only): **Default** + 10 named library members — Maya Chen, Jordan Ellis, Sam Okonkwo, Priya Nair, Luis Andrade, Alex Rivera, Dana Whitfield, Kenji Sato, Amara Diallo, Noah Patel. Preferred values = Default + those 10.
- **How to use:** pick **Photo** in the instance panel — do not detach or copy fills.
- **Initials:** ONE letter at sm; TWO at md/lg.
- **Presence:** nested **Avatar / Presence dot** (Status on the nested instance). Show presence is a no-op at Size=sm.
- **Library photos:** Avatars page lists the 10 members; set **Photo** on the instance rather than copying cells.

**Added 2026-09-10:** Photo INSTANCE_SWAP + named photo library (Default + 10 members).

## Empty state

- Figma: [Empty states (WIP)](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3973-19911). Master: `Empty state` — [`3980:955`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3980-955) · sticker [`3984:826`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3984-826).
- **Patterns** — no-data, filtered-out, and first-run placeholders for panels, cards, and full pages. Not blocking feedback (use **Alert**) or loading (use **Spinner** / **Progress Bar**).
- **Variants:** **Size** Compact · Default · Large × **Media** Icon · Illustration × **Actions** None · One · Two.
- **Props:** `Heading`, `Description`, **`Show description`**, **Icon** (INSTANCE_SWAP), **Illustration** (INSTANCE_SWAP).
- **Anatomy:** media → heading → description (optional) → actions. Root **unfilled** — inherit parent surface (panel, card body, table body). Never a solid white or `surface/default` fill on the root or copy stack.
- **Stack:** media · heading · description **`stack/sm`** (8); copy block → actions **`stack/md`** (16) — same body→CTA rhythm as **Alert** stacked actions.
- **Media · Icon:** circular well **`surface/subtle`** + **`radius/full`**. Well diameter **48** (Compact) · **56** (Default) · **64** (Large). Swap nested Icon via INSTANCE_SWAP (default `icon/navigation/search` outline). Library icon ink stays **`icon/default`** unless overridden.
- **Media · Illustration:** swap nested **`Illustration / Empty`** situation instances (INSTANCE_SWAP). Illustrations are not icon wells — no circular chrome.
- **Type:** **Compact** — heading **`h5`** + description **`caption`**. **Default** — **`h4`** + **`body1`**. **Large** — **`h3`** + **`body1`**. Heading **`text/primary`**; description **`text/secondary`** when shown.
- **Actions:** **One** — **`Button` outlined / secondary** (same recipe as **Table / Empty state** — e.g. “Clear filters”). **Two** — secondary outlined + **contained / brand** primary. **None** — copy-only. Do not use text/ghost CTAs here.
- **When to use size**
  - **Compact** — dense regions: table bodies, side panels, modals, narrow cards. **Compact · Icon · One** matches legacy **Table / Empty state**.
  - **Default** — standard page sections and card bodies.
  - **Large** — full-page or hero empty first-run / marketing-adjacent moments; prefer **Illustration** media.
- **vs Table / Empty state:** **`Table / Empty state`** stays **table-scoped** (embedded in table chrome). **`Empty state`** is the shared Patterns master — use for all new work outside table-specific composition. For table parity, compose **Compact · Icon · One**.
- **Do not** wrap the copy stack in a filled card. **Do not** use contained secondary or text-only CTAs. **Do not** invent parallel empty-state masters per product area.

**Added 2026-09-16:** `Empty state` Patterns master — Size × Media × Actions; icon well + `Illustration / Empty` swaps; outlined secondary CTA (Two adds contained brand primary).

## Alerts

- **Tones:** Brand, Success, Warning, Danger only — **Neutral** and **Solid** retired 2026-09-01.
- **Variants:** **Soft** (default), **Outlined**. No Solid fill variant.
- **Content:** Single line · Title + description · One action · Two actions · **One action inline** · **Two actions inline**.
- **Booleans:**
  - **`Show accent`** (default true) — 4px left bar; fill `action/{tone}` (Brand → `action/primary`) **except Warning → `icon/warning`** so accent matches the leading icon.
  - **`Show secondary`** (default false on One action*) — toggles Dismiss (`Button` text/brand small) in stacked **Button row** and **Actions inline**. Default true on Two actions*; on One action inline, turn on for secondary + primary on the same row.
  - **`Show leading icon`**, **`Show close`** — Close is **Medium** (24 hit), glyph `icon/tertiary`, **top-right** on multiline (title + description / stacked actions).
  - **`Inline actions`** — legacy; prefer **`One action inline`** / **`Two actions inline`** content variants (title-only row, CTAs centered).
- **Chrome:** Root **`clipsContent = true`** so the accent peeks with the banner radius; **`shadow.lg`** still paints outside (effects are not clipped).
  - **Soft:** 1px inside **`border/{tone}/subtle`** (light **`/300`** — blue/green/yellow/red) + **`shadow.lg`**.
  - **Outlined:** 1px inside grey **`border/subtle`** + **`shadow.lg`** (unchanged).
- **Surfaces:**
  - **Soft:** `surface/{tone}/soft` — light **`/100`** tints (`blue/100`, `green/100`, `yellow/100`, `red/100`); dark **`/900`**. Not `surface/{tone}/subtle` (`/200`).
  - **Outlined:** `surface/default` + grey **`border/subtle`** + **`shadow.lg`**.
- **Inner frames:** **`Main`** carries the opaque surface fill (required for accent peek — `surface/{tone}/soft` on Soft; `surface/default` on Outlined). `Content`, `Body`, action rows — **no fill** (transparent). Icon wrapper frames (`_outline` / `_bold`) stay **fill-off** — never bind `icon/{tone}` (or any paint) on the 14×14 `_bold` frame; that paints a solid square over the glyph. Bind tone on **vector fills** only.
- **Type:** **Soft** title **`text/primary`** (charcoal); **Outlined** title **`text/{tone}`**. Description **`text/secondary`** (both). Leading icon fills **`icon/{tone}`** — success/danger light **`/600`**, warning **`/700`**; **`icon/brand`** stays **`blue/800`** (navy, with outlined Brand buttons). Never **`icon/default`** on toned alerts.
- **Leading icons by tone:** Brand → `icon/status/info`; Success → `icon/actions/check.circle`; Warning → `icon/status/warning`; Danger → `icon/status/error`. **Size=sm, Style=bold** on every alert. Sit in a **24×24 Icon slot** so the glyph centers with Close (24) and the title line.
- **Actions (Buttons):** **Small text** only — both primary and secondary are Button **text / brand / small** (link-weight CTAs; no outlined or contained). Alert chrome already carries emphasis; outlined pills read heavy. Labels use **`text/brand`**. Gap `inline/sm` (8). Order: Dismiss · primary CTA.
- **Stacked actions** (One action / Two actions): `Body` = **Copy** (Title → Description, gap `space4` / 4) → **Actions stacked**, with Body gap **`stack/md`** (16) before the CTA row — same body→CTA rhythm as Empty state.
- **Inline actions** (One action inline / Two actions inline): **Title only** (single line — no description). CTAs on the same row, **vertically centered** with copy (`Main` / `Content` counter-axis `CENTER`). Two actions inline = secondary + primary; One action inline + **`Show secondary`** = optional Dismiss + primary.
- **Layout:** Root `radius/md` (8). `[Accent absolute full-bleed][Accent gap 4][Main: Icon slot | Body/Content | Close]` — Main opaque surface; Main pad 12, gap 12. **`Show leading icon` binds the Icon slot** (not the nested glyph) so the 24 slot + gap collapse and copy shifts left when off. **Title + description / stacked actions:** `Main` counter-axis **MIN**; title sits in a **24 Title row** (2px vertical pad) so Icon slot, title, and Close share one centerline. **Single line and inline:** `Main` counter-axis **CENTER** so Icon, title, CTA, and Close share one centerline.
- **Docs style variations:** Patterns → Alerts shows Soft / Outlined × Accent on / off (Brand · Title + description). Accent is a boolean, not a third variant.
- **App-composed IHP tips (not Alert):** Two **coexisting** patterns — (1) **Tooltip + Alert trigger:** **`Tooltip`** Rich open by default (`Tooltip · IHP tips`) + composed **Close** dismiss; **Alert Soft Brand Mini** (“Share these tips with member”) reopens after dismiss on **Compare table** · **Compare · Select open**; (2) **Inline disclosure:** **`IHP Tips / Disclosure`** (Expanded | Collapsed) under the plan column. Do not add as Alert content variants. **`Tooltip / Callout` removed 2026-09-10** — do not reintroduce.
- **Figma:** set [`1152:1533`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1152-1533) · sticker [`899:10977`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=899-10977) · docs [`899:10790`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=899-10790). **48** variants (4 tones × 2 variants × 6 content). Sticker = **Soft** and **Outlined** as side-by-side vertical grids (tone columns × content rows), beside **Dark · Soft**. No light Soft/Outlined instance gallery.

**Changed 2026-09-01:** grey `border/subtle` + `shadow.sm`; `/100` soft surfaces; Brand/Danger contained only; inline title-only content variants + `Show secondary`.

**Changed 2026-09-02:** Icon slot centers leading icon with Close; icons **xs bold** with tone on vector fills only (`_bold` frame unfilled); chrome **`shadow.lg`** (clip off); secondary label **`text/brand`**; Dark examples Soft-only; stacked actions **`stack/md`** after description; **24 Title row** + inline **`Main` CENTER** for icon/title/close(/CTA) alignment.

**Changed 2026-09-04:** Soft chrome **`border/{tone}/subtle`** (not grey); Soft titles **`text/primary`**; status icon light aliases **`/600`** (`icon/brand` stays **`blue/800`**); leading icons **sm bold** (20) in the 24 Icon slot.

**Fixed 2026-09-04:** Outlined masters had a stuck black fill behind `surface/default`; rebound all 24 from a white base so light mode resolves correctly.

**Changed 2026-09-04:** Sticker = Soft and Outlined vertical tone grids side by side with Dark Soft; light Soft/Outlined instance gallery removed.

**Changed 2026-09-04:** All Alert actions are Button **text / brand / small** (primary + secondary) — no outlined pills.

**Fixed 2026-09-04:** `Show leading icon` binds Icon slot so copy shifts left when the icon is off (was leaving a 24px empty slot).

**Changed 2026-09-04:** Docs Style variations show Soft / Outlined × Accent on / off; retired Neutral/Solid token matrix.

**Fixed 2026-09-09:** Warning accent → `icon/warning` (matches leading icon); accent peek structure (absolute full-bleed Accent + 4px gap + opaque Main) + root **`clipsContent = true`** for radius alignment.

**Changed 2026-09-14:** **`yellow/700`** `#A3890B` · **`/800`** `#75600A`; Light **`icon/warning`** → `yellow/700`.

**Fixed 2026-09-14:** Warning accent and leading icon vectors rebound to **`icon/warning`** (were hardcoded gold hex).

## Surfaces — brand ladder

**Changed 2026-09-09:** Soft Badge chromatic fills bind **`surface/{tone}/soft`** (`/100` light · `/900` dark), not **`surface/{tone}/subtle`**. Neutral and Disabled Soft stay on **`surface/subtle`**. **`surface/*/subtle`** aliases unchanged — still tinted rows, View switcher Soft track, Chat Specialist bubbles, etc.

- **`surface/brand/soft`** — lightest brand tint (`blue/100` light · `blue/900` dark). Soft badges (chromatic tones), chat bubbles, AI summary cards, other soft brand washes. **Not** AI-only — do not use `surface/ai` for fills (renamed). Colors → Semantic mapping: `surface.brand.soft` (above `.subtle` in the brand tree).
- **`surface/brand/subtle`** — one step stronger (`blue/200` light · `blue/900` dark). Tinted rows, stronger brand fill. Colors → Semantic mapping: `surface.brand.subtle`.
- **`surface/ai/gradient/1–4`** — AI summary gradient stops only; base fill still binds `surface/brand/soft`. Gradient rows stay `surface.ai.gradient.*` in mapping.

## App Shell / Header actions

- **Header action icons** (theme toggle, notifications, settings; **Nav=Menu** hamburger): bind **`icon/tertiary`**, not `icon/default`. Same de-emphasis pattern as Close and Popover dismiss.
- Library icon masters stay `icon/default` — override at the App Shell instance.
- **Avatar** and tab labels are unchanged; only the trailing utility icon buttons use tertiary ink.

## Menu / Panel (assembled dropdowns)

- Figma: [Dropdowns → Assembled menus](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=414-11966). Master set: `Menu / Panel` (`4217:1690`).
- **Do not rename `Menu / Popup`.** It is the Base UI `Menu.Popup` surface (chrome only: `surface/raised`, `border/subtle`, `radius/sm`, `shadow.lg`, `inset/sm`). Rows are already `Menu / Item` · `CheckboxItem` · `RadioItem`. The sticker demos Popup with one nested Item — that is surface + sample row, not a misnamed row master.
- **`Menu / Panel`** — published assembled recipes on Popup chrome. **Recipe:** Actions · Share · Account · View options · Sort by. Compose from Item / CheckboxItem / RadioItem / GroupLabel / Separator. Figma has no slot API, so recipes are fixed compositions (same pattern as `Theme Menu / Panel`).
- **Theme stays separate:** `Theme Menu / Panel` (Select / Item exception) — do not fold into `Menu / Panel`.
- **vs Select / Popup:** Menu panels are action / preference lists from a control; Select popups bind a form/filter field value.

### Menu row height (multiline)

- Labels: **subtitle2** 14 / 20. Truncate at **2 lines** (`textTruncation=ENDING`, `maxLines=2`).
- Row: **hug height**, **`minHeight` 36** (single line = 8 + 20 + 8). Two lines = **56** (8 + 40 + 8).
- Do **not** use FIXED 36 on wrapping rows — text overflows and collapses the gap to the next item.
- Panel `itemSpacing` stays **0**; vertical rhythm is the row’s own **pad 8 / 12 / 8 / 12**. Adjacent content edges stay 16px apart (8 + 8) whether rows are 36 or 56.
- Leading icon: keep **counter-axis CENTER** so the glyph centers to the full text block when the row grows.
- Same hug + 2-line truncate on **CheckboxItem** and **RadioItem**.

**Added 2026-10-06:** `Menu / Panel` recipe set.
**Changed 2026-10-06:** Assembled menus section shows `Menu / Panel` recipe masters only (example gallery removed).
**Fixed 2026-10-06:** `Menu / Panel` leading icons — outline only (cleared fills); Delete trash → `icon/danger`; Edit → `icon/actions/edit`.
**Fixed 2026-10-06:** `Menu / Item` · CheckboxItem · RadioItem — hug height (min 36), label max 2 lines; restores pad-driven row gap when wrapped.

## Theme Menu

- **Deliberate exception** — not Menu / RadioItem. Still **Menu / Popup** chrome (same popup as Sort by / Density); rows are **Select / Item** with **leading icon + trailing check** (not radio).
- **Trigger:** App Shell **IconButton / Theme** (`icon/misc/light.mode`, sm outline, `icon/tertiary`) — left of notifications. Opens the menu; not a binary toggle. **Not** a form **Select / Field / Trigger** — ephemeral UI preference only.
- **Preference (exclusive):** **System** (auto / OS) · **Light** · **Dark**. Default **System**. Structure unchanged: System → Separator → GroupLabel `Mode` → Light · Dark.
- **Leading icons:** System → `icon/misc/desktop`; Light → `icon/misc/sun`; Dark → `icon/misc/moon`. Trailing check = Select / Item recipe (`icon/actions/check.bold` xs bold, `icon/brand`).
- **Published composition:** `Theme Menu / Panel` on App components — convenience wrapper for App Shell demos; do not invent parallel row components.
- **Also documented on** Dropdowns → Assembled menus: Theme · Select / Item panel (icon + check exception).
- **Account menu slot:** `Menu / Item` with trailing value + chevron (`Theme` / `System`) drills into this panel as a submenu — do not put a Select field in the account list.
- **Sort by / Density** stay on **Menu / RadioItem** (`Menu.RadioGroup`) — radio + icon too busy for Theme; RadioItem has no leading-icon slot.
- Figma: [Theme Menu · Pattern](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3180-26743) · [Dropdowns](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=267-3472).

**Changed 2026-09-03:** Theme Menu switched to Select / Item (leading icon + trailing check); RadioItem recipe retired for Theme only.

## Menu vs Select (exclusive choice)

Not a conflict — different jobs. Keep both.

| | **Menu / RadioItem** (`Menu.RadioGroup`) | **Select / Popup** + **Select / Item** |
|---|---|---|
| **When** | Exclusive choice **inside a menu** opened from a control (icon button, overflow, account item, column header) | Exclusive choice as a **form / filter field** with a labeled trigger that shows the current value |
| **Examples** | Sort by, Density | Assignee, Status field, form dropdowns |
| **Selection chrome** | Leading **radio** (`Radio / Control`) | Trailing **check** (`icon/actions/check.bold` **Size=xs, Style=bold**, ink `icon/brand`; disabled → `icon/disabled`) |
| **Item label type** | Medium 14 / 20 (`fontWeight/medium` / subtitle2 metrics) | **`subtitle2`** (Medium 500) — same as Menu; not body1 |
| **Value binding** | Ephemeral UI preference / view option — not a Field | Form value — use with **Select / Field** / **Select / Trigger** |
| **Do not** | Use Select items inside Menu / Popup (except Theme — see below) | Use Menu / RadioItem as a form control |

**Theme exception:** Theme Menu uses **Menu / Popup** chrome but **Select / Item** rows (leading icon + trailing check) — not RadioItem, not a form Select. System · Light · Dark; same structure as before. Rationale: radio + icon too busy; RadioItem has no leading-icon slot.

**Submenu pattern:** Account `Theme` row = `Menu / Item` (trailing value + chevron) → submenu = Theme **Select / Item** panel (icon + check exception). Popup chrome stays Menu; rows are Select / Item — not a form Select field.

## Select

- **Select / Item** (and **Select / Multi Item**) labels: text style **`subtitle2`** (Figtree Medium 500, 14 / 20) — matches Menu / Item · RadioItem · CheckboxItem. Not `body1` (Regular).
- **Select / Item** selection mark: library **`icon/actions/check.bold`**, **Size=xs, Style=bold** (not outline). Ink **`icon/brand`**; Disabled → **`icon/disabled`**. Hidden when `Selected=False`.
- Matches Menu / CheckboxItem indicator weight (xs bold), not Regular outline Check 1.
- **Select / Trigger** trailing chevron: library chevron **Size=sm**, ink **`icon/tertiary`** — not Size=xs, not `icon/default`.

**Changed 2026-09-03:** Select item labels use subtitle2 (Medium) to match Menu list rows.
**Fixed 2026-09-03:** Select / Item check was `check.bold` Size=xs Style=outline — switched to Style=bold.

**Changed 2026-09-03:** Documented Menu RadioGroup vs Select popup rules; Theme called out as Select / Item (icon + check) exception.
**Changed 2026-09-09:** Select / Trigger chevron is **Size=sm** + **`icon/tertiary`**.

## Tables

- **Chrome:** No outer border around the table. Header row **36px** — `surface/subtle` with **top** corners `radius/md` (8); no stroke under the header — first row sits flush against the header fill. Body rows keep a bottom `border/hairline` only (no vertical rules).
- **Do not** wrap tables in a stroked `radius.md` frame — that boxed look is retired.

**Changed 2026-09-14:** Table / Header row height 36px (hug; was fixed 44).

## Lists / ListItem

- Figma: [Lists](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1660-36665). Masters: `List` + `ListItem`.
- **`ListItem` Density=Compact / Lines=Single** — Member Information property rows. Primary = label; Trailing meta = value (right-aligned). Trailing is **horizontal**: value → Badge → **Trailing icon** (16×16). Soft Success Badge for status (CCM); `Trailing icon` = `icon/actions/edit` for editable fields, ink **`icon/tertiary`**. **Never swap Badge for an icon** — Badge’s hug size stretches glyphs. Hide Badge / Trailing icon when unused (masters keep both visible so instances retain the slots). Leading stays off for Compact.
- **`ListItem` Density=Default / Lines=Multi** — All Tasks–style rows (leading icon + primary/secondary + trailing).
- Stack Compact rows in a gap-0 frame (Card body). Do not freehand key/value field frames.

**Changed 2026-09-09:** Compact trailing horizontal + Badge + 16×16 Trailing icon slots; Care Plans Overview remapped — never swap Badge for icons.

## Tabs

- **Tab** component set: Size Compact | Nav; State Rest | Hover | Active | Disabled | Focus visible. Optional leading icon + count badge. **Focus visible:** 2px inside `focus/ring`; **`radius.sm` (6)** on all four corners (bound `radius/sm`).
- **Tab · Compact / Tab · Nav:** size-locked item sets (State only). Used inside Tabs.List so Size is not exposed per tab.
- **Tabs.List** component set: **Size=Compact | Nav** (global only); **Style=Hairline | None**. Hairline = full-width 1px track under the list, fill `border/subtle` (`Tabs.Hairline` absolute, stretch X, pin bottom). Active **`Tabs.Indicator`** (2px `action/primary`, absolute, stretch X, pin bottom) spans the **full tab width** on that track — not label/content width.
- **Size control:** one Size on Tabs.List. Nested items are `Tab · Compact` or `Tab · Nav` — State, Label, icon, count only (no per-tab Size).
- **Adding tabs:** eight slots. Tab 1 and Tab 2 are always on. **Show tab 3–8** reveals more without detaching. Need more than eight → compose size-matched `Tab · Compact` / `Tab · Nav` (or `Tab`) in a local auto-layout (gap 4, same Hairline recipe).
- **Layout:** list gap 4px; nested tabs **FILL** list height; list counter-axis centered. Compact item pad **7 / 12 / 7 / 12** (34 default); Nav pad **0 / 12 / 0 / 12** (56). Keeps Rest/Active on one baseline when the list is stretched (e.g. 36 FILL).
- **Type:** Rest · Hover · Focus visible · Disabled — **`body1`** (Figtree Regular 14 / 20); ink quieter (`text/tertiary` etc.) — not Medium / subtitle2. **Active / selected** — label **`h5`** + **`text/brand`** (App Shell Nav and Compact; same hierarchy as Stepper Current). Do not put `text/brand` on Rest.
- **When to use:** Compact / page lists → Size=Compact, Style=Hairline. App Shell Nav → Size=Nav, Style=None (shell bar supplies the bottom edge).
- Figma: [Tabs](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1345-20423).

**Changed 2026-10-09:** Rest (and non-Active) labels use **body1** Regular — not Medium; Active stays **h5** + **text/brand**.
**Changed 2026-09-14:** Active / selected tab label uses **`h5`** + **`text/brand`**.
**Fixed 2026-09-11:** `Tabs.Indicator` spans full tab width (removed horizontal inset); Active underline aligns with `Tabs.Hairline` edge on the first tab. Focus visible ring — uniform `radius.sm` all corners (replaces sharp-top / soft-bottom). Label padding unchanged (Compact 7/12/7/12, Nav 0/12/0/12).

## Breadcrumb

- **Patterns** — hierarchical location trail (page / section ancestry). Not a Back Link (single-step return).
- Figma: [Breadcrumbs](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1696-36735). Masters: `Breadcrumb Trail` + `Breadcrumb / Link` · `Current` · `Separator` · `Home` · `Overflow`.
- **`Breadcrumb / Separator`:** decorative text **`/`** — **`body1`**, ink **`text/tertiary`**. Not a control; not a chevron icon.
- **`Breadcrumb / Link`:** ink **`text/secondary`** (hover **`text/secondary/hover`**) — not `text.link` and not tertiary.
- **`Breadcrumb / Current`:** **`subtitle2`** Medium + **`text/primary`**; maps to **`aria-current=page`**.
- **`Breadcrumb Trail`:** `ol` itemSpacing **`inline/xs`** (4). Optional **Home** leading segment; **truncate after 4** segments; **Overflow** → **Menu / Item**.
- **Do not** use as a Back Link or single-step return control.

**Changed 2026-09-17:** Separator chevron → text slash (`/`); trail gap **`inline/xs`**; Link ink **`text/secondary`**.

## Steppers

- **Patterns** — ordered multi-step progress (wizards, onboarding, checkout). Not Tabs (page/section nav) and not View switcher (in-page mode).
- Figma: [Steppers](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3232-52949). Masters: `Stepper / Indicator` + `Stepper / Step`. Sticker: Tone matrices, state hierarchy, Vertical Success vs Brand.
- **`Stepper / Indicator`:** Content **Dot** · **Number** · **Icon** × State **Completed** · **Current** · **Upcoming** × Tone **Success** · **Brand**. Host **32×32**; face **24**.
  - **Tone** only changes **Completed** (and completed connectors). Current is always brand; Upcoming always quiet.
  - **Completed · Success:** `action/success` + check xs (~10), ink `icon/onSuccess`.
  - **Completed · Brand:** `action/primary` + check xs (~10), ink `icon/onBrand`.
  - **Current:** `action/primary` + **1.5px** ring `border/brand`. Dot / Number (`text/onBrand`) / Icon (`icon/onBrand`).
  - **Upcoming:** Dot = `border/subtle` outline; Number/Icon = `surface/subtle` + `text/tertiary` / `icon/tertiary`.
  - **Props:** `Number` (TEXT). Swap nested Icon instance for glyphs.
- **`Stepper / Step`:** Layout **Center** · **Inline** · **Vertical** × State × Tone. Default nested Indicator **Content=Number**.
  - **State hierarchy (type):** Current label = **h5** SemiBold + `text/brand` (strongest). Completed label = **subtitle2** Medium + `text/primary`. Upcoming label = **body1** Regular + `text/tertiary` — never SemiBold. Description always **body2** Regular — `text/secondary` on Completed/Current, `text/tertiary` on Upcoming. **Do not** put `text/brand` on the description; brand stays on the Current label only so the title remains the focus.
  - **Connectors:** Completed → `border/success` (Success) or `border/brand` (Brand); else `border/subtle`. Hide last Vertical connector in product.
  - **Props:** Label, Description, Show description.
- **Content guidance:** Number for forms; Dot for minimal chrome; Icon when each step has distinct meaning.
- Distinct from **Progress Bar** and **Spinner** on Progress / Loading Indicators.

**Added 2026-09-03:** `Stepper / Indicator` + `Stepper / Step`; Patterns → Steppers sticker sheet.
**Changed 2026-09-03:** Tone Success · Brand; Completed green or brand; Current ring 1.5px; type hierarchy by state (Upcoming Regular; Current label `text/brand` only — description stays secondary); tighter check/icon glyphs.

## Loading indicators / Spinner

- Figma: [Spinners](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3323-54489). Masters: `Spinner` · `Spinner Inverted` (side-by-side on the sticker).
- Complements **Progress Bar** (determinate) on Progress Indicators — Spinner is indeterminate / short waits only.
- **Anatomy:** `Spinner.Root` / `Track?` / `Indicator` / round caps [/ `Label`]. When Track is on, Track + Indicator are the **same ellipse** with the **same `innerRadius`** (filled rings) — concentric by construction. Indicator 270° · centerline caps.
- **Size:** xs 12 · sm 16 · md 24 · lg 40 (stroke scales with size).
- **Layout:** Bare | Labeled. Labeled stacks “Loading...” (`subtitle3`; `subtitle2` on lg) · gap 8 (`stack/sm`).
- **Style:** **Track** (default) — ring under the arc. **Line** — arc only, no track.
- **`Spinner`:** default surfaces — Track `surface/muted` · Indicator/caps `action/primary` · Label `text/secondary` (follows Light/Dark modes).
- **`Spinner Inverted`:** brand fills / inverse surfaces — Track `coolLightTransparent/20` · Indicator/caps `icon/onBrand` · Label `text/secondary/onBrand`. Sticker masters sit on `surface/brand` for scannability.
- Use sparingly for short unknown-duration waits. Prefer **Progress Bar** or **Progress Circle** when percent/duration is known.
- **A11y:** `role=status` / `aria-busy` on region; graphic `aria-hidden`; honor `prefers-reduced-motion`.
- **Button loading** still uses internal `Icon / Spinner` — do not nest `Spinner` / `Spinner Inverted` inside Button.

**Added 2026-09-04:** `Spinner` on Loading Indicators (Size × Layout × Style Track | Line).
**Changed 2026-10-07:** Split `Spinner Inverted` masters onto a brand panel beside `Spinner`; Default track `surface/muted`; removed Appearance variant axis.

## Progress Circle

- Figma: [Progress Indicators](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1156-16401) · sticker [Progress circles](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=4280-19824). Master: `Progress Circle` (on sticker Masters row).
- **Variants:** Size **sm** · **md** · **lg** × Shape **Full** · **Semi** × Tone **Brand** · **Success** × Layout **Bare** · **Labeled** × Progress **0** · **25** · **40** · **50** · **75** · **100**.
- **Text props:** **Label** (default `Active users`; sm Semi default `Users`).
- **Progress:** Linked axis — sets value copy (`N%`) and indicator arc length together (plus tip cap). Do not hand-edit value text; change **Progress**.
- **Sizes:** sm **64** diameter / **6** stroke · md **96** / **8** · lg **128** / **10**.
- **Tokens:** Track **`surface/muted`** (same as **Progress Bar**) · Brand indicator **`action/primary`** · Success **`action/success`** · Value **`text/primary`** · Label **`text/secondary`**. Round caps on indicator and **Semi** track termini (`CapTrackStart` / `CapTrackEnd`).
- **Type:** Value — sm **`h5`** · md **`h4`** · lg **`h3`**; Label — **`caption`**, wraps (`textAutoResize=HEIGHT`) within ring/bowl max width (~58% Full · ~78% Semi).
- **Layout:** **Bare** — ring only. **Labeled** — sm Full: value inside + label below; **Semi** (all sizes): value + label stacked in the bowl; md/lg Full: label + value inside.
- **Shape:** **Full** — 360° clockwise from 12 o’clock. **Semi** — 180° top gauge, left→right; track termini use round caps.
- **Sticker:** Masters (Progress=40 grid) · Progress scale row · Overview matrix · curated Size / Shapes / Tones / Layout rows.
- **Use:** Dashboard metrics and completion %. Complements **Progress Bar** (linear determinate, same Progress Indicators page) and **Spinner** (indeterminate, Spinners page).
- **A11y:** `role=progressbar`; `aria-valuenow` / `min` / `max`; honor **`prefers-reduced-motion`**.

**Added 2026-10-07:** `Progress Circle` — Size × Shape × Tone × Layout; Full | Semi rings; Brand | Success tones.
**Changed 2026-10-07:** Masters on Progress circles sticker with ❖ icon + label panel; off-sheet masters frame removed; **Progress** variant links value + arc (replaces free Value text prop).
**Fixed 2026-10-07:** Track → **`surface/muted`**; Semi round track caps; Semi **Users** + chord-centered value; sticker Overview matrix; Label wraps inside ring/bowl.

## View switcher

- **Patterns sibling of Tabs** — exclusive in-page view mode (e.g. Case View · Task View), not page/section nav and not a binary Switch.
- Figma: [View switcher](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3255-27450). **One** component set — no `View switcher2` / stray masters. Dashboard and other app pages keep **instances only**.
- **Variants:**
  - **`Style=Soft track`** — track `surface/subtle`; selected segment `surface/brand/subtle` (no elevation). Flat brand wash.
  - **`Style=Elevated`** — track `surface/subtle`; selected thumb `surface/default` + soft shadow + **hairline `border/subtle`** on the thumb so it reads on light surfaces. Default live Dashboard toolbar recipe.
  - **`Border=False | True`** — when True, track stroke is **`border/subtle`** (not `border/strong`). Use on matching page fills when the track needs a hard edge.
  - **`Selected=Case View | Task View | View 3 | View 4`** — up to four exclusive segments.
- **Geometry:** Track and segment **`radius/sm` (6)**. Track pad **0** (flush thumb). Segment pad **10 / 12 / 10 / 12** → **40px** height (matches Select Trigger medium / Button medium). Gap 0. Root `clipsContent = false` so Elevated shadow is not cropped. Elevated selected thumb uses **`shadow.sm`** effect style.
- **Props:** `Show leading icon` + Case/Task/View 3/View 4 icon swaps and labels. **`Show view 3` / `Show view 4`** (default off) — turn on for 3–4 segment toolbars; rename labels (e.g. Recent · Groups · Archive).
- **Type / icons:** Selected label `text/brand` SemiBold; unselected `text/tertiary` Regular. Leading icons Selected → `icon/brand`; unselected → `icon/tertiary` (vector strokes/fills — never library `icon/default`).
- **Do not** fold into Tabs (underline / Hairline) or Switches (on/off). Do not publish parallel View switcher masters.

**Changed 2026-09-04:** Quieter `border/subtle`; Elevated thumb hairline + **`shadow.sm`**; Soft track on `surface/subtle`; track and segment **`radius/sm` (6)**; flush thumb; **40px** height; optional View 3 / View 4.

## Tool rail

- Figma: [App components · Tool rail](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3171-48231). Masters: `Tool rail` (56) + `Rail / Icon` + states matrix.
- Far-right shell chrome (Care Plans / Chat Assist). Icons are `Rail / Icon` instances (`Size=sm`).

## App examples — APD compare plans

- **Page:** [APD compare plans (WIP)](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3535-18169).
- **Shell recipe:** Chat Assist pattern — App Shell → member header → Workspace = **Chat column (FILL)** + **Compare panel (420 select / 520 table)** + **Tool rail (56)** with Coverage selected.
- **Frames:**
  - `Page · APD · Select plans` — plan picker (checkbox cards, employer link + Copy, Compare Plans CTA).
  - `Page · APD · Compare table` — side-by-side premiums/summary table, In Network filter, Export + Close.
  - `Page · APD · Compare · Select open` — same table + Select / Popup on plan column (Current / in use meta composed).
  - `Page · APD · Compare · IHP tips inline` ([`3634:3048`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3634-3048)) — **IHP Tips / Disclosure** Expanded under IHP column (no popover).
  - `Page · APD · Compare · IHP tips collapsed` ([`3634:3494`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3634-3494)) — **IHP Tips / Disclosure** Collapsed under IHP column.
- **Select plans sticky footer:** Match Care Pathways **Pathway header** recipe — title left (`text/primary`, Figtree SemiBold 16/24) + spacer FILL + primary CTA right; `border/subtle` hairline **above** the sticky block. **Task list** accordion sits under the CTA with its own top `border/subtle` hairline (same as other Care Plan accordions). Do not run Task list chrome into the CTA row.
- **Hairlines (Select plans):** `border/subtle` 1px above **Additional Plans** (accordion) and above the **Compare Plans** sticky CTA bar.
- **IHP tips (two coexisting patterns):**
  - **Tooltip + Alert trigger** (Compare table · Compare · Select open): **Open by default** — **`Tooltip`** instance `Content=Rich`, `Side=Bottom`, `Align=Start`, named **`Tooltip · IHP tips`** (inverse surface). Title: *Don't forget to share these tips with the member*; description: three bulleted tips (MCA copy). **Dismiss:** composed shared **Close** (`Close · dismiss tips`). **Re-open:** **Alert Soft Brand Mini** (“Share these tips with member”) under the IHP column. Open state is an absolute overlay on the Context panel, anchored under the IHP column; Premiums sit directly under plan selectors.
  - **Inline disclosure — IHP Tips / Disclosure** (App component [`3634:1700`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3634-1700)): **State=Expanded | Collapsed**. Quiet panel — `surface/subtle` + `border/subtle` + `radius.md` + `inset/sm`; **not** Alert Mini. Type: title **subtitle4** (12/16 SemiBold); tips **caption** (12/16) with SemiBold lead-ins (`text/primary`) + Regular rest (`text/secondary`). **Expanded:** full tips + **Hide** (subtitle3/`text/brand`) + chevron.up. **Collapsed:** same chrome; lead-ins only (`text/secondary` Medium) + **Show** + chevron.down. 225px plan-column width. Frames: **Compare · IHP tips inline** · **Compare · IHP tips collapsed**. Do not invent a new Popover for inline show/hide.
- **Compare panel icons:** Plan / network **Select / Trigger** chevrons — nested glyph **Size=sm**, ink **`icon/tertiary`**. **Panel header dismiss:** **`Button`** text / secondary / small / iconOnly + **`icon/navigation/close`** (Context panel recipe — not shared **Close**). Do not leave chevrons at Size=xs or use `icon/default`. IHP tips overlay dismiss stays composed shared **Close** (above).
- **Soma used:** App Shell, Breadcrumb, Badge, Button, Avatar, Chat / Message, Text Input, Tool rail / Rail / Icon, Checkbox / Control, Close (IHP tips dismiss only), Select / Trigger · Item · Popup, Tooltip, Alert, Table / Cell · text, IHP Tips / Disclosure.
- **Chat header:** trailing **`Chat / Response timer`** (Active turn or Closed dual stamp) on example frames.
- **Gaps (composed, not published):** Accordion/disclosure, side Drawer chrome, plan select card, URL+Copy field, comparison Table variant (section headers + plan Select columns), Select / Item trailing status meta, chat composer — example frames document composed Message field + **Attach** / **Rewrite** Buttons; production **circular send** still open. See `open-items.md`.

**Added 2026-09-08:** Three APD compare plans app example frames on Chat Assist shell.
**Added 2026-09-09:** IHP tips on **Compare table** · **Compare · Select open** — Alert Soft Brand Mini re-open trigger + tips panel under the IHP plan column.
**Added 2026-09-09:** **`IHP Tips / Disclosure`** inline pattern (Expanded | Collapsed) + **Compare · IHP tips inline** · **Compare · IHP tips collapsed** frames; Tooltip pattern unchanged on compare frames.
**Changed 2026-09-09:** IHP Tips / Disclosure — quiet `surface/subtle` panel; **subtitle4** title + **caption** tips; Collapsed matches Expanded chrome (lead-ins only).
**Changed 2026-09-10:** IHP tips open state → **`Tooltip` Rich** + composed **Close** dismiss; Alert Soft Brand Mini reopens after dismiss. **`Tooltip / Callout` removed** — do not document or reintroduce.

**Changed 2026-09-09:** Select plans sticky Compare CTA title row aligned to Care Pathways pathway-header pattern; hairlines above Additional Plans accordion and sticky footer.
**Changed 2026-09-09:** Compare panel Select chevrons + Close dismiss use **Size=sm** + **`icon/tertiary`**.
**Changed 2026-10-12:** Compare Context panel header dismiss → Button text/secondary/small/iconOnly (same as Chat Assist / Chat tasks); tip dismiss stays Close.

## App examples — Care Plans

- **Page:** [Care Plans (WIP)](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=2777-37242).
- **Shell recipe** (Member Profile pattern): App Shell → page header → member Nav tabs → Workspace = **Care Plan column (FILL)** + **Overview Card (340)** + **Tool rail (56)**. Overview on the **right**; tool rail far right — not production’s left Overview.
- **Frames:**
  - `Page · Care Plan · Mock_green Mock_spinka` (`2919:1657`) — default / At a Glance + Problems.
  - `Page · Care Plan · Activity · …` (`2941:25446`) — **Activity** active; Care Team View; info Alert; Status/Type filters; Jun expanded rows + May collapsed (strikethrough cancelled) + Pagination.
  - `Page · Care Plan · Care Pathways · …` (`2942:28182`) — **Care Pathways** active; Filter count badge; recommendation Alert; **Maternity Multifetal Pregnancy** (Active) + **Maternity Standard Care** (Not Started) objective tables (no outer border).
  - Overlay variants: **Filters** (`2945:25445`) · **Add** modal (`2945:25753`) · **Status menu** on Active (`2945:26061`).
- **Overview:** Member Information + Care Team from **Card** — no Overview panel master. Member fields = stacked **`ListItem` Compact / Single** (Primary = label, Trailing meta = value; optional Soft Success Badge or trailing `icon/actions/edit`). Not freehand field frames. Keep Card for panel chrome.
- **Care Team:** person list — avatar + stacked name (`text/primary`) / role (`text/secondary`); section title matches Member Information (`h4`); no Provider/Role column headers in the 340 Overview.
- **Pathway / objective status (interactive):** **`Chip` Filled · Small · Trailing=Chevron** — not Badge + external chevron. Opens status Menu. Read-only status (e.g. Problems Unverified) stays **Badge**.
- Clone the workspace; do not invent a new shell.

**Changed 2026-09-09:** Overview Member Information field rows → `ListItem` Compact / Single (label + trailing value; Badge / edit).
**Changed 2026-09-09:** Care Pathways interactive status → Chip Filled Small · Trailing=Chevron.


## Profile Menu / StatusSelector

- **Single source of truth:** header **Avatar** opens **Profile Menu / Panel (L1)** — no standalone status trigger in the header.
- **Two levels:** L1 = account actions + **Profile Menu / Status nav** (current status + chevron → L2). L2 = **Profile Menu / Status Panel** (full list).
- **L1 items:** Account Settings · separator · status nav row · Admin · Get help · Logout.
- **L2 groups:** single **Availability** section (no duplicate Status block) + **Work activity**.
- **Avatar presence** (12px, unchanged): **Online** = Available; **Offline** = Unavailable; **Away** = Away from Desk, Break, Meal; **Busy** = work activity.
- **Menu signals** (**StatusSelector / Signal**, 14px dot in 20×20 frame — larger than avatar): **Available** = filled `status/online` (`green/600` light · `green/300` dark — one step lighter than `action/success`); **Unavailable** = `icon/disabled` ring; **Away tier** (Away from Desk, Break, Meal) = `icon/warning` ring; **Work activity** = `status/busy` ring.
- **Availability (5):** Available, Unavailable, Away from Desk, Break, Meal.
- **Work activity (12):** Catch Up Time, Coaching, Complex Case, Meeting, Outreach, Project, Shift Wrap-up, Special, System Issue, Task Time, Tickets, Training.
- Checkmark (`icon/brand`) = **selection**; dot = **status meaning**. Labels stay `text/primary` (authoritative).
- **Interaction:** Avatar → L1; status nav → L2; select row → update checkmark + avatar presence; menu closes on selection; Escape closes; keyboard nav follows Menu / listbox. Row states: Rest, Hover, Focus visible, Pressed.
- **Legacy:** six-row **StatusSelector / Panel** + **Select / Trigger** retained for reference.

## Badges

**Changed 2026-09-09:** Chromatic Soft fills → **`surface/{tone}/soft`** (Neutral → **`surface/subtle`**; Disabled → **`surface/subtle`**). Strokes unchanged.

- Variants: Soft (default), Solid, Outlined. Tones: Neutral, Success, Warning, Danger, Brand, Accent.
- **Soft fill:** `surface/{tone}/soft` (Neutral uses `surface/subtle`; Disabled uses `surface/subtle`). **Soft stroke:** `border/{tone}/subtle` (1px inside), not ramp primitives.
- Light Soft borders are `/300`. **Dark Soft fills:** `blue/900`, `purple/900`, `green/900`, `yellow/900`, `red/900` (via `surface/{tone}/soft`). Dark Soft borders are `/800` (success/warning/danger) or `/700` (neutral/brand/accent). `/900` fills are a **visual exception**, not a contrast fix — see `token-rules.md`.
- Disabled Soft uses `surface/subtle` fill; stroke stays the tone subtle border.
- Geometry: `radius.sm` (6), padding 6 / 2, label–leading gap 6.
- **Leading icons (non-negotiable):** match label semantics — never leave `icon/default` on toned badges.
  - Soft / Outlined Rest → `icon/{tone}` (Neutral → `icon/default`)
  - Solid Rest → `icon/on{Tone}` (Neutral → `icon/inverse`)
  - Any Disabled → `icon/disabled` (cross-tone — Buttons use tone-step disabled instead; see Buttons)
  - Status dots already follow this map; Leading=Icon must too
- **Leading-icon examples:** every `Leading=Icon` master uses `icon/status/star` (Regular outline), not `star.filled` and not tone-specific status glyphs. Bind strokes to the tone map above (Soft/Outlined Rest `icon/{tone}`, Solid Rest `icon/on{Tone}`, Disabled `icon/disabled`).

### Care App — member header badges

Member profile / conversation headers stack Soft Badges in a horizontal row (gap `inline/xs`–`sm`). Prefer **Soft Neutral** for metadata; reserve chromatic Soft (Accent · Brand · Success · Warning · Danger) when the label itself carries status meaning. **Cap the meta badge row at 3** — pick the densest signals for the surface.

| Badge label | Tone | Role |
|---|---|---|
| Plan name (e.g. `CalPERS PPO Basic Plan`) | Soft Neutral | Coverage plan — tippable for plan/network detail (replaces plan text link in Chat Assist meta) |
| `Primary` | Soft Neutral | Coverage / relationship role — primary insured |
| `VIP` | Soft Accent | Special designation — chromatic so it scans in a Neutral row |

**Also used in product (not every mock):** employer / account (e.g. `Google`), `CCM Enrolled: Care Manager` — Soft Neutral; swap into the 3-badge budget when more relevant than VIP or plan.

**Chat member meta (Assist · Tasks · APD):** `DOB` · `Member ID` (`text/secondary`) → **Member badges** (max 3): Soft Neutral tippable **plan** · Soft Neutral tippable **`Primary`** · Soft Accent **`VIP`**. Not a Chip, not a Tag, not a brand text link for the plan.

**Do not** use Chip Trailing=Chevron for these read-only qualifiers. Interactive pathway status stays **Chip** (see Care Plans).

### Badge + hover tip

When a badge holds truncated or secondary metadata, compose shared **`Tooltip`** on hover/focus — do not invent a Badge-owned tip component. Default dismiss = pointer leave / blur (see Tooltip). Prefer **`Content=Rich`** for labeled pairs or short stacks; **Simple** only for a one-line hint.

- **Affordance:** tip-capable badge labels use a **dotted `text/brand` underline** on the label (not a solid link underline). Badges without extra metadata stay plain — no underline, no tip.
- **Placement:** `Side=Bottom`, `Align=Center` under the badge; inverse `surface/inverse` tip with arrow toward the badge.
- **Copy:** short label → value (or label → bullet list). Keep tip scannable — two blocks max.

**Hover tip examples (Care App):**

| Trigger badge | Tip content |
|---|---|
| Plan (`CalPERS PPO Basic Plan`) | **Plan Name:** Aetna Choice · **Network Name:** Aetna Choice |
| `Primary` | **Caregiver for:** — None · **Receiving care from:** — None |
| `VIP` | **VIP reason** (or eligibility note) — one short line; omit tip if the badge label is self-explanatory |

**Open tip demos:** Chat Assist main — plan tip. Chat Assist · advocacy request + Chat Tasks main — **Primary** tip. Other chat mocks keep plan + Primary tippable (underline) without an open tip in-frame.

**Added 2026-10-09:** Care App member-header badge recipes + Badge + Tooltip hover tip pattern (dotted brand underline affordance; Rich tip examples).
**Changed 2026-10-09:** Chat Assist · Chat Tasks · APD mocks — meta **Member badges** max 3: Soft Neutral tippable plan + Primary, Soft Accent VIP; plan + **Primary** **Tooltip** Rich hover demos (dropped plan text link, Google, CCM from the row).

## Buttons

- Tones: **brand**, **danger** only — Success removed 2026-08-31. Variants: contained, outlined, text (ghost).
- States: default, hover, `focus.visible`, pressed, disabled, loading.
- **Foreground family:** Contained brand uses `text/onBrand` / `icon/onBrand`. Outlined and text (ghost) brand use `text/brand` / `icon/brand` — not `action/primary` (fill) and not `text/primary` (body). Danger outlined and text follow `text/danger` / `icon/danger`. Disabled outlined and text use `text/{tone}/disabled` / `icon/{tone}/disabled` (faded brand/danger, not mid-ramp). **Contained disabled** keeps `text/onBrand` / `icon/onBrand` (or onDanger) — solid white on `action/{tone}/disabled` fill.
- **Fill by variant:** Contained uses opaque `action/{tone}/*` (rest / hover / pressed). Outlined and text (ghost): hover → `action/ghost/hover`; pressed → `action/ghost/pressed`. Never layer `action/pressed/overlay` — deprecated and hidden from publishing; do not export or implement it.
- **`action/ghost/*` mapping:** Light `coolDarkTransparent/10` (hover) · `/20` (pressed). Dark `coolLightTransparent/10` · `/20`. Utility ramp steps are grey-parity weights, not literal opacity (see `token-rules.md`).
- **A11y (WCAG 2.2):** Brand outlined/text — AAA on white and `surface/subtle` (hover/pressed, light); AAA/AA dark. Danger hover — AA on white and subtle (light). Danger pressed on `surface/subtle` (light) — **4.48, AA Large only** (~0.02 below normal AA 4.5); passes AA on white (4.93). Dark danger — AAA/AA all states.
- **Dark contained ramp:** rest → hover → pressed lightens like primary (`/600` → `/500` → `/400`). Danger pressed `red/400`, secondBrand `purple/400`. On-fill text/icon stays `grey/900`.
- **Dark `action/secondary/hover`:** `grey/800` (not `/700`) so hover rows read against `grey/900`.
- **Disabled (tone-step, not cross-tone grey):** **Contained** — fill `action/primary/disabled` or `action/danger/disabled` (**no stroke**); label/icon `text/onBrand` / `icon/onBrand` (or onDanger). **Outlined** — stroke binds disabled foreground token (not `border/{tone}/subtle`); label/icon `text/{tone}/disabled` / `icon/{tone}/disabled`. **Text (ghost)** — no fill (same chrome as default/loading); label/icon `text/{tone}/disabled` / `icon/{tone}/disabled`. Do not use shared `surface/disabled` or `text/disabled` on Buttons.
- Anatomy: hug width (auto-layout `HUG` — never `FILL` / fixed for label length), min-height ≥44px (medium), `radius.full`, padding `inset.md`/`inset.sm`, icon gap `inline.xs`. **With leading/trailing icon:** width must stay **HUG** — a `FIXED` width smaller than icon + gap + label + pads collapses side padding optically (e.g. ~5.5px L/R) even when the padding field still shows 16 (`inset.md`). **Focus:** locked absolute `focusring` frame — 2px stroke (`focus/ring` / `focus/ring/danger`), **2px outside** the button (`x/y = -4`, size = button + 8, stroke inside). Keep root horizontal auto-layout on focus (same chrome as default); do not use a detached ring sibling in-flow or a Face wrapper that splits the hit target.
- **Icon sizing (Leading vs Trailing):** **Leading** — **medium → sm (20px native); small → xs (16px native)**. **Trailing** — **12×12** on every Button size: library **`Size=xs, Style=outline`** (16px native) then **scale the nested instance to 12×12** (same Chip-avatar rescale pattern). Do not invent a 12px library size. Each Button size variant owns its nested Leading/Trailing icon as an **exposed nested instance** — switching Button Size updates **Leading** automatically (not a shared INSTANCE_SWAP); **Trailing** stays xs + 12px scale. To change the glyph: swap the exposed Leading/Trailing icon from the instance panel; use **outline** at the matching **Leading** size (**xs** for small, **sm** for medium). Do not use deprecated `icon/navigation/filter (deprecated)` (`111:3621`). Medium iconOnly: **FIXED 40×40**, **minWidth = minHeight = 40**, pad 10. Small: **FIXED 36×36**, **minWidth = minHeight = 36**, pad `space8` — iconOnly masters must not HUG width; missing minWidth on small was why medium→small produced ovals (height locked at 36, width hugged to 32 or stuck at 40). **`Button / Filter`** is now a component set with **Size=medium (40) | Size=small (36)** — switch Size on the Filter itself (not only nested Button). Nested Button stays FIXED square per Size. Prefer Filter Size over digging into nested Button Size. **iconOnly always shows the leading icon** (except **loading**, spinner only) — `Show leading icon` applies to **Layout=label** only; switching to iconOnly must not depend on that boolean (non-loading iconOnly masters force `startIcon.visible = true`, unbound from the boolean).
- **`Button / Filter` count badge:** Wrapper hugs the nested Button (horizontal auto-layout). `Badge / Count` is **absolute**, pinned top-right (`constraints` MAX / MIN, 4px overhang). Do not leave the wrapper FIXED 40×40 — that parks the badge on the icon box when Layout=label.
- **Other small icon buttons** (e.g. text “Last refreshed”, table overflow): still prefer **Size=xs, Style=bold** when the icon is not a Button Leading/Trailing slot — outline at 16px reads too light. Refresh: `icon/actions/refresh`. Overflow more: `icon/navigation/more.vertical`.
- Buttons page shows light mode only — dark component docs still open.
- **States docs** ([States](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=9-11203)): live `Button` instances (brand / medium / label) — not detached frames. Labels: “Save changes”; loading “Saving...”.

**Audit 2026-08-24:** 48 pressed Button variants — contained opaque fill/stroke, no overlay. 640 Button instances on the Buttons page (7 pressed). Overlay token not bound on Dashboard, Member profile, Chat Assist, App components, Chips, Tables, Pagination, Select, Text links, Inputs, Dropdowns, Cards, Modals, Lists, Tabs. Colors page swatches are primitive docs only. **2026-08-31:** outlined/text hover/pressed bind `action/ghost/*` (32 variants; was `surface/subtle`). Utility ramp recalibration — `/10`–`/20` match `grey/100`–`/200` visual weight when composited (not literal 10%/20% opacity); elevation shadows lighten accordingly. `coolDarkTransparent` / `coolLightTransparent` valid for **elevation/scrims** and **action/ghost** fills — not contained pressed.

**Changed 2026-09-03:** Disabled is tone-step — not shared grey disabled.

**Changed 2026-09-04:** Contained disabled — `action/{tone}/disabled` fill (primary@40%) + white `onBrand`/`onDanger` text; outlined/text use transparent ink via `brand*Transparent/40` / `danger*Transparent/40`; text (ghost) disabled has no soft fill.

**Changed 2026-09-14:** Disabled transparent steps `/40` → `/20` (literal 20% alpha — half of prior 40%). Contained fill @20% + white `onBrand`/`onDanger`; outlined/text via `brand*Transparent/20` / `danger*Transparent/20`. Semantic alias names unchanged (`action/{tone}/disabled`, `text/{tone}/disabled`).

**Fixed 2026-09-09:** iconOnly **minWidth = minHeight** 40 (medium) / 36 (small) — ovals from missing minWidth. **`Button / Filter`** Size set medium (40) / small (36) circular; switch Size on Filter, nested Button FIXED square per Size.

**Changed 2026-10-12:** Trailing icons **12×12** via library **Size=xs** (scaled from 16); Leading stays medium **sm** / small **xs** at native sizes.

## Chips

- Custom composed component (no Base UI headless primitive); spec structure mirrors Button.
- **Live Figma:** pill (`radius.full`). Token-rules still record a 2026-08-11 rounded-rect reversal (`radius.sm` / `radius.md`) — do not silently restyle until that decision is reopened.
- **Size:** Medium 28 / Small 24 (not Badge 20). Hug width; label–trailing gap 4px. Never `FILL` or space-between.
- **Small avatar:** `Avatar` Size=sm is 20px — rescale the instance to **16×16** (including `Avatar.Root`) so it fits `inset/xs` in the 24px chip. Do not leave a 16 frame around a 20 root.
- **Dismiss / Chevron end-cap (Medium):** `Trailing=Dismiss` or `Trailing=Chevron` uses `space2` (2px) on top, bottom, and right so the 24 trailing control sits flush in the pill; do not keep `inset/xs` (4px) on the right. Small already matches (`inset/xs` all around, 16 control in 24).
- **Variant:** **Filled** | **Outlined** only — no Solid, no Badge color tones. Badge Soft/Outlined tone mapping retired 2026-09-03.
- **Leading:** None | Icon | Avatar. **Trailing:** None | Dismiss | Chevron — mutually exclusive (not two booleans). Dismiss = remove; Chevron = opens a menu. Never Dismiss + Chevron together.
- **State:** Rest, Hover, Focus visible, Pressed, Disabled. Hover/pressed never fire while disabled; pressed matches hover (no overlay). Focus ring is never removed.
- **Filled Rest:** `surface/subtle` fill, `border/neutral/subtle` stroke, `text/primary`, `icon/default`.
- **Filled Hover / Pressed:** keep Rest fill; strengthen stroke to `border/strong`.
- **Outlined Rest:** `surface/default`, stroke `border/strong`, `text/primary`, `icon/default`.
- **Outlined Hover / Pressed:** fill `surface/subtle`; stroke and label stay Rest.
- **Focus visible:** Rest fill; **2px inside** `focus/ring`.
- **Disabled:** `surface/disabled`, `border/disabled`, `text/disabled`, `icon/disabled`.
- **Trailing controls (`Chip / Dismiss` · `Chip / Chevron`):** Same shell — Medium **24×24** (20 well); Small **16×16** (12 well); pad 2; `radius.full`; **`clipsContent = false`**. Glyph slot Medium **10×10** / Small **8×8**. Ink **`icon/tertiary`**. Hover Well → `action/secondary/hover`; Focus visible → 2px `focus/ring` on the control root + Well `surface/default`. State map from Chip: Hover → Hover, Focus visible → Focus visible, Rest / Pressed / Disabled → Rest.
  - **Dismiss:** `icon/navigation/close` **xs bold**.
  - **Chevron:** `icon/navigation/chevron.down` **xs outline**. Do not swap glyphs inside the other control.
- **Selected:** not a Chip variant yet. If added: tint + border or icon change — never background tint alone.
- **Interactive status (Care Pathways):** use **Filled · Small · Trailing=Chevron**. Do not pair Badge + external chevron for interactive status.
- Overview sticker: `❖ Chips · Sticker sheet`. Masters: `Component masters` — dense packed sticker grid (ROW_H 52 / COL_W 200 per Leading×Trailing pair); column headers **left-aligned** to each pair (Small column). States matrix: fixed column cells, chips and headers **left-aligned** for scannable columns. Interactive matrix: [Chips/states](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=2745-31140).

**Changed 2026-09-09:** `Dismiss` boolean axis → **`Trailing`** None | Dismiss | Chevron; `Chip / Chevron` mirrors `Chip / Dismiss` (hit, well, hover/focus); Care Pathways status uses `Trailing=Chevron`.

## Choice chip

- Exclusive pick in a set (Base UI `Radio.Group`); compose via **`Choice chip group`** (max 5, `Show chip 3–5`).
- **Axes:** Selected False|True · State Rest|Hover|Focus visible|Pressed|Disabled · Size Medium|Small · Leading None|Check.
- **Unselected:** Filled Chip recipe — `surface/subtle`, `border/neutral/subtle` → strong on hover/pressed; focus `focus/ring` 2px; disabled grey.
- **Selected:** contained brand — fill/stroke `action/primary` (hover `/hover`, pressed `/pressed`); label `text/onBrand`; leading check `icon/actions/check` **xs bold** + `icon/onBrand` (Regular check set — not `check.bold`). Focus visible keeps Rest fill and an absolute `focusring` (2px `focus/ring`, −4 inset gap). Disabled stays shared grey (`icon/disabled` on check).
- **States docs:** selected column uses **Leading=Check** so the filled selected recipe is visible.

**Changed 2026-09-14:** Selected restyled to brand fill + white Regular check xs bold/label; states matrix shows Leading=Check on selected.

## Checkbox / Control

- Checked / indeterminate marks are **drawn 1.5px strokes** on the control — not Streamline icon instances. Bind stroke to `icon/onBrand` (disabled → `icon/disabled`). Empty fills. Round cap and join.
- Check: 2-segment vector; upper arm ~2.5× the short arm. Rotate **~12° CCW** around the 16×16 center and lower the vertex slightly so the long arm aims toward the top-right (short arm reads more vertical). **Match dash width:** check and dash share the same horizontal ink span — **9.5px** (`x` **3.25–12.75** in the 16×16 box); scale check render bounds to dash, then center vertically.
- Dash: do **not** use a Line (`H=0`). Line stroke paints on one side of the path, so Center alignment still sits the 1.5px ink off-center. Use a Vector, `outlineStroke()` to a **1.5px-tall** fill, then center that bbox in the 16 box (`y = 7.25`). Width **9.5px** (`x` **3.25–12.75**). Bind fill to `icon/onBrand`.
- Do not use `check.bold`, Regular `check` / `minus`, or a filled rectangle.
- On colored fills (`action/primary`), never bind indicators to `icon/default`.
- **Focus ring** only on `State=Focus visible`. Rest / Hover / Disabled never show `focus/ring` (checked True is not a focus state).

## Field.Error

- Leading `icon/status/error` on error helpers binds **`icon/danger`**, matching `text/danger`. Never leave `icon/default` on error states.
- Library master `icon/status/error` stays `icon/default` for general use — override at the Field.Error instance (Select / Field, Select / Field Multi).

## Icons (scoped, not confirmed built)

- **Style:** Streamline Regular only — single-weight stroke; no Material filled/outlined dual system. Bold xs is a separate filled variant (not “outline at xs”).
- **Proposed sizes (unratified):** `icon.sm` 20px, `icon.md` 24px, `icon.lg` 32px. Working xs in Figma is **16×16**.
- **Colors:** `icon.default`, `icon.disabled`; on-brand surfaces reuse `icon.onBrand` / `icon.onDanger` / etc. from color tokens.
- Audit Icons page for external instances before editing.
- Small chip ~16px icon may need a new size step or one-off exception.

### Cursors (MacOS)

- Figma: [Icons → Cursors](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=3232-48929). One set only: `Mac Cursor` masters (no separate instance gallery).
- **Each State variant** = 24px glyph only (no token label in the master).
- **Default State** = `default` (arrow) — Assets / search preview shows the arrow, not `beachball`.
- **State = token name:** `default` · `beachball` · `cross` · `default.menu` · `hand.pointing` · `hand.open` · `hand.grabbing` · `move` · `resize.left` · `resize.right` · `resize.left.right` · `resize.up` · `resize.down` · `resize.up.down` · `resize.nwse` · `resize.nesw` · `resize.east.west` · `resize.north.south` · `text` · `zoom.in` · `zoom.out`.

**Changed 2026-10-06:** Mac Cursor masters are icon-only; default State is the arrow.
**Changed 2026-09-03:** Mac Cursor masters show State token labels in one list (Streamline row layout).

### Outline ≠ Bold import rule (non-negotiable — recurring bug)

`Style=outline` must use **Streamline Regular 3.0** stroke SVGs (`legacy-streamline-regular`, 24px grid, `fill="none"` + `stroke` / `stroke-width` **1.5** @ 24). `Style=bold` (xs filled) must use **Streamline Bold 3.0** filled SVGs (`legacy-streamline-bold`). Never put a Bold/filled asset into an outline size variant, and never keep an Ultimate-only glyph in the library.

**How it fails:** Component property says `Style=outline` but canvas shows solid fill (e.g. sparkles looked like Bold “Reward Stars 3” while labeled outline). Description text saying “Bold” / “Filled” on an outline set is a red flag.

**Required on every outline import / batch:**

1. Source SVG from `assets/icons/streamline/` (Regular) — not `streamline-bold/`.
2. After `createNodeFromSvg`, every vector on outline variants must have **strokes bound to `icon/default`** and **empty fills**. Reject the batch if any outline vector is fill-only.
3. Stroke weight: **1.5** at sm/md/lg; **~1** at xs (with inset). Keep `clipsContent = false` + inset per stroke clipping rule below.
4. Set `description` to name the Regular 3.0 glyph (not Bold), e.g. `Streamline Regular 3.0 — Reward Stars 3`.
5. **Exceptions (intentionally filled, even on `Style=outline` slots):** `icon/actions/check.bold`, `icon/status/star.filled` — name encodes filled purpose; do not “fix” these to stroke.
6. **Star pair:** `icon/status/star` = Streamline **Rating Star** Regular stroke (outline) + Bold filled xs. `icon/status/star.filled` = filled companion (intentional fill on outline slots). Do not map Star Half or other star glyphs to `star`.

**Acceptance check (every batch):** pick `Size=md, Style=outline` for rectangular + decorative icons (sparkles, light.mode, calendar, star). Zoom ≥400%. Outline must show open centers / visible stroke — if it looks solid like Bold, fail the batch and re-import Regular.

**Changed 2026-08-26:** `icon/actions/check.circle` is Streamline Regular 3.0 **Check Circle 1** (check inside the ring); was Ultimate **Check Circle** (check breaking the ring). Outline all sizes; Bold xs filled.

**Changed 2026-08-26:** `icon/misc/light.mode` library glyph is Streamline Regular 3.0 **Light Mode Dark Light** (sun + crescent); was **Light Mode Bw**. Regular outline all sizes; Bold xs filled.

**Changed 2026-09-03:** `icon/misc/sun` → Streamline Regular 3.0 **Weather Sun** (circle + 8 detached rays); was **Uv Sun**. Outline all sizes; Bold xs filled.

**Fixed 2026-08-24:** `icon/status/sparkles` and `icon/misc/light.mode` outline sizes re-imported from Regular (were Bold fill on all outline sizes). Library audit: 0 accidental fill-only outline sets remaining (only check.bold / star.filled intentional).

**Replaced 2026-08-24:** `icon/actions/download` → Streamline **Download Bottom**; `icon/actions/upload` → **Upload Bottom**. Prior glyphs were Download Arrow / Upload Menu.

**Fixed 2026-09-09:** `icon/actions/upload` and `icon/actions/download` re-imported from Streamline Regular/Bold 3.0 **Upload Bottom** / **Download Bottom** (library had drifted back to Upload Menu / Download Arrow).

**Replaced 2026-08-24:** `icon/actions/refresh` → Streamline **Button Refresh Arrow** (all outline sizes + bold xs filled). Prior glyph was Synchronize Refresh Arrow 2.

**Removed 2026-08-24:** `icon/actions/discover` — dropped from the library (Discover Pay wordmark, not a product icon).

**Removed 2026-08-24:** `icon/health/hand.wash`, `icon/health/lungs`, `icon/health/pregnancy`, `icon/health/surgery` — dropped from the library.

**Changed 2026-08-24:** `icon/status/star` remapped to Streamline **Rating Star** (was Star Half). Outline sizes = Regular stroke; `Size=xs, Style=bold` = Bold 3.0 filled. Pair with `icon/status/star.filled`.

**Replaced 2026-08-26:** `icon/navigation/filter` → Streamline **Filter Sort Lines Descending** (four staggered bars). Outline all sizes + Bold xs filled. Prior glyph was Streamline 3.0 **Filter** (funnel). **2026-08-31:** duplicate legacy set renamed `icon/navigation/filter (deprecated)` — always use library set `1593:44489`. Button small uses **xs** icons; medium uses **sm** — swap exposed nested Leading/Trailing instances at the matching size. Never swap to the deprecated set.

**Fixed 2026-08-25:** Navigation arrows (`arrow.up` / `down` / `left` / `right` / `corner.left` / `corner.right`) — round stroke caps and joins; shaft meets the chevron vertex.

**Added 2026-10-09:** **`icon/actions/edit.sparkle`** — Regular 3.0 Pencil + hollow Reward Stars sparkle lower-right near tip (AI rewrite); Icons library actions grid + Category · Actions. All sizes: outline xs/sm/md/lg + bold xs. Set [`4528:5388`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=4528-5388). Source SVGs: `assets/icons/streamline/actions/edit-sparkle.svg`, `assets/icons/streamline-bold/actions/edit-sparkle.svg`.

**Changed 2026-10-12:** **`icon/files/notes`** → Streamline Regular 3.0 **Notes Book Text** (spiral notepad + three text lines); was **Notes Add**. Outline all sizes + Bold xs filled. Set [`1593:37948`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=1593-37948). Source SVGs: `assets/icons/streamline/files/notes.svg`, `assets/icons/streamline-bold/files/notes.svg`.

**Added 2026-10-12:** **`icon/files/notes.add`** — prior Notes glyph (notepad + plus badge); Icons library files grid + Category · Files & media. All sizes: outline xs/sm/md/lg + bold xs. Set [`4981:2832`](https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=4981-2832). Source SVGs: `assets/icons/streamline/files/notes-add.svg`, `assets/icons/streamline-bold/files/notes-add.svg`.

**Fixed 2026-10-09:** `icon/actions/edit` — outline sizes scaled in so pencil tip stroke clears the size frame (Streamline tip at 0.75 with 1.5 stroke was flush; use normal stroke-clip inset — not tighter / larger in-frame). Supersedes 2026-08-24 guidance that outline was intentionally larger.

**Fixed 2026-10-09:** `icon/actions/edit.sparkle` — hollow sparkle lower-right near tip on all sizes; tip clears the frame.

**Fixed 2026-10-09:** `icon/actions/undo` and `icon/actions/redo` — outline sizes scaled in so arrow corners clear the frame (left/right edge was flush at ~0.75px).

**Changed 2026-09-03:** `icon/actions/edit.alt` → Streamline Regular 3.0 **Common File Text Edit** (document + pencil); was wrongly remapped to the same **Pencil** glyph as `edit` when Ultimate **Edit Pdf** had no 3.0 pair. Outline all sizes + Bold xs filled.

**Changed 2026-08-25:** Icon library source is **Streamline Regular 3.0** (outline, 1.5px / 24px grid) and **Streamline Bold 3.0** (filled `Size=xs, Style=bold` only). Ultimate glyphs are not library assets. Sets with no Regular+Bold 3.0 pair are dropped from the Icons page (same treatment as hand.wash / lungs / pregnancy / surgery). Intentional fills stay `check.bold` and `star.filled` (Bold 3.0 on all size slots). Dropped 2026-08-25 (no 3.0 pair): accessibility, agreement, appointment, bank, battery, battery.charging, blood.pressure, box.alt, cancer, cast, clipboard, clipboard.health, comment, contrast, counseling, crisis, crop, dosage, droplet, duplicate, emergency, export, eye.health, factory, file.pdf, fingerprint, food, forward.mail, gas, graduation, group, guide, hearing.aid, hipaa, import, inbox, inhaler, manual, meditation, mental.health, mental.wellness, merge, microscope, moon, new, notification, open, otc, oxygen, package.alt, panel.bottom, parcel, paste, patient, pharmacy, pharmacy.alt, policy, prescription, prosthetic, pulse, remind, restore, resume, sign.language, sleep, snooze, sort, sort.asc, sort.desc, split, symptoms, terminal, train, ultrasound, umbrella, vaccine, virus.

### Stroke clipping rule (non-negotiable — recurring bug)

Streamline outline SVGs use a **24×24 viewBox** with **1.5px centered strokes**. Paths often sit ~0.75px from the box edge. Half the stroke lives outside the path bounds. If the component frame clips or the glyph is flush-scaled into 16×16, corners look **beveled/cut off** (calendar, rectangular bubbles fail; circles often look fine).

**Required on every icon import / size variant:**

1. **`clipsContent = false`** on the size component (`Size=xs` / `md`) and on the inner SVG frame. Never leave clip on for stroked icons.
2. **Do not flush-fit stroked paths to the frame.** Prefer one of:
   - Keep glyph **inset** so stroke stays inside the box (≥ half stroke weight; ~1px inset at 24, ~0.75–1px at 16), **or**
   - Outline the stroke to fill (`outlineStroke` / Streamline `strokeToFill`) **before** shrinking to xs — then fills can sit edge-to-edge safely.
3. **Vector constraints:** `SCALE` / `SCALE` after resize (same lesson as Checkbox minus).
4. **Stroke weight:** outline `md` stays 1.5 at 24. Do not keep 1.5 stroke on a flush 16 box — either inset, scale weight with the box, or convert to fill for bold xs.
5. **Component set:** set frame may be fixed 16×16, but **must not clip** overflowing stroke while debugging; final glyph geometry must fit inside without relying on clip.
6. **Interior strokes must T-join the outline, not poke through or stop short.** Dividers (calendar header, panel rails, card stripes), joins (book page-edge), and **compound bars** (e.g. `icon/health/fitness` dumbbell shaft through weight plates) that share an outer-path coordinate overshoot with round caps at 0 inset, and look undershot if you inset a full stroke (caps only kiss the inner wall). Inset those 2-point H/V segments by **½ stroke weight** on each end that meets the outer path so the cap sits in the wall. Bake the inset into the source SVG when the bar is short (≤1.5× stroke); otherwise one **single** post-import pass — **never** loop multi-pass auto-inset (it eats stubs). Do not clip hangers that intentionally sit outside the body (calendar tabs). Do not flush-scale interior lines independently of the outline.

**Acceptance check (every batch):** zoom 400% on rectangular icons (calendar, messages, square frames, `panel.left` / `panel.right`, `files/manual`). If any corner is flat/beveled **or** an interior stroke crosses the outer stroke → fail the batch, fix the pipeline, don’t hand-patch one icon only.

**Bold xs (filled):** use Streamline **Bold 3.0** filled SVGs from `assets/icons/streamline-bold/` — not Regular strokes converted to fill. Place with **≥1px inset** in the 16×16 box (`clipsContent = false` on the size component). Edge-flush bold fills (paper-plane tips, etc.) will look cut if flush-fitted or if the set clip eats the tip. A Regular-to-fill XS Bold has the same region count as the outline variant; a true Bold glyph does not.

**Bold compound paths (non-negotiable):** Streamline Bold SVGs often use a single path with a hole (calendar body, rings). Import with **`fill-rule="evenodd"`** / Figma `windingRule: EVENODD` on regions with ≥2 loops. `NONZERO` fills the hole and creates blobs/nubs (calendar tip/side artifacts). After import, flip any `NONZERO` multi-loop region to `EVENODD`.

**Applied 2026-08-24 (library-wide):** all **1600** `Style=outline` size variants — size-component `clipsContent = false`; glyph frames inset (~½ stroke + safety); category grids `health` / `misc` / `actions` unclipped.

**Bold fix 2026-08-25:** `icon/health/911` and `icon/health/heart` Size=xs Style=bold re-imported from Streamline Bold (Safety 911, Heart Approve 1) with evenodd — drop NONE stray paths and mixed winding (blob/nub). Same evenodd pass: bike, code, light.mode, letter, parcel, bell, receipt, user.check. Outline and sm/md/lg untouched.

**Bold fix 2026-08-24:** re-applied Streamline filled SVG for `icon/actions/send.alt` Size=xs Style=bold with 1px inset (tip was clipped). Library audit: other bold xs already ≥1px pad. Calendar bold re-imported with evenodd; flipped 8 other multi-loop NONZERO bolds (911, bike, code, light.mode, letter, parcel, bell, receipt).

**xs gallery vs Categories (2026-08-24):** `Streamline icons (xs)` panel shows only `Size=xs, Style=outline` on each set. Keep set wrappers **16×16** with `clipsContent = true` and park sm/md/lg/bold outside the clip — **never set those variants to `visible: false`**. Hidden variants break instance swaps (Tool rail `Size=sm`, Button / Filter leading icon, any consumer of non-xs). Categories (24px) lists all library icons as `Size=md` rows — do not put md glyphs in the xs panel.

**Fixed 2026-08-24 (variant visibility):** Restored `visible: true` on all sm/md/lg/bold variants across ~399 sets (xs gallery still clipped). Tool rail icons and Button / Filter leading icon render again.

**Icon centering in buttons:** After import, the glyph’s stroke-aware bounds (incl. round caps) must be centered in the size frame — not path `x/y` alone. Stacked glyphs (filter bars) must share one horizontal center axis. `icon/navigation/filter` outline sizes were recentered for Button / Filter.

**Category pairing (non-negotiable):** If Actions (or any category) lists `*.alt`, the base name must appear in that same category as an adjacent `Size=md` row — even when the master set lives under another section path (e.g. `icon/navigation/search` + `icon/actions/search.alt`). Do not leave the base only in its home category when the alt is surfaced under Actions.

**Fixed 2026-08-24 (categories):** Actions now includes `search` (md) beside `search.alt`, plus other Action `.alt` bases that were missing there (`close`, `flag`, `forward`, `reply`, `send`). Audit: every Section · * master appears in its Category; 0 Action `.alt` without a same-category base.

**Import pipeline:** CareApp `assets/icons/streamline*` batch scripts must enforce inset-or-fill on size components; **outline batches read only `streamline/` (Regular)**; bold xs must import **filled** SVGs from `streamline-bold/` with 1px inset **and `fill-rule="evenodd"` on compound paths**; run fill-only outline audit after every import; after bold import, reject any `NONZERO` region with ≥2 loops; after import keep **all size variants `visible: true`** and clip the xs gallery cell (do not hide sm/md/lg/bold); after SVG import, inset interior H/V strokes that meet the outer path by **½ stroke** (see rule 6).

**Fixed 2026-08-24:** outline interior T-joins — calendar header, panel rails, and the same 2-point H/V pattern across 18 sets (all outline sizes): inset **½ stroke** (1× left a gap; 0 poked through). **`icon/health/fitness`** — bar segments baked with ½-stroke inset at plate junctions (center + side stubs).

## Grids (scoped, provenance unconfirmed)

- Breakpoints on page: Large ≥1200, Medium ≥768, X-Large ≥1440, Small ≥600, Sidebar-fluid.
- Margin and gutter both 24px in audited breakpoints — confirm token step (`inline.*` only documented to `md`).
- Tokenization intent: margin → `inset.*`, gutter → `inline.*` — no new `grid.*` namespace unless needed.
- Confirm whether Layout Grid properties can bind to Number variables in this Figma version.

## Tags

- Pill shape (`radius.full`) — unaffected by Chips radius reversal.
