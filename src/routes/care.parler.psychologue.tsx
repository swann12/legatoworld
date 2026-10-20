import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Spec, PrimaryButton, TextLink } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

/** D055 · so-psy-rembourse : un psychologue remboursé */
export const Route = createFileRoute("/care/parler/psychologue")({
  head: () => legatoHead("Un psychologue remboursé", "Le dispositif public « Mon soutien psy » : séances, prix, remboursement."),
  component: Psy,
});

function Psy() {
  return (
    <StandardLayout space="support" back="/care/parler" backLabel="Parler à quelqu'un" activeTab="/care">
      <PageTitle space="support" className="pt-[22px]">Un psychologue,<br /><em>remboursé.</em></PageTitle>
      <Lead className="mt-2 max-w-[310px]">Le dispositif public « Mon soutien psy ».</Lead>
      <Spec space="support" className="mt-5" items={[
        { label: "Séances", value: "jusqu'à 12 par an" },
        { label: "Prix", value: "50 € la séance" },
        { label: "Remboursé", value: <>60 % par l'Assurance maladie,<br />le reste par votre mutuelle</> },
        { label: "Ordonnance", value: "pas nécessaire" },
      ]} />
      <div className="flex flex-col items-start gap-4 pt-6">
        <PrimaryButton space="support" to="/partage/site-officiel" search={{
          site: "monsoutienpsy.ameli.fr",
          url: "https://monsoutienpsy.ameli.fr/recherche-psychologue",
          papiers: "Votre carte Vitale|Votre code postal",
          duree: "environ 5 minutes",
        }}>Trouver un psychologue près de chez moi</PrimaryButton>
        <TextLink space="support" to="/partage/message" search={{
          destinataires: "Le psychologue",
          texte: "« Bonjour, je souhaiterais prendre rendez-vous dans le cadre du dispositif Mon soutien psy. Je traverse un deuil. Quelles sont vos disponibilités ? Merci. »",
        }}>Un message prêt pour prendre rendez-vous</TextLink>
      </div>
      <p className="lg-mono mt-8" style={{ color: "var(--sp-sub)" }}>Source : ameli.fr, info.gouv.fr · vérifié<br />en octobre 2026</p>
    </StandardLayout>
  );
}
