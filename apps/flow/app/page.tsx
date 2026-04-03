import { FlowBoundaryNote } from '@/components/FlowBoundaryNote'
import { FlowEntryGrid } from '@/components/FlowEntryGrid'
import { FlowHero } from '@/components/FlowHero'

export default function FlowPage() {
  return (
    <main>
      <FlowHero />
      <FlowEntryGrid />
      <FlowBoundaryNote />
    </main>
  )
}
