import { useState } from 'react'
import type { RegistryComponent } from '../../lib/registry'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'

const format = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.map(String).join(' | ')
  return String(value)
}

export function PropsTable({ component }: { component: RegistryComponent }) {
  const [open, setOpen] = useState(true)
  const props = component.props ?? []

  return (
    <section className="border-t border-line pt-8">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between bg-transparent py-1 text-left text-lg font-semibold text-ink"
      >
        Props
        <ChevronDownIcon
          className={`size-5 shrink-0 text-muted transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-150 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          {props.length === 0 ? (
            <p className="pt-4 text-sm text-muted">No props are recorded.</p>
          ) : (
            <div className="overflow-x-auto pt-4">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[11px] uppercase tracking-[0.12em] text-muted">
                    <th className="py-2 pr-4 font-semibold">Name</th>
                    <th className="py-2 pr-4 font-semibold">Figma values</th>
                    <th className="py-2 pr-4 font-semibold">Default</th>
                    <th className="py-2 pr-4 font-semibold">Notes</th>
                    <th className="py-2 font-semibold">Required</th>
                  </tr>
                </thead>
                <tbody>
                  {props.map((prop) => (
                    <tr key={prop.name} className="border-b border-line align-top">
                      <td className="py-3 pr-4 font-mono text-xs text-ink">
                        {prop.codeProp ?? prop.name}
                        {prop.implementationStatus && (
                          <span className="mt-1 block font-sans text-[10px] text-muted">{prop.implementationStatus}</span>
                        )}
                      </td>
                      <td className="max-w-52 py-3 pr-4 font-mono text-xs text-muted">{format(prop.figmaValues)}</td>
                      <td className="py-3 pr-4 text-muted">{format(prop.default)}</td>
                      <td className="py-3 pr-4 text-muted">{format(prop.notes)}</td>
                      <td className="py-3 text-muted">{prop.required ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
