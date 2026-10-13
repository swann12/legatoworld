import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, TagRow } from "@/components/legato/ds";

export const Route = createFileRoute("/practical/animal-body/")({
  head: () => ({
    meta: [
      { title: "Crémation ou enterrement — Legato" },
      { name: "description", content: "Crémation individuelle ou collective, jardin, cimetière animalier : les possibilités pour son corps." },
      { property: "og:title", content: "Crémation ou enterrement — Legato" },
      { property: "og:description", content: "Le vétérinaire peut le garder quelques jours, le temps de décider." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnimalBody,
});

const OPTIONS = [
  { t: "Crémation individuelle", s: "Vous récupérez ses cendres dans une urne", tag: "Sur devis" },
  { t: "Crémation collective", s: "Avec d'autres animaux, sans retour des cendres", tag: "Moins cher" },
  { t: "Enterrement dans votre jardin", s: "Possible sous conditions, voir ci-dessous", tag: "Gratuit" },
  { t: "Cimetière animalier", s: "Une tombe où vous pourrez revenir", tag: "Sur devis" },
];

/** B033 · Crémation ou enterrement (pages détaillées à l'étape suivante). */
function AnimalBody() {
  return (
    <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
      <PageTitle className="pt-[30px]">Crémation<br /><em>ou enterrement.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Le vétérinaire peut le garder quelques jours, le temps de décider.</Lead>
      <div className="mt-6">
        {OPTIONS.map((o, i) => <TagRow key={o.t} title={<><span className="block">{o.t}</span><span className="lg-row-sub mt-1 block text-[13px]" style={{ color: "var(--sp-sub)" }}>{o.s}</span></>} tag={o.tag} last={i === OPTIONS.length - 1} />)}
      </div>
      <p className="mt-6 text-[13px] leading-[1.55]" style={{ color: "var(--sp-sub)" }}>Jardin : en général moins de 40 kg, à plus de 35 m des habitations et des points d'eau. Vérifiez auprès de votre mairie.</p>
    </StandardLayout>
  );
}
