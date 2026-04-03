import { EntryPointGrid } from '@/components/EntryPointGrid'
import { LegacyCommunityBlock } from '@/components/LegacyCommunityBlock'
import { PortalHero } from '@/components/PortalHero'
import { SurfaceMap } from '@/components/SurfaceMap'
import { TrustBoundaryBlock } from '@/components/TrustBoundaryBlock'

export default function HomePortalPage() {
  return (
    <main>
      <PortalHero />
      <EntryPointGrid />
      <SurfaceMap />
      <LegacyCommunityBlock />
      <TrustBoundaryBlock />
    </main>
  )
}
