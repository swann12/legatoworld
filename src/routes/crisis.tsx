import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

export const Route = createFileRoute("/crisis")({
  head: () => ({ meta: [{ title: "Si aujourd'hui pèse trop — Legato" }] }),
  component: Crisis,
});

function Crisis() {
  return (
    <Shell hideNav>
      <div
        className="relative min-h-dvh flex flex-col"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--rose) 18%, var(--paper)), var(--paper) 60%)",
        }}
      >
        <div
          aria-hidden
          className="halo-lg absolute -top-24 left-1/2 -translate-x-1/2 size-96 rounded-full opacity-55 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--rose), transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-1 flex-col px-8 pt-10">
          <Link to="/home" className="text-[11px] uppercase tracking-[0.22em] text-dusk/55 hover:text-dusk">← Accueil</Link>

          <div className="mt-14 max-w-[30ch]">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-dusk/45">
              <span className="h-px w-6 bg-dusk/20" />
              Ici, doucement
            </div>
            <h1
              className="mt-4 font-serif text-[2.2rem] leading-[1.08] font-light text-dusk"
              style={{ textWrap: "balance" }}
            >
              Vous êtes là.
              <span className="block italic text-dusk/80">C'est déjà beaucoup.</span>
            </h1>
            <p
              className="mt-6 text-[15px] leading-relaxed text-dusk/65 max-w-[34ch]"
              style={{ textWrap: "pretty" }}
            >
              Respirez avec ce point. Une porte s'ouvrira, quand vous voudrez.
            </p>
          </div>

          <div className="my-14 flex justify-center">
            <div
              className="size-32 rounded-full breath"
              style={{
                background: "radial-gradient(circle at 30% 30%, var(--peach), var(--rose) 70%)",
                boxShadow: "inset 0 2px 6px rgba(255,255,255,0.7), 0 22px 50px -16px rgba(120,60,60,0.3)",
                animationDuration: "8s",
              }}
            />
          </div>

          <div className="space-y-3 pb-14">
            <Link to="/no-words" className="ceramic organic-radius-3 block px-7 py-5 text-center">
              <span className="font-serif text-xl italic text-dusk">Respirer, sans parler</span>
              <span className="block mt-1 text-[11px] uppercase tracking-[0.22em] text-dusk/55">
                Un son, une lumière, le souffle
              </span>
            </Link>
            <a href="tel:3114" className="ceramic-soft organic-radius-3 block px-7 py-5 text-center">
              <span className="font-serif text-lg italic text-dusk">Une voix humaine</span>
              <span className="block mt-1 text-[11px] uppercase tracking-[0.22em] text-dusk/55">
                Ligne d'écoute · gratuite et confidentielle
              </span>
            </a>
            <button className="ceramic-soft organic-radius-3 w-full px-7 py-5 text-center">
              <span className="font-serif text-lg italic text-dusk">Prévenir un proche</span>
              <span className="block mt-1 text-[11px] uppercase tracking-[0.22em] text-dusk/55">
                Quelques mots déjà prêts
              </span>
            </button>
            <Link to="/home" className="block px-7 py-4 text-center">
              <span className="text-[12px] uppercase tracking-[0.2em] text-dusk/50">
                Revenir à l'accueil
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}