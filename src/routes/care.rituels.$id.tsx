import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageTitle, Lead, PrimaryButton, TextLink } from "@/components/legato/ds";
import { RitualsLayout, NumberedSteps } from "@/components/legato/RitualsUI";
import { findGesture } from "@/lib/rituals-catalog";
import { PROPOSALS_KEY } from "./care.rituels.propositions";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/$id")({
  head: () => legatoHead("Un rituel", "D'où vient ce rituel et comment le faire, seul ou avec des proches."),
  component: Fiche,
});

type Sheet = { eyebrow: string; title: string; text: string; steps: string[]; now?: string };
const modeLabel = { seul: "Seul", plusieurs: "À plusieurs", "les deux": "Seul ou à plusieurs" } as const;

/** B096 · Fiche d'un rituel (gestes du catalogue, ou propositions de Présence) */
function Fiche() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<Sheet | null>(null);
  useEffect(() => {
    const g = findGesture(id);
    if (g) { setSheet({ eyebrow: [g.origin.split(" · ")[0], modeLabel[g.mode], g.duration.replace(/min$/, "minutes")].join(" · "), title: g.title, text: g.text, steps: g.steps, now: id === "lanterne" ? "/care/rituels/lantern" : undefined }); return; }
    const m = /^p(\d)$/.exec(id);
    if (m) {
      try {
        const r = JSON.parse(window.sessionStorage.getItem(PROPOSALS_KEY) || "[]")[Number(m[1])];
        if (r) setSheet({ eyebrow: `${r.origin} · ${r.durationMin} minutes`, title: r.title, text: r.originDetail, steps: [r.whisper] });
      } catch { /* rien */ }
    }
  }, [id]);
  const words = sheet?.title.split(" ") ?? [];
  const cut = Math.ceil(words.length / 2);
  return (
    <RitualsLayout>
      {!sheet ? <PageTitle className="pt-8">Ce rituel<br /><em>n'est plus disponible.</em></PageTitle> : <>
        <p className="lg-mono pt-8">{sheet.eyebrow}</p>
        <PageTitle className="mt-3">{words.slice(0, cut).join(" ")}<br /><em>{words.slice(cut).join(" ")}.</em></PageTitle>
        <Lead className="mt-3">{sheet.text}</Lead>
        {sheet.steps.length > 0 && <NumberedSteps title="Comment faire" items={sheet.steps} />}
        <div className="mt-8"><PrimaryButton onClick={() => navigate(sheet.now ? { to: sheet.now } : { to: "/care/rituels/fait", search: { geste: id } })}>Le faire maintenant</PrimaryButton></div>
        <div className="mt-5"><TextLink to="/care/rituels/organiser" search={{ rituel: id }}>Le faire avec des proches</TextLink></div>
      </>}
    </RitualsLayout>
  );
}
