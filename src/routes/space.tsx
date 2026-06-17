import { createFileRoute, Link } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";
import { LegatoMark } from "@/components/legato/LegatoMark";
import type { ReactNode } from "react";

export const Route = createFileRoute("/space")({
  head: () => ({
    meta: [
      { title: "Choisir un espace — Legato" },
      { name: "description", content: "Deux espaces distincts : prendre soin de soi, ou organiser et avancer." },
    ],
  }),
  component: Space,
});

/** Page centrale du produit. Deux blocs très lisibles. Rien d'autre. */
function Space() {
  const { name } = useLegato();
  const careTarget = "/home";
  const practicalTarget = "/practical";
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="pt-9 px-6 flex justify-center">
          <LegatoMark to="/space" size={24} />
        </header>

        <section className="px-7 pt-20 text-center">
          {name && (
            <p className="mono-label tracking-[0.18em] text-dusk/60">
              Bonjour, {name}
            </p>
          )}
          <h1 className="mt-7 font-serif font-normal text-[38px] leading-[1.05] tracking-[-0.01em] text-dusk">
            De quoi avez-vous
            <br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>besoin</span>&nbsp;?
          </h1>
          <p className="mt-6 mx-auto max-w-[28ch] text-[13.5px] leading-[1.6] text-dusk/65">
            Choisissez un espace. Vous pourrez passer
            de l'un à l'autre à tout moment.
          </p>
        </section>

        <section className="px-7 pt-16 flex-1 flex flex-col justify-center gap-3">
          <SpaceChoice
            to={careTarget}
            num="01"
            label="Espace de soi"
            title="Prendre soin de soi"
            hint="Ressentir, écrire, respirer."
          />
          <SpaceChoice
            to={practicalTarget}
            num="02"
            label="Espace démarches"
            title="Organiser et avancer"
            hint="Étapes, documents, cérémonie."
          />
        </section>

        <footer className="px-7 pt-10 pb-10 text-center">
          <p className="mono-label tracking-[0.22em] text-dusk/45">
            LEGATO
          </p>
        </footer>
      </div>
    </main>
  );
}

function SpaceChoice({
  to, num, label, title, hint,
}: {
  to: string;
  num: string;
  label: string;
  title: string;
  hint: string;
}) {
  return (
    <Link
      to={to as "/home"}
      className="group block rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-6 py-5 transition-colors hover:border-dusk/25"
    >
      <div className="flex items-center gap-5">
        <span className="font-mono text-[11px] tracking-[0.18em] text-dusk/45 w-6">{num}</span>
        <div className="flex-1 min-w-0">
          <p className="mono-label text-dusk/55">{label}</p>
          <p className="mt-1.5 font-serif text-[22px] leading-[1.15] text-dusk">{title}</p>
          <p className="mt-1 text-[12.5px] text-dusk/55">{hint}</p>
        </div>
        <span className="text-dusk/40 text-[18px] transition-transform group-hover:translate-x-0.5">→</span>
      </div>
    </Link>
  );
}