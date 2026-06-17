import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useServerFn } from "@tanstack/react-start";
import { recordEmotion } from "@/lib/emotional.functions";
import { supabase } from "@/integrations/supabase/client";
import { IvoryCard } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/onboarding/")({
  head: () => ({
    meta: [
      { title: "Commencer doucement — Legato" },
      { name: "description", content: "Quelques questions tranquilles pour accorder votre espace." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const { name, setName, setCareOnboarded, setPracticalOnboarded } = useLegato();
  const navigate = useNavigate();
  const canContinue = name.trim().length > 0;
  const record = useServerFn(recordEmotion);

  const proceed = async () => {
    if (!canContinue) return;
    setCareOnboarded(true);
    setPracticalOnboarded(true);
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      record({ data: { source: "onboarding", tags: ["accueil"], note: `Prénom : ${name}` } }).catch(() => {});
    }
    navigate({ to: "/space" });
  };

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="px-6 pt-10 flex items-center justify-between">
          <button onClick={() => navigate({ to: "/start" })} className="mono-label hover:text-dusk">
            ← Retour
          </button>
          <LegatoMark to="/space" size={20} />
          <span className="w-12" />
        </header>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-24">
          <p className="mono-label">Pour commencer</p>
          <h1 className="mt-5 ed-page-title">
            Comment souhaitez-vous que nous <span className="italic" style={{ color: "var(--terracotta)" }}>vous appelions ?</span>
          </h1>

          <IvoryCard className="mt-8 px-5 py-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre prénom"
              className="w-full bg-transparent font-serif text-[24px] italic text-dusk placeholder:text-dusk/30 outline-none"
              autoFocus
            />
          </IvoryCard>

          <button
            onClick={proceed}
            disabled={!canContinue}
            className="mt-5 block w-full rounded-[999px] px-6 py-5 text-center disabled:opacity-40 transition-transform active:scale-[0.99]"
            style={{ background: "var(--terracotta)", color: "var(--paper)" }}
          >
            <span className="font-serif text-[20px]">Continuer →</span>
          </button>
        </div>
      </div>
    </main>
  );
}
