import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LISTENING_LINES } from "@/lib/listening-lines";
import { PageHeader, IvoryCard } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/crisis")({
  head: () => ({ meta: [{ title: "Si aujourd'hui pèse trop — Legato" }] }),
  component: Crisis,
});

function Crisis() {
  return (
    <Shell hideNav>
      <div className="min-h-dvh flex flex-col" style={{ background: "var(--bordeaux)", color: "var(--blush)" }}>
        <PageHeader title="" />

        <div className="flex flex-1 flex-col items-center px-6 pt-6 text-center">
          <div className="mt-6 max-w-[26ch]">
            <p className="mono-label" style={{ color: "var(--terracotta)" }}>Ici, doucement</p>
            <h1 className="mt-5 font-serif text-[36px] leading-[1.05] font-light" style={{ color: "var(--paper)" }}>
              Vous êtes là, <span className="italic" style={{ color: "var(--blush)" }}>c'est déjà beaucoup.</span>
            </h1>
            <p className="mt-6 text-[14.5px] leading-[1.6] max-w-[28ch] mx-auto" style={{ color: "color-mix(in oklab, var(--blush) 80%, transparent)" }}>
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
              className="block rounded-[18px] px-6 py-5"
              style={{ background: "var(--paper)", color: "var(--dusk)" }}
            >
              <span className="block mono-label" style={{ color: "var(--dusk)" }}>Un souffle, une lumière</span>
              <span className="mt-2 block font-serif italic text-[22px]">Respirer, sans parler</span>
            </Link>
            <a
              href="tel:3114"
              className="block rounded-[16px] border px-6 py-4"
              style={{ borderColor: "color-mix(in oklab, var(--blush) 25%, transparent)", background: "color-mix(in oklab, var(--bordeaux) 90%, black)" }}
            >
              <span className="block mono-label" style={{ color: "color-mix(in oklab, var(--blush) 60%, transparent)" }}>Écoute gratuite, confidentielle</span>
              <span className="mt-1.5 block font-serif italic text-[18px]" style={{ color: "var(--paper)" }}>Une voix humaine</span>
            </a>
            <button className="w-full rounded-[16px] border px-6 py-4 text-left" style={{ borderColor: "color-mix(in oklab, var(--blush) 25%, transparent)", background: "color-mix(in oklab, var(--bordeaux) 90%, black)" }}>
              <span className="block mono-label" style={{ color: "color-mix(in oklab, var(--blush) 60%, transparent)" }}>Quelques mots déjà prêts</span>
              <span className="mt-1.5 block font-serif italic text-[18px]" style={{ color: "var(--paper)" }}>Prévenir un proche</span>
            </button>
            <Link to="/home" className="block px-6 py-4 text-center">
              <span className="mono-label" style={{ color: "color-mix(in oklab, var(--blush) 60%, transparent)" }}>Revenir à l'accueil</span>
            </Link>
          </div>

          <section className="w-full pb-16 text-left">
            <p className="mono-label" style={{ color: "var(--terracotta)" }}>Lignes d'écoute</p>
            <ul className="mt-3 space-y-2">
              {LISTENING_LINES.map((l) => (
                <li key={l.name}>
                  <IvoryCard className="p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-serif text-[16px] text-dusk">{l.name}</p>
                      <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="mono-label text-dusk">
                        {l.phone}
                      </a>
                    </div>
                    <p className="mt-1 text-[12.5px] text-dusk/70">{l.hours} · {l.scope}</p>
                  </IvoryCard>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Shell>
  );
}
