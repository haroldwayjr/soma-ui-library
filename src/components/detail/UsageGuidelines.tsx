import type { RegistryComponent } from '../../lib/registry'
import { TodoPanel } from './TodoPanel'

export function UsageGuidelines({ component: _component }: { component: RegistryComponent }) {
  return (
    <section className="space-y-4 border-t border-line pt-8">
      <h2 className="text-lg font-semibold text-ink">Usage guidelines</h2>
      <TodoPanel>
        Do/don&apos;t guidance has not been documented for this component yet.
      </TodoPanel>
    </section>
  )
}
