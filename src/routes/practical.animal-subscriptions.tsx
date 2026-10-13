import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lead, OptionCard, PrimaryButton, TextLink } from "@/components/legato/ds";
import { AnimalSheet, useAnimal } from "@/components/legato/AnimalPractical";
import { SUBSCRIPTIONS, subscriptionMessage } from "@/lib/animal-demarches";
import { loadTaskSteps, toggleTaskStep } from "@/lib/task-steps";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/animal-subscriptions")({
  head: () => legatoHead("Arrêter les abonnements", "Croquettes, mutuelle animale, garde, toilettage : cochez ce qui le concerne."),
  component: Subscriptions,
});

/** B039 · Arrêter les abonnements */
function Subscriptions() {
  const { name, setTaskStatus } = useAnimal();
  const [checked, setChecked] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => setChecked(loadTaskSteps("animal-subscriptions")), []);
  const chosen = SUBSCRIPTIONS.filter((_, i) => checked.includes(i));
  const copy = async (t: string) => { try { await navigator.clipboard.writeText(t); toast("Message copié."); } catch { toast("Copie impossible : sélectionnez le texte."); } };
  return (
    <AnimalSheet back="/practical" backLabel="Démarches" title={<>Arrêter<br /><em>les abonnements.</em></>}>
      <Lead className="mt-[10px] max-w-[310px]">Pour ne pas recevoir ce qui était pour lui. Cochez ce qui le concerne.</Lead>
      <div className="mt-6 flex flex-col gap-[10px]">
        {SUBSCRIPTIONS.map((s, i) => <OptionCard key={s} label={s} selected={checked.includes(i)} onClick={() => setChecked(toggleTaskStep("animal-subscriptions", i))} />)}
      </div>
      <div className="pt-7">
        <PrimaryButton disabled={!chosen.length} onClick={() => { setReady(true); setTaskStatus("animal-subscriptions", "done"); }}>Préparer les messages</PrimaryButton>
      </div>
      {ready && chosen.map((s) => (
        <section key={s} className="mt-6 p-5" style={{ background: "var(--sp-block)" }}>
          <p className="lg-mono">{s}</p>
          <pre className="mt-3 whitespace-pre-wrap text-[14px] leading-[1.6]" style={{ fontFamily: "var(--lg-sans)" }}>{subscriptionMessage(s, name)}</pre>
          <div className="mt-3"><TextLink onClick={() => copy(subscriptionMessage(s, name))}>Copier</TextLink></div>
        </section>
      ))}
    </AnimalSheet>
  );
}
