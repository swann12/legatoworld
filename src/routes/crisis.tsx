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
          <Link to="/home" className="self-start eyebrow hover:text-dusk">← Aujourd'hui</Link>

          <div className="mt-14 max-w-[26ch]">
            <p className="eyebrow text-[color:var(--terracotta)]">Ici, doucement</p>
            <h1 className="mt-5 font-serif text-[30px] leading-[1.06] font-light text-dusk text-balance">
              Vous êtes là, c'est déjà beaucoup.
            </h1>
            <p className="mt-5 text-[14px] leading-[1.6] text-dusk/65 max-w-[28ch] mx-auto text-balance">
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
            <Link to="/no-words" className="surface-feature block px-6 py-5">
              <span className="block eyebrow text-[color:var(--paper)]/65">
                Un souffle, une lumière
              </span>
              <span className="mt-2 block font-serif text-[20px] font-light">
                Respirer, sans parler
              </span>
            </Link>
            <a href="tel:3114" className="surface block px-6 py-4">
              <span className="block eyebrow">Écoute gratuite, confidentielle</span>
              <span className="mt-2 block font-serif text-[17px] font-light text-dusk">Une voix humaine</span>
            </a>
            <button className="w-full surface px-6 py-4 text-left">
              <span className="block eyebrow">Quelques mots déjà prêts</span>
              <span className="mt-2 block font-serif text-[17px] font-light text-dusk">Prévenir un proche</span>
            </button>
            <Link to="/home" className="block px-6 py-4 text-center eyebrow hover:text-dusk">
              Revenir à l'aujourd'hui
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}