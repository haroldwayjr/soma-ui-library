import type { CSSProperties, ReactElement, Ref } from 'react'

import { Avatar as BaseAvatar } from '@base-ui/react/avatar'

import { cx } from '../../helper/cx'
import {
  type AvatarPresence,
  type AvatarSize,
  clipStyle,
  imageStyle,
  initialsRecipe,
  rootRecipe,
  silhouetteStyle,
} from './Avatar.css'
import { PresenceDot } from './PresenceDot'
import { Silhouette } from './Silhouette'

// The prop surface is enumerated rather than extended from
// `ComponentPropsWithRef<'span'>`, the same choice Badge makes and for the
// same reason: Avatar is inert, and an intersection with the native element
// would put `onClick` / `onKeyDown` / `tabIndex` / `role` back on the public
// type. The pattern's index signature admits `data-*` only.
export interface AvatarProps {
  [dataAttribute: `data-${string}`]: string | undefined
  // Decorative by default: the identity is expected to be named in
  // surrounding text, not carried by the photo's alt text. Pass a real name
  // only when no nearby text already says it.
  alt?: string
  className?: string
  id?: string
  // Fallback text shown while there is no photo, or the photo errors. Capped
  // to one grapheme at `sm` and two at `md` / `lg` regardless of the string's
  // length — see the README's Appearance section for why. A blank string
  // (after trimming) is treated the same as omitted.
  initials?: string
  // Optional status dot. Accepted at every size so a caller does not have to
  // branch on `size` to pass it, but it is a documented no-op at `sm` — a
  // ringed dot would cover most of a 20px edge.
  presence?: AvatarPresence
  ref?: Ref<HTMLSpanElement>
  size: AvatarSize
  src?: string
  style?: CSSProperties
}

const INITIALS_CAP: Record<AvatarSize, number> = { lg: 2, md: 2, sm: 1 }

// Grapheme clusters, not code points: `Array.from` alone splits UTF-16 code
// points, which fixes the surrogate-pair miscount but still overcounts a
// flag emoji or a base character plus a combining mark as two. A locale-less
// `Intl.Segmenter` is created once at module scope — constructing one per
// render is wasted work for a value that never changes.
const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: 'grapheme',
})

export function Avatar({
  alt = '',
  className,
  id,
  initials,
  presence,
  ref,
  size,
  src,
  style,
  ...props
}: AvatarProps): ReactElement {
  const label = normalizeInitials(initials, size)

  if (import.meta.env.DEV && presence !== undefined && size === 'sm') {
    console.warn(
      '@nova/ui Avatar: `presence` is a no-op at `size="sm"`. The prop is accepted so callers do not have to branch on size, but a ringed dot is not rendered.',
    )
  }

  return (
    <BaseAvatar.Root
      className={cx(rootRecipe({ size }), className)}
      id={id}
      ref={ref}
      style={style}
      {...props}
    >
      {/*
        The clip lives on this inner span, not Root: Root also anchors the
        presence dot, and a circular `overflow: hidden` on that same box would
        cut the dot along with the photo. See Avatar.css.ts.
      */}
      <span className={clipStyle}>
        {src !== undefined && (
          <BaseAvatar.Image alt={alt} className={imageStyle} src={src} />
        )}
        <BaseAvatar.Fallback
          className={
            label === undefined ? silhouetteStyle : initialsRecipe({ size })
          }
        >
          {label ?? <Silhouette />}
        </BaseAvatar.Fallback>
      </span>
      {presence !== undefined && size !== 'sm' && (
        <PresenceDot presence={presence} size={size} />
      )}
    </BaseAvatar.Root>
  )
}

// Graphemes, not UTF-16 code units: `.length` overcounts a surrogate-pair
// character, and even code-point splitting (`Array.from` alone) still
// overcounts a flag emoji or a combining-mark name — neither is "letters"
// either way.
function normalizeInitials(
  initials: string | undefined,
  size: AvatarSize,
): string | undefined {
  const trimmed = initials?.trim()
  if (trimmed === undefined || trimmed === '') return undefined

  const graphemes = Array.from(
    graphemeSegmenter.segment(trimmed),
    (entry) => entry.segment,
  )

  return graphemes.slice(0, INITIALS_CAP[size]).join('')
}
