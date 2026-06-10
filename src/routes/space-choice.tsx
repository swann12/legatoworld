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
    <main className="min-h-dvh bg-[#EDE6CC] text-[#2A1410]">
      <div className="mobile-frame relative flex min-h-dvh flex-col bg-[#F6EFD2] p-8">
        {/* Header */}
        <header className="flex items-baseline justify-between mb-20">
          <img
            src="/legato-logo-noir.png"
            alt="Legato"
            className="h-7 w-auto select-none"
            draggable={false}
          />
          <span
            className="text-[10px] uppercase tracking-widest text-[#6C2C25]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Bonjour {name || "Swann"}
          </span>
        </header>

        {/* Hero Question */}
        <section className="mb-24">
          <h1
            className="text-[38px] leading-[1.1] tracking-tight font-normal text-[#2A1410]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Comment souhaitez-vous <br />
            <span className="italic text-[#EB5E3A]">être accompagné·e ?</span>
          </h1>
        </section>

        {/* Options as Chapters */}
        <div className="flex-1 flex flex-col gap-20 relative">
          {/* Vertical hairline */}
          <div className="absolute left-2 top-2 bottom-8 w-px bg-[#6C2C25]/30" aria-hidden />

          {/* Option I */}
          <button
            type="button"
            onClick={() => choose("psy")}
            className="group pl-10 relative text-left"
          >
            <span
              aria-hidden
              className="absolute -left-[7px] -top-3 block h-2.5 w-2.5 rounded-full bg-[#EB5E3A]"
            />
            <span
              className="absolute -left-[3px] top-1 text-[11px] font-medium bg-[#F6EFD2] py-1 px-1 text-[#EB5E3A]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              I
            </span>
            <div className="space-y-4">
              <h2
                className="text-3xl leading-tight font-normal text-[#6C2C25]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Traverser ce que <br />je ressens.
              </h2>
              <p
                className="text-sm text-[#2A1410]/75 max-w-[240px] leading-relaxed"
                style={{ fontFamily: "var(--font-sans, 'Inter Tight'), Inter, sans-serif" }}
              >
                Écrire, respirer, parler, faire vivre les souvenirs, trouver du soutien.
              </p>
              <span
                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest pt-2 border-b border-[#EB5E3A]/70 text-[#EB5E3A] font-normal"
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
              aria-hidden
              className="absolute -left-[7px] -top-3 block h-2.5 w-2.5 rounded-full bg-[#7CA2E0]"
            />
            <span
              className="absolute -left-[3px] top-1 text-[11px] font-medium bg-[#F6EFD2] py-1 px-1 text-[#3E6FA8]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              II
            </span>
            <div className="space-y-4">
              <h2
                className="text-3xl leading-tight font-normal text-[#6C2C25]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Être guidé·e pas à pas dans les démarches.
              </h2>
              <p
                className="text-sm text-[#2A1410]/75 max-w-[240px] leading-relaxed"
                style={{ fontFamily: "var(--font-sans, 'Inter Tight'), Inter, sans-serif" }}
              >
                Priorités du jour, documents, cérémonie, professionnels, budget.
              </p>
              <span
                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest pt-2 border-b border-[#3E6FA8]/70 text-[#3E6FA8] font-normal"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Entrer
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </button>
        </div>

        {/* Footer micro-label */}
        <footer className="mt-auto pt-8 flex items-center gap-3">
          <span aria-hidden className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EB5E3A]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#7CA2E0]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#6C2C25]" />
          </span>
          <p className="text-[11px] text-[#6C2C25]/70">
            Vous pourrez changer d'espace à tout moment.
          </p>
        </footer>
      </div>
    </main>
  );
}