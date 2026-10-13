import { createFileRoute, Link } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead } from "@/components/legato/ds";
import { AddMemoryButton, MemoryListRow } from "@/components/legato/MemoryUI";
import { useMemories } from "@/lib/memories-store";
import { MEMORY_ZONES, newestMemories } from "@/lib/memory-garden";
import { legatoHead } from "@/lib/legato-head";
export const Route = createFileRoute("/care/garden/all")({ head: () => legatoHead("Tous ses souvenirs", "Photos, voix, lettres et lieux, du plus récent au plus ancien."), component: AllMemories });
function AllMemories() { const memories = newestMemories(useMemories()); return <StandardLayout space="memory" back="/care/garden/space" backLabel="Mémoire" activeTab="/care/garden">
  <PageTitle space="memory" className="mt-8">Tous ses <em>souvenirs.</em></PageTitle><Lead className="mt-4">Du plus récent au plus ancien.</Lead>
  <div className="lg-memory-filters mt-6">{MEMORY_ZONES.map(z => <Link key={z.id} to="/care/garden/$zone" params={{ zone: z.id }}>{z.label}</Link>)}</div>
  <div className="mt-5">{memories.map(m => <MemoryListRow key={m.id} memory={m} />)}{!memories.length && <Lead className="py-8">Les souvenirs que vous ajouterez apparaîtront ici.</Lead>}</div><div className="mt-7"><AddMemoryButton /></div>
</StandardLayout>; }
