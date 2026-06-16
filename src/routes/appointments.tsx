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
          <Link to="/practical" className="eyebrow hover:text-dusk">← Retour</Link>
          <p className="eyebrow mt-6">Mes rendez-vous</p>
          <h1 className="mt-4 display-xl text-dusk text-balance">
            Ce qui est <span className="italic" style={{ color: "var(--terracotta)" }}>posé</span> dans l'agenda.
          </h1>
          <p className="mt-5 body-meta max-w-[38ch]">
            Les rendez-vous concrets — mairie, notaire, professionnels — au même endroit.
          </p>
        </header>

        <ul className="mt-9 px-5 space-y-3">
          {APPOINTMENTS.map((a) => (
            <li
              key={a.id}
              className="card-plain relative overflow-hidden px-5 py-4"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-1.5"
                style={{ background: a.tint }}
              />
              <p className="eyebrow">{a.when}</p>
              <p className="mt-2 h-section text-dusk">{a.what}</p>
              <p className="mt-1 body-meta">{a.who} · <span className="italic">{a.where}</span></p>
            </li>
          ))}
        </ul>

        <div className="mt-8 px-7">
          <Link
            to="/dates"
            className="body-meta underline underline-offset-4 hover:text-dusk"
          >
            Voir aussi mes dates sensibles →
          </Link>
        </div>
      </div>
    </Shell>
  );
}