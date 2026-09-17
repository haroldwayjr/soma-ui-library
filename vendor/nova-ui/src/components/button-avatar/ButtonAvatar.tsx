import type { ComponentPropsWithRef, ReactElement } from 'react'

import { cx } from '../../helper/cx'
import { Avatar, type AvatarProps } from '../avatar/Avatar'
import { triggerRecipe } from './ButtonAvatar.css'

// Composes Avatar as a child rather than reimplementing its clip/image/
// fallback/presence-dot markup — this component owns only the interactive
// layer (native <button>, pointer cursor, focus ring). There is no hover
// or pressed fill: Avatar's clip is opaque, so a wash at the same size is
// invisible, and a larger "halo" ring around it is not the treatment we
// want. Avatar's own markup and CSS stay the single source of truth for
// how they render. That reuse does not extend to props: `initials` /
// `presence` / `size` / `src` are forwarded by name below, so a future
// Avatar prop still needs a matching addition here — it does not arrive
// "for free".
//
// Avatar is inert and carries no accessible name of its own (see Avatar's
// Usage story), so wrapping it in a real button makes a name unavoidable —
// required at the type level the same way RadioGroup requires a group name,
// rather than leaving a nameless control to an axe scan.
//
// `alt` is deliberately not part of this contract. The button's name is the
// only name this control has; forwarding a caller's `alt` would let the
// wrapped photo carry a second, competing accessible name inside an
// already-named button. Avatar's own default (`alt=''`, decorative) is what
// every ButtonAvatar renders.
export type ButtonAvatarProps = Omit<
  AvatarProps,
  'alt' | 'className' | 'id' | 'ref' | 'style'
> &
  Omit<
    ComponentPropsWithRef<'button'>,
    'aria-label' | 'aria-labelledby' | 'children' | 'className' | 'type'
  > &
  (
    | { 'aria-label': string; 'aria-labelledby'?: never }
    | { 'aria-label'?: never; 'aria-labelledby': string }
  ) & {
    className?: string
    type?: 'button' | 'reset' | 'submit'
  }

export function ButtonAvatar({
  className,
  initials,
  presence,
  size,
  src,
  type = 'button',
  ...props
}: ButtonAvatarProps): ReactElement {
  if (import.meta.env.DEV) {
    const ariaLabel = props['aria-label']
    const ariaLabelledBy = props['aria-labelledby']
    if (ariaLabel?.trim() === '' || ariaLabelledBy?.trim() === '') {
      console.warn(
        '@nova/ui ButtonAvatar: an empty `aria-label` / `aria-labelledby` leaves the control nameless.',
      )
    }
  }

  return (
    <button
      className={cx(triggerRecipe({ size }), className)}
      type={type}
      {...props}
    >
      <Avatar
        size={size}
        {...(initials === undefined ? {} : { initials })}
        {...(presence === undefined ? {} : { presence })}
        {...(src === undefined ? {} : { src })}
      />
    </button>
  )
}
