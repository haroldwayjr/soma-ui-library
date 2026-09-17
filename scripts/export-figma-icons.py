#!/usr/bin/env python3
"""Export Soma icon SVGs from Figma (Images API).

Requires a Figma personal access token with read access to the Soma file:

  export FIGMA_TOKEN=figd_...
  python3 scripts/export-figma-icons.py

By default exports:
  - Style=outline at Size=md  → public/icon-assets/icon/.../name-outline.svg
  - Style=bold at Size=xs     → public/icon-assets/icon/.../name-bold.svg
    (bold only exists at xs/sm in the current Figma matrix)

Options:
  --styles outline,bold
  --limit N
  --jobs scripts/icon-export-jobs.json
  --dry-run
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILE_KEY = "hB1NzwMnZt2ALeR0OslaWi"
BATCH = 80


def load_jobs(path: Path, styles: set[str], limit: int | None) -> list[dict]:
    jobs = json.loads(path.read_text())
    jobs = [job for job in jobs if job["style"] in styles]
    if limit is not None:
        jobs = jobs[:limit]
    return jobs


def figma_images(token: str, node_ids: list[str]) -> dict[str, str | None]:
    params = urllib.parse.urlencode(
        {
            "ids": ",".join(node_ids),
            "format": "svg",
            "svg_include_id": "true",
        }
    )
    url = f"https://api.figma.com/v1/images/{FILE_KEY}?{params}"
    request = urllib.request.Request(
        url,
        headers={"X-Figma-Token": token},
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        payload = json.loads(response.read().decode("utf-8"))
    if payload.get("err"):
        raise RuntimeError(payload["err"])
    return payload.get("images") or {}


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=120) as response:
        data = response.read()
    # Prefer currentColor so gallery inherits theme ink
    text = data.decode("utf-8", errors="ignore")
    text = (
        text.replace('stroke="#101828"', 'stroke="currentColor"')
        .replace("stroke='#101828'", "stroke='currentColor'")
        .replace('fill="#101828"', 'fill="currentColor"')
        .replace("fill='#101828'", "fill='currentColor'")
    )
    dest.write_text(text, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--jobs",
        type=Path,
        default=ROOT / "scripts" / "icon-export-jobs.json",
    )
    parser.add_argument("--styles", default="outline,bold")
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--skip-existing", action="store_true", default=True)
    args = parser.parse_args()

    token = os.environ.get("FIGMA_TOKEN") or os.environ.get("FIGMA_ACCESS_TOKEN")
    if not token and not args.dry_run:
        print(
            "Set FIGMA_TOKEN to a Figma personal access token, then re-run.",
            file=sys.stderr,
        )
        return 1

    styles = {part.strip() for part in args.styles.split(",") if part.strip()}
    jobs = load_jobs(args.jobs, styles, args.limit)
    if args.skip_existing:
        jobs = [job for job in jobs if not (ROOT / job["path"]).exists()]

    print(f"Exporting {len(jobs)} icons ({', '.join(sorted(styles))})")
    if args.dry_run:
        for job in jobs[:10]:
            print(f"  {job['path']} ← {job['nodeId']}")
        if len(jobs) > 10:
            print(f"  … +{len(jobs) - 10} more")
        return 0

    exported = 0
    failed = 0
    for start in range(0, len(jobs), BATCH):
        chunk = jobs[start : start + BATCH]
        node_ids = [job["nodeId"] for job in chunk]
        try:
            images = figma_images(token, node_ids)
        except urllib.error.HTTPError as error:
            print(f"Batch failed HTTP {error.code}: {error.read()[:200]!r}", file=sys.stderr)
            failed += len(chunk)
            time.sleep(2)
            continue

        by_id = {job["nodeId"]: job for job in chunk}
        for node_id, url in images.items():
            job = by_id.get(node_id) or by_id.get(node_id.replace("-", ":"))
            if not job:
                # Figma sometimes returns ids with "-"
                for candidate in chunk:
                    if candidate["nodeId"].replace(":", "-") == node_id.replace(
                        ":", "-"
                    ):
                        job = candidate
                        break
            if not job or not url:
                failed += 1
                continue
            try:
                download(url, ROOT / job["path"])
                exported += 1
            except Exception as exc:  # noqa: BLE001
                print(f"Download failed {job['path']}: {exc}", file=sys.stderr)
                failed += 1
        print(f"  progress {min(start + BATCH, len(jobs))}/{len(jobs)}")
        time.sleep(0.4)

    print(f"Done. exported={exported} failed={failed}")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
