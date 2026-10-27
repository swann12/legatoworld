import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Spec, PrimaryButton, TextLink, SectionLabel, Tip, EnClair } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

/** D055 · so-psy-rembourse : un psychologue remboursé */
export const Route = createFileRoute("/care/parler/psychologue")({
  head: () => legatoHead("Un psychologue remboursé", "Le dispositif public « Mon soutien psy » : séances, prix, remboursement, et comment prendre rendez-vous."),
  component: Psy,
});

const MESSAGE = "« Bonjour, je souhaiterais prendre rendez-vous dans le cadre du dispositif Mon soutien psy. Je traverse un deuil. Quelles sont vos disponibilités ? Merci. »";

function Psy() {
  return (
    <StandardLayout space="support" back="/care/parler" backLabel="Parler à quelqu'un" activeTab="/care">
      <PageTitle space="support" className="pt-[22px]">Un psychologue,<br /><em>remboursé.</em></PageTitle>
      <Lead className="mt-2 max-w-[310px]">Le dispositif public « Mon soutien psy ». Vous n'avez pas besoin d'aller « très mal » pour y avoir droit.</Lead>

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
      </div>

      <SectionLabel space="support" className="mt-10">Prendre rendez-vous, pas à pas</SectionLabel>
      <div className="mt-1">
        <Tip space="support" n={1}>Cherchez un psychologue partenaire par code postal. Beaucoup proposent aussi des séances en vidéo.</Tip>
        <Tip space="support" n={2}>Appelez ou envoyez le message prêt ci-dessous. Dites simplement : « dans le cadre de Mon soutien psy ».</Tip>
        <Tip space="support" n={3}>Le jour venu, apportez votre carte Vitale. Vous payez souvent moins, ou rien, si votre mutuelle complète.</Tip>
        <Tip space="support" n={4} last>Si le premier contact ne vous convient pas, vous pouvez en essayer un autre. C'est normal.</Tip>
      </div>
      <TextLink space="support" className="mt-2" to="/partage/message" search={{ destinataires: "Le psychologue", texte: MESSAGE }}>
        Un message prêt pour prendre rendez-vous
      </TextLink>

      <SectionLabel space="support" className="mt-10">La première séance</SectionLabel>
      <Lead className="mt-3 max-w-[330px]">
        Elle sert surtout à faire connaissance. Vous racontez ce que vous voulez, à votre rythme. Vous pouvez ne rien préparer, ou noter deux ou trois choses qui pèsent en ce moment.
      </Lead>

      <EnClair space="support" className="mt-8">
        Si aucun rendez-vous n'est possible avant longtemps, votre médecin traitant peut aussi vous écouter et vous orienter.
      </EnClair>

      <p className="lg-mono mt-8" style={{ color: "var(--sp-sub)" }}>Source : ameli.fr, info.gouv.fr · vérifié<br />en octobre 2026</p>
    </StandardLayout>
  );
}
