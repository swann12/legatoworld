import { createFileRoute } from "@tanstack/react-router";
import { Lead, Spec } from "@/components/legato/ds";
import { MaladeSheet } from "@/components/legato/MaladePractical";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/ajpa")({
  head: () => legatoHead("L'allocation journalière du proche aidant", "Une aide versée par la CAF ou la MSA pour chaque jour de congé de proche aidant."),
  component: Ajpa,
});

/** B058 · L'allocation journalière */
function Ajpa() {
  return (
    <MaladeSheet title={<>L'allocation<br /><em>journalière.</em></>}>
      <Lead className="mt-[10px] max-w-[320px]">Elle compense en partie le salaire que vous ne touchez pas pendant le congé de proche aidant.</Lead>
      <Spec className="mt-7" items={[
        { label: "Versée par", value: "La CAF, ou la MSA" },
        { label: "Quand", value: "Pour chaque jour de congé" },
        { label: "Limite", value: "Un nombre de jours sur toute la carrière" },
      ]} />
      <a href="https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/vie-personnelle/l-allocation-journaliere-du-proche-aidant-ajpa" target="_blank" rel="noreferrer"
        className="mt-8 inline-flex h-12 items-center rounded-full px-7 text-[15px]" style={{ background: "var(--sp-btn-bg)", color: "var(--sp-btn-fg)" }}>Faire la demande en ligne</a>
    </MaladeSheet>
  );
}
