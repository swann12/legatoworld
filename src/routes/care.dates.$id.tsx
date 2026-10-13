import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, Lead, Row } from "@/components/legato/ds";
import { useSpaces, upcomingForSpaces } from "@/lib/spaces-store";
import { setDateReminder } from "@/lib/today";
import { legatoHead } from "@/lib/legato-head";
export const Route = createFileRoute("/care/dates/$id")({ head: () => legatoHead("Son anniversaire", "Préparer cette date à votre rythme, seul ou avec vos proches."), component: Birthday });
function Birthday() {
  const { id } = Route.useParams(); const { spaces } = useSpaces(); const d = upcomingForSpaces(spaces, 400).find(d => d.key === id); const [choice, setChoice] = useState("");
  const pick = (label: string) => { setDateReminder(id, label === "Laisser passer ce jour" ? "non" : "veille"); setChoice(label); };
  return <StandardLayout space="memory" back="/care/garden/space" backLabel="Mémoire" activeTab="/care/garden">
    {d && <p className="lg-mono pt-8">{d.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} · {d.daysAway ? `dans ${d.daysAway} jours` : "aujourd’hui"}</p>}
    <PageTitle className="mt-8">Son <em>anniversaire.</em><br />Que voulez-vous faire ?</PageTitle>
    <Lead className="mt-3">Rien n’est obligatoire. Certaines personnes préfèrent laisser passer la journée.</Lead>
    <div className="mt-6"><Row n={1} title="Un moment seul" subtitle="Un lieu, une musique, une lettre" onClick={() => pick("Un moment seul")} /><Row n={2} title="Avec des proches" subtitle="Inviter quelques personnes, simplement" onClick={() => pick("Avec des proches")} /><Row n={3} title="Un geste pour elle" subtitle="Des fleurs, une bougie, un don" to="/care/rituels" /><Row n={4} title="Laisser passer ce jour" subtitle="Legato ne vous le rappellera pas" onClick={() => pick("Laisser passer ce jour")} last /></div>
    {choice && <p role="status" className="lg-row-sub mt-5">{choice === "Laisser passer ce jour" ? "Legato ne vous rappellera pas cette date." : `Votre choix est gardé : ${choice.toLowerCase()}.`}</p>}
  </StandardLayout>;
}