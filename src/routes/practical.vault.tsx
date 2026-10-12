import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { StandardLayout, PageTitle, Block, PrimaryButton } from "@/components/legato/ds";
import { useVault, VAULT_CATS, type VaultCat } from "@/lib/vault-store";

export const Route = createFileRoute("/practical/vault")({
  head: () => ({
    meta: [
      { title: "Mes documents — Legato" },
      { name: "description", content: "Vos papiers au même endroit : identité, banque, logement, assurances, volontés." },
      { property: "og:title", content: "Mes documents — Legato" },
      { property: "og:description", content: "Vos papiers, au même endroit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Vault,
});

function Vault() {
  const { docs, add, remove, missing, count } = useVault();
  const [open, setOpen] = useState<VaultCat | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const target = useRef<{ cat: VaultCat; name?: string } | null>(null);

  const pick = (cat: VaultCat, name?: string) => { target.current = { cat, name }; input.current?.click(); };
  const onFile = (f?: File) => {
    if (!f || !target.current) return;
    add(target.current.cat, target.current.name ?? f.name.replace(/\.[^.]+$/, ""));
    target.current = null;
    if (input.current) input.current.value = "";
  };

  return (
    <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
      <PageTitle space="practical" className="pt-8">Vos papiers,<br /><em>au même endroit.</em></PageTitle>
      <input ref={input} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

      {missing && (
        <Block space="today" className="mt-8" label="Il manque" title={missing.title}>
          <p className="-mt-3 mb-5 text-[14px]" style={{ color: "var(--lg-sub-ink, var(--lg-deep))", opacity: 0.8 }}>{missing.why}</p>
          <PrimaryButton space="today" onClick={() => pick(missing.cat, missing.name)}>Ajouter ce document</PrimaryButton>
        </Block>
      )}

      <ul className="mt-6">
        {VAULT_CATS.map((c, i) => {
          const on = open === c.id;
          const list = docs.filter((d) => d.cat === c.id);
          return (
            <li key={c.id} style={{ borderBottom: i < VAULT_CATS.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
              <button type="button" onClick={() => setOpen(on ? null : c.id)} aria-expanded={on}
                className="flex w-full items-center gap-4 py-5 text-left">
                <span className="lg-row-title flex-1" style={{ fontSize: 21 }}>{c.label}</span>
                <span className="lg-mono" style={{ color: "var(--sp-ink)" }}>{count(c.id)}</span>
                <ChevronRight className="size-4 transition-transform" strokeWidth={1.3} style={{ transform: on ? "rotate(90deg)" : undefined }} />
              </button>
              {on && (
                <div className="pb-5">
                  {list.map((d) => (
                    <div key={d.id} className="flex items-center justify-between py-2 text-[14.5px]">
                      <span>{d.name}</span>
                      <button type="button" aria-label={`Retirer ${d.name}`} onClick={() => remove(d.id)} className="grid size-9 place-items-center" style={{ color: "var(--sp-sub)" }}>
                        <X className="size-4" strokeWidth={1.3} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => pick(c.id)} className="mt-2 text-[13.5px] underline underline-offset-4">Ajouter un document</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-[12.5px]" style={{ color: "var(--sp-sub)" }}>Les documents restent sur ce téléphone.</p>
    </StandardLayout>
  );
}
