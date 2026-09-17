import { assignVars, globalStyle } from '@vanilla-extract/css'

import { darkColors } from './colors'
import { semantics } from './semantic.css'

// The only place a theme is chosen. The roles and their light values are
// declared on `:root` by semantic.css.ts; this file re-assigns the same
// variables with their dark values wherever dark applies.
globalStyle(':root[data-theme="dark"]', {
  vars: assignVars(semantics.color, darkColors),
})

// Follow the OS until the application stores an explicit user preference.
globalStyle(':root:not([data-theme])', {
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: assignVars(semantics.color, darkColors),
    },
  },
})
