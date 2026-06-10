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
            className="text-[10px] uppercase tracking-[0.22em] text-[#6C2C25]/60"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Bonjour {name || "Swann"}
          </span>
        </header>

        {/* Editorial block */}
        <section className="mt-14">
          <p
            className="text-[10px] uppercase tracking-[0.24em] text-[#6C2C25]/55 mb-5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Choix d'espace
          </p>
          <h1
            className="text-[32px] leading-[1.1] tracking-tight font-normal text-[#2A1410]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Comment souhaitez-vous{" "}
            <span className="italic text-[#6C2C25]">être accompagné·e</span> aujourd'hui&nbsp;?
          </h1>
        </section>

        {/* Two cards */}
        <div className="mt-10 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => choose("psy")}
            className="group relative overflow-hidden rounded-[20px] border border-[#6C2C25]/10 bg-white/60 p-5 text-left transition-all hover:border-[#EB5E3A]/40 hover:bg-white active:scale-[0.995]"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EB5E3A]/12 text-[13px] text-[#EB5E3A]"
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
                  Être accompagné·e
                </span>
                <span className="mt-1.5 text-[12.5px] leading-snug text-[#2A1410]/60">
                  Traverser ce que je ressens, à mon rythme.
                </span>
              </span>
              <span
                aria-hidden
                className="mt-1 text-[#6C2C25]/40 transition-all group-hover:translate-x-0.5 group-hover:text-[#EB5E3A]"
              >
                →
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => choose("concrete")}
            className="group relative overflow-hidden rounded-[20px] border border-[#6C2C25]/10 bg-white/60 p-5 text-left transition-all hover:border-[#3E6FA8]/40 hover:bg-white active:scale-[0.995]"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3E6FA8]/12 text-[13px] text-[#3E6FA8]"
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
                  Organiser &amp; avancer
                </span>
                <span className="mt-1.5 text-[12.5px] leading-snug text-[#2A1410]/60">
                  Avancer pas à pas dans les démarches.
                </span>
              </span>
              <span
                aria-hidden
                className="mt-1 text-[#6C2C25]/40 transition-all group-hover:translate-x-0.5 group-hover:text-[#3E6FA8]"
              >
                →
              </span>
            </div>
          </button>
        </div>

        <p
          className="mt-auto pt-8 text-center text-[11px] text-[#6C2C25]/50"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Vous pourrez changer d'espace à tout moment.
        </p>
      </div>
    </main>
  );
}