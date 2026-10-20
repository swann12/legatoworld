import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StandardLayout, PageTitle, Lead, TextLink } from "@/components/legato/ds";
import { useActiveSpace } from "@/lib/use-active-space";
import { useSpaces } from "@/lib/spaces-store";
import { setActiveSpaceId } from "@/lib/active-space";
import { legatoHead } from "@/lib/legato-head";

/** D012 · x-supprimer : confirmer une suppression, en écrivant SUPPRIMER. */
export const Route = createFileRoute("/reglages/supprimer")({
  head: () => legatoHead("Confirmer une suppression", "Une suppression est définitive : téléchargez d'abord une copie, puis confirmez."),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const { space, spaces } = useActiveSpace();
  const { removeSpace } = useSpaces();
  const [confirm, setConfirm] = useState("");
  const ready = confirm.trim().toUpperCase() === "SUPPRIMER";

  const del = () => {
    if (!space || !ready) return;
    removeSpace(space.id);
    setActiveSpaceId(spaces.find((s) => s.id !== space.id && !s.archived)?.id ?? null);
    toast("Espace supprimé.");
    navigate({ to: "/profile/data" });
  };

  return (
    <StandardLayout back="/profile/data" backLabel="Vos données" activeTab="/home">
      <PageTitle className="pt-8">Supprimer<br /><em>cet espace ?</em></PageTitle>
      <Lead className="mt-4 max-w-[320px]">
        Les souvenirs, le journal, les documents et les démarches de cet espace seront effacés définitivement, pour vous et pour vos proches.
      </Lead>
      <div className="mt-6">
        <TextLink to="/profile/data">Télécharger d'abord une copie</TextLink>
      </div>
      <p className="lg-mono mt-10">Pour confirmer, écrivez SUPPRIMER</p>
      <input
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        aria-label="Écrivez SUPPRIMER pour confirmer"
        autoComplete="off"
        className="mt-3 w-full bg-transparent py-3 text-[16px] outline-none"
        style={{ borderBottom: "1px solid var(--sp-line-2)", color: "var(--sp-ink)", fontFamily: "var(--lg-sans)" }}
      />
      <button type="button" onClick={del} disabled={!ready}
        className="mt-8 flex h-[52px] w-full items-center justify-center rounded-full text-[15px] transition-opacity disabled:opacity-40"
        style={{ background: "var(--lg-bordeaux)", color: "var(--lg-blush)" }}>
        Supprimer définitivement
      </button>
      <div className="mt-4 text-center">
        <TextLink to="/profile/data">Annuler</TextLink>
      </div>
    </StandardLayout>
  );
}
