import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveSpace } from "@/lib/use-active-space";
import { useSpaces } from "@/lib/spaces-store";
import { setActiveSpaceId } from "@/lib/active-space";
import { DEFAULT_SPACE_PREFS, getSpacePrefs, setSpacePrefs, type SpacePrefs } from "@/lib/space-prefs";
import { StandardLayout, PageTitle, SectionLabel, ToggleRow, TextLink, OptionCard } from "@/components/legato/ds";
import { getPapers, setPapers, getPapersHelper, setPapersHelper, type PapersState } from "@/lib/onboarding-flow";

const PAPERS: { id: PapersState; label: string }[] = [
  { id: "rien", label: "Rien n'est commencé" },
  { id: "obseques", label: "Les obsèques sont passées" },
  { id: "presque", label: "Presque tout est fait" },
  { id: "delegue", label: "Quelqu'un s'en occupe pour moi" },
];

export const Route = createFileRoute("/space/settings")({
  head: () => ({
    meta: [
      { title: "Réglages de l'espace — Legato" },
      { name: "description", content: "Ce que l'espace contient et votre rythme : mode nuit, proposition du matin." },
      { property: "og:title", content: "Réglages de l'espace — Legato" },
      { property: "og:description", content: "Choisir ce que l'espace contient et à quel rythme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Settings,
});

/** 021 · Réglages de l'espace */
function Settings() {
  const navigate = useNavigate();
  const { space, spaces, kind } = useActiveSpace();
  const [papers, setPapersState] = useState<PapersState | null>(null);
  const [helper, setHelper] = useState("");
  useEffect(() => { setPapersState(getPapers()); setHelper(getPapersHelper()); }, []);
  const choosePapers = (v: PapersState) => { setPapersState(v); setPapers(v); };
  const { updateSpace } = useSpaces();
  const [p, setP] = useState<SpacePrefs>(DEFAULT_SPACE_PREFS);
  useEffect(() => { setP(getSpacePrefs(space?.id)); }, [space?.id]);

  const set = (k: keyof SpacePrefs) => (v: boolean) => {
    const next = { ...p, [k]: v };
    setP(next);
    if (space) setSpacePrefs(space.id, next);
  };
  const archive = () => {
    if (!space || !window.confirm(`Archiver « ${space.name} » ? Vous pourrez le retrouver plus tard.`)) return;
    updateSpace(space.id, { archived: true });
    setActiveSpaceId(spaces.find((s) => !s.archived && s.id !== space.id)?.id ?? null);
    toast("Espace archivé.");
    navigate({ to: "/space" });
  };

  return (
    <StandardLayout back="/space" backLabel="Vos espaces" activeTab="/home">
      <PageTitle className="pt-8">Réglages de<br /><em>« {space?.name ?? "cet espace"} »</em></PageTitle>
      <SectionLabel className="mt-6">Ce que l'espace contient</SectionLabel>
      <ToggleRow title="Les démarches" subtitle="Les papiers à faire après le décès" checked={p.demarches} onChange={set("demarches")} />
      <ToggleRow title="La mémoire" subtitle="Photos, voix, lettres, lieux" checked={p.memoire} onChange={set("memoire")} />
      <ToggleRow title="La communauté" subtitle="Groupes et veillées" checked={p.communaute} onChange={set("communaute")} last />
      {kind === "deuil" && p.demarches && <>
        <SectionLabel className="mt-6">Où en êtes-vous avec les papiers ?</SectionLabel>
        <div className="mt-3 flex flex-col gap-[10px]">
          {PAPERS.map((o) => <OptionCard key={o.id} label={o.label} selected={papers === o.id} onClick={() => choosePapers(o.id)} />)}
        </div>
        {papers === "delegue" && (
          <label className="mt-4 block text-[13px]" style={{ color: "var(--sp-sub)" }}>
            Son prénom
            <input value={helper} onChange={(e) => { setHelper(e.target.value); setPapersHelper(e.target.value); }}
              className="mt-2 block w-full border-b bg-transparent py-2 text-[17px] outline-none" style={{ borderColor: "var(--sp-line-2)", color: "var(--sp-ink)" }} />
          </label>
        )}
      </>}
      <SectionLabel className="mt-6">Votre rythme</SectionLabel>
      <ToggleRow title="Le mode nuit" subtitle="Après 21 h, seulement du repos" checked={p.nuit} onChange={set("nuit")} />
      <ToggleRow title="La proposition du matin" subtitle="Chaque jour à 9 h" checked={p.matin} onChange={set("matin")} last />
      {space && <div className="mt-6"><TextLink onClick={archive}>Archiver cet espace</TextLink></div>}
    </StandardLayout>
  );
}
