import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { Halos } from "@/components/legato/Halos";
import { PersonalSuggestions } from "@/components/legato/PersonalSuggestions";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/practical/texts")({
  head: () => ({ meta: [{ title: "Textes & musiques — Legato" }] }),
  component: Texts,
});

const TEXTS = [
  { kind: "Poème", title: "Demain dès l'aube — Victor Hugo", body: "Pour la marche en silence, pour le départ." },
  { kind: "Poème", title: "Ne pleurez pas devant ma tombe — M.E. Frye", body: "Court, doux, accessible." },
  { kind: "Texte", title: "L'Adieu — Apollinaire", body: "« J'ai cueilli ce brin de bruyère… »" },
  { kind: "Texte", title: "Une lecture personnelle", body: "Une lettre, un souvenir, un message lu par un proche." },
];
const MUSIC = [
  { kind: "Classique", title: "Adagio — Albinoni", body: "Recueilli, profond." },
  { kind: "Voix",      title: "Hallelujah — Jeff Buckley", body: "Sensible, beaucoup choisi." },
  { kind: "Chanson",   title: "Une chanson qu'il/elle aimait", body: "Le morceau qu'on entendait souvent chez vous." },
  { kind: "Silence",   title: "Une minute de silence",        body: "Parfois la plus juste." },
];

function Texts() {
  const { mode } = useLegato();
  return (
    <Shell hideNav>
      <div className="relative pb-12">
        <Halos mode={mode} variant="calm" />
        <div className="relative z-10">
          <div className="px-7 pt-10 flex items-center justify-between">
            <Link to="/practical/atmosphere" className="text-[11px] uppercase tracking-[0.22em] text-dusk/50">← Atmosphère</Link>
            <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">Textes & musiques</span>
          </div>
          <header className="px-7 pt-12">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45">Lectures, poèmes, musiques</p>
            <h1 className="mt-3 font-serif text-[2.1rem] leading-[1.08] font-light text-dusk text-balance">
              Quelques mots,<br/><span className="italic">une mélodie qui dit.</span>
            </h1>
            <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/65">
              Quelques pistes. Pour des suggestions plus personnelles, parlez de la personne à Lovely.
            </p>
          </header>
          <div className="px-5 mt-8 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45 px-1">Textes & poèmes</p>
            {TEXTS.map((t) => (
              <div key={t.title} className="paper-card p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">{t.kind}</p>
                <p className="mt-1.5 font-serif italic text-[16px] text-dusk">{t.title}</p>
                <p className="mt-1.5 text-[13px] text-dusk/65">{t.body}</p>
              </div>
            ))}
          </div>
          <div className="px-5 mt-6 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45 px-1">Musiques</p>
            {MUSIC.map((t) => (
              <div key={t.title} className="paper-card p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/40">{t.kind}</p>
                <p className="mt-1.5 font-serif italic text-[16px] text-dusk">{t.title}</p>
                <p className="mt-1.5 text-[13px] text-dusk/65">{t.body}</p>
              </div>
            ))}
          </div>

          <PersonalSuggestions
            topic="texts"
            eyebrow="Sur mesure — textes & poèmes"
            cta="Recevoir des textes qui lui ressemblent"
          />
          <PersonalSuggestions
            topic="music"
            eyebrow="Sur mesure — musiques"
            cta="Recevoir des musiques qui lui ressemblent"
          />
        </div>
      </div>
      <ConfideDock step="textes" />
    </Shell>
  );
}
