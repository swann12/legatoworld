import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLegato } from "@/lib/legato-state";
import { StandardLayout, PageTitle, Lead, Field, PrimaryButton } from "@/components/legato/ds";

export const Route = createFileRoute("/care/journal/later")({
  head: () => ({
    meta: [
      { title: "Une lettre pour plus tard — Legato" },
      { name: "description", content: "Écrire une lettre qui restera fermée jusqu'à la date choisie." },
      { property: "og:title", content: "Une lettre pour plus tard — Legato" },
      { property: "og:description", content: "Elle restera fermée jusqu'à la date choisie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Later,
});

function Later() {
  const navigate = useNavigate();
  const { addJournalEntry } = useLegato();
  const [openOn, setOpenOn] = useState("");
  const [forWho, setForWho] = useState("Moi, dans un an");
  const [body, setBody] = useState("");
  const [closed, setClosed] = useState(false);

  useEffect(() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); setOpenOn(d.toISOString().slice(0, 10)); }, []);

  const close = () => {
    addJournalEntry({ body: body.trim(), to: "self", title: `Lettre fermée · à ouvrir le ${new Date(openOn).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · pour ${forWho}` });
    setClosed(true);
    setTimeout(() => navigate({ to: "/care/journal" }), 1400);
  };

  return (
    <StandardLayout space="support" back="/care/journal" backLabel="Écrire" activeTab="/care">
      <PageTitle space="support" className="mt-12">Une lettre<br /><em>pour plus tard.</em></PageTitle>
      <Lead space="support" className="mt-4">Elle restera fermée jusqu'à la date choisie. Vous la redécouvrirez à ce moment-là.</Lead>
      <Field space="support" className="mt-8" label="À ouvrir le" type="date" value={openOn} onChange={(e) => setOpenOn(e.target.value)} />
      <Field space="support" className="mt-6" label="Pour" value={forWho} onChange={(e) => setForWho(e.target.value)} />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Dans un an, j'espère que…" rows={6}
        className="mt-6 w-full resize-none bg-transparent italic outline-none placeholder:opacity-50"
        style={{ fontFamily: "var(--lg-serif)", fontSize: 20, lineHeight: 1.4, color: "var(--sp-ink)" }} />
      <PrimaryButton space="support" className="mt-6" onClick={close} disabled={!body.trim() || !openOn || closed}>
        {closed ? "Lettre fermée" : "Fermer la lettre jusqu'à cette date"}
      </PrimaryButton>
    </StandardLayout>
  );
}
