/** Soma `navigation/arrow.top.right` outline glyph (currentColor). */
export function ArrowTopRightIcon({
  className = 'size-3.5 shrink-0',
  title,
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M3.66667 18.5625L18.2508 3.97833"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.50083 3.97833H18.2508V17.7283"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
