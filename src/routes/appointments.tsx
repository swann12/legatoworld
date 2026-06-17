import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PageHeader, IvoryCard, SectionLabel } from "@/components/legato/EditorialUI";

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
        <PageHeader title="RENDEZ-VOUS" back="/practical" />

        <section className="px-6 pt-4 pb-6">
          <p className="mono-label">Mes rendez-vous</p>
          <h1 className="mt-4 ed-page-title">
            Ce qui est <span className="italic" style={{ color: "var(--terracotta)" }}>posé</span> dans l'agenda.
          </h1>
          <p className="mt-5 body-meta max-w-[38ch]">
            Les rendez-vous concrets — mairie, notaire, professionnels — au même endroit.
          </p>
        </section>

        <ul className="px-5 space-y-3">
          {APPOINTMENTS.map((a) => (
            <li key={a.id} className="relative overflow-hidden rounded-[18px] border border-dusk/10 bg-paper">
              <span aria-hidden className="absolute left-0 top-0 h-full w-1.5" style={{ background: a.tint }} />
              <div className="px-5 py-4 pl-6">
                <p className="mono-label">{a.when}</p>
                <p className="mt-2 font-serif text-[20px] leading-tight text-dusk">{a.what}</p>
                <p className="mt-1 body-meta">{a.who} · <span className="italic">{a.where}</span></p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 px-6">
          <Link to="/dates" className="body-meta underline underline-offset-4 hover:text-dusk">
            Voir aussi mes dates sensibles →
          </Link>
        </div>
      </div>
    </Shell>
  );
}
