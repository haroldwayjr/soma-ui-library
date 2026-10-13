# Redraw Semantic mapping elbow connectors

**When:** After adding, removing, reordering, renaming, or reparenting any row in Colors → Semantic mapping (`1:3317` inside `1:3311`).

**Why:** `Tree/*` frames are absolute-positioned VECTOR elbows. Row shifts leave stale trunks that miss children or run into the next parent.

## Required steps (same Figma session as the row edit)

1. Switch to the Colors page; load `1:3317`.
2. For **each** frame named `Tree/*` (and create missing trees for parents that have children):
   - Parent row = strip `Tree/` from the frame name.
   - Children = contiguous rows immediately below whose **full names** start with `{parent}.`  
     Stop at the first non-match. Do **not** treat the next sibling parent as a child.
   - `tree.y` = parent row `y`
   - `tree.height` = `52 × (1 + childCount)` (= `lastChild.y + 52 − parent.y`)
   - Rebuild the child VECTOR named `connector`:
     - Vertical trunk from `(0, 0)` to **last elbow Y only** (no tip past the last child into the next parent)
     - For each child index `i ≥ 1`: elbow at ≈ `72.89 + (i − 1) × 52` local Y (match `Tree/surface.brand`)
     - Stroke: 1px neutral grey (existing unbound style)
   - If `childCount === 0`, delete the Tree frame.
3. Orphan variants (e.g. `action.ghost.hover` without `action.ghost`) → add the parent row + Tree first, then redraw.
4. Leaf tokens — **no** Tree frame.
5. After any sheet-wide shift, redraw **all** trees — do not skip “unchanged” ones.

## Validation (per edited tree)

- Child name list is prefix-only under the parent.
- `trunkEndLocalY === lastElbowLocalY`
- `tree.bottom ===` next non-child row `y`

## Reference geometry

Inspect `Tree/surface.brand` connector before inventing a new path style.

## Agent rule

- Cursor: `.cursor/rules/soma-semantic-elbows.mdc` (`alwaysApply`)
- Docs: `docs/design-system/soma/token-rules.md` → **Semantic mapping elbows (mandatory)**
