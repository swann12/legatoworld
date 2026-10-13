import { createFileRoute } from "@tanstack/react-router";
import { Lead } from "@/components/legato/ds";
import { SectionTitle } from "@/components/legato/AnimalPractical";
import { MaladeSheet, Numbered } from "@/components/legato/MaladePractical";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/aide-domicile")({
  head: () => legatoHead("Une aide à domicile", "Les pistes pour qu'un proche malade soit aidé chez lui, et pour vous soulager."),
  component: AideDomicile,
});

/** B059 · Une aide à domicile */
function AideDomicile() {
  return (
    <MaladeSheet title={<>Une aide<br /><em>à domicile.</em></>}>
      <Lead className="mt-[10px] max-w-[320px]">Pour qu'elle soit aidée chez elle, et pour vous soulager.</Lead>
      <SectionTitle className="mt-8">Les pistes</SectionTitle>
      <Numbered items={[
        "Le centre communal d'action sociale de sa commune : il oriente vers les services d'aide.",
        "Si elle a plus de 60 ans : l'allocation personnalisée d'autonomie, demandée au département.",
        "Avec son médecin : des soins à domicile, ou l'hospitalisation à domicile.",
      ]} />
    </MaladeSheet>
  );
}
