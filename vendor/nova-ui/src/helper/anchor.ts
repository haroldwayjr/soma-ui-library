import type { HTMLAttributeAnchorTarget } from 'react'

// `??`, not `||`: `rel=""` is explicit and must be preserved. Empty is not a
// tabnabbing hole — `_blank` already implies `noopener`.
export function externalRel(
  target: HTMLAttributeAnchorTarget | undefined,
  rel: string | undefined,
): string | undefined {
  return target === '_blank' ? (rel ?? 'noopener noreferrer') : rel
}

// `createLink` omits `href` when the route link is `disabled` or the protocol
// is blocked. Hosts still require `string` at the type level; this is the
// runtime hole that type cannot see.
export function missingHref(href: string | undefined): boolean {
  return href === undefined || href === ''
}

export function missingLabelOrHref(
  href: string | undefined,
  children: string,
): boolean {
  return children === '' || missingHref(href)
}
