import { style } from '@vanilla-extract/css'

// Column shell around `AppHeader` + `AppContent`. The frame owns the
// viewport floor (`100dvh`); `AppContent` grows into the leftover. Do not
// subtract the 56px bar here — wrapping the header would break the calc.
export const appFrameStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minBlockSize: '100dvh',
})
