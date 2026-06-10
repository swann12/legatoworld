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
      <div className="mobile-frame relative flex min-h-dvh flex-col bg-[#F5EFE2] px-7 pt-8 pb-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <img
            src={legatoSigle.url}
            alt="Legato"
            className="h-8 w-auto select-none"
            draggable={false}
          />
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-[#6C2C25]/70"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Bonjour {name || "Swann"}
          </span>
        </header>

        {/* Editorial block */}
        <section>
          <p
            className="text-[10px] uppercase tracking-[0.22em] text-[#EB5E3A] mb-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Choix d'espace
          </p>
          <h1
            className="text-[34px] leading-[1.08] tracking-tight font-normal text-[#2A1410]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Comment souhaitez-vous{" "}
            <span className="italic text-[#6C2C25]">être accompagné·e</span> aujourd'hui ?
          </h1>
          <p
            className="mt-5 text-[14px] leading-[1.55] text-[#2A1410]/70 max-w-[34ch]"
            style={{ fontFamily: "var(--font-sans, 'Inter Tight'), Inter, sans-serif" }}
          >
            Deux espaces vous accompagnent. Choisissez celui qui vous correspond aujourd'hui — vous pourrez changer à tout moment.
          </p>
        </section>

        {/* Two clean app buttons */}
        <div className="mt-auto pt-12 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => choose("psy")}
            className="group flex items-center justify-between rounded-2xl bg-[#EB5E3A] px-5 py-4 text-left text-[#F5EFE2] transition-transform active:scale-[0.99]"
          >
            <span className="flex flex-col">
              <span
                className="text-[10px] uppercase tracking-[0.22em] opacity-70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                I · Émotionnel
              </span>
              <span
                className="mt-1 text-[18px] leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Être accompagné·e
              </span>
            </span>
            <span
              aria-hidden
              className="text-lg transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>

          <button
            type="button"
            onClick={() => choose("concrete")}
            className="group flex items-center justify-between rounded-2xl bg-[#3E6FA8] px-5 py-4 text-left text-[#F5EFE2] transition-transform active:scale-[0.99]"
          >
            <span className="flex flex-col">
              <span
                className="text-[10px] uppercase tracking-[0.22em] opacity-70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                II · Pratique
              </span>
              <span
                className="mt-1 text-[18px] leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Organiser &amp; avancer
              </span>
            </span>
            <span
              aria-hidden
              className="text-lg transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}