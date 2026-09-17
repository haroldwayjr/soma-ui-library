import { AppHeaderAction } from './AppHeaderAction'
import { AppHeaderBrand } from './AppHeaderBrand'
import { AppHeaderRoot } from './AppHeaderRoot'
import { AppHeaderTab } from './AppHeaderTab'
import { AppHeaderTabs } from './AppHeaderTabs'
import { AppHeaderThemeToggle } from './AppHeaderThemeToggle'

// Namespaced parts on the heading component. Each part is its own file
// because `react/no-multi-comp` rejects more than one component per module;
// this file is only the assembly. There is no `AppHeader.tsx`: on a
// case-insensitive disk it would collide with this module.
export const AppHeader = Object.assign(AppHeaderRoot, {
  Action: AppHeaderAction,
  Brand: AppHeaderBrand,
  Tab: AppHeaderTab,
  Tabs: AppHeaderTabs,
  ThemeToggle: AppHeaderThemeToggle,
})
