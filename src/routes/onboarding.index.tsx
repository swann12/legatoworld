import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useServerFn } from "@tanstack/react-start";
import { recordEmotion } from "@/lib/emotional.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding/")({
  head: () => ({
    meta: [
      { title: "Commencer doucement — Legato" },
      { name: "description", content: "Quelques questions tranquilles pour accorder votre espace." },
    ],
  }),
  component: Onboarding,
});

/* ─── Étape 2 : IDENTIFICATION ───
 * Une seule page : prénom + Continuer → /space. */
function Onboarding() {
  const { name, setName } = useLegato();
  const navigate = useNavigate();
  const canContinue = name.trim().length > 0;
  const record = useServerFn(recordEmotion);

  const proceed = async () => {
    if (!canContinue) return;
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      record({ data: { source: "onboarding", tags: ["accueil"], note: `Prénom : ${name}` } }).catch(() => {});
    }
    navigate({ to: "/space" });
  };

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="px-7 pt-10 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/start" })}
            className="eyebrow hover:text-dusk"
          >
            ← Retour
          </button>
          <LegatoMark to="/space" size={20} />
          <span className="w-12" />
        </header>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-7 pb-24">
          <p className="eyebrow">Pour commencer</p>
          <h1 className="mt-5 display-xl">
            Comment souhaitez-vous que nous <span className="italic" style={{ color: "var(--terracotta)" }}>vous&nbsp;appelions&nbsp;?</span>
          </h1>

          <div className="mt-8 rounded-[16px] border border-dusk/15 bg-whisper px-5 py-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre prénom"
              className="w-full bg-transparent font-serif text-[24px] italic text-dusk placeholder:text-dusk/30 outline-none"
              autoFocus
            />
          </div>

          <button
            onClick={proceed}
            disabled={!canContinue}
            className="mt-5 block w-full card-tomato px-6 py-5 text-center disabled:opacity-40 transition-transform active:scale-[0.99]"
          >
            <span className="font-serif text-[20px]">Continuer →</span>
          </button>
        </div>
      </div>
    </main>
  );
}