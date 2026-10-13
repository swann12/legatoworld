import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PageTitle, Lead, SectionLabel, PrimaryButton, OutlineButton, TextLink } from "@/components/legato/ds";
import { RitualsLayout } from "@/components/legato/RitualsUI";
import { useMemoryPerson } from "@/components/legato/MemoryUI";
import { findGesture } from "@/lib/rituals-catalog";
import { addMyRitual, updateMyRitual } from "@/lib/my-rituals";
import { addMemory } from "@/lib/memories-store";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/fait")({
  validateSearch: z.object({ geste: z.string().optional() }),
  head: () => legatoHead("Le geste est fait", "Le geste reste dans son jardin de souvenirs ; vous pouvez le refaire chaque année."),
  component: Fait,
});

/** B102 · Le geste est fait : il est noté dans « Vos rituels » et laisse une trace dans son jardin. */
function Fait() {
  const { geste = "bougie" } = Route.useSearch();
  const { name } = useMemoryPerson();
  const g = findGesture(geste);
  const [id, setId] = useState<string>();
  const [yearly, setYearly] = useState(false);
  useEffect(() => {
    const title = geste === "bougie" ? "Une bougie allumée" : g?.title ?? "Un geste";
    const r = addMyRitual({ title, date: new Date().toISOString().slice(0, 10), sub: g?.mode === "seul" ? "Seul" : undefined, done: true });
    setId(r.id);
    if (geste === "bougie") { try { addMemory({ zone: "lettres", type: "text", title: "Une bougie", body: "Une lumière pour vous, jusqu'à demain matin." }); } catch { /* stockage plein */ } }
  }, [geste]);
  return (
    <RitualsLayout>
      <PageTitle className="pt-8">Le geste<br /><em>est fait.</em></PageTitle>
      <Lead className="mt-3">{geste === "bougie" ? `La bougie restera allumée dans le jardin de ${name} jusqu'à demain matin.` : `Il est noté dans vos rituels, et dans le jardin de ${name}.`}</Lead>
      <SectionLabel className="mt-7">Si vous le souhaitez</SectionLabel>
      <p className="mt-2 text-[15px]">Ajouter quelques mots, ou refaire ce geste chaque année à la même date.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <OutlineButton to="/care/rituels/candle" search={{ view: "mots" }}>Ajouter quelques mots</OutlineButton>
        <OutlineButton disabled={yearly} onClick={() => { if (id) updateMyRitual(id, { yearly: true }); setYearly(true); toast.success("Ce geste vous sera proposé chaque année à la même date."); }}>{yearly ? "Chaque année" : "Le refaire chaque année"}</OutlineButton>
      </div>
      <div className="mt-8"><PrimaryButton to="/care/garden/space">Revenir à son jardin</PrimaryButton></div>
      <div className="mt-5"><TextLink to="/care/rituels">Rituels</TextLink></div>
    </RitualsLayout>
  );
}
