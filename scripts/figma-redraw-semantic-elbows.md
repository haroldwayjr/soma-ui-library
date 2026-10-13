# Redraw Semantic mapping elbow connectors

**When:** After adding, removing, or reordering any row in Colors → Semantic mapping (`1:3317` inside `1:3311`).

**Why:** `Tree/*` frames are absolute-positioned VECTOR elbows. A 52px row insert shifts every sibling below; stale connectors miss their rows.

## Required steps (same Figma session as the row edit)

1. Switch to the Colors page; load `1:3317`.
2. For **each** frame named `Tree/*`:
   - Find the parent token row with the same name (strip `Tree/`).
   - Collect contiguous child rows (`parent.*` suffixes) immediately below the parent until the next non-child / section header.
   - Set tree `y` = parent row `y`; tree `height` = `52 * childCount` (or measured span).
   - Rebuild the child VECTOR named `connector`:
     - Vertical trunk from `(0, 0)` to last elbow Y
     - For each child index `i >= 1`: elbow at centerline ≈ `38 + (i - 1) * 52` (match `Tree/surface.brand` / `636:29`)
     - Stroke: 1px neutral grey (existing unbound style)
3. Leaf tokens (no nested children) — **no** Tree frame.
4. Do not skip “unchanged” trees after a sheet-wide shift; redraw **all** trees.

## Reference geometry

Inspect `Tree/surface.brand` connector `636:29` (`vectorNetwork` vertices/segments) before inventing a new path style.

## Agent rule

Documented in `docs/design-system/soma/token-rules.md` → **Semantic mapping elbows (mandatory)**. Any agent that mutates the mapping sheet must redraw elbows in that turn.