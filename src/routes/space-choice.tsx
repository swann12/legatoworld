import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/space-choice")({
  head: () => ({
    meta: [
      { title: "Choisir un espace — Legato" },
      {
        name: "description",
        content:
          "Deux espaces distincts : être accompagné·e émotionnellement, ou organiser et avancer.",
      },
    ],
  }),
  component: SpaceChoice,
});

function SpaceChoice() {
  const { name, setSpace } = useLegato();
  const navigate = useNavigate();

  const choose = (s: "psy" | "concrete") => {
    setSpace(s);
    navigate({ to: s === "psy" ? "/home" : "/plan" });
  };

  return (
    <main className="min-h-dvh bg-paper text-dusk">
      <div className="mobile-frame relative flex min-h-dvh flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 pt-9 pb-4">
          <span className="font-serif text-[26px] italic leading-none text-dusk">L</span>
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-dusk/45"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Bonjour {name || "Swann"}
          </span>
        </header>

        {/* Question */}
        <section className="px-8 pt-10 pb-8 border-b border-dusk/10">
          <p
            className="text-[10px] uppercase tracking-[0.24em] text-dusk/55"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Aujourd'hui
          </p>
          <h1 className="mt-3 font-serif text-[30px] leading-[1.06] font-light text-dusk text-balance max-w-[20ch]">
            Comment souhaitez-vous être accompagné·e ?
          </h1>
          <p className="mt-3 text-[13px] text-dusk/55">Vous pourrez changer à tout moment.</p>
        </section>

        {/* Deux blocs pleins, contrastes opposés */}
        <div className="flex-1 flex flex-col">
          <button
            type="button"
            onClick={() => choose("psy")}
            className="group flex-1 text-left px-8 py-10 border-b border-dusk/10 transition-colors hover:bg-dusk/[0.02]"
            style={{ background: "var(--paper)" }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.26em] text-dusk/55"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              A · Être accompagné·e
            </p>
            <p className="mt-4 font-serif text-[28px] leading-[1.08] font-light text-dusk text-balance max-w-[22ch]">
              Traverser ce que je ressens.
            </p>
            <p className="mt-3 text-[13.5px] leading-[1.55] text-dusk/65 max-w-[34ch]">
              Écrire, respirer, parler, faire vivre les souvenirs, trouver du soutien.
            </p>
            <span
              className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-dusk"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Entrer
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => choose("concrete")}
            className="group flex-1 text-left px-8 py-10 transition-colors hover:opacity-95"
            style={{ background: "var(--oven)", color: "var(--paper)" }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.26em]"
              style={{ fontFamily: "var(--font-mono)", color: "color-mix(in oklab, var(--paper) 70%, transparent)" }}
            >
              B · Organiser et avancer
            </p>
            <p className="mt-4 font-serif text-[28px] leading-[1.08] font-light text-balance max-w-[22ch]">
              Être guidé·e pas à pas dans les démarches.
            </p>
            <p className="mt-3 text-[13.5px] leading-[1.55] max-w-[34ch]"
               style={{ color: "color-mix(in oklab, var(--paper) 82%, transparent)" }}>
              Priorités du jour, documents, cérémonie, professionnels, budget.
            </p>
            <span
              className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Entrer
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}