import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

type Kind = "lectures" | "films" | "podcasts" | "rituels";

const TINTS: Record<Kind, { bg: string; fg: string; accent: string }> = {
  lectures: { bg: "var(--blush)",      fg: "var(--dusk)",  accent: "var(--terracotta)" },
  films:    { bg: "var(--mist)",       fg: "var(--dusk)",  accent: "var(--sky)" },
  podcasts: { bg: "var(--sun)",        fg: "var(--dusk)",  accent: "var(--peach)" },
  rituels:  { bg: "var(--sage)",       fg: "var(--dusk)",  accent: "var(--olive)" },
};

const LIBRARY: Record<Kind, {
  eyebrow: string;
  title: string;
  intro: string;
  items: { title: string; author: string; note: string }[];
}> = {
  lectures: {
    eyebrow: "Lectures",
    title: "Des livres pour ne pas se sentir seul·e.",
    intro: "Une sélection courte, lue et choisie pour leur justesse.",
    items: [
      { title: "L'année de la pensée magique", author: "Joan Didion", note: "Le deuil au jour le jour, sans pose." },
      { title: "Vivre avec nos morts", author: "Delphine Horvilleur", note: "Onze récits, beaucoup de tendresse." },
      { title: "Une mort très douce", author: "Simone de Beauvoir", note: "Une fille, sa mère, l'hôpital." },
      { title: "La part manquante", author: "Christian Bobin", note: "Pour les jours où les mots manquent." },
    ],
  },
  films: {
    eyebrow: "Films",
    title: "À regarder quand on a besoin d'être accompagné·e.",
    intro: "Des films doux, jamais larmoyants, qui laissent respirer.",
    items: [
      { title: "Truly, Madly, Deeply", author: "Anthony Minghella", note: "Sur ce qui revient quand on aime." },
      { title: "Manchester by the Sea", author: "Kenneth Lonergan", note: "Le deuil qui ne se résout pas." },
      { title: "Aftersun", author: "Charlotte Wells", note: "La mémoire d'un père, par fragments." },
    ],
  },
  podcasts: {
    eyebrow: "Podcasts",
    title: "Des voix à écouter, le soir, dans le train.",
    intro: "Des récits intimes, des paroles d'expert·es, sans pathos.",
    items: [
      { title: "Floraisons", author: "France Inter", note: "Récits de deuils, série documentaire." },
      { title: "Vivons heureux avant la fin du monde", author: "Arte Radio", note: "Épisode 'Le deuil écologique'." },
      { title: "Émotions", author: "Louie Media", note: "La tristesse, la colère, le manque." },
    ],
  },
  rituels: {
    eyebrow: "Rituels",
    title: "Des gestes simples à reprendre à votre rythme.",
    intro: "Pas une méthode. Des points d'appui, à essayer une fois.",
    items: [
      { title: "Allumer une bougie le soir", author: "5 minutes", note: "Marquer la fin du jour pour soi." },
      { title: "Une promenade lente", author: "20 minutes", note: "Dehors, sans téléphone, sans but." },
      { title: "Écrire une phrase par jour", author: "2 minutes", note: "Pas un journal — une phrase." },
      { title: "Respiration 4-7-8", author: "3 minutes", note: "Inspirer 4, retenir 7, expirer 8." },
    ],
  },
};

export const Route = createFileRoute("/library/$kind")({
  head: ({ params }) => {
    const k = LIBRARY[params.kind as Kind];
    return {
      meta: [
        { title: k ? `${k.eyebrow} — Legato` : "Legato" },
        { name: "description", content: k?.intro ?? "" },
      ],
    };
  },
  component: LibraryPage,
  notFoundComponent: () => (
    <Shell>
      <div className="px-7 pt-20">
        <p className="font-serif text-[1.6rem] italic text-dusk">Pas encore ouvert.</p>
        <Link to="/home" className="mt-4 inline-block text-sm text-dusk/60 underline">
          Revenir à l'accueil
        </Link>
      </div>
    </Shell>
  ),
});

function LibraryPage() {
  const { kind } = Route.useParams();
  const data = LIBRARY[kind as Kind];
  if (!data) throw notFound();
  const t = TINTS[kind as Kind];

  return (
    <Shell>
      <div className="min-h-dvh bg-paper text-dusk pb-24">
        <div className="px-5 pt-5">
          <div
            className="rounded-[24px] px-7 pt-7 pb-9"
            style={{ background: t.bg, color: t.fg }}
          >
            <Link
              to="/home"
              className="text-[10px] uppercase tracking-[0.24em] opacity-65 hover:opacity-100"
              
            >
              ← Accueil
            </Link>
            <p
              className="mt-5 text-[10px] uppercase tracking-[0.28em] opacity-70"
              
            >
              {data.eyebrow}
            </p>
            <h1 className="mt-3 font-serif text-[34px] leading-[1.05] text-balance">
              {data.title.split(/(\bsimples?\b|\bdoux\b|\bjuste|\bvoix\b|\bseul·e\b)/).map((w, i) =>
                /^(simples?|doux|juste|voix|seul·e)$/.test(w) ? (
                  <span key={i} className="italic" style={{ color: t.accent }}>{w}</span>
                ) : (
                  <span key={i}>{w}</span>
                )
              )}
            </h1>
            <p className="mt-4 max-w-[38ch] text-[13.5px] opacity-75">{data.intro}</p>
          </div>
        </div>

        <ul className="mt-6 px-5 space-y-3">
          {data.items.map((it) => (
            <li
              key={it.title}
              className="rounded-[18px] border border-dusk/12 bg-paper px-5 py-4 relative overflow-hidden"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-1"
                style={{ background: t.accent }}
              />
              <p
                className="text-[10px] uppercase tracking-[0.22em] text-dusk/45"
                
              >
                {it.author}
              </p>
              <p className="mt-1.5 font-serif text-[22px] leading-snug text-dusk">{it.title}</p>
              <p className="mt-1 text-[12.5px] text-dusk/60">{it.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}