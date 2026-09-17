import { CardBody } from './CardBody'
import { CardFooter } from './CardFooter'
import { CardHeader } from './CardHeader'
import { CardHeaderTitle } from './CardHeaderTitle'
import { CardRoot } from './CardRoot'

// Namespaced parts, not a single `header`/`footer`-prop component: this is
// the first compound API in `libs/ui` (every other component flattens to
// one function, even Base UI ones like `Switch` that are internally
// `Root`/`Thumb`). Chosen deliberately over the flattened shape so a
// consumer can compose an arbitrary header action (a menu trigger, a link,
// nothing) or omit a part entirely, rather than Nova anticipating every
// slot combination as a boolean prop. This file holds only the assembly —
// each part is a separate component in its own file because
// `react/no-multi-comp` rejects more than one component per file. That
// split is the lint tax, not a reason to invent a factory for 15-line
// wrappers.
export const Card = {
  Body: CardBody,
  Footer: CardFooter,
  Header: CardHeader,
  HeaderTitle: CardHeaderTitle,
  Root: CardRoot,
}
