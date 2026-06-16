import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/help/")({
  head: () => ({ meta: [{ title: "Aide et accompagnement — Legato" }] }),
  component: Help,
});

type HelpItem = {
  kind: string;
  title: string;
  body: string;
  to: "/practical" | "/resources" | "/help/corps" | "/community" | "/crisis" | "/presence";
  tint: string;
};

/* Choses concrètes — chaque entrée mène à une vraie page qui accompagne. */
const PRACTICAL: HelpItem[] = [
  { kind: "Le corps",     title: "Quand le corps oublie de manger", body: "Cinq petites choses que l'on peut avaler sans y penser.",     to: "/help/corps", tint: "var(--peach)" },
  { kind: "Le corps",     title: "L'eau et le corps",               body: "Se laver, une étape à la fois — sans aucune obligation.",     to: "/help/corps", tint: "var(--mist)" },
  { kind: "Le corps",     title: "S'habiller",                       body: "Trouver la chose la plus douce, aujourd'hui.",                to: "/help/corps", tint: "var(--blush)" },
  { kind: "Sommeil",      title: "Les nuits qui n'en finissent pas", body: "Ce que d'autres ont fait à 3 h du matin.",                   to: "/help/corps", tint: "var(--lavender)" },
  { kind: "Administratif",title: "Ce qu'il faut résilier ou prévenir", body: "Une liste douce. Banque, abonnements, la poste.",          to: "/practical",  tint: "var(--sun)" },
];

const RELAY: HelpItem[] = [
  { kind: "Un·e proche",   title: "Demander à quelqu'un de prendre une tâche", body: "Transmettre une demande simple et claire — nous écrivons le message pour vous.", to: "/presence",  tint: "var(--sage)" },
  { kind: "Un·e pro",      title: "Ressources et accompagnement",               body: "Thérapeutes du deuil, près de chez vous, par région et par langue.",            to: "/resources", tint: "var(--terracotta)" },
  { kind: "Une communauté",title: "Petit cercle, chaque semaine",               body: "Groupes en ligne — perte d'une personne, d'un animal, ou deuil anticipé.",      to: "/community", tint: "var(--azure)" },
];

function Help() {
  const { mode } = useLegato();
  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          {/* Bouton retour — page accessible directement, on ramène à l'accueil
              du mode courant (qui est /home) plutôt que de laisser la personne
              coincée. */}
          <div className="px-7 pt-10">
            <Link
              to="/home"
              className="text-[11px] uppercase tracking-[0.22em] text-dusk/55 hover:text-dusk transition-colors"
            >
              ← Accueil
            </Link>
          </div>

          <ScreenHeader
            eyebrow="Aide — concrète, tranquille"
            title={<>Demander de l'aide, <br /><span className="italic" style={{ color: "var(--terracotta)" }}>sans s'expliquer trop.</span></>}
            subtitle="Des portes simples pour soi, pour déléguer, ou pour être accompagné·e sans pression."
          />

          <Section className="mt-10">
            <p
              className="text-[10px] uppercase tracking-[0.22em] text-dusk/55 mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Choses concrètes — pour soi
            </p>
            <div className="grid grid-cols-2 gap-3">
              {PRACTICAL.map((p, i) => (
                <Link
                  key={p.title}
                  to={p.to}
                  className={`rounded-[16px] p-5 border border-dusk/8 flex flex-col justify-between hover:-translate-y-0.5 transition-transform ${
                    i === 0 ? "col-span-2 min-h-[130px]" : "min-h-[150px]"
                  }`}
                  style={{ background: `color-mix(in oklab, ${p.tint} 24%, white)` }}
                >
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-[0.2em] text-dusk/55"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {p.kind}
                    </p>
                    <h3 className="mt-2 font-serif text-[20px] leading-[1.05] text-dusk">{p.title}</h3>
                  </div>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-dusk/65">{p.body}</p>
                </Link>
              ))}
            </div>
          </Section>

          <Section className="mt-10">
            <p
              className="text-[10px] uppercase tracking-[0.22em] text-dusk/55 mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Relais — laisser d'autres aider
            </p>
            <div className="space-y-2.5">
              {RELAY.map((p) => (
                <Link
                  key={p.title}
                  to={p.to}
                  search={p.to === "/resources" ? { space: "care" as const } : undefined}
                  className="rounded-[16px] p-5 flex items-center gap-4 border border-dusk/8 hover:-translate-y-0.5 transition-transform"
                  style={{ background: `color-mix(in oklab, ${p.tint} 18%, white)` }}
                >
                  <span
                    aria-hidden
                    className="size-10 rounded-full shrink-0"
                    style={{ background: p.tint }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[10px] uppercase tracking-[0.2em] text-dusk/55"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {p.kind}
                    </p>
                    <h3 className="mt-1 font-serif text-[18px] leading-tight text-dusk">{p.title}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-dusk/65">{p.body}</p>
                  </div>
                  <span className="text-dusk/35 text-[18px]">→</span>
                </Link>
              ))}
            </div>
          </Section>

          <Section className="mt-10">
            <Link to="/crisis" className="block border-t border-dusk/10 pt-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Si aujourd'hui est trop</p>
              <p className="mt-1 font-serif text-base italic text-dusk">Une petite porte, calme →</p>
            </Link>
          </Section>
        </div>
      </div>
    </Shell>
  );
}