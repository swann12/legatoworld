import { createFileRoute, Link } from "@tanstack/react-router";
import { Halos } from "@/components/legato/Halos";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

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
  const { mode } = useLegato();
  return (
    <Shell>
      <div className="relative">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10">
            <Link to="/garden" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Le Jardin</Link>
          </div>
          <ScreenHeader
            eyebrow="Bibliothèque des souvenirs"
            title={<>Tout ce que <br /><span className="italic">vous avez gardé.</span></>}
            subtitle="Une longue étagère. Ajoutez ici des traces, et elles trouveront leur zone dans le jardin."
          />

          <Section className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40 mb-3">Ajouter une trace</p>
            <div className="grid grid-cols-4 gap-2">
              {KINDS.map((k) => (
                <button key={k.id} className="ceramic-soft organic-radius p-3 flex flex-col items-center gap-2">
                  <span
                    className="size-7 organic-radius-2"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${k.color}, var(--clay))` }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.18em] text-dusk/60">{k.label}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section className="mt-10">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40 mb-3">Déjà gardés</p>
            <div className="space-y-3">
              {ENTRIES.map((e, i) => (
                <article key={i} className="ceramic-soft organic-radius-3 p-5">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-dusk/40">{e.kind}</p>
                    <p className="text-[10px] tracking-[0.1em] text-dusk/40">{e.date}</p>
                  </div>
                  <h3 className="mt-2 font-serif text-lg italic text-dusk">{e.title}</h3>
                  {e.body && <p className="mt-2 text-[14px] leading-relaxed text-dusk/65">{e.body}</p>}
                </article>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </Shell>
  );
}