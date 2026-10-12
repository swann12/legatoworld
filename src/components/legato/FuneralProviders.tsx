import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, Lead, Spec, PrimaryButton, TextLink } from "@/components/legato/ds";
import { providersByCategory, type Provider } from "@/lib/resources-data";
import { useCeremonyPlan } from "@/lib/ceremony-flow";

export function FuneralProviders() {
  const examples = providersByCategory("pompes").filter(p => p.example);
  return <StandardLayout space="practical" back="/practical/ceremony" backLabel="La cérémonie" activeTab="/practical">
    <PageTitle space="practical" className="mt-[30px]">Pompes funèbres<br /><em>près de chez vous.</em></PageTitle>
    <Lead space="practical" className="mt-3">Les prix viennent des devis publiés. Comparez sans vous presser.</Lead>
    <div className="mt-[14px]">
      {examples.map(p => <Link key={p.id} to="/resources/$category/$providerId" params={{ category: "pompes", providerId: p.id }} className="lg-provider-list">
        <span className="min-w-0 flex-1"><span className="lg-row-title block">{p.firstName} {p.lastName}</span><span className="lg-row-sub mt-[7px] block">{p.distance}{p.speciality ? ` · ${p.speciality}` : ""}</span></span>
        <span className="shrink-0 text-right"><span className="lg-provider-price block">{p.price}</span><span className="lg-mono mt-2 block">Devis</span></span>
      </Link>)}
    </div>
    <div className="mt-5 bg-lg-linen px-5 py-4 text-[14px] leading-[1.55]">Crémation simple à Marseille : <span className="text-lg-coral-text">3 200 € en moyenne.</span></div>
    <p className="lg-row-sub mt-5">Exemples de la maquette : coordonnées, distances et tarifs non vérifiés.</p>
  </StandardLayout>;
}
export function FuneralProvider({ provider: p }: { provider: Provider }) {
  const [notice, setNotice] = useState("");
  const { update } = useCeremonyPlan();
  const requestQuote = () => {
    if (!p.email) { setNotice("Ce prestataire n'a pas encore de contact vérifié. Aucune demande n'a été envoyée."); return; }
    update({ providerId: p.id });
    window.location.href = `mailto:${p.email}?subject=${encodeURIComponent("Demande de devis obsèques")}&body=${encodeURIComponent(`Bonjour,\n\nJe souhaite recevoir un devis détaillé pour : ${p.estimateDescription ?? p.speciality}.\nMontant indicatif : ${p.estimate?.total ?? "sur demande"}.\n\nMerci.`)}`;
  };
  return <StandardLayout space="practical" back="/resources/pompes" backLabel="Pompes funèbres" activeTab="/practical">
    <p className="lg-mono mt-[30px]">Pompes funèbres{p.distance ? ` · ${p.distance}` : ""}</p>
    <PageTitle space="practical" className="mt-3">{p.firstName}<br /><em>{p.lastName}.</em></PageTitle>
    <Spec space="practical" className="lg-provider-spec mt-6" items={[
      { label: "Horaires", value: p.hours ?? "À confirmer" }, { label: "Adresse", value: p.address ?? p.city }, { label: "Se déplace", value: p.travel ?? p.modes.join(", ") },
    ]} />
    <section className="mt-[22px] bg-lg-linen px-[22px] py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3"><h2 className="font-lg-serif text-[17px] italic">Total estimé —</h2><p className="font-lg-serif text-[30px]">{p.estimate?.total ?? p.offers[0]?.price ?? "Sur demande"}</p></div>
      <p className="mt-3 text-[14px] leading-[1.55]">{p.estimateDescription ?? p.speciality}</p>
    </section>
    <div className="mt-[26px] flex flex-wrap items-center gap-[22px]">
      <PrimaryButton space="practical" onClick={requestQuote}>Demander ce devis</PrimaryButton>
      <TextLink space="practical" onClick={() => p.phone ? window.location.assign(`tel:${p.phone}`) : setNotice("Aucun numéro vérifié n'est disponible pour ce prestataire.")}>Appeler</TextLink>
    </div>
    {p.example && <p className="lg-row-sub mt-5">Exemple de la maquette, coordonnées et devis non vérifiés.</p>}
    {notice && <p role="status" className="lg-lead mt-5">{notice}</p>}
  </StandardLayout>;
}
