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
    <main className="min-h-dvh bg-[#F4EFE3] text-[#2A1410]">
      <div className="mobile-frame relative flex min-h-dvh flex-col bg-[#F4EFE3]">
        {/* Top bar */}
        <header className="flex items-center justify-between px-7 pt-8">
          <img
            src={legatoSigle.url}
            alt="Legato"
            className="h-7 w-auto select-none"
            draggable={false}
          />
          <span
            className="text-[11px] uppercase tracking-[0.18em] text-[#2A1410]/70 underline underline-offset-[5px] decoration-[0.5px]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Menu
          </span>
        </header>

        {/* Hero */}
        <section className="px-7 pt-10">
          <h1
            className="text-[44px] leading-[0.98] tracking-[-0.01em] font-normal text-[#2A1410]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Bonjour {name || "Swann"},
            <br />
            par où commencer&nbsp;?
          </h1>
          <p className="mt-5 max-w-[28ch] text-[14.5px] leading-[1.5] text-[#2A1410]/70">
            Deux espaces, à votre rythme. Vous pouvez passer de l'un à l'autre à tout moment.
          </p>
        </section>

        {/* Two large color blocks */}
        <div className="mt-9 flex flex-col gap-3 px-5">
          <button
            type="button"
            onClick={() => choose("psy")}
            className="group relative flex h-[210px] flex-col justify-between overflow-hidden rounded-[28px] bg-[#C44B30] p-7 text-left text-[#F4EFE3] transition-transform active:scale-[0.99]"
          >
            <h2
              className="text-[34px] leading-[1.02] font-normal max-w-[12ch]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Être accompagné·e
            </h2>
            <div className="flex items-end justify-between">
              <span
                className="text-[10.5px] uppercase tracking-[0.22em] text-[#F4EFE3]/85"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Émotionnel · I
              </span>
              <span
                aria-hidden
                className="text-[28px] leading-none transition-transform group-hover:translate-x-1"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                →
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => choose("concrete")}
            className="group relative flex h-[210px] flex-col justify-between overflow-hidden rounded-[28px] bg-[#E89A8C] p-7 text-left text-[#2A1410] transition-transform active:scale-[0.99]"
          >
            <h2
              className="text-[34px] leading-[1.02] font-normal max-w-[12ch]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Avancer pas à pas
            </h2>
            <div className="flex items-end justify-between">
              <span
                className="text-[10.5px] uppercase tracking-[0.22em] text-[#2A1410]/75"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Pratique · II
              </span>
              <span
                aria-hidden
                className="text-[28px] leading-none transition-transform group-hover:translate-x-1"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                →
              </span>
            </div>
          </button>
        </div>

        {/* Bottom band */}
        <div className="mt-auto bg-[#5A7BA8] px-7 py-7 text-center">
          <p
            className="text-[10.5px] uppercase tracking-[0.24em] leading-[1.7] text-[#F4EFE3]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Vous n'êtes pas seul·e
            <br />
            nous sommes là, en toute confidentialité.
          </p>
        </div>
      </div>
    </main>
  );
}