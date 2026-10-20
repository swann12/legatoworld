import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, Copy, Mail, MessageSquare, Plus } from "lucide-react";
import { StandardLayout, PageTitle, Lead, PrimaryButton, TextLink, SectionLabel } from "@/components/legato/ds";
import { useSavedToast } from "@/components/legato/ActionFeedback";
import { useSmartBack } from "@/lib/use-smart-back";
import { useVault, VAULT_CATS, type VaultCat } from "@/lib/vault-store";

const serif = { fontFamily: "var(--lg-serif)", fontWeight: 400 } as const;
const sub = { color: "var(--sp-sub)" } as const;
const mono = "lg-mono";

/** D006 · x-message : un message prêt à envoyer, ouvert par plusieurs boutons. */
export function MessagePret({ destinataires, texte }: { destinataires: string[]; texte: string }) {
  const smartBack = useSmartBack();
  const { show, toast } = useSavedToast();
  const [body, setBody] = useState(texte);
  const [canal, setCanal] = useState<"sms" | "email">("sms");
  const to = destinataires.join(",");

  const copy = async () => {
    try { await navigator.clipboard.writeText(body); show("Message copié."); }
    catch { show("La copie n'a pas fonctionné."); }
  };
  const send = () => {
    const url = canal === "sms"
      ? `sms:${to}?&body=${encodeURIComponent(body)}`
      : `mailto:${to}?body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  return (
    <StandardLayout space="practical" back="#" backLabel="Retour" onBack={smartBack} activeTab="/practical">
      <PageTitle space="practical" className="pt-8">Un message<br /><em>prêt à envoyer.</em></PageTitle>
      <p className={`${mono} mt-6`}>À</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {destinataires.map((d) => (
          <span key={d} className="rounded-full px-4 py-2 text-[14px]" style={{ background: "var(--sp-block)" }}>{d}</span>
        ))}
        <button type="button" onClick={() => show("Le choix des contacts arrive avec l'envoi réel.")}
          className="rounded-full px-4 py-2 text-[14px]" style={{ border: "1px solid var(--sp-line-2)" }}>
          + Choisir
        </button>
      </div>
      <textarea
        aria-label="Le message, que vous pouvez modifier"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        className="mt-6 w-full resize-none p-5 text-[15px] leading-[1.55] outline-none"
        style={{ ...serif, background: "var(--sp-block)", color: "var(--sp-ink)" }}
      />
      <p className="mt-2 text-[13px]" style={sub}>Vous pouvez tout modifier avant d'envoyer.</p>
      <div className="mt-5 flex gap-2">
        <button type="button" onClick={() => setCanal("sms")} aria-pressed={canal === "sms"}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-[13.5px]"
          style={canal === "sms" ? { background: "var(--sp-btn-bg)", color: "var(--sp-btn-fg)" } : { border: "1px solid var(--sp-line-2)" }}>
          <MessageSquare className="size-4" strokeWidth={1.3} /> Par SMS
        </button>
        <button type="button" onClick={() => setCanal("email")} aria-pressed={canal === "email"}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-[13.5px]"
          style={canal === "email" ? { background: "var(--sp-btn-bg)", color: "var(--sp-btn-fg)" } : { border: "1px solid var(--sp-line-2)" }}>
          <Mail className="size-4" strokeWidth={1.3} /> Par e-mail
        </button>
        <button type="button" onClick={copy}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-[13.5px]" style={{ border: "1px solid var(--sp-line-2)" }}>
          <Copy className="size-4" strokeWidth={1.3} /> Copier
        </button>
      </div>
      <div className="mt-4"><PrimaryButton space="practical" onClick={send}>Envoyer</PrimaryButton></div>
      {toast}
    </StandardLayout>
  );
}

/** D007 · x-lien-officiel : préparer, puis ouvrir un site officiel. */
export function SiteOfficiel({ site, url, papiers, duree }: { site: string; url: string; papiers: string[]; duree: string }) {
  const smartBack = useSmartBack();
  const { show, toast } = useSavedToast();
  const navigate = useNavigate();
  return (
    <StandardLayout space="practical" back="#" backLabel="Retour" onBack={smartBack} activeTab="/practical">
      <PageTitle space="practical" className="pt-8">Faire la demande<br /><em>sur le site officiel.</em></PageTitle>
      <Lead className="mt-3">Vous allez quitter Legato pour {site}.</Lead>
      <SectionLabel space="practical" className="mt-6">Préparez d'abord</SectionLabel>
      <ul className="mt-1">
        {papiers.map((p) => (
          <li key={p} className="py-3 text-[15px]" style={{ borderBottom: "1px solid var(--sp-line)", ...serif, fontSize: 19 }}>{p}</li>
        ))}
      </ul>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="p-4" style={{ background: "var(--sp-block)" }}>
          <p className={mono}>Site</p>
          <p className="mt-1 text-[14px]">{site} · officiel</p>
        </div>
        <div className="p-4" style={{ background: "var(--sp-block)" }}>
          <p className={mono}>Durée</p>
          <p className="mt-1 text-[14px]">{duree}</p>
        </div>
      </div>
      <div className="mt-6">
        <PrimaryButton space="practical" onClick={() => window.open(url, "_blank", "noopener")}>Ouvrir le site officiel</PrimaryButton>
      </div>
      <div className="mt-3">
        <PrimaryButton space="practical" onClick={() => { show("C'est noté, l'étape est cochée."); window.setTimeout(() => navigate({ to: "/practical" }), 900); }}>
          C'est fait : cocher l'étape
        </PrimaryButton>
      </div>
      <p className="mt-5 text-center text-[13px] leading-[1.5]" style={sub}>
        Legato ne voit pas ce que vous saisissez<br />sur ce site.
      </p>
      {toast}
    </StandardLayout>
  );
}

/** D008 · x-document : lire un document du coffre. */
export function DocumentView({ id }: { id: string }) {
  const smartBack = useSmartBack();
  const { show, toast } = useSavedToast();
  const { docs } = useVault();
  const doc = docs.find((d) => d.id === id);
  const cat = doc ? VAULT_CATS.find((c) => c.id === doc.cat)?.label : undefined;
  const noFile = () => show("Pas encore de fichier joint à ce document.");
  return (
    <StandardLayout space="practical" back="#" backLabel="Retour" onBack={smartBack} activeTab="/practical">
      {doc ? (
        <>
          <PageTitle space="practical" className="pt-8">{doc.name}.</PageTitle>
          <p className={`${mono} mt-3`}>{cat} · rangé{doc.at ? ` le ${new Date(doc.at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}` : ""}</p>
          <div className="mt-6 flex h-64 items-center justify-center p-6 text-center text-[14px] leading-[1.55]" style={{ background: "var(--sp-block)", ...sub }}>
            Le fichier sera lisible ici quand il sera joint.
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <PrimaryButton space="practical" onClick={noFile}>Télécharger</PrimaryButton>
            <PrimaryButton space="practical" onClick={() => { if (navigator.share) navigator.share({ title: doc.name }).catch(() => {}); else noFile(); }}>Partager</PrimaryButton>
            <TextLink space="practical" onClick={() => show("Le document sera joint à la démarche choisie.")}>Joindre à une démarche</TextLink>
          </div>
        </>
      ) : (
        <>
          <PageTitle space="practical" className="pt-8">Document introuvable.</PageTitle>
          <Lead className="mt-4">Revenez à vos papiers pour le retrouver.</Lead>
        </>
      )}
      {toast}
    </StandardLayout>
  );
}

/** D009 · x-dossier : les documents d'une catégorie. */
export function DossierView({ categorie }: { categorie: string }) {
  const { docs, add } = useVault();
  const { show, toast } = useSavedToast();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const cat = VAULT_CATS.find((c) => c.id === categorie);
  const list = docs.filter((d) => d.cat === categorie);
  return (
    <StandardLayout space="practical" back="/practical/vault" backLabel="Ses papiers" activeTab="/practical">
      <PageTitle space="practical" className="pt-8"><em>{cat?.label ?? "Documents"}.</em></PageTitle>
      <div className="mt-4">
        {list.map((d, i) => (
          <Link key={d.id} to="/documents/$id" params={{ id: d.id }}
            className="flex items-center justify-between gap-3 py-[14px]"
            style={{ borderBottom: i < list.length - 1 || adding ? "1px solid var(--sp-line)" : "none" }}>
            <span className="flex flex-col gap-[3px]">
              <span style={{ ...serif, fontSize: 19 }}>{d.name}</span>
              {d.at && <span className="text-[12.5px]" style={sub}>{new Date(d.at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span>}
            </span>
            <span aria-hidden style={sub}>›</span>
          </Link>
        ))}
        {list.length === 0 && !adding && <Lead className="py-4">Aucun document ici pour le moment.</Lead>}
      </div>
      {adding ? (
        <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { add(categorie as VaultCat, name.trim()); setName(""); setAdding(false); show("C'est gardé."); } }}>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du document" aria-label="Nom du document"
            className="min-w-0 flex-1 px-4 py-3 text-[14px] outline-none" style={{ background: "var(--sp-block)", color: "var(--sp-ink)" }} />
          <button type="submit" className="rounded-full px-5 text-[14px]" style={{ background: "var(--sp-btn-bg)", color: "var(--sp-btn-fg)" }}>Ajouter</button>
        </form>
      ) : (
        <button type="button" onClick={() => setAdding(true)}
          className="mt-[22px] inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px]"
          style={{ background: "var(--lg-blue-pale, #CFDBE8)", color: "var(--sp-ink)" }}>
          <Plus className="size-4" strokeWidth={1.3} /> Ajouter un document
        </button>
      )}
      <p className="mt-[14px] max-w-[310px] text-[14px] leading-[1.55]" style={sub}>
        Rangés ici, privés. Vous seul y avez accès, et ceux à qui vous les partagez.
      </p>
      {toast}
    </StandardLayout>
  );
}

/** Case à cocher des groupes de proches (D010). */
export function GroupeCheck({ label, count, checked, onToggle, last }: { label: string; count: string; checked: boolean; onToggle: () => void; last?: boolean }) {
  return (
    <button type="button" onClick={onToggle} aria-pressed={checked}
      className="flex w-full items-center gap-[14px] py-3 text-left"
      style={{ borderBottom: last ? "none" : "1px solid var(--sp-line)" }}>
      <span className="flex size-[22px] shrink-0 items-center justify-center rounded-md"
        style={checked ? { background: "var(--lg-deep)" } : { border: "1px solid var(--sp-line-2)" }}>
        {checked && <Check className="size-3" strokeWidth={1.8} style={{ color: "var(--lg-mint)" }} />}
      </span>
      <span className="flex flex-col gap-[2px]">
        <span style={{ ...serif, fontSize: 19 }}>{label}</span>
        <span className="text-[12px]" style={sub}>{count}</span>
      </span>
    </button>
  );
}
