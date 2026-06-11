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

/* ─── Page de choix — direction éditoriale Co-Star × mockup Legato ───
 * Fond crème, gros titre serif, deux cartes pleines couleur (terracotta
 * + rose poudré). Aucune ombre, aucune décoration superflue. */
function Space() {
  const { name } = useLegato();
  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        <header className="px-7 pt-10 flex items-center justify-between">
          <span className="font-serif text-[22px] text-dusk leading-none">Legato</span>
          <Link
            to="/onboarding"
            className="text-[12px] tracking-wide text-dusk/70 hover:text-dusk underline underline-offset-4"
          >
            Retour
          </Link>
        </header>

        <section className="px-7 pt-14">
          <h1 className="font-serif text-[42px] leading-[1.02] font-light text-dusk text-balance">
            Un lieu calme<br />pour <span className="italic">souffler.</span>
          </h1>
          <p className="mt-5 max-w-[30ch] text-[14.5px] leading-[1.55] text-dusk/65">
            {name ? `Bonjour ${name}. ` : ""}Choisissez un espace.
            Vous pourrez changer à tout moment.
          </p>
        </section>

        <section className="px-5 pt-10 space-y-4">
          <ChoiceCard
            to="/home"
            bg="var(--terracotta)"
            title={<>Parler à<br /><span className="italic">quelqu'un</span></>}
            label="ÊTRE ÉCOUTÉ·E"
          />
          <ChoiceCard
            to="/practical"
            bg="var(--blush)"
            fg="var(--dusk)"
            title={<>Comprendre<br />mes <span className="italic">démarches</span></>}
            label="Y VOIR PLUS CLAIR"
            dark={false}
          />
        </section>

        <div className="mt-auto px-7 pt-14 pb-10">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/40 text-center"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Préparer un adieu, garder une présence.
          </p>
        </div>
      </div>
    </main>
  );
}

function ChoiceCard({
  to, bg, fg = "var(--paper)", title, label, dark = true,
}: {
  to: string;
  bg: string;
  fg?: string;
  title: React.ReactNode;
  label: string;
  dark?: boolean;
}) {
  return (
    <Link
      to={to}
      className="block rounded-[22px] overflow-hidden"
      style={{ background: bg, color: fg }}
    >
      <div className="px-7 pt-9 pb-7 flex flex-col min-h-[230px]">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-[34px] leading-[1.04] font-light">
            {title}
          </h2>
          <span className="text-[24px] leading-none translate-y-2 opacity-80">→</span>
        </div>
        <p
          className="mt-auto pt-10 text-[11px] tracking-[0.28em]"
          style={{
            fontFamily: "var(--font-mono)",
            color: dark ? "color-mix(in oklab, var(--paper) 80%, transparent)" : "color-mix(in oklab, var(--dusk) 65%, transparent)",
          }}
        >
          {label}
        </p>
      </div>
    </Link>
  );
}