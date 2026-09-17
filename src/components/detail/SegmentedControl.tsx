import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export interface SegmentedOption<T extends string> {
  value: T
  label: ReactNode
}

/**
 * Soft-track elevated segmented control — matches Soma View switcher
 * (Elevated / Soft track) until @nova/ui ships ViewSwitcher.
 * Selection thumb slides between options.
 */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  size = 'md',
  'aria-label': ariaLabel,
}: {
  value: T
  options: readonly SegmentedOption<T>[]
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  'aria-label': string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef(new Map<T, HTMLButtonElement>())
  // Stay false through the first measure/paint so the thumb doesn't animate in on load.
  const canAnimateRef = useRef(false)
  const [thumb, setThumb] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  })

  useLayoutEffect(() => {
    const track = trackRef.current
    const active = buttonRefs.current.get(value)
    if (!track || !active) return

    const update = () => {
      // offset* is relative to the padding box — matches absolute positioning
      // (getBoundingClientRect would include the track border and skew the inset).
      setThumb({
        left: active.offsetLeft,
        top: active.offsetTop,
        width: active.offsetWidth,
        height: active.offsetHeight,
        ready: true,
      })
    }

    update()

    if (!canAnimateRef.current) {
      requestAnimationFrame(() => {
        canAnimateRef.current = true
      })
    }

    const observer = new ResizeObserver(update)
    observer.observe(track)
    observer.observe(active)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [value, options])

  return (
    <div
      ref={trackRef}
      className="relative inline-flex h-10 w-fit max-w-full items-center rounded-full border border-line/80 bg-[#eef0f4] p-0.5 dark:border-line dark:bg-[color-mix(in_srgb,var(--lib-text)_12%,transparent)]"
      role="tablist"
      aria-label={ariaLabel}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06),0_1px_3px_rgba(16,24,40,0.1)] dark:bg-[color-mix(in_srgb,var(--lib-text)_22%,var(--lib-surface))] dark:shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
        style={{
          left: thumb.left,
          top: thumb.top,
          width: thumb.width,
          height: thumb.height,
          opacity: thumb.ready ? 1 : 0,
          transition: canAnimateRef.current
            ? 'left 220ms cubic-bezier(0.2, 0.8, 0.2, 1), top 220ms cubic-bezier(0.2, 0.8, 0.2, 1), width 220ms cubic-bezier(0.2, 0.8, 0.2, 1), height 220ms cubic-bezier(0.2, 0.8, 0.2, 1)'
            : 'none',
        }}
      />
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            ref={(node) => {
              if (node) buttonRefs.current.set(option.value, node)
              else buttonRefs.current.delete(option.value)
            }}
            onClick={() => onChange(option.value)}
            style={{
              fontSize: size === 'sm' ? 14 : 16,
              fontWeight: selected ? 600 : 400,
            }}
            className={`relative z-10 inline-flex h-full cursor-pointer items-center justify-center rounded-full border-0 bg-transparent px-3 leading-none transition-colors duration-200 ${
              selected
                ? 'text-ink'
                : 'text-muted hover:text-ink/80'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
