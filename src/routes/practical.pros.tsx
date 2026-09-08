import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  category?: CategoryId;
};

const PROS: Pro[] = [
  {
    id: "psychologue", label: "Psychologue", role: "Un espace pour déposer ce qui pèse, avec quelqu'un de formé au deuil.",
    when: "Quand la peine ne se dit à personne, ou dure sans relâche.",
    ask: "Demandez s'il ou elle est formé·e au deuil, et ce que coûte une séance.",
    category: "therapeutes",
  },
  {
    id: "association", label: "Association", role: "Des groupes de parole et des bénévoles qui ont traversé la même chose.",
    when: "Quand parler à des personnes qui comprennent fait plus de bien qu'un cabinet.",
    ask: "Demandez s'il existe un groupe près de chez vous, et s'il est gratuit.",
    category: "ecoute",
  },
  {
    id: "funeraire", label: "Service funéraire", role: "Organisation des obsèques : lieu, transport, cercueil, déroulé.",
    when: "Dans les tout premiers jours.",
    ask: "Un devis écrit détaillé, poste par poste. Ne signez pas le jour même.",
    category: "pompes",
  },
  {
    id: "notaire", label: "Notaire", role: "Succession, testament, biens immobiliers.",
    when: "Dans les semaines qui suivent, s'il y a un bien ou un patrimoine.",
    ask: "Le coût de la succession, et les documents à réunir avant le rendez-vous.",
    category: "notaires",
  },
  {
    id: "avocat", label: "Avocat", role: "En cas de désaccord familial, de contestation ou de litige avec un organisme.",
    when: "Seulement si la situation se tend.",
    ask: "Un premier rendez-vous d'information, et le tarif horaire annoncé à l'avance.",
    category: "administrations",
  },
  {
    id: "assistant-social", label: "Assistant social", role: "Aides financières, droits, dossiers administratifs.",
    when: "Si les frais ou les papiers deviennent lourds à porter.",
    ask: "Les aides auxquelles vous avez droit : capital décès, allocation veuvage, aide aux obsèques.",
    category: "administrations",
  },
];

function PracticalPros() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="PROFESSIONNELS" back="/practical" />

        <section className="px-6 pt-2">
          <h1 className="ed-page-title text-[30px]">
            Qui fait <span className="italic" style={{ color: "var(--terracotta)" }}>quoi</span>.
          </h1>
          <p className="mt-4 text-[13px] leading-[1.6] text-dusk/60 max-w-[32ch]">
            Six métiers. Touchez celui qui vous concerne, le reste reste au calme.
          </p>
        </section>

        <div className="px-5 pt-8">
          <div className="overflow-hidden rounded-[18px] border border-dusk/10">
            {PROS.map((p, i) => {
              const isOpen = open === p.id;
              return (
                <div
                  key={p.id}
                  style={{
                    background: isOpen ? "var(--clay)" : "var(--whisper)",
                    borderTop: i === 0 ? "none" : "1px solid color-mix(in oklab, var(--dusk) 8%, transparent)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : p.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="min-w-0">
                      <span className="block font-serif text-[18px] leading-[1.15]">{p.label}</span>
                      {!isOpen && (
                        <span className="mt-1 block truncate text-[12.5px] text-dusk/55">{p.when}</span>
                      )}
                    </span>
                    <span aria-hidden className="shrink-0 text-[13px] text-dusk/35">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5">
                      <p className="text-[13.5px] leading-[1.5] text-dusk/80">{p.role}</p>
                      <p className="mt-3 text-[12.5px] leading-[1.55] text-dusk/60">
                        <span className="mono-label">Quand</span> · {p.when}
                      </p>
                      <p className="mt-2 text-[12.5px] leading-[1.55] text-dusk/60">
                        <span className="mono-label">À demander</span> · {p.ask}
                      </p>
                      {p.category && (
                        <Link
                          to="/resources/$category"
                          params={{ category: p.category }}
                          search={{ space: "practical" as const }}
                          className="mt-4 inline-block text-[12px] underline underline-offset-4"
                          style={{ color: "var(--terracotta)" }}
                        >
                          Voir des contacts →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="px-7 pt-9 text-center text-[12px] italic leading-relaxed text-dusk/50">
          Rien n'est urgent au point de signer sans avoir lu.
        </p>

        <div className="pt-10" />
      </div>
    </Shell>
  );
}
