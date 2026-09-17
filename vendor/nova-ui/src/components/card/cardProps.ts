import type { CSSProperties, ReactNode, Ref } from 'react'

// Enumerated rather than extended from `ComponentPropsWithRef<'div'>`. That
// intersection would put `onClick`, `onKeyDown`, `tabIndex`, and `role` on
// an inert panel, and spreading the rest onto the node would make them work
// — an interactive card with no keyboard path, which is out of scope. Listing
// the passthrough is the contract: placement (`className`, `style`) and test
// or analytics hooks (`data-*`, `id`, `ref`). The index signature admits
// `data-*` (and only `data-*`).
export interface CardContainerProps {
  [dataAttribute: `data-${string}`]: string | undefined
  children: ReactNode
  className?: string | undefined
  id?: string | undefined
  ref?: Ref<HTMLDivElement>
  style?: CSSProperties | undefined
}
