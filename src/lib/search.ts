import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'
import { components, type RegistryComponent } from './registry'

const fuse = new Fuse(components, {
  threshold: 0.32,
  ignoreLocation: true,
  keys: [
    { name: 'name', weight: 0.5 },
    { name: 'description', weight: 0.2 },
    { name: 'figmaComponentName', weight: 0.15 },
    { name: 'props.name', weight: 0.15 },
  ],
})

export function searchRegistry(query: string): RegistryComponent[] {
  const trimmed = query.trim()
  return trimmed ? fuse.search(trimmed).map(({ item }) => item) : components
}

export function useRegistrySearch(query: string, delay = 150) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), delay)
    return () => window.clearTimeout(timer)
  }, [delay, query])

  return useMemo(
    () => ({ query: debouncedQuery, results: searchRegistry(debouncedQuery) }),
    [debouncedQuery],
  )
}

export function highlightMatch(text: string, query: string) {
  const needle = query.trim()
  if (!needle) return text
  const index = text.toLocaleLowerCase().indexOf(needle.toLocaleLowerCase())
  if (index < 0) return text
  return {
    before: text.slice(0, index),
    match: text.slice(index, index + needle.length),
    after: text.slice(index + needle.length),
  }
}
