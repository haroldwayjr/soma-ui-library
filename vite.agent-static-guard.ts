import fs from 'node:fs'
import path from 'node:path'
import type { Connect, Plugin } from 'vite'

const AGENT_EXACT = new Set(['/registry.json', '/llms.txt', '/icons.json'])
const COMPONENT_API = /^\/api\/component\/([^/]+)\.json$/

function notFoundBody(pathname: string, slug: string | null): string {
  if (slug) {
    return JSON.stringify({
      error: 'Not found',
      slug,
      path: pathname,
      message: `No component manifest exists for slug "${slug}".`,
    })
  }

  return JSON.stringify({
    error: 'Not found',
    path: pathname,
    message: 'Agent asset not found.',
  })
}

function createGuard(rootDir: string): Connect.NextHandleFunction {
  return (req, res, next) => {
    const pathname = (req.url ?? '').split('?')[0] ?? ''
    const componentMatch = pathname.match(COMPONENT_API)
    const isExactAgent = AGENT_EXACT.has(pathname)

    if (!componentMatch && !isExactAgent) {
      next()
      return
    }

    const filePath = path.join(rootDir, pathname)
    if (fs.existsSync(filePath)) {
      next()
      return
    }

    const slug = componentMatch?.[1] ?? null
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.end(notFoundBody(pathname, slug))
  }
}

/**
 * Prevent Vite SPA fallback from returning index.html for agent static paths.
 * Missing /api/component/:slug.json (and missing registry/llms/icons) get JSON 404.
 */
export function agentStaticGuardPlugin(projectRoot: string): Plugin {
  return {
    name: 'agent-static-guard',
    configureServer(server) {
      server.middlewares.use(createGuard(path.join(projectRoot, 'public')))
    },
    configurePreviewServer(server) {
      server.middlewares.use(createGuard(path.join(projectRoot, 'dist')))
    },
  }
}
