import fs from 'node:fs'
import path from 'node:path'
import type { Connect, Plugin } from 'vite'

type Mount = {
  urlPrefix: string
  dirName: string
  contentType?: (filePath: string) => string
}

function mimeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.svg') return 'image/svg+xml; charset=utf-8'
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  return 'application/octet-stream'
}

function createMountMiddleware(
  projectRoot: string,
  mount: Mount,
): Connect.NextHandleFunction {
  const root = path.join(projectRoot, 'public', mount.dirName)
  const prefix = mount.urlPrefix.endsWith('/')
    ? mount.urlPrefix
    : `${mount.urlPrefix}/`

  return (req, res, next) => {
    const raw = (req.url ?? '').split('?')[0] ?? ''
    if (!raw.startsWith(prefix)) {
      next()
      return
    }

    const relative = decodeURIComponent(raw.slice(prefix.length))
    if (!relative || relative.includes('..')) {
      res.statusCode = 400
      res.end('Bad path')
      return
    }

    const filePath = path.join(root, relative)
    if (
      !filePath.startsWith(root) ||
      !fs.existsSync(filePath) ||
      !fs.statSync(filePath).isFile()
    ) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end('Asset not found')
      return
    }

    res.statusCode = 200
    res.setHeader(
      'Content-Type',
      mount.contentType?.(filePath) ?? mimeFor(filePath),
    )
    res.setHeader('Cache-Control', 'public, max-age=3600')
    fs.createReadStream(filePath).pipe(res)
  }
}

/**
 * Serve newly added public asset trees that Vite's SPA fallback would
 * otherwise swallow as index.html during local dev.
 */
export function iconAssetsPlugin(projectRoot: string): Plugin {
  const mounts: Mount[] = [
    { urlPrefix: '/icon-assets/', dirName: 'icon-assets' },
    { urlPrefix: '/avatar-assets/', dirName: 'avatar-assets' },
  ]

  return {
    name: 'soma-static-asset-mounts',
    configureServer(server) {
      for (const mount of mounts) {
        server.middlewares.use(createMountMiddleware(projectRoot, mount))
      }
    },
    configurePreviewServer(server) {
      for (const mount of mounts) {
        server.middlewares.use(createMountMiddleware(projectRoot, mount))
      }
    },
  }
}
