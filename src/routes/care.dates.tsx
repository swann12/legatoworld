import { PageHeader } from "@/components/legato/EditorialUI";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { useLegato } from "@/lib/legato-state";
import { useSpaces, upcomingForSpaces, formatDaysAway, type UpcomingDate } from "@/lib/spaces-store";
import { ritualsForDate, type DateRitual } from "@/lib/date-rituals";

export const Route = createFileRoute("/care/dates")({
  head: () => ({
    meta: [
      { title: "Dates importantes — Soutien Legato" },
      { name: "description", content: "Anticiper les jours qui pèsent, avec un geste doux prêt à l'avance." },
      { property: "og:title", content: "Dates importantes — Soutien Legato" },
      { property: "og:description", content: "Anticiper les jours qui pèsent, avec un geste doux prêt à l'avance." },
    ],
  }),
  component: CareDates,
});

function CareDates() {
  const { spaces, hydrated, addDate, removeDate } = useSpaces();
  const { hydrated: lgHydrated, lightMode } = useLegato();
  const light = lgHydrated && lightMode;
  const actifs = spaces.filter((s) => !s.archived);
  const dates = upcomingForSpaces(actifs, 400);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const soon = dates.filter((d) => d.daysAway <= 30);
  const later = dates.filter((d) => d.daysAway > 30);

  return (
    <Shell livingBg={false}>
      <div className="wash-sky min-h-dvh text-dusk pb-32">
        <PageHeader back="/profile" title="DATES IMPORTANTES" />

        <section className="px-6 pt-8">
          
          <h1 className="mt-5 font-serif font-normal text-[32px] leading-[1.06]">
            Anticiper les jours<br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>qui pèsent</span>.
          </h1>
          {!light && (
            <p className="mt-4 text-[13px] leading-[1.6] text-dusk/60 max-w-[34ch]">
              Un anniversaire, une date de départ, un premier Noël. Pour chacune, un geste simple est déjà prêt.
            </p>
          )}
        </section>

        {hydrated && actifs.length === 0 && (
          <section className="px-5 pt-8">
            <Link to="/profile/proches" className="block rounded-[20px] border border-dashed border-dusk/20 bg-[color:var(--whisper)] px-5 py-7 text-center">
              <p className="mono-label text-dusk/55">Commencer</p>
              <p className="mt-2 text-[13px] text-dusk/65 max-w-[28ch] mx-auto">
                Créez d'abord un espace pour la personne dont vous voulez garder les dates.
              </p>
            </Link>
          </section>
        )}

        {soon.length > 0 && (
          <section className="px-5 pt-8">
            <p className="mono-label px-1">Les 30 prochains jours</p>
            <div className="mt-4 space-y-3">
              {soon.map((d) => (
                <DateCard key={d.key} d={d} open={openKey === d.key} onToggle={() => setOpenKey(openKey === d.key ? null : d.key)} onRemove={() => removeDate(d.spaceId, d.key.split("-").slice(1).join("-"))} />
              ))}
            </div>
          </section>
        )}

        {later.length > 0 && !light && (
          <section className="px-5 pt-9">
            <p className="mono-label px-1">Plus tard dans l'année</p>
            <div className="mt-4 space-y-3">
              {later.map((d) => (
                <DateCard key={d.key} d={d} open={openKey === d.key} onToggle={() => setOpenKey(openKey === d.key ? null : d.key)} onRemove={() => removeDate(d.spaceId, d.key.split("-").slice(1).join("-"))} />
              ))}
            </div>
          </section>
        )}

        {hydrated && actifs.length > 0 && dates.length === 0 && !adding && (
          <section className="px-5 pt-8">
            <div className="rounded-[20px] border border-dashed border-dusk/20 bg-[color:var(--whisper)] px-5 py-7 text-center">
              <p className="mono-label text-dusk/55">Aucune date</p>
              <p className="mt-2 text-[13px] text-dusk/65 max-w-[28ch] mx-auto">
                Vous pouvez en ajouter une, ou laisser cette page vide. Rien n'est obligatoire.
              </p>
            </div>
          </section>
        )}

        {actifs.length > 0 && (
          <section className="px-5 pt-6">
            {adding ? (
              <AddDateForm
                spaces={actifs.map((s) => ({ id: s.id, name: s.name }))}
                onCancel={() => setAdding(false)}
                onSubmit={(spaceId, label, date) => { addDate(spaceId, label, date); setAdding(false); }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="w-full rounded-[18px] border border-dusk/15 bg-paper px-5 py-4 text-left"
              >
                <p className="mono-label" style={{ color: "var(--terracotta)" }}>Ajouter</p>
                <p className="mt-1 font-serif text-[18px]">Une date à ne pas traverser seul·e →</p>
              </button>
            )}
          </section>
        )}

        {!light && (
        <section className="px-7 pt-10">
          <Link to="/crisis" className="block border-t border-dusk/12 pt-6 text-center">
            <p className="mono-label">Si un de ces jours devient trop lourd</p>
            <p className="mt-2 font-serif text-[17px]" style={{ color: "var(--bordeaux)" }}>Une porte calme →</p>
          </Link>
        </section>
        )}
      </div>
    </Shell>
  );
}

function DateCard({ d, open, onToggle, onRemove }: { d: UpcomingDate; open: boolean; onToggle: () => void; onRemove: () => void }) {
  const rituals = ritualsForDate(d);
  const bg = d.kind === "death" ? "var(--whisper)" : d.kind === "birthday" ? "var(--peach)" : "var(--sky)";
  return (
    <div className="rounded-[20px] px-5 py-5" style={{ background: bg }}>
      <button type="button" onClick={onToggle} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mono-label text-dusk/60">{d.spaceName}</p>
            <p className="mt-2 font-serif text-[21px] leading-[1.12]">{d.label}</p>
            <p className="mt-1 text-[12.5px] text-dusk/65">
              {formatDaysAway(d.daysAway)} · {d.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
            </p>
          </div>
          <span className="mono-label text-dusk/55 shrink-0">{open ? "Fermer" : "Préparer"}</span>
        </div>
      </button>

      {open && (
        <div className="mt-5 space-y-2">
          <p className="mono-label text-dusk/55">Un geste possible ce jour-là</p>
          {rituals.map((r) => <RitualRow key={r.id} r={r} />)}
          {d.kind === "custom" && (
            <button type="button" onClick={onRemove} className="mt-2 mono-label" style={{ color: "var(--bordeaux)" }}>
              Retirer cette date
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function RitualRow({ r }: { r: DateRitual }) {
  return (
    <Link to={r.to} className="block rounded-[14px] bg-paper/75 px-4 py-3">
      <p className="font-serif text-[16px] leading-tight">{r.title}</p>
      <p className="mt-1 text-[12px] text-dusk/65">{r.body}</p>
      <p className="mt-2 mono-label text-dusk/55">{r.cta} →</p>
    </Link>
  );
}

function AddDateForm({
  spaces, onCancel, onSubmit,
}: {
  spaces: { id: string; name: string }[];
  onCancel: () => void;
  onSubmit: (spaceId: string, label: string, date: string) => void;
}) {
  const [spaceId, setSpaceId] = useState(spaces[0]?.id ?? "");
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");

  return (
    <form
      className="rounded-[20px] border border-dusk/15 bg-paper px-5 py-5"
      onSubmit={(e) => { e.preventDefault(); if (!label.trim() || !date || !spaceId) return; onSubmit(spaceId, label, date); }}
    >
      <p className="mono-label text-dusk/60">Nouvelle date</p>

      {spaces.length > 1 && (
        <>
          <p className="mt-4 mono-label text-dusk/55">Pour qui</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {spaces.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSpaceId(s.id)}
                className="rounded-full border px-3.5 py-1.5 text-[12px]"
                style={{
                  borderColor: spaceId === s.id ? "var(--terracotta)" : "rgba(0,0,0,0.14)",
                  background: spaceId === s.id ? "color-mix(in oklab, var(--terracotta) 14%, var(--paper))" : "transparent",
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </>
      )}

      <label className="mt-4 block mono-label text-dusk/55">Ce que c'est</label>
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Notre anniversaire de mariage"
        className="mt-2 w-full rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[15px] outline-none focus:border-dusk/35"
      />

      <label className="mt-4 block mono-label text-dusk/55">Le jour</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mt-2 w-full rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[14px] outline-none focus:border-dusk/35"
      />

      <div className="mt-5 flex items-center gap-4">
        <button
          type="submit"
          disabled={!label.trim() || !date}
          className="rounded-full px-5 py-2.5 text-[13px] disabled:opacity-40"
          style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
        >
          Enregistrer
        </button>
        <button type="button" onClick={onCancel} className="mono-label text-dusk/55">Annuler</button>
      </div>
    </form>
  );
}
