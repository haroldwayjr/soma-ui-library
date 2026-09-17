import type { ReactElement } from 'react'

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'

import { cx } from '../../helper/cx'
import { portalLayerStyle } from '../../styles/layer.css'
import {
  arrowStyle,
  bodyStyle,
  headingStyle,
  popupStyle,
  richBodyStyle,
  richPopupStyle,
  SIDE_OFFSET_PX,
} from './Tooltip.css'

export type TooltipAlign = 'center' | 'end' | 'start'
export interface TooltipProps {
  /** Alignment along the preferred side. */
  align?: TooltipAlign | undefined
  /** One trigger element that accepts merged props and a ref. */
  children: ReactElement
  /**
   * Short visual label or supplementary hint. Paired with `heading` this
   * becomes the Rich shape's dimmer description line; alone it is the
   * Simple shape's only line.
   */
  content: string
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean | undefined
  /**
   * Returns `children` unchanged and mounts no tooltip relationship — not the
   * same as passing a native `disabled` prop to the trigger control itself,
   * which is a separate, unrelated choice that also happens to suppress the
   * pointer and focus events a tooltip needs to open.
   */
  disableTooltip?: boolean | undefined
  /**
   * A bold heading rendered above `content`, selecting the Rich shape. Named
   * `heading`, not `title`, because `title` collides with the native DOM
   * attribute. Empty or whitespace-only is treated the same as omitted.
   */
  heading?: string | undefined
  /**
   * Narrower than Base UI's own `Tooltip.Root` `onOpenChange`, which also
   * reports an `eventDetails` second argument (hover, focus, `Escape`,
   * outside press). Tooltip callers have not needed the reason so far — widen
   * this if one does.
   */
  onOpenChange?: ((open: boolean) => void) | undefined
  /** Controlled open state. */
  open?: boolean | undefined
  /** Preferred side before collision handling. */
  side?: TooltipSide | undefined
}

export type TooltipSide = 'bottom' | 'left' | 'right' | 'top'

export function Tooltip({
  align = 'center',
  children,
  content,
  defaultOpen,
  disableTooltip = false,
  heading,
  onOpenChange,
  open,
  side = 'top',
}: TooltipProps): ReactElement {
  if (disableTooltip) {
    return children
  }

  const hasHeading = typeof heading === 'string' && heading.trim().length > 0

  const handleOpenChange = (nextOpen: boolean): void => {
    onOpenChange?.(nextOpen)
  }

  return (
    <BaseTooltip.Root
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      open={open}
    >
      <BaseTooltip.Trigger render={children} />
      {/* The stacking order goes on the Portal, not the Positioner — ADR 0004,
          mirroring Select. */}
      <BaseTooltip.Portal className={portalLayerStyle.tooltip}>
        <BaseTooltip.Positioner
          align={align}
          side={side}
          sideOffset={SIDE_OFFSET_PX}
        >
          {/* Base UI wires neither `role="tooltip"` nor an `aria-describedby`
              association itself — see its own note that a tooltip is
              visual-only. `role="tooltip"` is the one piece this component
              adds; the description association stays unwired, matching the
              README's "must not rely on it" framing. */}
          <BaseTooltip.Popup
            className={cx(popupStyle, hasHeading ? richPopupStyle : undefined)}
            role="tooltip"
          >
            {hasHeading ? (
              <>
                <span className={headingStyle}>{heading}</span>
                <span className={richBodyStyle}>{content}</span>
              </>
            ) : (
              <span className={bodyStyle}>{content}</span>
            )}
            <BaseTooltip.Arrow className={arrowStyle} />
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
