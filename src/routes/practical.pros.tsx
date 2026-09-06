import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";
import type { CategoryId } from "@/lib/resources-data";

export const Route = createFileRoute("/practical/pros")({
  head: () => ({
    meta: [
      { title: "Professionnels — Legato" },
      { name: "description", content: "Psychologue, association, service funéraire, notaire, avocat, assistant social : qui fait quoi, et quand appeler." },
      { property: "og:title", content: "Professionnels — Legato" },
      { property: "og:description", content: "Qui fait quoi, quand appeler, et quoi demander." },
    ],
  }),
  component: PracticalPros,
});

type Pro = {
  id: string;
  label: string;
  role: string;
  when: string;
  ask: string;
  bg: string;
  category?: CategoryId;
};

const PROS: Pro[] = [
  {
    id: "psychologue", label: "Psychologue", role: "Un espace pour déposer ce qui pèse, avec quelqu'un de formé au deuil.",
    when: "Quand la peine ne se dit à personne, ou dure sans relâche.",
    ask: "Demandez s'il ou elle est formé·e au deuil, et ce que coûte une séance.",
    bg: "var(--blush)", category: "therapeutes",
  },
  {
    id: "association", label: "Association", role: "Des groupes de parole et des bénévoles qui ont traversé la même chose.",
    when: "Quand parler à des personnes qui comprennent fait plus de bien qu'un cabinet.",
    ask: "Demandez s'il existe un groupe près de chez vous, et s'il est gratuit.",
    bg: "var(--sage)", category: "ecoute",
  },
  {
    id: "funeraire", label: "Service funéraire", role: "Organisation des obsèques : lieu, transport, cercueil, déroulé.",
    when: "Dans les tout premiers jours.",
    ask: "Un devis écrit détaillé, poste par poste. Ne signez pas le jour même.",
    bg: "var(--peach)", category: "pompes",
  },
  {
    id: "notaire", label: "Notaire", role: "Succession, testament, biens immobiliers.",
    when: "Dans les semaines qui suivent, s'il y a un bien ou un patrimoine.",
    ask: "Le coût de la succession, et les documents à réunir avant le rendez-vous.",
    bg: "var(--sun)", category: "notaires",
  },
  {
    id: "avocat", label: "Avocat", role: "En cas de désaccord familial, de contestation ou de litige avec un organisme.",
    when: "Seulement si la situation se tend.",
    ask: "Un premier rendez-vous d'information, et le tarif horaire annoncé à l'avance.",
    bg: "var(--whisper)", category: "administrations",
  },
  {
    id: "assistant-social", label: "Assistant social", role: "Aides financières, droits, dossiers administratifs.",
    when: "Si les frais ou les papiers deviennent lourds à porter.",
    ask: "Les aides auxquelles vous avez droit : capital décès, allocation veuvage, aide aux obsèques.",
    bg: "var(--sky)", category: "administrations",
  },
];

function PracticalPros() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="PROFESSIONNELS" back="/practical" />

        <section className="px-6 pt-2">
          <h1 className="ed-page-title text-[30px]">
            Qui fait <span className="italic" style={{ color: "var(--terracotta)" }}>quoi</span>.
          </h1>
          <p className="mt-4 text-[13px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Six métiers, ce qu'ils font vraiment, et quoi leur demander.
          </p>
        </section>

        <div className="px-5 pt-8 flex flex-col gap-3">
          {PROS.map((p) => (
            <article key={p.id} className="rounded-[18px] px-5 py-5" style={{ background: p.bg }}>
              <p className="mono-label">{p.label}</p>
              <p className="mt-3 font-serif text-[17px] leading-[1.25] text-dusk">{p.role}</p>
              <p className="mt-3 text-[12.5px] leading-[1.55] text-dusk/65">
                <span className="mono-label">Quand</span> · {p.when}
              </p>
              <p className="mt-2 text-[12.5px] leading-[1.55] text-dusk/65">
                <span className="mono-label">À demander</span> · {p.ask}
              </p>
              {p.category && (
                <Link
                  to="/resources/$category"
                  params={{ category: p.category }}
                  search={{ space: "practical" as const }}
                  className="mt-4 inline-block text-[12px] underline underline-offset-4 text-dusk/70 hover:text-dusk"
                >
                  Voir des contacts →
                </Link>
              )}
            </article>
          ))}
        </div>

        <p className="px-7 pt-9 text-center text-[12px] italic leading-relaxed text-dusk/50">
          Rien n'est urgent au point de signer sans avoir lu.
        </p>

        <div className="pt-10" />
      </div>
    </Shell>
  );
}
