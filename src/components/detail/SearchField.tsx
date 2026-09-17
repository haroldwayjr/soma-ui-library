import type { ChangeEvent } from 'react'

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14" />
    </svg>
  )
}

export function SearchField({
  id,
  value,
  onChange,
  placeholder = 'Search',
  label = 'Search',
  className = '',
  size = 'md',
  clearable = true,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  size?: 'sm' | 'md'
  clearable?: boolean
}) {
  const height = size === 'sm' ? 'h-10' : 'h-12'
  const inputId = id ?? 'search-field'

  return (
    <div className={`relative ${className}`}>
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted" />
      <input
        id={inputId}
        type="search"
        role="searchbox"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        autoComplete="off"
        className={`${height} w-full rounded-full border border-ink/20 bg-surface py-0 pl-10 ${
          clearable ? 'pr-10' : 'pr-4'
        } text-sm font-medium text-ink outline-none transition-[border-color,background-color] duration-200 placeholder:font-normal placeholder:text-muted focus:border-brand focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden`}
      />
      {clearable && value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 z-10 inline-flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted hover:bg-[color-mix(in_srgb,var(--lib-text)_8%,transparent)] hover:text-ink"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}
