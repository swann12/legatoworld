import { createFileRoute, Link } from "@tanstack/react-router";
import { Plate } from "@/components/legato/Plate";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, CARE_SUBNAV } from "@/components/legato/SubNav";
import { useLovedName } from "@/lib/loved-name";
import { upcomingSensitiveDates } from "@/lib/sensitive-dates";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/care/garden")({
  head: () => ({
    meta: [
      { title: "Jardin — Legato" },
      { name: "description", content: "La parcelle de votre proche : photos, voix, lettres, musiques, objets — tout ce qui se garde." },
    ],
  }),
  component: CareGarden,
});

type Deposit = { kind: string; label: string; hint: string; bg: string; fg?: string };
// Palette équilibrée, sans répétition : un ton chaud, un froid, un acide,
// un neutre, un grenat profond, un sable.
const DEPOSITS: Deposit[] = [
  { kind: "photo",    label: "Photo",     hint: "Un visage, un jour",        bg: "var(--whisper)"                                  },
  { kind: "voix",     label: "Voix",      hint: "Un message, un rire",        bg: "var(--blush)"                                    },
  { kind: "lettre",   label: "Lettre",    hint: "Quelques mots, déposés",     bg: "var(--sun)"                                      },
  { kind: "musique",  label: "Musique",   hint: "Une chanson partagée",       bg: "color-mix(in oklab, var(--olive) 22%, var(--whisper))" },
  { kind: "objet",    label: "Objet",     hint: "Une trace tangible",         bg: "var(--whisper)"                                  },
  { kind: "citation", label: "Citation",  hint: "Une phrase qu'on garde",     bg: "color-mix(in oklab, var(--bordeaux) 18%, var(--whisper))" },
];

function CareGarden() {
  const lovedName = useLovedName();
  const { hydrated, lovedOneRelation } = useLegato();
  const dates = hydrated
    ? upcomingSensitiveDates({ windowDays: 14, relation: lovedOneRelation }).slice(0, 2)
    : [];

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <span className="mono-label text-dusk/45">Jardin</span>
        </header>
        <SubNav items={CARE_SUBNAV} ariaLabel="Sous-navigation Soutien" />

        <section className="px-6 pt-8">
          <p className="mono-label">La parcelle de</p>
          <h1 className="mt-3 ed-page-title">
            <span className="italic" style={{ color: "var(--terracotta)" }}>{lovedName}</span>
          </h1>
          <p className="mt-5 text-[13.5px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Tout se dépose ici. Rien ne s'efface.
          </p>
          <Plate name="souffle" caption="Ce qui pousse, sans qu'on le force" className="mt-7" ratio="1 / 1" />
        </section>

        {dates.length > 0 && (
          <section className="px-5 pt-7">
            <Link to="/care/dates" className="block rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4">
              <p className="mono-label" style={{ color: "var(--terracotta)" }}>Une date approche</p>
              {dates.map((d) => (
                <p key={d.id} className="mt-2 font-serif text-[17px]">
                  {d.label} — {d.daysAway === 0 ? "aujourd'hui" : `dans ${d.daysAway} j`}
                </p>
              ))}
              <span className="mt-3 inline-block mono-label text-dusk/65">Préparer un geste →</span>
            </Link>
          </section>
        )}

        <section className="px-5 pt-8">
          <p className="mono-label px-1 text-dusk/55">Déposer</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {DEPOSITS.map((d) => (
              <Link
                key={d.kind}
                to="/care/garden/$zone"
                params={{ zone: d.kind }}
                className="rounded-[18px] px-4 py-5 min-h-[110px] flex flex-col justify-between"
                style={{ background: d.bg, color: d.fg ?? "var(--dusk)" }}
              >
                <p className="font-serif text-[20px] leading-[1.1]">{d.label}</p>
                <p className="text-[12px]" style={{ opacity: d.fg ? 0.8 : 0.65 }}>{d.hint}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-5 pt-8">
          <Link to="/care/rituels" className="block rounded-[20px] border border-dusk/12 px-5 py-5 bg-paper">
            <p className="mono-label" style={{ color: "var(--terracotta)" }}>Rituels d'hommage</p>
            <p className="mt-2 font-serif text-[20px] leading-[1.2]">Honorer {lovedName}, à votre manière.</p>
            <p className="mt-1 text-[12.5px] text-dusk/60">Des gestes du monde — 2 minutes, ou plusieurs jours.</p>
          </Link>
        </section>
      </div>
    </Shell>
  );
}