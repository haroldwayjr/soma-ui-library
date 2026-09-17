# Soma UI — Figma vs code drift report

Generated: 2026-09-16T22:00:30.652501+00:00
Sources: figma-registry.json, code-api-inventory.json, COMPONENT-STATUS.md, css-state-coverage.json

## Summary
- Figma components audited: 123 (icons excluded)
- Matched to code: 47
- Not implemented: 76
- Status unknown (no COMPONENT-STATUS row): 23
- Interaction-state gaps (Hover/Focus/Pressed with no prop AND no CSS): 6
- Interaction states matched via CSS (not props): 30

## Status unknown

| Figma name | Page | nodeId |
| --- | --- | --- |
| _deleted · Tooltip Callout (do not use) | Tooltips | 3679:321 |
| App Shell | App components (WIP) | 2351:15544 |
| Back Link | Breadcrumbs | 1739:150 |
| Chat / Message | Chat bubbles | 1866:10334 |
| Form / Section | Form sections (WIP) | 1707:9818 |
| IHP Tips / Disclosure | App components (WIP) | 3634:1700 |
| Illustration / Empty | Illustrations | 3866:30027 |
| List | Lists | 1717:244 |
| ListItem | Lists | 1707:9964 |
| Mac Cursor | Icons | 3232:49039 |
| Profile Menu / Panel | App components (WIP) | 2614:19277 |
| Profile Menu / Status nav | App components (WIP) | 2614:18897 |
| Profile Menu / Status Panel | App components (WIP) | 2613:16955 |
| Rail / Icon | App components (WIP) | 1866:10345 |
| StatusSelector / Panel | App components (WIP) | 2397:16254 |
| StatusSelector / Row | App components (WIP) | 2397:16146 |
| StatusSelector / Signal | App components (WIP) | 2397:16048 |
| StatusSelector / Trigger | App components (WIP) | 2397:16329 |
| Stepper / Indicator | Steppers | 3316:278 |
| Stepper / Step | Steppers | 3318:386 |
| Theme Menu / Panel | App components (WIP) | 3180:1373 |
| Tool rail | App components (WIP) | 2170:13891 |
| View switcher | View switcher (WIP) | 3281:237 |

## Not implemented (Figma has, code does not)

### Alerts (WIP)
- Alert (`1152:1533`)

### App components (WIP)
- App Shell (`2351:15544`)
- IHP Tips / Disclosure (`3634:1700`)
- Profile Menu / Panel (`2614:19277`)
- Profile Menu / Status nav (`2614:18897`)
- Profile Menu / Status Panel (`2613:16955`)
- Rail / Icon (`1866:10345`)
- StatusSelector / Panel (`2397:16254`)
- StatusSelector / Row (`2397:16146`)
- StatusSelector / Signal (`2397:16048`)
- StatusSelector / Trigger (`2397:16329`)
- Theme Menu / Panel (`3180:1373`)
- Tool rail (`2170:13891`)

### Avatars
- Avatar / Photo / Alex Rivera (`3708:362`) — library photo asset for Avatar.Image; not a UI control
- Avatar / Photo / Amara Diallo (`3708:365`) — library photo asset for Avatar.Image; not a UI control
- Avatar / Photo / Dana Whitfield (`3708:363`) — library photo asset for Avatar.Image; not a UI control
- Avatar / Photo / Default (`3708:356`) — library photo asset for Avatar.Image; not a UI control
- Avatar / Photo / Jordan Ellis (`3708:358`) — library photo asset for Avatar.Image; not a UI control
- Avatar / Photo / Kenji Sato (`3708:364`) — library photo asset for Avatar.Image; not a UI control
- Avatar / Photo / Luis Andrade (`3708:361`) — library photo asset for Avatar.Image; not a UI control
- Avatar / Photo / Maya Chen (`3708:357`) — library photo asset for Avatar.Image; not a UI control
- Avatar / Photo / Noah Patel (`3708:366`) — library photo asset for Avatar.Image; not a UI control
- Avatar / Photo / Priya Nair (`3708:360`) — library photo asset for Avatar.Image; not a UI control
- Avatar / Photo / Sam Okonkwo (`3708:359`) — library photo asset for Avatar.Image; not a UI control
- Avatar Group (`991:970`) — Figma pattern; no AvatarGroup export in @nova/ui
- Avatar Label Group (`991:1029`) — Figma pattern; no AvatarLabelGroup export in @nova/ui

### Breadcrumbs
- Breadcrumb / Current (`1748:9670`)
- Breadcrumb / Home (`1748:9688`)
- Breadcrumb / Link (`1748:9669`)
- Breadcrumb / Overflow (`1748:9695`)
- Breadcrumb / Separator (`1748:9672`)
- Breadcrumb Trail (`1748:9826`)

### Chat bubbles
- Chat / Message (`1866:10334`)

### Checkbox
- Checkbox / Group (`1697:349`)
- Checkbox / Item (`1695:2137`)

### Chips
- Choice chip group (`3826:16920`)

### Dropdowns
- Menu / CheckboxItem (`402:200`)
- Menu / GroupLabel (`358:89`)
- Menu / Item (`358:83`)
- Menu / Popup (`358:101`)
- Menu / RadioItem (`417:291`)
- Menu / Separator (`358:86`)

### Form sections (WIP)
- Form / Section (`1707:9818`)

### Icons
- Mac Cursor (`3232:49039`)

### Illustrations
- Illustration / Empty (`3866:30027`)

### Inputs
- Input / Amount (`466:4328`)
- Input / Card (`466:4465`)
- Input / Chips (`466:4752`)
- Input / Chips external (`466:4794`)
- Input / Clear (`464:4291`)
- Input / Date (`466:4536`)
- Input / Number (`466:4567`)
- Input / Number vertical (`466:4613`)
- Input / OTP (`466:4659`)
- Input / Upload (`469:4366`)
- Textarea (`466:3908`)

### Lists
- List (`1717:244`)
- ListItem (`1707:9964`)

### Modals
- Dialog (`3530:26797`)

### Multi-select
- Select / Field Multi (`907:12459`)
- Select / Multi Item (`907:12365`)
- Select / Trigger Multi (`907:12314`)

### Popovers
- Close (`1559:8945`)
- Popover / Popup (`1440:8895`)

### Radio
- Radio / Item (`1707:9073`)

### Sliders
- Slider (`1401:7740`)

### Spinners
- Spinner (`3343:27182`)

### Steppers
- Stepper / Indicator (`3316:278`)
- Stepper / Step (`3318:386`)

### Switches
- Switch / Field (`476:733`) — proposed Switch+Field composite; bare Switch exists

### Tabs
- Tab (`1375:7093`)
- Tab · Compact (`3068:1602`)
- Tab · Nav (`3068:1628`)
- Tabs.List (`2945:30704`)

### Tooltips
- _deleted · Tooltip Callout (do not use) (`3679:321`)

### View switcher (WIP)
- View switcher (`3281:237`)

## Per-component drift

### _deleted · Tooltip Callout (do not use)
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Alert
- buildStatus: Not started
- Not implemented: no dedicated code component

### App Shell
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Avatar
- buildStatus: In progress
- code: Avatar (@nova/ui)
- Matched: Size → size, Content=Image → src, Content=Initials → initials, Show presence → presence
- Missing in code: Content=Silhouette
- Extra in code: alt

### Avatar / Photo / Alex Rivera
- buildStatus: In progress
- Not implemented: no dedicated code component — library photo asset for Avatar.Image; not a UI control

### Avatar / Photo / Amara Diallo
- buildStatus: In progress
- Not implemented: no dedicated code component — library photo asset for Avatar.Image; not a UI control

### Avatar / Photo / Dana Whitfield
- buildStatus: In progress
- Not implemented: no dedicated code component — library photo asset for Avatar.Image; not a UI control

### Avatar / Photo / Default
- buildStatus: In progress
- Not implemented: no dedicated code component — library photo asset for Avatar.Image; not a UI control

### Avatar / Photo / Jordan Ellis
- buildStatus: In progress
- Not implemented: no dedicated code component — library photo asset for Avatar.Image; not a UI control

### Avatar / Photo / Kenji Sato
- buildStatus: In progress
- Not implemented: no dedicated code component — library photo asset for Avatar.Image; not a UI control

### Avatar / Photo / Luis Andrade
- buildStatus: In progress
- Not implemented: no dedicated code component — library photo asset for Avatar.Image; not a UI control

### Avatar / Photo / Maya Chen
- buildStatus: In progress
- Not implemented: no dedicated code component — library photo asset for Avatar.Image; not a UI control

### Avatar / Photo / Noah Patel
- buildStatus: In progress
- Not implemented: no dedicated code component — library photo asset for Avatar.Image; not a UI control

### Avatar / Photo / Priya Nair
- buildStatus: In progress
- Not implemented: no dedicated code component — library photo asset for Avatar.Image; not a UI control

### Avatar / Photo / Sam Okonkwo
- buildStatus: In progress
- Not implemented: no dedicated code component — library photo asset for Avatar.Image; not a UI control

### Avatar / Presence dot
- buildStatus: In progress
- code: Avatar (@nova/ui)
- Matched: Status=Online → presence, Status=Offline → presence, Status=Busy → presence, Size → size
- Missing in code: Status=Away
- Extra in code: alt, initials, src

### Avatar Group
- buildStatus: In progress
- Not implemented: no dedicated code component — Figma pattern; no AvatarGroup export in @nova/ui

### Avatar Label Group
- buildStatus: In progress
- Not implemented: no dedicated code component — Figma pattern; no AvatarLabelGroup export in @nova/ui

### Back Link
- buildStatus: Unknown
- code: Link (@nova/ui)
- Matched: State=Rest (CSS/default), State=Hover (Matched — CSS state, not prop), State=Focus visible (Matched — CSS state, not prop)
- Missing in code: None
- Extra in code: download, href, rel, target

### Badge
- buildStatus: Done
- code: Badge (@nova/ui)
- Matched: Size → size, Variant → variant, Tone → tone, State=Rest (CSS/default), State=Disabled → disabled, Leading → leading
- Missing in code: None
- Extra in code: title

### Badge / Count
- buildStatus: Done
- code: Badge (@nova/ui)
- Matched: Digits → children
- Missing in code: None
- Extra in code: disabled, leading, size, title, tone, variant

### Breadcrumb / Current
- buildStatus: Not started
- Not implemented: no dedicated code component

### Breadcrumb / Home
- buildStatus: Not started
- Not implemented: no dedicated code component

### Breadcrumb / Link
- buildStatus: Not started
- Not implemented: no dedicated code component

### Breadcrumb / Overflow
- buildStatus: Not started
- Not implemented: no dedicated code component

### Breadcrumb / Separator
- buildStatus: Not started
- Not implemented: no dedicated code component

### Breadcrumb Trail
- buildStatus: Not started
- Not implemented: no dedicated code component

### Button
- buildStatus: In progress
- code: Button (@nova/ui)
- Matched: Variant → variant, Tone → tone, Size → size, State=default (CSS/default), State=disabled → disabled, State=loading → loading, State=hover (Matched — CSS state, not prop), State=focus (Matched — CSS state, not prop), State=pressed (Matched — CSS state, not prop), Show leading icon → startIcon, Show trailing icon → endIcon
- Missing in code: Layout=label, Layout=iconOnly, Layout=iconOnly maps to the separate IconButton API
- Extra in code: None

### Card
- buildStatus: Done
- code: Card (@nova/ui)
- Matched: None
- Missing in code: Show header, Show trailing action, Show footer, Show icon
- Extra in code: None

### Card / Notice
- buildStatus: Done
- code: Card (@nova/ui)
- Matched: None
- Missing in code: Layout=Notice, Layout=Tile, Tone=Brand, Tone=Neutral, Tone=Success
- Extra in code: None

### Chat / Message
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Checkbox / Control
- buildStatus: In progress
- code: Checkbox (@nova/ui)
- Matched: Checked=False → checked, Checked=Indeterminate → indeterminate, Checked=True → checked, State=Rest (CSS/default), State=Disabled → disabled, State=Focus visible (Matched — CSS state, not prop), State=Hover (Matched — CSS state, not prop)
- Missing in code: None
- Extra in code: readOnly, required, uncheckedValue, value

### Checkbox / Group
- buildStatus: In progress
- Not implemented: no dedicated code component

### Checkbox / Item
- buildStatus: In progress
- Not implemented: no dedicated code component

### Chip
- buildStatus: In progress
- code: Chip (@nova/ui)
- Matched: Variant → variant, State=Rest (CSS/default), State=Disabled → disabled
- Missing in code: Leading=None, Leading=Icon, Leading=Avatar, Trailing=None, Trailing=Dismiss, Trailing=Chevron, State=Hover, State=Focus visible, State=Pressed, Size=Medium, Size=Small
- Extra in code: dismissLabel, dismissRef, title

### Chip / Dismiss
- buildStatus: In progress
- code: Chip (@nova/ui)
- Matched: State=Rest (CSS/default), State=Hover (Matched — CSS state, not prop), State=Focus visible (Matched — CSS state, not prop)
- Missing in code: Size=Medium, Size=Small
- Extra in code: disabled, dismissLabel, dismissRef, title, variant

### Choice chip
- buildStatus: In progress
- code: Chip (@nova/ui)
- Matched: State=Rest (CSS/default), State=Disabled → disabled
- Missing in code: Selected=False, Selected=True, State=Hover, State=Focus visible, State=Pressed, Size=Medium, Size=Small, Leading=None, Leading=Check
- Extra in code: dismissLabel, dismissRef, title, variant

### Choice chip group
- buildStatus: In progress
- Not implemented: no dedicated code component

### Close
- buildStatus: Not started
- Not implemented: no dedicated code component

### Dialog
- buildStatus: Not started
- Not implemented: no dedicated code component

### Field
- buildStatus: Done
- code: Field (@nova/ui)
- Matched: State=Default (CSS/default), State=Error → error, State=Disabled → disabled
- Missing in code: Control=Single-line, Control=OTP, Control=Multiline, Required, Show message
- Extra in code: description, indicateRequired, label

### Form / Section
- buildStatus: Unknown
- Not implemented: no dedicated code component

### IHP Tips / Disclosure
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Illustration / Empty
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Input / Amount
- buildStatus: In progress
- Not implemented: no dedicated code component

### Input / Card
- buildStatus: In progress
- Not implemented: no dedicated code component

### Input / Chips
- buildStatus: In progress
- Not implemented: no dedicated code component

### Input / Chips external
- buildStatus: In progress
- Not implemented: no dedicated code component

### Input / Clear
- buildStatus: In progress
- Not implemented: no dedicated code component

### Input / Date
- buildStatus: In progress
- Not implemented: no dedicated code component

### Input / Email
- buildStatus: In progress
- code: TextField (@nova/ui)
- Matched: State=Rest (CSS/default), State=Focus (Matched — CSS state, not prop), State=Disabled → disabled, State=Error → error
- Missing in code: State=Filled
- Extra in code: description, indicateRequired, label

### Input / Number
- buildStatus: In progress
- Not implemented: no dedicated code component

### Input / Number vertical
- buildStatus: In progress
- Not implemented: no dedicated code component

### Input / OTP
- buildStatus: In progress
- Not implemented: no dedicated code component

### Input / Phone
- buildStatus: In progress
- code: TextField (@nova/ui)
- Matched: State=Rest (CSS/default), State=Focus (Matched — CSS state, not prop), State=Disabled → disabled, State=Error → error
- Missing in code: State=Filled
- Extra in code: description, indicateRequired, label

### Input / Upload
- buildStatus: In progress
- Not implemented: no dedicated code component

### Input / Website
- buildStatus: In progress
- code: TextField (@nova/ui)
- Matched: State=Rest (CSS/default), State=Focus (Matched — CSS state, not prop), State=Disabled → disabled, State=Error → error
- Missing in code: State=Filled
- Extra in code: description, indicateRequired, label

### Link
- buildStatus: In progress
- code: Link (@nova/ui)
- Matched: State=Rest (CSS/default), State=Hover (Matched — CSS state, not prop), State=Focus visible (Matched — CSS state, not prop)
- Missing in code: State=Disabled, External icon=False, External icon=True
- Extra in code: download, href, rel, target

### List
- buildStatus: Unknown
- Not implemented: no dedicated code component

### ListItem
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Logo / Care App
- buildStatus: Done
- code: Logomark (@nova/ui)
- Matched: None
- Missing in code: None
- Extra in code: label

### Logo / Dot
- buildStatus: Done
- code: Logomark (@nova/ui)
- Matched: None
- Missing in code: None
- Extra in code: label

### Logo / Dot / Lockup
- buildStatus: Done
- code: Logomark (@nova/ui)
- Matched: None
- Missing in code: None
- Extra in code: label

### Logo / Included Health
- buildStatus: Done
- code: Logomark (@nova/ui)
- Matched: None
- Missing in code: Style=IH / Blue, Style=IH / White, Style=DOD
- Extra in code: label

### Mac Cursor
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Menu / CheckboxItem
- buildStatus: Not started
- Not implemented: no dedicated code component

### Menu / GroupLabel
- buildStatus: Not started
- Not implemented: no dedicated code component

### Menu / Item
- buildStatus: Not started
- Not implemented: no dedicated code component

### Menu / Popup
- buildStatus: Not started
- Not implemented: no dedicated code component

### Menu / RadioItem
- buildStatus: Not started
- Not implemented: no dedicated code component

### Menu / Separator
- buildStatus: Not started
- Not implemented: no dedicated code component

### Pagination
- buildStatus: Done
- code: Pagination (@nova/ui)
- Matched: Position=First (Not applicable — docs/layout algorithm, not a prop), Position=Middle (Not applicable — docs/layout algorithm, not a prop), Position=Last (Not applicable — docs/layout algorithm, not a prop)
- Missing in code: Size=small, Size=medium
- Not applicable: Position=First, Position=Middle, Position=Last
- Extra in code: page, pageCount

### Password Input
- buildStatus: In progress
- code: TextField (@nova/ui)
- Matched: State=Rest (CSS/default), State=Focus (Matched — CSS state, not prop), State=Disabled → disabled, State=Error → error
- Missing in code: Content=Empty, Content=Filled
- Extra in code: description, indicateRequired, label

### Popover / Popup
- buildStatus: Not started
- Not implemented: no dedicated code component

### Profile Menu / Panel
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Profile Menu / Status nav
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Profile Menu / Status Panel
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Progress Bar
- buildStatus: Done
- code: Progress (@nova/ui)
- Matched: Size → size, State=Default (CSS/default), State=Disabled → disabled, Layout → layout
- Missing in code: None
- Extra in code: value

### Radio / Control
- buildStatus: In progress
- code: Radio (@nova/ui)
- Matched: Checked=False (Matched — different API: value + RadioGroup selection), Checked=True (Matched — different API: value + RadioGroup selection), State=Rest (CSS/default), State=Disabled → disabled, State=Focus visible (Matched — CSS state, not prop), State=Hover (Matched — CSS state, not prop)
- Missing in code: None
- Extra in code: readOnly

### Radio / Group
- buildStatus: In progress
- code: RadioGroup (@nova/ui)
- Matched: State=Default (CSS/default), State=Disabled → disabled, Required → required
- Missing in code: State=Error, Show message
- Extra in code: details, form, readOnly, value

### Radio / Item
- buildStatus: In progress
- Not implemented: no dedicated code component

### Rail / Icon
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Search Input
- buildStatus: Not started
- code: TextField (@nova/ui)
- Matched: State=Rest (CSS/default), State=Focus (Matched — CSS state, not prop), State=Disabled → disabled
- Missing in code: State=Filled
- Extra in code: description, error, indicateRequired, label

### Search Input (464:4337)
- buildStatus: Not started
- code: TextField (@nova/ui)
- Matched: State=Rest (CSS/default), State=Focus (Matched — CSS state, not prop), State=Disabled → disabled
- Missing in code: State=Filled, Shortcut
- Extra in code: description, error, indicateRequired, label

### Select / Field
- buildStatus: Blocked
- code: SelectField (@nova/ui)
- Matched: State=Rest (CSS/default), State=Focus visible (Matched — CSS state, not prop), State=Disabled → disabled, State=Error → error
- Missing in code: State=Filled, Open
- Extra in code: description, indicateRequired, items, label, placeholder, readOnly, size, value

### Select / Field Multi
- buildStatus: Blocked
- Not implemented: no dedicated code component

### Select / Item
- buildStatus: Blocked
- code: Select (@nova/ui)
- Matched: Selected → value, State=Rest (CSS/default), State=Hover (Matched — CSS state, not prop), State=Focus visible (Matched — CSS state, not prop), State=Disabled → disabled
- Missing in code: Show icon, Show status
- Extra in code: items, placeholder, readOnly, size

### Select / Multi Item
- buildStatus: Blocked
- Not implemented: no dedicated code component

### Select / Popup
- buildStatus: Blocked
- code: Select (@nova/ui)
- Matched: None
- Missing in code: Show item 6
- Extra in code: disabled, items, placeholder, readOnly, size, value

### Select / Popup Panel
- buildStatus: Blocked
- code: Select (@nova/ui)
- Matched: None
- Missing in code: List item type=Simple, List item type=Checkbox, List item type=Radio, Include search, Include footer, Show item 1, Show item 2, Show item 3, Show item 4, Show item 5, Show item 6
- Extra in code: disabled, items, placeholder, readOnly, size, value

### Select / Trigger
- buildStatus: Blocked
- code: Select (@nova/ui)
- Matched: Size → size, State=Rest (CSS/default), State=Hover (Matched — CSS state, not prop), State=Focus visible (Matched — CSS state, not prop), State=Disabled → disabled
- Missing in code: State=Filled, State=Error, Show icon, Show status
- Extra in code: items, placeholder, readOnly, value

### Select / Trigger Multi
- buildStatus: Blocked
- Not implemented: no dedicated code component

### Slider
- buildStatus: Not started
- Not implemented: no dedicated code component

### Spinner
- buildStatus: Not started
- Not implemented: no dedicated code component

### StatusSelector / Panel
- buildStatus: Unknown
- Not implemented: no dedicated code component

### StatusSelector / Row
- buildStatus: Unknown
- Not implemented: no dedicated code component

### StatusSelector / Signal
- buildStatus: Unknown
- Not implemented: no dedicated code component

### StatusSelector / Trigger
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Stepper / Indicator
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Stepper / Step
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Switch
- buildStatus: In progress
- code: Switch (@nova/ui)
- Matched: Checked=False → checked, Checked=True → checked, State=Rest (CSS/default), State=Hover (Matched — CSS state, not prop), State=Focus visible (Matched — CSS state, not prop), State=Disabled → disabled
- Missing in code: None
- Extra in code: readOnly, required, uncheckedValue, value

### Switch / Field
- buildStatus: In progress
- Not implemented: no dedicated code component — proposed Switch+Field composite; bare Switch exists

### Tab
- buildStatus: Not started
- Not implemented: no dedicated code component

### Tab · Compact
- buildStatus: Not started
- Not implemented: no dedicated code component

### Tab · Nav
- buildStatus: Not started
- Not implemented: no dedicated code component

### Table / Cell · actions
- buildStatus: Done
- code: Table (@nova/ui)
- Matched: None
- Missing in code: None
- Extra in code: columns
- Caveat: coarse compound mapping to Table — flagged for manual review later

### Table / Cell · avatar
- buildStatus: Done
- code: Table (@nova/ui)
- Matched: None
- Missing in code: Show avatar
- Extra in code: columns
- Caveat: coarse compound mapping to Table — flagged for manual review later

### Table / Cell · badge
- buildStatus: Done
- code: Table (@nova/ui)
- Matched: None
- Missing in code: None
- Extra in code: columns
- Caveat: coarse compound mapping to Table — flagged for manual review later

### Table / Cell · chips
- buildStatus: Done
- code: Table (@nova/ui)
- Matched: None
- Missing in code: None
- Extra in code: columns
- Caveat: coarse compound mapping to Table — flagged for manual review later

### Table / Cell · select
- buildStatus: Done
- code: Table (@nova/ui)
- Matched: None
- Missing in code: None
- Extra in code: columns
- Caveat: coarse compound mapping to Table — flagged for manual review later

### Table / Cell · text
- buildStatus: Done
- code: Table (@nova/ui)
- Matched: None
- Missing in code: Variant=Default, Variant=Date, Variant=Truncated
- Extra in code: columns
- Caveat: coarse compound mapping to Table — flagged for manual review later

### Table / Empty state
- buildStatus: Done
- code: Table (@nova/ui)
- Matched: None
- Missing in code: None
- Extra in code: columns
- Caveat: coarse compound mapping to Table — flagged for manual review later

### Table / Header cell
- buildStatus: Done
- code: Table (@nova/ui)
- Matched: None
- Missing in code: Sort=Off, Sort=None, Sort=Asc, Sort=Desc
- Extra in code: columns
- Caveat: coarse compound mapping to Table — flagged for manual review later

### Table / Header row
- buildStatus: Done
- code: Table (@nova/ui)
- Matched: None
- Missing in code: Show more menu
- Extra in code: columns
- Caveat: coarse compound mapping to Table — flagged for manual review later

### Table / Results
- buildStatus: Done
- code: Table (@nova/ui)
- Matched: None
- Missing in code: Selection=None, Selection=Some
- Extra in code: columns
- Caveat: coarse compound mapping to Table — flagged for manual review later

### Table / Row
- buildStatus: Done
- code: Table (@nova/ui)
- Matched: State=Rest (CSS/default), State=Hover (Matched — CSS state, not prop), State=Selected (Matched — CSS/ARIA selected state, not prop), State=Selected Hover (Matched — CSS state, not prop)
- Missing in code: Show more menu
- Extra in code: columns
- Caveat: coarse compound mapping to Table — flagged for manual review later

### Tabs.List
- buildStatus: Not started
- Not implemented: no dedicated code component

### Text Input
- buildStatus: In progress
- code: TextField (@nova/ui)
- Matched: State=Rest (CSS/default), State=Hover (Matched — CSS state, not prop), State=Focus (Matched — CSS state, not prop), State=Disabled → disabled, State=Error → error
- Missing in code: Content=Empty, Content=Filled
- Extra in code: description, indicateRequired, label

### Textarea
- buildStatus: Not started
- Not implemented: no dedicated code component

### Theme Menu / Panel
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Tool rail
- buildStatus: Unknown
- Not implemented: no dedicated code component

### Tooltip
- buildStatus: Blocked
- code: Tooltip (@nova/ui)
- Matched: None
- Missing in code: None
- Extra in code: align, content, disableTooltip, heading, open, side

### View switcher
- buildStatus: Unknown
- Not implemented: no dedicated code component

## Code-only components (no Figma master found)

- AppContent
- AppHeader
- ButtonAvatar
- ButtonLink
- Icon
- IconButton
- LinkButton
- RHFTextField
- Stack
- TablePagination
- TextInput — internal component; not exported from the @nova/ui barrel
- Typography

## Icons

Icons are catalogued separately in `icons.json` (400 icons). They are excluded from prop/variant drift; see `icons.json` for the name + nodeId catalog.
