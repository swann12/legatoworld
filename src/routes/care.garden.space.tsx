import { createFileRoute, Link } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Block, Row, TextLink } from "@/components/legato/ds";
import { useMemoryPerson, AddMemoryButton } from "@/components/legato/MemoryUI";
import { useMemories } from "@/lib/memories-store";
import { newestMemories, memoryKind } from "@/lib/memory-garden";
import { legatoHead } from "@/lib/legato-head";
import { spaceKind } from "@/lib/spaces-store";
import { useActiveSpace } from "@/lib/use-active-space";
import { VoiceRecorder } from "@/components/legato/VoiceRecorder";
import { SectionLabel } from "@/components/legato/ds";
export const Route = createFileRoute("/care/garden/space")({ head: () => legatoHead("Le jardin de votre proche", "Un espace pour garder ses photos, sa voix, ses lettres et ses lieux."), component: MemorySpace });
function MemorySpace() {
  const { kind: activeKind } = useActiveSpace();
  const { name, person } = useMemoryPerson(); const all = newestMemories(useMemories()); const latest = all[0];
  const animal = !!person && spaceKind(person) === "animal";
  if (activeKind === "malade") return <MaladeSouvenirs />;
  const birthday = person?.birthday ? new Date(`${person.birthday}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "";
  return <StandardLayout space="memory" title="Mémoire" activeTab="/care/garden">
    <PageTitle space="memory" className="mt-8">Le jardin<br />{/^[aeiouyàâéèêh]/i.test(name) ? "d'" : "de "}<em>{name}.</em></PageTitle>
    <Lead className="mt-4">{all.length ? `${all.length} souvenir${all.length > 1 ? "s" : ""} gardé${all.length > 1 ? "s" : ""}. Le dernier, ${new Date(latest.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}.` : "Son jardin attend le premier souvenir."}</Lead>
    <div className="flex flex-wrap gap-5 mt-3"><TextLink space="memory" to="/profile/portrait">Son portrait</TextLink><TextLink space="memory" to="/care/garden/book">Un livre souvenir</TextLink></div>
    <div className="mt-7">{latest ? <Link to="/care/garden/$zone/$id" params={{ zone: latest.zone, id: latest.id }}><Block space="memory" eyebrow={`Dernier souvenir · ${memoryKind(latest)}`} title={latest.title || memoryKind(latest)}><p className="lg-memory-quote">{latest.body ? `« ${latest.body} »` : "Une trace, gardée doucement."}</p></Block></Link> : <Block space="memory" eyebrow="Son premier souvenir" title="Ce que vous voulez garder."><p className="lg-memory-quote">Une phrase, une photo, un son.</p></Block>}</div>
    <Row title="Tous ses souvenirs" subtitle={animal ? "Photos, vidéos, ses objets" : "Photos, voix, lettres, lieux"} to="/care/garden/all" />
    <Row title={animal ? "Un geste pour lui" : "Un geste pour elle"} subtitle={animal ? "Une bougie, quelques mots" : "Une bougie, une lanterne"} to="/care/rituels" />
    {animal ? <Row title="Son collier, sa gamelle" subtitle="Que garder, à votre rythme" to="/home/ses-affaires" last /> : <Row title={`Son anniversaire${birthday ? `, le ${birthday}` : ""}`} to="/care/dates/$id" params={{ id: `${person?.id ?? "active"}-b` }} last />}
    <div className="mt-6"><AddMemoryButton /></div>
    <div className="mt-10"><TextLink space="memory" to="/care/garden">Revenir aux parcelles</TextLink></div>
  </StandardLayout>;
}

/** B063 · Souvenirs d'un espace « proche malade » */
function MaladeSouvenirs() {
  return <StandardLayout space="memory" title="Souvenirs" activeTab="/care/garden">
    <PageTitle className="mt-8">Des moments<br /><em>à garder.</em></PageTitle>
    <Lead className="mt-4">Pendant qu'elle est là : sa voix, ses histoires, vos photos ensemble.</Lead>
    <div className="mt-7 p-6" style={{ background: "var(--sp-block)" }}>
      <SectionLabel>Une idée pour cette semaine</SectionLabel>
      <p className="lg-title mt-3" style={{ fontSize: 24 }}>Enregistrer sa voix</p>
      <p className="mt-1 text-[13px]" style={{ color: "var(--sp-sub)" }}>Lui demander de raconter un souvenir d'enfance · 5 minutes</p>
      <div className="mt-5"><VoiceRecorder zone="histoire" title="Un souvenir d'enfance" /></div>
    </div>
    <Row title="Ses histoires" subtitle="Ce qu'elle aime raconter" to="/care/garden/histoires" />
    <Row title="Ses recettes" subtitle="Notées avec elle" to="/care/garden/recettes" />
    <Row title="Vos photos ensemble" subtitle="Celles d'avant, celles de maintenant" to="/care/garden/$zone" params={{ zone: "photo" }} last />
    <div className="mt-10"><TextLink to="/care/garden">Revenir aux parcelles</TextLink></div>
  </StandardLayout>;
}
