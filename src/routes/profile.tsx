import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profil — Legato" },
      { name: "description", content: "Vos préférences, votre confidentialité, votre rythme." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { name, setName, softDay, toggleSoftDay, primaryNeed, situation, hydrated } = useLegato();

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

        <section className="px-5 pt-8">
          <Link
            to="/profile/proches"
            className="block rounded-[20px] px-5 py-5"
            style={{ background: "var(--blush)" }}
          >
            <p className="mono-label text-dusk/60">Êtres aimés</p>
            <p className="mt-2 font-serif text-[20px] leading-[1.15]">Vos êtres aimés</p>
            <p className="mt-1 text-[12.5px] text-dusk/65">Consulter, ajouter, retrouver ceux que vous avez archivés.</p>
          </Link>
        </section>

        <section className="px-6 pt-10">
          <label className="mono-label block">Prénom</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-3 w-full rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[15px] outline-none focus:border-dusk/35"
          />
        </section>

        <section className="px-6 pt-8">
          <p className="mono-label">Aujourd'hui c'est dur</p>
          <div className="mt-3 flex items-center justify-between rounded-[14px] border border-dusk/12 bg-[color:var(--whisper)] px-4 py-4">
            <p className="text-[13px] text-dusk/70 max-w-[24ch]">
              Allège la home, masque les démarches non urgentes, simplifie le ton.
            </p>
            <button
              onClick={toggleSoftDay}
              className="rounded-full px-4 py-2 text-[12px] font-medium"
              style={{
                background: hydrated && softDay ? "var(--terracotta)" : "transparent",
                color: hydrated && softDay ? "var(--paper)" : "var(--dusk)",
                border: "1px solid var(--dusk-12, rgba(0,0,0,0.12))",
              }}
            >
              {hydrated && softDay ? "Activé" : "Activer"}
            </button>
          </div>
        </section>

        {hydrated && (
          <section className="px-6 pt-8">
            <p className="mono-label">Votre parcours</p>
            <ul className="mt-3 text-[13px] text-dusk/70 space-y-1.5">
              {situation && <li>Situation : {situation}</li>}
              {primaryNeed && <li>Besoin principal : {primaryNeed === "emotional" ? "soutien" : primaryNeed === "practical" ? "démarches" : "les deux"}</li>}
            </ul>
            <Link to="/onboarding" className="mt-4 inline-block mono-label" style={{ color: "var(--terracotta)" }}>
              Refaire l'onboarding →
            </Link>
          </section>
        )}

        <section className="px-6 pt-10">
          <p className="mono-label">Confidentialité</p>
          <p className="mt-3 text-[12.5px] text-dusk/60 leading-[1.6] max-w-[36ch]">
            Vos écrits, vos souvenirs, vos émotions vous appartiennent. Rien n'est vendu, rien n'est utilisé pour de la publicité. L'IA ne remplace pas un·e thérapeute&nbsp;: en cas de détresse, un humain reste à un appel.
          </p>
          <Link to="/crisis" className="mt-4 inline-block mono-label" style={{ color: "var(--terracotta)" }}>
            Numéros d'écoute →
          </Link>
        </section>
      </div>
    </Shell>
  );
}