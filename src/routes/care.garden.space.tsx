import { createFileRoute, Link } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Block, Row, TextLink } from "@/components/legato/ds";
import { useMemoryPerson, AddMemoryButton } from "@/components/legato/MemoryUI";
import { useMemories } from "@/lib/memories-store";
import { newestMemories, memoryKind } from "@/lib/memory-garden";
import { legatoHead } from "@/lib/legato-head";
export const Route = createFileRoute("/care/garden/space")({ head: () => legatoHead("Le jardin de votre proche", "Un espace pour garder ses photos, sa voix, ses lettres et ses lieux."), component: MemorySpace });
function MemorySpace() {
  const { name, person } = useMemoryPerson(); const all = newestMemories(useMemories()); const latest = all[0];
  const birthday = person?.birthday ? new Date(`${person.birthday}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "";
  return <StandardLayout space="memory" title="Mémoire" activeTab="memory">
    <PageTitle space="memory" className="mt-8">Le jardin<br />de <em>{name}.</em></PageTitle>
    <Lead className="mt-4">{all.length ? `${all.length} souvenir${all.length > 1 ? "s" : ""} gardé${all.length > 1 ? "s" : ""}. Le dernier, ${new Date(latest.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}.` : "Son jardin attend le premier souvenir."}</Lead>
    <div className="flex flex-wrap gap-5 mt-3"><TextLink space="memory" to="/profile/portrait">Son portrait</TextLink><TextLink space="memory" to="/care/garden/book">Un livre souvenir</TextLink></div>
    <div className="mt-7">{latest ? <Link to="/care/garden/$zone/$id" params={{ zone: latest.zone, id: latest.id }}><Block space="memory" eyebrow={`Dernier souvenir · ${memoryKind(latest)}`} title={latest.title || memoryKind(latest)}><p className="lg-memory-quote">{latest.body ? `« ${latest.body} »` : "Une trace, gardée doucement."}</p></Block></Link> : <Block space="memory" eyebrow="Son premier souvenir" title="Ce que vous voulez garder."><p className="lg-memory-quote">Une phrase, une photo, un son.</p></Block>}</div>
    <Row title="Tous ses souvenirs" subtitle="Photos, voix, lettres, lieux" to="/care/garden/all" />
    <Row title="Un geste pour elle" subtitle="Une bougie, une lanterne" to="/care/rituels" />
    <Row title={`Son anniversaire${birthday ? `, le ${birthday}` : ""}`} to="/care/dates" last />
    <div className="mt-6"><AddMemoryButton /></div>
    <div className="mt-10"><TextLink space="memory" to="/care/garden">Revenir aux parcelles</TextLink></div>
  </StandardLayout>;
}
