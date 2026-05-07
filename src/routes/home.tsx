import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { ModeSelector } from "@/components/legato/ModeSelector";
import { useLegato, MODES, BRANCHES } from "@/lib/legato-state";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Accueil — Legato" },
      { name: "description", content: "Votre intérieur tranquille, aujourd'hui." },
    ],
  }),
  component: Home,
});

function Home() {
  const { name, mode, branch } = useLegato();
  const modeMeta = MODES.find((m) => m.id === mode)!;
  const branchMeta = BRANCHES.find((b) => b.id === branch)!;

  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="rich" />

        <div className="relative z-10">
          {/* top bar */}
          <div className="flex items-center justify-between px-7 pt-10">
            <span className="font-serif text-xl italic text-dusk">Legato</span>
            <Link
              to="/space"
              className="ceramic-soft size-10 rounded-full flex items-center justify-center"
            >
              <span className="font-serif italic text-sm text-dusk">
                {name.charAt(0).toUpperCase()}
              </span>
            </Link>
          </div>

          {/* greeting */}
          <ScreenHeader
            eyebrow="Aujourd'hui, lentement"
            title={
              <>
                {name},<br />
                <span className="italic text-dusk/85">posez-vous ici</span> un moment.
              </>
            }
            subtitle={
              <>
                Tenu·e en <span className="italic">{modeMeta.label.toLowerCase()}</span>, avec
                {" "}
                <span className="italic">{branchMeta.label.toLowerCase()}</span> tout près.
              </>
            }
          />

          {/* mode chips */}
          <div className="mt-10">
            <ModeSelector compact />
          </div>

          {/* featured presence card */}
          <Section className="mt-10">
            <Link
              to="/presence"
              className="ceramic organic-radius-3 block p-7 relative overflow-hidden"
            >
              <div
                className="absolute -right-10 -top-10 size-40 rounded-full opacity-60 halo"
                style={{ background: "radial-gradient(circle, var(--peach), transparent 70%)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="relative size-16 rounded-full ceramic-soft flex items-center justify-center">
                    <div
                      className="size-7 rounded-full breath"
                      style={{ background: "radial-gradient(circle, var(--peach), var(--rose))" }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
                      Présence
                    </p>
                    <h3 className="font-serif text-2xl italic text-dusk leading-tight">
                      Quelques minutes tranquilles
                    </h3>
                  </div>
                </div>
                <p className="mt-5 text-[13.5px] leading-relaxed text-dusk/65 max-w-[32ch]">
                  Aucune tâche. Juste une petite présence qui écoute, à votre rythme.
                </p>
                <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-dusk/55">
                  Entrer →
                </p>
              </div>
            </Link>
          </Section>

          {/* secondary trio */}
          <Section className="mt-5">
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/garden"
                className="ceramic-soft organic-radius-3 p-5 col-span-2 flex items-center gap-4"
              >
                <div className="relative size-14 shrink-0 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, var(--sage), var(--mist))",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
                    Le Jardin
                  </p>
                  <p className="font-serif text-lg italic text-dusk">
                    Trois traces s'y sont déposées.
                  </p>
                </div>
                <span className="text-dusk/40">→</span>
              </Link>

              <Link to="/no-words" className="ceramic-soft organic-radius-3 p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
                  Sans mots
                </p>
                <p className="mt-2 font-serif text-lg text-dusk">Être là, simplement.</p>
              </Link>

              <Link to="/help" className="ceramic-soft organic-radius-3 p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
                  Aide concrète
                </p>
                <p className="mt-2 font-serif text-lg text-dusk">Des mains, tout près.</p>
              </Link>
            </div>
          </Section>

          <Section className="mt-8">
            <Link
              to="/dates"
              className="block border-t border-dusk/10 pt-6 flex items-baseline justify-between"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
                  Dates sensibles
                </p>
                <p className="mt-1 font-serif text-base italic text-dusk">
                  Un anniversaire dans 12 jours
                </p>
              </div>
              <span className="text-dusk/40 text-sm">→</span>
            </Link>
          </Section>

          <Section className="mt-3">
            <Link
              to="/crisis"
              className="block border-t border-dusk/10 pt-6 flex items-baseline justify-between"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
                  Si aujourd'hui est trop
                </p>
                <p className="mt-1 font-serif text-base italic text-dusk">
                  Une petite porte, calme
                </p>
              </div>
              <span className="text-dusk/40 text-sm">→</span>
            </Link>
          </Section>
        </div>
      </div>
    </Shell>
  );
}