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
};

/* Choses concrètes — chaque entrée mène à une vraie page qui accompagne. */
const PRACTICAL: HelpItem[] = [
  { kind: "Le corps",     title: "Quand le corps oublie de manger", body: "Cinq petites choses que l'on peut avaler sans y penser.",            to: "/help/corps" },
  { kind: "Le corps",     title: "L'eau et le corps",               body: "Se laver, une étape à la fois — sans aucune obligation.",            to: "/help/corps" },
  { kind: "Le corps",     title: "S'habiller",                       body: "Trouver la chose la plus douce, aujourd'hui.",                       to: "/help/corps" },
  { kind: "Sommeil",      title: "Les nuits qui n'en finissent pas", body: "Ce que d'autres ont fait à 3 h du matin.",                          to: "/help/corps" },
  { kind: "Administratif",title: "Ce qu'il faut résilier ou prévenir", body: "Une liste, au rythme doux. Banque, abonnements, la poste.",       to: "/practical" },
];

/* Relais — laisser d'autres aider. */
const RELAY: HelpItem[] = [
  { kind: "Un·e proche",   title: "Demander à quelqu'un de prendre une tâche", body: "Transmettre une demande simple et claire. Nous écrivons le message pour vous.", to: "/presence" },
  { kind: "Un·e pro",      title: "Ressources et accompagnement",               body: "Thérapeutes du deuil, près de chez vous, sélectionné·es par région et par langue.", to: "/resources" },
  { kind: "Une communauté",title: "Petit cercle, chaque semaine",               body: "Des groupes en ligne pour la perte d'une personne, d'un animal, ou un deuil anticipé.", to: "/community" },
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
            title={<>Des mains tout près, <br /><span className="italic">si vous en avez besoin.</span></>}
            subtitle="Rien ici ne vous demande de faire maintenant. Choisissez seulement ce qui semble possible aujourd'hui."
          />

          <Section className="mt-10 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45 mb-2">Choses concrètes</p>
            {PRACTICAL.map((p) => (
              <Link
                key={p.title}
                to={p.to}
                className="ceramic-soft organic-radius-3 px-7 py-6 block opacity-90 hover:opacity-100 transition-opacity"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/45">{p.kind}</p>
                <h3 className="mt-2 font-serif text-lg italic text-dusk">{p.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-dusk/65">{p.body}</p>
              </Link>
            ))}
          </Section>

          <Section className="mt-10 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45 mb-2">Relais — laisser d'autres aider</p>
            {RELAY.map((p) => (
              <Link
                key={p.title}
                to={p.to}
                search={p.to === "/resources" ? { space: "care" as const } : undefined}
                className="ceramic organic-radius-3 px-7 py-6 block opacity-90 hover:opacity-100 transition-opacity"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/45">{p.kind}</p>
                <h3 className="mt-2 font-serif text-lg italic text-dusk">{p.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-dusk/65">{p.body}</p>
              </Link>
            ))}
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