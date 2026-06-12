import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "Mes rendez-vous — Legato" },
      { name: "description", content: "Vos rendez-vous concrets à venir : mairie, notaire, professionnels." },
    ],
  }),
  component: Appointments,
});

const APPOINTMENTS = [
  { id: "a1", who: "Mairie de Paris 11ᵉ", what: "Déclaration de décès",         when: "Lundi 16 mai · 10h00", where: "Place Léon Blum",        tint: "var(--sky)" },
  { id: "a2", who: "Maître Lambert",       what: "Ouverture de succession",      when: "Jeudi 19 mai · 14h30", where: "12 rue de Turbigo",       tint: "var(--peach)" },
  { id: "a3", who: "Pompes funèbres",      what: "Choix de la cérémonie",        when: "Mardi 17 mai · 9h00",  where: "Visio",                   tint: "var(--terracotta)" },
];

function Appointments() {
  return (
    <Shell>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-7 pt-12">
          <Link
            to="/practical"
            className="text-[10px] uppercase tracking-[0.24em] text-dusk/50 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← Retour
          </Link>
          <p
            className="mt-6 text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Mes rendez-vous
          </p>
          <h1 className="mt-3 font-serif text-[32px] leading-[1.08] font-light text-balance">
            Ce qui est <span className="italic" style={{ color: "var(--terracotta)" }}>posé</span> dans l'agenda.
          </h1>
          <p className="mt-3 max-w-[38ch] text-[13.5px] text-dusk/60">
            Les rendez-vous concrets — mairie, notaire, professionnels — au même endroit.
          </p>
        </header>

        <ul className="mt-9 px-5 space-y-3">
          {APPOINTMENTS.map((a) => (
            <li
              key={a.id}
              className="relative overflow-hidden rounded-[18px] border border-dusk/12 bg-paper px-5 py-4"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-1.5"
                style={{ background: a.tint }}
              />
              <p
                className="text-[10px] uppercase tracking-[0.22em] text-dusk/55"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {a.when}
              </p>
              <p className="mt-2 font-serif text-[20px] leading-snug text-dusk">{a.what}</p>
              <p className="mt-1 text-[13px] text-dusk/65">{a.who} · <span className="italic">{a.where}</span></p>
            </li>
          ))}
        </ul>

        <div className="mt-8 px-7">
          <Link
            to="/dates"
            className="text-[12px] text-dusk/60 underline underline-offset-4 hover:text-dusk"
          >
            Voir aussi mes dates sensibles →
          </Link>
        </div>
      </div>
    </Shell>
  );
}