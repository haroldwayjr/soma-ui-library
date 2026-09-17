// Spec-only. Not on the package barrel. Lives next to `measure.ts` (story
// readouts) rather than next to a single spec so Link, Button, ButtonLink,
// LinkButton, TextField, and Select share one walk. Badge / Chip / Checkbox /
// Radio / Switch still inline a looser `includes` matcher; do not point them
// here until that difference is intentional or gone.
//
// Everything here exists because jsdom will not apply the rule under test.
//
// jsdom does not evaluate `var()`, so a declaration is verified as the correct
// variable *reference* rather than a computed color. Suffix is matched at the
// end of the selector so `:hover` does not also accept `:visited:hover`.

export function declares(
  element: Element,
  value: string,
  suffix = '',
): boolean {
  return rulesFor(element).some((rule) => {
    const className = ownClass(element, rule.selectorText)
    return (
      className !== undefined &&
      rule.selectorText.endsWith(`${className}${suffix}`) &&
      rule.style.cssText.includes(value)
    )
  })
}

export function rulesFor(element: Element): CSSStyleRule[] {
  return styleRules().filter((rule) =>
    [...element.classList].some((className) =>
      rule.selectorText.includes(className),
    ),
  )
}

// For chrome jsdom will not compute at all: it matches `:focus-visible` but does
// not apply the rule through `getComputedStyle`, so the only way to verify focus
// declarations is to read the emitted rule text. `marker` is the recipe's
// generated class prefix (`TextInput_inputStyle`, `Select_triggerRecipe`) and
// `suffix` the selector part that distinguishes the state.
export function ruleTextFor(marker: string, suffix: string): string {
  const match = allRules()
    .map((rule) => rule.cssText)
    .find((text) => text.includes(marker) && text.includes(suffix))

  if (match === undefined) {
    throw new Error(`no ${marker} rule found for ${suffix}`)
  }

  return match
}

// A cross-origin sheet throws on `cssRules`. None is loaded in jsdom today, but
// the guard keeps a future one from failing every caller.
function allRules(): CSSRule[] {
  return [...document.styleSheets].flatMap((sheet) => {
    try {
      return [...sheet.cssRules]
    } catch {
      return []
    }
  })
}

function ownClass(element: Element, selectorText: string): string | undefined {
  return [...element.classList].find((className) =>
    selectorText.includes(className),
  )
}

function styleRules(): CSSStyleRule[] {
  return allRules().filter(
    (rule): rule is CSSStyleRule => 'selectorText' in rule,
  )
}
