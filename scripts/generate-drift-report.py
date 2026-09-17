#!/usr/bin/env python3
"""Generate the Phase 1.5 Figma/code drift report and merged registries."""

from __future__ import annotations

import json
import re
import shutil
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
FIGMA_PATH = ROOT / "figma-registry.json"
CODE_PATH = ROOT / "code-api-inventory.json"
ICONS_PATH = ROOT / "icons.json"
CSS_COVERAGE_PATH = ROOT / "css-state-coverage.json"
REPORT_PATH = ROOT / "drift-report.md"
REGISTRY_PATH = ROOT / "registry.json"
PUBLIC_REGISTRY_PATH = ROOT / "public" / "registry.json"
LLMS_PATH = ROOT / "public" / "llms.txt"

# Deliberately curated rather than inferred from Figma's matchedCodeName field.
# A null value means the Figma component/pattern has no dedicated code component.
EXACT_CODE_MAP: dict[str, str | None] = {
    "Avatar": "Avatar",
    # Patterns / composites — no dedicated @nova/ui export yet
    "Avatar Group": None,
    "Avatar Label Group": None,
    "Avatar / Presence dot": "Avatar",
    "Back Link": "Link",
    "Badge": "Badge",
    "Badge / Count": "Badge",
    "Button": "Button",
    "Card": "Card",
    "Card / Notice": "Card",
    "Checkbox / Control": "Checkbox",
    "Checkbox / Group": None,
    "Checkbox / Item": None,
    "Chip": "Chip",
    "Chip / Dismiss": "Chip",
    "Choice chip": "Chip",
    "Choice chip group": None,
    "Field": "Field",
    "Link": "Link",
    "Pagination": "Pagination",
    "Password Input": "TextField",
    "Progress Bar": "Progress",
    "Radio / Control": "Radio",
    "Radio / Group": "RadioGroup",
    "Radio / Item": None,
    "Search Input": "TextField",
    "Select / Field": "SelectField",
    "Select / Field Multi": None,
    "Select / Item": "Select",
    "Select / Multi Item": None,
    "Select / Popup": "Select",
    "Select / Popup Panel": "Select",
    "Select / Trigger": "Select",
    "Select / Trigger Multi": None,
    "Switch": "Switch",
    "Switch / Field": None,
    "Text Input": "TextField",
    "Tooltip": "Tooltip",
}

PREFIX_CODE_MAP: list[tuple[str, str | None]] = [
    # Library photo assets for Avatar.Image — not interactive components
    ("Avatar / Photo /", None),
    ("Logo /", "Logomark"),
    ("Menu /", None),
    ("Table /", "Table"),
]

# Figma components that are assets/patterns: still listed, but drift note is fixed.
NOT_IMPLEMENTED_NOTES: dict[str, str] = {
    "Switch / Field": "proposed Switch+Field composite; bare Switch exists",
    "Avatar Group": "Figma pattern; no AvatarGroup export in @nova/ui",
    "Avatar Label Group": "Figma pattern; no AvatarLabelGroup export in @nova/ui",
}

# Typed input designs supported by TextField's native input type. Rich/specialized
# inputs remain unmapped because a native type does not implement their anatomy.
TYPED_TEXT_FIELDS = {
    "Input / Email",
    "Input / Phone",
    "Input / Website",
}

CATEGORY_BY_PAGE = {
    "Buttons": "Actions",
    "Text links": "Actions",
    "Links": "Actions",
    "Chips": "Data display",
    "Badges": "Data display",
    "Avatars": "Data display",
    "Inputs": "Forms & inputs",
    "Select": "Forms & inputs",
    "Selects": "Forms & inputs",
    "Checkboxes": "Forms & inputs",
    "Radios": "Forms & inputs",
    "Switches": "Forms & inputs",
    "Fields": "Forms & inputs",
    "Dropdowns": "Navigation & misc",
    "Menus": "Navigation & misc",
    "Cards": "Containers",
    "Tables": "Data display",
    "Pagination": "Navigation & misc",
    "Tooltips": "Communication",
    "Progress": "Communication",
    "Progress indicators": "Communication",
    "Logos": "Brand",
}

PROP_CANDIDATES: dict[str, list[str]] = {
    "checked": ["checked"],
    "size": ["size"],
    "variant": ["variant"],
    "tone": ["tone"],
    "leading": ["leading", "startIcon", "leadingIcon"],
    "trailing": ["trailing", "endIcon", "trailingIcon"],
    "layout": ["layout"],
    "content": ["content", "children"],
    "external icon": ["external", "externalIcon", "showExternalIcon"],
    "open": ["open"],
    "selected": ["selected", "value", "checked"],
    "sort": ["sort", "sortDirection"],
    "style": ["variant", "appearance"],
    "border": ["border", "bordered"],
    "status": ["presence", "status"],
    "show presence": ["presence"],
    "digits": ["count", "children"],
}

PLUMBING = {
    "className",
    "style",
    "ref",
    "id",
    "name",
    "children",
    "inputRef",
    "type",
    "as",
}

INTERACTION_STATES = {"hover", "focus", "focus visible", "pressed"}
BASELINE_STATES = {"rest", "default"}

# Chip root is inert; hover/focus CSS lives on the dismiss control only.
# Do not credit Chip / Choice chip masters with dismiss-button CSS.
CSS_INTERACTION_OVERRIDES: dict[str, dict[str, bool]] = {
    "Chip": {"hover": False, "focusVisible": False, "pressed": False},
    "Choice chip": {"hover": False, "focusVisible": False, "pressed": False},
}

CODE_EXAMPLES = {
    "Card": "<Card.Root />",
    "Table": "<Table.Root />",
}


def load_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def css_coverage_for(code_name: str | None, figma_name: str, coverage: dict[str, Any]) -> dict[str, bool]:
    """Return hover/focusVisible/pressed/checked/disabled booleans for a code match."""
    empty = {
        "hover": False,
        "focusVisible": False,
        "pressed": False,
        "disabled": False,
        "checked": False,
    }
    if not code_name:
        return empty
    base = dict(empty)
    entry = coverage.get("components", {}).get(code_name)
    if entry:
        for key in empty:
            base[key] = bool(entry.get(key))
    # Chip / Dismiss is the dismiss control — use Chip CSS as-is (dismiss has hover/focus).
    if figma_name == "Chip / Dismiss":
        return base
    if figma_name in CSS_INTERACTION_OVERRIDES:
        base.update(CSS_INTERACTION_OVERRIDES[figma_name])
    return base


def interaction_css_key(state: str) -> str | None:
    lowered = state.lower()
    if lowered == "hover" or lowered == "selected hover":
        return "hover"
    if lowered in {"focus", "focus visible"}:
        return "focusVisible"
    if lowered == "pressed":
        return "pressed"
    return None


def code_match(name: str, code_names: set[str]) -> str | None:
    if name in EXACT_CODE_MAP:
        match = EXACT_CODE_MAP[name]
    elif name in TYPED_TEXT_FIELDS:
        match = "TextField"
    else:
        match = None
        for prefix, candidate in PREFIX_CODE_MAP:
            if name.startswith(prefix):
                match = candidate
                break
    return match if match in code_names else None


def category_for(page: str) -> str:
    if page in CATEGORY_BY_PAGE:
        return CATEGORY_BY_PAGE[page]
    lowered = page.lower()
    if any(word in lowered for word in ("input", "select", "checkbox", "radio", "switch", "field")):
        return "Forms & inputs"
    if any(word in lowered for word in ("button", "link")):
        return "Actions"
    if any(word in lowered for word in ("badge", "chip", "avatar", "table")):
        return "Data display"
    if any(word in lowered for word in ("tooltip", "alert", "progress", "spinner")):
        return "Communication"
    if "card" in lowered:
        return "Containers"
    if any(word in lowered for word in ("menu", "nav", "rail", "tab", "breadcrumb")):
        return "Navigation & misc"
    return page or "TODO"


def find_code_prop(candidates: list[str], code_props: set[str]) -> str | None:
    for candidate in candidates:
        if candidate in code_props:
            return candidate
    return None


def prop_analysis(
    figma_prop: dict[str, Any],
    code_props: set[str],
    *,
    code_name: str | None,
    figma_name: str,
    css: dict[str, bool],
) -> tuple[dict[str, Any], list[str], list[str], list[str], set[str], dict[str, str]]:
    """Return registry prop, matched, gaps, not_applicable, used code props, value status."""
    name = figma_prop["name"]
    values = [str(value) for value in figma_prop.get("values", [])]
    lower_name = name.lower()
    matched: list[str] = []
    gaps: list[str] = []
    not_applicable: list[str] = []
    used: set[str] = set()
    value_status: dict[str, str] = {}
    code_prop: str | None = None
    notes: list[str] = []

    if lower_name == "state":
        mapped_state_props: list[str] = []
        for value in values:
            lowered = value.lower()
            if lowered in BASELINE_STATES:
                matched.append(f"{name}={value} (CSS/default)")
                value_status[value] = "matched"
            elif lowered in INTERACTION_STATES or lowered == "selected hover":
                css_key = interaction_css_key(lowered)
                if css_key and css.get(css_key):
                    matched.append(f"{name}={value} (Matched — CSS state, not prop)")
                    value_status[value] = "matched-css"
                    notes.append(f"{value} handled in CSS/:pseudo or data-attribute styles")
                else:
                    gaps.append(f"{name}={value}")
                    value_status[value] = "missing"
                    notes.append(
                        f"{value} has no matching prop and no CSS/:pseudo handling found"
                    )
            elif lowered == "disabled":
                found = find_code_prop(["disabled"], code_props)
                if found:
                    matched.append(f"{name}={value} → {found}")
                    used.add(found)
                    mapped_state_props.append(found)
                    value_status[value] = "matched"
                elif css.get("disabled"):
                    matched.append(f"{name}={value} (Matched — CSS state, not prop)")
                    value_status[value] = "matched-css"
                else:
                    gaps.append(f"{name}={value}")
                    value_status[value] = "missing"
            elif lowered == "loading":
                found = find_code_prop(["loading"], code_props)
                if found:
                    matched.append(f"{name}={value} → {found}")
                    used.add(found)
                    mapped_state_props.append(found)
                    value_status[value] = "matched"
                else:
                    gaps.append(f"{name}={value}")
                    value_status[value] = "missing"
            elif lowered in {"error", "invalid"}:
                found = find_code_prop(["error", "invalid"], code_props)
                if found:
                    matched.append(f"{name}={value} → {found}")
                    used.add(found)
                    mapped_state_props.append(found)
                    value_status[value] = "matched"
                else:
                    gaps.append(f"{name}={value}")
                    value_status[value] = "missing"
            elif lowered == "filled":
                gaps.append(f"{name}={value}")
                value_status[value] = "missing"
                notes.append("Filled may be implied by value/content but has no explicit public prop")
            elif lowered == "selected":
                # Table row selected — structural via aria-selected / CSS when present
                if css.get("checked") or "aria-selected" in str(code_props):
                    matched.append(f"{name}={value} (Matched — CSS/ARIA selected state, not prop)")
                    value_status[value] = "matched-css"
                else:
                    gaps.append(f"{name}={value}")
                    value_status[value] = "missing"
            else:
                candidate = find_code_prop([lowered.replace(" ", ""), lowered], code_props)
                if candidate:
                    matched.append(f"{name}={value} → {candidate}")
                    used.add(candidate)
                    mapped_state_props.append(candidate)
                    value_status[value] = "matched"
                else:
                    gaps.append(f"{name}={value}")
                    value_status[value] = "missing"
        if mapped_state_props:
            code_prop = ", ".join(dict.fromkeys(mapped_state_props))
    elif lower_name == "checked":
        # Radio: selection is value + RadioGroup, not a checked prop
        if code_name == "Radio":
            for value in values:
                matched.append(
                    f"{name}={value} (Matched — different API: value + RadioGroup selection)"
                )
                value_status[value] = "matched-api"
            if "value" in code_props:
                used.add("value")
                code_prop = "value (+ RadioGroup)"
            notes.append(
                "Functionally equivalent to Checked; structurally uses value + RadioGroup"
            )
        else:
            checked = find_code_prop(["checked"], code_props)
            indeterminate = find_code_prop(["indeterminate"], code_props)
            mapped: list[str] = []
            for value in values:
                lowered = value.lower()
                target = indeterminate if lowered == "indeterminate" else checked
                if target:
                    matched.append(f"{name}={value} → {target}")
                    used.add(target)
                    mapped.append(target)
                    value_status[value] = "matched"
                elif css.get("checked") and lowered != "indeterminate":
                    matched.append(f"{name}={value} (Matched — CSS state, not prop)")
                    value_status[value] = "matched-css"
                else:
                    gaps.append(f"{name}={value}")
                    value_status[value] = "missing"
            code_prop = ", ".join(dict.fromkeys(mapped)) or None
    elif lower_name == "size" and figma_name == "Pagination":
        # Real gap: Figma Size sm/md; code has fixed 24×24, no size prop
        for value in values:
            gaps.append(f"{name}={value}")
            value_status[value] = "missing"
        notes.append(
            "No public size prop — controls are fixed 24×24; TablePagination owns Select size only"
        )
    elif lower_name == "position" and figma_name == "Pagination":
        # Docs-only column describing page-range algorithm regions — not a visual prop
        for value in values:
            not_applicable.append(f"{name}={value}")
            value_status[value] = "not-applicable"
            matched.append(f"{name}={value} (Not applicable — docs/layout algorithm, not a prop)")
        notes.append(
            "Figma Position (First/Middle/Last) documents page-range regions derived from page/pageCount"
        )
    elif lower_name == "content" and ({"src", "initials"} & code_props):
        mapped: list[str] = []
        for value in values:
            lowered = value.lower()
            if lowered == "image" and "src" in code_props:
                matched.append(f"{name}={value} → src")
                used.add("src")
                mapped.append("src")
                value_status[value] = "matched"
            elif lowered == "initials" and "initials" in code_props:
                matched.append(f"{name}={value} → initials")
                used.add("initials")
                mapped.append("initials")
                value_status[value] = "matched"
            elif lowered == "silhouette":
                gaps.append(f"{name}={value}")
                value_status[value] = "missing"
                notes.append("Silhouette fallback has no dedicated public prop")
            else:
                gaps.append(f"{name}={value}")
                value_status[value] = "missing"
        code_prop = ", ".join(dict.fromkeys(mapped)) or None
    elif lower_name == "status" and "presence" in code_props:
        for value in values:
            lowered = value.lower()
            if lowered in {"online", "offline", "busy"}:
                matched.append(f"{name}={value} → presence")
                used.add("presence")
                value_status[value] = "matched"
            else:
                gaps.append(f"{name}={value}")
                value_status[value] = "missing"
                notes.append(f"presence does not include '{value}'")
        code_prop = "presence"
    else:
        candidates = PROP_CANDIDATES.get(lower_name, [lower_name.replace(" ", "")])
        found = find_code_prop(candidates, code_props)
        code_prop = found
        if found:
            used.add(found)
            matched.append(f"{name} → {found}")
            value_status.update({value: "matched" for value in values})
        else:
            gaps.extend(f"{name}={value}" for value in values)
            value_status.update({value: "missing" for value in values})

    if gaps and matched:
        status = "partial"
    elif gaps:
        status = "not-implemented"
    elif any(v == "matched-css" or v == "matched-api" for v in value_status.values()) and not any(
        v == "matched" for v in value_status.values()
    ):
        status = "matched"
    else:
        status = "matched"
    result: dict[str, Any] = {
        "name": name,
        "figmaValues": values,
        "codeProp": code_prop,
        "implementationStatus": status,
    }
    if notes:
        result["notes"] = "; ".join(dict.fromkeys(notes))
    return result, matched, gaps, not_applicable, used, value_status


def boolean_prop_analysis(
    prop: dict[str, Any], code_props: set[str]
) -> tuple[dict[str, Any], list[str], list[str], set[str]]:
    name = prop["name"]
    lower = name.lower()
    candidates = {
        "show leading icon": ["startIcon", "leadingIcon", "leading"],
        "show trailing icon": ["endIcon", "trailingIcon", "trailing"],
        "show external icon": ["external", "externalIcon", "showExternalIcon"],
        "show dismiss": ["onDismiss"],
        "show close": ["onClose", "dismissible"],
        "show presence": ["presence"],
        "disabled": ["disabled"],
    }.get(lower, [re.sub(r"[^a-zA-Z0-9]", "", name[:1].lower() + name[1:])])
    found = find_code_prop(candidates, code_props)
    status = "matched" if found else "not-implemented"
    registry_prop: dict[str, Any] = {
        "name": name,
        "figmaValues": [False, True],
        "codeProp": found,
        "implementationStatus": status,
    }
    if found:
        return registry_prop, [f"{name} → {found}"], [], {found}
    return registry_prop, [], [name], set()


def analyze_component(
    component: dict[str, Any],
    code_by_name: dict[str, dict[str, Any]],
    css_coverage: dict[str, Any],
) -> dict[str, Any]:
    name = component["figmaComponentName"]
    match = code_match(name, set(code_by_name))
    code = code_by_name.get(match) if match else None
    code_props = {prop["name"] for prop in code.get("props", [])} if code else set()
    css = css_coverage_for(match, name, css_coverage)
    registry_props: list[dict[str, Any]] = []
    matched: list[str] = []
    gaps: list[str] = []
    not_applicable: list[str] = []
    used_code_props: set[str] = set()
    status_by_prop_value: dict[str, dict[str, str]] = {}

    if code:
        for prop in component.get("props", []):
            analyzed, prop_matched, prop_gaps, prop_na, used, value_status = prop_analysis(
                prop,
                code_props,
                code_name=match,
                figma_name=name,
                css=css,
            )
            registry_props.append(analyzed)
            matched.extend(prop_matched)
            gaps.extend(prop_gaps)
            not_applicable.extend(prop_na)
            used_code_props.update(used)
            status_by_prop_value[prop["name"]] = value_status
        for prop in component.get("nonVariantProps", []):
            if prop.get("type") != "BOOLEAN":
                continue
            analyzed, prop_matched, prop_gaps, used = boolean_prop_analysis(prop, code_props)
            registry_props.append(analyzed)
            matched.extend(prop_matched)
            gaps.extend(prop_gaps)
            used_code_props.update(used)
    else:
        for prop in component.get("props", []):
            registry_props.append(
                {
                    "name": prop["name"],
                    "figmaValues": [str(value) for value in prop.get("values", [])],
                    "codeProp": None,
                    "implementationStatus": "not-implemented",
                }
            )
        for prop in component.get("nonVariantProps", []):
            if prop.get("type") == "BOOLEAN":
                registry_props.append(
                    {
                        "name": prop["name"],
                        "figmaValues": [False, True],
                        "codeProp": None,
                        "implementationStatus": "not-implemented",
                    }
                )

    if name in NOT_IMPLEMENTED_NOTES and not code:
        gaps = [NOT_IMPLEMENTED_NOTES[name]]
    if name.startswith("Avatar / Photo /"):
        gaps = ["Library photo asset for Avatar.Image; not a UI control component"]
    if name == "Button" and any(
        str(value).lower() in {"icononly", "icon only"}
        for prop in component.get("props", [])
        if prop["name"].lower() == "layout"
        for value in prop.get("values", [])
    ):
        gaps.append("Layout=iconOnly maps to the separate IconButton API")

    extras: list[str] = []
    if code:
        for prop in code.get("props", []):
            prop_name = prop["name"]
            if (
                prop_name in used_code_props
                or prop_name in PLUMBING
                or prop_name.startswith("on")
                or prop_name.startswith("aria-")
                or prop_name.startswith("default")
            ):
                continue
            extras.append(prop_name)

    variants: list[dict[str, Any]] = []
    for variant in component.get("variantMatrix", []):
        combo = variant.get("variantCombo", {})
        variant_status = "not-implemented" if not code else "matched"
        if code:
            for prop_name, value in combo.items():
                status = status_by_prop_value.get(prop_name, {}).get(str(value))
                if status == "missing":
                    variant_status = "partial"
                    break
                if status == "not-applicable" and variant_status == "matched":
                    continue
        variants.append(
            {
                "properties": combo,
                "nodeId": variant.get("nodeId"),
                "implementationStatus": variant_status,
            }
        )

    implementation_status = "not-implemented" if not code else ("partial" if gaps else "matched")
    description = code.get("description") if code else None
    result = {
        "name": name,
        "figmaComponentName": name,
        "category": category_for(component.get("page", "")),
        "page": component.get("page"),
        "nodeId": component.get("nodeId"),
        "description": description or "TODO",
        "buildStatus": component.get("buildStatus"),
        "importPath": code.get("importPath") if code else None,
        "implementationStatus": implementation_status,
        "props": registry_props,
        "variants": variants,
        "codeExample": CODE_EXAMPLES.get(match, f"<{match} />") if code else None,
        "a11yNotes": None,
        "gaps": list(dict.fromkeys(gaps)),
        "notApplicable": list(dict.fromkeys(not_applicable)),
        "_analysis": {
            "codeMatch": match,
            "matched": list(dict.fromkeys(matched)),
            "extra": sorted(set(extras), key=str.lower),
            "notApplicable": list(dict.fromkeys(not_applicable)),
        },
    }
    return result


def human_list(values: list[str], empty: str = "None") -> str:
    return ", ".join(values) if values else empty


def build_report(
    registry: list[dict[str, Any]], icon_count: int, generated: str, code_only: list[str]
) -> str:
    matched_count = sum(item["implementationStatus"] != "not-implemented" for item in registry)
    not_implemented = [item for item in registry if item["implementationStatus"] == "not-implemented"]
    unknown = [item for item in registry if item["buildStatus"] is None]
    # Only count interaction states still flagged as real gaps (no CSS handling)
    interaction_gap_count = 0
    interaction_css_matched = 0
    for item in registry:
        for label in item["_analysis"]["matched"]:
            if "CSS state, not prop" in label and any(
                s in label.lower() for s in ("hover", "focus", "pressed")
            ):
                interaction_css_matched += 1
        for gap in item["gaps"]:
            lowered = gap.lower()
            if lowered.startswith("state=") and any(
                s in lowered for s in ("hover", "focus", "pressed")
            ):
                interaction_gap_count += 1

    lines = [
        "# Soma UI — Figma vs code drift report",
        "",
        f"Generated: {generated}",
        "Sources: figma-registry.json, code-api-inventory.json, COMPONENT-STATUS.md, css-state-coverage.json",
        "",
        "## Summary",
        f"- Figma components audited: {len(registry)} (icons excluded)",
        f"- Matched to code: {matched_count}",
        f"- Not implemented: {len(not_implemented)}",
        f"- Status unknown (no COMPONENT-STATUS row): {len(unknown)}",
        (
            "- Interaction-state gaps (Hover/Focus/Pressed with no prop AND no CSS): "
            f"{interaction_gap_count}"
        ),
        (
            "- Interaction states matched via CSS (not props): "
            f"{interaction_css_matched}"
        ),
        "",
        "## Status unknown",
        "",
        "| Figma name | Page | nodeId |",
        "| --- | --- | --- |",
    ]
    lines.extend(
        f"| {item['name']} | {item['page']} | {item['nodeId']} |" for item in unknown
    )

    lines.extend(["", "## Not implemented (Figma has, code does not)", ""])
    by_page: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in not_implemented:
        by_page[item["page"]].append(item)
    for page in sorted(by_page, key=str.lower):
        lines.append(f"### {page}")
        for item in by_page[page]:
            note = ""
            if item["name"] in NOT_IMPLEMENTED_NOTES:
                note = f" — {NOT_IMPLEMENTED_NOTES[item['name']]}"
            elif item["name"].startswith("Avatar / Photo /"):
                note = " — library photo asset for Avatar.Image; not a UI control"
            lines.append(f"- {item['name']} (`{item['nodeId']}`){note}")
        lines.append("")

    lines.extend(["## Per-component drift", ""])
    seen_names: dict[str, int] = defaultdict(int)
    for item in registry:
        seen_names[item["name"]] += 1
        suffix = f" ({item['nodeId']})" if seen_names[item["name"]] > 1 else ""
        analysis = item["_analysis"]
        lines.append(f"### {item['name']}{suffix}")
        lines.append(f"- buildStatus: {item['buildStatus'] if item['buildStatus'] is not None else 'Unknown'}")
        if analysis["codeMatch"]:
            lines.append(f"- code: {analysis['codeMatch']} ({item['importPath']})")
            lines.append(f"- Matched: {human_list(analysis['matched'])}")
            missing = item["gaps"]
            missing_text = human_list(missing)
            lines.append(f"- Missing in code: {missing_text}")
            if analysis.get("notApplicable"):
                lines.append(f"- Not applicable: {human_list(analysis['notApplicable'])}")
            lines.append(f"- Extra in code: {human_list(analysis['extra'])}")
            if item["name"].startswith("Table /"):
                lines.append(
                    "- Caveat: coarse compound mapping to Table — flagged for manual review later"
                )
        else:
            note = ""
            if item["name"] in NOT_IMPLEMENTED_NOTES:
                note = f" — {NOT_IMPLEMENTED_NOTES[item['name']]}"
            elif item["name"].startswith("Avatar / Photo /"):
                note = " — library photo asset for Avatar.Image; not a UI control"
            lines.append(f"- Not implemented: no dedicated code component{note}")
        lines.append("")

    lines.extend(["## Code-only components (no Figma master found)", ""])
    for name in code_only:
        note = (
            " — internal component; not exported from the @nova/ui barrel"
            if name == "TextInput"
            else ""
        )
        lines.append(f"- {name}{note}")
    lines.extend(
        [
            "",
            "## Icons",
            "",
            (
                f"Icons are catalogued separately in `icons.json` ({icon_count} icons). "
                "They are excluded from prop/variant drift; see `icons.json` for the "
                "name + nodeId catalog."
            ),
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    figma = load_json(FIGMA_PATH)
    code_inventory = load_json(CODE_PATH)
    icons = load_json(ICONS_PATH)
    css_coverage = load_json(CSS_COVERAGE_PATH) if CSS_COVERAGE_PATH.exists() else {"components": {}}
    components = figma["components"]
    code_components = code_inventory["components"]
    code_by_name = {item["codeName"]: item for item in code_components}
    registry_internal = [
        analyze_component(item, code_by_name, css_coverage) for item in components
    ]

    mapped_code_names = {
        item["_analysis"]["codeMatch"]
        for item in registry_internal
        if item["_analysis"]["codeMatch"]
    }
    code_only = sorted(
        (name for name in code_by_name if name not in mapped_code_names),
        key=str.lower,
    )
    icon_count = icons.get("count", len(icons.get("icons", [])))
    generated = datetime.now(timezone.utc).isoformat()

    report = build_report(registry_internal, icon_count, generated, code_only)
    REPORT_PATH.write_text(report, encoding="utf-8")

    registry = []
    for item in registry_internal:
        clean = dict(item)
        clean.pop("_analysis")
        registry.append(clean)
    REGISTRY_PATH.write_text(
        json.dumps({"generatedAt": generated, "components": registry}, indent=2, ensure_ascii=False)
        + "\n",
        encoding="utf-8",
    )
    PUBLIC_REGISTRY_PATH.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(REGISTRY_PATH, PUBLIC_REGISTRY_PATH)

    llms_lines = [
        "# Soma UI component registry",
        "# Structured metadata: /registry.json",
        f"# Icon catalog ({icon_count} icons): /icons.json",
        "# One line per Figma registry component; icons are intentionally excluded.",
        "",
    ]
    for item in registry:
        description = item["description"].replace("\n", " ")
        if item["importPath"]:
            import_text = f"import {{ {item['name'] if item['name'] in code_by_name else code_match(item['name'], set(code_by_name))} }} from '{item['importPath']}'"
        else:
            import_text = "no code import"
        status = item["buildStatus"] if item["buildStatus"] is not None else "Unknown"
        llms_lines.append(
            f"{item['name']} — {description} — {import_text} — status: {status} — impl: {item['implementationStatus']}"
        )
    LLMS_PATH.write_text("\n".join(llms_lines) + "\n", encoding="utf-8")

    matched_count = sum(item["implementationStatus"] != "not-implemented" for item in registry)
    not_count = len(registry) - matched_count
    unknown_count = sum(item["buildStatus"] is None for item in registry)
    interaction_gap_count = sum(
        1
        for item in registry
        for gap in item["gaps"]
        if gap.lower().startswith("state=")
        and any(s in gap.lower() for s in ("hover", "focus", "pressed"))
    )
    interaction_css_matched = sum(
        1
        for item in registry_internal
        for label in item["_analysis"]["matched"]
        if "CSS state, not prop" in label
        and any(s in label.lower() for s in ("hover", "focus", "pressed"))
    )
    print(f"Figma components audited: {len(registry)}")
    print(f"Matched to code: {matched_count}")
    print(f"Not implemented: {not_count}")
    print(f"Status unknown: {unknown_count}")
    print(f"Interaction-state gaps (no prop + no CSS): {interaction_gap_count}")
    print(f"Interaction states matched via CSS: {interaction_css_matched}")
    print(f"Icons excluded from drift: {icon_count}")
    print(f"Code-only components: {len(code_only)}")


if __name__ == "__main__":
    main()
