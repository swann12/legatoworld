import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExperienceLayout } from "@/components/legato/ds";
import { useSavedToast } from "@/components/legato/ActionFeedback";
import { legatoHead } from "@/lib/legato-head";

/** D020 · Le corps · exercice du soir (plein écran) */
export const Route = createFileRoute("/help/corps/exercice")({
  head: () => legatoHead("L'exercice du soir", "Éteignez les écrans, baissez la lumière. Prenez le temps qu'il faut."),
  component: Exercice,
});

function Exercice() {
  const navigate = useNavigate();
  const { show, toast } = useSavedToast();
  const leave = () => navigate({ to: "/help/corps" });
  const done = () => { show("C'est noté."); window.setTimeout(leave, 1200); };

  return (
    <ExperienceLayout back="/help/corps" backLabel="Le corps" onClose={leave}
      action={
        <div className="flex flex-col items-center gap-5">
          <button type="button" onClick={done}
            className="h-[52px] rounded-full px-[34px] text-[15px]"
            style={{ background: "color-mix(in oklab, var(--lg-cream) 88%, var(--lg-mint))", color: "var(--lg-deep)" }}>
            C'est fait
          </button>
          <button type="button" onClick={leave} className="text-[14px] underline underline-offset-4" style={{ color: "var(--lg-cream)" }}>
            Arrêter
          </button>
        </div>
      }>
      <div style={{ color: "var(--lg-deep)" }}>
        <h1 className="lg-title lg-ds-title" style={{ fontSize: 34 }}>Éteignez les écrans,<br /><em>baissez la lumière.</em></h1>
        <p className="mt-5 text-[15px]" style={{ opacity: 0.75 }}>Prenez le temps qu'il faut.</p>
      </div>
      {toast}
    </ExperienceLayout>
  );
}
