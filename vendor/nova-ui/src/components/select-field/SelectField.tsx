import type { CSSProperties, ReactElement, Ref } from 'react'

import { Field } from '../field'
import { Select, type SelectProps } from '../select'

// `aria-label` and `aria-labelledby` are removed rather than forwarded: `label`
// is required and is the accessible name, so a second naming path would compete
// with it. A name that must come from elsewhere is bare `Select`.
export interface SelectFieldProps<T extends string> extends Omit<
  SelectProps<T>,
  'aria-label' | 'aria-labelledby'
> {
  // Optionals accept an explicit `undefined`, matching Base UI's own prop types,
  // so the internal Field boundary can forward "not set" without a conditional
  // spread for every prop under `exactOptionalPropertyTypes`.
  /** Placement only. Lands on Field's root, not the trigger. */
  className?: string | undefined
  /** Help text under the control. Replaced by non-empty `error`. */
  description?: string | undefined
  /**
   * Presence marks the field invalid; a non-empty string renders as error text.
   * `undefined` is valid, `''` is invalid with no message.
   */
  error?: string | undefined
  /**
   * Paints the label asterisk **and** publishes `aria-required` to the trigger.
   * The two always travel together — an announced-nothing asterisk is the exact
   * disagreement Nova's field context exists to prevent.
   *
   * The native `required` attribute is what stays unset, so the browser cannot
   * block submission and show its own bubble before the consuming form layer
   * renders `error`.
   */
  indicateRequired?: boolean | undefined
  /** The visible label and the accessible name. */
  label: string
  /** Forwarded to the trigger button, not Field's root. */
  ref?: Ref<HTMLButtonElement> | undefined
  style?: CSSProperties | undefined
}

export function SelectField<T extends string>({
  className,
  description,
  disabled = false,
  error,
  indicateRequired = false,
  label,
  name,
  style,
  ...selectProps
}: SelectFieldProps<T>): ReactElement {
  return (
    <Field
      className={className}
      description={description}
      // `disabled` and `name` go to Field rather than Select: Field routes them
      // through `Field.Root`, whose values take precedence over the nested
      // control, so passing them to both would set up a conflict with a silent
      // winner.
      disabled={disabled}
      error={error}
      indicateRequired={indicateRequired}
      label={label}
      name={name}
      style={style}
    >
      {/*
        Select is Field's only child and introduces no wrapper of its own, so the
        trigger stays a direct child of Field.Root — which Field's disabled-state
        selectors and its tests both depend on.

        `readOnly` is in `selectProps` and reaches Select directly: `Field.Root`
        has no `readOnly` prop, so unlike `disabled` there is nothing to route
        through. It is the one state prop where the two layers do not mirror.
      */}
      <Select {...selectProps} />
    </Field>
  )
}
