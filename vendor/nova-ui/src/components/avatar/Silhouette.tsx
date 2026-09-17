import type { ReactElement } from 'react'

import { silhouetteGlyphStyle } from './Avatar.css'

// Drawn locally from two circles rather than reused from `Icon` — see the
// README's Token gaps for why a bare silhouette does not belong in the icon
// set. Proportions are read off the Soma masters at the `lg` size and hold at
// every size because the three are a uniform scale of one another.
export function Silhouette(): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={silhouetteGlyphStyle}
      viewBox="0 0 40 40"
    >
      <circle cx={20} cy={15.5} fill="currentColor" r={8} />
      <circle cx={20} cy={44} fill="currentColor" r={17} />
    </svg>
  )
}
