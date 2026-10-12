import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { StandardLayout, PageTitle, Lead, PrimaryButton, TextLink } from "@/components/legato/ds";
import { findDemarche, longDate, type Demarche } from "@/lib/demarches";
import { useLegato } from "@/lib/legato-state";
import { getDeathDate } from "@/lib/onboarding-flow";

export const Route = createFileRoute("/practical/tasks/$id/template")({
  head: () => ({
    meta: [
      { title: "Modèle de courrier — Legato" },
      { name: "description", content: "Un courrier prêt à envoyer, rempli pour vous. Vous vérifiez avant d'envoyer." },
      { property: "og:title", content: "Modèle de courrier — Legato" },
      { property: "og:description", content: "Un courrier prêt à envoyer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Template,
});

const Hl = ({ children }: { children: ReactNode }) => (
  <span className="px-1.5 py-0.5" style={{ background: "var(--lg-blue)", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{children}</span>
);

function Template() {
  const { id } = Route.useParams();
  const { lostName, name } = useLegato();
  const [d, setD] = useState<Demarche | undefined>(() => findDemarche(id));
  const [date, setDate] = useState("");
  useEffect(() => { setD(findDemarche(id)); setDate(longDate(getDeathDate() ?? "")); }, [id]);

  const letter = d?.letter ?? { to: "l'organisme", ref: "dossier n°", attach: "l'acte de décès" };
  const who = lostName || "…";
  const when = date || "…";
  const plain = [
    "Madame, Monsieur,", "",
    `J'ai le regret de vous informer du décès de ${who}, survenu le ${when}, ${letter.ref} …`, "",
    `Vous trouverez ci-joint ${letter.attach}. Je vous remercie de bien vouloir m'indiquer les démarches à suivre.`, "",
    "Veuillez agréer, Madame, Monsieur, mes salutations distinguées.", "", name || "",
  ].join("\n");
  const title = d ? d.title : (["Courrier", "à envoyer."] as [string, string]);

  const mail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(`Décès de ${who}`)}&body=${encodeURIComponent(plain)}`;
  };
  const pdf = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Courrier</title><style>body{font:15px/1.6 Georgia,serif;max-width:600px;margin:60px auto;white-space:pre-wrap;color:#1d2b25}</style></head><body>${plain.replace(/</g, "&lt;")}</body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  return (
    <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
      <p className="lg-mono pt-8">Modèle de courrier · prêt à envoyer</p>
      <PageTitle space="practical" className="mt-4">{title[0]} <em>{title[1]}</em></PageTitle>

      <div className="mt-8 space-y-6 p-6 text-[15.5px] leading-[1.9]" style={{ background: "var(--lg-linen)" }}>
        <p>Madame, Monsieur,</p>
        <p>J'ai le regret de vous informer du décès de <Hl>{who}</Hl>, survenu le <Hl>{when}</Hl>, {letter.ref} <Hl>…</Hl></p>
        <p>Vous trouverez ci-joint {letter.attach}…</p>
      </div>
      <Lead space="practical" className="mt-6">Les passages surlignés sont remplis pour vous. Vérifiez-les avant d'envoyer.</Lead>

      <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5">
        <PrimaryButton space="practical" onClick={mail}>Envoyer par e-mail</PrimaryButton>
        <TextLink space="practical" onClick={pdf}>Télécharger en PDF</TextLink>
      </div>
    </StandardLayout>
  );
}
