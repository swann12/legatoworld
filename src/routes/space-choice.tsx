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
    <main className="min-h-dvh bg-[#F1ECDE] text-[#2A1410]">
      <div className="mobile-frame relative flex min-h-dvh flex-col px-6 pt-7 pb-8">
        {/* Top bar — fin filet mono, sobre */}
        <header className="flex items-center justify-between border-b border-[#2A1410]/12 pb-4">
          <img
            src={legatoSigle.url}
            alt="Legato"
            className="h-6 w-auto select-none opacity-90"
            draggable={false}
          />
          <span
            className="text-[10px] uppercase tracking-[0.28em] text-[#2A1410]/55"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {name || "Swann"} · aujourd'hui
          </span>
        </header>

        {/* Hero éditorial — serif italique, hiérarchie haute */}
        <section className="pt-12">
          <p
            className="text-[10px] uppercase tracking-[0.32em] text-[#C44B30]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            — Deux espaces
          </p>
          <h1
            className="mt-5 text-[46px] leading-[0.96] tracking-[-0.015em] font-normal text-[#2A1410]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Par où{" "}
            <em className="italic text-[#C44B30]">souhaitez-vous</em>
            <br />
            commencer&nbsp;?
          </h1>
        </section>

        {/* Deux portes — composition asymétrique, sans cartes plaquées */}
        <div className="mt-14 flex flex-col gap-7">
          <button
            type="button"
            onClick={() => choose("psy")}
            className="group block text-left"
          >
            <div className="flex items-baseline justify-between border-t border-[#2A1410]/15 pt-5">
              <span
                className="text-[10px] uppercase tracking-[0.28em] text-[#2A1410]/50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                I — Émotionnel
              </span>
              <span
                aria-hidden
                className="h-2 w-2 rounded-full bg-[#C44B30]"
              />
            </div>
            <p
              className="mt-4 text-[30px] leading-[1.05] tracking-[-0.01em] text-[#2A1410]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Traverser ce que{" "}
              <em className="italic text-[#C44B30]">je ressens.</em>
            </p>
            <p className="mt-3 max-w-[34ch] text-[13px] leading-[1.55] text-[#2A1410]/65">
              Une présence calme, des respirations, le journal.
            </p>
            <span
              className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#C44B30] transition-transform group-hover:translate-x-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Entrer →
            </span>
          </button>

          <button
            type="button"
            onClick={() => choose("concrete")}
            className="group block text-left"
          >
            <div className="flex items-baseline justify-between border-t border-[#2A1410]/15 pt-5">
              <span
                className="text-[10px] uppercase tracking-[0.28em] text-[#2A1410]/50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                II — Pratique
              </span>
              <span
                aria-hidden
                className="h-2 w-2 rounded-full bg-[#5A7BA8]"
              />
            </div>
            <p
              className="mt-4 text-[30px] leading-[1.05] tracking-[-0.01em] text-[#2A1410]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Avancer{" "}
              <em className="italic text-[#5A7BA8]">pas à pas.</em>
            </p>
            <p className="mt-3 max-w-[34ch] text-[13px] leading-[1.55] text-[#2A1410]/65">
              Démarches, documents, organisation — au rythme juste.
            </p>
            <span
              className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#5A7BA8] transition-transform group-hover:translate-x-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Entrer →
            </span>
          </button>
        </div>

        {/* Pied — note discrète */}
        <p
          className="mt-auto pt-12 text-[10px] uppercase tracking-[0.28em] text-[#2A1410]/45"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Vous changez d'espace quand vous voulez.
        </p>
      </div>
    </main>
  );
}