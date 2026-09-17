import { createContext, use } from 'react'

// Base UI's Field context carries disabled, invalid, name, and the label/control
// and description ID wiring, so a nested control inherits all of that already.
// It has no notion of "required" — Field.Root exposes no `required` prop — and
// Nova deliberately does not set the native attribute (see Field's
// `indicateRequired`). This context closes that one gap so the ARIA state and the
// label asterisk cannot disagree: a control reads what the surrounding Field was
// told rather than requiring the consumer to pass the same boolean twice.
const FieldContext = createContext<FieldState | undefined>(undefined)

interface FieldState {
  indicateRequired: boolean
}

export const FieldProvider = FieldContext.Provider

export interface FieldControlProps {
  // Always present, so spreading these props last overrides any `aria-required`
  // a caller leaked past the type-level omission. React omits the attribute
  // entirely when the value is `undefined`, so an optional field stays clean
  // rather than rendering "false".
  'aria-required': true | undefined
}

// The ARIA props a field control must spread onto its rendered element.
//
// Unlike `useRequireRadioGroup`, this does not throw outside a Field. A control
// rendered standalone is a legitimate composition — it simply has no label to
// mark, so there is nothing to announce. The attribute is omitted rather than set
// to "false" when the field is optional.
export function useFieldControlProps(): FieldControlProps {
  const field = use(FieldContext)

  return {
    'aria-required': field?.indicateRequired === true ? true : undefined,
  }
}
