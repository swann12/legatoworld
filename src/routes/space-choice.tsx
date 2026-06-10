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
      <div className="mobile-frame relative flex min-h-dvh flex-col bg-[#F5EFE2] px-8 pt-9 pb-10">
        {/* Header — sigle + greeting, à la Unearth */}
        <header className="flex items-center justify-between mb-14">
          <img
            src={legatoSigle.url}
            alt="Legato"
            className="h-9 w-auto select-none"
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
        <section className="max-w-[26ch]">
          <p
            className="text-[10px] uppercase tracking-[0.22em] text-[#EB5E3A] mb-5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Choix d'espace
          </p>
          <h1
            className="text-[40px] leading-[1.05] tracking-tight font-normal text-[#2A1410]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Comment souhaitez-vous{" "}
            <span className="italic text-[#6C2C25]">être accompagné·e</span> aujourd'hui ?
          </h1>
          <p
            className="mt-6 text-[14px] leading-[1.55] text-[#2A1410]/70 max-w-[34ch]"
            style={{ fontFamily: "var(--font-sans, 'Inter Tight'), Inter, sans-serif" }}
          >
            Deux espaces vous accompagnent. L'un pour traverser ce que vous ressentez, l'autre pour avancer pas à pas dans les démarches.
          </p>
        </section>

        {/* Pills — entrer dans un espace */}
        <section className="mt-auto pt-14">
          <p
            className="text-[26px] leading-[1.1] font-normal text-[#2A1410] mb-5"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Entrer dans un espace.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => choose("psy")}
              className="group inline-flex items-center gap-2 rounded-full border border-[#EB5E3A] bg-[#EB5E3A]/8 px-4 py-2 text-[12px] text-[#EB5E3A] transition-colors hover:bg-[#EB5E3A] hover:text-[#F5EFE2]"
              style={{ fontFamily: "var(--font-sans, 'Inter Tight'), Inter, sans-serif" }}
            >
              <span
                className="text-[9px] uppercase tracking-widest opacity-70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                I
              </span>
              Être accompagné·e
            </button>

            <button
              type="button"
              onClick={() => choose("concrete")}
              className="group inline-flex items-center gap-2 rounded-full border border-[#3E6FA8] bg-[#7CA2E0]/12 px-4 py-2 text-[12px] text-[#3E6FA8] transition-colors hover:bg-[#3E6FA8] hover:text-[#F5EFE2]"
              style={{ fontFamily: "var(--font-sans, 'Inter Tight'), Inter, sans-serif" }}
            >
              <span
                className="text-[9px] uppercase tracking-widest opacity-70"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                II
              </span>
              Organiser &amp; avancer
            </button>
          </div>

          <p
            className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#6C2C25]/55"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Vous pourrez changer à tout moment
          </p>
        </section>
      </div>
    </main>
  );
}