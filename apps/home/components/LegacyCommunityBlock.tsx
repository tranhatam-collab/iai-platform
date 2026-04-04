import { legacyCommunityHref } from '@/lib/surfaces'

export function LegacyCommunityBlock() {
  return (
    <section id="legacy-community" className="px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-gold/25 bg-gold/10 p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.25em] text-gold">Legacy community</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          The old community is continuing inside the new app.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
          If you are arriving from the previous IAI community, the main destination is now
          `app.iai.one`. Community reading, member activity, public posts, and future group
          coordination belong there.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={legacyCommunityHref}
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-95"
          >
            Continue to the Community App
          </a>
          <a
            href="https://docs.iai.one"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 font-medium text-white/85 transition hover:border-white/40"
          >
            Read the migration guide
          </a>
        </div>
      </div>
    </section>
  )
}
