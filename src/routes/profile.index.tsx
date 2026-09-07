import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { useSpaces, upcomingForSpaces, formatDaysAway } from "@/lib/spaces-store";
import { usePortrait, portraitSentence } from "@/lib/portrait-store";
import { useLovedName } from "@/lib/loved-name";

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
  const { name, setName, softDay, toggleSoftDay, lightMode, setLightMode, primaryNeed, situation, hydrated } = useLegato();
  const { spaces, hydrated: spacesReady } = useSpaces();
  const { portrait, filled } = usePortrait();
  const lovedName = useLovedName();
  const dates = spacesReady ? upcomingForSpaces(spaces, 400).slice(0, 3) : [];
  const active = spaces.filter((s) => !s.archived);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-7 flex items-center">
          <Link to="/home" aria-label="Retour" className="text-dusk/60 text-lg leading-none">←</Link>
        </header>

        <section className="px-6 pt-10">
          <p className="mono-label">Profil</p>
          <h1 className="mt-5 ed-page-title">
            Votre <span className="italic" style={{ color: "var(--terracotta)" }}>espace</span>
          </h1>
        </section>

        {/* 1 — Mes espaces */}
        <section className="px-5 pt-9">
          <p className="mono-label px-1">Mes espaces</p>
          <Link to="/profile/proches" className="mt-3 block rounded-[20px] px-5 py-5" style={{ background: "var(--blush)" }}>
            <p className="font-serif text-[20px] leading-[1.15]">Un espace par être aimé</p>
            <p className="mt-1.5 text-[12.5px] text-dusk/65">
              {spacesReady && active.length
                ? active.map((s) => s.name).join(" · ")
                : "Créer, modifier, mettre de côté — le jardin et les dates suivent."}
            </p>
          </Link>
        </section>

        {/* 2 — Dates importantes */}
        <section className="px-5 pt-8">
          <p className="mono-label px-1">Dates importantes</p>
          <Link to="/care/dates" className="mt-3 block rounded-[20px] px-5 py-5" style={{ background: "var(--sun)" }}>
            <p className="font-serif text-[20px] leading-[1.15]">Les jours qui pèsent</p>
            {dates.length ? (
              <ul className="mt-3 space-y-1.5">
                {dates.map((d) => (
                  <li key={d.key} className="text-[12.5px] text-dusk/70">
                    {formatDaysAway(d.daysAway)} — {d.label} · {d.spaceName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-[12.5px] text-dusk/65">Anniversaire, date du départ, et un geste prêt à l'avance.</p>
            )}
          </Link>
        </section>

        {/* 3 — Son portrait */}
        <section className="px-5 pt-8">
          <p className="mono-label px-1">Son portrait</p>
          <Link to="/profile/portrait" className="mt-3 block rounded-[20px] border border-dusk/12 px-5 py-5 bg-paper">
            <p className="font-serif text-[20px] leading-[1.15]">
              {lovedName ? `Qui était ${lovedName}` : "Qui elle était"}
            </p>
            <p className="mt-1.5 text-[12.5px] text-dusk/65 max-w-[34ch]">
              {filled ? portraitSentence(portrait, lovedName) || `${filled} choix enregistrés.` : "Quelques choix qui guident Présence, les rituels, la cérémonie et le jardin."}
            </p>
          </Link>
        </section>

        {/* 4 — Rituels */}
        <section className="px-5 pt-8">
          <p className="mono-label px-1">Rituels</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link to="/care/rituels" className="rounded-[18px] px-5 py-5" style={{ background: "var(--whisper)" }}>
              <p className="font-serif text-[17px]">Mes rituels</p>
              <p className="mt-1 text-[12px] text-dusk/60">Gestes courts, à votre rythme.</p>
            </Link>
            <Link to="/care/garden" className="rounded-[18px] px-5 py-5" style={{ background: "var(--sage)" }}>
              <p className="font-serif text-[17px]">Le jardin</p>
              <p className="mt-1 text-[12px] text-dusk/60">Les souvenirs déposés.</p>
            </Link>
          </div>
        </section>

        {/* 5 — Préférences */}
        <section className="px-6 pt-10">
          <p className="mono-label">Préférences</p>

          <label className="mt-5 block text-[12.5px] text-dusk/60">Comment Legato vous appelle</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[15px] outline-none focus:border-dusk/35"
          />

          <div className="mt-5 flex items-center justify-between rounded-[14px] border border-dusk/12 bg-[color:var(--whisper)] px-4 py-4">
            <p className="text-[13px] text-dusk/70 max-w-[24ch]">
              <span className="block font-medium text-dusk">Aujourd'hui c'est dur</span>
              Masque les démarches non urgentes et simplifie le ton.
            </p>
            <button
              onClick={toggleSoftDay}
              className="shrink-0 rounded-full px-4 py-2 text-[12px] font-medium"
              style={{
                background: hydrated && softDay ? "var(--terracotta)" : "transparent",
                color: hydrated && softDay ? "var(--paper)" : "var(--dusk)",
                border: "1px solid color-mix(in oklab, var(--dusk) 12%, transparent)",
              }}
            >
              {hydrated && softDay ? "Activé" : "Activer"}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-[14px] border border-dusk/12 bg-paper px-4 py-4">
            <p className="text-[13px] text-dusk/70 max-w-[24ch]">
              <span className="block font-medium text-dusk">Mode allégé</span>
              Moins de cartes, une action à la fois.
            </p>
            <button
              onClick={() => setLightMode(!lightMode)}
              className="shrink-0 rounded-full px-4 py-2 text-[12px] font-medium"
              style={{
                background: hydrated && lightMode ? "var(--sun)" : "transparent",
                color: "var(--dusk)",
                border: "1px solid color-mix(in oklab, var(--dusk) 12%, transparent)",
              }}
            >
              {hydrated && lightMode ? "Activé" : "Activer"}
            </button>
          </div>

          {hydrated && (
            <div className="mt-5 text-[13px] text-dusk/70 space-y-1.5">
              {situation && <p>Situation : {situation}</p>}
              {primaryNeed && <p>Besoin principal : {primaryNeed === "emotional" ? "soutien" : primaryNeed === "practical" ? "démarches" : "les deux"}</p>}
              <Link to="/onboarding" className="mt-2 inline-block mono-label" style={{ color: "var(--terracotta)" }}>
                Revoir mes réponses →
              </Link>
            </div>
          )}
        </section>

        {/* 6 — Archives */}
        <section className="px-6 pt-10">
          <p className="mono-label">Archives</p>
          <div className="mt-3 space-y-2">
            <Link to="/practical" className="block text-[13.5px] text-dusk/70 underline underline-offset-4">
              Démarches terminées ou hors sujet
            </Link>
            <Link to="/profile/proches" className="block text-[13.5px] text-dusk/70 underline underline-offset-4">
              Espaces mis de côté
            </Link>
            <Link to="/care/journal" className="block text-[13.5px] text-dusk/70 underline underline-offset-4">
              Mes écrits
            </Link>
          </div>
        </section>

        {/* 7 — Compte */}
        <section className="px-6 pt-10">
          <p className="mono-label">Compte</p>
          <p className="mt-3 text-[12.5px] text-dusk/60 leading-[1.6] max-w-[36ch]">
            Vos écrits, vos souvenirs, vos émotions vous appartiennent. Rien n'est vendu, rien n'est utilisé pour de la publicité. L'IA ne remplace pas un·e thérapeute&nbsp;: en cas de détresse, un humain reste à un appel.
          </p>
          <div className="mt-4 space-y-2">
            <Link to="/auth" className="block mono-label" style={{ color: "var(--terracotta)" }}>
              Connexion et sécurité →
            </Link>
            <Link to="/crisis" className="block mono-label" style={{ color: "var(--terracotta)" }}>
              Numéros d'écoute →
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}
