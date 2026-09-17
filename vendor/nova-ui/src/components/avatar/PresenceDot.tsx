import type { ReactElement } from 'react'

import { type AvatarPresence, presenceRecipe } from './Avatar.css'

export function PresenceDot({
  presence,
  size,
}: {
  presence: AvatarPresence
  size: 'lg' | 'md'
}): ReactElement {
  return (
    <span aria-hidden="true" className={presenceRecipe({ presence, size })} />
  )
}
