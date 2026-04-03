const groups = [
  {
    title: 'Core',
    links: [
      ['iai.one', 'https://iai.one'],
      ['home.iai.one', 'https://home.iai.one'],
      ['app.iai.one', 'https://app.iai.one'],
      ['flow.iai.one', 'https://flow.iai.one'],
    ],
  },
  {
    title: 'Build',
    links: [
      ['docs.iai.one', 'https://docs.iai.one'],
      ['developer.iai.one', 'https://developer.iai.one'],
      ['api.iai.one', 'https://api.iai.one'],
    ],
  },
  {
    title: 'Operate',
    links: [
      ['dash.iai.one', 'https://dash.iai.one'],
      ['noos.iai.one', 'https://noos.iai.one'],
      ['cios.iai.one', 'https://cios.iai.one'],
    ],
  },
  {
    title: 'Infrastructure',
    links: [
      ['mail.iai.one', 'https://mail.iai.one'],
      ['cdn.iai.one', 'https://cdn.iai.one'],
      ['flows.iai.one', 'https://flows.iai.one'],
    ],
  },
]

export function PortalFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-gold">IAI ecosystem directory</p>
          <p className="mt-4 text-sm leading-7 text-white/65">
            `iai.one` defines the constitutional root. `home.iai.one` routes people into the
            correct product, documentation, developer, and operational surfaces.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {groups.map(group => (
          <div key={group.title}>
            <h3 className="text-sm uppercase tracking-[0.25em] text-white/35">{group.title}</h3>
            <div className="mt-4 flex flex-col gap-2">
              {group.links.map(([label, href]) => (
                <a key={label} href={href} className="text-sm text-white/65 transition hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          </div>
        ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/45">
          IAI Portal. Route first, then enter the right surface.
        </div>
      </div>
    </footer>
  )
}
