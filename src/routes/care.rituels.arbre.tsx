import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageTitle, Lead, PrimaryButton, Spec } from "@/components/legato/ds";
import { RitualsLayout, NumberedSteps } from "@/components/legato/RitualsUI";
import { addMyRitual } from "@/lib/my-rituals";
import { useMemoryPerson } from "@/components/legato/MemoryUI";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/arbre")({
  head: () => legatoHead("Planter un arbre", "Un geste de mémoire vivante, à faire seul ou à plusieurs."),
  component: Arbre,
});

/** B100 · Planter un arbre */
function Arbre() {
  const navigate = useNavigate();
  const { name } = useMemoryPerson();
  return (
    <RitualsLayout>
      <PageTitle className="pt-8">Planter un arbre<br /><em>pour {name}.</em></PageTitle>
      <Lead className="mt-3">Un geste de mémoire vivante, à faire seul ou à plusieurs.</Lead>
      <Spec className="mt-7" items={[{ label: "Quand", value: "Plutôt de novembre à mars" }, { label: "Où", value: "Un jardin, ou une forêt partenaire" }]} />
      <NumberedSteps title="Choisir l'arbre" items={["Un arbre qu'elle aimait, ou qui vous la rappelle.", "Un arbre adapté à votre région : demandez conseil à une pépinière."]} />
      <div className="mt-8"><PrimaryButton onClick={() => { addMyRitual({ title: "Planter un arbre", sub: "Projet · de novembre à mars", done: false }); navigate({ to: "/care/rituels/mes-rituels" }); }}>Garder ce projet</PrimaryButton></div>
    </RitualsLayout>
  );
}
