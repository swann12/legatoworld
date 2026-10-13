import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Spec, TextLink, OutlineButton } from "@/components/legato/ds";
import { Steps } from "@/components/legato/AnimalPractical";
import { MaladeSheet } from "@/components/legato/MaladePractical";
import { useActiveSpace } from "@/lib/use-active-space";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/conge-aidant")({
  head: () => legatoHead("Le congé de proche aidant", "Arrêter ou réduire votre travail pour accompagner un proche : durée, revenu et étapes."),
  component: Conge,
});

/** B057 · Congé de proche aidant */
function Conge() {
  const { space } = useActiveSpace();
  const [open, setOpen] = useState(false);
  const letter = `Madame, Monsieur,\n\nJe vous informe de mon souhait de bénéficier d'un congé de proche aidant (articles L3142-16 et suivants du Code du travail) afin d'accompagner ${space?.name ?? "un proche"}, à compter du [date], pour une durée de [durée].\n\nVous trouverez ci-joint le justificatif de sa situation.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Votre nom]`;
  return (
    <MaladeSheet eyebrow="Pour les salariés" title={<>Le congé<br /><em>de proche aidant.</em></>}>
      <Spec className="mt-7" items={[
        { label: "Durée", value: "Jusqu'à 3 mois, renouvelable" },
        { label: "Au total", value: "1 an au plus sur la carrière" },
        { label: "Revenu", value: "Allocation versée par la CAF ou la MSA" },
      ]} />
      <Steps id="malade-conge" fill="var(--sp-accent)" label={(n) => `Les étapes · ${n} sur 3`} steps={["Prévenir votre employeur, en général un mois avant", "Joindre un justificatif de sa situation", "Demander l'allocation à la CAF ou à la MSA"]} />
      <div className="mt-6"><TextLink onClick={() => setOpen((o) => !o)}>Préparer la lettre à l'employeur</TextLink></div>
      {open && <div className="mt-5 p-5" style={{ background: "var(--sp-block)" }}>
        <pre className="whitespace-pre-wrap text-[14px]" style={{ fontFamily: "var(--lg-sans)" }}>{letter}</pre>
        <div className="mt-4"><OutlineButton onClick={() => { void navigator.clipboard?.writeText(letter); toast.success("Lettre copiée."); }}>Copier la lettre</OutlineButton></div>
      </div>}
    </MaladeSheet>
  );
}
