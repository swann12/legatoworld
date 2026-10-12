import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StandardLayout, PageTitle, Lead, PrimaryButton, TextLink, Field } from "@/components/legato/ds";
import { findDemarche, useDemarches, type Demarche } from "@/lib/demarches";

export const Route = createFileRoute("/practical/share/$taskId")({
  head: () => ({
    meta: [
      { title: "Confier à un proche — Legato" },
      { name: "description", content: "Confier une démarche à un proche : il reçoit un message avec les étapes." },
      { property: "og:title", content: "Confier à un proche — Legato" },
      { property: "og:description", content: "Il reçoit un message avec les étapes. Vous voyez quand c'est fait." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Confier,
});

type Person = { name: string; rel: string };
const KEY = "legato.relais.v1";
const SEED: Person[] = [{ name: "Claire", rel: "Votre sœur" }, { name: "Paul", rel: "Un ami" }];
const SENT_KEY = "legato.relais.sent.v1";

function Confier() {
  const { taskId } = Route.useParams();
  const [d, setD] = useState<Demarche | undefined>(() => findDemarche(taskId));
  const { setTaskStatus } = useDemarches();
  const [people, setPeople] = useState<Person[]>(SEED);
  const [sel, setSel] = useState(0);
  const [sent, setSent] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [nName, setNName] = useState("");
  const [nRel, setNRel] = useState("");

  useEffect(() => {
    setD(findDemarche(taskId));
    try {
      const p = localStorage.getItem(KEY); if (p) setPeople(JSON.parse(p));
      const s = JSON.parse(localStorage.getItem(SENT_KEY) ?? "{}"); setSent(s[taskId] ?? null);
    } catch { /* rien */ }
  }, [taskId]);

  const person = people[sel];
  const msg = d?.ask ?? "Pourrais-tu m'aider pour cette démarche ? Tout est expliqué ici. Merci.";

  const send = async () => {
    if (!person) return;
    const url = `${window.location.origin}/practical/tasks/${taskId}`;
    const text = `${msg}\n${url}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else window.location.href = `sms:?&body=${encodeURIComponent(text)}`;
    } catch { return; }
    setTaskStatus(taskId, "delegated");
    const s = JSON.parse(localStorage.getItem(SENT_KEY) ?? "{}"); s[taskId] = person.name;
    localStorage.setItem(SENT_KEY, JSON.stringify(s)); setSent(person.name);
  };

  const addPerson = () => {
    if (!nName.trim()) return;
    const next = [...people, { name: nName.trim(), rel: nRel.trim() || "Un proche" }];
    setPeople(next); localStorage.setItem(KEY, JSON.stringify(next));
    setSel(next.length - 1); setAdding(false); setNName(""); setNRel("");
  };

  return (
    <StandardLayout space="practical" back={`/practical/tasks/${taskId}`} backLabel="Une démarche" activeTab="/practical">
      <PageTitle space="practical" className="pt-8">Confier cette démarche<br /><em>à un proche.</em></PageTitle>
      <Lead space="practical" className="mt-4">Il reçoit un message avec les étapes. Vous voyez quand c'est fait.</Lead>

      <ul className="mt-8" style={{ borderTop: "1px solid var(--sp-line-2)" }}>
        {people.map((p, i) => {
          const on = i === sel;
          return (
            <li key={p.name + i} style={{ borderBottom: "1px solid var(--sp-line)" }}>
              <button type="button" onClick={() => setSel(i)} aria-pressed={on}
                className="flex w-full items-center gap-4 px-4 py-4 text-left" style={{ background: on ? "var(--lg-linen)" : "transparent" }}>
                <span className="grid size-[42px] shrink-0 place-items-center rounded-full"
                  style={{ border: "1px solid var(--sp-ink)", fontFamily: "var(--lg-serif)", fontSize: 20 }}>{p.name[0]?.toUpperCase()}</span>
                <span className="flex-1">
                  <span className="lg-row-title block">{p.name}</span>
                  <span className="lg-row-sub mt-1 block" style={{ color: "var(--sp-sub)" }}>{p.rel}</span>
                </span>
                {on && <span className="lg-mono" style={{ color: "var(--sp-accent)" }}>Choisie</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {adding && (
        <div className="mt-6 space-y-4">
          <Field space="practical" label="Prénom" value={nName} onChange={(e) => setNName(e.target.value)} />
          <Field space="practical" label="Son lien avec vous" placeholder="Votre frère, une amie…" value={nRel} onChange={(e) => setNRel(e.target.value)} />
          <PrimaryButton space="practical" onClick={addPerson} disabled={!nName.trim()}>Ajouter</PrimaryButton>
        </div>
      )}

      {person && (
        <div className="mt-8 p-6" style={{ background: "var(--lg-linen)" }}>
          <p className="lg-mono" style={{ color: "var(--sp-ink)" }}>{sent === person.name ? `Message envoyé à ${person.name}` : `Message pour ${person.name}`}</p>
          <p className="mt-3 italic" style={{ fontFamily: "var(--lg-serif)", fontSize: 20, lineHeight: 1.35 }}>« {msg} »</p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5">
        {person && <PrimaryButton space="practical" onClick={send}>Envoyer à {person.name}</PrimaryButton>}
        {!adding && <TextLink space="practical" onClick={() => setAdding(true)}>Ajouter quelqu'un</TextLink>}
      </div>
    </StandardLayout>
  );
}
