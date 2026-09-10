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
      { title: "Mes espaces — Legato" },
      { name: "description", content: "Un espace par être aimé : son jardin, ses dates, ce qui a été déposé." },
      { property: "og:title", content: "Mes espaces — Legato" },
      { property: "og:description", content: "Un espace par être aimé : son jardin, ses dates, ce qui a été déposé." },
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
        <PageHeader back="/profile" title="MES ESPACES" />

        <section className="px-6 pt-4">
          <h1 className="font-serif font-normal text-[30px] leading-[1.08]">
            Un espace pour <span className="italic" style={{ color: "var(--terracotta)" }}>chacun d'eux</span>.
          </h1>
          <p className="mt-3 max-w-[32ch] text-[13px] leading-[1.55] text-dusk/50">
            Le jardin, les dates, ce que vous y déposez. Rien n'est partagé sans vous.
          </p>
        </section>

        <section className="px-6 pt-9">
          {!hydrated && <p className="text-[13px] text-dusk/45">Chargement…</p>}

          {hydrated && actifs.length === 0 && !adding && (
            <p className="max-w-[30ch] font-serif text-[17px] italic leading-[1.5] text-dusk/50">
              Aucun espace pour l'instant. Créez le premier pour la personne que vous portez.
            </p>
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
              Créer un nouvel espace →
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
              {showArchived ? "Masquer les espaces mis de côté" : `Espaces mis de côté (${archives.length})`}
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
  space: s, next, active, onActivate, onEdit, onArchive,
}: {
  space: Space;
  next?: { label: string; daysAway: number };
  active: boolean;
  onActivate: () => void;
  onEdit: () => void;
  onArchive: () => void;
}) {
  return (
    <article
      className="rounded-[22px] px-5 py-5"
      style={{
        background: "var(--whisper)",
        boxShadow: "0 12px 26px -22px color-mix(in oklab, var(--dusk) 55%, transparent)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mono-label text-dusk/60">
            {RELATION_LABEL[s.relation ?? "autre"]}{active ? " · Espace ouvert" : ""}
          </p>
          <p className="mt-2 font-serif text-[26px] leading-[1.05]">{s.name}</p>
        </div>
        <button type="button" onClick={onEdit} className="rounded-full bg-[color-mix(in_oklab,var(--clay)_55%,var(--whisper))] px-3 py-1 text-[10.5px] mono-label text-dusk/70">
          Modifier
        </button>
      </div>

      {next && (
        <p className="mt-3 text-[12.5px] text-dusk/70">
          {next.label} · {formatDaysAway(next.daysAway).toLowerCase()}
        </p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link to="/care/garden" className="rounded-[14px] bg-[color-mix(in_oklab,var(--clay)_55%,var(--whisper))] px-4 py-3">
          <p className="mono-label text-dusk/55">Jardin</p>
          <p className="mt-1 text-[13px]">Photos, voix, lettres</p>
        </Link>
        <Link to="/care/dates" className="rounded-[14px] bg-[color-mix(in_oklab,var(--clay)_55%,var(--whisper))] px-4 py-3">
          <p className="mono-label text-dusk/55">Dates</p>
          <p className="mt-1 text-[13px]">Anniversaire, départ</p>
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-5">
        {!active && (
          <button type="button" onClick={onActivate} className="mono-label" style={{ color: "var(--bordeaux)" }}>
            Ouvrir cet espace
          </button>
        )}
        <button type="button" onClick={onArchive} className="mono-label text-dusk/55">
          Mettre de côté
        </button>
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
