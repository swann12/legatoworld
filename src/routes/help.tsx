import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Aide — Legato" }] }),
  component: Help,
});

const PRACTICAL = [
  { kind: "Administratif", title: "Ce qu'il faut résilier ou prévenir", body: "Une liste, au rythme doux. Banque, abonnements, la poste." },
  { kind: "Le corps", title: "Quand le corps oublie de manger", body: "Cinq petites choses que l'on peut avaler sans y penser." },
  { kind: "Sommeil", title: "Les nuits qui ne finissent pas", body: "Ce que d'autres ont fait à 3 h du matin." },
  { kind: "Paroles", title: "Que répondre aux condoléances maladroites", body: "Quand on dit ce qu'il ne faut pas, gentiment." },
];

const RELAY = [
  { kind: "Un·e proche", title: "Demander à quelqu'un de prendre une tâche", body: "Transmettre une demande simple et claire. Nous écrivons le message pour vous." },
  { kind: "Un·e pro", title: "Trouver un·e thérapeute du deuil près de chez vous", body: "Sélectionné·es par région et par langue." },
  { kind: "Une communauté", title: "Petit cercle, chaque semaine", body: "Des groupes en ligne pour la perte d'une personne, d'un animal, ou un deuil anticipé." },
];

function Help() {
  const { mode } = useLegato();
  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <ScreenHeader
            eyebrow="Aide — concrète, tranquille"
            title={<>Des mains tout près, <br /><span className="italic">si vous en avez besoin.</span></>}
            subtitle="Rien ici ne vous demande de faire maintenant. Choisissez seulement ce qui semble possible aujourd'hui."
          />

          <Section className="mt-10 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40 mb-2">Choses concrètes</p>
            {PRACTICAL.map((p) => (
              <article key={p.title} className="ceramic-soft organic-radius-3 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40">{p.kind}</p>
                <h3 className="mt-1.5 font-serif text-lg italic text-dusk">{p.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-dusk/60">{p.body}</p>
              </article>
            ))}
          </Section>

          <Section className="mt-10 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40 mb-2">Relais — laisser d'autres aider</p>
            {RELAY.map((p) => (
              <article key={p.title} className="ceramic organic-radius-3 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40">{p.kind}</p>
                <h3 className="mt-1.5 font-serif text-lg italic text-dusk">{p.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-dusk/60">{p.body}</p>
              </article>
            ))}
          </Section>

          <Section className="mt-10">
            <Link to="/crisis" className="block border-t border-dusk/10 pt-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">Si aujourd'hui est trop</p>
              <p className="mt-1 font-serif text-base italic text-dusk">Une petite porte, calme →</p>
            </Link>
          </Section>
        </div>
      </div>
    </Shell>
  );
}