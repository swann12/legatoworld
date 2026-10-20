import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight } from "lucide-react";
import { StandardLayout, PageTitle, Lead, EnClair, PrimaryButton, ChatBubble, ChatInput } from "@/components/legato/ds";
import { ConfirmedCall } from "@/components/legato/ActionFeedback";
import { FAMILIES, TITRES, familyOf, findSituation, targetFor, verifiedWords, suggestSituations, type Family, type Situation, type Target } from "@/lib/je-suis-bloque";
import { talkToPresence } from "@/lib/presence.functions";
import { getDiscovery } from "@/lib/discovery";
import { useLegato } from "@/lib/legato-state";

const serif = { fontFamily: "var(--lg-serif)", fontWeight: 400 } as const;
const sub = { color: "var(--sp-sub)" } as const;
const coral = { color: "var(--sp-accent)" } as const;

function ListRow({ to, title, subtitle }: { to: string; title: string; subtitle: string }) {
  return (
    <Link to={to} className="flex items-center justify-between gap-[10px] py-[14px]" style={{ borderBottom: "1px solid var(--sp-line)" }}>
      <span className="flex flex-col gap-[3px]">
        <span style={{ ...serif, fontSize: 19, lineHeight: 1.15 }}>{title}</span>
        <span className="text-[12.5px]" style={sub}>{subtitle}</span>
      </span>
      <ArrowUpRight className="size-4 shrink-0" strokeWidth={1.3} />
    </Link>
  );
}

/** D077 · b-bloque */
export function BloqueHome() {
  return (
    <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
      <PageTitle space="practical" className="pt-[22px]">Qu'est-ce qui<br /><em>vous bloque ?</em></PageTitle>
      <Link to="/practical/bloque/presence" className="mt-4 flex items-center rounded-full px-4 py-3" style={{ border: "1px solid var(--sp-line-2)" }}>
        <span className="italic" style={{ ...serif, fontSize: 17, color: "var(--sp-sub)" }}>Décrivez votre situation, Présence vous oriente…</span>
      </Link>
      <div className="mt-[10px]">
        <ListRow to="/practical/bloque/cat-heures" title="Les premières heures" subtitle="À la maison, à l'hôpital, à l'étranger, accident, enfant, suicide" />
        <ListRow to="/practical/bloque/cat-acces" title="Accès, argent, papiers" subtitle="Mots de passe, comptes bloqués, papiers introuvables, crédits" />
        <ListRow to="/practical/bloque/cat-famille" title="Famille, maison, travail" subtitle="Enfants, logement, voiture, animal, congés" />
        <ListRow to="/practical/bloque/cat-vivant" title="Il est en vie mais ne peut plus décider" subtitle="Hospitalisé, dans le coma, agir à sa place" />
        <ListRow to="/practical/bloque/cat-aides" title="Les sommes à demander" subtitle="Capital décès, réversion, assurance-vie" />
      </div>
      <Lead className="mt-4 max-w-[320px]">Chaque page tient en un écran : ce qu'il faut faire dans l'ordre, les papiers nécessaires, le bouton pour le faire, et la source officielle.</Lead>
    </StandardLayout>
  );
}

/** D079–D083 · une famille */
export function FamilyPage({ family }: { family: Family }) {
  return (
    <StandardLayout space="practical" back="/practical/bloque" backLabel="Je suis bloqué" activeTab="/practical">
      <PageTitle space="practical" className="pt-[22px]">{family.title[0]}<br /><em>{family.title[1]}</em></PageTitle>
      <div className="mt-3">
        {family.rows.map((r) => <ListRow key={r.to} to={`/practical/bloque/${r.to}`} title={r.title} subtitle={r.sub} />)}
      </div>
    </StandardLayout>
  );
}

function ActionLink({ t, label }: { t: Target; label: string }) {
  const cls = "mt-[6px] inline-block text-[13px] underline underline-offset-[3px]";
  if (t.kind === "call") return <ConfirmedCall href={t.tel} number={t.number} label={`${label} →`} subtitle={t.number === "15" ? "Urgence médicale, jour et nuit." : "Gratuit, jour et nuit."} className={cls} />;
  if (t.kind === "route") return <Link to={t.to} className={cls}>{label} →</Link>;
  if (t.kind === "official") return <Link to="/partage/site-officiel" search={{ site: t.site, url: t.url, papiers: t.papiers, duree: t.duree }} className={cls}>{label} →</Link>;
  return <Link to="/partage/message" search={{ destinataires: t.destinataires, texte: t.texte }} className={cls}>{label} →</Link>;
}

function MainButton({ t, label }: { t: Target; label: string }) {
  if (t.kind === "route") return <PrimaryButton space="practical" to={t.to}>{label}</PrimaryButton>;
  if (t.kind === "message") return <PrimaryButton space="practical" to="/partage/message" search={{ destinataires: t.destinataires, texte: t.texte }}>{label}</PrimaryButton>;
  if (t.kind === "official") return <PrimaryButton space="practical" to="/partage/site-officiel" search={{ site: t.site, url: t.url, papiers: t.papiers, duree: t.duree }}>{label}</PrimaryButton>;
  return null;
}

/** D084–D107 · un seul composant pour toutes les situations, alimenté par je-suis-bloque.json. */
export function SituationPage({ s }: { s: Situation }) {
  const fam = familyOf(s);
  const title = TITRES[s.id] ?? [s.titre, ""];
  const main = s.bouton_principal ? targetFor(s, s.bouton_principal) : null;
  return (
    <StandardLayout space="practical" back={`/practical/bloque/${fam.slug}`} backLabel={fam.label} activeTab="/practical">
      <PageTitle space="practical" size={30} className="pt-[22px]">{title[0]}<br /><em>{title[1]}</em></PageTitle>
      {s.en_clair && <EnClair space="practical" className="mt-4">{s.en_clair}</EnClair>}
      <p className="mt-[18px] italic" style={{ ...serif, fontSize: 17, ...coral }}>Dans l'ordre —</p>
      <div>
        {s.etapes.map((e, i) => {
          const t = e.action ? targetFor(s, e.action) : null;
          return (
            <div key={i} className="grid py-3" style={{ gridTemplateColumns: "28px 1fr", borderBottom: i < s.etapes.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
              <span style={{ ...serif, fontSize: 21, lineHeight: 1.1, ...coral }}>{i + 1}</span>
              <span>
                <span className="block text-[14.5px] leading-[1.45]">{e.texte}</span>
                {e.action && t && <ActionLink t={t} label={e.action.libelle} />}
              </span>
            </div>
          );
        })}
      </div>
      {s.papiers.length > 0 && (
        <div className="mt-[14px] flex flex-wrap gap-[6px]">
          <span className="lg-mono w-full" style={sub}>Il vous faut</span>
          {s.papiers.map((p) => <span key={p} className="rounded-[13px] px-[10px] py-[5px] text-[12.5px]" style={{ border: "1px solid var(--sp-line-2)" }}>{p}</span>)}
        </div>
      )}
      {main && s.bouton_principal && <div className="pt-5"><MainButton t={main} label={s.bouton_principal.libelle} /></div>}
      <p className="lg-mono mt-[14px]" style={sub}>Source : {s.source}{s.verifie_le ? ` · vérifié en ${verifiedWords(s.verifie_le)}` : ""}</p>
      {s.statut === "a_verifier" && <p className="lg-mono mt-1" style={coral}>à vérifier</p>}
    </StandardLayout>
  );
}

/** D099 · b-quotidien (texte de la maquette, absent des données) */
export function QuotidienPage() {
  const steps = ["Les enfants : prévenez l'école et organisez la garde avec un proche.", "L'animal : demandez à un voisin ou un proche de passer.", "La maison : vérifiez le chauffage, les clés, la voiture ; le reste peut attendre."];
  return (
    <StandardLayout space="practical" back="/practical/bloque" backLabel="Je suis bloqué" activeTab="/practical">
      <PageTitle space="practical" size={32} className="pt-6">La maison, les enfants,<br /><em>l'animal.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Les questions de ce soir, avant les papiers.</Lead>
      <p className="mt-[26px] italic" style={{ ...serif, fontSize: 17, ...coral }}>Dans l'ordre —</p>
      {steps.map((t, i) => (
        <div key={i} className="grid items-baseline py-5" style={{ gridTemplateColumns: "40px 1fr", borderBottom: i < 2 ? "1px solid var(--sp-line)" : "none" }}>
          <span style={{ ...serif, fontSize: 28, lineHeight: 1, ...coral }}>{i + 1}</span>
          <span style={{ ...serif, fontSize: 20, lineHeight: 1.35 }}>{t}</span>
        </div>
      ))}
      <div className="pt-5"><PrimaryButton space="practical" to="/home/equipe/demande">Demander de l'aide à un proche</PrimaryButton></div>
    </StandardLayout>
  );
}

/** D108 · b-preparer : ce que les proches devront savoir. Les valeurs se remplissent dans le coffre. */
export function PreparerPage() {
  const rows = [["Téléphone", "Où trouver son code"], ["Mots de passe", "Gestionnaire, où trouver le code"], ["Banque", "Vos comptes, votre conseiller"], ["Assurance-vie", "Vos contrats"]];
  return (
    <StandardLayout space="practical" back="/practical" backLabel="Préparer" activeTab="/practical">
      <PageTitle space="practical" size={32} className="pt-6">Ne pas laisser<br /><em>vos proches bloqués.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[320px]">Ce qu'ils devront savoir, rangé au même endroit. Legato ne garde jamais vos mots de passe : seulement où les trouver.</Lead>
      <dl className="mt-5" style={{ borderTop: "1px solid var(--sp-line-2)", borderBottom: "1px solid var(--sp-line-2)" }}>
        {rows.map(([k, v], i) => (
          <div key={k} className="grid items-baseline py-3" style={{ gridTemplateColumns: "112px 1fr", borderTop: i ? "1px solid var(--sp-line)" : "none" }}>
            <dt className="lg-mono" style={sub}>{k}</dt>
            <dd style={{ ...serif, fontSize: 18, color: "var(--sp-sub)" }}>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 px-4 py-3" style={{ background: "var(--sp-block)" }}>
        <p style={{ ...serif, fontSize: 18 }}>Transmis à la personne de votre choix si quelque chose vous arrive</p>
        <p className="mt-1 text-[12.5px]" style={sub}>Elle le recevra avec l'acte de décès, ou si vous êtes hospitalisé</p>
      </div>
      <div className="pt-5"><PrimaryButton space="practical" to="/practical/vault">Ouvrir mon coffre</PrimaryButton></div>
    </StandardLayout>
  );
}

const CARD_LABEL: Record<string, string> = { hopital: "Voir les solutions", telephone: "Son téléphone" };

/** D078 · b-presence : Présence écoute puis propose une ou deux situations. */
export function BloquePresence() {
  const call = useServerFn(talkToPresence);
  const { mode, name } = useLegato();
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<{ role: "you" | "presence"; text: string; cards?: string[] }[]>([]);
  const [pending, setPending] = useState(false);

  const send = async () => {
    const t = draft.trim();
    if (!t || pending) return;
    const cards = suggestSituations(t);
    const next = [...msgs, { role: "you" as const, text: t }];
    setMsgs(next); setDraft("");
    if (getDiscovery().active) {
      setMsgs([...next, { role: "presence", text: "En mode découverte, rien n'est envoyé. Voici les pages qui peuvent vous aider.", cards }]);
      return;
    }
    setPending(true);
    try {
      const { reply } = await call({ data: { branch: "bloque", mode, name, history: next.map((m) => ({ role: m.role === "you" ? "user" as const : "assistant" as const, content: m.text })).slice(-20) } });
      setMsgs([...next, { role: "presence", text: reply, cards }]);
    } catch {
      setMsgs([...next, { role: "presence", text: "Je n'ai pas pu répondre. Les pages ci-dessous peuvent déjà vous aider.", cards }]);
    } finally { setPending(false); }
  };

  return (
    <StandardLayout space="practical" back="/practical/bloque" backLabel="Je suis bloqué" nav={false} className="lg-presence-page">
      <div className="mt-5 flex items-baseline justify-between gap-2">
        <h1 style={{ ...serif, fontSize: 30 }}>Présence</h1>
        <span className="lg-mono" style={sub}>Intelligence artificielle</span>
      </div>
      <div className="mt-5 space-y-4">
        {msgs.length === 0 && <ChatBubble space="practical" from="presence">Dites-moi ce qui vous bloque, avec vos mots. Je vous montre par où commencer.</ChatBubble>}
        {msgs.map((m, i) => (
          <div key={i}>
            <ChatBubble space="practical" from={m.role === "you" ? "user" : "presence"}>{m.text}</ChatBubble>
            {m.cards && m.cards.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {m.cards.map((id) => (
                  <Link key={id} to="/practical/bloque/$id" params={{ id }} className="inline-flex h-10 items-center rounded-full px-5 text-[14px]" style={{ border: "1px solid var(--sp-stroke)" }}>
                    {CARD_LABEL[id] ?? findSituation(id)?.titre ?? id}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {pending && <ChatBubble space="practical" from="presence"><span style={{ opacity: 0.6 }}>…</span></ChatBubble>}
      </div>
      <form className="mt-8" onSubmit={(e) => { e.preventDefault(); void send(); }}>
        <ChatInput space="practical" value={draft} onChange={setDraft} pending={pending} />
      </form>
    </StandardLayout>
  );
}

export { FAMILIES };
