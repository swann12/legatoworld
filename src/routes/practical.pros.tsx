import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, SectionHead, Tabs } from "@/components/legato/EditorialUI";
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

type Family = "obseques" | "papiers";

type Pro = {
  id: string;
  label: string;
  family: Family;
  role: string;
  when: string;
  ask: string;
  category?: CategoryId;
};

const FAMILIES: { id: Family | "tout"; label: string }[] = [
  { id: "tout", label: "Tout" },
  { id: "obseques", label: "Obsèques" },
  { id: "papiers", label: "Papiers & droits" },
];

const PROS: Pro[] = [
  {
    id: "funeraire", label: "Service funéraire", family: "obseques",
    role: "Organisation des obsèques : lieu, transport, cercueil, déroulé.",
    when: "Dans les tout premiers jours.",
    ask: "Un devis écrit détaillé, poste par poste. Ne signez pas le jour même.",
    category: "pompes",
  },
  {
    id: "notaire", label: "Notaire", family: "papiers",
    role: "Succession, testament, biens immobiliers.",
    when: "Dans les semaines qui suivent, s'il y a un bien ou un patrimoine.",
    ask: "Le coût de la succession et les documents à réunir avant le rendez-vous.",
    category: "notaires",
  },
  {
    id: "avocat", label: "Avocat", family: "papiers",
    role: "Désaccord familial, contestation, litige avec un organisme.",
    when: "Seulement si la situation se tend.",
    ask: "Un premier rendez-vous d'information, et le tarif horaire à l'avance.",
    category: "administrations",
  },
  {
    id: "assistant-social", label: "Assistant social", family: "papiers",
    role: "Aides financières, droits, dossiers administratifs.",
    when: "Si les frais ou les papiers deviennent lourds à porter.",
    ask: "Les aides possibles : capital décès, allocation veuvage, aide aux obsèques.",
    category: "administrations",
  },
];

function PracticalPros() {
  const [family, setFamily] = useState<Family | "tout">("tout");
  const [open, setOpen] = useState<string | null>(null);

  const visible = family === "tout" ? PROS : PROS.filter((p) => p.family === family);

  return (
    <Shell livingBg={false}>
      <div className="wash-sand min-h-dvh text-dusk pb-36">
        <PageHeader title="PROFESSIONNELS" back="/practical" />

        <section className="px-6 pt-2">
          <h1 className="ed-page-title text-[30px]">
            Qui fait <span className="italic" style={{ color: "var(--terracotta)" }}>quoi</span>.
          </h1>
          <p className="mt-4 max-w-[30ch] text-[13px] leading-[1.6] text-dusk/60">
            Touchez un métier pour voir quand l'appeler et quoi demander.
          </p>
        </section>

        <section className="px-6 pt-7">
          <Tabs scroll options={FAMILIES} value={family} onChange={setFamily} />
        </section>

        <section className="px-5 pt-6">
          <SectionHead label="Métiers" meta={String(visible.length).padStart(2, "0")} />
          <ul className="tint-sand mt-3 rounded-[18px] px-5">
            {visible.map((p, i) => {
              const isOpen = open === p.id;
              return (
                <li
                  key={p.id}
                  className="border-b border-dashed last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : p.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-4 py-4 text-left"
                  >
                    <span className="mt-[5px] shrink-0 text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-[18px] leading-[1.15]">{p.label}</span>
                      <span className="mt-1 block text-[12.5px] leading-[1.45] surf-sub">{p.role}</span>
                    </span>
                    <span aria-hidden className="shrink-0 pt-[4px] text-[14px] text-dusk/30">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="pb-5 pl-[calc(1rem+18px)]">
                      <div className="craft px-4 py-3.5">
                        <p className="mono-label">Quand appeler</p>
                        <p className="mt-1.5 text-[13.5px] leading-[1.5]">{p.when}</p>
                        <div className="my-3 h-px" style={{ background: "color-mix(in oklab, var(--dusk) 14%, transparent)" }} />
                        <p className="mono-label">Ce qu'il faut demander</p>
                        <p className="mt-1.5 text-[13.5px] leading-[1.5]">{p.ask}</p>
                      </div>
                      {p.category && (
                        <Link
                          to="/resources/$category"
                          params={{ category: p.category }}
                          search={{ space: "practical" as const }}
                          className="mono-label mt-3 inline-block"
                          style={{ color: "var(--terracotta)" }}
                        >
                          Voir des contacts →
                        </Link>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <p className="px-8 pt-10 text-center text-[12.5px] italic leading-relaxed text-dusk/50">
          Rien n'est urgent au point de signer sans avoir lu.
        </p>
      </div>
    </Shell>
  );
}
