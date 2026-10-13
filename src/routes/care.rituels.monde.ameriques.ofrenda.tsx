import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";
import { RitualsLayout, NumberedSteps } from "@/components/legato/RitualsUI";
import { addMyRitual } from "@/lib/my-rituals";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/monde/ameriques/ofrenda")({
  head: () => legatoHead("Faire une ofrenda chez vous", "Pour le Jour des morts, dresser un autel pour accueillir ceux qui sont partis."),
  component: Ofrenda,
});

/** B110 · Faire une ofrenda */
function Ofrenda() {
  const navigate = useNavigate();
  const plan = () => {
    const now = new Date();
    const y = now > new Date(now.getFullYear(), 10, 2) ? now.getFullYear() + 1 : now.getFullYear();
    addMyRitual({ title: "Une ofrenda", date: `${y}-11-02`, sub: "Le Jour des morts · chez vous", done: false });
    toast.success("Prévu pour le 2 novembre.");
    navigate({ to: "/care/rituels/mes-rituels" });
  };
  return (
    <RitualsLayout back="/care/rituels/monde/ameriques" backLabel="Amériques">
      <p className="lg-mono pt-8">Mexique · 1er et 2 novembre</p>
      <PageTitle className="mt-3">Faire une ofrenda,<br /><em>chez vous.</em></PageTitle>
      <Lead className="mt-3">Pour le Jour des morts, on dresse un autel pour accueillir ceux qui sont partis : leur photo, ce qu'ils aimaient, des fleurs orange, des bougies.</Lead>
      <NumberedSteps title="Comment faire" items={["Posez sa photo, et un objet qui lui ressemble.", "Ajoutez ce qu'elle aimait manger ou boire.", "Allumez une bougie, et dites son prénom à voix haute."]} />
      <div className="mt-8"><PrimaryButton onClick={plan}>Le prévoir pour le 2 novembre</PrimaryButton></div>
    </RitualsLayout>
  );
}
