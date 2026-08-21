import { createFileRoute, Link } from "@tanstack/react-router";
import { Plate } from "@/components/legato/Plate";
import { Shell } from "@/components/legato/Shell";
import { LISTENING_LINES } from "@/lib/listening-lines";

export const Route = createFileRoute("/crisis")({
  head: () => ({ meta: [{ title: "Ici, doucement — Legato" }] }),
  component: Crisis,
});

function Crisis() {
  return (
    <Shell hideNav>
      <div className="min-h-dvh flex flex-col bg-[color:var(--whisper)] text-dusk">
        <header className="px-6 pt-6 flex items-center justify-between">
          <Link to="/home" aria-label="Retour" className="text-dusk/55 text-lg">←</Link>
          <span />
          <span className="w-5" />
        </header>

        <main className="flex-1 px-6 pt-6 pb-16">
          <section className="max-w-[28ch]">
            <h1 className="font-serif font-normal text-[34px] leading-[1.05]">
              Vous êtes là.<br />
              <span className="italic" style={{ color: "var(--bordeaux)" }}>C'est déjà beaucoup.</span>
            </h1>
            <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/65">
              Quelques portes douces. Choisissez celle qui vous demande le moins d'effort.
            </p>
          </section>

          <Plate name="nuit" caption="La nuit tient, elle aussi" className="mt-7" ratio="1 / 1" />

          {/* Geste 1 — écrire à une Présence */}
          <Link
            to="/presence"
            className="mt-7 block rounded-[20px] px-5 py-5"
            style={{ background: "var(--blush)" }}
          >
            <p className="mono-label text-dusk/60">Une oreille tout de suite</p>
            <p className="mt-2 font-serif text-[20px] leading-[1.15]">Écrire à une Présence</p>
            <p className="mt-1.5 text-[12.5px] text-dusk/60">Sans jugement. Quelques mots suffisent.</p>
          </Link>

          {/* Geste 2 — respirer */}
          <Link
            to="/care/respirer"
            className="mt-3 block rounded-[20px] px-5 py-5"
            style={{ background: "var(--sun)" }}
          >
            <p className="mono-label text-dusk/60">Sans parler</p>
            <p className="mt-2 font-serif text-[20px] leading-[1.15]">Respirer une minute</p>
            <p className="mt-1.5 text-[12.5px] text-dusk/60">Un cercle qui guide votre souffle.</p>
          </Link>

          {/* Geste 3 — appel direct */}
          <a
            href="tel:3114"
            className="mt-3 block rounded-[20px] px-5 py-5"
            style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
          >
            <p className="mono-label" style={{ color: "color-mix(in oklab, var(--paper) 75%, transparent)" }}>
              Maintenant
            </p>
            <p className="mt-2 font-serif text-[24px] leading-[1.1]">
              Appeler le 3114
            </p>
            <p className="mt-2 text-[12.5px]" style={{ color: "color-mix(in oklab, var(--paper) 80%, transparent)" }}>
              Gratuit, confidentiel, 24h/24 — France.
            </p>
          </a>

          {/* Cercles & forums */}
          <section className="mt-10">
            <p className="mono-label text-dusk/55">Ne pas rester seul·e</p>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <Link to="/community" className="block rounded-[18px] px-5 py-4" style={{ background: "var(--whisper)" }}>
                <p className="font-serif text-[17px] leading-[1.15]">Rejoindre un cercle</p>
                <p className="mt-1 text-[12px] text-dusk/60">Forums, groupes de parole et d'écriture, par thématique.</p>
              </Link>
              <Link to="/circle" className="block rounded-[18px] px-5 py-4" style={{ background: "var(--whisper)" }}>
                <p className="font-serif text-[17px] leading-[1.15]">Écrire à un proche</p>
                <p className="mt-1 text-[12px] text-dusk/60">Message automatique, demande de présence, délégation d'une tâche.</p>
              </Link>
            </div>
          </section>

          {/* Lignes d'écoute */}
          <section className="mt-10">
            <p className="mono-label text-dusk/55">Autres lignes d'écoute</p>
            <ul className="mt-4 divide-y divide-dusk/10 rounded-[18px] border border-dusk/10 bg-paper overflow-hidden">
              {LISTENING_LINES.map((l) => (
                <li key={l.name}>
                  <a
                    href={`tel:${l.phone.replace(/\s/g, "")}`}
                    className="flex items-baseline justify-between gap-3 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-serif text-[16px] text-dusk">{l.name}</p>
                      <p className="mt-1 text-[11.5px] text-dusk/55">{l.hours} · {l.scope}</p>
                    </div>
                    <span className="mono-label text-dusk shrink-0">{l.phone}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <Link to="/home" className="mt-10 block text-center mono-label text-dusk/50">
            Revenir à l'accueil
          </Link>
        </main>
      </div>
    </Shell>
  );
}
