import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useActiveSpace } from "@/lib/use-active-space";
import { useSpaces } from "@/lib/spaces-store";
import { setActiveSpaceId } from "@/lib/active-space";
import { StandardLayout, PageTitle, Lead, ArrowRow } from "@/components/legato/ds";

export const Route = createFileRoute("/profile/data")({
  head: () => ({
    meta: [
      { title: "Vos données — Legato" },
      { name: "description", content: "Tout ce que vous avez écrit et gardé vous appartient : télécharger ou supprimer." },
      { property: "og:title", content: "Vos données — Legato" },
      { property: "og:description", content: "Télécharger ou supprimer vos données Legato." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Data,
});

const isLegatoKey = (k: string) => k.startsWith("lg.") || k.startsWith("legato.");

function download() {
  const out: Record<string, unknown> = {};
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)!;
    if (!isLegatoKey(k)) continue;
    const v = window.localStorage.getItem(k);
    try { out[k] = JSON.parse(v ?? "null"); } catch { out[k] = v; }
  }
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), data: out }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `legato-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** 106 · Vos données */
function Data() {
  const navigate = useNavigate();
  const { space, spaces } = useActiveSpace();
  const { removeSpace } = useSpaces();

  const deleteSpace = () => {
    if (!space) return;
    if (window.confirm("Télécharger vos souvenirs avant de supprimer ?")) download();
    if (!window.confirm(`Supprimer « ${space.name} » ? Ses souvenirs et ses démarches seront effacés.`)) return;
    removeSpace(space.id);
    setActiveSpaceId(spaces.find((s) => s.id !== space.id && !s.archived)?.id ?? null);
    toast("Espace supprimé.");
  };

  const deleteAccount = async () => {
    if (window.confirm("Télécharger vos souvenirs avant de supprimer ?")) download();
    if (!window.confirm("Supprimer votre compte ? Tout sera effacé de cet appareil, définitivement.")) return;
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) { const k = window.localStorage.key(i)!; if (isLegatoKey(k)) keys.push(k); }
    keys.forEach((k) => window.localStorage.removeItem(k));
    await supabase.auth.signOut();
    toast("Vos données ont été effacées de cet appareil. L'équipe supprimera votre compte en ligne sous 30 jours.");
    window.location.href = "mailto:contact@legato.app?subject=Suppression%20de%20mon%20compte";
    navigate({ to: "/start" });
  };

  return (
    <StandardLayout back="/profile" backLabel="Mon compte" activeTab="/home">
      <PageTitle className="pt-8">Vos <em>données.</em></PageTitle>
      <Lead className="mt-3">Tout ce que vous avez écrit et gardé vous appartient.</Lead>
      <div className="mt-5">
        <ArrowRow title="Télécharger tout" subtitle="Journal, souvenirs, documents · un fichier" onClick={download} />
        <ArrowRow title="Supprimer un espace" subtitle="Ses souvenirs et ses démarches seront effacés" onClick={deleteSpace} />
        <ArrowRow title="Supprimer mon compte" subtitle="Tout sera effacé, définitivement" onClick={deleteAccount} last />
      </div>
      <p className="mt-6 px-5 py-4 text-[14px] leading-[1.5]" style={{ background: "var(--sp-block)" }}>
        Avant toute suppression, Legato vous propose de télécharger vos souvenirs.
      </p>
    </StandardLayout>
  );
}
