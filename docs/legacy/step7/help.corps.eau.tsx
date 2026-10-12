import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CorpsPage, CorpsSection, StepList, CorpsFooterNote } from "@/components/legato/CorpsPage";

export const Route = createFileRoute("/help/corps/eau")({
  head: () => ({
    meta: [
      { title: "L'eau et le corps — Legato" },
      { name: "description", content: "Un pas à pas très lent pour retrouver l'eau, quand se laver est devenu difficile." },
      { property: "og:title", content: "L'eau et le corps — Legato" },
      { property: "og:description", content: "Un pas à pas très lent, sans obligation d'aller au bout." },
    ],
  }),
  component: Eau,
});

const STEPS = [
  { title: "Entrer dans la salle de bain.", body: "Pas se laver. Juste entrer, et s'asseoir sur le bord si besoin." },
  { title: "Ouvrir le robinet.", body: "Rester à côté. Écouter le son de l'eau un moment, sans rien de plus." },
  { title: "Mettre une main sous l'eau.", body: "Sentir si elle est chaude. C'est déjà un retour dans le corps." },
  { title: "Entrer, si vous pouvez.", body: "Vous n'avez pas à vous laver. Rester quelques minutes sous l'eau suffit." },
  { title: "Sortir et s'enrouler dans quelque chose de chaud.", body: "La chaleur après l'eau compte autant que l'eau." },
];

function Eau() {
  const [done, setDone] = useState<number[]>([]);
  const toggle = (i: number) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  const complete = done.length === STEPS.length;

  return (
    <CorpsPage
      kicker="LE CORPS · L'EAU"
      title="L'eau, quand c'est devenu difficile."
      intro="Se laver n'est pas une obligation, c'est un retour dans son corps. Certains jours, c'est la chose la plus difficile qui soit. Voici le chemin décomposé au plus petit."
    >
      <CorpsSection label="Pas à pas" meta={`${done.length} / ${STEPS.length}`}>
        <StepList steps={STEPS} done={done} onToggle={toggle} />
        <p className="mt-3 px-1 text-[12px] italic text-dusk/45">
          S'arrêter à la deuxième étape est une réussite complète.
        </p>
      </CorpsSection>

      {complete && (
        <section className="px-5 pt-8">
          <div className="tint-sand rounded-[18px] px-6 py-6">
            <p className="font-serif text-[19px] leading-[1.35]">C'est fait. C'est suffisant pour aujourd'hui.</p>
          </div>
        </section>
      )}

      <CorpsSection label="Si c'est encore trop">
        <ul className="craft px-5">
          {[
            { t: "Un gant chaud sur le visage", b: "Assis, sans se déshabiller. Deux minutes." },
            { t: "Se laver les mains longuement", b: "Eau chaude, savon, jusqu'aux poignets." },
            { t: "Changer seulement de haut", b: "Le tissu propre sur la peau fait déjà quelque chose." },
          ].map((x, i) => (
            <li
              key={x.t}
              className="border-b border-dashed py-4 last:border-0"
              style={{ borderColor: i < 2 ? "color-mix(in oklab, var(--dusk) 16%, transparent)" : undefined }}
            >
              <p className="font-serif text-[16.5px] leading-[1.25]">{x.t}</p>
              <p className="mt-1.5 text-[13px] leading-[1.55] text-dusk/60">{x.b}</p>
            </li>
          ))}
        </ul>
      </CorpsSection>

      <CorpsFooterNote>
        Si les jours sans se laver se prolongent et que cela vous pèse, un accompagnement aide réellement.
        <Link to="/practical/pros" className="mono-label mt-3 block" style={{ color: "var(--terracotta)" }}>
          Trouver un·e professionnel·le →
        </Link>
      </CorpsFooterNote>
    </CorpsPage>
  );
}
