import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QuestionLayout, QuestionFooter, PageTitle, Lead, OptionCard, TextLink } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/tradition")({
  head: () => legatoHead("Ma tradition", "Choisir une tradition pour recevoir des rituels qui ont du sens pour vous."),
  component: Tradition,
});

const OPTIONS = ["Sans religion", "Chrétienne", "Juive", "Musulmane", "Bouddhiste ou hindoue", "Peu importe, montrez-moi tout"];
const KEY = "lg.rituels.tradition";

/** B094 · Ma tradition (choix multiple) */
function Tradition() {
  const navigate = useNavigate();
  const [sel, setSel] = useState<string[]>([]);
  useEffect(() => { try { setSel(JSON.parse(window.localStorage.getItem(KEY) || "[]")); } catch { /* rien */ } }, []);
  const toggle = (o: string) => setSel((l) => (l.includes(o) ? l.filter((x) => x !== o) : [...l, o]));
  const go = (v: string[]) => { window.localStorage.setItem(KEY, JSON.stringify(v)); navigate({ to: "/care/rituels/propositions" }); };
  return (
    <QuestionLayout space="memory" step={1} total={1} header={<TextLink to="/care/rituels">Rituels</TextLink>} footer={<QuestionFooter cta="Continuer" ctaDisabled={!sel.length} onCta={() => go(sel)} link="Passer cette étape" onLink={() => go([])} />}>
      <PageTitle size={30}>Souhaitez-vous des rituels<br /><em>d'une tradition ?</em></PageTitle>
      <Lead className="mt-3">Pour vous proposer des gestes qui ont du sens pour vous. Plusieurs choix possibles.</Lead>
      <div className="mt-6 flex flex-col gap-[10px]">{OPTIONS.map((o) => <OptionCard key={o} label={o} selected={sel.includes(o)} onClick={() => toggle(o)} />)}</div>
    </QuestionLayout>
  );
}
