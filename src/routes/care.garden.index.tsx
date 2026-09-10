import { PageHeader, SectionHead } from "@/components/legato/EditorialUI";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { useLovedName } from "@/lib/loved-name";
import { upcomingSensitiveDates } from "@/lib/sensitive-dates";
import { useLegato } from "@/lib/legato-state";
import { useMemories } from "@/lib/memories-store";
import { useSpaces } from "@/lib/spaces-store";
import jardinIll from "@/assets/ill-jardin.png";

export const Route = createFileRoute("/care/garden/")({
  head: () => ({
    meta: [
      { title: "Jardin — Legato" },
      { name: "description", content: "La vue d'ensemble du Jardin : chaque souvenir déposé y fait pousser une parcelle." },
      { property: "og:title", content: "Jardin — Legato" },
      { property: "og:description", content: "Chaque souvenir déposé fait pousser une parcelle." },
    ],
  }),
  component: CareGarden,
});

type Zone = { kind: string; label: string; hint: string; cx: number; cy: number; r: number };

/* Carte du jardin : positions stables, tailles proches — la différence se lit
 * à la floraison (nombre de souvenirs), jamais à la couleur. */
const ZONES: Zone[] = [
  { kind: "photo",    label: "Photos",    hint: "Un visage, un jour",   cx: 24, cy: 26, r: 17 },
  { kind: "voix",     label: "Voix",      hint: "Un message, un rire",  cx: 62, cy: 18, r: 15 },
  { kind: "lettre",   label: "Lettres",   hint: "Ce qu'on aurait dit",  cx: 80, cy: 44, r: 16 },
  { kind: "musique",  label: "Musiques",  hint: "Ce qui vous relie",    cx: 52, cy: 50, r: 14 },
  { kind: "objet",    label: "Objets",    hint: "Une trace tangible",   cx: 20, cy: 63, r: 16 },
  { kind: "citation", label: "Citations", hint: "Une phrase qui reste", cx: 60, cy: 80, r: 15 },
];

function CareGarden() {
  const lovedName = useLovedName();
  const { hydrated, lovedOneRelation, lightMode } = useLegato();
  const light = hydrated && lightMode;
  const all = useMemories();
  const { spaces } = useSpaces();
  const counts = Object.fromEntries(ZONES.map((z) => [z.kind, all.filter((m) => m.zone === z.kind).length]));
  const total = all.length;
  const dates = hydrated
    ? upcomingSensitiveDates({ windowDays: 14, relation: lovedOneRelation }).slice(0, 1)
    : [];

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader back="/care" title="LE JARDIN" />

        <section className="px-6">
          <p className="mono-label">La parcelle de</p>
          <h1 className="mt-3 ed-page-title">
            <span className="italic" style={{ color: "var(--terracotta)" }}>{lovedName}</span>
          </h1>
          <p className="mt-4 max-w-[32ch] text-[13.5px] leading-[1.6] text-dusk/60">
            Chaque souvenir déposé y reste, et fait pousser une parcelle.
          </p>
        </section>

        <div className="mt-5 px-2">
          <img src={jardinIll} alt="" aria-hidden className="w-full select-none" draggable={false} />
        </div>

        {/* Vue d'ensemble — la carte du jardin */}
        <section className="px-5 pt-8">
          <SectionHead label="Vue du jardin" meta={`${String(total).padStart(2, "0")} souvenir${total > 1 ? "s" : ""}`} />
          <div
            className="craft relative mt-3 w-full overflow-hidden"
            style={{ aspectRatio: "1 / 1" }}
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
              <path d="M2 34 C 28 22, 62 44, 98 30" fill="none" stroke="color-mix(in oklab, var(--dusk) 12%, transparent)" strokeWidth="0.4" strokeDasharray="1.4 2" />
              <path d="M2 68 C 30 56, 64 82, 98 66" fill="none" stroke="color-mix(in oklab, var(--dusk) 12%, transparent)" strokeWidth="0.4" strokeDasharray="1.4 2" />
            </svg>
            {ZONES.map((z) => {
              const n = counts[z.kind] ?? 0;
              const grown = n > 0;
              return (
                <Link
                  key={z.kind}
                  to="/care/garden/$zone"
                  params={{ zone: z.kind }}
                  aria-label={`${z.label} — ${n} souvenir${n > 1 ? "s" : ""}`}
                  className="absolute grid place-items-center rounded-full text-center transition-transform duration-500 active:scale-95"
                  style={{
                    left: `${z.cx - z.r}%`,
                    top: `${z.cy - z.r}%`,
                    width: `${z.r * 2}%`,
                    height: `${z.r * 2}%`,
                    background: grown
                      ? "color-mix(in oklab, var(--terracotta) 16%, var(--whisper))"
                      : "color-mix(in oklab, var(--sage) 45%, var(--whisper))",
                    border: "1px dashed color-mix(in oklab, var(--dusk) 20%, transparent)",
                  }}
                >
                  <span className="px-1">
                    <span className="block font-serif text-[13.5px] leading-[1.1] text-dusk/85">{z.label}</span>
                    <span
                      className="mt-1 block text-[10px] tabular-nums tracking-[0.12em]"
                      style={{ color: grown ? "var(--terracotta)" : "color-mix(in oklab, var(--dusk) 35%, transparent)" }}
                    >
                      {String(n).padStart(2, "0")}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
          <p className="mt-3 px-1 text-[12px] italic text-dusk/45">
            {total === 0 ? "Le jardin attend son premier dépôt." : "Touchez une parcelle pour l'ouvrir."}
          </p>
        </section>

        {/* Déposer — liste éditoriale, pas de gros encarts */}
        <section className="px-5 pt-9">
          <SectionHead label="Déposer un souvenir" meta={`${String(ZONES.length).padStart(2, "0")} formes`} />
          <ul className="mt-1 px-1">
            {ZONES.map((z, i) => (
              <li key={z.kind} className="border-b border-dashed last:border-0" style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}>
                <Link to="/care/garden/$zone" params={{ zone: z.kind }} className="flex items-start gap-4 py-3.5">
                  <span className="mt-[6px] shrink-0 text-[10.5px] tabular-nums tracking-[0.12em] text-dusk/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[17.5px] leading-[1.2]">{z.label}</span>
                    <span className="mt-0.5 block text-[12.5px] text-dusk/55">{z.hint}</span>
                  </span>
                  <span aria-hidden className="mt-1 shrink-0 text-dusk/30">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {spaces.filter((s) => !s.archived).length > 1 && (
          <section className="px-5 pt-9">
            <SectionHead label="Autres parcelles" />
            <div className="mt-3 flex flex-wrap gap-2">
              {spaces.filter((s) => !s.archived).map((s) => (
                <Link
                  key={s.id}
                  to="/profile/proches"
                  className="rounded-full border border-dashed px-4 py-2 text-[12.5px]"
                  style={{ borderColor: "color-mix(in oklab, var(--dusk) 22%, transparent)" }}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {dates.length > 0 && (
          <section className="px-5 pt-9">
            <Link to="/care/dates" className="flex items-center justify-between gap-4 border-t border-dashed pt-4" style={{ borderColor: "color-mix(in oklab, var(--dusk) 18%, transparent)" }}>
              <span>
                <span className="mono-label block" style={{ color: "var(--terracotta)" }}>Une date approche</span>
                <span className="mt-1 block font-serif text-[17px]">
                  {dates[0].label} — {dates[0].daysAway === 0 ? "aujourd'hui" : `dans ${dates[0].daysAway} j`}
                </span>
              </span>
              <span aria-hidden className="text-dusk/30">→</span>
            </Link>
          </section>
        )}

        {!light && (
          <section className="px-5 pt-7">
            <Link to="/care/rituels" className="flex items-center justify-between gap-4 border-t border-dashed pt-4" style={{ borderColor: "color-mix(in oklab, var(--dusk) 18%, transparent)" }}>
              <span>
                <span className="mono-label block">Rituels d'hommage</span>
                <span className="mt-1 block font-serif text-[17px]">Honorer {lovedName}, à votre manière.</span>
              </span>
              <span aria-hidden className="text-dusk/30">→</span>
            </Link>
          </section>
        )}
      </div>
    </Shell>
  );
}
