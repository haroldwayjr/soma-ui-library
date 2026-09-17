import type { ReactElement } from 'react'

import { glyphStyle } from './Select.css'

// Placeholder geometry until the Soma glyph set is exported. Decorative —
// `aria-selected` and the value text carry the meaning — so it is `aria-hidden`
// and contributes nothing to the accessible name.
//
// Carries `glyphStyle` itself rather than relying on a parent to size it. An
// `<svg>` with a `viewBox` and no width/height is a replaced element with no
// intrinsic size, so it falls back to the CSS default 300×150 and renders
// enormous. The wrapper being 12px does not constrain it — only sizing the
// `<svg>` does.
export function ChevronDown(): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={glyphStyle}
      fill="none"
      focusable="false"
      viewBox="0 0 12 12"
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}
