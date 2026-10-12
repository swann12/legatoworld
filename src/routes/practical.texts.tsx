import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { StandardLayout, PageTitle, Lead, PrimaryButton, SectionLabel, TextLink } from "@/components/legato/ds";
import { useCeremonyPlan } from "@/lib/ceremony-flow";
import { savePractical, loadPractical } from "@/lib/practical-store";
import { refineCeremony } from "@/lib/ceremony-ai.functions";
import { useLegato } from "@/lib/legato-state";
import { legatoHead } from "@/lib/legato-head";
import { Step10Extras } from "@/components/legato/Step10Extras";
import { LegacyTexts } from "@/components/legato/legacy/Step10Texts";

export const Route = createFileRoute("/practical/texts")({
  validateSearch: (s: Record<string, unknown>): { view?: "propositions" } => ({ view: s.view === "propositions" ? "propositions" : undefined }),
  head: ({ match }) => legatoHead(match.search.view === "propositions" ? "Textes et musique · propositions" : "Textes et musique", "Des lectures et des morceaux proposés à partir de ce qui comptait pour votre proche."),
  component: Texts,
});
function Texts() {
  const { view } = Route.useSearch();
  const navigate = useNavigate();
  const { state } = useCeremonyPlan();
  const { lovedOneName } = useLegato();
  const call = useServerFn(refineCeremony);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const generate = async () => {
    const brief = loadPractical().textsBrief?.trim() ?? "";
    if (busy || brief.length < 2) return;
    setBusy(true); setError("");
    try {
      const readings = await call({ data: { section: "textes", brief, portrait: state.portrait, lovedName: lovedOneName } });
      if (readings.error) { setError(readings.error); return; }
      const music = await call({ data: { section: "musique", brief, portrait: state.portrait, lovedName: lovedOneName } });
      if (music.error) { setError(music.error); return; }
      if (!readings.ideas.length || !music.ideas.length) { setError("La proposition reçue est incomplète."); return; }
      savePractical({ textsProposal: { readings: readings.ideas.slice(0, 2), music: music.ideas.slice(0, 2) } });
      await navigate({ to: "/practical/texts", search: { view: "propositions" } });
    } catch { setError("Impossible de joindre Présence pour le moment."); }
    finally { setBusy(false); }
  };
  const toggle = (key: "selectedTexts" | "selectedMusic", title: string) => {
    const selected = loadPractical()[key];
    savePractical({ [key]: selected.includes(title) ? selected.filter(x => x !== title) : [...selected, title] });
  };
  return <StandardLayout space="practical" back={view ? "/practical/texts" : "/practical/atmosphere"} backLabel={view ? "Textes et musique" : "Les détails"} activeTab="/practical">
    {view === "propositions" ? <>
      <p className="lg-mono mt-[30px]">Propositions de Présence</p>
      <PageTitle space="practical" size={36} className="mt-3">Pour <em>{lovedOneName || "votre proche"}.</em></PageTitle>
      {state.textsProposal ? ([{ label: "Lectures", key: "selectedTexts" as const, ideas: state.textsProposal.readings }, { label: "Musiques", key: "selectedMusic" as const, ideas: state.textsProposal.music }]).map(group => <section key={group.key} className="mt-6">
        <SectionLabel space="practical" accent={group.key === "selectedTexts"}>{group.label}</SectionLabel>
        {group.ideas.map(idea => <div key={idea.title} className="lg-text-proposal">
          <div className="min-w-0 flex-1"><h2 className="lg-row-title">{idea.title}</h2><p className="lg-row-sub mt-1">{idea.body}</p></div>
          <div className="flex w-[56px] shrink-0 flex-col items-end gap-1"><span className="lg-mono whitespace-nowrap">{idea.duration ?? ""}</span><TextLink space="practical" className="min-h-8" onClick={() => toggle(group.key, idea.title)}>{state[group.key].includes(idea.title) ? "Gardé" : "Garder"}</TextLink></div>
        </div>)}
      </section>) : <div className="mt-6"><Lead space="practical">Aucune proposition enregistrée pour le moment.</Lead><PrimaryButton space="practical" to="/practical/texts" className="mt-5">Décrire votre proche</PrimaryButton></div>}
    </> : <>
      <PageTitle space="practical" className="mt-[30px]">Choisir les textes<br /><em>et la musique.</em></PageTitle>
      <Lead space="practical" className="mt-3">Parlez-nous d'elle : ce qu'elle aimait, ce qui la faisait rire. Présence vous proposera des lectures et des morceaux qui lui ressemblent.</Lead>
      <textarea aria-label="Ce qu’elle aimait" className="lg-flower-input lg-texts-input mt-[22px]" placeholder="Elle aimait la mer, Barbara, les poèmes appris à l'école…" value={state.textsBrief ?? ""} onChange={e => savePractical({ textsBrief: e.target.value })} maxLength={1500} disabled={busy} />
      {error && <p role="alert" className="lg-row-sub mt-3">{error}</p>}
      <PrimaryButton space="practical" className="mt-[22px]" onClick={generate} disabled={busy || (state.textsBrief?.trim().length ?? 0) < 2}>{busy ? "Présence compose…" : "Voir les propositions"}</PrimaryButton>
      <div className="lg-step10-note mt-7"><TextLink space="practical" className="lg-note-link" to="/presence">Vous préférez écrire votre propre texte ? Présence peut vous aider à le commencer.</TextLink></div>
    </>}
    <Step10Extras><LegacyTexts /></Step10Extras>
  </StandardLayout>;
}
