import type { CSSProperties, ReactElement, Ref } from 'react'

import { cx } from '../../helper/cx'
import {
  badgeRecipe,
  type BadgeSize,
  type BadgeTone,
  type BadgeVariant,
  dotStyle,
  iconStyle,
  labelStyle,
} from './Badge.css'

// The prop surface is enumerated rather than extended from
// `ComponentPropsWithRef<'span'>`. That intersection would put `onClick`,
// `onKeyDown`, `tabIndex`, and `role` on the public type of a component that is
// specified as inert, and spreading the rest onto the root would make them work.
// Listing the passthrough is the contract, not an oversight. The pattern index
// signature admits `data-*` (and only `data-*`) for test and analytics hooks.
export interface BadgeProps {
  [dataAttribute: `data-${string}`]: string | undefined
  children: string
  className?: string
  // Visual only. There is no interactive element here to mark `aria-disabled`
  // on, and a muted status label is still a status label, so this exposes
  // nothing to assistive technology.
  disabled?: boolean
  id?: string
  /** Figma Leading: Plain / Status (dot) / Icon (status star). */
  leading?: 'dot' | 'icon' | 'none'
  ref?: Ref<HTMLSpanElement>
  size: BadgeSize
  style?: CSSProperties
  title?: string
  tone: BadgeTone
  variant: BadgeVariant
}

/** Soma Soft Leading=Icon — status/star outline (currentColor → icon.*). */
function LeadingStarIcon(): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={iconStyle}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.7292 1.1586L14.7964 7.23518L20.6997 7.82002C20.8403 7.83169 20.9745 7.8834 21.0866 7.969C21.1986 8.05461 21.2838 8.17054 21.332 8.30306C21.3803 8.43558 21.3895 8.57914 21.3587 8.71675C21.3278 8.85435 21.2582 8.98025 21.1581 9.07951L16.2997 13.8948L18.101 20.4379C18.1378 20.5767 18.1338 20.7232 18.0894 20.8597C18.045 20.9963 17.962 21.1171 17.8506 21.2076C17.7391 21.2982 17.6039 21.3546 17.4611 21.3701C17.3184 21.3856 17.1742 21.3595 17.0459 21.295L11.061 18.3314L5.08431 21.2913C4.95602 21.3559 4.81182 21.3819 4.66907 21.3664C4.52631 21.3509 4.39107 21.2945 4.27962 21.204C4.16816 21.1134 4.08524 20.9926 4.04082 20.8561C3.9964 20.7195 3.99237 20.5731 4.02922 20.4343L5.83047 13.8911L0.968474 9.07585C0.868311 8.97658 0.798691 8.85069 0.767856 8.71308C0.737021 8.57547 0.746263 8.43191 0.794487 8.29939C0.842711 8.16687 0.927897 8.05095 1.03996 7.96534C1.15202 7.87973 1.28627 7.82803 1.42681 7.81635L7.33014 7.23152L10.3927 1.1586C10.4557 1.03558 10.5514 0.932339 10.6693 0.860244C10.7872 0.788149 10.9228 0.75 11.061 0.75C11.1992 0.75 11.3347 0.788149 11.4526 0.860244C11.5705 0.932339 11.6662 1.03558 11.7292 1.1586Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Appearance axes are required so no call site is silently defaulted into a
// look or a meaning it did not pick. `variant` has one legal value today;
// adding Solid later widens a union instead of changing every consumer.
export function Badge({
  children,
  className,
  disabled = false,
  leading = 'none',
  size,
  tone,
  variant,
  ...props
}: BadgeProps): ReactElement {
  return (
    <span
      className={cx(badgeRecipe({ size, tone, variant }), className)}
      {...props}
      // After the spread so the rendered state always matches the prop: this is
      // the hook the recipe's disabled rule selects on, and a passed-through
      // `data-disabled` must not be able to repaint the badge. `data-tone` is
      // reserved for Storybook contrast probes and analytics — other components
      // must not set that attribute without documenting why.
      data-disabled={disabled || undefined}
      data-tone={tone}
    >
      {leading === 'dot' ? (
        <span aria-hidden="true" className={dotStyle} />
      ) : null}
      {leading === 'icon' ? <LeadingStarIcon /> : null}
      {/*
        The label carries its own element so `Badge.css.ts` can trim its text box —
        the trim applies to the box that formats the line, and setting it on the
        root does nothing. Not a styling hook for consumers.
      */}
      <span className={labelStyle}>{children}</span>
    </span>
  )
}
