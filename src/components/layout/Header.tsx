import { Logomark } from '@nova/ui'
import { Link } from 'react-router-dom'
import { ArrowTopRightIcon } from '../icons/ArrowTopRightIcon'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-line/80 bg-surface/90 px-5 backdrop-blur-md">
      <Link
        to="/ui-library"
        className="group flex items-center gap-3 text-ink no-underline"
      >
        <Logomark
          label="Soma"
          className="h-6 w-auto text-brand transition-transform duration-200 group-hover:scale-[1.04]"
        />
        <span className="flex flex-col leading-none sm:flex-row sm:items-baseline sm:gap-2">
          <span className="text-[20px] font-medium tracking-[-0.02em]">
            Soma
          </span>
          <span className="mt-0.5 text-[16px] font-normal text-muted sm:mt-0">
            UI library
          </span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <a
          href="https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System"
          target="_blank"
          rel="noreferrer"
          className="hidden h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium text-ink no-underline transition-colors duration-200 hover:bg-surface-subtle sm:inline-flex"
        >
          Figma
          <ArrowTopRightIcon />
        </a>
        <ThemeToggle />
      </div>
    </header>
  )
}
