import { flowEntryPoints } from '@/lib/flow-surfaces'

export function FlowEntryGrid() {
  return (
    <section className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {flowEntryPoints.map(point => (
          <div key={point.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold text-white">{point.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">{point.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
