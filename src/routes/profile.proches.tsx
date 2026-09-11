import { PageHeader } from "@/components/legato/EditorialUI";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { RELATIONS, type Relation } from "@/lib/legato-state";
import { useActiveSpaceId, setActiveSpaceId } from "@/lib/active-space";
import {
  useSpaces, RELATION_LABEL, upcomingForSpaces, formatDaysAway, type Space,
} from "@/lib/spaces-store";

export const Route = createFileRoute("/profile/proches")({
  head: () => ({
    meta: [
      { title: "Les personnes que je porte — Legato" },
      { name: "description", content: "Une page par personne aimée : son jardin, ses dates, ce qui a été déposé." },
      { property: "og:title", content: "Les personnes que je porte — Legato" },
      { property: "og:description", content: "Une page par personne aimée : son jardin, ses dates, ce qui a été déposé." },
    ],
  }),
  component: Espaces,
});

function Espaces() {
  const { spaces, hydrated, addSpace, updateSpace, removeSpace } = useSpaces();
  const [adding, setAdding] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const activeId = useActiveSpaceId();

  const actifs = spaces.filter((s) => !s.archived);
  const archives = spaces.filter((s) => s.archived);
  const upcoming = upcomingForSpaces(actifs, 400);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader back="/profile" title="LES PERSONNES QUE JE PORTE" />

        <section className="px-6 pt-4">
          <h1 className="font-serif font-normal text-[30px] leading-[1.08]">
            Une page pour <span className="italic" style={{ color: "var(--terracotta)" }}>chaque personne</span>.
          </h1>
          <p className="mt-3 max-w-[32ch] text-[13px] leading-[1.55] text-dusk/50">
            Son jardin, ses dates, ce que vous y déposez. Rien n'est partagé sans vous.
          </p>
        </section>

        <section className="px-6 pt-9">
          {!hydrated && <p className="text-[13px] text-dusk/45">Chargement…</p>}

          {hydrated && actifs.length === 0 && !adding && (
            <div
              className="rounded-[20px] px-6 py-7"
              style={{ border: "1px dashed color-mix(in oklab, var(--dusk) 20%, transparent)" }}
            >
              <p className="font-serif text-[19px] leading-[1.3] max-w-[24ch]">
                Personne n'a encore de page ici.
              </p>
              <p className="mt-2 max-w-[30ch] text-[13px] leading-[1.55] text-dusk/55">
                Ajoutez la personne que vous portez : son prénom suffit pour commencer.
              </p>
            </div>
          )}

          {actifs.map((s, i) =>
            editing === s.id ? (
              <div key={s.id} className="py-4">
                <SpaceForm
                  initial={s}
                  onCancel={() => setEditing(null)}
                  onSubmit={(v) => { updateSpace(s.id, v); setEditing(null); }}
                />
              </div>
            ) : (
              <SpaceCard
                key={s.id}
                index={i}
                space={s}
                next={upcoming.find((u) => u.spaceId === s.id)}
                active={activeId === s.id}
                onActivate={() => setActiveSpaceId(s.id)}
                onEdit={() => setEditing(s.id)}
                onArchive={() => updateSpace(s.id, { archived: true })}
              />
            ),
          )}

          {adding ? (
            <div className="pt-5">
              <SpaceForm
                onCancel={() => setAdding(false)}
                onSubmit={(v) => { const created = addSpace(v); setActiveSpaceId(created.id); setAdding(false); }}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-6 text-[13px]"
              style={{ color: "var(--bordeaux)" }}
            >
              Ajouter une personne →
            </button>
          )}
        </section>

        {archives.length > 0 && (
          <section className="px-5 pt-9">
            <button
              type="button"
              onClick={() => setShowArchived((v) => !v)}
              className="mono-label text-dusk/55 px-1"
            >
              {showArchived ? "Masquer les pages mises de côté" : `Pages mises de côté (${archives.length})`}
            </button>
            {showArchived && (
              <div className="mt-4 space-y-3">
                {archives.map((s) => (
                  <div key={s.id} className="rounded-[18px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-4">
                    <p className="font-serif text-[18px]">{s.name}</p>
                    <div className="mt-3 flex gap-4">
                      <button type="button" className="mono-label text-dusk/60" onClick={() => updateSpace(s.id, { archived: false })}>
                        Réactiver
                      </button>
                      {confirmId === s.id ? (
                        <span className="flex items-center gap-3">
                          <button
                            type="button"
                            className="mono-label"
                            style={{ color: "var(--bordeaux)" }}
                            onClick={() => { removeSpace(s.id); setConfirmId(null); }}
                          >
                            Confirmer la suppression
                          </button>
                          <button type="button" className="mono-label text-dusk/45" onClick={() => setConfirmId(null)}>
                            Annuler
                          </button>
                        </span>
                      ) : (
                        <button type="button" className="mono-label" style={{ color: "var(--bordeaux)" }} onClick={() => setConfirmId(s.id)}>
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="px-6 pt-10">
          <Link to="/care/dates" className="mono-label" style={{ color: "var(--terracotta)" }}>
            Voir toutes les dates importantes →
          </Link>
        </section>
      </div>
    </Shell>
  );
}

function SpaceCard({
  space: s, index, next, active, onActivate, onEdit, onArchive,
}: {
  space: Space;
  index: number;
  next?: { label: string; daysAway: number };
  active: boolean;
  onActivate: () => void;
  onEdit: () => void;
  onArchive: () => void;
}) {
  return (
    <article
      className="border-b border-dashed py-6 first:pt-0"
      style={{ borderColor: "color-mix(in oklab, var(--dusk) 15%, transparent)" }}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-[10.5px] tabular-nums text-dusk/35" style={{ fontFamily: "var(--font-mono)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="flex-1 font-serif text-[26px] leading-[1.05]">{s.name}</h2>
        {active && (
          <span className="text-[10.5px] tracking-[0.14em]" style={{ fontFamily: "var(--font-mono)", color: "var(--bordeaux)" }}>
            OUVERT
          </span>
        )}
      </div>

      <p className="mt-1.5 pl-[calc(0.75rem+18px)] text-[12.5px] text-dusk/50">
        {RELATION_LABEL[s.relation ?? "autre"]}
        {next ? ` · ${next.label.toLowerCase()}, ${formatDaysAway(next.daysAway).toLowerCase()}` : ""}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 pl-[calc(0.75rem+18px)] text-[12.5px]">
        <Link to="/care/garden" className="text-dusk/70 underline decoration-dotted underline-offset-4">Jardin</Link>
        <Link to="/care/dates" className="text-dusk/70 underline decoration-dotted underline-offset-4">Dates</Link>
        {!active && (
          <button type="button" onClick={onActivate} style={{ color: "var(--bordeaux)" }}>Ouvrir</button>
        )}
        <button type="button" onClick={onEdit} className="text-dusk/50">Modifier</button>
        <button type="button" onClick={onArchive} className="text-dusk/40">Mettre de côté</button>
      </div>
    </article>
  );
}

function SpaceForm({
  initial, onCancel, onSubmit,
}: {
  initial?: Space;
  onCancel: () => void;
  onSubmit: (v: { name: string; relation: Relation | null; birthday: string | null; deathDate: string | null }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [relation, setRelation] = useState<Relation | null>(initial?.relation ?? null);
  const [birthday, setBirthday] = useState(initial?.birthday ?? "");
  const [deathDate, setDeathDate] = useState(initial?.deathDate ?? "");

  return (
    <form
      className="rounded-[20px] border border-dusk/15 bg-paper px-5 py-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit({ name: name.trim(), relation, birthday: birthday || null, deathDate: deathDate || null });
      }}
    >
      <p className="mono-label text-dusk/60">{initial ? "Modifier l'espace" : "Nouvel espace"}</p>

      <label className="mt-4 block mono-label text-dusk/55">Comment l'appelez-vous ?</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Son prénom, ou « Maman »"
        className="mt-2 w-full rounded-[14px] border border-dusk/15 bg-paper px-4 py-3 text-[15px] outline-none focus:border-dusk/35"
      />

      <p className="mt-5 mono-label text-dusk/55">Votre lien</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {RELATIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRelation(relation === r.id ? null : r.id)}
            className="rounded-full border px-3.5 py-1.5 text-[12px]"
            style={{
              borderColor: relation === r.id ? "var(--terracotta)" : "rgba(0,0,0,0.14)",
              background: relation === r.id ? "color-mix(in oklab, var(--terracotta) 14%, var(--paper))" : "transparent",
            }}
          >
            {RELATION_LABEL[r.id]}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label className="mono-label text-dusk/55">Anniversaire</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="mt-2 w-full rounded-[14px] border border-dusk/15 bg-paper px-3 py-2.5 text-[13px] outline-none focus:border-dusk/35"
          />
        </div>
        <div>
          <label className="mono-label text-dusk/55">Date du départ</label>
          <input
            type="date"
            value={deathDate}
            onChange={(e) => setDeathDate(e.target.value)}
            className="mt-2 w-full rounded-[14px] border border-dusk/15 bg-paper px-3 py-2.5 text-[13px] outline-none focus:border-dusk/35"
          />
        </div>
      </div>
      <p className="mt-2 text-[11.5px] text-dusk/50">Facultatif — vous pourrez les ajouter plus tard.</p>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded-full px-5 py-2.5 text-[13px] disabled:opacity-40"
          style={{ background: "var(--bordeaux)", color: "var(--paper)" }}
        >
          {initial ? "Enregistrer" : "Créer l'espace"}
        </button>
        <button type="button" onClick={onCancel} className="mono-label text-dusk/55">
          Annuler
        </button>
      </div>
    </form>
  );
}
