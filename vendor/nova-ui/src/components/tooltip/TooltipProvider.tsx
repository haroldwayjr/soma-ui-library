import type { ReactElement, ReactNode } from 'react'

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'

export interface TooltipProviderProps {
  children: ReactNode
}

/**
 * Shares hover-open delay across nearby tooltips, so moving through a row of
 * them does not repay the delay each time. Delay, close delay, and the
 * adjacent-tooltip timeout are Base UI's own defaults — system behavior, not
 * caller-configurable, per the README.
 */
export function TooltipProvider({
  children,
}: TooltipProviderProps): ReactElement {
  return <BaseTooltip.Provider>{children}</BaseTooltip.Provider>
}
