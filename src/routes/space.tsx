import { createFileRoute, Link } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/space")({
  head: () => ({
    meta: [
      { title: "Choisir un espace — Legato" },
      { name: "description", content: "Deux manières d'être accompagné·e par Legato." },
    ],
  }),
  component: Space,
});

/* ─── Page de choix entre les deux grands espaces de Legato ───
 * Deux grandes cartes pleine largeur, aplats colorés assumés
 * (bordeaux pour l'émotionnel, bleu nuit pour le pratique). */
function Space() {
  const { name } = useLegato();
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="px-7 pt-10 flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/55"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Legato
          </span>
          <Link
            to="/onboarding"
            className="text-[10px] uppercase tracking-[0.24em] text-dusk/45 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← Retour
          </Link>
        </header>

        <section className="px-7 pt-16">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Bonjour {name || ""}
          </p>
          <h1 className="mt-4 font-serif text-[34px] leading-[1.06] font-light text-dusk text-balance">
            Comment souhaitez-vous être <span className="italic">accompagné·e aujourd'hui&nbsp;?</span>
          </h1>
          <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.6] text-dusk/60">
            Vous pourrez passer d'un espace à l'autre à tout moment.
          </p>
        </section>

        <section className="px-7 pt-12 space-y-4">
          {/* Espace émotionnel — bordeaux */}
          <Link
            to="/home"
            className="block rounded-[18px] overflow-hidden text-[color:var(--paper)] relative"
            style={{ background: "var(--bordeaux)" }}
          >
            <div className="px-6 pt-7 pb-6">
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--paper)]/65"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Espace 01
              </p>
              <p
                className="mt-3 font-serif text-[26px] leading-[1.12]"
                style={{ textWrap: "balance" }}
              >
                Être <span className="italic">accompagné·e</span>
              </p>
              <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--paper)]/75 max-w-[36ch]">
                Pour traverser ce que l'on ressent. Parler, écrire, respirer, garder
                des souvenirs, trouver du soutien.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span
                  className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--paper)]/85"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Entrer
                </span>
                <span className="text-[color:var(--paper)]/75">→</span>
              </div>
            </div>
          </Link>

          {/* Espace pratique — bleu nuit */}
          <Link
            to="/practical"
            className="block rounded-[18px] overflow-hidden text-[color:var(--paper)] relative"
            style={{ background: "var(--navy)" }}
          >
            <div className="px-6 pt-7 pb-6">
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--paper)]/65"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Espace 02
              </p>
              <p
                className="mt-3 font-serif text-[26px] leading-[1.12]"
                style={{ textWrap: "balance" }}
              >
                Organiser <span className="italic">et avancer</span>
              </p>
              <p className="mt-3 text-[13.5px] leading-[1.55] text-[color:var(--paper)]/75 max-w-[36ch]">
                Pour être guidé·e dans les démarches, la cérémonie, les documents, le
                budget et les contacts utiles.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span
                  className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--paper)]/85"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Entrer
                </span>
                <span className="text-[color:var(--paper)]/75">→</span>
              </div>
            </div>
          </Link>
        </section>

        <div className="mt-auto px-7 pt-12 pb-10 text-center">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/40"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Préparer un adieu, garder une présence.
          </p>
        </div>
      </div>
    </main>
  );
}