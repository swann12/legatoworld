import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, Lead, PrimaryButton, TextLink } from "@/components/legato/ds";
import { GroupeCheck } from "@/components/legato/shared-pages";
import { useSavedToast } from "@/components/legato/ActionFeedback";
import { useActiveSpace } from "@/lib/use-active-space";
import { legatoHead } from "@/lib/legato-head";

/** D010 · x-prevenir : choisir qui prévenir, un seul message à relire. */
export const Route = createFileRoute("/practical/prevenir")({
  head: () => legatoHead("Prévenir les proches", "Choisir qui prévenir et relire un seul message avant de l'envoyer."),
  component: Prevenir,
});

const GROUPES = [
  { id: "famille", label: "La famille", count: "6 personnes" },
  { id: "amis", label: "Les amis proches", count: "12 personnes" },
  { id: "travail", label: "Son travail", count: "4 personnes" },
  { id: "voisins", label: "Les voisins", count: "2 personnes" },
];

function Prevenir() {
  const navigate = useNavigate();
  const { space } = useActiveSpace();
  const { show, toast } = useSavedToast();
  const [checked, setChecked] = useState<Record<string, boolean>>({ famille: true, amis: true });
  const name = space?.name ?? "Anne";
  const texte = `Je voulais vous prévenir moi-même : ${name} nous a quittés. Merci d'être là.`;
  const destinataires = GROUPES.filter((g) => checked[g.id]).map((g) => g.label);

  return (
    <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
      <PageTitle space="practical" className="pt-6">Prévenir<br /><em>les proches.</em></PageTitle>
      <Lead className="mt-2 max-w-[310px]">Choisissez qui prévenir. Un seul message, que vous pouvez relire avant.</Lead>
      <div className="mt-3">
        {GROUPES.map((g, i) => (
          <GroupeCheck key={g.id} label={g.label} count={g.count} last={i === GROUPES.length - 1}
            checked={!!checked[g.id]} onToggle={() => setChecked((c) => ({ ...c, [g.id]: !c[g.id] }))} />
        ))}
      </div>
      <div className="mt-6">
        <TextLink space="practical" onClick={() => show("L'import des contacts arrive avec l'envoi réel.")}>Importer mes contacts</TextLink>
      </div>
      <div className="mt-6">
        <PrimaryButton space="practical" disabled={destinataires.length === 0}
          onClick={() => navigate({ to: "/partage/message", search: { destinataires: destinataires.join(","), texte } })}>
          Voir le message
        </PrimaryButton>
      </div>
      {toast}
    </StandardLayout>
  );
}
