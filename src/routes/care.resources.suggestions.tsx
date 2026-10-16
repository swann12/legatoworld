import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send } from "lucide-react";
import { StandardLayout, PageTitle } from "@/components/legato/ds";
import { Button } from "@/components/ui/button";
import { getLibItem, libraryTitle, toLibTab, type LibKind } from "@/lib/library-data";
import { localLibrarySuggestions, PRECISIONS, type Precision, type LibraryProposal } from "@/lib/library-suggestions";
import { suggestLibrary } from "@/lib/library-suggestions.functions";
import { getDiscovery } from "@/lib/discovery";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/resources/suggestions")({
  validateSearch: (search: Record<string, unknown>) => ({ kind: toLibTab(search.kind) === "gardes" ? "lire" as LibKind : toLibTab(search.kind) as LibKind }),
  head: () => legatoHead("Suggestions de lecture, d'écoute et de films", "Dites à Présence ce que vous cherchez et découvrez des ressources expliquées."),
  component: Suggestions,
});
function Suggestions() {
  const { kind } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [precisions, setPrecisions] = useState<Precision[]>([]);
  const [proposals, setProposals] = useState<LibraryProposal[]>(localLibrarySuggestions("un film", [], "voir"));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [safety, setSafety] = useState<string | null>(null);
  const [local, setLocal] = useState(true);
  const call = useServerFn(suggestLibrary);
  async function submit() {
    if (!query.trim() || pending) return;
    setError(null); setSafety(null);
    if (getDiscovery().active) { setProposals(localLibrarySuggestions(query, precisions, kind)); setLocal(true); return; }
    setPending(true);
    try {
      const result = await call({ data: { query, precisions, kind } });
      setError(result.error); setSafety(result.safety);
      if (!result.error) { setProposals(result.proposals); setLocal(false); }
    } catch (e) { setError(e instanceof Error ? e.message : "Impossible de joindre Présence."); }
    finally { setPending(false); }
  }
  return <StandardLayout space="support" back="/care/resources" backLabel="Lire, écouter, voir" activeTab="/care" className="lg-library">
    <PageTitle size={32} className="pt-6">Que cherchez-vous<br /><em>en ce moment ?</em></PageTitle>
    <form onSubmit={(e) => { e.preventDefault(); void submit(); }}>
      <div className="lg-library-query mt-[18px]">
        <textarea aria-label="Que cherchez-vous en ce moment ?" placeholder="Un film doux, pas trop triste, sur la perte d'une épouse" value={query} onChange={(e) => setQuery(e.target.value)} maxLength={1000} rows={2} />
        <Button type="submit" variant="ghost" size="icon" title="Demander à Présence" aria-label="Demander à Présence" disabled={pending || !query.trim()}><Send className="size-4" /></Button>
      </div>
      <div className="lg-library-precisions pt-[14px]">{PRECISIONS.map((p) => <Button key={p} type="button" variant="outline" aria-pressed={precisions.includes(p)} onClick={() => { const next = precisions.includes(p) ? precisions.filter((v) => v !== p) : [...precisions, p]; setPrecisions(next); if (local) setProposals(localLibrarySuggestions(query, next, kind)); }} className="lg-library-precision">{p}</Button>)}</div>
    </form>
    <p className="lg-mono mt-[8px]">{local ? "Suggestions du catalogue" : "Propositions de Présence"}</p>
    {pending && <p role="status" className="lg-library-sub py-4">Présence choisit…</p>}
    {error && <p role="alert" className="lg-library-sub py-4">{error}</p>}
    {safety && <p role="alert" className="py-4">{safety} <Link to="/home/penser-a-mourir" className="underline">Une aide maintenant</Link></p>}
    <ul className="mt-1">{proposals.map((p) => {
      const item = getLibItem(p.id); if (!item) return null;
      return <li key={p.id} className="lg-library-proposal"><Link to="/library/$kind/$id" params={{ kind: item.kind, id: item.id }}>
        <span className="lg-mono block">{item.tag ?? item.type}</span>
        <span className="lg-library-row-title mt-[6px] block">{libraryTitle(item)}</span>
        <span className="lg-library-sub mt-[5px] block">{item.author} · {p.why}</span>
      </Link></li>;
    })}</ul>
  </StandardLayout>;
}
