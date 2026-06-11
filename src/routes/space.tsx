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

/* Espace — choix entre les deux portes de Legato.
 * Direction : édito Co-Star. Date en mono, grand serif italique,
 * deux entrées numérotées en liste (pas de cartes en aplat). */
function Space() {
  const { name } = useLegato();
  const today = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" })
    .format(new Date()).toUpperCase();

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col px-7">
        <header className="pt-10 flex items-center justify-between">
          <span className="font-serif text-[20px] leading-none">Legato</span>
          <Link
            to="/onboarding"
            className="text-[11px] tracking-[0.18em] text-dusk/55 hover:text-dusk uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Retour
          </Link>
        </header>

        <section className="pt-20">
          <p
            className="text-[10px] uppercase tracking-[0.34em] text-dusk/55"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {today} — {name ? name.toUpperCase() : "VOUS"}
          </p>
          <h1 className="mt-6 font-serif text-[40px] leading-[1.04] font-light text-balance">
            Par où voulez-vous{" "}
            <span className="italic" style={{ color: "var(--terracotta)" }}>entrer</span>{" "}
            aujourd'hui&nbsp;?
          </h1>
        </section>

        <section className="pt-16 border-t border-dusk/15 mt-12">
          <Entry
            number="01"
            to="/home"
            title={<>Le <span className="italic">dedans</span>.</>}
            note="Quand quelque chose bouge et qu'il n'y a pas encore de mots."
          />
          <Entry
            number="02"
            to="/practical"
            title={<>Le <span className="italic">concret</span>.</>}
            note="Quand il y a des décisions, des papiers, des gens à prévenir."
          />
        </section>

        <p
          className="mt-auto pb-10 pt-16 text-[10px] uppercase tracking-[0.3em] text-dusk/40"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          L'un n'exclut pas l'autre. Vous reviendrez ici quand vous voudrez.
        </p>
      </div>
    </main>
  );
}

function Entry({
  number, to, title, note,
}: { number: string; to: string; title: React.ReactNode; note: string }) {
  return (
    <Link
      to={to}
      className="block group py-8 border-b border-dusk/15"
    >
      <div className="flex items-baseline gap-6">
        <span
          className="text-[11px] tracking-[0.24em] text-dusk/45 w-8 shrink-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {number}
        </span>
        <div className="flex-1">
          <h2 className="font-serif text-[32px] leading-[1.05] font-light">
            {title}
          </h2>
          <p className="mt-3 text-[14px] leading-[1.55] text-dusk/65 max-w-[34ch]">
            {note}
          </p>
        </div>
        <span
          className="text-dusk/40 group-hover:text-[color:var(--terracotta)] transition-colors text-[18px]"
        >
          →
        </span>
      </div>
    </Link>
  );
}