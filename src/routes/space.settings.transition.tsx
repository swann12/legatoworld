import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { StandardLayout, PageTitle, Lead, SectionLabel, PrimaryButton, TextLink } from "@/components/legato/ds";
import { useActiveSpace } from "@/lib/use-active-space";
import { useSpaces } from "@/lib/spaces-store";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/space/settings/transition")({
  head: () => legatoHead("Si elle est décédée", "Transformer l'espace d'accompagnement en espace de deuil, en gardant tout ce qu'il contient."),
  component: Transition,
});

/** B067 · Si elle est décédée */
function Transition() {
  const navigate = useNavigate();
  const { space } = useActiveSpace();
  const { updateSpace } = useSpaces();
  const name = space?.name ?? "votre proche";
  const transform = () => {
    if (!space) return;
    updateSpace(space.id, { kind: "deuil", careState: undefined });
    toast("L'espace est devenu un espace de deuil. Rien n'a été effacé.");
    navigate({ to: "/home" });
  };
  return (
    <StandardLayout back="/space/settings" backLabel="Réglages de l'espace" activeTab="/home">
      <PageTitle className="pt-8">Si {name}<br /><em>est décédée.</em></PageTitle>
      <Lead className="mt-3">Nous sommes désolés. Quand vous serez prêt, cet espace peut devenir un espace de deuil : soutien, démarches après le décès, mémoire.</Lead>
      <SectionLabel className="mt-7">Ce qui sera gardé</SectionLabel>
      <p className="mt-2 text-[15px]">Le carnet, vos notes, ses volontés, les souvenirs et votre cercle.</p>
      <div className="mt-8"><PrimaryButton onClick={transform} disabled={!space}>Transformer l'espace</PrimaryButton></div>
      <div className="mt-5"><TextLink to="/home">Plus tard</TextLink></div>
    </StandardLayout>
  );
}
