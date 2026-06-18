import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, IvoryCard, SectionLabel } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/memories")({
  beforeLoad: () => { throw redirect({ to: "/care/memory" }); },
  head: () => ({ meta: [{ title: "Souvenirs — Legato" }] }),
  component: Memories,
});

const KINDS = [
  { id: "voice", label: "Voix", color: "var(--rose)" },
  { id: "photo", label: "Photo", color: "var(--peach)" },
  { id: "sentence", label: "Phrase", color: "var(--lavender)" },
  { id: "habit", label: "Geste", color: "var(--sage)" },
  { id: "object", label: "Objet", color: "var(--clay)" },
  { id: "place", label: "Lieu", color: "var(--mist)" },
];

const ENTRIES = [
  { kind: "Phrase", title: "Quelque chose qu'elle a dit", date: "—", body: "« Tu reviens toujours plus doux que tu n'es parti. »" },
  { kind: "Photographie", title: "La cuisine, fin d'après-midi", date: "11 août 2023", body: "" },
  { kind: "Mémo vocal", title: "Lecture sous le porche", date: "14 avril 2024", body: "0:42" },
  { kind: "Geste", title: "Le thé de 16 h", date: "Tous les jours", body: "Toujours une cuillère et demie de miel." },
  { kind: "Lieu", title: "Le café du coin", date: "—", body: "Toujours la place près de la fenêtre." },
];

function Memories() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="SOUVENIRS" />

        <section className="px-6 pt-4 pb-6">
          <p className="mono-label">Bibliothèque</p>
          <h1 className="mt-5 ed-page-title">
            Tout ce que <span className="italic">vous avez gardé.</span>
          </h1>
          <p className="mt-5 body-meta max-w-[34ch]">
            Une longue étagère. Chaque trace trouvera sa place dans le jardin.
          </p>
        </section>

        <SectionLabel>Ajouter une trace</SectionLabel>

        <section className="px-6">
          <div className="grid grid-cols-4 gap-2">
            {KINDS.map((k) => (
              <button
                key={k.id}
                className="rounded-[14px] border border-dusk/10 py-3 flex flex-col items-center gap-2 hover:bg-dusk/5 transition-colors"
                style={{ background: "var(--paper)" }}
              >
                <span className="size-2.5 rounded-full" style={{ background: k.color }} />
                <span className="mono-label">{k.label}</span>
              </button>
            ))}
          </div>
        </section>

        <SectionLabel>Déjà gardés</SectionLabel>

        <section className="px-6 space-y-3">
          {ENTRIES.map((e, i) => (
            <IvoryCard key={i} className="px-5 py-4">
              <div className="flex items-baseline justify-between">
                <p className="mono-label">{e.kind}</p>
                <p className="mono-label">{e.date}</p>
              </div>
              <h3 className="mt-2 font-serif text-[22px] leading-[1.15] italic text-dusk">{e.title}</h3>
              {e.body && <p className="mt-2 body-meta">{e.body}</p>}
            </IvoryCard>
          ))}
        </section>
      </div>
    </Shell>
  );
}
