import { style } from '@vanilla-extract/css'

import { semantics } from '../tokens/semantic.css'

// ADR 0004. The stacking order of a portalled surface lands here — on the Portal
// element, not on the Positioner.
//
// Both halves of the declaration are load-bearing. `z-index` applies only to
// positioned elements, and Base UI's portal element is a plain static `<div>`,
// so without a position the number is inert. Positioned *and* non-auto `z-index`
// is exactly the condition for a stacking context, and that context is what
// everything portalled inside it — including a further portal — is scoped to.
//
// Putting the same two lines on the Positioner instead looks equivalent and
// breaks nesting: a nested popup's Positioner is a sibling of its parent's
// inside a static portal `<div>`, which establishes no stacking context, so both
// resolve against the root and the lower number loses.
//
// `relative` rather than `fixed`. The element's only children are out-of-flow
// Positioners, so this leaves a zero-height block at the end of `<body>` — full
// width, but with no height it has no hit area and shifts nothing (measured:
// 1248x0 at the end of the story body). `fixed` would add `overflow` on
// `html`/`body`, mobile viewport chrome, and `backdrop-filter` to the surface
// for no additional guarantee.
//
// Note that this element becomes the Positioner's containing block, and that is
// unavoidable rather than a cost of choosing `relative`: `z-index` needs a
// position, and any non-static position is a containing block for the absolutely
// positioned descendant Base UI actually renders. `positionMethod` defaults to
// `'absolute'`, not `'fixed'` (`useAnchorPositioning.js:58`; the `FIXED` const in
// `SelectPositioner.js` is the pre-positioning fallback, applied only until
// floating-ui has measured — `:325`).
//
// Floating-ui compensates for the offset parent, and this was measured rather
// than assumed: with a 280x40 trigger at y=16 and `sideOffset={4}`, the popup
// lands at exactly x=16, y=60. See ADR 0004.

const portal = (layer: string): string =>
  style({
    position: 'relative',
    zIndex: layer,
  })

/**
 * Stacking order for portalled surfaces, keyed by role. Goes on the Portal part.
 *
 * The in-flow roles — `layer.raised` and `layer.sticky` — are deliberately not
 * here. They bind on the element itself, alongside its own `position: relative`
 * or `position: sticky`, so a component writes `zIndex: semantics.layer.sticky`
 * directly rather than reaching for a class meant for a portal.
 */
export const portalLayerStyle = {
  dialog: portal(semantics.layer.dialog),
  dropdown: portal(semantics.layer.dropdown),
  toast: portal(semantics.layer.toast),
  tooltip: portal(semantics.layer.tooltip),
}
