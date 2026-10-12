import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { StandardLayout, PageTitle, Lead, SectionLabel, PrimaryButton, TextLink, OptionCard, Field } from "@/components/legato/ds";
import { useCeremonyPlan } from "@/lib/ceremony-flow";
import { savePractical } from "@/lib/practical-store";
import { useLegato } from "@/lib/legato-state";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/ceremony")({
  head: () => legatoHead("Organiser la cérémonie", "Les décisions à prendre, dans l'ordre et à votre rythme."),
  component: Ceremony,
});
const LABELS = ["Choisir les pompes funèbres", "Inhumation ou crémation", "Le lieu et la date", "Les détails : fleurs, textes, musique", "Prévenir les proches"];
function Ceremony() {
  const { state, plan, update, decisions } = useCeremonyPlan();
  const { situation, stage, lovedOneRelation, hydrated } = useLegato();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<number | null>(null);
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const completed = decisions.filter(Boolean).length;
  const next = decisions.findIndex(d => !d);
  const open = (i: number) => {
    if (i === 0) { navigate({ to: "/resources/$category", params: { category: "pompes" } }); return; }
    if (i === 3) { navigate({ to: "/practical/atmosphere" }); return; }
    if (i === 4) { navigate({ to: "/practical/share" }); return; }
    setVenue(state.ceremonyVenue); setDate(plan.date); setEditing(i);
  };
  const notPriority = hydrated && (lovedOneRelation === "animal" || (situation !== "volontes" && ["obseques_passees", "demarches", "apres"].includes(stage ?? "")));
  return <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
    {notPriority ? <>
      <PageTitle space="practical" className="mt-[30px]">Cette étape n'est pas prioritaire dans votre parcours.</PageTitle>
      <TextLink space="practical" to="/care/memory" className="mt-6 inline-block">Créer un hommage symbolique</TextLink>
    </> : <>
      <PageTitle space="practical" size={36} className="mt-[30px]">Organiser<br /><em>la cérémonie.</em></PageTitle>
      <Lead space="practical" className="mt-3">Les décisions à prendre, dans l'ordre. Rien ne vous oblige à tout faire vous-même.</Lead>
      <SectionLabel space="practical" accent className="mt-7">Les décisions · {completed} sur 5</SectionLabel>
      <div className="mt-0.5">
        {LABELS.map((label, i) => <TextLink key={label} space="practical" onClick={() => open(i)} className={`lg-decision ${i === 4 ? "lg-decision-last" : ""}`}>
          <span className={`lg-decision-check ${decisions[i] ? "is-done" : ""}`}>{decisions[i] && <Check size={16} strokeWidth={1.6} />}</span>
          <span className={decisions[i] ? "line-through text-lg-sub" : ""}>{label}</span>
        </TextLink>)}
      </div>
      {editing === 1 && <section className="mt-5 space-y-2">
        <SectionLabel space="practical">Inhumation ou crémation</SectionLabel>
        {[["inhumation", "Inhumation"], ["cremation", "Crémation"]].map(([id, label]) => <OptionCard key={id} space="practical" label={label} selected={state.ceremonyKind === id} onClick={() => { savePractical({ ceremonyKind: id }); setEditing(null); }} />)}
        <TextLink space="practical" onClick={() => setEditing(null)}>Revenir</TextLink>
      </section>}
      {editing === 2 && <section className="mt-5 space-y-5">
        <Field space="practical" label="Le lieu" value={venue} onChange={e => setVenue(e.target.value)} placeholder="Une église, un jardin, la maison…" />
        <Field space="practical" label="La date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <PrimaryButton space="practical" disabled={!venue.trim() || !date} onClick={() => { savePractical({ ceremonyVenue: venue.trim() }); update({ date }); setEditing(null); }}>Enregistrer</PrimaryButton>
        <TextLink space="practical" className="ml-5" onClick={() => setEditing(null)}>Revenir</TextLink>
      </section>}
      {editing === null && <PrimaryButton space="practical" className="mt-6" onClick={() => open(next < 0 ? 3 : next)}>{next < 0 ? "Revoir les détails" : `Continuer : ${["les pompes funèbres", "inhumation ou crémation", "le lieu et la date", "les détails", "prévenir les proches"][next]}`}</PrimaryButton>}
    </>}
  </StandardLayout>;
}
