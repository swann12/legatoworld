import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ExperienceLayout, PrimaryButton, TextLink } from "@/components/legato/ds";
import { useMemoryPerson } from "@/components/legato/MemoryUI";
import { addMemory, updateMemory } from "@/lib/memories-store";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/candle")({
  validateSearch: (s: Record<string, unknown>): { view?: "mots" } => ({ view: s.view === "mots" ? "mots" : undefined }),
  head: ({ match }) => legatoHead(match.search.view === "mots" ? "Quelques mots pour elle" : "Une bougie pour elle", "Une lumière et quelques mots dans son jardin."),
  component: Candle,
});
function Candle() {
  const { view } = Route.useSearch(); const { name } = useMemoryPerson(); const navigate = useNavigate();
  const [words, setWords] = useState(""); const [memoryId, setMemoryId] = useState<string>(); const [litAt, setLitAt] = useState<Date>(); const [error, setError] = useState("");
  const light = () => { try { const m = addMemory({ zone: "lettres", type: "text", title: "Une bougie", body: "Une lumière pour vous, jusqu’à demain matin." }); setMemoryId(m.id); setLitAt(new Date()); navigate({ to: "/care/rituels/candle", search: { view: "mots" } }); } catch (e) { setError(e instanceof Error ? e.message : "La bougie n’a pas pu être gardée."); } };
  const save = () => { try { if (memoryId) updateMemory(memoryId, { body: words.trim() || "Une lumière pour vous." }); else addMemory({ zone: "lettres", type: "text", title: "Une bougie", body: words.trim() || "Une lumière pour vous." }); navigate({ to: "/care/garden/space" }); } catch (e) { setError(e instanceof Error ? e.message : "Ces mots n’ont pas pu être gardés."); } };
  return <ExperienceLayout variant="memory" back="/care/rituels" backLabel="Un geste" top={<>
    {view && litAt && <p className="lg-mono mb-4">Bougie allumée · {litAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>}
    <h1 className="lg-title text-[38px]">{view ? <>Quelques mots<br /><em>pour elle ?</em></> : <>Une bougie<br />pour <em>{name}.</em></>}</h1>
    {!view && <p className="mt-3 text-[14px] leading-[1.55]">Elle reste allumée jusqu’à demain matin, dans son jardin de souvenirs.</p>}
  </>} action={<div className="flex w-full flex-col items-center gap-4">
    {view && <textarea aria-label="Quelques mots pour elle" className="lg-ritual-words mb-5" placeholder="Ce soir, j’ai repensé à…" value={words} onChange={e => setWords(e.target.value)} />}
    <PrimaryButton space="memory" onClick={view ? save : light}>{view ? "Garder ces mots" : "Allumer la bougie"}</PrimaryButton>
    {view ? <TextLink space="memory" to="/care/garden/space">Non merci</TextLink> : <p className="lg-ritual-footnote">Vous pourrez ajouter quelques mots ensuite</p>}
    {error && <p role="alert">{error}</p>}
  </div>}><div className="lg-ritual-light" aria-label="Une lumière pour votre proche" /></ExperienceLayout>;
}