import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { StandardLayout, PageTitle, Lead, PrimaryButton, TextLink, OptionCard, Spec, PageHeader } from "@/components/legato/ds";
import { refineCeremony } from "@/lib/ceremony-ai.functions";
import { useCeremonyPlan, FLOWER_QUESTIONS, flowerChoicesText, type FlowerProposal } from "@/lib/ceremony-flow";
import { usePortrait, portraitSentence } from "@/lib/portrait-store";
import { useLovedName } from "@/lib/loved-name";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/flowers")({
  validateSearch: s => z.object({ view: z.enum(["questions", "proposition"]).optional() }).parse(s),
  head: ({ match }) => legatoHead(match.search.view === "proposition" ? "Votre proposition florale" : match.search.view === "questions" ? "Fleurs · les questions" : "Choisir les fleurs", "Décrire une composition avec vos mots ou répondre à trois questions."),
  component: Flowers,
});
function Flowers() {
  const { view } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { plan, update } = useCeremonyPlan();
  const { portrait } = usePortrait();
  const lovedName = useLovedName();
  const refine = useServerFn(refineCeremony);
  const [draft, setDraft] = useState<string | null>(null);
  const brief = draft ?? plan.flowersBrief;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string> | null>(null);
  const chosen = answers ?? plan.flowerAnswers;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const setView = (next?: "questions" | "proposition") => { setError(""); navigate({ search: next ? { view: next } : {} }); };
  const generate = async (fromQuestions: boolean, nextAnswers = chosen) => {
    if (pending) return;
    const text = fromQuestions ? "Je souhaite des fleurs qui lui ressemblent. Propose une composition à partir de mes réponses, même si certaines étapes sont passées." : brief.trim();
    if (text.length < 2) { setError("Écrivez quelques mots pour votre composition."); return; }
    setPending(true); setError("");
    update({ flowersBrief: brief, flowerAnswers: nextAnswers });
    try {
      const result = await refine({ data: { section: "fleurs", brief: text, choices: fromQuestions ? flowerChoicesText(nextAnswers) : undefined, portrait: portraitSentence(portrait, lovedName) || undefined, lovedName: lovedName || undefined, outputMode: "flower-proposal" } });
      if (!result.flowerProposal) { setError(result.error ?? "La proposition reçue est incomplète."); return; }
      update({ flowerProposal: result.flowerProposal, flowersChosen: false });
      setView("proposition");
    } catch (e) { setError(e instanceof Error ? e.message : "Impossible de joindre Présence pour le moment."); }
    finally { setPending(false); }
  };
  const advance = (skip: boolean) => {
    const nextAnswers = skip ? { ...chosen, [FLOWER_QUESTIONS[step].key]: "inconnu" } : chosen;
    setAnswers(nextAnswers); update({ flowerAnswers: nextAnswers });
    if (step < 2) setStep(step + 1); else generate(true, nextAnswers);
  };
  const send = async (proposal: FlowerProposal) => {
    setSending(true);
    const text = `${proposal.title} ${proposal.accent}\n\n${proposal.body}\n\nFleurs : ${proposal.flowers}\nForme : ${proposal.shape}\nPrix estimé : ${proposal.price}\n\nBonjour, pourriez-vous me proposer un devis pour cette composition ?`;
    try {
      if (navigator.share) await navigator.share({ title: "Composition florale", text });
      else window.location.href = `mailto:?subject=${encodeURIComponent("Composition florale — demande de devis")}&body=${encodeURIComponent(text)}`;
      update({ flowersChosen: true });
    } catch (e) { if (!(e instanceof DOMException && e.name === "AbortError")) setError("Le partage n'a pas pu être ouvert."); }
    finally { setSending(false); }
  };
  if (view === "questions") {
    const q = FLOWER_QUESTIONS[step];
    return <div className="lg-space-practical min-h-dvh bg-lg-cream text-lg-deep font-lg-sans">
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col px-7 pb-[34px]">
        <PageHeader space="practical" back="/practical/flowers" backLabel="Choisir les fleurs" />
        <div className="lg-question-progress" role="progressbar" aria-valuenow={step + 1} aria-valuemax={3}>{[0, 1, 2].map(i => <span key={i} className={i <= step ? "is-current" : ""} />)}</div>
        <div className="flex-1">
          <PageTitle space="practical" size={30} className="mt-[30px]">{q.title}<br /><em>{q.accent}</em></PageTitle>
          <Lead space="practical" className="mt-3">{q.lead}</Lead>
          <div className="mt-6 space-y-[10px]">{q.options.map(o => <OptionCard key={o.id} space="practical" label={o.label} hint={o.hint} selected={chosen[q.key] === o.id} onClick={() => { setAnswers({ ...chosen, [q.key]: o.id }); update({ flowerAnswers: { ...chosen, [q.key]: o.id } }); }} />)}</div>
          {step > 0 && <TextLink space="practical" className="mt-5 inline-block" onClick={() => setStep(step - 1)}>Question précédente</TextLink>}
          {error && <p role="alert" className="lg-lead mt-4">{error}</p>}
        </div>
        <div className="flex flex-col items-center gap-4 pt-8">
          <PrimaryButton space="practical" full disabled={pending || !chosen[q.key]} onClick={() => advance(false)}>{pending ? "Présence compose…" : "Continuer"}</PrimaryButton>
          {!pending && <TextLink space="practical" onClick={() => advance(true)}>Passer cette étape</TextLink>}
        </div>
      </div>
    </div>;
  }
  if (view === "proposition") {
    const p = plan.flowerProposal;
    return <StandardLayout space="practical" back="/practical/flowers" backLabel="Choisir les fleurs" activeTab="/practical">
      <p className="lg-mono mt-[30px]">Proposition de Présence</p>
      {p ? <>
        <PageTitle space="practical" size={30} className="mt-3">{p.title}<br /><em>{p.accent}</em></PageTitle>
        <section className="mt-6 bg-lg-linen px-[22px] py-5"><p className="text-[14.5px] leading-[1.6]">{p.body}</p></section>
        <Spec space="practical" className="lg-provider-spec mt-[22px]" items={[{ label: "Fleurs", value: p.flowers }, { label: "Forme", value: p.shape }, { label: "Prix estimé", value: p.price }]} />
        <div className="mt-[26px] flex flex-wrap items-center gap-[22px]"><PrimaryButton space="practical" disabled={sending} onClick={() => send(p)}>Envoyer au fleuriste</PrimaryButton><TextLink space="practical" onClick={() => setView()}>Modifier</TextLink></div>
      </> : <><PageTitle space="practical" className="mt-3">Une composition<br /><em>à imaginer.</em></PageTitle><PrimaryButton space="practical" className="mt-6" onClick={() => setView()}>Choisir les fleurs</PrimaryButton></>}
      {error && <p role="alert" className="lg-lead mt-4">{error}</p>}
    </StandardLayout>;
  }
  return <StandardLayout space="practical" back="/practical/atmosphere" backLabel="Les détails" activeTab="/practical">
    <PageTitle space="practical" size={36} className="mt-[30px]">Choisir <em>les fleurs.</em></PageTitle>
    <Lead space="practical" className="mt-3">Décrivez ce que vous imaginez, avec vos mots. Présence vous proposera une composition à montrer au fleuriste.</Lead>
    <textarea aria-label="Ce que vous imaginez" maxLength={1500} value={brief} onChange={e => setDraft(e.target.value)} onBlur={() => update({ flowersBrief: brief })} className="lg-flower-input mt-6" placeholder="Des fleurs simples, blanches et vertes, comme dans son jardin…" />
    <PrimaryButton space="practical" className="mt-[22px]" disabled={pending || brief.trim().length < 2} onClick={() => generate(false)}>{pending ? "Présence compose…" : "Voir la proposition"}</PrimaryButton>
    {error && <p role="alert" className="lg-lead mt-4">{error}</p>}
    <section className="mt-7 bg-lg-linen px-5 py-[18px]"><p className="text-[14px] leading-[1.55]">Vous ne savez pas quoi imaginer ? Répondez à trois questions, Présence s'occupe du reste.</p><TextLink space="practical" className="mt-[14px] inline-block" onClick={() => { setStep(0); setView("questions"); }}>Répondre aux questions</TextLink></section>
  </StandardLayout>;
}
