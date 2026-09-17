import { useState, type ReactNode } from 'react'
import { previewFrameDark } from '../../styles/preview-frame.css'
import { CodeBlock } from './CodeBlock'

export function PreviewFrame({
  title,
  children,
  code,
}: {
  title: string
  children: ReactNode
  code?: string
}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <button
          type="button"
          aria-label={
            theme === 'light' ? 'Switch preview to dark' : 'Switch preview to light'
          }
          onClick={() =>
            setTheme((current) => (current === 'light' ? 'dark' : 'light'))
          }
          className="grid size-8 cursor-pointer place-items-center rounded-lg border border-line bg-surface text-sm hover:bg-surface-subtle"
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
      </div>
      <div
        className={`overflow-hidden rounded-2xl border p-8 transition-colors duration-150 ${
          theme === 'dark'
            ? previewFrameDark
            : 'border-line bg-surface-subtle'
        }`}
      >
        {children}
      </div>
      {code ? <CodeBlock code={code} /> : null}
    </div>
  )
}
