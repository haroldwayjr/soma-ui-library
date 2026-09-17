import '../tokens/themes.css'

import { globalStyle } from '@vanilla-extract/css'

import { semantics } from '../tokens/semantic.css'

globalStyle(':root', {
  colorScheme: 'light',
  fontFamily: semantics.font.family.body,
})

globalStyle(':root[data-theme="dark"]', {
  colorScheme: 'dark',
})

globalStyle(':root:not([data-theme])', {
  '@media': {
    '(prefers-color-scheme: dark)': {
      colorScheme: 'dark',
    },
  },
})

// Split rather than the usual one-line `*, *::before, *::after`, because jsdom
// discards a whole rule whose selector list contains a pseudo-element — verified:
// with `::before` in the list `getComputedStyle` returns `''` for the property,
// and without it the same declaration resolves. Components rely on this reset
// instead of re-declaring it, and `vitest.setup.ts` loads this sheet, so a rule
// jsdom cannot see would silently leave every unit test measuring `content-box`.
// Identical to the combined form in a browser; keep it split.
globalStyle('*', {
  boxSizing: 'border-box',
})

globalStyle('*::before, *::after', {
  boxSizing: 'border-box',
})

globalStyle('html, body, #root', {
  minHeight: '100%',
})

globalStyle('body', {
  background: semantics.color.surface.default,
  color: semantics.color.text.primary.base,
  margin: 0,
})

globalStyle('button, input, select, textarea', {
  font: 'inherit',
})

// ADR 0004, and the half of Decision 5 that is not a token. The layer scale
// starts at 1, which is only safe if nothing else in the document competes in
// the root stacking context. Feature code cannot author CSS — the Vanilla
// Extract APIs are contained to this lib — but it can write an inline
// `style={{ zIndex: 10 }}` on a positioned section, and that would outrank a
// dropdown at 3.
//
// `isolation: isolate` makes the application's mount node a stacking context,
// so any such number is scoped inside it and can never reach a portal. Portals
// mount to `<body>`, outside this context, and keep their order.
//
// Coupled to the mount node by id, because the alternative is this lib guessing
// at a selector. `#root` is `apps/care` (`index.html` and `main.tsx` both name
// it); `#storybook-root` is Storybook's, which loads this same sheet and is a
// known consumer rather than a hypothetical one. Without it a decorator writing
// a raw `z-index` could cover a popup in Storybook and never do so in the app —
// a false alarm in the one place the layering is looked at by eye. A third
// application has to add its own id here.
globalStyle('#root, #storybook-root', {
  isolation: 'isolate',
})
