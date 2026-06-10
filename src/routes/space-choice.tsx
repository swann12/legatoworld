import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLegato } from "@/lib/legato-state";
import legatoSigle from "@/assets/legato-sigle.png.asset.json";

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
    <main className="min-h-dvh bg-[#EFE8D9] text-[#2A1410]">
      <div className="mobile-frame relative flex min-h-dvh flex-col bg-[#F5EFE2] px-6 pt-7 pb-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <img
            src={legatoSigle.url}
            alt="Legato"
            className="h-7 w-auto select-none"
            draggable={false}
          />
          <span
            className="inline-flex items-center gap-2 rounded-full bg-[#EB5E3A]/8 px-3 py-1.5 ring-4 ring-[#F5EFE2]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#EB5E3A]" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#6C2C25]/70">
              Bonjour {name || "Swann"}
            </span>
          </span>
        </header>

        {/* Hero question */}
        <section className="mt-12">
          <span
            className="inline-block rounded-full bg-[#EB5E3A]/12 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#EB5E3A]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Aujourd'hui
          </span>
          <h1
            className="mt-4 text-[34px] leading-[1.08] tracking-tight font-normal text-[#2A1410]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Comment souhaitez-vous{" "}
            <span className="italic text-[#EB5E3A]">être accompagné·e&nbsp;?</span>
          </h1>
        </section>

        {/* Two chapters with vertical hairline */}
        <div className="mt-10 relative">
          <span
            aria-hidden
            className="absolute left-3 top-2 bottom-2 w-px bg-[#6C2C25]/25"
          />

          {/* Option I */}
          <button
            type="button"
            onClick={() => choose("psy")}
            className="group relative block w-full pl-10 pr-2 py-4 text-left"
          >
            <span
              aria-hidden
              className="absolute left-[7px] top-6 h-3 w-3 rounded-full bg-[#EB5E3A] ring-4 ring-[#F5EFE2]"
            />
            <span
              className="inline-flex items-center gap-2 rounded-full bg-[#EB5E3A]/8 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-[#EB5E3A]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              I · Émotionnel
            </span>
            <p
              className="mt-2 text-[20px] leading-snug text-[#2A1410]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Traverser ce que je ressens.
            </p>
            <p className="mt-1 text-[12.5px] leading-snug text-[#2A1410]/60">
              Un espace doux pour mettre des mots, à mon rythme.
            </p>
            <span
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#EB5E3A] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#F5EFE2] transition-transform group-hover:translate-x-0.5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Entrer <span aria-hidden>→</span>
            </span>
          </button>

          {/* Option II */}
          <button
            type="button"
            onClick={() => choose("concrete")}
            className="group relative block w-full pl-10 pr-2 py-4 mt-2 text-left"
          >
            <span
              aria-hidden
              className="absolute left-[7px] top-6 h-3 w-3 rounded-full bg-[#3E6FA8] ring-4 ring-[#F5EFE2]"
            />
            <span
              className="inline-flex items-center gap-2 rounded-full bg-[#3E6FA8]/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-[#3E6FA8]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              II · Pratique
            </span>
            <p
              className="mt-2 text-[20px] leading-snug text-[#2A1410]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Avancer pas à pas dans les démarches.
            </p>
            <p className="mt-1 text-[12.5px] leading-snug text-[#2A1410]/60">
              Une trame claire pour ne rien oublier.
            </p>
            <span
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#3E6FA8] px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#F5EFE2] transition-transform group-hover:translate-x-0.5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Entrer <span aria-hidden>→</span>
            </span>
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-8 flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-[#6C2C25]/60"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Vous pourrez changer d'espace à tout moment.
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EB5E3A]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#3E6FA8]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#6C2C25]/40" />
          </span>
        </footer>
      </div>
    </main>
  );
}