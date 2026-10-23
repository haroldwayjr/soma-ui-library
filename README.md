# Soma UI Library

Internal component browser for the Soma registry and local Nova UI implementation.

## Foundations (docs)

| Doc | Description |
|---|---|
| [Motion (duration + easing)](./docs/motion.md) | Docs v1 — semantic motion tokens and recipes for Accordion, Progress, Switch |

## Run locally

```bash
npm install
npm run dev
```

## Vendored `@nova/ui` (`vendor/nova-ui/`)

This app compiles a **committed source snapshot** of `@nova/ui` from
`vendor/nova-ui/`. That package has no standalone JS/CSS library build today —
consumers (including this app) compile its TypeScript + Vanilla Extract via Vite.

**`vendor/nova-ui/` must be committed** (not gitignored). Vercel has no access to
`nova-care-app`, so the snapshot is the deployable dependency.

Refresh the snapshot when `@nova/ui` changes (requires a local `nova-care-app`
checkout beside this repo, or `NOVA_UI_SRC` pointing at `libs/ui`):

```bash
npm run refresh-nova-ui
# equivalent: bash scripts/refresh-nova-ui.sh
```

Optional: `NOVA_UI_SRC=/path/to/nova-care-app/libs/ui npm run refresh-nova-ui`

Then commit the updated `vendor/nova-ui/` tree (includes `VENDOR_META.json` with
source commit provenance).

## Agent-facing endpoints

Vite serves these from `public/` (and they ship in `dist/` on build):

| Path | Source |
|------|--------|
| `/registry.json` | Full component registry |
| `/llms.txt` | One-line agent index |
| `/icons.json` | Icon catalog (400) |
| `/api/component/<slug>.json` | Per-component manifest |

Unknown `/api/component/<slug>.json` paths return **404** with
`Content-Type: application/json` (never the SPA shell). The same guard runs in
Vite dev/preview via `vite.agent-static-guard.ts`, and on Vercel via
`vercel.json` (filesystem first) + `api/agent-not-found.ts`.

Only non-agent app paths fall through to `index.html` (HashRouter:
`#/ui-library/...`).

Regenerate per-component JSON after registry changes:

```bash
npm run generate:api
```
