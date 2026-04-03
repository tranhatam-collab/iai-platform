export function TrustBoundaryBlock() {
  const items = [
    'iai.one remains the constitutional and trust root.',
    'home.iai.one routes people into the correct surface.',
    'app.iai.one is the real destination for community and product use.',
    'docs and developer resources stay separate from the app and portal.',
    'control surfaces are not the default public entry point.',
  ]

  return (
    <section id="trust-boundaries" className="border-t border-white/10 px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-white/40">Trust and boundaries</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Clear boundaries keep the ecosystem coherent.
          </h2>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {items.map(item => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-6 text-white/70">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
