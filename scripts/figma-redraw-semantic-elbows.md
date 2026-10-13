# Redraw Semantic mapping elbow connectors

**When:** After adding, removing, reordering, renaming, or reparenting any row in Colors → Semantic mapping (`1:3317` inside `1:3311`).

**Target look:** Simple **L** from the **bottom** of the parent Token chip → rounded corner → **left mid** of the child Token chip.  
Reference: classic `fg-secondary` → `fg-secondary_hover` style — **not** a leftward C/S-hook stub.

## Geometry

| Constant | Value | Role |
|---|---|---|
| `R` | **8** | Child elbow quarter-circle |
| `TRUNK_INSET` | **10** | Trunk X = parent chip left + 10 (under first glyphs) |
| `TIP_INTO` | **4** | Tip past child chip left into fill (flush join; no gap) |
| `strokeWeight` | **1.5** | **`#667085`** — darker than Token chip border (`#D0D5DD`) |
| `strokeCap` | **NONE** | Hard tip (ROUND caps left a visual gap) |
| `strokeJoin` | **ROUND** | |

### Layout

1. Children = contiguous rows below parent whose names start with `{parent}.` (skip `Tree/*`).
2. `tree.y = parent.y`; height = last-child span; width ≥ **64**; `clipsContent = false`.
3. `trunkAbsX = parentChipLeft + TRUNK_INSET`
4. `conn.x = trunkAbsX - treeAbsX`
5. `conn.y = parentChipBottom - treeAbsY` — path `(0,0)` is **parent chip bottom**
6. Per child: `centerLocalY = (child.y + child.h/2 - tree.y) - conn.y`
7. `tipX = childChipLeft - trunkAbsX + TIP_INTO` (must be `> R`). Raise `Tree/*` above token rows so the tip paints on the chip border.

### Path (connected `vectorNetwork` — no left stub)

```
M 0 0
L 0 (cy - R)
C 0 (cy - R + K), (R - K) cy, R cy     // K = R × 0.5522847498
L tipX cy
```

Multi-child: trunk through each junction; one cubic elbow per child.

### Forbidden

- Leftward stub / C-hook from parent mid-left
- Chamfer-only polylines / sharp L only
- SVG `A` (unsupported)
- Legacy `conn.y = 40` with wrong tip constants

### Validate

- Path is a simple L (`M 0 0 L 0 … C … L tipX …`) — no leading horizontal stub
- Vertical starts at parent chip **bottom**
- Tip abs X = child Token chip left **+ 4** (flush, no gap)
- Stroke darker than chip border (`#667085` vs ~`#D0D5DD`)
- No bleed into the next parent row

## Agent rule

- Cursor: `.cursor/rules/soma-semantic-elbows.mdc`
- Docs: `docs/design-system/soma/token-rules.md` → **Semantic mapping elbows**
