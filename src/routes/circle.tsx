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
        <Link to="/practical" className="eyebrow hover:text-dusk">← Aide concrète</Link>
        <span className="eyebrow">Proches</span>
      </div>
      <ScreenHeader
        eyebrow="Proches et relais"
        title="Vous n'avez pas à tout porter."
        subtitle="Invitez une personne de confiance. Vous décidez de ce qu'elle peut voir, ce qu'elle peut faire."
      />

      <Section className="mt-10">
        {people.length === 0 ? (
          <p className="text-[14px] text-dusk/60">Personne pour l'instant. Vous pouvez en ajouter quand vous le souhaitez.</p>
        ) : (
          <div className="space-y-3">
            {people.map((p) => (
              <div key={p.id} className="surface p-5 flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <p className="eyebrow-sm">{ROLE_LABEL[p.role]}</p>
                  <h3 className="mt-2 font-serif text-[18px] font-light text-dusk">{p.name}</h3>
                  {p.relation && <p className="mt-1 text-[13px] text-dusk/60">{p.relation}</p>}
                </div>
                <button onClick={() => remove(p.id)} className="eyebrow-sm hover:text-[color:var(--terracotta)]">
                  Retirer
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-6 w-full btn-primary py-4"
        >
          {open ? "Annuler" : "Inviter une personne"}
        </button>

        {open && (
          <div className="mt-5 surface p-5 space-y-4">
            <label className="block">
              <span className="eyebrow-sm">Prénom</span>
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Marie" className="mt-2 w-full bg-transparent border-b border-dusk/15 pb-2 text-[17px] text-dusk outline-none focus:border-dusk/40" />
            </label>
            <label className="block">
              <span className="eyebrow-sm">Relation</span>
              <input value={draft.relation} onChange={(e) => setDraft({ ...draft, relation: e.target.value })} placeholder="Ma sœur, un ami…" className="mt-2 w-full bg-transparent border-b border-dusk/15 pb-2 text-[15px] text-dusk outline-none focus:border-dusk/40" />
            </label>
            <div>
              <span className="eyebrow-sm">Rôle</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setDraft({ ...draft, role: r })}
                    className={`px-3 py-1.5 rounded-full border text-[12px] transition-colors ${draft.role === r ? "border-dusk/40 bg-dusk/[0.04] text-dusk" : "border-dusk/15 text-dusk/70 hover:bg-dusk/[0.02]"}`}
                  >
                    {ROLE_LABEL[r]}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={add} disabled={!draft.name.trim()} className="w-full btn-primary py-3">
              Ajouter
            </button>
          </div>
        )}
      </Section>

      <Section className="mt-12 mb-10">
        <p className="eyebrow">Ce que vous pouvez faire ensuite</p>
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
