import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, Lead, Spec, PrimaryButton, TextLink, OptionCard, OutlineButton } from "@/components/legato/ds";
import { useMemoryPerson } from "@/components/legato/MemoryUI";
import { MemoryVisual } from "@/components/legato/MemoryUI";
import { useMemories } from "@/lib/memories-store";
import { memoryBookPages, newestMemories } from "@/lib/memory-garden";
import { legatoHead } from "@/lib/legato-head";
export const Route = createFileRoute("/care/garden/book")({ head: () => legatoHead("Un livre souvenir", "Choisir ses souvenirs et feuilleter un livre pour votre proche."), component: MemoryBook });
function MemoryBook() {
  const { name } = useMemoryPerson(); const memories = newestMemories(useMemories()); const [selected, setSelected] = useState<string[] | null>(null); const [choose, setChoose] = useState(false); const [preview, setPreview] = useState(false); const chosen = memories.filter(m => selected === null || selected.includes(m.id));
  return <StandardLayout space="memory" back="/care/garden/space" backLabel="Mémoire" activeTab="/care/garden">
    <PageTitle space="memory" className="mt-8">Un livre<br /><em>pour elle.</em></PageTitle><Lead className="mt-4">Ses souvenirs, rassemblés dans un livre imprimé.</Lead>
    <div className="lg-memory-book-stage mt-7"><div className="lg-memory-book-cover"><p className="lg-mono">Legato</p><div className="mt-auto"><p>{name}</p><span className="lg-mono">{new Date().getFullYear()}</span></div></div></div>
    <Spec className="mt-6" items={[{ label: "Contenu", value: `${chosen.length} souvenirs, ${memoryBookPages(chosen.length)} pages` }, { label: "Format", value: "21 × 21 cm, couverture rigide" }, { label: "Prix", value: "À partir de 29 €" }]} />
    <div className="flex flex-wrap items-center gap-5 mt-6"><PrimaryButton space="memory" onClick={() => { setChoose(!choose); setPreview(false); }}>Choisir les souvenirs</PrimaryButton><TextLink space="memory" onClick={() => { setPreview(!preview); setChoose(false); }}>Voir l’aperçu</TextLink></div>
    {choose && <section className="mt-7 space-y-3"><h2 className="lg-title text-[26px]">Les souvenirs du livre</h2>{memories.map(m => <OptionCard key={m.id} space="memory" label={m.title || m.body?.slice(0, 55) || "Un souvenir"} selected={selected === null || selected.includes(m.id)} onClick={() => setSelected(prev => { const ids = prev ?? memories.map(x => x.id); return ids.includes(m.id) ? ids.filter(id => id !== m.id) : [...ids, m.id]; })} />)}{!memories.length && <Lead>Ajoutez un premier souvenir pour composer le livre.</Lead>}<OutlineButton space="memory" onClick={() => setChoose(false)}>Garder ce choix</OutlineButton></section>}
    {preview && <section className="lg-memory-book-preview mt-7"><h2 className="lg-title text-[26px]">Le livre de {name}</h2>{chosen.map(m => <article key={m.id} className="lg-memory-book-page"><MemoryVisual memory={m} /><h3 className="lg-title text-[25px] mt-4">{m.title}</h3><p className="lg-mono mt-3">{m.when}</p><p className="lg-memory-quote mt-4">{m.body}</p></article>)}{!chosen.length && <Lead className="mt-4">Choisissez un souvenir pour voir l’aperçu.</Lead>}</section>}
    <Lead className="mt-7">Format et prix indicatifs de la maquette. L’impression et la commande ne sont pas encore disponibles.</Lead>
  </StandardLayout>;
}
