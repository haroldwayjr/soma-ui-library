#!/usr/bin/env python3
"""
Generate code-api-inventory.json from nova-care-app libs/ui TypeScript components.

Scans (read-only):
  - libs/ui/src/components/*
  - libs/ui/src/patterns/*
  - libs/ui/src/integrations/**

Writes:
  - code-api-inventory.json (repo root)

Usage:
  python scripts/extract-code-api-inventory.py
  NOVA_UI_SRC=/path/to/libs/ui/src python scripts/extract-code-api-inventory.py
"""

from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_NOVA_UI_SRC = (
    Path.home() / "Documents/GitHub/nova-care-app/libs/ui/src"
)

COMPOUND_COMPONENTS: dict[str, dict[str, Any]] = {
    "card": {
        "subcomponents": ["Root", "Header", "HeaderTitle", "Body", "Footer"],
        "note": "Compound API: Card.Root, Card.Header, Card.HeaderTitle, Card.Body, Card.Footer",
    },
    "table": {
        "subcomponents": ["Root", "Head", "Body", "Row", "HeaderCell", "Cell"],
        "note": "Compound API: Table.Root, Table.Head, Table.Body, Table.Row, Table.HeaderCell, Table.Cell",
    },
    "field": {
        "subcomponents": ["Field", "useFieldControlProps"],
        "note": "Field wraps a single control; useFieldControlProps bridges Field context to controls like Select",
    },
    "select": {
        "subcomponents": ["Select", "SelectField"],
        "note": "Flat Select component; SelectField is a separate composed field wrapper in select-field/",
    },
    "app-header": {
        "subcomponents": ["Root", "Brand", "Tabs", "Tab", "Action", "ThemeToggle"],
        "note": "Compound API: AppHeader (root), AppHeader.Brand, AppHeader.Tabs, AppHeader.Tab, AppHeader.Action, AppHeader.ThemeToggle",
    },
    "pagination": {
        "subcomponents": ["Pagination", "PaginationArrow", "PaginationPageNumber", "PaginationEllipsis"],
        "note": "Flat Pagination nav; internal sub-parts (arrow, page number, ellipsis) are not exported separately",
    },
}

INTERNAL_NOT_BARREL = {"text-input"}

MULTI_COMPONENT_FOLDERS: dict[str, list[dict[str, str]]] = {
    "radio": [
        {
            "codeName": "RadioGroup",
            "sourceFile": "RadioGroup.tsx",
            "readmeSubsection": "RadioGroup",
        },
        {
            "codeName": "Radio",
            "sourceFile": "Radio.tsx",
            "readmeSubsection": "Radio",
        },
    ],
}

VARIANT_LIKE_EXACT = {
    "disabled",
    "checked",
    "readOnly",
    "readonly",
    "indeterminate",
    "open",
    "defaultChecked",
    "defaultOpen",
    "required",
    "indicateRequired",
    "selected",
    "pressed",
    "loading",
    "error",
    "invalid",
    "active",
    "expanded",
    "collapsed",
}

VARIANT_LIKE_PREFIXES = ("variant", "tone", "size", "leading", "color", "appearance", "shape")


def kebab_to_pascal(name: str) -> str:
    parts = name.split("-")
    out: list[str] = []
    for part in parts:
        if part == "rhf":
            out.append("RHF")
        elif part == "ui":
            out.append("UI")
        else:
            out.append(part[:1].upper() + part[1:] if part else "")
    return "".join(out)


def read_text(path: Path) -> str | None:
    if not path.is_file():
        return None
    return path.read_text(encoding="utf-8")


def parse_export_names(export_block: str) -> list[str]:
    names: list[str] = []
    for part in export_block.split(","):
        part = part.strip()
        if not part:
            continue
        part = re.sub(r"^type\s+", "", part)
        if " as " in part:
            part = part.split(" as ", 1)[1].strip()
        names.append(part)
    return names


def parse_module_exports(module_index: Path) -> list[str]:
    text = read_text(module_index)
    if not text:
        return []
    names: list[str] = []
    for match in re.finditer(
        r"export\s+(?:\{([^}]+)\}|(\w+))\s*(?:from\s+['\"][^'\"]+['\"])?",
        text,
        re.MULTILINE | re.DOTALL,
    ):
        if match.group(2):
            names.append(match.group(2))
            continue
        names.extend(parse_export_names(match.group(1)))
    return names


def parse_barrel_exports(index_path: Path, src_root: Path) -> list[str]:
    text = read_text(index_path)
    if not text:
        return []
    exports: list[str] = []
    for line in text.splitlines():
        line = line.strip()
        star = re.match(r"export \* from '(.+?)'", line)
        if star:
            rel = star.group(1).lstrip("./")
            module_dir = src_root / rel
            module_index = module_dir / "index.ts"
            if module_index.is_file():
                exports.extend(parse_module_exports(module_index))
            continue
    for match in re.finditer(
        r"export\s+(?:\{([^}]+)\}|(\w+))\s*(?:from\s+['\"][^'\"]+['\"])?",
        text,
        re.MULTILINE | re.DOTALL,
    ):
        if match.group(2):
            exports.append(match.group(2))
            continue
        exports.extend(parse_export_names(match.group(1)))
    return sorted(set(exports))


def extract_section(text: str, heading: str) -> str | None:
    pattern = rf"^## {re.escape(heading)}\s*$"
    match = re.search(pattern, text, re.MULTILINE)
    if not match:
        return None
    start = match.end()
    next_heading = re.search(r"^## ", text[start:], re.MULTILINE)
    end = start + next_heading.start() if next_heading else len(text)
    return text[start:end]


def parse_status_from_readme(text: str) -> str | None:
    status = extract_section(text, "Status")
    if not status:
        return None
    phase = re.search(r"\*\*Phase:\*\*\s*(.+?)(?:\n|$)", status)
    if phase:
        return phase.group(1).strip()
    return None


def clean_readme_prose(text: str) -> str:
    cleaned = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    cleaned = re.sub(r"\*\*", "", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def parse_description_from_readme(text: str) -> str | None:
    for heading in ("Purpose and scope", "Purpose"):
        section = extract_section(text, heading)
        if not section:
            continue
        paragraphs = [
            p.strip()
            for p in re.split(r"\n\s*\n", section.strip())
            if p.strip() and not p.strip().startswith("#")
        ]
        for para in paragraphs:
            cleaned = clean_readme_prose(para)
            if cleaned and not cleaned.startswith("-"):
                return cleaned
    # Some READMEs (Pagination) describe the component after Status bullets.
    status = extract_section(text, "Status")
    if status:
        paragraphs = [
            p.strip()
            for p in re.split(r"\n\s*\n", status.strip())
            if p.strip() and not p.strip().startswith("-")
        ]
        for para in paragraphs:
            cleaned = clean_readme_prose(para)
            if cleaned and len(cleaned) > 40 and not cleaned.startswith("**"):
                return cleaned
    return None


def split_markdown_table_row(line: str) -> list[str]:
    """Split a markdown table row on unescaped pipe characters."""
    cells: list[str] = []
    current: list[str] = []
    i = 0
    raw = line.strip()
    if raw.startswith("|"):
        raw = raw[1:]
    if raw.endswith("|"):
        raw = raw[:-1]
    while i < len(raw):
        ch = raw[i]
        if ch == "\\" and i + 1 < len(raw):
            current.append(raw[i : i + 2])
            i += 2
            continue
        if ch == "|":
            cells.append("".join(current).strip())
            current = []
            i += 1
            continue
        current.append(ch)
        i += 1
    cells.append("".join(current).strip())
    return cells


def parse_readme_api_table(text: str, subsection: str | None = None) -> list[dict[str, Any]]:
    section = extract_section(text, "API contract")
    if not section:
        return []
    if subsection:
        sub_match = re.search(rf"^### `{re.escape(subsection)}`\s*$", section, re.MULTILINE)
        if not sub_match:
            return []
        section = section[sub_match.end() :]
        next_sub = re.search(r"^### ", section, re.MULTILINE)
        if next_sub:
            section = section[: next_sub.start()]
    props: list[dict[str, Any]] = []
    in_table = False
    for line in section.splitlines():
        if not line.strip().startswith("|"):
            if in_table:
                break
            continue
        cells = split_markdown_table_row(line)
        if len(cells) < 4:
            continue
        if cells[0].startswith("---") or cells[0].lower() == "prop":
            in_table = True
            continue
        prop_cell = cells[0]
        prop_match = re.match(r"`([^`]+)`", prop_cell)
        if not prop_match:
            continue
        name = prop_match.group(1)
        prop_type = strip_ticks(cells[1].strip()) or cells[1].strip()
        prop_type = prop_type.replace("\\|", "|")
        default = strip_ticks(cells[2].strip()) or cells[2].strip()
        description = cells[3].strip()
        required = default in ("—", "-") or "**Required.**" in description or "Required." in description
        if default in ("—", "-", "undefined", "generated", "inherited", "omitted"):
            default_val = None
        else:
            default_val = default
        props.append(
            {
                "name": name,
                "type": prop_type,
                "required": required,
                "default": default_val,
                "description": description,
                "source": "readme",
            }
        )
    return props


def strip_ticks(value: str | None) -> str | None:
    if value is None:
        return None
    return value.strip().strip("`")


def find_props_files(folder: Path) -> list[Path]:
    files = sorted(folder.glob("*Props*.ts")) + sorted(folder.glob("*props*.ts"))
    return [f for f in files if f.is_file()]


def resolve_type_alias_block(content: str, alias_name: str, folder: Path) -> str | None:
    alias_match = re.search(
        rf"export\s+type\s+{re.escape(alias_name)}\s*=\s*(\w+)",
        content,
    )
    if not alias_match:
        return None
    target = alias_match.group(1)
    if re.search(rf"export\s+interface\s+{re.escape(target)}\b", content):
        block, _ = find_props_interface_block(content, target.replace("Props", ""))
        if block:
            return block
        iface = re.search(rf"export\s+interface\s+{re.escape(target)}\s*\{{", content)
        if iface:
            brace_start = content.find("{", iface.end() - 1)
            depth = 0
            for i in range(brace_start, len(content)):
                if content[i] == "{":
                    depth += 1
                elif content[i] == "}":
                    depth -= 1
                    if depth == 0:
                        return content[brace_start + 1 : i]
    for props_file in find_props_files(folder):
        props_content = read_text(props_file)
        if not props_content:
            continue
        if re.search(rf"export\s+interface\s+{re.escape(target)}\b", props_content):
            block, _ = find_props_interface_block(
                props_content, target.replace("Props", "")
            )
            if block:
                return block
            brace = re.search(rf"export\s+interface\s+{re.escape(target)}\s*\{{", props_content)
            if brace:
                brace_start = props_content.find("{", brace.end() - 1)
                depth = 0
                for i in range(brace_start, len(props_content)):
                    if props_content[i] == "{":
                        depth += 1
                    elif props_content[i] == "}":
                        depth -= 1
                        if depth == 0:
                            return props_content[brace_start + 1 : i]
    return None


def find_main_tsx(folder: Path, code_name: str) -> Path | None:
    root_candidate = folder / f"{code_name}Root.tsx"
    if root_candidate.is_file():
        return root_candidate
    candidates = [
        folder / f"{code_name}.tsx",
        folder / f"{code_name[0].lower()}{code_name[1:]}.tsx",
    ]
    # camelCase file names (AppHeaderRoot, TablePagination)
    for path in folder.glob("*.tsx"):
        if path.name.endswith(".spec.tsx") or path.name.endswith(".stories.tsx"):
            continue
        if path.name.endswith(".css.ts"):
            continue
        candidates.append(path)
    seen: set[Path] = set()
    for path in candidates:
        if path in seen or not path.is_file():
            continue
        seen.add(path)
        content = read_text(path)
        if content and re.search(rf"export\s+(?:function|const)\s+{re.escape(code_name)}\b", content):
            return path
    # compound roots: CardRoot -> Card, TableRoot -> Table
    for path in sorted(folder.glob("*.tsx")):
        if path.name.endswith((".spec.tsx", ".stories.tsx", ".css.ts")):
            continue
        content = read_text(path) or ""
        if re.search(rf"export\s+(?:function|const)\s+{re.escape(code_name)}\b", content):
            return path
        if re.search(r"export\s+(?:interface|type)\s+\w+Props\b", content):
            return path
    return None


def find_props_interface_block(content: str, code_name: str) -> tuple[str | None, bool]:
    """Return (block, is_base_ui_wrapper)."""
    patterns = [
        rf"export\s+interface\s+{re.escape(code_name)}Props\b",
        rf"export\s+type\s+{re.escape(code_name)}Props\b",
        rf"export\s+interface\s+(\w+)Props\b",
        rf"export\s+type\s+(\w+)Props\b",
    ]
    for pat in patterns:
        match = re.search(pat, content)
        if not match:
            continue
        start = match.start()
        snippet = content[start : start + 500]
        is_wrapper = bool(
            re.search(r"BaseUiProps|ComponentPropsWithRef|ComponentProps<|extends\s+Omit", snippet)
        )
        # Brace-match from opening brace after Props declaration
        brace_start = content.find("{", match.end() - 1)
        if brace_start == -1:
            # type alias = ...
            eq = content.find("=", match.end() - 1)
            if eq == -1:
                continue
            semi = content.find(";", eq)
            block = content[eq + 1 : semi if semi != -1 else None].strip()
            return block, is_wrapper
        depth = 0
        for i in range(brace_start, len(content)):
            if content[i] == "{":
                depth += 1
            elif content[i] == "}":
                depth -= 1
                if depth == 0:
                    return content[brace_start + 1 : i], is_wrapper
    return None, False


def parse_ts_prop_line(line: str) -> dict[str, Any] | None:
    line = line.strip().rstrip(",")
    if not line or line.startswith(("//", "/*", "*")):
        return None
    if line.startswith("[") and "]: " in line:
        return None
    line = re.sub(r"/\*\*.*?\*/", "", line, flags=re.DOTALL).strip()
    m = re.match(r"^(?:readonly\s+)?('[^']+'|\w+)\??:\s*(.+)$", line)
    if not m:
        return None
    raw_name = m.group(1).strip("'")
    type_part = m.group(2).strip()
    name_prefix = m.group(1)
    required = "?" not in name_prefix.split(":")[0] and not name_prefix.endswith("?")
    return {
        "name": raw_name,
        "type": type_part,
        "required": required,
        "default": None,
        "source": "tsx",
    }


def parse_tsx_props(
    content: str, code_name: str, folder: Path | None = None
) -> tuple[list[dict[str, Any]], bool]:
    block, is_wrapper = find_props_interface_block(content, code_name)
    if not block:
        alias_name = f"{code_name}Props"
        if re.search(rf"export\s+type\s+{re.escape(alias_name)}\s*=", content) and folder:
            block = resolve_type_alias_block(content, alias_name, folder)
            is_wrapper = False
    if not block:
        for suffix in ("Root",):
            alt = f"{code_name}{suffix}"
            block, is_wrapper = find_props_interface_block(content, alt)
            if block:
                break
    if not block and folder:
        for props_file in find_props_files(folder):
            props_content = read_text(props_file) or ""
            for candidate in (
                f"{code_name}Props",
                f"{code_name}RootProps",
                "CardContainerProps",
            ):
                if candidate.replace("Props", "") in props_content or candidate in props_content:
                    base = candidate.replace("Props", "")
                    block, is_wrapper = find_props_interface_block(props_content, base)
                    if block:
                        break
            if block:
                break
    if not block:
        return [], False
    if is_wrapper and not re.search(r"^\s+(?:'|\w|\[)", block, re.MULTILINE):
        return [], True
    props: list[dict[str, Any]] = []
    for raw_line in block.splitlines():
        prop = parse_ts_prop_line(raw_line)
        if prop:
            props.append(prop)
    return props, is_wrapper


def parse_destructuring_defaults(content: str, code_name: str) -> dict[str, str]:
    defaults: dict[str, str] = {}
    fn_match = re.search(
        rf"export\s+function\s+{re.escape(code_name)}\s*\(\s*\{{([^}}]+)\}}",
        content,
        re.DOTALL,
    )
    if not fn_match:
        fn_match = re.search(
            rf"export\s+const\s+{re.escape(code_name)}\s*=\s*\(\s*\{{([^}}]+)\}}",
            content,
            re.DOTALL,
        )
    if not fn_match:
        return defaults
    params = fn_match.group(1)
    for part in params.split(","):
        part = part.strip()
        if not part or part.startswith("..."):
            continue
        if "=" in part:
            name, val = part.split("=", 1)
            name = name.strip().strip("'\"")
            defaults[name] = val.strip()
    return defaults


def merge_props(
    tsx_props: list[dict[str, Any]],
    readme_props: list[dict[str, Any]],
    ts_defaults: dict[str, str],
    is_wrapper: bool,
) -> list[dict[str, Any]]:
    by_name: dict[str, dict[str, Any]] = {}
    for prop in readme_props:
        by_name[prop["name"]] = dict(prop)
    for prop in tsx_props:
        name = prop["name"]
        if name in by_name:
            merged = by_name[name]
            merged["source"] = "both"
            if not merged.get("type") or merged["type"] == "inherited":
                merged["type"] = prop["type"]
            # README contract tables are authoritative for required/default.
            if merged.get("default") is None and prop.get("default") is not None:
                merged["default"] = prop["default"]
        elif is_wrapper:
            # For BaseUiProps wrappers, only add TS-only props not covered by README
            by_name[name] = dict(prop)
        else:
            by_name[name] = dict(prop)
    for name, prop in by_name.items():
        if prop.get("default") is None and name in ts_defaults:
            prop["default"] = ts_defaults[name]
    return sorted(by_name.values(), key=lambda p: p["name"])


def is_variant_like(prop: dict[str, Any]) -> bool:
    name = prop["name"]
    lower = name.lower()
    if lower in VARIANT_LIKE_EXACT:
        return True
    if any(lower == p or lower.startswith(p) for p in VARIANT_LIKE_PREFIXES):
        return True
    prop_type = prop.get("type", "")
    if prop_type.strip() == "boolean":
        return True
    return False


def find_story_path(folder: Path, code_name: str) -> str | None:
    for path in sorted(folder.glob("*.stories.tsx")):
        return str(path)
    # camelCase story files
    camel = code_name[0].lower() + code_name[1:] if code_name else code_name
    candidate = folder / f"{camel}.stories.tsx"
    if candidate.is_file():
        return str(candidate)
    return None


def find_readme(folder: Path) -> Path | None:
    readme = folder / "README.md"
    return readme if readme.is_file() else None


def resolve_import_path(category: str, folder_name: str) -> str:
    if category == "integrations":
        return "@nova/ui/react-hook-form"
    return "@nova/ui"


def build_notes(
    folder_name: str,
    category: str,
    barrel_exports: list[str],
    code_name: str,
    main_tsx: Path | None,
    readme_path: Path | None,
    tsx_props: list[dict[str, Any]],
    readme_props: list[dict[str, Any]],
    is_wrapper: bool,
) -> str:
    notes: list[str] = []
    if folder_name in INTERNAL_NOT_BARREL:
        notes.append("Internal component — not exported from @nova/ui barrel (index.ts)")
    if folder_name == "icon":
        glyph_exports = [
            e for e in barrel_exports if e.startswith("Icon") and e != "IconProps" and e != "IconSize"
        ]
        if glyph_exports:
            notes.append(
                "Icon exports multiple glyph components via createIcon(IconProps pattern): "
                + ", ".join(sorted(glyph_exports))
            )
    if folder_name in COMPOUND_COMPONENTS:
        notes.append(COMPOUND_COMPONENTS[folder_name]["note"])
    if is_wrapper and not readme_props:
        notes.append("Props extend BaseUiProps/Omit wrapper — README API table is primary source")
    elif is_wrapper and readme_props:
        notes.append("Props type wraps BaseUiProps/Omit — merged with README API contract table")
    if main_tsx is None:
        notes.append("Could not locate main component TSX file")
    if readme_path is None:
        notes.append("No README.md found")
    if not tsx_props and not readme_props:
        notes.append("Failed to extract props from both TSX and README")
    return "; ".join(notes)


def scan_component_entry(
    folder: Path,
    category: str,
    src_root: Path,
    barrel_exports: list[str],
    failures: list[str],
    *,
    code_name: str | None = None,
    main_tsx: Path | None = None,
    readme_subsection: str | None = None,
    extra_notes: str | None = None,
) -> dict[str, Any] | None:
    folder_name = folder.name
    code_name = code_name or kebab_to_pascal(folder_name)

    readme_path = find_readme(folder)
    readme_text = read_text(readme_path) if readme_path else None

    if main_tsx is None:
        main_tsx = find_main_tsx(folder, code_name)
        if main_tsx is None and folder_name in COMPOUND_COMPONENTS:
            for suffix in ("Root",):
                root_name = f"{code_name}{suffix}"
                main_tsx = find_main_tsx(folder, root_name)
                if main_tsx:
                    break
            if main_tsx is None:
                for path in folder.glob("*Root.tsx"):
                    main_tsx = path
                    break
        if main_tsx is None and folder_name == "app-header":
            for path in folder.glob("AppHeaderRoot.tsx"):
                main_tsx = path
                break

    tsx_content = read_text(main_tsx) if main_tsx else ""
    tsx_props, is_wrapper = parse_tsx_props(tsx_content or "", code_name, folder)
    if not tsx_props and folder_name in COMPOUND_COMPONENTS and code_name == kebab_to_pascal(folder_name):
        combined = tsx_content or ""
        for path in folder.glob("*.tsx"):
            if path != main_tsx:
                combined += "\n" + (read_text(path) or "")
        for path in find_props_files(folder):
            combined += "\n" + (read_text(path) or "")
        tsx_props, is_wrapper = parse_tsx_props(combined, code_name, folder)

    ts_defaults = parse_destructuring_defaults(tsx_content or "", code_name)

    readme_props = (
        parse_readme_api_table(readme_text, readme_subsection)
        if readme_text
        else []
    )
    props = merge_props(tsx_props, readme_props, ts_defaults, is_wrapper)
    variant_like = [p["name"] for p in props if is_variant_like(p)]

    story_path = find_story_path(folder, code_name)
    repo_root = src_root.parent.parent.parent

    notes = build_notes(
        folder_name,
        category,
        barrel_exports,
        code_name,
        main_tsx,
        readme_path,
        tsx_props,
        readme_props,
        is_wrapper,
    )
    if extra_notes:
        notes = f"{notes}; {extra_notes}" if notes else extra_notes

    if not props:
        failures.append(f"{code_name}: no props extracted")

    source_rel = None
    if main_tsx:
        source_rel = str(main_tsx.relative_to(repo_root))
    elif (folder / "index.ts").is_file():
        source_rel = str((folder / "index.ts").relative_to(repo_root))

    entry: dict[str, Any] = {
        "codeName": code_name,
        "importPath": resolve_import_path(category, folder_name),
        "sourcePath": source_rel,
        "readmePath": str(readme_path.relative_to(repo_root)) if readme_path else None,
        "storyPath": str(Path(story_path).relative_to(repo_root)) if story_path else None,
        "description": parse_description_from_readme(readme_text) if readme_text else None,
        "statusFromReadme": parse_status_from_readme(readme_text) if readme_text else None,
        "props": props,
        "variantLikeProps": variant_like,
        "notes": notes,
        "category": category,
        "folderName": folder_name,
    }

    if not entry["description"]:
        failures.append(f"{code_name}: no description extracted")
    if not entry["statusFromReadme"]:
        failures.append(f"{code_name}: no status extracted")

    return entry


def scan_folder(
    folder: Path,
    category: str,
    src_root: Path,
    barrel_exports: list[str],
    failures: list[str],
) -> list[dict[str, Any]]:
    folder_name = folder.name
    if folder_name in MULTI_COMPONENT_FOLDERS:
        entries: list[dict[str, Any]] = []
        for spec in MULTI_COMPONENT_FOLDERS[folder_name]:
            source_file = folder / spec["sourceFile"]
            entry = scan_component_entry(
                folder,
                category,
                src_root,
                barrel_exports,
                failures,
                code_name=spec["codeName"],
                main_tsx=source_file if source_file.is_file() else None,
                readme_subsection=spec["readmeSubsection"],
                extra_notes=f"Co-exported from {folder_name}/ with sibling components",
            )
            if entry:
                entries.append(entry)
        return entries

    entry = scan_component_entry(
        folder, category, src_root, barrel_exports, failures
    )
    return [entry] if entry else []


def collect_scan_targets(src_root: Path) -> list[tuple[Path, str]]:
    targets: list[tuple[Path, str]] = []
    components_dir = src_root / "components"
    if components_dir.is_dir():
        for folder in sorted(components_dir.iterdir()):
            if folder.is_dir():
                targets.append((folder, "components"))
    patterns_dir = src_root / "patterns"
    if patterns_dir.is_dir():
        for folder in sorted(patterns_dir.iterdir()):
            if folder.is_dir():
                targets.append((folder, "patterns"))
    integrations_dir = src_root / "integrations"
    if integrations_dir.is_dir():
        for folder in sorted(integrations_dir.rglob("*")):
            if folder.is_dir() and (folder / "README.md").is_file():
                rel = folder.relative_to(integrations_dir)
                if len(rel.parts) == 2:  # react-hook-form/rhf-text-field
                    targets.append((folder, "integrations"))
    return targets


def main() -> int:
    src_root = Path(os.environ.get("NOVA_UI_SRC", DEFAULT_NOVA_UI_SRC))
    if not src_root.is_dir():
        print(f"ERROR: nova-care-app UI src not found: {src_root}", file=sys.stderr)
        return 1

    barrel_path = src_root / "index.ts"
    barrel_exports = parse_barrel_exports(barrel_path, src_root)

    failures: list[str] = []
    components: list[dict[str, Any]] = []

    for folder, category in collect_scan_targets(src_root):
        entries = scan_folder(folder, category, src_root, barrel_exports, failures)
        components.extend(entries)

    # Icon special handling: ensure one entry even if folder scan worked
    icon_entries = [c for c in components if c["codeName"] == "Icon" or c["folderName"] == "icon"]
    if not icon_entries:
        failures.append("Icon: missing inventory entry")

    output = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sourceRoot": str(src_root),
        "exportsFromBarrel": barrel_exports,
        "componentCount": len(components),
        "components": components,
        "extractionFailures": failures,
    }

    out_path = REPO_ROOT / "code-api-inventory.json"
    out_path.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Wrote {out_path} ({len(components)} components)")
    if failures:
        print(f"Extraction issues ({len(failures)}):", file=sys.stderr)
        for f in failures:
            print(f"  - {f}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
