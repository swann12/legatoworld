import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Communauté — Legato" }] }),
  component: Community,
});

type Circle = {
  kind: string;
  title: string;
  body: string;
  cadence: string;
  tint: string;
  seats: string;
};

const CIRCLES: Circle[] = [
  { kind: "Perte d'un parent",   title: "Enfants devenus orphelins", body: "Pour la mort d'un père, d'une mère. Souvent à l'âge adulte.",      cadence: "Mardi · 20h · 1h",     tint: "var(--blush)",      seats: "3 places" },
  { kind: "Perte d'un conjoint", title: "Vivre sans l'autre",        body: "Pour ceux et celles qui apprennent un autre quotidien.",            cadence: "Jeudi · 19h30 · 1h15", tint: "var(--sky)",        seats: "5 places" },
  { kind: "Perte d'un enfant",   title: "Parents endeuillés",        body: "Un espace tenu très doux. Animé par une thérapeute spécialisée.",   cadence: "Dimanche · 18h · 1h30",tint: "var(--olive)",      seats: "2 places" },
  { kind: "Perte d'un animal",   title: "Animaux aimés",             body: "Pour la disparition d'un chat, d'un chien, d'un compagnon.",        cadence: "Lundi · 18h30 · 1h",   tint: "var(--sun)",        seats: "Places ouvertes" },
  { kind: "Deuil anticipé",      title: "Vivre avec ce qui vient",   body: "Quand un proche est en fin de vie. Parler à d'autres en attente.",  cadence: "Mercredi · 19h · 1h",  tint: "var(--terracotta)", seats: "4 places" },
];

function Community() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-9 pb-6 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <span className="eyebrow">Cercle</span>
        </header>

        <section className="px-6 pb-9">
          <p className="eyebrow">Petits cercles tenus</p>
          <h1 className="mt-5 display-xl">
            Vous n'êtes <span className="italic" style={{ color: "var(--terracotta)" }}>pas seul·e</span> à traverser ça.
          </h1>
          <p className="mt-5 body-meta max-w-[34ch]">
            Des cercles en ligne, animés chaque semaine par des thérapeutes du deuil. Petits effectifs. Aucune obligation de parler.
          </p>
        </section>

        <section className="px-6 pb-6">
          <Link to="/_authenticated/circle" className="block card-plain p-5 hover:bg-dusk/[0.03] transition">
            <p className="eyebrow">Votre cercle privé</p>
            <p className="mt-2 font-serif text-[20px] text-dusk leading-tight">Inviter vos proches, déléguer, partager →</p>
            <p className="mt-2 text-[12.5px] text-dusk/65">Un espace privé entre vous et celles et ceux qui comptent.</p>
          </Link>
        </section>

        <section className="px-5 grid grid-cols-2 gap-3">
          <div className="card-butter px-5 py-5">
            <p className="eyebrow">Cadre</p>
            <p className="h-section mt-3">Petits cercles, rythme régulier.</p>
          </div>
          <div className="card-blush px-5 py-5">
            <p className="eyebrow">Liberté</p>
            <p className="mt-3 text-[13px] leading-relaxed">On peut juste écouter, revenir plus tard.</p>
          </div>
        </section>

        <section className="px-6 pt-10">
          <p className="eyebrow">Cette semaine</p>
          <div className="mt-4 space-y-3">
            {CIRCLES.map((c) => (
              <article
                key={c.title}
                className="card-plain overflow-hidden"
              >
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-center gap-2">
                    <span aria-hidden className="size-2 rounded-full" style={{ background: c.tint }} />
                    <p className="eyebrow">{c.kind}</p>
                  </div>
                  <h3 className="mt-3 font-serif text-[22px] leading-[1.15] text-dusk">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-dusk/70">{c.body}</p>
                </div>
                <div className="px-5 py-3 flex items-center justify-between border-t border-dusk/8 bg-dusk/[0.02]">
                  <div>
                    <p className="eyebrow">{c.cadence}</p>
                    <p className="mt-0.5 text-[11.5px] italic text-dusk/55">{c.seats}</p>
                  </div>
                  <button type="button" className="btn-dark">Rejoindre →</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-7 mt-10">
          <div className="hairline" />
          <p className="mt-6 font-serif italic text-[15px] text-dusk/60 max-w-[34ch] text-balance">
            Vous pouvez juste écouter. C'est suffisant. Personne ne vous demandera de parler.
          </p>
        </section>
      </div>
    </Shell>
  );
}