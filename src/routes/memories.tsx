import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";

export const Route = createFileRoute("/memories")({
  head: () => ({ meta: [{ title: "Bibliothèque des souvenirs — Legato" }] }),
  component: Memories,
});

const KINDS = [
  { id: "voice", label: "Voix", color: "var(--rose)" },
  { id: "photo", label: "Photo", color: "var(--peach)" },
  { id: "sentence", label: "Phrase", color: "var(--lavender)" },
  { id: "habit", label: "Geste", color: "var(--sage)" },
  { id: "object", label: "Objet", color: "var(--clay)" },
  { id: "place", label: "Lieu", color: "var(--mist)" },
  { id: "date", label: "Date", color: "var(--rose)" },
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
        <header className="px-6 pt-9 pb-2 flex items-center justify-between">
          <LegatoMark to="/home" size={22} />
          <span className="eyebrow">Souvenirs</span>
        </header>

        <section className="px-6 pt-10">
          <p className="eyebrow">Bibliothèque</p>
          <h1 className="mt-4 display-xl">
            Tout ce que <span className="italic">vous avez gardé.</span>
          </h1>
          <p className="mt-5 body-meta max-w-[34ch]">
            Une longue étagère. Chaque trace trouvera sa place dans le jardin.
          </p>
        </section>

        <section className="px-6 pt-10">
          <p className="eyebrow mb-3">Ajouter une trace</p>
          <div className="grid grid-cols-4 gap-2">
            {KINDS.map((k) => (
              <button
                key={k.id}
                className="card-plain py-3 flex flex-col items-center gap-2 hover:bg-dusk/5 transition-colors"
              >
                <span className="size-2.5 rounded-full" style={{ background: k.color }} />
                <span className="eyebrow">{k.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-6 pt-10">
          <p className="eyebrow mb-3">Déjà gardés</p>
          <div className="divide-y divide-dusk/10 border-y border-dusk/15">
            {ENTRIES.map((e, i) => (
              <article key={i} className="py-5">
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow">{e.kind}</p>
                  <p className="eyebrow">{e.date}</p>
                </div>
                <h3 className="mt-2 h-section italic">{e.title}</h3>
                {e.body && (
                  <p className="mt-2 body-meta">{e.body}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}