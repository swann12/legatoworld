import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageTitle, Lead, OutlineButton, TextLink } from "@/components/legato/ds";
import { RitualsLayout } from "@/components/legato/RitualsUI";
import { useMemoryPerson } from "@/components/legato/MemoryUI";
import { suggestRituals } from "@/lib/rituals.functions";
import { usePortrait, portraitSentence } from "@/lib/portrait-store";
import { useLegato } from "@/lib/legato-state";
import { getDiscovery } from "@/lib/discovery";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/propositions")({
  head: () => legatoHead("Propositions de Présence", "Trois rituels choisis à partir de ce que vous avez dit de votre proche."),
  component: Propositions,
});

export type Proposal = { title: string; why: string; meta: string; to: string; params?: Record<string, string>; search?: Record<string, string> };
export const PROPOSALS_KEY = "lg.rituels.proposals";
const DEFAULTS: Proposal[] = [
  { title: "Repas et récits", why: "Pour la raconter ensemble, autour d'une table", meta: "Une soirée · à plusieurs", to: "/care/rituels/organiser", search: { rituel: "repas" } },
  { title: "Une lanterne sur l'eau", why: "Quelques mots qui s'éloignent, le soir", meta: "10 minutes · seul", to: "/care/rituels/$id", params: { id: "lanterne" } },
  { title: "Planter un arbre", why: "Pour que son souvenir continue de pousser", meta: "Une matinée · à plusieurs", to: "/care/rituels/arbre" },
];

/** B095 · Trois rituels proposés par Présence (suggestRituals), avec repli sur trois rituels du catalogue */
function Propositions() {
  const { name } = useMemoryPerson();
  const { branch, lostName } = useLegato();
  const { portrait } = usePortrait();
  const call = useServerFn(suggestRituals);
  const [list, setList] = useState<Proposal[]>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (getDiscovery().active) { setLoading(false); return; }
    let tradition: string[] = [];
    try { tradition = JSON.parse(window.localStorage.getItem("lg.rituels.tradition") || "[]"); } catch { /* rien */ }
    const p = [portraitSentence(portrait, lostName), tradition.length ? `Tradition souhaitée : ${tradition.join(", ")}` : ""].filter(Boolean).join(". ").slice(0, 400);
    call({ data: { kind: "memoire", title: `Honorer ${name}`, date: "à venir", branch: branch || "deuil", mode: "ancrage", lostName: name, portrait: p || undefined } })
      .then(({ quick, long }) => {
        const picks = [long[0], quick[0], long[1] ?? quick[1]].filter(Boolean);
        if (picks.length < 3) return;
        const mapped: Proposal[] = picks.map((r, i) => ({
          title: r.title, why: r.whisper, meta: `${r.durationMin >= 60 ? `${Math.round(r.durationMin / 60)} h` : `${r.durationMin} minutes`} · ${r.origin}`,
          to: "/care/rituels/$id", params: { id: `p${i}` },
        }));
        try { window.sessionStorage.setItem(PROPOSALS_KEY, JSON.stringify(picks)); } catch { /* rien */ }
        setList(mapped);
      }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <RitualsLayout>
      <p className="lg-mono pt-8">Propositions de Présence</p>
      <PageTitle className="mt-3">Trois rituels<br /><em>pour {name}.</em></PageTitle>
      <Lead className="mt-3">{loading ? "Présence choisit…" : "Choisis à partir de ce que vous lui avez dit d'elle. Aucun n'est obligatoire."}</Lead>
      <div className="mt-6">
        {list.map((p, i) => (
          <div key={p.title} className="py-5" style={{ borderBottom: i < list.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
            <p className="lg-row-title">{p.title}</p>
            <p className="lg-row-sub mt-1">{p.why}</p>
            <p className="lg-mono mt-2" style={{ color: "var(--sp-accent)" }}>{p.meta}</p>
            <div className="mt-3"><OutlineButton to={p.to} params={p.params} search={p.search}>Voir</OutlineButton></div>
          </div>
        ))}
      </div>
      <div className="mt-6"><TextLink to="/care/rituels/tradition">Changer de tradition</TextLink></div>
    </RitualsLayout>
  );
}
