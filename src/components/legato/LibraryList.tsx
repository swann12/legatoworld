import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { StandardLayout, PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";
import { Button } from "@/components/ui/button";
import { FEATURED, LIBRARY, libraryTitle, useSaved, type LibItem, type LibTab } from "@/lib/library-data";
import { useActiveSpace } from "@/lib/use-active-space";
export type { LibTab } from "@/lib/library-data";
const TABS: { id: LibTab; label: string }[] = [{ id: "lire", label: "Lire" }, { id: "ecouter", label: "Écouter" }, { id: "voir", label: "Voir" }, { id: "gardes", label: "Gardés" }];

export function LibraryRows({ items }: { items: LibItem[] }) {
  return <ul className="lg-library-rows">{items.map((it) => <li key={it.id}>
    <Link to="/library/$kind/$id" params={{ kind: it.kind, id: it.id }} className="lg-library-row">
      <span className="min-w-0 flex-1">
        <span className="lg-mono block">{it.tag ?? `${it.type} · ${it.length}`}</span>
        <span className="lg-library-row-title mt-[5px] block">{libraryTitle(it)}</span>
        <span className="lg-library-sub mt-[5px] block">{it.author}{it.caption ? ` · ${it.caption}` : ""}</span>
      </span><ChevronRight className="size-3.5 shrink-0" strokeWidth={1} />
    </Link></li>)}</ul>;
}

export function LibraryList({ tab, onTab }: { tab: LibTab; onTab: (t: LibTab) => void }) {
  const saved = useSaved();
  const { space, kind } = useActiveSpace();
  const featured = tab === "gardes" ? saved : FEATURED[tab];
  const items = featured.flatMap((id) => { const item = LIBRARY.find((i) => i.id === id); return item ? [item] : []; });
  const others = LIBRARY.filter((i) => i.kind === tab && !featured.includes(i.id));
  const formats = tab === "ecouter" ? "podcasts et musiques" : tab === "voir" ? "films, séries et documentaires" : "livres";
  const context = kind === "animal" ? "Choisis pour la perte d'un animal." : kind === "malade" ? "Choisis pour accompagner un proche malade." : space?.relation === "conjoint" ? "Choisis pour la perte d'un conjoint." : "Choisis pour la perte d'un proche.";
  return <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care" className="lg-library">
    <PageTitle className="pt-[22px]">Lire, écouter,<br /><em>voir.</em></PageTitle>
    <Lead className="mt-[6px]">{context}</Lead>
    <div className="lg-library-tabs mt-[22px]" role="tablist" aria-label="Ressources">
      {TABS.map((t) => <Button key={t.id} variant="ghost" role="tab" aria-selected={tab === t.id} onClick={() => onTab(t.id)} className="lg-library-tab">{t.label}</Button>)}
    </div>
    {items.length ? <LibraryRows items={items} /> : <p className="lg-library-sub py-8">Rien de gardé pour l'instant.</p>}
    {tab !== "gardes" && <section className="lg-library-invitation mt-[18px]">
      <p>Rien ne vous parle ? Dites à Présence ce que vous cherchez : elle vous suggère d'autres {formats}.</p>
      <PrimaryButton to="/care/resources/suggestions" search={{ kind: tab }} className="mt-[14px] h-[42px] px-6">Demander à Présence</PrimaryButton>
    </section>}
    {others.length > 0 && <details className="lg-library-extras"><summary>D'autres {formats}</summary><LibraryRows items={others} /></details>}
  </StandardLayout>;
}
