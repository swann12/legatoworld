import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead } from "@/components/legato/ds";
import { MemoryVisual, AudioMemory, MemoryActions } from "@/components/legato/MemoryUI";
import { useMemories } from "@/lib/memories-store";
import { memoryKind, memoryDate, canonicalZone } from "@/lib/memory-garden";
import { legatoHead } from "@/lib/legato-head";
export const Route = createFileRoute("/care/garden/$zone/$id")({ head: () => legatoHead("Un souvenir gardé", "Retrouver un moment, ajouter des mots et le partager avec un proche."), component: MemoryDetail });
function MemoryDetail() { const { zone, id } = Route.useParams(); const memory = useMemories().find(m => m.id === id && canonicalZone(m.zone) === canonicalZone(zone));
  return <StandardLayout space="memory" back="/care/garden/all" backLabel="Tous ses souvenirs" activeTab="/care/garden">{memory ? <>
    <div className="mt-7"><MemoryVisual memory={memory} /></div><div className="flex justify-between gap-4 mt-4"><p className="lg-mono">{memoryKind(memory)}</p><p className="lg-row-sub">{memoryDate(memory)}</p></div>
    <PageTitle space="memory" className="mt-7">{memory.title || <em>Un souvenir.</em>}</PageTitle>{(memory.type === "voice" || memory.type === "sound") && <div className="mt-7"><AudioMemory memory={memory} /></div>}{memory.body && <p className="lg-memory-quote mt-4">« {memory.body} »</p>}{memory.place && <Lead className="mt-3">{memory.place}</Lead>}<MemoryActions memory={memory} />
  </> : <><PageTitle className="mt-8">Ce souvenir n’est pas disponible.</PageTitle><Lead className="mt-4">Retrouvez-le depuis le jardin de la personne à laquelle il appartient.</Lead></>}</StandardLayout>;
}
