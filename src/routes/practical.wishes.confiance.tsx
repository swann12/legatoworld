import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Lead, Spec, PrimaryButton, OutlineButton } from "@/components/legato/ds";
import { MaladeSheet } from "@/components/legato/MaladePractical";
import { useActiveSpace } from "@/lib/use-active-space";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/wishes/confiance")({
  head: () => legatoHead("Sa personne de confiance", "Désigner la personne que les médecins consulteront si elle ne peut plus s'exprimer."),
  component: Confiance,
});

/** B061 · Sa personne de confiance */
function Confiance() {
  const { space } = useActiveSpace();
  const [open, setOpen] = useState(false);
  const doc = `Désignation de la personne de confiance\n(article L1111-6 du Code de la santé publique)\n\nJe soussignée, [nom et prénom de ${space?.name ?? "la personne"}], née le [date],\ndésigne comme personne de confiance :\n[nom et prénom], [lien], joignable au [téléphone].\n\nElle pourra m'accompagner dans mes démarches et assister aux entretiens médicaux. Si je ne peux plus exprimer ma volonté, elle sera consultée en priorité.\n\nCette désignation est révocable à tout moment.\n\nFait à [lieu], le [date].\nSignature de la personne : \nSignature de la personne de confiance :`;
  return (
    <MaladeSheet back="/practical/wishes" backLabel="Ses volontés" title={<>Sa personne<br /><em>de confiance.</em></>}>
      <Lead className="mt-[10px] max-w-[320px]">Elle peut l'accompagner aux rendez-vous. Si un jour elle ne peut plus s'exprimer, c'est elle que les médecins consulteront.</Lead>
      <Spec className="mt-7" items={[
        { label: "Qui", value: "Celle qu'elle choisit : vous, ou un autre proche" },
        { label: "Comment", value: "Par écrit, signé par elle" },
        { label: "Changeable", value: "À tout moment" },
      ]} />
      <div className="mt-8"><PrimaryButton onClick={() => setOpen(true)}>Préparer le document</PrimaryButton></div>
      {open && <div className="mt-6 p-5" style={{ background: "var(--sp-block)" }}>
        <pre className="whitespace-pre-wrap text-[14px]" style={{ fontFamily: "var(--lg-sans)" }}>{doc}</pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <OutlineButton onClick={() => { void navigator.clipboard?.writeText(doc); toast.success("Document copié."); }}>Copier</OutlineButton>
          <OutlineButton onClick={() => window.print()}>Imprimer</OutlineButton>
        </div>
      </div>}
    </MaladeSheet>
  );
}
