export const config = {
  runtime: 'edge',
}

/**
 * JSON 404 for missing agent assets.
 * Existing files under public/ (copied to dist/) are served by the filesystem
 * route in vercel.json before this function is reached.
 */
export default function handler(request: Request): Response {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')
  const asset = url.searchParams.get('asset')

  const body =
    slug !== null && slug !== ''
      ? {
          error: 'Not found',
          slug,
          path: `/api/component/${slug}.json`,
          message: `No component manifest exists for slug "${slug}".`,
        }
      : {
          error: 'Not found',
          path: asset ? `/${asset}` : url.pathname,
          message: 'Agent asset not found.',
        }

  return new Response(JSON.stringify(body), {
    status: 404,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
