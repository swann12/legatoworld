import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { StandardLayout, PageTitle, Lead, Block, Row, TextLink, TextArea, PrimaryButton, OutlineButton, Field } from "@/components/legato/ds";
import { MemoryExtras, useMemoryPerson } from "@/components/legato/MemoryUI";
import { usePortrait, portraitSentence } from "@/lib/portrait-store";
import { RELATION_LABEL } from "@/lib/spaces-store";
import { legatoHead } from "@/lib/legato-head";
const Editor = lazy(() => import("@/components/legato/legacy/Step11Portrait").then(m => ({ default: m.LegacyPortraitEditor })));
export const Route = createFileRoute("/profile/portrait")({ validateSearch: (s: Record<string, unknown>) => ({ from: typeof s.from === "string" ? s.from : undefined }), head: () => legatoHead("Son portrait", "Ce que vous voulez garder de votre proche, ses goûts et ses dates importantes."), component: PortraitSummary });
function PortraitSummary() {
  const { name, person, updateSpace } = useMemoryPerson(); const { portrait, update } = usePortrait(); const [editing, setEditing] = useState(false); const [free, setFree] = useState(false); const [dates, setDates] = useState(false);
  const birthday = person?.birthday ? new Date(`${person.birthday}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "";
  const lifespan = [person?.birthday?.slice(0, 4), person?.deathDate?.slice(0, 4)].filter(Boolean).join(" – ");
  return <StandardLayout space="memory" back="/care/garden/space" backLabel="Mémoire" activeTab="/care/garden">
    {editing ? <Suspense fallback={<Lead className="mt-8">Un instant…</Lead>}><Editor onDone={() => setEditing(false)} /></Suspense> : <>
      <span className="lg-memory-avatar mt-8">{name.charAt(0).toUpperCase()}</span><PageTitle space="memory" className="mt-5">{name}{person?.relation ? <>, <em>{RELATION_LABEL[person.relation].toLowerCase()}.</em></> : "."}</PageTitle><p className="lg-mono mt-3">{[lifespan, person?.relation ? RELATION_LABEL[person.relation] : ""].filter(Boolean).join(" · ")}</p>
      <Block space="memory" className="mt-7" label="Ce que Legato retient d’elle"><p className="lg-memory-portrait-text">{portrait.freeText || portraitSentence(portrait, name) || "Son portrait se dessine avec ce que vous souhaitez raconter."}</p></Block>
      <Row title="Modifier son portrait" subtitle="Ce que vous voulez que Legato sache" onClick={() => setEditing(true)} />
      <Row title="Dates importantes" subtitle={birthday ? `Anniversaire le ${birthday}` : "Ses dates repères"} onClick={() => setDates(!dates)} last />
      {dates && person && <div className="space-y-5 pt-5"><Field space="memory" label="Son anniversaire" type="date" value={person.birthday || ""} onChange={e => updateSpace(person.id, { birthday: e.target.value || null })} /><Field space="memory" label="La date de son départ" type="date" value={person.deathDate || ""} onChange={e => updateSpace(person.id, { deathDate: e.target.value || null })} /><TextLink space="memory" to="/care/dates">Toutes ses dates</TextLink></div>}
      <MemoryExtras><TextLink space="memory" onClick={() => setFree(!free)}>Ce que vous voulez que Legato sache</TextLink>{free && <div className="py-5"><TextArea space="memory" label="Avec vos mots" value={portrait.freeText} onChange={e => update({ freeText: e.target.value })} placeholder="Une anecdote, une préférence, un détail…" /><OutlineButton space="memory" onClick={() => setFree(false)} className="mt-4">Garder ces mots</OutlineButton></div>}</MemoryExtras>
    </>}
  </StandardLayout>;
}
