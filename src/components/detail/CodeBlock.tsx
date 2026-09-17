import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

export function CodeBlock({ code }: { code: string }) {
  const [html, setHtml] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let current = true
    void codeToHtml(code, { lang: 'tsx', theme: 'github-dark' }).then((value) => {
      if (current) setHtml(value)
    })
    return () => {
      current = false
    }
  }, [code])

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative overflow-hidden rounded-lg bg-[#0d1117] text-sm">
      <button
        type="button"
        onClick={() => void copy()}
        className="absolute right-2 top-2 z-10 inline-flex size-8 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/5 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={copied ? 'Copied' : 'Copy code'}
      >
        <span className="relative size-4" aria-hidden="true">
          <svg
            viewBox="0 0 16 16"
            className={`absolute inset-0 size-4 transition-opacity duration-150 ease-out ${copied ? 'opacity-0' : 'opacity-100'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path d="M3.5 10.5V3.5A1 1 0 0 1 4.5 2.5h7" />
          </svg>
          <svg
            viewBox="0 0 16 16"
            className={`absolute inset-0 size-4 transition-opacity duration-150 ease-out ${copied ? 'opacity-100' : 'opacity-0'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
          </svg>
        </span>
      </button>
      {html ? (
        <div
          className="[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent! [&_pre]:p-5 [&_pre]:pr-14 [&_pre]:leading-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="m-0 overflow-x-auto p-5 pr-14 text-slate-200"><code>{code}</code></pre>
      )}
    </div>
  )
}
