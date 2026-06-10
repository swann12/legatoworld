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
      <div className="mobile-frame relative flex min-h-dvh flex-col bg-[#F5EFE2] px-7 pt-8 pb-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
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

        {/* Question */}
        <section className="mb-8">
          <p
            className="text-[10px] uppercase tracking-[0.22em] text-[#EB5E3A] mb-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Choix d'espace
          </p>
          <h1
            className="text-[32px] leading-[1.08] tracking-tight font-normal text-[#2A1410]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Comment souhaitez-vous{" "}
            <span className="italic text-[#6C2C25]">être accompagné·e ?</span>
          </h1>
        </section>

        {/* Two clear cards */}
        <div className="flex flex-col gap-4">
          {/* Card I — émotionnel */}
          <button
            type="button"
            onClick={() => choose("psy")}
            className="group rounded-2xl bg-[#FBF6EA] border border-[#EB5E3A]/20 px-5 py-5 text-left transition-colors hover:border-[#EB5E3A]/50"
          >
            <div className="flex items-baseline justify-between mb-3">
              <span
                className="text-[10px] uppercase tracking-[0.22em] text-[#EB5E3A]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                I · Émotionnel
              </span>
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#EB5E3A]" />
            </div>
            <h2
              className="text-[22px] leading-[1.15] font-normal text-[#2A1410]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Traverser ce que je ressens.
            </h2>
            <p
              className="mt-2 text-[13px] leading-[1.5] text-[#2A1410]/65"
              style={{ fontFamily: "var(--font-sans, 'Inter Tight'), Inter, sans-serif" }}
            >
              Écrire, respirer, parler, faire vivre les souvenirs.
            </p>
            <span
              className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#EB5E3A]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Entrer
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </button>

          {/* Card II — pratique */}
          <button
            type="button"
            onClick={() => choose("concrete")}
            className="group rounded-2xl bg-[#F1F4FA] border border-[#3E6FA8]/20 px-5 py-5 text-left transition-colors hover:border-[#3E6FA8]/50"
          >
            <div className="flex items-baseline justify-between mb-3">
              <span
                className="text-[10px] uppercase tracking-[0.22em] text-[#3E6FA8]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                II · Pratique
              </span>
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#7CA2E0]" />
            </div>
            <h2
              className="text-[22px] leading-[1.15] font-normal text-[#2A1410]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Avancer pas à pas dans les démarches.
            </h2>
            <p
              className="mt-2 text-[13px] leading-[1.5] text-[#2A1410]/65"
              style={{ fontFamily: "var(--font-sans, 'Inter Tight'), Inter, sans-serif" }}
            >
              Priorités, documents, cérémonie, professionnels, budget.
            </p>
            <span
              className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#3E6FA8]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Entrer
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </button>
        </div>

        <p
          className="mt-auto pt-8 text-[11px] text-[#6C2C25]/55"
          style={{ fontFamily: "var(--font-sans, 'Inter Tight'), Inter, sans-serif" }}
        >
          Vous pourrez changer d'espace à tout moment.
        </p>
      </div>
    </main>
  );
}