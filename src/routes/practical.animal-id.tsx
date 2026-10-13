import { createFileRoute } from "@tanstack/react-router";
import { AnimalSheet, Spec, Steps, useAnimal } from "@/components/legato/AnimalPractical";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/animal-id")({
  head: () => legatoHead("Déclarer le décès de votre animal", "Auprès du fichier national d'identification (I-CAD), par votre vétérinaire ou en ligne."),
  component: AnimalId,
});

const STEPS = ["Demander au vétérinaire s'il s'en charge", "Sinon, le déclarer en ligne avec son numéro d'identification"];

/** B037 · Déclarer son décès */
function AnimalId() {
  const { name } = useAnimal();
  return (
    <AnimalSheet back="/practical" backLabel="Démarches" eyebrow={`Si ${name} était pucé ou tatoué`} title={<>Déclarer<br /><em>son décès.</em></>}>
      <Spec className="mt-7" items={[
        { label: "Auprès de", value: "Le fichier national d'identification (I-CAD)" },
        { label: "Qui", value: "Votre vétérinaire, ou vous en ligne" },
        { label: "Durée", value: "5 minutes" },
      ]} />
      <Steps id="animal-id" taskId="animal-id" steps={STEPS} label={(n) => `Les étapes · ${n} sur ${STEPS.length}`} />
      <div className="pt-7">
        <a href="https://www.i-cad.fr" target="_blank" rel="noreferrer"
          className="inline-flex h-12 items-center rounded-full px-6 text-[15px]" style={{ background: "var(--sp-btn-bg)", color: "var(--sp-btn-fg)" }}>Ouvrir le site de déclaration</a>
      </div>
    </AnimalSheet>
  );
}
