#!/usr/bin/env python3
"""
Generate figma-registry.json and icons.json from Figma published-component dumps
and COMPONENT-STATUS.md.

Reads:
  - FIGMA_DUMP (default: agent-tools published components JSON array)
  - FIGMA_METADATA_GLOB (default: agent-tools/*.txt XML page metadata dumps)
  - COMPONENT_STATUS (default: nova-care-app COMPONENT-STATUS.md)

Writes:
  - figma-registry.json (non-icon components only)
  - icons.json (icon/* COMPONENT_SETs)
  - figma-registry.summary.json

Usage:
  python scripts/generate-figma-registry.py
  FIGMA_DUMP=/path/to/dump.txt python scripts/generate-figma-registry.py
"""

from __future__ import annotations

import glob
import itertools
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_FIGMA_DUMP = (
    Path.home()
    / ".cursor/projects/Users-harold-wayjr-Documents-GitHub-soma-ui-library/agent-tools/88a11c17-e564-49c8-b312-19b9b3e0c8a1.txt"
)
DEFAULT_METADATA_GLOB = (
    Path.home()
    / ".cursor/projects/Users-harold-wayjr-Documents-GitHub-soma-ui-library/agent-tools/*.txt"
)
DEFAULT_COMPONENT_STATUS = (
    Path.home()
    / "Documents/GitHub/nova-care-app/libs/ui/docs/COMPONENT-STATUS.md"
)

DELETED_COMPONENT_NAMES = {
    "_deleted · Tooltip Callout (do not use)",
}

# Inline Switch page metadata (no XML dump available for Switches page).
KNOWN_VARIANT_MATRIX: dict[str, list[tuple[str, dict[str, str]]]] = {
    "476:627": [
        ("476:575", {"Checked": "False", "State": "Rest"}),
        ("476:581", {"Checked": "False", "State": "Hover"}),
        ("476:587", {"Checked": "False", "State": "Focus visible"}),
        ("476:595", {"Checked": "False", "State": "Disabled"}),
        ("476:601", {"Checked": "True", "State": "Rest"}),
        ("476:607", {"Checked": "True", "State": "Hover"}),
        ("476:613", {"Checked": "True", "State": "Focus visible"}),
        ("476:621", {"Checked": "True", "State": "Disabled"}),
    ],
    "476:733": [
        ("476:629", {"Content": "Label", "Checked": "False", "State": "Rest"}),
        ("476:641", {"Content": "Label", "Checked": "False", "State": "Disabled"}),
        ("476:653", {"Content": "Label", "Checked": "True", "State": "Rest"}),
        ("476:665", {"Content": "Label", "Checked": "True", "State": "Disabled"}),
        ("476:677", {"Content": "Label + caption", "Checked": "False", "State": "Rest"}),
        ("476:691", {"Content": "Label + caption", "Checked": "False", "State": "Disabled"}),
        ("476:705", {"Content": "Label + caption", "Checked": "True", "State": "Rest"}),
        ("476:719", {"Content": "Label + caption", "Checked": "True", "State": "Disabled"}),
    ],
}

# Figma component name → code component name for status lookup.
# Only used when the mapped code name exists in COMPONENT-STATUS.md.
FIGMA_TO_CODE: list[tuple[str, str]] = [
    (r"^Switch / Field$", "Switch"),
    (r"^Switch$", "Switch"),
    (r"^Checkbox /", "Checkbox"),
    (r"^Progress Bar$", "Progress"),
    (r"^Menu /", "Menu"),
    (r"^Text Input$", "TextField"),
    (r"^Textarea$", "Textarea"),
    (r"^Password Input$", "TextField"),
    (r"^Search Input$", "SearchField"),
    (r"^Select / Trigger", "Select"),
    (r"^Select / Field$", "SelectField"),
    (r"^Select /", "Select"),
    (r"^Badge / Count$", "Badge"),
    (r"^Badge$", "Badge"),
    (r"^Chip / Dismiss$", "Chip"),
    (r"^Chip$", "Chip"),
    (r"^Choice chip", "Chip"),
    (r"^Card / Notice$", "Card"),
    (r"^Card$", "Card"),
    (r"^Avatar / Presence dot$", "Avatar"),
    (r"^Avatar", "Avatar"),
    (r"^Link$", "Link"),
    (r"^Pagination$", "Pagination"),
    (r"^Tooltip$", "Tooltip"),
    (r"^Field$", "Field"),
    (r"^Radio /", "Radio"),
    (r"^Button$", "Button"),
    (r"^Checkbox$", "Checkbox"),
    (r"^Dialog$", "Dialog"),
    (r"^Alert$", "Banner"),
    (r"^Spinner$", "Spinner"),
    (r"^Slider$", "NumberField"),
    (r"^Tab ·", "Tabs"),
    (r"^Tab$", "Tabs"),
    (r"^Tabs\.List$", "Tabs"),
    (r"^Table /", "Table"),
    (r"^Breadcrumb", "Breadcrumbs"),
    (r"^Logo /", "Logomark"),
    (r"^Typography$", "Typography"),
    (r"^Stack$", "Stack"),
    (r"^Popover /", "Popover"),
    (r"^Close$", "Popover"),
    (r"^Input /", "TextField"),
    (r"^Stepper /", "Stepper"),
    (r"^Illustration /", "Illustration"),
]


def is_icon_component(name: str) -> bool:
    return name.startswith("icon/")


def trim_page_name(raw: str) -> str:
    return raw.strip().lstrip("↳").strip()


def parse_variant_name(name: str) -> dict[str, str]:
    combo: dict[str, str] = {}
    for part in name.split(","):
        part = part.strip()
        if "=" in part:
            key, val = part.split("=", 1)
            combo[key.strip()] = val.strip()
    return combo


def load_figma_dump(path: Path) -> list[dict[str, Any]]:
    text = path.read_text(encoding="utf-8")
    try:
        return json.loads(text)
    except json.JSONDecodeError as exc:
        # Attempt repair for truncated JSON arrays.
        print(f"Warning: JSON parse failed ({exc}); attempting repair", file=sys.stderr)
        start = text.find("[")
        if start == -1:
            raise
        trimmed = text[start:]
        # Close open objects/arrays heuristically.
        if not trimmed.rstrip().endswith("]"):
            last_obj = trimmed.rfind("}")
            if last_obj != -1:
                trimmed = trimmed[: last_obj + 1] + "\n]"
        return json.loads(trimmed)


def parse_component_status(path: Path) -> dict[str, dict[str, str | None]]:
    """Parse Components table rows from COMPONENT-STATUS.md."""
    text = path.read_text(encoding="utf-8")
    rows: dict[str, dict[str, str | None]] = {}
    in_components = False
    for line in text.splitlines():
        if line.startswith("## Components"):
            in_components = True
            continue
        if in_components and line.startswith("## "):
            break
        if not in_components or not line.startswith("|"):
            continue
        if "Component" in line and "Status" in line:
            continue
        if re.match(r"^\|\s*-+\s*\|", line):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 6:
            continue
        raw_name, spec_ac, tokens, a11y, storybook, status = cells[:6]
        name = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", raw_name).strip()
        if not name or name == "Component":
            continue
        rows[name] = {
            "specAc": spec_ac,
            "tokens": tokens,
            "a11y": a11y,
            "storybook": storybook,
            "buildStatus": status,
        }
    return rows


def match_code_name(figma_name: str) -> str | None:
    """Map a Figma component name to a code component name via explicit patterns."""
    for pattern, code_name in FIGMA_TO_CODE:
        if re.search(pattern, figma_name):
            return code_name
    return None


def lookup_status(
    figma_name: str, status_rows: dict[str, dict[str, str | None]]
) -> tuple[str | None, str | None, dict[str, str | None] | None]:
    """Return buildStatus and matchedCodeName only when a status-table row clearly matches."""
    code_name = match_code_name(figma_name)
    if code_name and code_name in status_rows:
        row = status_rows[code_name]
        return row.get("buildStatus"), code_name, row
    return None, None, None


def _parse_xml_root(content: str) -> ET.Element | None:
    """Parse Figma page metadata that may contain multiple <canvas> roots."""
    try:
        return ET.fromstring(content)
    except ET.ParseError:
        pass
    wrapped = f"<root>{content}</root>"
    try:
        return ET.fromstring(wrapped)
    except ET.ParseError as exc:
        print(f"Warning: XML parse failed: {exc}", file=sys.stderr)
        return None


def _symbols_from_frame(frame: ET.Element) -> list[tuple[str, dict[str, str]]]:
    symbols: list[tuple[str, dict[str, str]]] = []
    for child in frame:
        if child.tag == "symbol":
            sym_id = child.get("id")
            sym_name = child.get("name", "")
            if sym_id and sym_name:
                symbols.append((sym_id, parse_variant_name(sym_name)))
    return symbols


def parse_metadata_xml_files(glob_pattern: str, exclude: set[str]) -> dict[str, Any]:
    """Map component-set nodeId → [(symbolNodeId, variantCombo), ...]."""
    by_node_id: dict[str, list[tuple[str, dict[str, str]]]] = {}
    by_frame_name: dict[str, list[tuple[str, dict[str, str]]]] = {}

    for filepath in glob.glob(glob_pattern):
        if filepath in exclude:
            continue
        content = Path(filepath).read_text(encoding="utf-8", errors="replace")
        if not content.lstrip().startswith("<"):
            continue
        root = _parse_xml_root(content)
        if root is None:
            continue

        for frame in root.iter("frame"):
            frame_id = frame.get("id")
            frame_name = frame.get("name")
            symbols = _symbols_from_frame(frame)
            if not symbols:
                continue
            # Prefer frames whose id matches a published component-set nodeId.
            if frame_id:
                by_node_id[frame_id] = symbols
            if frame_name:
                by_frame_name[frame_name] = symbols

    by_node_id["__names__"] = by_frame_name  # type: ignore[assignment]
    return by_node_id


def extract_props(properties: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    variant_props: list[dict[str, Any]] = []
    non_variant_props: list[dict[str, Any]] = []
    for prop in properties.values():
        entry = {
            "name": prop.get("name"),
            "type": prop.get("type"),
            "defaultValue": prop.get("defaultValue"),
        }
        if prop.get("type") == "VARIANT":
            entry["values"] = prop.get("variantOptions", [])
            variant_props.append(entry)
        else:
            if "key" in prop:
                entry["key"] = prop["key"]
            non_variant_props.append(entry)
    return variant_props, non_variant_props


def cartesian_variant_combos(variant_props: list[dict[str, Any]]) -> list[dict[str, str]]:
    if not variant_props:
        return []
    keys = [p["name"] for p in variant_props]
    value_lists = [p["values"] for p in variant_props]
    return [dict(zip(keys, combo)) for combo in itertools.product(*value_lists)]


def build_variant_matrix(
    node_id: str,
    figma_name: str,
    variant_props: list[dict[str, Any]],
    metadata: dict[str, Any],
    *,
    abbreviated_on_miss: bool = False,
) -> list[dict[str, Any]] | None:
    # Priority 1: known inline overrides (Switch).
    if node_id in KNOWN_VARIANT_MATRIX:
        return [
            {"variantCombo": combo, "nodeId": sym_id}
            for sym_id, combo in KNOWN_VARIANT_MATRIX[node_id]
        ]

    # Priority 2: XML metadata by nodeId.
    symbols: list[tuple[str, dict[str, str]]] | None = metadata.get(node_id)
    if not symbols:
        names_index = metadata.get("__names__", {})
        symbols = names_index.get(figma_name)

    if symbols:
        matrix: list[dict[str, Any]] = []
        for sym_id, combo in symbols:
            entry: dict[str, Any] = {"variantCombo": combo, "nodeId": sym_id}
            matrix.append(entry)
        return matrix

    # Priority 3: cartesian product with unknown nodeIds.
    combos = cartesian_variant_combos(variant_props)
    if not combos:
        return None
    if abbreviated_on_miss:
        return [{"variantCombo": combo} for combo in combos]
    return [
        {"variantCombo": combo, "nodeId": None, "nodeIdStatus": "unknown"}
        for combo in combos
    ]


def build_icon_entry(
    comp: dict[str, Any],
    metadata: dict[str, Any],
) -> dict[str, Any]:
    figma_name = comp["name"]
    node_id = comp["nodeId"]
    properties = comp.get("properties") or {}
    variant_props, _non_variant_props = extract_props(properties)

    entry: dict[str, Any] = {
        "name": figma_name,
        "nodeId": node_id,
        "page": trim_page_name(comp.get("pageName", "")),
        "pageId": comp.get("pageId"),
        "category": "Icons",
        "props": variant_props,
    }

    if comp.get("type") == "COMPONENT_SET" and variant_props:
        matrix = build_variant_matrix(
            node_id, figma_name, variant_props, metadata, abbreviated_on_miss=True
        )
        if matrix:
            entry["variantMatrix"] = matrix
    elif comp.get("type") == "COMPONENT":
        entry["variantMatrix"] = [{"variantCombo": {}, "nodeId": node_id}]

    return entry


def build_entry(
    comp: dict[str, Any],
    status_rows: dict[str, dict[str, str | None]],
    metadata: dict[str, Any],
) -> dict[str, Any]:
    figma_name = comp["name"]
    node_id = comp["nodeId"]
    properties = comp.get("properties") or {}
    variant_props, non_variant_props = extract_props(properties)

    build_status, matched_code, status_row = lookup_status(figma_name, status_rows)

    entry: dict[str, Any] = {
        "figmaComponentName": figma_name,
        "page": trim_page_name(comp.get("pageName", "")),
        "pageId": comp.get("pageId"),
        "nodeId": node_id,
        "type": comp.get("type"),
        "buildStatus": build_status,
        "statusSource": "COMPONENT-STATUS.md#Components" if build_status else None,
        "matchedCodeName": matched_code,
        "props": variant_props,
        "variantMatrix": [],
        "nonVariantProps": non_variant_props,
    }

    if figma_name in DELETED_COMPONENT_NAMES:
        entry["deprecated"] = True
        entry["deleted"] = True

    if status_row:
        entry["readiness"] = {
            "specAc": status_row.get("specAc"),
            "tokens": status_row.get("tokens"),
            "a11y": status_row.get("a11y"),
            "storybook": status_row.get("storybook"),
        }

    if comp.get("type") == "COMPONENT_SET" and variant_props:
        entry["variantMatrix"] = build_variant_matrix(
            node_id, figma_name, variant_props, metadata
        )
    elif comp.get("type") == "COMPONENT":
        entry["variantMatrix"] = [{"variantCombo": {}, "nodeId": node_id}]

    return entry


def build_summary(
    component_entries: list[dict[str, Any]],
    icon_entries: list[dict[str, Any]],
) -> dict[str, Any]:
    by_page: dict[str, int] = {}
    by_build_status: dict[str, int] = {}

    for entry in component_entries:
        page = entry["page"]
        by_page[page] = by_page.get(page, 0) + 1
        status = entry.get("buildStatus") or "null"
        by_build_status[status] = by_build_status.get(status, 0) + 1

    icon_count = len(icon_entries)
    non_icon_count = len(component_entries)

    return {
        "totalComponents": non_icon_count + icon_count,
        "nonIconCount": non_icon_count,
        "iconCount": icon_count,
        "nonIconRegistry": "figma-registry.json",
        "iconRegistry": "icons.json",
        "byPage": dict(sorted(by_page.items(), key=lambda kv: kv[0].lower())),
        "byBuildStatus": dict(sorted(by_build_status.items())),
        "pagesListed": sorted(by_page.keys(), key=str.lower),
    }


def main() -> int:
    figma_dump = Path(os.environ.get("FIGMA_DUMP", str(DEFAULT_FIGMA_DUMP)))
    metadata_glob = os.environ.get("FIGMA_METADATA_GLOB", str(DEFAULT_METADATA_GLOB))
    component_status = Path(
        os.environ.get("COMPONENT_STATUS", str(DEFAULT_COMPONENT_STATUS))
    )
    out_registry = REPO_ROOT / "figma-registry.json"
    out_icons = REPO_ROOT / "icons.json"
    out_summary = REPO_ROOT / "figma-registry.summary.json"

    print(f"Loading Figma dump: {figma_dump}")
    components = load_figma_dump(figma_dump)
    print(f"  → {len(components)} published components")

    print(f"Loading status: {component_status}")
    status_rows = parse_component_status(component_status)
    print(f"  → {len(status_rows)} component status rows")

    exclude = {str(figma_dump)}
    print(f"Parsing metadata XML: {metadata_glob}")
    metadata = parse_metadata_xml_files(metadata_glob, exclude)
    names_index = metadata.pop("__names__", {})
    metadata["__names__"] = names_index
    meta_frame_count = len([k for k in metadata if not k.startswith("_")])
    print(f"  → {meta_frame_count} component-set frames with symbols")

    icon_comps = [c for c in components if is_icon_component(c["name"])]
    non_icon_comps = [c for c in components if not is_icon_component(c["name"])]

    icon_entries = sorted(
        [build_icon_entry(c, metadata) for c in icon_comps],
        key=lambda e: e["name"].lower(),
    )
    component_entries = sorted(
        [build_entry(c, status_rows, metadata) for c in non_icon_comps],
        key=lambda e: e["figmaComponentName"].lower(),
    )

    generated_at = __import__("datetime").datetime.now(
        __import__("datetime").timezone.utc
    ).isoformat()
    source = {
        "figmaDump": str(figma_dump),
        "componentStatus": str(component_status),
        "metadataGlob": metadata_glob,
    }

    registry = {
        "generatedAt": generated_at,
        "source": source,
        "components": component_entries,
    }
    icons_registry = {
        "generatedAt": generated_at,
        "source": source,
        "icons": icon_entries,
        "count": len(icon_entries),
    }

    out_registry.write_text(
        json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    out_icons.write_text(
        json.dumps(icons_registry, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    summary = build_summary(component_entries, icon_entries)
    out_summary.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")

    # Validate Switch entries.
    switch = next(
        (e for e in component_entries if e["figmaComponentName"] == "Switch"), None
    )
    switch_field = next(
        (e for e in component_entries if e["figmaComponentName"] == "Switch / Field"),
        None,
    )
    switch_ok = switch and len(switch["variantMatrix"]) == 8 and all(
        v["nodeId"] for v in switch["variantMatrix"]
    )
    switch_field_ok = switch_field and len(switch_field["variantMatrix"]) == 8 and all(
        v["nodeId"] for v in switch_field["variantMatrix"]
    )

    unknown_status = [
        e["figmaComponentName"]
        for e in component_entries
        if e.get("buildStatus") is None
    ]

    print()
    print("=== figma-registry.json + icons.json generated ===")
    print(f"Output: {out_registry}")
    print(f"Icons: {out_icons}")
    print(f"Summary: {out_summary}")
    print(f"Non-icon count: {summary['nonIconCount']}")
    print(f"Icon count: {summary['iconCount']}")
    print(f"  Pages (non-icon): {len(summary['pagesListed'])}")
    print(f"  By build status (non-icon): {summary['byBuildStatus']}")
    print()
    print(f"Components with buildStatus null ({len(unknown_status)}):")
    for name in unknown_status:
        print(f"  - {name}")
    print()
    print("Switch validation:")
    print(
        f"  Switch: {len(switch['variantMatrix']) if switch else 0} variants, "
        f"nodeIds resolved: {switch_ok}"
    )
    print(
        f"  Switch / Field: {len(switch_field['variantMatrix']) if switch_field else 0} variants, "
        f"nodeIds resolved: {switch_field_ok}"
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
