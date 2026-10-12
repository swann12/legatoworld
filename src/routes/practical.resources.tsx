import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { StandardLayout, PageTitle, Lead } from "@/components/legato/ds";

export const Route = createFileRoute("/practical/resources")({
  head: () => ({
    meta: [
      { title: "Repères — Legato" },
      { name: "description", content: "Succession, banque, assurances, employeur, aides : ce qu'il faut savoir avant chaque démarche." },
      { property: "og:title", content: "Repères — Legato" },
      { property: "og:description", content: "Repères, expliqués simplement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reperes,
});

const TOPICS = [
  { title: "La succession", sub: "Le rôle du notaire, les délais, les frais",
    body: "Le notaire n'est obligatoire que s'il y a un bien immobilier ou au-delà de 5 000 €. La déclaration de succession se fait dans les six mois. Le premier rendez-vous sert surtout à faire le point.", task: "notaire" },
  { title: "La banque", sub: "Comptes bloqués, comptes joints",
    body: "Les comptes personnels sont bloqués dès que la banque est prévenue. Le compte joint reste souvent utilisable. Les frais d'obsèques peuvent être payés depuis le compte du défunt, sur facture.", task: "banque" },
  { title: "Les assurances", sub: "Assurance-vie, mutuelle, résiliations",
    body: "Prévenez l'assurance habitation, l'auto et la mutuelle. Vérifiez s'il existait un contrat obsèques, une assurance-vie ou une assurance liée à un prêt.", task: "mutuelle" },
  { title: "L'employeur", sub: "Salaire dû, capital décès",
    body: "L'employeur verse le salaire dû et les congés non pris. Un capital décès peut exister selon la convention collective. Vous avez aussi droit à des jours d'absence pour deuil.", task: "employeur" },
  { title: "Aides et droits", sub: "Pension de réversion, aides possibles",
    body: "Selon votre situation : pension de réversion, capital décès de la Sécurité sociale, allocation veuvage. Chaque organisme demande un acte de décès.", task: "retraite" },
];

function Reperes() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
      <PageTitle space="practical" className="pt-8">Repères,<br /><em>expliqués simplement.</em></PageTitle>
      <Lead space="practical" className="mt-4">Ce qu'il faut savoir avant chaque démarche.</Lead>
      <ul className="mt-8">
        {TOPICS.map((t, i) => {
          const on = open === i;
          return (
            <li key={t.title} style={{ borderBottom: i < TOPICS.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
              <button type="button" onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="flex w-full items-center gap-4 py-[18px] text-left">
                <span className="flex-1">
                  <span className="lg-row-title block">{t.title}</span>
                  <span className="lg-row-sub mt-1 block" style={{ color: "var(--sp-sub)" }}>{t.sub}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 transition-transform" strokeWidth={1.3} style={{ transform: on ? "rotate(90deg)" : undefined }} />
              </button>
              {on && (
                <div className="pb-6">
                  <p className="text-[15px] leading-[1.6]">{t.body}</p>
                  <Link to="/practical/tasks/$id" params={{ id: t.task }} className="mt-4 inline-block text-[13.5px] underline underline-offset-4">Ouvrir la démarche</Link>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </StandardLayout>
  );
}
