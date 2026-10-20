import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { StandardLayout, PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";
import { useSoutien } from "@/lib/soutien";

/** D051 · so-aide : ce qui m'aiderait */
export const Route = createFileRoute("/care/aide/")({
  head: () => legatoHead("Ce qui m'aiderait", "Cocher ce qui vous soulagerait, pour que vos proches choisissent ce qu'ils peuvent faire."),
  component: CeQuiMAiderait,
});

function CeQuiMAiderait() {
  const { s, update } = useSoutien();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("");

  const toggle = (id: string) => update((p) => ({ ...p, help: p.help.map((h) => (h.id === id ? { ...h, checked: !h.checked } : h)) }));
  const add = () => {
    if (!title.trim()) return;
    update((p) => ({ ...p, help: [...p.help, { id: `a${Date.now()}`, title: title.trim(), when: when.trim(), checked: true }] }));
    setTitle(""); setWhen(""); setAdding(false);
  };

  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" size={36} className="pt-[22px]">Ce qui<br /><em>m'aiderait.</em></PageTitle>
      <Lead className="mt-2 max-w-[310px]">Cochez ce qui vous soulagerait. Vos proches choisiront ce qu'ils peuvent faire. Personne n'est obligé.</Lead>
      <div className="pt-3">
        {s.help.map((h) => (
          <button key={h.id} type="button" role="checkbox" aria-checked={h.checked} onClick={() => toggle(h.id)}
            className="flex w-full items-center gap-[14px] py-[13px] text-left" style={{ borderBottom: "1px solid var(--sp-line)" }}>
            <span className="grid size-[22px] shrink-0 place-items-center rounded-[6px]"
              style={h.checked ? { background: "var(--lg-deep)" } : { border: "1.5px solid var(--lg-deep)" }}>
              {h.checked && <Check className="size-3" strokeWidth={1.8} style={{ color: "var(--lg-mint)" }} />}
            </span>
            <span className="flex flex-col gap-[2px]">
              <span style={{ fontFamily: "var(--lg-serif)", fontSize: 19 }}>{h.title}</span>
              {h.when && <span className="text-[12px]" style={{ color: "var(--sp-sub)" }}>{h.when}</span>}
            </span>
          </button>
        ))}
      </div>
      {adding ? (
        <div className="mt-4 space-y-3">
          <input aria-label="Ce qui vous aiderait" placeholder="Ce qui vous aiderait" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent py-2 text-[16px] outline-none" style={{ borderBottom: "1px solid var(--sp-line-2)" }} />
          <input aria-label="Quand" placeholder="Quand (facultatif)" value={when} onChange={(e) => setWhen(e.target.value)}
            className="w-full bg-transparent py-2 text-[14px] outline-none" style={{ borderBottom: "1px solid var(--sp-line-2)" }} />
          <button type="button" onClick={add} className="text-[14px] underline underline-offset-4">Ajouter</button>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="mt-[14px] text-[14px]">+ Ajouter autre chose</button>
      )}
      <div className="pt-5">
        <PrimaryButton space="support" to="/care/aide/envoyer">Choisir à qui l'envoyer</PrimaryButton>
      </div>
    </StandardLayout>
  );
}
