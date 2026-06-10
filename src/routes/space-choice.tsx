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
    <main className="min-h-dvh bg-[#F2EDE4] text-[#1A1614]">
      <div className="mobile-frame relative flex min-h-dvh flex-col bg-[#F7F2EA] p-8">
        {/* Header */}
        <header className="flex items-baseline justify-between mb-20">
          <img
            src="/legato-logo-noir.png"
            alt="Legato"
            className="h-7 w-auto select-none"
            draggable={false}
          />
          <span
            className="text-[10px] uppercase tracking-widest text-[#1A1614]/60"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Bonjour {name || "Swann"}
          </span>
        </header>

        {/* Hero Question */}
        <section className="mb-24">
          <h1
            className="text-[38px] leading-[1.1] tracking-tight font-normal"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Comment souhaitez-vous <br />
            <span className="italic">être accompagné·e ?</span>
          </h1>
        </section>

        {/* Options as Chapters */}
        <div className="flex-1 flex flex-col gap-20 relative">
          {/* Vertical hairline */}
          <div className="absolute left-2 top-2 bottom-8 w-px bg-[#2D3E35]/20" aria-hidden />

          {/* Option I */}
          <button
            type="button"
            onClick={() => choose("psy")}
            className="group pl-10 relative text-left"
          >
            <span
              className="absolute -left-[3px] top-1 text-[11px] font-medium bg-[#F7F2EA] py-1 text-[#A8472A]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              I
            </span>
            <div className="space-y-4">
              <h2
                className="text-3xl leading-tight font-normal"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Traverser ce que <br />je ressens.
              </h2>
              <p
                className="text-sm text-[#1A1614]/70 max-w-[240px] leading-relaxed"
                style={{ fontFamily: "var(--font-sans, 'Inter Tight'), Inter, sans-serif" }}
              >
                Écrire, respirer, parler, faire vivre les souvenirs, trouver du soutien.
              </p>
              <span
                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest pt-2 border-b border-[#A8472A]/60 text-[#A8472A] font-normal"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Entrer
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </button>

          {/* Option II */}
          <button
            type="button"
            onClick={() => choose("concrete")}
            className="group pl-10 relative text-left"
          >
            <span
              className="absolute -left-[3px] top-1 text-[11px] font-medium bg-[#F7F2EA] py-1 text-[#2D5C46]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              II
            </span>
            <div className="space-y-4">
              <h2
                className="text-3xl leading-tight font-normal"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Être guidé·e pas à pas dans les démarches.
              </h2>
              <p
                className="text-sm text-[#1A1614]/70 max-w-[240px] leading-relaxed"
                style={{ fontFamily: "var(--font-sans, 'Inter Tight'), Inter, sans-serif" }}
              >
                Priorités du jour, documents, cérémonie, professionnels, budget.
              </p>
              <span
                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest pt-2 border-b border-[#2D5C46]/60 text-[#2D5C46] font-normal"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Entrer
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </button>
        </div>

        {/* Footer micro-label */}
        <footer className="mt-auto pt-8">
          <p className="text-[11px] text-[#1A1614]/40">
            Vous pourrez changer d'espace à tout moment.
          </p>
        </footer>
      </div>
    </main>
  );
}