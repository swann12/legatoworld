import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExperienceLayout, PrimaryButton, TextLink } from "@/components/legato/ds";
import { addMemory } from "@/lib/memories-store";
import { legatoHead } from "@/lib/legato-head";
export const Route = createFileRoute("/care/rituels/lantern")({ head: () => legatoHead("Une lanterne sur l’eau", "Quelques mots pour votre proche, confiés à une lumière."), component: Lantern });
function Lantern() {
  const navigate = useNavigate();
  const [words, setWords] = useState(""); const [released, setReleased] = useState(false); const [error, setError] = useState("");
  useEffect(() => {
    if (!released) return;
    const timer = window.setTimeout(() => navigate({ to: "/care/rituels/fait", search: { geste: "lanterne" } }), 1400);
    return () => window.clearTimeout(timer);
  }, [released, navigate]);
  const release = () => { try { addMemory({ zone: "lettres", type: "text", title: "Une lanterne sur l’eau", body: words.trim() || "Une lumière confiée à l’eau." }); setReleased(true); } catch (e) { setError(e instanceof Error ? e.message : "La lanterne n’a pas pu être gardée."); } };
  return <ExperienceLayout variant="memory" back="/care/rituels" backLabel="Un geste" top={<><h1 className="lg-title text-[36px]">Une lanterne<br /><em>sur l’eau.</em></h1><p className="mt-3 text-[14px] leading-[1.55]">Écrivez-lui quelques mots, puis laissez la lanterne s’éloigner.</p></>} action={<div className="flex w-full flex-col items-center gap-6">
    {!released && <textarea aria-label="Quelques mots pour la lanterne" className="lg-ritual-words" placeholder="Ce soir, je voulais te dire…" value={words} onChange={e => setWords(e.target.value)} />}
    {released ? <><p role="status" className="lg-ritual-footnote">Vos mots sont gardés dans son jardin.</p><TextLink space="memory" to="/care/rituels/fait" search={{ geste: "lanterne" }}>Le geste est fait</TextLink></> : <PrimaryButton space="memory" onClick={release}>Laisser partir la lanterne</PrimaryButton>}
    {error && <p role="alert">{error}</p>}
  </div>}><div className={`lg-ritual-light ${released ? "is-released" : ""}`} aria-label="La lumière de la lanterne" /></ExperienceLayout>;
}