import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";
import { Chip, Quote } from "@/components/legato/SoutienUI";
import { legatoHead } from "@/lib/legato-head";
import { useSoutien } from "@/lib/soutien";
import { useLegato } from "@/lib/legato-state";
import { getDiscovery } from "@/lib/discovery";
import { createHelpLink, helpLinkUrl, linkIdForToken } from "@/lib/help-link";
import { useActiveSpace } from "@/lib/use-active-space";
import { getDeathDate } from "@/lib/onboarding-flow";

/** Dates partagées avec les proches, seulement si la personne le choisit. */
function sharedDates(death?: string | null) {
  if (!death) return [];
  const d = new Date(death.slice(0, 10) + "T12:00:00");
  if (Number.isNaN(d.getTime())) return [];
  const m = new Date(d); m.setMonth(m.getMonth() + 1);
  const xmas = new Date(d.getFullYear(), 11, 25, 12);
  if (xmas < d) xmas.setFullYear(xmas.getFullYear() + 1);
  const iso = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  return [{ label: "Un mois après", date: iso(m) }, { label: "Le premier Noël", date: iso(xmas) }];
}

/** D052 · so-aide-envoi : à qui l'envoyer */
export const Route = createFileRoute("/care/aide/envoyer")({
  head: () => legatoHead("À qui l'envoyer ?", "Choisir les proches qui recevront ce qui vous aiderait."),
  component: Envoyer,
});

function Envoyer() {
  const { s, update } = useSoutien();
  const { name } = useLegato();
  const navigate = useNavigate();
  const { space } = useActiveSpace();
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

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const send = async () => {
    // Le lien sécurisé demande un compte : en découverte, rien ne part.
    if (getDiscovery().active) { navigate({ to: "/start/compte-requis" }); return; }
    setBusy(true); setErr("");
    try {
      const items = s.help.filter((h) => h.checked).map(({ id, title, when }) => ({ id, title, when }));
      const token = await createHelpLink(signature, items, s.shareDates ? sharedDates(space?.deathDate ?? getDeathDate()) : []);
      const linkId = await linkIdForToken();
      update((p) => ({ ...p, recipients: chosen, sentAt: new Date().toISOString(), linkToken: token, linkId: linkId ?? undefined, help: p.help.map((h) => ({ ...h, who: undefined })) }));
      const numbers = chosen.map((r) => r.phone).filter(Boolean).join(",");
      const body = `${message.replace(/^« | »$/g, "")}\n${helpLinkUrl(token)}`;
      navigate({ to: "/care/aide/suivi" });
      window.location.href = `sms:${numbers}?&body=${encodeURIComponent(body)}`;
    } catch {
      setErr("Le lien n'a pas pu être créé. Connectez-vous à votre compte, puis réessayez.");
    } finally { setBusy(false); }
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
      <label className="mt-3 flex items-center gap-3 text-[13px]" style={{ color: "var(--sp-sub)" }}>
        <input type="checkbox" checked={!!s.shareDates} onChange={(e) => update((p) => ({ ...p, shareDates: e.target.checked }))} />
        Partager aussi les dates difficiles (un mois après, le premier Noël)
      </label>
      {err && <p role="alert" className="mt-3 text-[13px]">{err}</p>}
      <div className="pt-[18px]">
        <PrimaryButton space="support" onClick={() => void send()} disabled={!chosen.length || busy}>Envoyer</PrimaryButton>
      </div>
    </StandardLayout>
  );
}
