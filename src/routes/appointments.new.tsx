import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, Field, OptionCard, PrimaryButton } from "@/components/legato/ds";
import { addAppointment, IMPORTANCE, type Importance } from "@/lib/appointments-store";

export const Route = createFileRoute("/appointments/new")({
  head: () => ({
    meta: [
      { title: "Ajouter un rendez-vous — Legato" },
      { name: "description", content: "Noter un rendez-vous et dire s'il peut être reporté." },
      { property: "og:title", content: "Ajouter un rendez-vous — Legato" },
      { property: "og:description", content: "Avec qui, quand, et si vous n'êtes pas en état ce jour-là." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Nouveau,
});

function Nouveau() {
  const navigate = useNavigate();
  const [who, setWho] = useState("");
  const [when, setWhen] = useState("");
  const [imp, setImp] = useState<Importance>("maintenir");

  const save = () => {
    addAppointment({ who: who.trim(), date: new Date(when).toISOString(), importance: imp });
    navigate({ to: "/appointments" });
  };

  return (
    <StandardLayout space="support" back="/appointments" backLabel="Vos rendez-vous" activeTab="/care">
      <PageTitle space="support" className="mt-12">Ajouter<br /><em>un rendez-vous.</em></PageTitle>
      <Field space="support" className="mt-8" label="Avec qui" placeholder="Maître Blanc, notaire" value={who} onChange={(e) => setWho(e.target.value)} />
      <Field space="support" className="mt-6" label="Quand" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
      <p className="lg-mono mt-8">Si vous n'êtes pas en état ce jour-là</p>
      <div className="mt-3 space-y-2.5">
        {(Object.keys(IMPORTANCE) as Importance[]).map((k) => (
          <OptionCard key={k} space="support" label={IMPORTANCE[k].label} hint={IMPORTANCE[k].hint} selected={imp === k} onClick={() => setImp(k)} />
        ))}
      </div>
      <PrimaryButton space="support" className="mt-7" onClick={save} disabled={!who.trim() || !when}>Enregistrer</PrimaryButton>
    </StandardLayout>
  );
}
