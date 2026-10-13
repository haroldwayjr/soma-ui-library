# Redraw Semantic mapping elbow connectors

**When:** After adding, removing, reordering, renaming, or reparenting any row in Colors → Semantic mapping (`1:3317` inside `1:3311`).

**Why:** `Tree/*` frames hold VECTOR elbows. Row shifts leave stale trunks, disconnected branches, or strokes that bleed into the next parent.

## Required steps (same Figma session as the row edit)

1. Switch to the Colors page; load `1:3317`.
2. For **each** parent token that has nested children (and every existing `Tree/*`):
   - Parent row = strip `Tree/` from the frame name (or the token name).
   - Children = contiguous rows **immediately below** whose names start with `{parent}.`  
     **Exclude** other `Tree/*` frames from the walk. Stop at the first non-match.
   - If `childCount === 0`: delete the Tree. If children exist but no Tree: create one.
   - Geometry:
     - `tree.y = parent.y`
     - `tree.height = lastChild.y + lastChild.height - parent.y` (= `52 × (1 + childCount)`)
     - `tree.width = 44`
     - **`tree.clipsContent = true`** (blocks bleed into the next parent)
   - Delete old `connector` VECTOR(s). Create a fresh VECTOR named `connector` at **`(24, 0)`** so vertex Y = tree-local Y.
   - For each child: `centerY = child.y + child.height / 2 - tree.y` (typically `78, 130, 182…`). **Do not** use legacy `conn.y = 40`.
   - Build a **connected `vectorNetwork`** with **rounded elbows** (not sharp L paths):
     - `CORNER = 8.330574`, `tipX = 20`
     - Per child: trunk junction `(0, centerY - CORNER)` → chamfer `(CORNER, centerY)` → tip `(tipX, centerY)`
     - Vertical trunk visits every junction in order from `(0, 0)`; every elbow shares its trunk vertex (no floating subgraphs)
     - `strokeJoin = ROUND`, `strokeCap = ROUND`, 1px grey (sample from a known-good connector before delete)
   - Assert: tip Y = `centerY` (±0.5), trunk ends at last junction (not past last tip), `tree.bottom === next non-child row y`.
3. After any sheet-wide shift, redraw **all** trees — do not skip “unchanged” ones.

## Known failure modes (avoid)

| Symptom | Cause |
|---|---|
| Missing first branch / floating elbow | Disconnected `vectorNetwork` (e.g. trunk `0 → last` skipping intermediates) |
| Elbows ~3px low + stroke into next parent | Legacy `conn.y = 40` + tip past last elbow |
| Secondary tree “owns” ghost rows | Orphan variants without parent — add parent + Tree first |

## Agent rule

- Cursor: `.cursor/rules/soma-semantic-elbows.mdc` (`alwaysApply`)
- Docs: `docs/design-system/soma/token-rules.md` → **Semantic mapping elbows (mandatory)**
