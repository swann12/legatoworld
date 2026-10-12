import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { StandardLayout, PageTitle, Lead } from "@/components/legato/ds";
import { LIBRARY, useSaved } from "@/lib/library-data";

export type LibTab = "lire" | "ecouter" | "gardes";
const TABS: { id: LibTab; label: string }[] = [
  { id: "lire", label: "Lire" }, { id: "ecouter", label: "Écouter" }, { id: "gardes", label: "Gardés" },
];

/** Écran 040 · Lire, écouter — partagé par /care/resources et /library/$kind. */
export function LibraryList({ tab, onTab }: { tab: LibTab; onTab: (t: LibTab) => void }) {
  const saved = useSaved();
  const items = tab === "gardes" ? LIBRARY.filter((i) => saved.includes(i.id)) : LIBRARY.filter((i) => i.kind === tab);
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" className="mt-12">Lire,<br /><em>écouter.</em></PageTitle>
      <Lead space="support" className="mt-4">Choisis pour la perte d'un proche, les premiers mois.</Lead>
      <div className="mt-8 flex gap-6 text-[14.5px]" style={{ borderBottom: "1px solid var(--sp-line)" }}>
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => onTab(t.id)} className="-mb-px pb-3"
            style={{ color: tab === t.id ? "var(--sp-ink)" : "var(--sp-sub)", borderBottom: tab === t.id ? "1.5px solid var(--sp-ink)" : "1.5px solid transparent" }}>
            {t.label}
          </button>
        ))}
      </div>
      {items.length === 0 && <p className="py-8 text-[14.5px]" style={{ color: "var(--sp-sub)" }}>Rien de gardé pour l'instant. Sur une fiche, touchez « Garder pour plus tard ».</p>}
      <ul>
        {items.map((it, i) => (
          <li key={it.id}>
            <Link to="/library/$kind/$id" params={{ kind: it.kind, id: it.id }} className="flex items-center gap-4 py-5"
              style={{ borderBottom: i === items.length - 1 ? "none" : "1px solid var(--sp-line)", color: "var(--sp-ink)" }}>
              <span className="min-w-0 flex-1">
                <span className="lg-mono block">{it.type} · {it.length}</span>
                <span className="lg-row-title mt-2 block">{it.title}{it.titleEnd ? ` ${it.titleEnd.replace(/\.$/, "")}` : ""}</span>
                <span className="lg-row-sub mt-1 block" style={{ color: "var(--sp-sub)" }}>{it.author}</span>
              </span>
              <ChevronRight className="size-4 shrink-0" strokeWidth={1.3} />
            </Link>
          </li>
        ))}
      </ul>
    </StandardLayout>
  );
}
