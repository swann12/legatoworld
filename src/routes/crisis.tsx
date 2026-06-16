import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

export const Route = createFileRoute("/crisis")({
  head: () => ({ meta: [{ title: "Si aujourd'hui pèse trop — Legato" }] }),
  component: Crisis,
});

function Crisis() {
  return (
    <Shell hideNav>
      <div className="relative min-h-dvh flex flex-col bg-paper">
        <div className="relative z-10 flex flex-1 flex-col items-center px-7 pt-10 text-center">
          <Link
            to="/home"
            className="self-start text-[10px] uppercase tracking-[0.3em] text-dusk/55 hover:text-dusk"
            
          >
            ← Accueil
          </Link>

          <div className="mt-14 max-w-[26ch]">
            <p
              className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--terracotta)]"
              
            >
              Ici, doucement
            </p>
            <h1
              className="mt-5 font-serif text-[36px] leading-[1.05] font-light text-dusk"
              style={{ textWrap: "balance" }}
            >
              Vous êtes là, <span className="italic text-dusk/80">c'est déjà beaucoup.</span>
            </h1>
            <p
              className="mt-6 text-[14.5px] leading-[1.6] text-dusk/65 max-w-[28ch] mx-auto"
              style={{ textWrap: "balance" }}
            >
              Respirez avec ce point lumineux. Une porte s'ouvrira quand vous voudrez.
            </p>
          </div>

          <div className="my-14 flex justify-center">
            <div
              className="size-28 rounded-full breath"
              style={{
                background: "radial-gradient(circle at 30% 30%, var(--peach), var(--rose) 70%)",
                animationDuration: "8s",
              }}
            />
          </div>

          <div className="w-full space-y-3 pb-14 text-left">
            <Link
              to="/no-words"
              className="block rounded-[18px] px-6 py-5 text-[color:var(--paper)]"
              style={{ background: "var(--bordeaux)" }}
            >
              <span
                className="block text-[10px] uppercase tracking-[0.28em] text-[color:var(--paper)]/60"
                
              >
                Un souffle, une lumière
              </span>
              <span className="mt-2 block font-serif italic text-[22px]">Respirer, sans parler</span>
            </Link>
            <a
              href="tel:3114"
              className="block rounded-[16px] border border-dusk/15 bg-paper px-6 py-4"
            >
              <span
                className="block text-[10px] uppercase tracking-[0.26em] text-dusk/50"
                
              >
                Écoute gratuite, confidentielle
              </span>
              <span className="mt-1.5 block font-serif italic text-[18px] text-dusk">Une voix humaine</span>
            </a>
            <button className="w-full rounded-[16px] border border-dusk/15 bg-paper px-6 py-4 text-left">
              <span
                className="block text-[10px] uppercase tracking-[0.26em] text-dusk/50"
                
              >
                Quelques mots déjà prêts
              </span>
              <span className="mt-1.5 block font-serif italic text-[18px] text-dusk">Prévenir un proche</span>
            </button>
            <Link to="/home" className="block px-6 py-4 text-center">
              <span
                className="text-[10px] uppercase tracking-[0.26em] text-dusk/50"
                
              >
                Revenir à l'accueil
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}