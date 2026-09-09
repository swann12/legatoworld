import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { useLovedName } from "@/lib/loved-name";
import { useLegato } from "@/lib/legato-state";
import { suggestRituals } from "@/lib/rituals.functions";
import { usePortrait, portraitSentence } from "@/lib/portrait-store";

export const Route = createFileRoute("/care/rituels")({
  head: () => ({
    meta: [
      { title: "Rituels d'hommage — Legato" },
      { name: "description", content: "Des rituels du monde pour honorer un être perdu : 2 minutes, ou plusieurs jours." },
    ],
  }),
  component: CareRituels,
});

type Region = "Universel" | "Asie" | "Amériques" | "Afrique" | "Europe" | "Moyen-Orient" | "Océanie";
const REGIONS: Region[] = ["Universel", "Asie", "Amériques", "Afrique", "Europe", "Moyen-Orient", "Océanie"];

type Ritual = {
  id: string;
  title: string;
  origin: string;
  region: Region;
  duration: string;
  hint: string;
  detail: string;
  bg: string;
};

const RITUALS: Ritual[] = [
  { id: "bougie",    title: "Allumer une bougie",      origin: "Universel",            region: "Universel",  duration: "2 min",   hint: "Un nom prononcé, une flamme tenue.",
    detail: "Le geste le plus ancien et le plus partagé. On allume une lumière, on prononce le nom — et l'on reste avec, quelques minutes.", bg: "var(--sun)" },
  { id: "obon",      title: "Lanterne sur l'eau",      origin: "Japon — Obon",         region: "Asie",       duration: "10 min",  hint: "Une lumière confiée au courant.",
    detail: "Au Japon, pendant Obon, des lanternes en papier (tōrō nagashi) sont déposées sur l'eau. Elles guident l'âme de l'être cher et accompagnent ceux qui restent.", bg: "var(--sky)" },
  { id: "muertos",   title: "Petite offrande",         origin: "Mexique — Día de los Muertos", region: "Amériques", duration: "20 min", hint: "Ses fleurs, ses plats, sa photo.",
    detail: "Au Mexique, l'ofrenda rassemble la photo, les plats préférés, des fleurs de cempasúchil et une bougie. La mort y est joyeusement habitée.", bg: "var(--blush)" },
  { id: "yahrzeit",  title: "Bougie de 24 h",          origin: "Tradition juive — Yahrzeit", region: "Moyen-Orient", duration: "1 jour", hint: "Une lumière qui veille toute la journée.",
    detail: "Le Yahrzeit, marqué chaque année à la date du décès, fait brûler une bougie 24 heures. Une présence silencieuse qui tient compagnie au souvenir.", bg: "var(--whisper)" },
  { id: "wake",      title: "Veillée partagée",        origin: "Irlande — wake",       region: "Europe",     duration: "1 soir",  hint: "Rire et pleurer ensemble.",
    detail: "La wake irlandaise rassemble proches et voisins : on raconte, on chante, on rit, on pleure — tous mêlés. La douleur portée seule devient une douleur traversée à plusieurs.", bg: "var(--sun)" },
  { id: "yaakaar",   title: "Repas et récits",         origin: "Sénégal — Yaakaar",    region: "Afrique",    duration: "1 soir",  hint: "Réunir, manger, raconter.",
    detail: "Au Sénégal, on se rassemble autour d'un repas pour évoquer la personne — un récit, un trait, une habitude. La mémoire collective tient la peine.",
    bg: "color-mix(in oklab, var(--olive) 35%, var(--whisper))" },
  { id: "marche",    title: "Marche silencieuse",      origin: "Bouddhisme zen — kinhin", region: "Asie",    duration: "30 min",  hint: "Marcher en pensant à elle, à lui.",
    detail: "Le kinhin zen : marcher très lentement, attentif au sol et au souffle. Une manière de tenir la pensée à l'être aimé, sans la forcer.", bg: "var(--sky)" },
  { id: "shiva",     title: "Sept jours présents",     origin: "Tradition juive — Shiva", region: "Moyen-Orient", duration: "7 jours", hint: "Recevoir, ne pas être seul·e.",
    detail: "La shiva ouvre la maison sept jours après l'enterrement. Les proches viennent — ils n'attendent rien, ils sont simplement là.", bg: "var(--blush)" },
  { id: "lettre",    title: "Lettre brûlée",           origin: "Taoïsme",              region: "Asie",       duration: "15 min",  hint: "Écrire ce qu'on n'a pas dit, le confier.",
    detail: "Dans le taoïsme, on écrit à la personne disparue ce qui n'a pas pu être dit, puis on confie la lettre au feu. La fumée porte les mots.", bg: "var(--whisper)" },
  { id: "pierre",    title: "Pierre déposée",          origin: "Tradition juive",      region: "Moyen-Orient", duration: "5 min",  hint: "Une pierre, plutôt qu'une fleur.",
    detail: "On dépose une pierre sur la tombe : elle ne fane pas. Une marque que l'on est passé, que l'on n'oublie pas.", bg: "var(--clay)" },
  { id: "samhain",   title: "Une place à table",       origin: "Celtique — Samhain",   region: "Europe",     duration: "1 repas", hint: "Une chaise et une assiette pour iel.",
    detail: "Samhain, ancêtre d'Halloween, invitait les âmes des proches à partager le repas. Une chaise vide, une assiette préparée — l'absence devient présence.", bg: "var(--sun)" },
  { id: "couronne",  title: "Couronne de fleurs",      origin: "Andes — Día de las Almas", region: "Amériques", duration: "30 min", hint: "Tresser des fleurs ensemble.",
    detail: "Dans les Andes, on tresse une couronne avec les fleurs qu'aimait la personne. Le geste lent répare et relie.", bg: "var(--blush)" },
];

const PALETTE = ["var(--sun)", "var(--sky)", "var(--blush)", "var(--whisper)", "var(--clay)", "color-mix(in oklab, var(--olive) 35%, var(--whisper))"];

function classifyRegion(origin: string): Region {
  const o = origin.toLowerCase();
  if (/(japon|chine|cor[ée]e|inde|vietnam|tha[iï]|tibet|bouddh|tao)/.test(o)) return "Asie";
  if (/(mexique|p[ée]rou|br[ée]sil|argentine|colombie|andes|aztèque|inca|maya|am[ée]rique)/.test(o)) return "Amériques";
  if (/(s[ée]n[ée]gal|nigeria|mali|congo|afriqu|yoruba|akan|maghreb|maroc|alg[ée]rie|tunisie|berb[èe]re)/.test(o)) return "Afrique";
  if (/(irlande|celtique|nordique|scandi|grec|italie|espagne|portugal|europe|slave|orthodox|chr[ée]tien|catholique)/.test(o)) return "Europe";
  if (/(juda[iï]|juif|musulman|islam|soufi|arabe|h[ée]breu|moyen)/.test(o)) return "Moyen-Orient";
  if (/(maori|aborig|polyn[ée]si|oc[ée]anie|pacifique)/.test(o)) return "Océanie";
  return "Universel";
}

function CareRituels() {
  const lovedName = useLovedName();
  const { branch, lostName, lightMode, hydrated } = useLegato();
  const light = hydrated && lightMode;
  const callRituals = useServerFn(suggestRituals);
  const { portrait } = usePortrait();
  const portraitLine = portraitSentence(portrait, lostName);
  const [region, setRegion] = useState<Region | "Tout">("Tout");
  const [open, setOpen] = useState<string | null>(null);
  const [extra, setExtra] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const all = [...RITUALS, ...extra];
  const visible = region === "Tout" ? all : all.filter((r) => r.region === region);

  const inspireMore = async () => {
    if (loading) return;
    setLoading(true);
    setAiError(null);
    try {
      const { quick, long } = await callRituals({
        data: { kind: "memoire", title: `Honorer ${lostName}`, date: "à venir", branch, mode: "ancrage", lostName, portrait: portraitLine || undefined },
      });
      const mapped: Ritual[] = [...quick, ...long].map((r, i) => ({
        id: `ai-${Date.now()}-${i}`,
        title: r.title,
        origin: r.origin,
        region: classifyRegion(r.origin),
        duration: `${r.durationMin} min`,
        hint: r.whisper,
        detail: r.originDetail,
        bg: PALETTE[i % PALETTE.length],
      }));
      if (!mapped.length) setAiError("L'IA n'a pas répondu. Réessayez dans un instant.");
      setExtra((cur) => [...mapped, ...cur].slice(0, 12));
    } catch {
      setAiError("Impossible de proposer de nouveaux rituels pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <Link to="/care" aria-label="Retour" className="mono-label text-dusk/55">← Soutien</Link>
          <LegatoMark size={22} />
        </header>

        <section className="px-6 pt-8">
          <p className="mono-label">Rituels d'hommage</p>
          <h1 className="mt-4 ed-page-title">
            Honorer <span className="italic" style={{ color: "var(--terracotta)" }}>{lovedName}</span>.
          </h1>
          {!light && (
            <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[34ch]">
              Des gestes qui viennent du monde entier. Cliquez pour comprendre d'où ils viennent.
            </p>
          )}
        </section>

        {!light && (
        <section className="px-5 pt-6">
          <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
            {(["Tout", ...REGIONS] as const).map((r) => {
              const active = r === region;
              return (
                <button
                  key={r}
                  onClick={() => setRegion(r as Region | "Tout")}
                  className="shrink-0 pb-1 text-[12.5px] tracking-[0.05em] transition-colors"
                  style={{
                    color: active ? "var(--bordeaux)" : "color-mix(in oklab, var(--dusk) 45%, transparent)",
                    borderBottom: active ? "1px solid var(--terracotta)" : "1px solid transparent",
                  }}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </section>

        )}

        <section className="px-5 pt-6">
          <ul className="surf-cream rounded-[18px] px-5">
            {(light ? visible.slice(0, 3) : visible).map((r) => {
              const isOpen = open === r.id;
              return (
                <li
                  key={r.id}
                  className="border-b border-dashed last:border-0"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : r.id)}
                    className="w-full py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="mono-label surf-sub">{r.origin}</p>
                      <span className="text-[11px] tabular-nums surf-sub">{r.duration}</span>
                    </div>
                    <h2 className="mt-2 font-serif text-[20px] leading-[1.15]">{r.title}</h2>
                    <p className="mt-1 text-[13px] surf-sub">{r.hint}</p>
                    {isOpen && (
                      <p className="mt-4 border-t border-dashed pt-3 text-[13.5px] leading-[1.55] italic"
                         style={{ borderColor: "color-mix(in oklab, var(--dusk) 18%, transparent)" }}>
                        {r.detail}
                      </p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            onClick={inspireMore}
            disabled={loading}
            className="craft mt-4 w-full px-5 py-5 text-left text-dusk/70 disabled:opacity-60"
          >
            <p className="mono-label" style={{ color: "var(--terracotta)" }}>Présence</p>
            <p className="mt-1 font-serif text-[18px] text-dusk">
              {loading ? "Cherche des gestes du monde…" : "M'en proposer d'autres"}
            </p>
          </button>
          {aiError && <p className="mt-2 px-1 text-[12px] italic text-dusk/55">{aiError}</p>}
        </section>

      </div>
    </Shell>
  );
}