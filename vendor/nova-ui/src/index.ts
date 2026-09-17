// The design system's public API.
//
// This lib is the ONLY project allowed to import `@base-ui/react` and Vanilla
// Extract authoring APIs — a boundary rule in eslint.config.ts enforces it.
// Base UI provides unstyled, accessible behavior; Vanilla Extract compiles our
// styles to static CSS at build time (zero runtime, no style engine shipped).
//
// Consumers get finished components, never the primitives, so re-styling or
// swapping the underlying primitive library stays contained here.
//
// Internally, building blocks live in `components/` and larger assembled UI in
// `patterns/`. Both are re-exported from this barrel; consumers import from
// `@nova/ui` either way.

export * from './components/avatar'
export * from './components/badge'
export * from './components/button'
export * from './components/button-avatar'
export * from './components/button-link'
export * from './components/card'
export * from './components/checkbox'
export * from './components/chip'
export * from './components/field'
export * from './components/icon'
export * from './components/icon-button'
export * from './components/link'
export * from './components/link-button'
export * from './components/logomark'
export * from './components/pagination'
export * from './components/progress'
export * from './components/radio'
export * from './components/select'
export * from './components/select-field'
export * from './components/stack'
export * from './components/switch'
export * from './components/table'
export * from './components/text-field'
export * from './components/tooltip'
export * from './components/typography'
export { initColorScheme } from './helper/colorScheme'
export * from './patterns/app-content'
export * from './patterns/app-header'
export * from './patterns/table-pagination'
