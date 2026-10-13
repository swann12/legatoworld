import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PrimaryButton, TextLink } from "@/components/legato/ds";
import { AnimalSheet, Spec, useAnimal } from "@/components/legato/AnimalPractical";
import { insuranceLetter } from "@/lib/animal-demarches";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/animal-insurance")({
  head: () => legatoHead("Prévenir son assurance", "Arrêter le contrat et les prélèvements avec le certificat de décès du vétérinaire."),
  component: Insurance,
});

/** B038 · Prévenir son assurance */
function Insurance() {
  const { name, setTaskStatus } = useAnimal();
  const [open, setOpen] = useState(false);
  const letter = insuranceLetter(name);
  const copy = async () => {
    try { await navigator.clipboard.writeText(letter); toast("Courrier copié."); setTaskStatus("animal-insurance", "done"); } catch { toast("Copie impossible : sélectionnez le texte."); }
  };
  return (
    <AnimalSheet back="/practical" backLabel="Démarches" eyebrow={`Si ${name} était assuré`} title={<>Prévenir<br /><em>son assurance.</em></>}>
      <Spec className="mt-7" items={[
        { label: "Pourquoi", value: "Arrêter le contrat et les prélèvements" },
        { label: "Il vous faut", value: "Le certificat de décès du vétérinaire" },
        { label: "Durée", value: "10 minutes" },
      ]} />
      <div className="pt-7">
        {!open ? <PrimaryButton onClick={() => setOpen(true)}>Utiliser le courrier prêt</PrimaryButton> : <>
          <pre className="whitespace-pre-wrap p-5 text-[14px] leading-[1.6]" style={{ background: "var(--sp-block)", fontFamily: "var(--lg-sans)" }}>{letter}</pre>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            <PrimaryButton onClick={copy}>Copier le courrier</PrimaryButton>
            <TextLink onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent("Résiliation du contrat")}&body=${encodeURIComponent(letter)}`; setTaskStatus("animal-insurance", "done"); }}>L'envoyer par courriel</TextLink>
          </div>
        </>}
      </div>
    </AnimalSheet>
  );
}
