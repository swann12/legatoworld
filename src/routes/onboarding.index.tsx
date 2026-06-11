import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

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

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="px-7 pt-10 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/start" })}
            className="text-[10px] uppercase tracking-[0.24em] text-dusk/50 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← Retour
          </button>
          <span className="font-serif text-[18px] leading-none">Legato</span>
          <span className="w-12" />
        </header>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-7 pb-24">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Pour commencer
          </p>
          <h1 className="mt-4 font-serif text-[36px] leading-[1.05] font-light text-balance">
            Comment souhaitez-vous que nous <span className="italic" style={{ color: "var(--terracotta)" }}>vous&nbsp;appelions&nbsp;?</span>
          </h1>

          <div className="mt-8 rounded-[14px] border border-dusk/15 bg-paper px-5 py-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre prénom"
              className="w-full bg-transparent font-serif text-[24px] italic text-dusk placeholder:text-dusk/30 outline-none"
              autoFocus
            />
          </div>

          <button
            onClick={() => canContinue && navigate({ to: "/space" })}
            disabled={!canContinue}
            className="mt-6 block w-full rounded-[18px] text-[color:var(--paper)] px-6 py-5 text-center disabled:opacity-40"
            style={{ background: "var(--bordeaux)" }}
          >
            <span className="font-serif text-[20px] italic">Continuer</span>
          </button>
        </div>
      </div>
    </main>
  );
}