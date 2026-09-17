import { ArrowTopRightIcon } from '../icons/ArrowTopRightIcon'
import { figmaNodeUrl } from '../../lib/nav'
import {
  githubSourceUrl,
  storybookSourceUrl,
} from '../../lib/componentLinks'
import type { RegistryComponent } from '../../lib/registry'

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

function StorybookMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M7.28 0A2.28 2.28 0 0 0 5 2.28v19.44A2.28 2.28 0 0 0 7.28 24h9.94A2.28 2.28 0 0 0 19.5 21.72V.72A.72.72 0 0 0 18.78 0H7.28Zm5.58 15.6c2.32 0 3.72-1.22 3.72-3.06 0-1.56-.9-2.48-3.04-2.96l-1.28-.3c-1.36-.3-1.84-.66-1.84-1.32 0-.74.8-1.24 2-1.24 1.44 0 2.14.52 2.26 1.44l1.1-.18c-.12-1.44-1.46-2.4-3.4-2.4-2 0-3.36 1.1-3.36 2.8 0 1.58 1 2.46 2.9 2.9l1.34.3c1.42.32 1.9.72 1.9 1.4 0 .78-.78 1.26-2.02 1.26-1.64 0-2.36-.58-2.36-1.48 0-.14.02-.3.06-.42l-1.02-.2c-.06.18-.1.38-.1.58 0 1.64 1.4 2.68 3.54 2.68Z"
      />
    </svg>
  )
}

function FigmaMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M8.5 2A3.5 3.5 0 0 0 5 5.5 3.5 3.5 0 0 0 8.5 9H12V2H8.5Zm0 7A3.5 3.5 0 0 0 5 12.5 3.5 3.5 0 0 0 8.5 16H12V9H8.5Zm0 7A3.5 3.5 0 1 0 12 19.5V16H8.5ZM12 2v7h3.5a3.5 3.5 0 1 0 0-7H12Zm0 7.5a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 12 9.5Z" />
    </svg>
  )
}

const linkClass =
  'inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink no-underline transition-colors hover:bg-surface-subtle'

export function ExternalResourceLinks({
  component,
}: {
  component: RegistryComponent
}) {
  const links = [
    {
      id: 'github',
      label: 'GitHub',
      href: githubSourceUrl(component),
      icon: <GitHubMark className="size-3 shrink-0 text-muted" />,
    },
    {
      id: 'storybook',
      label: 'Storybook',
      href: storybookSourceUrl(component),
      icon: <StorybookMark className="size-3 shrink-0 text-muted" />,
    },
    {
      id: 'figma',
      label: 'Figma',
      href: figmaNodeUrl(component.nodeId),
      icon: <FigmaMark className="size-3 shrink-0 text-muted" />,
    },
  ] as const

  return (
    <div className="flex flex-wrap gap-1.5">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          {link.icon}
          {link.label}
          <ArrowTopRightIcon className="size-3 shrink-0 text-muted" />
        </a>
      ))}
    </div>
  )
}
