import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";
import { Chip, Quote } from "@/components/legato/SoutienUI";
import { legatoHead } from "@/lib/legato-head";
import { useSoutien } from "@/lib/soutien";
import { useLegato } from "@/lib/legato-state";

/** D052 · so-aide-envoi : à qui l'envoyer */
export const Route = createFileRoute("/care/aide/envoyer")({
  head: () => legatoHead("À qui l'envoyer ?", "Choisir les proches qui recevront ce qui vous aiderait."),
  component: Envoyer,
});

function Envoyer() {
  const { s, update } = useSoutien();
  const { name } = useLegato();
  const navigate = useNavigate();
  const [off, setOff] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [who, setWho] = useState("");
  const [phone, setPhone] = useState("");

  const signature = name.trim() || "";
  const message = `« Merci pour vos messages. Si vous voulez m'aider, voici ce qui me soulagerait en ce moment. Choisissez seulement ce qui vous est possible.${signature ? ` ${signature}` : ""} »`;
  const chosen = s.recipients.filter((r) => !off.includes(r.name));
  const list = s.help.filter((h) => h.checked).map((h) => `– ${h.title}${h.when ? ` (${h.when})` : ""}`).join("\n");

  const add = () => {
    if (!who.trim()) return;
    update((p) => ({ ...p, recipients: [...p.recipients, { name: who.trim(), phone: phone.trim() || undefined }] }));
    setWho(""); setPhone(""); setAdding(false);
  };

  const send = () => {
    update((p) => ({ ...p, recipients: chosen, sentAt: new Date().toISOString() }));
    const numbers = chosen.map((r) => r.phone).filter(Boolean).join(",");
    const body = `${message.replace(/^« | »$/g, "")}\n\n${list}`;
    navigate({ to: "/care/aide/suivi" });
    window.location.href = `sms:${numbers}?&body=${encodeURIComponent(body)}`;
  };

  return (
    <StandardLayout space="support" back="/care/aide" backLabel="Ce qui m'aiderait" activeTab="/care">
      <PageTitle space="support" size={36} className="pt-[22px]">À qui<br /><em>l'envoyer ?</em></PageTitle>
      <div className="pt-5">
        {s.recipients.map((r) => (
          <Chip key={r.name} on={!off.includes(r.name)} onClick={() => setOff((o) => (o.includes(r.name) ? o.filter((x) => x !== r.name) : [...o, r.name]))}>{r.name}</Chip>
        ))}
        <Chip onClick={() => setAdding(true)}>+ Un numéro</Chip>
      </div>
      {adding && (
        <div className="mt-2 space-y-3">
          <input aria-label="Prénom" placeholder="Prénom" value={who} onChange={(e) => setWho(e.target.value)}
            className="w-full bg-transparent py-2 text-[16px] outline-none" style={{ borderBottom: "1px solid var(--sp-line-2)" }} />
          <input aria-label="Numéro" type="tel" placeholder="Numéro de téléphone" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-transparent py-2 text-[16px] outline-none" style={{ borderBottom: "1px solid var(--sp-line-2)" }} />
          <button type="button" onClick={add} className="text-[14px] underline underline-offset-4">Ajouter</button>
        </div>
      )}
      <p className="lg-mono mt-[14px]" style={{ color: "var(--sp-sub)" }}>Ils recevront ce message</p>
      <Quote>{message}</Quote>
      <Lead className="mt-[14px] max-w-[310px]">Ils n'ont pas besoin de l'application : un lien suffit.</Lead>
      <div className="pt-[18px]">
        <PrimaryButton space="support" onClick={send} disabled={!chosen.length}>Envoyer</PrimaryButton>
      </div>
    </StandardLayout>
  );
}
