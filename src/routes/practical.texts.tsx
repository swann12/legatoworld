import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { PersonalSuggestions } from "@/components/legato/PersonalSuggestions";
import { ShareToCircle } from "@/components/legato/ShareToCircle";
import { PageHeader, IvoryCard, SectionLabel } from "@/components/legato/EditorialUI";

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
  return (
    <Shell hideNav>
      <div className="min-h-dvh bg-paper text-dusk pb-12">
        <PageHeader title="TEXTES" back="/practical/atmosphere" />

        <section className="px-6 pt-4 pb-6">
          <p className="mono-label">Lectures, poèmes, musiques</p>
          <h1 className="mt-3 ed-page-title">
            Quelques mots,<br/><span className="italic">une mélodie qui dit.</span>
          </h1>
          <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-dusk/65">
            Quelques pistes. Pour des suggestions plus personnelles, parlez de la personne à Lovely.
          </p>
        </section>

        <SectionLabel>Textes & poèmes</SectionLabel>
        <div className="px-5 space-y-3">
          {TEXTS.map((t) => (
            <IvoryCard key={t.title} className="p-5">
              <p className="mono-label">{t.kind}</p>
              <p className="mt-1.5 font-serif text-[16px] text-dusk">{t.title}</p>
              <p className="mt-1.5 text-[13px] text-dusk/65">{t.body}</p>
            </IvoryCard>
          ))}
        </div>

        <SectionLabel>Musiques</SectionLabel>
        <div className="px-5 space-y-3">
          {MUSIC.map((t) => (
            <IvoryCard key={t.title} className="p-5">
              <p className="mono-label">{t.kind}</p>
              <p className="mt-1.5 font-serif text-[16px] text-dusk">{t.title}</p>
              <p className="mt-1.5 text-[13px] text-dusk/65">{t.body}</p>
            </IvoryCard>
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
      <ConfideDock step="textes" />
    </Shell>
  );
}
