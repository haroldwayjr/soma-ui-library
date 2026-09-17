// Joins class names, dropping falsy entries. Not exported from the package
// barrel: consumers get finished components, and this exists so a component can
// append a consumer's layout `className` after its own recipe class.
//
// Order is the point. The recipe class comes first so the consumer's class wins
// on ties, which is what makes `className` usable for placement (margin, grid
// area, flex sizing) without letting it silently restyle the component.
export function cx(
  ...classNames: (false | null | string | undefined)[]
): string {
  return classNames.filter(Boolean).join(' ')
}
