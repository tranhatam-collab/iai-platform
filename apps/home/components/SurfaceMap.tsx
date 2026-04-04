import { surfaces } from '@/lib/surfaces'

export function SurfaceMap() {
  return (
    <section id="surface-map" className="border-y border-white/10 bg-white/[0.02] px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-jade">Surface map</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            One ecosystem, clearly separated by role.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {surfaces.map(surface => (
            <a
              key={surface.domain}
              href={surface.href}
              className="rounded-2xl border border-white/10 p-5 transition hover:border-cyan/40"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{surface.name}</h3>
                  <p className="mt-1 text-sm text-gold">{surface.domain}</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                  {surface.audience}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/65">{surface.role}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
