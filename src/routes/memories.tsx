import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

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
        <header className="px-7 pt-10 flex items-center justify-between">
          <Link
            to="/home"
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/55 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← Accueil
          </Link>
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Souvenirs
          </span>
        </header>

        <section className="px-7 pt-14">
          <p
            className="text-[10px] uppercase tracking-[0.3em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Bibliothèque
          </p>
          <h1 className="mt-4 font-serif text-[36px] leading-[1.05] font-light text-dusk text-balance">
            Tout ce que <span className="italic">vous avez gardé.</span>
          </h1>
          <p className="mt-5 max-w-[34ch] text-[14.5px] leading-[1.6] text-dusk/60">
            Une longue étagère. Ajoutez ici des traces — elles trouveront leur
            place dans le jardin.
          </p>
        </section>

        <section className="px-7 pt-10">
          <p
            className="text-[10px] uppercase tracking-[0.26em] text-dusk/55 mb-3"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Ajouter une trace
          </p>
          <div className="grid grid-cols-4 gap-2">
            {KINDS.map((k) => (
              <button
                key={k.id}
                className="rounded-[12px] border border-dusk/12 bg-paper py-3 flex flex-col items-center gap-2 hover:bg-dusk/5 transition-colors"
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: k.color }}
                />
                <span
                  className="text-[10px] uppercase tracking-[0.18em] text-dusk/65"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {k.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-7 pt-10">
          <p
            className="text-[10px] uppercase tracking-[0.26em] text-dusk/55 mb-3"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Déjà gardés
          </p>
          <div className="divide-y divide-dusk/10 border-y border-dusk/12">
            {ENTRIES.map((e, i) => (
              <article key={i} className="py-5">
                <div className="flex items-baseline justify-between">
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] text-dusk/55"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {e.kind}
                  </p>
                  <p
                    className="text-[10px] tracking-[0.1em] text-dusk/50"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {e.date}
                  </p>
                </div>
                <h3 className="mt-2 font-serif text-[19px] italic text-dusk leading-snug">{e.title}</h3>
                {e.body && (
                  <p className="mt-2 text-[14px] leading-relaxed text-dusk/65">{e.body}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}