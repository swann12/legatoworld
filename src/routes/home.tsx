import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, Section } from "@/components/legato/Shell";
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
  const isPractical = branch === "practical";
  const isCocoon = mode === "cocoon";
  const isAnchoring = mode === "anchoring";
  const isBreath = mode === "breath";
  const isRelay = mode === "relay";

  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant={isBreath ? "calm" : isCocoon ? "rich" : "default"} />

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

          {/* greeting — generously aired */}
          <header className={`px-7 ${isCocoon ? "pt-20" : isBreath ? "pt-16" : "pt-14"}`}>
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
              Aujourd'hui, lentement
            </p>
            <h1 className="mt-4 font-serif text-[2.4rem] leading-[1.05] font-light text-dusk text-balance">
              {name},<br />
              <span className="italic text-dusk/85">posez-vous ici</span> un moment.
            </h1>
            <p className="mt-5 max-w-[34ch] text-[14.5px] leading-relaxed text-dusk/60">
              Tenu·e en <span className="italic">{modeMeta.label.toLowerCase()}</span>, avec{" "}
              <span className="italic">{branchMeta.label.toLowerCase()}</span> tout près.
            </p>
          </header>

          {/* Mode chips — always visible, but compact */}
          <div className={`${isCocoon ? "mt-12" : "mt-9"}`}>
            <ModeSelector compact />
          </div>

          {/* PRIMARY ACTION — speak to the AI Presence. One clear entry. */}
          <Section className={`${isCocoon ? "mt-12" : "mt-10"}`}>
            <Link
              to="/presence"
              className="ceramic organic-radius-3 block p-7 relative overflow-hidden"
            >
              <div
                className="absolute -right-10 -top-10 size-40 rounded-full opacity-60 halo"
                style={{ background: "radial-gradient(circle, var(--peach), transparent 70%)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="relative size-16 rounded-full ceramic-soft flex items-center justify-center shrink-0">
                    <div
                      className="size-7 rounded-full breath"
                      style={{ background: "radial-gradient(circle, var(--peach), var(--rose))" }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">
                      Parler à la Présence
                    </p>
                    <h3 className="mt-1 font-serif text-[1.55rem] italic text-dusk leading-tight">
                      Quelques minutes tranquilles
                    </h3>
                  </div>
                </div>
                <p className="mt-5 text-[13.5px] leading-relaxed text-dusk/65 max-w-[32ch]">
                  Une petite présence qui écoute. Aucune tâche, à votre rythme.
                </p>
                <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-dusk/55">
                  Entrer →
                </p>
              </div>
            </Link>
          </Section>

          {/* Practical companion: only if relevant. Distinct, calm. */}
          {isPractical && (
            <Section className="mt-5">
              <Link
                to="/practical"
                className="paper-card block p-6"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
                  Accompagnement concret
                </p>
                <p className="mt-1.5 font-serif text-lg italic text-dusk leading-snug">
                  Étape par étape, pour les premiers jours.
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-dusk/55">Ouvrir →</p>
              </Link>
            </Section>
          )}

          {/* Mode-aware secondary surface — distinct rhythm per mode */}
          {isCocoon && (
            <Section className="mt-12">
              {/* Cocoon: a single soft secondary, lots of air */}
              <Link to="/no-words" className="paper-card block p-6 text-center">
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Sans mots</p>
                <p className="mt-2 font-serif text-xl italic text-dusk">Être là, simplement.</p>
              </Link>
            </Section>
          )}

          {isAnchoring && (
            <Section className="mt-8 space-y-3">
              {/* Anchoring: structured, repérant */}
              <SecondaryRow to="/garden" eyebrow="Le Jardin" title="Trois traces s'y sont déposées." />
              <SecondaryRow to="/dates" eyebrow="Dates sensibles" title="Un anniversaire dans 12 jours." />
              <SecondaryRow to="/no-words" eyebrow="Sans mots" title="Être là, simplement." />
              <SecondaryRow to="/help" eyebrow="Aide concrète" title="Des mains, tout près." />
            </Section>
          )}

          {isBreath && (
            <Section className="mt-12 grid grid-cols-2 gap-3">
              <Link to="/garden" className="paper-card p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Le Jardin</p>
                <p className="mt-2 font-serif text-lg italic text-dusk">Flâner.</p>
              </Link>
              <Link to="/no-words" className="paper-card p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Sans mots</p>
                <p className="mt-2 font-serif text-lg italic text-dusk">Respirer.</p>
              </Link>
            </Section>
          )}

          {isRelay && (
            <Section className="mt-8 space-y-3">
              <SecondaryRow to="/help" eyebrow="Aide & relais" title="Demander à quelqu'un, simplement." />
              <SecondaryRow to="/practical" eyebrow="Pratique" title="Démarches, étape par étape." />
              <SecondaryRow to="/garden" eyebrow="Le Jardin" title="Garder une trace." />
            </Section>
          )}

          {/* Always-visible quiet door */}
          <Section className="mt-12">
            <Link
              to="/crisis"
              className="block border-t border-dusk/10 pt-6 flex items-baseline justify-between"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">
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

function SecondaryRow({
  to, eyebrow, title,
}: { to: "/garden" | "/dates" | "/no-words" | "/help" | "/practical"; eyebrow: string; title: string }) {
  return (
    <Link to={to} className="paper-card p-5 flex items-baseline justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">{eyebrow}</p>
        <p className="mt-1 font-serif text-lg italic text-dusk leading-snug">{title}</p>
      </div>
      <span className="text-dusk/40 text-sm">→</span>
    </Link>
  );
}