import type { CSSProperties, ReactElement, ReactNode } from 'react'

import { Field as BaseField } from '@base-ui/react/field'

import { cx } from '../../helper/cx'
import {
  descriptionStyle,
  errorStyle,
  labelStyle,
  requiredMarkerStyle,
  rootStyle,
} from './Field.css'
import { FieldProvider } from './fieldContext'

export interface FieldProps {
  /**
   * The control this field labels — exactly one. Base UI associates it with the
   * label and the supporting line through Field context, so it needs no `id`,
   * `aria-labelledby`, or `aria-describedby` of its own.
   */
  children: ReactNode
  // Optionals accept an explicit `undefined` — matching Base UI's own prop types
  // — so wrapping components can forward "not set" without a conditional spread
  // for every prop under `exactOptionalPropertyTypes`.
  className?: string | undefined
  description?: string | undefined
  disabled?: boolean | undefined
  /**
   * External error text; presence controls invalid state. An empty string marks
   * the field invalid without describing it, so the Error part stays unmounted
   * rather than pointing `aria-describedby` at empty text. Non-empty text
   * replaces `description` in the shared supporting slot.
   */
  error?: string | undefined
  /**
   * Declares the field required: publishes `aria-required` to the control
   * through Field context and paints a decorative `*` after the label.
   *
   * Deliberately does not set the native `required` attribute — validation
   * belongs to the consuming form layer, and a native constraint would let the
   * browser block submission and show its own bubble before that layer renders
   * `error`.
   */
  indicateRequired?: boolean | undefined
  label: string
  name?: string | undefined
  style?: CSSProperties | undefined
}

export function Field({
  children,
  className,
  description,
  disabled = false,
  error,
  indicateRequired = false,
  label,
  name,
  style,
}: FieldProps): ReactElement {
  const isInvalid = error !== undefined
  const hasErrorText = isInvalid && error !== ''
  const hasDescription = description !== undefined && description !== ''

  return (
    <BaseField.Root
      className={cx(rootStyle, className)}
      disabled={disabled}
      invalid={isInvalid}
      name={name}
      style={style}
    >
      <BaseField.Label className={labelStyle}>
        {label}
        {indicateRequired ? (
          <span aria-hidden="true" className={requiredMarkerStyle}>
            *
          </span>
        ) : null}
      </BaseField.Label>
      {/*
        The provider renders no element, so the control stays a direct child of
        Root. Tests and styles that walk from the control to Root depend on that.
      */}
      <FieldProvider value={{ indicateRequired }}>{children}</FieldProvider>
      {hasErrorText ? (
        <BaseField.Error className={errorStyle} match>
          {error}
        </BaseField.Error>
      ) : hasDescription ? (
        <BaseField.Description className={descriptionStyle}>
          {description}
        </BaseField.Description>
      ) : null}
    </BaseField.Root>
  )
}
