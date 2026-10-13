import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, SectionLabel, PrimaryButton, TextLink } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/epuisement")({
  head: () => legatoHead("Si vous n'en pouvez plus", "Les signes de l'épuisement de l'aidant, et ce qui aide à souffler."),
  component: Epuisement,
});

const TIPS = [
  "Demandez un relais à un proche, même pour une demi-journée.",
  "Renseignez-vous sur l'accueil de jour ou le répit à domicile.",
  "Parlez-en à votre médecin : l'épuisement se soigne aussi.",
];

/** B055 · L'épuisement */
function Epuisement() {
  return (
    <StandardLayout space="care" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="care" className="pt-8">Si vous<br /><em>n'en pouvez plus.</em></PageTitle>
      <Lead className="mt-3">Fatigue, irritabilité, sommeil difficile, envie de tout lâcher : ce sont des signes d'épuisement. Ce n'est pas un échec.</Lead>
      <SectionLabel className="mt-7">Ce qui aide</SectionLabel>
      {TIPS.map((t, i) => (
        <div key={t} className="flex gap-4 py-4" style={{ borderBottom: "1px solid var(--sp-line)" }}>
          <span className="lg-title" style={{ fontSize: 24, color: "var(--sp-accent)" }}>{i + 1}</span><p className="text-[15px]">{t}</p>
        </div>
      ))}
      <div className="mt-8"><PrimaryButton space="care" to="/home/equipe">Organiser un relais</PrimaryButton></div>
      <div className="mt-5"><TextLink space="care" to="/practical">Vos droits d'aidant</TextLink></div>
    </StandardLayout>
  );
}
