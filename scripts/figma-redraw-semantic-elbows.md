# Redraw Semantic mapping elbow connectors

**When:** After adding, removing, reordering, renaming, or reparenting any row in Colors → Semantic mapping (`1:3317` inside `1:3311`).

**Why:** `Tree/*` frames hold VECTOR elbows. Row shifts leave stale trunks, sharp corners, or tips that miss Token chips.

## Geometry (current)

Single VECTOR `connector` per tree:

| Constant | Value | Role |
|---|---|---|
| `R` | **18** | Child elbow quarter-circle |
| `R_TOP` | **8** | Parent stub corner |
| `GUTTER_INSET` | **8** | Trunk left of parent Token chip |
| `TIP_OVERSHOOT` | **6** | Tip into child chip (optical) |
| `strokeWeight` | **2** | `#BFBFBF` grey |
| `strokeCap` / `strokeJoin` | **ROUND** | |

### Layout

1. Parent/children via `{parent}.` prefix (exclude `Tree/*` from the walk).
2. `tree.y = parent.y`; height = last child span; width ≥ **96**; `clipsContent = false`.
3. `connX = parentChipLeft - GUTTER_INSET - treeAbsX`.
4. `conn.y = parentChip vertical center` (relative to tree). Path y=0 is that attach point.
5. `stubX = parentChipLeft - (treeAbsX + connX)` — horizontal into parent left edge.
6. Per child: `centerLocalY = (child.y + child.h/2 - tree.y) - conn.y`.
7. `tipX = childChipLeft - (treeAbsX + connX) + TIP_OVERSHOOT` (must be `> R`).

### Path (connected `vectorNetwork`)

```
M stubX 0
L R_TOP 0
C … → (0, R_TOP)          // rounded top into trunk
L 0 (cy - R)
C … → (R, cy)             // rounded child elbow (K = R × 0.5522847498)
L tipX cy
```

Multi-child: trunk continues through each junction; one cubic elbow per child. **No** SVG `A` (unsupported). **No** chamfer-only polylines.

### Validate

- Path contains two `C` segments per single-child tree (top + elbow)
- Tip abs X ≈ child Token chip left + 6
- Stub ends at parent Token chip left edge
- Trunk does not run through the next parent row

## Agent rule

- Cursor: `.cursor/rules/soma-semantic-elbows.mdc`
- Docs: `docs/design-system/soma/token-rules.md` → **Semantic mapping elbows**
