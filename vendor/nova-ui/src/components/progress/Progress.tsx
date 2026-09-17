import type { CSSProperties, ReactElement, Ref } from 'react'

import { Progress as BaseProgress } from '@base-ui/react/progress'

import { cx } from '../../helper/cx'
import {
  hiddenLabelStyle,
  indicatorStyle,
  labeledGapStyle,
  type ProgressSize,
  rootStyle,
  trackRecipe,
  valueStyle,
} from './Progress.css'

// Enumerated rather than extended from `ComponentPropsWithRef<'div'>`, the
// same reasoning Badge's contract carries: Progress is read-only, so
// `onClick`, `onKeyDown`, and `tabIndex` must not reach the public type just
// because spreading the rest onto Root would make them work.
export interface ProgressProps {
  [dataAttribute: `data-${string}`]: string | undefined
  // Points at existing visible copy (a filename, a step title) to use as the
  // accessible name instead of `children`. Mutually exclusive with
  // `children` — see the precedence rule below.
  'aria-labelledby'?: string
  // Accessible name, rendered as a visually hidden `Progress.Label`. Empty or
  // whitespace-only is treated the same as omitted.
  children?: string
  className?: string
  // Visual only — Base UI's Progress has no disabled concept. Mutes track,
  // indicator, and value tokens without changing any ARIA attribute.
  disabled?: boolean
  id?: string
  layout: 'bare' | 'labeled'
  ref?: Ref<HTMLDivElement>
  size: ProgressSize
  style?: CSSProperties
  // 0–100 only — Base UI's default `Value` / `aria-valuetext` formatting
  // divides the raw `value` by 100 and ignores `min` / `max` entirely (only
  // the Indicator's fill width uses the range), so exposing a custom range
  // would make the label silently disagree with the fill. See Deliberately
  // absent in the README.
  value: number
}

export function Progress({
  children,
  className,
  disabled = false,
  layout,
  size,
  value,
  ...props
}: ProgressProps): ReactElement {
  const hasLabel = typeof children === 'string' && children.trim().length > 0
  const hasLabelledBy =
    typeof props['aria-labelledby'] === 'string' &&
    props['aria-labelledby'].trim().length > 0
  const valueInRange = Number.isFinite(value) && value >= 0 && value <= 100

  if (import.meta.env.DEV) {
    if (hasLabel && hasLabelledBy) {
      console.warn(
        '@nova/ui Progress: both `children` and `aria-labelledby` were provided. `aria-labelledby` takes precedence — the visually hidden label from `children` will not render.',
      )
    } else if (!hasLabel && !hasLabelledBy) {
      console.warn(
        '@nova/ui Progress: no accessible name. Pass `children` (rendered as a hidden label) or `aria-labelledby` pointing at existing visible text.',
      )
    }
    if (!valueInRange) {
      console.warn(
        '@nova/ui Progress: `value` must be between 0 and 100. Out-of-range values are not clamped — they keep `complete` from firing (`value === 100`) and can make `aria-valuetext` disagree with the fill. Map the source range onto 0–100 at the call site.',
      )
    }
  }

  return (
    <BaseProgress.Root
      className={cx(
        rootStyle,
        layout === 'labeled' && labeledGapStyle,
        className,
      )}
      {...props}
      // After the spread so the rendered state always matches the prop, the
      // same placement Badge uses for its own visual-only `disabled`.
      data-disabled={disabled || undefined}
      value={value}
    >
      {/* Mounted only while `children` supplies a name — never alongside
          `aria-labelledby`. Base UI registers this element's id as Root's own
          `aria-labelledby` the moment it mounts, with or without content, so
          rendering it unconditionally would compete with a caller-supplied
          `aria-labelledby` for that attribute. See Progress's README. */}
      {hasLabel && !hasLabelledBy && (
        <BaseProgress.Label className={hiddenLabelStyle}>
          {children}
        </BaseProgress.Label>
      )}
      <BaseProgress.Track className={trackRecipe({ size })}>
        <BaseProgress.Indicator className={indicatorStyle} />
      </BaseProgress.Track>
      {layout === 'labeled' && <BaseProgress.Value className={valueStyle} />}
    </BaseProgress.Root>
  )
}
