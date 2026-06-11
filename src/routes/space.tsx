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
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col px-7">
        <header className="pt-10 flex items-center justify-between">
          <span className="font-serif text-[20px] leading-none">Legato</span>
        </header>

        <section className="pt-24">
          <h1 className="font-serif text-[42px] leading-[1.02] font-light text-balance">
            {name ? `${name},` : "Bonjour."}<br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>
              de quoi avez-vous besoin&nbsp;?
            </span>
          </h1>
        </section>

        <section className="pt-14 -mx-7 px-5 space-y-3">
          <Entry
            to="/home"
            bg="var(--terracotta)"
            fg="var(--paper)"
            title="Être accompagné·e"
            sub="Présence, souvenirs, jardin."
          />
          <Entry
            to="/practical"
            bg="var(--blush)"
            fg="var(--dusk)"
            title="Avancer concrètement"
            sub="Démarches, cérémonie, services."
          />
        </section>
      </div>
    </main>
  );
}

function Entry({
  to, bg, fg, title, sub,
}: { to: string; bg: string; fg: string; title: string; sub: string }) {
  return (
    <Link
      to={to}
      className="block rounded-[22px] px-7 py-7"
      style={{ background: bg, color: fg }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-[28px] leading-[1.1] font-light">{title}</h2>
          <p className="mt-1.5 text-[13.5px] opacity-75">{sub}</p>
        </div>
        <span className="text-[22px] opacity-80">→</span>
      </div>
    </Link>
  );
}