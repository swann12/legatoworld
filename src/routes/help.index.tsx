import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";

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
  { kind: "Le corps",      title: "Quand le corps oublie de manger",  body: "Cinq petites choses que l'on peut avaler sans y penser.",  to: "/help/corps", tint: "var(--peach)" },
  { kind: "Le corps",      title: "L'eau et le corps",                body: "Se laver, une étape à la fois — sans obligation.",          to: "/help/corps", tint: "var(--mist)" },
  { kind: "Le corps",      title: "S'habiller",                       body: "Trouver la chose la plus douce, aujourd'hui.",              to: "/help/corps", tint: "var(--blush)" },
  { kind: "Sommeil",       title: "Les nuits qui n'en finissent pas", body: "Ce que d'autres ont fait à 3 h du matin.",                 to: "/help/corps", tint: "var(--lavender)" },
  { kind: "Administratif", title: "Résilier, prévenir",               body: "Une liste douce. Banque, abonnements, la poste.",          to: "/practical",  tint: "var(--sun)" },
];

const RELAY: HelpItem[] = [
  { kind: "Un·e proche",    title: "Déléguer une tâche",          body: "Nous rédigeons le message à votre place.",                          to: "/presence",  tint: "var(--sage)" },
  { kind: "Un·e pro",       title: "Trouver un·e thérapeute",     body: "Annuaire de thérapeutes du deuil, par région et par langue.",       to: "/resources", tint: "var(--terracotta)" },
  { kind: "Une communauté", title: "Petit cercle, chaque semaine",body: "Groupes en ligne — personne, animal, ou deuil anticipé.",           to: "/community", tint: "var(--azure)" },
];

function Help() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-9 pb-6 flex items-center justify-between">
          <LegatoMark to="/home" size={22} />
          <span className="eyebrow">Aide</span>
        </header>

        <section className="px-6 pb-10">
          <p className="eyebrow">Sans s'expliquer trop</p>
          <h1 className="mt-5 display-xl">
            Demander de l'<span className="italic" style={{ color: "var(--terracotta)" }}>aide</span>.
          </h1>
          <p className="mt-5 body-meta max-w-[34ch]">
            Trois portes simples : pour soi, pour déléguer, ou pour être accompagné·e.
          </p>
        </section>

        <section className="px-5">
          <p className="eyebrow px-1 mb-3">Pour soi — concret</p>
          <div className="grid grid-cols-2 gap-3">
            {PRACTICAL.map((p, i) => (
              <Link
                key={p.title}
                to={p.to}
                className={`card px-5 py-5 flex flex-col justify-between transition-transform active:scale-[0.99] ${
                  i === 0 ? "col-span-2 min-h-[130px]" : "min-h-[150px]"
                }`}
                style={{ background: `color-mix(in oklab, ${p.tint} 26%, var(--paper))` }}
              >
                <div>
                  <p className="eyebrow">{p.kind}</p>
                  <h3 className="h-section mt-3">{p.title}</h3>
                </div>
                <p className="mt-3 body-meta">{p.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-5 mt-8">
          <p className="eyebrow px-1 mb-3">Relais — laisser aider</p>
          <div className="space-y-2.5">
            {RELAY.map((p) => (
              <Link
                key={p.title}
                to={p.to}
                search={p.to === "/resources" ? { space: "care" as const } : undefined}
                className="card-plain px-5 py-5 flex items-center gap-4 active:scale-[0.99] transition-transform"
                style={{ background: `color-mix(in oklab, ${p.tint} 18%, var(--paper))` }}
              >
                <span aria-hidden className="size-10 rounded-full shrink-0" style={{ background: p.tint }} />
                <div className="flex-1 min-w-0">
                  <p className="eyebrow">{p.kind}</p>
                  <h3 className="mt-1.5 font-serif text-[19px] leading-tight">{p.title}</h3>
                  <p className="mt-1.5 body-meta">{p.body}</p>
                </div>
                <span className="font-serif text-[20px] opacity-50">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-7 mt-10">
          <Link to="/crisis" className="block border-t border-dusk/12 pt-6 text-center">
            <p className="eyebrow">Si aujourd'hui est trop</p>
            <p className="mt-2 font-serif text-[17px] italic" style={{ color: "var(--terracotta)" }}>
              Une porte calme →
            </p>
          </Link>
        </section>
      </div>
    </Shell>
  );
}