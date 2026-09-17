import { createElement, type ReactElement } from 'react'

export const ASSIGNEES = [
  { label: 'Alex Rivera', value: 'alex' },
  { label: 'Jordan Lee', value: 'jordan' },
  { label: 'Sam Patel', value: 'sam' },
  { label: 'Priya Raman', value: 'priya' },
  { label: 'Chen Wuj', value: 'chen' },
] as const

// Carries descenders on purpose — the p, g, y and j are what the trim/clip split
// exists to keep intact.
export const LONG_LABEL =
  'Alexandra Rivera-Montgomery, Paediatric Surgery Coordinator (Anglesey)'

// Every story sizes its own wrapper. Select takes its width from the parent — the
// 280px in the masters is the sticker sheet's canvas, not a specified width.
export function Frame({ children }: { children: ReactElement }): ReactElement {
  return createElement('div', { style: { inlineSize: '280px' } }, children)
}
