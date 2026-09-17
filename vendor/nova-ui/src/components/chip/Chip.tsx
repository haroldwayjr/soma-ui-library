import type { CSSProperties, ReactElement, Ref } from 'react'

import { cx } from '../../helper/cx'
import { IconClose } from '../icon'
import {
  chipRecipe,
  type ChipVariant,
  dismissStyle,
  glyphStyle,
  labelStyle,
} from './Chip.css'

export type ChipProps = ChipBaseProps & ChipDismissProps

// The prop surface is enumerated rather than extended from
// `ComponentPropsWithRef<'span'>`. That intersection would put `onClick`,
// `onKeyDown`, `tabIndex`, and `role` on the public type of a root that is
// specified as inert, and spreading the rest onto it would make them work.
// Listing the passthrough is the contract, not an oversight. The pattern index
// signature admits `data-*` (and only `data-*`) for test and analytics hooks.
interface ChipBaseProps {
  [dataAttribute: `data-${string}`]: string | undefined
  children: string
  className?: string
  // Two different things depending on the shape of the chip: a real native
  // `disabled` on the dismiss button when there is one, and a purely visual mute
  // when there is not — a chip with no control has nothing to mark, and a grayed
  // value is still a value.
  disabled?: boolean
  id?: string
  ref?: Ref<HTMLSpanElement>
  style?: CSSProperties
  // Passthrough for placement, the same as `className`. Not a long-label policy:
  // a `title` on a `nowrap` chip is how an inaccessible truncation tooltip ships.
  // If a label is too long, shorten the label.
  title?: string
  variant: ChipVariant
}

// One unit, so no member can appear without the handler and no ref can be aimed
// at a button that was never rendered. A boolean `dismissible` is rejected on the
// same grounds: it admits a remove button that removes nothing.
//
// `dismissLabel` is required rather than composed from `children`. Figma specifies
// the name as `Remove {label}`, but a design system cannot manufacture that string
// without shipping English into every consumer's UI.
//
// `dismissRef` exists because the consumer owns focus after removal and `ref`
// lands on the inert root, which leaves `querySelector('button')` as the only way
// to reach the control that is about to unmount. A stopgap with a stated exit: it
// is `ChipGroup`'s job once that exists.
type ChipDismissProps =
  | {
      dismissLabel: string
      dismissRef?: Ref<HTMLButtonElement>
      onDismiss: () => void
    }
  | { dismissLabel?: never; dismissRef?: never; onDismiss?: never }

// `variant` is required so no call site is silently defaulted into a look it
// did not pick, matching Button and Badge.
export function Chip({
  children,
  className,
  disabled = false,
  dismissLabel,
  dismissRef,
  onDismiss,
  variant,
  ...props
}: ChipProps): null | ReactElement {
  // An empty label is an empty pill: a rounded rectangle with no meaning, and
  // nothing for a screen reader to read. `''` satisfies `string`, so this is the
  // only place it can be caught.
  if (children === '') return null

  return (
    <span
      className={cx(chipRecipe({ variant }), className)}
      {...props}
      // After the spread so the rendered state always matches the prop: this is
      // the hook the recipe's disabled rule selects on, and a passed-through
      // `data-disabled` must not be able to repaint the chip.
      data-disabled={disabled || undefined}
    >
      {/*
        The label carries its own element so `Chip.css.ts` can trim its text box —
        the trim applies to the box that formats the line, and setting it on the
        root does nothing. Not a styling hook for consumers.
      */}
      <span className={labelStyle}>{children}</span>
      {onDismiss === undefined ? null : (
        <button
          aria-label={dismissLabel}
          className={dismissStyle}
          disabled={disabled}
          // The click stops here. A chip very often sits inside a clickable row or
          // card, and letting the dismiss bubble means one click both removes the
          // value and activates the row — a wrong action with no error, which is
          // the worst kind. Doing it once here beats every consumer remembering.
          //
          // The cost, stated because it is not free: React calls
          // `stopPropagation` on the native event too, and its listener sits on the
          // root container, so a document-level delegated listener does not see
          // this click either. A consumer that needs the event should read it from
          // `onDismiss`. Keyboard activation goes through `click`, so Enter and
          // Space are covered by this one handler.
          onClick={(event) => {
            event.stopPropagation()
            onDismiss()
          }}
          ref={dismissRef}
          type="button"
        >
          <IconClose className={glyphStyle} size="xs" />
        </button>
      )}
    </span>
  )
}
