import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, ScreenHeader, Section } from "@/components/legato/Shell";

export const Route = createFileRoute("/circle")({
  head: () => ({
    meta: [
      { title: "Proches et relais — Legato" },
      { name: "description", content: "Inviter, partager, confier. Vous gardez la décision." },
    ],
  }),
  component: CirclePage,
});

type Role = "proche" | "referent" | "organisateur" | "professionnel" | "limite";
const ROLE_LABEL: Record<Role, string> = {
  proche:        "Proche",
  referent:      "Référent·e",
  organisateur:  "Organisateur·rice",
  professionnel: "Professionnel",
  limite:        "Accès limité",
};

type Person = { id: string; name: string; relation: string; role: Role };
const KEY = "legato.circle.v1";

function load(): Person[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function save(list: Person[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

function CirclePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Person>({ id: "", name: "", relation: "", role: "proche" });

  useEffect(() => { setPeople(load()); }, []);

  const add = () => {
    if (!draft.name.trim()) return;
    const next = [...people, { ...draft, id: `p-${Date.now()}` }];
    setPeople(next); save(next);
    setDraft({ id: "", name: "", relation: "", role: "proche" });
    setOpen(false);
  };
  const remove = (id: string) => {
    const next = people.filter((p) => p.id !== id);
    setPeople(next); save(next);
  };

  return (
    <Shell>
      <div className="px-7 pt-10 flex items-center justify-between">
        <Link to="/practical" className="text-[10px] uppercase tracking-[0.3em] text-dusk/55 hover:text-dusk" style={{ fontFamily: "var(--font-mono)" }}>
          ← Avancer
        </Link>
        <span className="text-[10px] uppercase tracking-[0.3em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>Proches</span>
      </div>
      <ScreenHeader
        eyebrow="Proches et relais"
        title={<>Vous n'avez pas <span className="italic">à tout porter.</span></>}
        subtitle="Invitez une personne de confiance. Vous décidez de ce qu'elle peut voir, ce qu'elle peut faire."
      />

      <Section className="mt-10">
        {people.length === 0 ? (
          <p className="text-[14px] text-dusk/60 italic">Personne pour l'instant. Vous pouvez en ajouter quand vous le souhaitez.</p>
        ) : (
          <div className="space-y-3">
            {people.map((p) => (
              <div key={p.id} className="rounded-[16px] border border-dusk/12 bg-paper p-5 flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-dusk/45" style={{ fontFamily: "var(--font-mono)" }}>{ROLE_LABEL[p.role]}</p>
                  <h3 className="mt-1 font-serif text-[18px] italic text-dusk">{p.name}</h3>
                  {p.relation && <p className="mt-1 text-[13px] text-dusk/60">{p.relation}</p>}
                </div>
                <button onClick={() => remove(p.id)} className="text-[11px] tracking-[0.18em] uppercase text-dusk/50 hover:text-rose" style={{ fontFamily: "var(--font-mono)" }}>Retirer</button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-6 w-full rounded-[18px] px-6 py-5 text-center text-[color:var(--paper)]"
          style={{ background: "var(--bordeaux)" }}
        >
          <span className="font-serif italic text-[18px]">{open ? "Annuler" : "Inviter une personne"}</span>
        </button>

        {open && (
          <div className="mt-5 rounded-[16px] border border-dusk/15 bg-paper p-5 space-y-4">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/55" style={{ fontFamily: "var(--font-mono)" }}>Prénom</span>
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Marie" className="mt-2 w-full bg-transparent border-b border-dusk/15 pb-2 font-serif italic text-[18px] text-dusk outline-none focus:border-dusk/40" />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/55" style={{ fontFamily: "var(--font-mono)" }}>Relation</span>
              <input value={draft.relation} onChange={(e) => setDraft({ ...draft, relation: e.target.value })} placeholder="Ma sœur, un ami…" className="mt-2 w-full bg-transparent border-b border-dusk/15 pb-2 text-[15px] text-dusk outline-none focus:border-dusk/40" />
            </label>
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-dusk/55" style={{ fontFamily: "var(--font-mono)" }}>Rôle</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setDraft({ ...draft, role: r })}
                    className={`px-3 py-1.5 rounded-full border text-[12px] ${draft.role === r ? "border-dusk/40 bg-clay text-dusk" : "border-dusk/15 text-dusk/70"}`}
                  >
                    {ROLE_LABEL[r]}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={add} disabled={!draft.name.trim()} className="w-full rounded-[14px] py-3 text-[13px] tracking-[0.18em] uppercase text-dusk disabled:opacity-40" style={{ background: "var(--sage)", fontFamily: "var(--font-mono)" }}>
              Ajouter
            </button>
          </div>
        )}
      </Section>

      <Section className="mt-12 mb-10">
        <p className="text-[10px] uppercase tracking-[0.28em] text-dusk/50" style={{ fontFamily: "var(--font-mono)" }}>Ce que vous pouvez faire ensuite</p>
        <ul className="mt-3 space-y-2 text-[14px] text-dusk/70 leading-relaxed">
          <li>— Confier une étape de votre plan</li>
          <li>— Partager un souvenir, une décision</li>
          <li>— Envoyer un document</li>
          <li>— Désigner une personne référente</li>
        </ul>
      </Section>
    </Shell>
  );
}
