import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveSpace } from "@/lib/use-active-space";
import { useSpaces } from "@/lib/spaces-store";
import { setActiveSpaceId } from "@/lib/active-space";
import { DEFAULT_SPACE_PREFS, getSpacePrefs, setSpacePrefs, type SpacePrefs } from "@/lib/space-prefs";
import { StandardLayout, PageTitle, SectionLabel, ToggleRow, TextLink } from "@/components/legato/ds";

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
  const { space, spaces } = useActiveSpace();
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
      <SectionLabel className="mt-6">Votre rythme</SectionLabel>
      <ToggleRow title="Le mode nuit" subtitle="Après 21 h, seulement du repos" checked={p.nuit} onChange={set("nuit")} />
      <ToggleRow title="La proposition du matin" subtitle="Chaque jour à 9 h" checked={p.matin} onChange={set("matin")} last />
      {space && <div className="mt-6"><TextLink onClick={archive}>Archiver cet espace</TextLink></div>}
    </StandardLayout>
  );
}
