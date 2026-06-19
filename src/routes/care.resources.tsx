import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { SubNav, CARE_SUBNAV } from "@/components/legato/SubNav";

export const Route = createFileRoute("/care/resources")({
  head: () => ({ meta: [{ title: "Ressources — Legato" }] }),
  component: CareResources,
});

type Resource = { id: string; kind: string; title: string; hint: string; bg: string; to?: string };
const FEATURED: Resource[] = [
  { id: "therapeutes", kind: "Annuaire", title: "Thérapeutes du deuil", hint: "Des personnes formées à ce chemin.", bg: "var(--blush)", to: "/resources" },
  { id: "ecoute",      kind: "Écoute",   title: "Lignes & groupes",     hint: "Parler sans rendez-vous.", bg: "var(--sky)", to: "/resources" },
  { id: "corps",       kind: "Corps",    title: "Accompagnement du jour", hint: "Deux gestes adaptés à votre état.", bg: "var(--sun)", to: "/help" },
];
const LIBRARY: Resource[] = [
  { id: "podcasts", kind: "Audio", title: "Podcasts", hint: "Voix qui accompagnent.", bg: "var(--whisper)" },
  { id: "livres", kind: "Lecture", title: "Livres", hint: "Sélection sensible.", bg: "var(--whisper)" },
  { id: "proche", kind: "Présence", title: "Aider un proche", hint: "Mots, gestes, présence.", bg: "var(--blush)" },
  { id: "rituels", kind: "Mémoire", title: "Rituels du monde", hint: "Gestes culturels expliqués.", bg: "var(--sun)" },
];

function CareResources() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <Link to="/care" className="mono-label text-dusk/55">Soutien →</Link>
        </header>
        <SubNav items={CARE_SUBNAV} ariaLabel="Sous-navigation Soutien" />

        <section className="px-6 pt-8">
          <p className="mono-label">Ressources</p>
          <h1 className="mt-4 ed-page-title">
            Pour vous <span className="italic" style={{ color: "var(--terracotta)" }}>guider</span>.
          </h1>
        </section>

        <section className="px-5 pt-8 flex flex-col gap-3">
          {FEATURED.map((r) => (
            <Link key={r.id} to={(r.to ?? "/care") as "/care"} search={r.to === "/resources" ? { space: "care" } : undefined} className="block rounded-[20px] px-5 py-5" style={{ background: r.bg, color: "var(--dusk)" }}>
              <p className="mono-label" style={{ opacity: 0.75 }}>{r.kind}</p>
              <p className="mt-2 font-serif text-[22px] leading-[1.15]">{r.title}</p>
              <p className="mt-1 text-[12.5px]" style={{ opacity: 0.8 }}>{r.hint}</p>
            </Link>
          ))}
        </section>

        <section className="px-5 pt-8">
          <p className="mono-label px-1 text-dusk/55">Bibliothèque</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {LIBRARY.map((r) => (
              <div key={r.id} className="rounded-[18px] px-4 py-4 min-h-[110px] flex flex-col justify-between" style={{ background: r.bg }}>
                <p className="mono-label text-dusk/55">{r.kind}</p>
                <div>
                  <p className="font-serif text-[17px] leading-tight">{r.title}</p>
                  <p className="mt-1 text-[11.5px] text-dusk/60">{r.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}