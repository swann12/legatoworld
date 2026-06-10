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
    <main className="min-h-dvh bg-[#F7F2E6] text-[#2A1410]">
      <div className="mobile-frame relative flex min-h-dvh flex-col bg-[#FBF7EC] px-6 pt-7 pb-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <img
            src={legatoSigle.url}
            alt="Legato"
            className="h-7 w-auto select-none"
            draggable={false}
          />
          <span
            className="inline-flex items-center gap-2 rounded-full bg-[#EB5E3A]/10 px-3 py-1.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#EB5E3A]" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#6C2C25]/70">
              Bonjour {name || "Swann"}
            </span>
          </span>
        </header>

        {/* Hero question */}
        <section className="mt-14">
          <p
            className="text-[10px] uppercase tracking-[0.24em] text-[#6C2C25]/55"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Aujourd'hui
          </p>
          <h1
            className="mt-3 text-[32px] leading-[1.1] tracking-tight font-normal text-[#2A1410]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Comment souhaitez-vous{" "}
            <span className="italic text-[#EB5E3A]">être accompagné·e&nbsp;?</span>
          </h1>
        </section>

        {/* Two chapter cards */}
        <div className="mt-10 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => choose("psy")}
            className="group flex items-center gap-4 rounded-2xl border border-[#EB5E3A]/15 bg-[#EB5E3A]/[0.06] p-5 text-left transition-colors hover:bg-[#EB5E3A]/[0.1] active:scale-[0.995]"
          >
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EB5E3A] text-[13px] text-[#FBF7EC]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              I
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span
                className="text-[10px] uppercase tracking-[0.22em] text-[#EB5E3A]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Émotionnel
              </span>
              <span
                className="mt-1 text-[19px] leading-tight text-[#2A1410]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Traverser ce que je ressens.
              </span>
            </span>
            <span
              aria-hidden
              className="text-[#EB5E3A] transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>

          <button
            type="button"
            onClick={() => choose("concrete")}
            className="group flex items-center gap-4 rounded-2xl border border-[#3E6FA8]/15 bg-[#3E6FA8]/[0.06] p-5 text-left transition-colors hover:bg-[#3E6FA8]/[0.1] active:scale-[0.995]"
          >
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3E6FA8] text-[13px] text-[#FBF7EC]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              II
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span
                className="text-[10px] uppercase tracking-[0.22em] text-[#3E6FA8]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Pratique
              </span>
              <span
                className="mt-1 text-[19px] leading-tight text-[#2A1410]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Avancer pas à pas.
              </span>
            </span>
            <span
              aria-hidden
              className="text-[#3E6FA8] transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>
        </div>

        {/* Footer */}
        <p
          className="mt-auto pt-8 text-center text-[10px] uppercase tracking-[0.22em] text-[#6C2C25]/55"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Vous pourrez changer d'espace à tout moment.
        </p>
      </div>
    </main>
  );
}