import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { setActiveSpaceId } from "@/lib/active-space";
import { useActiveSpace } from "@/lib/use-active-space";
import { spaceKind, SPACE_KIND_LABEL, type Space } from "@/lib/spaces-store";
import { sinceWords } from "@/lib/today";
import { StandardLayout, SplitHeader, SectionLabel, OutlineButton, TextLink } from "@/components/legato/ds";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/space/")({
  head: () => ({
    meta: [
      { title: "Vos espaces — Legato" },
      { name: "description", content: "Un espace par personne : ses démarches, ses souvenirs et ses rappels." },
      { property: "og:title", content: "Vos espaces — Legato" },
      { property: "og:description", content: "Un espace par personne, chacun avec ses propres démarches et souvenirs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Spaces,
});

const since = (s: Space) => {
  const w = sinceWords(s.deathDate) ?? sinceWords(new Date(s.createdAt).toISOString());
  return w ? `Depuis ${w}` : "Créé aujourd'hui";
};

/** 019 · Vos espaces */
function Spaces() {
  const navigate = useNavigate();
  const { space, spaces } = useActiveSpace();
  const others = spaces.filter((s) => !s.archived && s.id !== space?.id);
  const count = spaces.filter((s) => !s.archived).length;

  return (
    <StandardLayout back="/home" backLabel="Aujourd'hui" activeTab="/home">
      <SplitHeader title={<>Vos<br /><em>espaces.</em></>} value={count}>
        <p className="lg-mono">{count > 1 ? "espaces" : "espace"}</p>
      </SplitHeader>

      {space && (
        <>
          <SectionLabel className="mt-8">Ouvert en ce moment</SectionLabel>
          <div className="mt-3 px-5 py-5" style={{ border: "1px solid var(--sp-stroke)" }}>
            <div className="flex items-baseline justify-between gap-3">
              <span style={{ fontFamily: "var(--lg-serif)", fontSize: 25 }}>{space.name}</span>
              <span className="lg-mono" style={{ color: "var(--sp-ink)" }}>{SPACE_KIND_LABEL[spaceKind(space)]}</span>
            </div>
            <p className="mt-1 text-[14px]" style={{ color: "var(--sp-sub)" }}>{since(space)}</p>
            <div className="mt-4 flex gap-6">
              <TextLink to="/space/settings">Réglages</TextLink>
              <TextLink to="/circle">Votre cercle</TextLink>
            </div>
          </div>
        </>
      )}

      {others.length > 0 && (
        <>
          <SectionLabel className="mt-8">Vos autres espaces</SectionLabel>
          {others.map((s, i) => (
            <button key={s.id} type="button" onClick={() => { setActiveSpaceId(s.id); navigate({ to: "/home" }); }}
              className="flex w-full items-center gap-4 py-[18px] text-left" style={{ borderBottom: i < others.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
              <span className="min-w-0 flex-1">
                <span className="lg-row-title block">{s.name}</span>
                <span className="lg-row-sub mt-1 block" style={{ color: "var(--sp-sub)" }}>{SPACE_KIND_LABEL[spaceKind(s)]} · {since(s).toLowerCase()}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0" strokeWidth={1.3} />
            </button>
          ))}
        </>
      )}

      <div className="mt-7 flex items-center gap-6">
        <OutlineButton to="/space/new">+ Créer un espace</OutlineButton>
        <TextLink to="/profile">Mon compte</TextLink>
      </div>
      <p className="sr-only"><Link to="/crisis">Besoin d'aide</Link></p>
    </StandardLayout>
  );
}
