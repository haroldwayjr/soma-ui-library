export function TodoPanel({ children }: { children: string }) {
  return (
    <div className="flex gap-3 rounded-md border border-dashed border-line bg-surface-subtle p-4 text-sm text-muted">
      <span aria-hidden="true">◇</span>
      <span>{children}</span>
    </div>
  )
}
