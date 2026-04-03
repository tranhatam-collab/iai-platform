export function PortalHero() {
  return (
    <section className="border-b border-white/10 px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">home.iai.one</p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Enter the IAI ecosystem.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
          This portal routes people into the right surface for community, workflows,
          documentation, development, and operations.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://app.iai.one"
            className="inline-flex items-center justify-center rounded-xl bg-gold px-5 py-3 font-medium text-black transition hover:brightness-110"
          >
            Go to the App
          </a>
          <a
            href="#entry-points"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 font-medium text-white/85 transition hover:border-gold/40 hover:text-white"
          >
            Explore the System
          </a>
        </div>
      </div>
    </section>
  )
}
