#!/usr/bin/env bash
# Refresh the committed @nova/ui source snapshot in vendor/nova-ui/.
#
# @nova/ui has no standalone JS/CSS library build — consumers compile its
# TypeScript + Vanilla Extract source. This script snapshots that source
# (optionally after Nx typecheck) so Vercel can build without nova-care-app.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/vendor/nova-ui"
DEFAULT_SOURCE="$(cd "$ROOT/.." && pwd)/nova-care-app/libs/ui"
SOURCE="${NOVA_UI_SRC:-$DEFAULT_SOURCE}"

if [[ ! -d "$SOURCE/src" ]]; then
  echo "error: @nova/ui source not found at:" >&2
  echo "  $SOURCE/src" >&2
  echo "Set NOVA_UI_SRC to libs/ui (the package root that contains src/)." >&2
  exit 1
fi

if [[ ! -f "$SOURCE/package.json" ]]; then
  echo "error: missing package.json at $SOURCE" >&2
  exit 1
fi

echo "Source: $SOURCE"
echo "Dest:   $DEST"

# Closest thing to a "build" for @nova/ui today: declaration emit via Nx.
NOVA_ROOT="$(cd "$SOURCE/../.." && pwd)"
if [[ -f "$NOVA_ROOT/package.json" ]] && command -v pnpm >/dev/null 2>&1; then
  if grep -q '"@nova/ui"' "$NOVA_ROOT/package.json" 2>/dev/null || [[ -f "$NOVA_ROOT/pnpm-workspace.yaml" ]]; then
    echo "Running nx typecheck @nova/ui (declaration emit)…"
    (cd "$NOVA_ROOT" && pnpm exec nx typecheck @nova/ui) || {
      echo "warning: typecheck failed; continuing with source snapshot" >&2
    }
  fi
else
  echo "Skipping typecheck (pnpm / nova-care-app workspace not available)."
fi

rm -rf "$DEST"
mkdir -p "$DEST/src"

# Runtime surface only — exclude Storybook/tests/docs from the snapshot.
rsync -a \
  --delete \
  --exclude '*.stories.ts' \
  --exclude '*.stories.tsx' \
  --exclude '*.spec.ts' \
  --exclude '*.spec.tsx' \
  --exclude '*.md' \
  --exclude '.DS_Store' \
  "$SOURCE/src/" "$DEST/src/"

# Minimal package manifest so resolution matches @nova/ui exports.
python3 - <<'PY' "$SOURCE/package.json" "$DEST/package.json"
import json, sys
src, dest = sys.argv[1], sys.argv[2]
pkg = json.load(open(src))
out = {
    "name": "@nova/ui",
    "version": pkg.get("version", "0.0.0"),
    "private": True,
    "type": "module",
    "description": "Vendored source snapshot of @nova/ui for soma-ui-library. Refresh with npm run refresh-nova-ui.",
    "main": "./src/index.ts",
    "types": "./src/index.ts",
    "exports": {
        ".": {
            "types": "./src/index.ts",
            "import": "./src/index.ts",
            "default": "./src/index.ts",
        },
        "./react-hook-form": {
            "types": "./src/integrations/react-hook-form/index.ts",
            "import": "./src/integrations/react-hook-form/index.ts",
            "default": "./src/integrations/react-hook-form/index.ts",
        },
        "./styles.css": {
            "types": "./src/styles/styles.ts",
            "import": "./src/styles/styles.ts",
            "default": "./src/styles/styles.ts",
        },
        "./package.json": "./package.json",
    },
    "dependencies": pkg.get("dependencies", {}),
    "peerDependencies": pkg.get("peerDependencies", {}),
    "peerDependenciesMeta": pkg.get("peerDependenciesMeta", {}),
}
json.dump(out, open(dest, "w"), indent=2)
open(dest, "a").write("\n")
PY

# Provenance for humans / CI drift checks.
python3 - <<'PY' "$SOURCE" "$DEST" "$NOVA_ROOT"
import json, subprocess, sys, datetime
from pathlib import Path

source, dest, nova_root = map(Path, sys.argv[1:4])
meta = {
    "generatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "sourcePath": str(source.resolve()),
    "note": "@nova/ui has no JS/CSS library build; this is a source snapshot compiled by soma-ui-library's Vite + vanilla-extract plugin.",
}

def git(cwd, *args):
    try:
        return subprocess.check_output(["git", *args], cwd=cwd, text=True).strip()
    except Exception:
        return None

meta["sourceCommit"] = git(nova_root, "rev-parse", "HEAD")
meta["sourceBranch"] = git(nova_root, "branch", "--show-current")
meta["sourceDescribe"] = git(nova_root, "describe", "--tags", "--always", "--dirty")

(dest / "VENDOR_META.json").write_text(json.dumps(meta, indent=2) + "\n")
print(json.dumps(meta, indent=2))
PY

file_count="$(find "$DEST/src" -type f | wc -l | tr -d ' ')"
echo "Vendored $file_count files into vendor/nova-ui/src"
echo "Done. Commit vendor/nova-ui/ — Vercel has no access to nova-care-app."
