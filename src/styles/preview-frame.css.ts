import { assignVars, style } from '@vanilla-extract/css'
import { darkColors } from '@nova/ui/tokens/colors'
import { semantics } from '@nova/ui/tokens/semantic.css'

/** Scoped dark theme for component preview frames (does not flip the whole app). */
export const previewFrameDark = style({
  vars: assignVars(semantics.color, darkColors),
  background: semantics.color.surface.default,
  borderColor: semantics.color.border.subtle,
  color: semantics.color.text.primary.base,
})
