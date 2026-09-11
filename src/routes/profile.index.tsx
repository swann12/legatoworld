import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { useSpaces, upcomingForSpaces, formatDaysAway } from "@/lib/spaces-store";
import { usePortrait, portraitSentence } from "@/lib/portrait-store";
import { useLovedName } from "@/lib/loved-name";
import { StatTrio, IndexMark } from "@/components/legato/Viz";


export const Route = createFileRoute("/profile/")({
  head: () => ({
    meta: [
      { title: "Profil — Legato" },
      { name: "description", content: "Mes espaces, dates importantes, rituels, préférences, archives et compte." },
      { property: "og:title", content: "Mon profil — Legato" },
      { property: "og:description", content: "Vos espaces, vos dates, vos rituels et vos préférences, au même endroit." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { name, setName, softDay, toggleSoftDay, lightMode, setLightMode, hydrated } = useLegato();
  const { spaces, hydrated: spacesReady } = useSpaces();
  const { portrait, filled } = usePortrait();
  const lovedName = useLovedName();
  const upcoming = spacesReady ? upcomingForSpaces(spaces, 400) : [];
  const dates = upcoming.slice(0, 2);
  const active = spaces.filter((s) => !s.archived);

  return (
    <Shell livingBg={false}>
      <div className="wash-mauve min-h-dvh text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center">
          <Link to="/home" aria-label="Retour" className="text-dusk/60 text-lg leading-none">←</Link>
        </header>

        <section className="px-6 pt-8">
          <p className="mono-label">Profil</p>
          <h1 className="mt-4 ed-page-title">
            Votre <span className="italic" style={{ color: "var(--terracotta)" }}>espace</span>
          </h1>
          
        </section>

        {/* Trois chiffres */}
        <section className="px-5 pt-8">
          <StatTrio
            items={[
              { value: active.length, label: "espaces" },
              { value: upcoming.length, label: "dates à venir" },
              { value: `${filled}/6`, label: "portrait" },
            ]}
          />
        </section>

        {/* Espaces */}
        <section className="px-5 pt-9">
          <p className="mono-label px-1">Les personnes que je porte</p>
          <Link to="/profile/proches" className="craft mt-3 flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="font-serif text-[19px] leading-[1.15]">Une page par personne aimée</p>
              {spacesReady && active.length > 0 && (
                <p className="mt-1 truncate text-[12px] text-dusk/50">{active.map((s) => s.name).join(" · ")}</p>
              )}
            </div>
            <span className="text-dusk/35">→</span>
          </Link>
        </section>

        {/* Dates */}
        <section className="px-5 pt-8">
          <div className="flex items-baseline justify-between px-1">
            <p className="mono-label">Dates importantes</p>
            <IndexMark i={dates.length} total={upcoming.length || dates.length} />
          </div>
          <div className="craft mt-3 px-5 py-4">
            {dates.length ? (
              <ul className="space-y-3">
                {dates.map((d) => (
                  <li key={d.key} className="flex items-baseline justify-between gap-4">
                    <span className="font-serif text-[17px] leading-[1.15]">{d.label}</span>
                    <span className="shrink-0 text-[12px] tabular-nums text-dusk/50">{formatDaysAway(d.daysAway)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-dusk/55">Aucune date enregistrée.</p>
            )}
            <Link to="/care/dates" className="mt-4 inline-block mono-label" style={{ color: "var(--terracotta)" }}>
              Voir tout →
            </Link>
          </div>
        </section>

        {/* Portrait — seule ancre sombre */}
        <section className="px-5 pt-8">
          <Link to="/profile/portrait" className="surf-sumi block rounded-[20px] px-6 py-6">
            <p className="mono-label">Portrait</p>
            <p className="mt-3 font-serif text-[22px] leading-[1.15]">
              {lovedName ? `Qui était ${lovedName}` : "Qui elle était"}
            </p>
            <p className="mt-2 surf-sub text-[12.5px] max-w-[34ch]">
              {filled ? portraitSentence(portrait, lovedName) || `${filled} choix enregistrés.` : "Six choix qui guident Legato."}
            </p>
          </Link>
        </section>

        {/* Rituels */}
        <section className="px-5 pt-8">
          <p className="mono-label px-1">Rituels</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link to="/care/rituels" className="craft flex min-h-[92px] flex-col justify-between px-5 py-4">
              <IndexMark i={1} total={2} />
              <p className="font-serif text-[18px]">Mes rituels</p>
            </Link>
            <Link to="/care/garden" className="craft flex min-h-[92px] flex-col justify-between px-5 py-4">
              <IndexMark i={2} total={2} />
              <p className="font-serif text-[18px]">Le jardin</p>
            </Link>
          </div>
        </section>

        {/* Préférences */}
        <section className="px-6 pt-10">
          <p className="mono-label">Préférences</p>

          <label className="mt-4 block text-[12px] text-dusk/50">Votre prénom</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-[14px] border border-dashed border-dusk/25 bg-transparent px-4 py-3 text-[15px] outline-none focus:border-dusk/45"
          />

          <div className="craft mt-4 flex items-center justify-between gap-4 px-5 py-4">
            <p className="font-serif text-[17px]">Aujourd'hui c'est dur</p>
            <button
              onClick={toggleSoftDay}
              className="shrink-0 rounded-full px-4 py-1.5 text-[12px]"
              style={{
                background: hydrated && softDay ? "var(--terracotta)" : "transparent",
                color: hydrated && softDay ? "var(--paper)" : "var(--dusk)",
                border: "1px dashed color-mix(in oklab, var(--dusk) 25%, transparent)",
              }}
            >
              {hydrated && softDay ? "Activé" : "Activer"}
            </button>
          </div>

          <div className="craft mt-3 flex items-center justify-between gap-4 px-5 py-4">
            <p className="font-serif text-[17px]">Alléger</p>
            <button
              onClick={() => setLightMode(!lightMode)}
              className="shrink-0 rounded-full px-4 py-1.5 text-[12px]"
              style={{
                background: hydrated && lightMode ? "var(--terracotta)" : "transparent",
                color: hydrated && lightMode ? "var(--paper)" : "var(--dusk)",
                border: "1px dashed color-mix(in oklab, var(--dusk) 25%, transparent)",
              }}
            >
              {hydrated && lightMode ? "Activé" : "Activer"}
            </button>
          </div>

          <Link to="/onboarding" className="mt-4 inline-block mono-label" style={{ color: "var(--terracotta)" }}>
            Revoir mes réponses →
          </Link>
        </section>

        {/* Archives & compte */}
        <section className="px-6 pt-10">
          <p className="mono-label">Archives</p>
          <div className="mt-3">
            <Row to="/practical" label="Démarches terminées" />
            <Row to="/profile/proches" label="Espaces mis de côté" />
            <Row to="/care/journal" label="Mes écrits" />
          </div>
        </section>

        <section className="px-6 pt-10">
          <p className="mono-label">Compte</p>
          <div className="mt-3">
            <Row to="/auth" label="Connexion et sécurité" />
            <Row to="/crisis" label="Numéros d'écoute" />
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Row({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to as "/practical"}
      className="flex items-center justify-between gap-4 border-b border-dashed border-dusk/20 py-3.5"
    >
      <span className="font-serif text-[17px] leading-[1.15]">{label}</span>
      <span className="text-dusk/35">→</span>
    </Link>
  );
}
