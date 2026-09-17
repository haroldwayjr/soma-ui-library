#!/usr/bin/env python3
"""Generate static per-component registry responses for Vite public serving."""

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "api" / "component"


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"(^-+|-+$)", "", re.sub(r"[^a-z0-9]+", "-", ascii_value))


def main() -> None:
    registry = json.loads((ROOT / "registry.json").read_text())
    OUTPUT.mkdir(parents=True, exist_ok=True)
    used: set[str] = set()

    for component in registry["components"]:
        base = slugify(component["name"]) or "component"
        slug = base
        if slug in used:
            slug = f"{base}-{str(component['nodeId']).replace(':', '-')}"
        used.add(slug)
        (OUTPUT / f"{slug}.json").write_text(
            json.dumps(component, indent=2, ensure_ascii=False) + "\n"
        )

    print(f"Generated {len(used)} component API files in {OUTPUT}")


if __name__ == "__main__":
    main()
