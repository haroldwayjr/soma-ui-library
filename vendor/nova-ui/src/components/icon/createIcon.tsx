import type { ReactElement, ReactNode, Ref } from 'react'

import { cx } from '../../helper/cx'
import { iconRecipe, type IconSize } from './Icon.css'

export interface IconGlyph {
  outline: ReactNode
  xs?: ReactNode
}

export type IconProps = IconBaseProps & IconLabelProps

interface IconBaseProps {
  ref?: Ref<SVGSVGElement>
  size: IconSize
}

type IconLabelProps = { className?: string } & (
  { label: string } | { label?: never }
)

const OUTLINE_VIEW_BOX = '0 0 24 24'
const XS_VIEW_BOX = '0 0 16 16'

export const createIcon = (
  name: string,
  glyph: IconGlyph,
): ((props: IconProps) => ReactElement) => {
  const Icon = ({ className, label, ref, size }: IconProps): ReactElement => {
    const xs = size === 'xs' && glyph.xs !== undefined

    return (
      <svg
        aria-hidden={label === undefined ? true : undefined}
        aria-label={label}
        className={cx(iconRecipe({ size }), className)}
        fill="none"
        focusable="false"
        ref={ref}
        role={label === undefined ? undefined : 'img'}
        strokeWidth="1.5"
        viewBox={xs ? XS_VIEW_BOX : OUTLINE_VIEW_BOX}
      >
        {xs ? glyph.xs : glyph.outline}
      </svg>
    )
  }

  Icon.displayName = `Icon(${name})`

  return Icon
}
