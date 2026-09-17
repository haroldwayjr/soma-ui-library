import { globalStyle } from '@vanilla-extract/css'
import { semantics } from '@nova/ui/tokens/semantic.css'

globalStyle(':root', {
  vars: {
    '--lib-surface': semantics.color.surface.default,
    '--lib-surface-subtle': semantics.color.surface.subtle,
    '--lib-text': semantics.color.text.primary.base,
    '--lib-text-muted': semantics.color.text.secondary.base,
    '--lib-border': semantics.color.border.hairline,
    '--lib-brand': semantics.color.action.primary.base,
    '--lib-focus-ring': semantics.color.focus.ring.base,
    '--lib-danger': semantics.color.text.danger.base,
    '--lib-success': semantics.color.text.success.base,
    '--lib-icon-tertiary': semantics.color.icon.tertiary,
    '--lib-radius-sm': semantics.radius.tooltip,
    '--lib-radius-md': semantics.radius.surface,
    '--lib-space-1': semantics.space[4],
    '--lib-space-2': semantics.space[8],
    '--lib-space-3': semantics.space[12],
    '--lib-space-4': semantics.space[16],
    '--lib-space-6': semantics.space[24],
    '--lib-font': semantics.font.family.body,
  },
})

globalStyle('*', { boxSizing: 'border-box' })
globalStyle('html', { background: 'var(--lib-surface)' })
globalStyle('body', {
  margin: 0,
  background: 'var(--lib-surface)',
  color: 'var(--lib-text)',
  fontFamily: 'var(--lib-font)',
})
globalStyle(':focus-visible', {
  outline: '2px solid var(--lib-brand)',
  outlineOffset: '3px',
})

/* Sidebar nav: brand IH blue focus ring */
globalStyle('aside a:focus-visible, aside button:focus-visible', {
  outline: '2px solid var(--lib-brand)',
  outlineOffset: '2px',
})
globalStyle('input:focus-visible, textarea:focus-visible, [role="searchbox"]:focus-visible', {
  outline: 'none',
  outlineOffset: '0',
})
globalStyle('button, input', {
  fontFamily: 'inherit',
})

/* Sidebar nav labels: beat preflight `button { font: inherit }` (body 16px). */
globalStyle('aside nav button', {
  fontSize: '14px',
})
