import { createFileRoute } from "@tanstack/react-router";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";

export const Route = createFileRoute("/memories")({
  head: () => ({ meta: [{ title: "Bibliothèque des souvenirs — Legato" }] }),
  component: Memories,
});

const KINDS = [
  { id: "voice",    label: "Voix" },
  { id: "photo",    label: "Photo" },
  { id: "sentence", label: "Phrase" },
  { id: "habit",    label: "Geste" },
  { id: "object",   label: "Objet" },
  { id: "place",    label: "Lieu" },
  { id: "date",     label: "Date" },
  { id: "other",    label: "Autre" },
];

const ENTRIES = [
  { kind: "Phrase",       title: "Quelque chose qu'elle a dit",  date: "—",                  body: "« Tu reviens toujours plus doux que tu n'es parti. »" },
  { kind: "Photographie", title: "La cuisine, fin d'après-midi", date: "11 août 2023",       body: "" },
  { kind: "Mémo vocal",   title: "Lecture sous le porche",       date: "14 avril 2024",      body: "0:42" },
  { kind: "Geste",        title: "Le thé de 16 h",               date: "Tous les jours",     body: "Toujours une cuillère et demie de miel." },
  { kind: "Lieu",         title: "Le café du coin",              date: "—",                  body: "Toujours la place près de la fenêtre." },
];

function Memories() {
  return (
    <Shell>
      <ScreenHeader
        back={{ to: "/garden", label: "Le Jardin" }}
        eyebrow="Bibliothèque des souvenirs"
        title="Tout ce que vous avez gardé."
        subtitle="Ajoutez des traces — elles trouveront leur place dans le jardin."
      />

      <Section className="mt-10">
        <p className="eyebrow mb-3">Ajouter une trace</p>
        <div className="grid grid-cols-4 gap-2">
          {KINDS.map((k) => (
            <button
              key={k.id}
              className="surface p-3 text-center hover:bg-dusk/[0.02] transition-colors"
            >
              <span className="text-[12px] text-dusk/75">{k.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section className="mt-10 mb-10">
        <p className="eyebrow mb-3">Déjà gardés</p>
        <div className="space-y-3">
          {ENTRIES.map((e, i) => (
            <article key={i} className="surface p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="eyebrow-sm">{e.kind}</p>
                <p className="eyebrow-sm" style={{ letterSpacing: "0.06em" }}>{e.date}</p>
              </div>
              <h3 className="mt-2 font-serif text-[17px] font-light text-dusk leading-snug">{e.title}</h3>
              {e.body && (
                <p className="mt-2 text-[13.5px] leading-[1.55] text-dusk/65">{e.body}</p>
              )}
            </article>
          ))}
        </div>
      </Section>
    </Shell>
  );
}