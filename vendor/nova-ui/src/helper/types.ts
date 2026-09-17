import type { ComponentPropsWithRef, ElementType } from 'react'

// The prop surface a wrapped Base UI primitive exposes to consumers.
//
// Two things are removed and one is put back:
//
// - `render` is Base UI's polymorphic escape hatch. Letting a consumer swap the
//   rendered element would move behavior and accessibility outside this package.
// - `className` is re-declared as a plain `string`. Base UI types it as
//   `string | ((state) => string)` so styles can react to component state;
//   here that job belongs to the recipe, and `className` is only a layout hook.
//
// Components must still merge the incoming `className` after their recipe
// class — see `cx`.
export type BaseUiProps<T extends ElementType> = Omit<
  ComponentPropsWithRef<T>,
  'className' | 'render'
> & {
  className?: string
}
