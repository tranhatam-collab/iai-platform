const entries = [
  {
    title: 'Use the platform',
    href: 'https://app.iai.one',
    description: 'Community, lessons, verification, profiles, and public member activity.',
  },
  {
    title: 'Build workflows',
    href: 'https://flow.iai.one',
    description: 'Workflow builder and execution surface for automation and orchestration.',
  },
  {
    title: 'Read docs',
    href: 'https://docs.iai.one',
    description: 'Architecture, guides, standards, and product documentation.',
  },
  {
    title: 'Build on IAI',
    href: 'https://developer.iai.one',
    description: 'APIs, integrations, and developer onboarding.',
  },
  {
    title: 'Operate the system',
    href: 'https://dash.iai.one',
    description: 'Dashboard and operational surface for teams and operators.',
  },
]

export function EntryPointGrid() {
  return (
    <section id="entry-points" className="px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan">Choose your entry point</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Start from your real intent.
          </h2>
          <p className="mt-4 text-white/65">
            The portal should route you into the correct surface, not force every user
            through the same path.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map(entry => (
            <a
              key={entry.title}
              href={entry.href}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-gold/40 hover:bg-white/[0.05]"
            >
              <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">{entry.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
