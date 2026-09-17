import { createContext, use } from 'react'

// Nova's own context, deliberately not Base UI's. A `Radio` outside a group is
// always a programming error: it has no name, no selection state, and no change
// handler, so Base UI renders a control that can never be selected and never
// submits. Base UI's own `useRadioGroupContext` returns `undefined` rather than
// throwing, so nothing surfaces the mistake without this.
const RadioGroupContext = createContext(false)

export const RadioGroupProvider = RadioGroupContext.Provider

export function useRequireRadioGroup(): void {
  const inGroup = use(RadioGroupContext)

  if (!inGroup && import.meta.env.DEV) {
    throw new Error(
      'Radio must be rendered inside a RadioGroup. Outside one it has no name and cannot be selected.',
    )
  }
}
