import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { StandardLayout, PageTitle, Lead, SectionLabel, Row, Tip, Block, PrimaryButton, TextLink, Spec, SplitHeader, Field, StepBar } from "@/components/legato/ds";
import { GroupLink } from "@/components/legato/CommunityUI";
import { useDictation } from "@/lib/use-dictation";
import { PREPARE_ITEMS, LIFE_QUESTIONS, isReady, readyCount, updateSelf, useSelf, newId, nextThursday, type PrepareId, type Obseques } from "@/lib/self-space";

/* Espace « je pense beaucoup à la mort » (B072–B090) : rose et vert profond partout,
   sauf le bloc 3114, bordeaux comme toutes les pages d'urgence. */

const frDate = (iso: string) => new Date(`${iso.slice(0, 10)}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
const today = () => new Date().toISOString().slice(0, 10);

/** B075 · Soutien */
export function SelfSoutien() {
  return (
    <StandardLayout space="support" title="Soutien" activeTab="/care">
      <PageTitle size={36} className="pt-[26px]">Apprivoiser<br /><em>l'angoisse.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">La peur de la mort touche presque tout le monde. Elle peut s'apaiser.</Lead>
      <SectionLabel className="mt-[30px]">Maintenant</SectionLabel>
      <Row title="Quand l'angoisse monte" subtitle="Trois gestes simples" to="/care/angoisse" />
      <Row title="En parler" subtitle="À Présence, ou à un psychologue" to="/care/parler" last />
      <div className="mt-[26px] px-5" style={{ background: "var(--sp-block)" }}>
        <Row title="Ce que d'autres en ont dit" subtitle="Philosophes, soignants, cinéastes" to="/care/resources" />
        <Row title="Écrire" subtitle="Ce qui vous fait peur, ce qui compte" to="/home/ecrire-peur" last />
      </div>
    </StandardLayout>
  );
}

const READINGS = [
  { tag: "Lire · Antiquité", title: "Lettre à Ménécée", by: "Épicure", href: "https://fr.wikipedia.org/wiki/Lettre_%C3%A0_M%C3%A9n%C3%A9c%C3%A9e" },
  { tag: "Lire · XVIe siècle", title: "Que philosopher, c'est apprendre à mourir", by: "Montaigne, dans les Essais", href: "https://fr.wikisource.org/wiki/Essais/Livre_I/Chapitre_20" },
  { tag: "Lire · témoignage", title: "La Mort intime", by: "Marie de Hennezel", href: "https://fr.wikipedia.org/wiki/Marie_de_Hennezel" },
  { tag: "Voir · documentaire, 2020", title: "Dick Johnson Is Dead", by: "Kirsten Johnson", href: "https://fr.wikipedia.org/wiki/Dick_Johnson_Is_Dead" },
];

/** B077 · Ce que d'autres en ont dit */
export function SelfResources() {
  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle className="pt-[26px]">Ce que d'autres<br /><em>en ont dit.</em></PageTitle>
      <div className="mt-4">
        {READINGS.map((r, i) => (
          <a key={r.title} href={r.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 py-[17px]" style={{ borderBottom: i < READINGS.length - 1 ? "1px solid var(--sp-line)" : "none", color: "var(--sp-ink)" }}>
            <span className="min-w-0 flex-1">
              <span className="lg-mono block" style={{ color: "var(--sp-sub)" }}>{r.tag}</span>
              <span className="mt-1 block" style={{ fontFamily: "var(--lg-serif)", fontSize: 20, lineHeight: 1.15 }}>{r.title}</span>
              <span className="mt-1 block text-[13px]" style={{ color: "var(--sp-sub)" }}>{r.by}</span>
            </span>
            <ArrowUpRight className="size-4 shrink-0" strokeWidth={1.3} />
          </a>
        ))}
      </div>
      <div className="pt-5"><TextLink to="/presence">Demander d'autres idées à Présence</TextLink></div>
    </StandardLayout>
  );
}

/** B078 · Préparer */
export function SelfPreparer() {
  const d = useSelf();
  return (
    <StandardLayout space="practical" title="Préparer" activeTab="/practical">
      <SplitHeader title={<>Préparer,<br /><em>pour être tranquille.</em></>} value={readyCount(d)} total={6}>
        <span className="lg-mono" style={{ color: "var(--sp-sub)" }}>prêts</span>
      </SplitHeader>
      <div className="mt-1">
        {PREPARE_ITEMS.map((it, i) => (
          <Row key={it.id} n={i + 1} title={it.title} subtitle={it.sub} to={it.to} last={i === PREPARE_ITEMS.length - 1}
            status={isReady(d, it.id) ? <span className="lg-mono" style={{ color: "var(--sp-ink)" }}>fait</span> : undefined} />
        ))}
      </div>
    </StandardLayout>
  );
}

function Sheet({ back, backLabel, tab, children }: { back: string; backLabel: string; tab: string; children: ReactNode }) {
  return <StandardLayout space={tab === "/practical" ? "practical" : tab === "/care/garden" ? "memory" : "community"} back={back} backLabel={backLabel} activeTab={tab}>{children}</StandardLayout>;
}
const PrepSheet = ({ children }: { children: ReactNode }) => <Sheet back="/practical" backLabel="Préparer" tab="/practical">{children}</Sheet>;

/** Marque une fiche comme prête (compte de « Préparer »). Hors maquette, nécessaire au compteur. */
function ReadyToggle({ id }: { id: PrepareId }) {
  const d = useSelf();
  const on = d.ready.includes(id);
  return <div className="pt-8"><TextLink onClick={() => updateSelf((c) => ({ ready: on ? c.ready.filter((x) => x !== id) : [...c.ready, id] }))}>{on ? "Ce n'est plus prêt" : "C'est prêt pour moi"}</TextLink></div>;
}
const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px]" style={{ background: "var(--sp-btn-bg)", color: "var(--sp-btn-fg)" }}>{children}</a>
);

const EMPTY_OBS: Obseques = { choix: "", ceremonie: "", musique: "", cendres: "", quiConnait: "" };

/** B079 · Mes souhaits pour mes obsèques */
export function SelfObseques() {
  const d = useSelf();
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState<Obseques>(EMPTY_OBS);
  useEffect(() => { if (d.obseques) setF(d.obseques); }, [d.obseques]);
  const o = d.obseques;
  const v = (s?: string) => s?.trim() || "À préciser";
  return (
    <PrepSheet>
      <PageTitle size={32} className="pt-[28px]">Mes souhaits<br /><em>pour mes obsèques.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">{o?.date ? `Préparés le ${frDate(o.date)}.` : "Pas encore préparés."} Vous pouvez les changer à tout moment.</Lead>
      {edit ? (
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); updateSelf({ obseques: { ...f, date: today() } }); setEdit(false); }}>
          <Field label="Choix" placeholder="Crémation" value={f.choix} onChange={(e) => setF({ ...f, choix: e.target.value })} />
          <Field label="Cérémonie" placeholder="Laïque, en petit comité" value={f.ceremonie} onChange={(e) => setF({ ...f, ceremonie: e.target.value })} />
          <Field label="Musique" placeholder="Un morceau de Bach" value={f.musique} onChange={(e) => setF({ ...f, musique: e.target.value })} />
          <Field label="Les cendres, le lieu" placeholder="Dispersées en mer" value={f.cendres} onChange={(e) => setF({ ...f, cendres: e.target.value })} />
          <Field label="Qui les connaît" placeholder="Claire, votre sœur" value={f.quiConnait} onChange={(e) => setF({ ...f, quiConnait: e.target.value })} />
          <div className="pt-2"><PrimaryButton type="submit">Garder mes souhaits</PrimaryButton></div>
        </form>
      ) : <>
        <Spec className="mt-[26px]" items={[{ label: "Choix", value: v(o?.choix) }, { label: "Cérémonie", value: v(o?.ceremonie) }, { label: "Musique", value: v(o?.musique) }, { label: "Les cendres", value: v(o?.cendres) }]} />
        <Block className="mt-[26px]" label="Qui les connaît" title={v(o?.quiConnait)} meta={o?.quiConnait ? "Elle les recevra le moment venu." : "Une personne à qui les confier."} />
        <div className="pt-6"><PrimaryButton onClick={() => setEdit(true)}>Modifier</PrimaryButton></div>
      </>}
    </PrepSheet>
  );
}

/** B080 · Ma personne de confiance */
export function SelfConfiance() {
  const d = useSelf();
  const [name, setName] = useState("");
  const [doc, setDoc] = useState(false);
  useEffect(() => setName(d.confiance?.name ?? ""), [d.confiance]);
  const chosen = d.confiance?.name.trim();
  return (
    <PrepSheet>
      <PageTitle className="pt-[28px]">Ma personne<br /><em>de confiance.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Elle peut vous accompagner chez le médecin. Si un jour vous ne pouvez plus vous exprimer, c'est elle que l'équipe médicale consultera.</Lead>
      <Spec className="mt-[26px]" items={[{ label: "Choisie", value: chosen || "Pas encore" }, { label: "Comment", value: "Par écrit, signé par vous deux" }, { label: "Changeable", value: "À tout moment" }]} />
      {doc ? (
        <div className="mt-7 space-y-4">
          <Field label="Son prénom, et votre lien" placeholder="Claire, votre sœur" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="p-5 text-[14px] leading-relaxed" style={{ border: "1px solid var(--sp-line-2)" }}>
            Je soussigné(e) …………, désigne {name.trim() || "…………"} comme personne de confiance, conformément à l'article L1111-6 du code de la santé publique. Cette désignation vaut sans limite de durée, sauf si je la révoque.<br /><br />Fait à …………, le ………… · Signature de la personne qui désigne · Signature de la personne de confiance
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <PrimaryButton onClick={() => updateSelf({ confiance: { name: name.trim() } })} disabled={!name.trim()}>Garder ce choix</PrimaryButton>
            <TextLink onClick={() => window.print()}>Imprimer</TextLink>
          </div>
        </div>
      ) : <div className="pt-7"><PrimaryButton onClick={() => setDoc(true)}>Préparer le document à signer</PrimaryButton></div>}
    </PrepSheet>
  );
}

/** B081 · Mes directives anticipées */
export function SelfDirectives() {
  return (
    <PrepSheet>
      <PageTitle size={36} className="pt-[30px]">Mes directives<br /><em>anticipées.</em></PageTitle>
      <Lead className="mt-3 max-w-[310px]">Ce que vous souhaitez, ou non, pour la fin de votre vie, au cas où vous ne pourriez plus le dire. Les médecins doivent les respecter.</Lead>
      <Spec className="mt-6" items={[{ label: "Valables", value: "Sans limite de durée" }, { label: "Modifiables", value: "À tout moment" }, { label: "Où les garder", value: "Chez vous, chez votre médecin, ou dans Mon espace santé" }]} />
      <div className="pt-[26px]"><Ext href="https://www.service-public.fr/particuliers/vosdroits/R44281">Les rédiger avec le modèle officiel</Ext></div>
      <div className="pt-[14px]"><TextLink to="/care/help">En parler d'abord avec mon médecin</TextLink></div>
      <ReadyToggle id="directives" />
    </PrepSheet>
  );
}

function TipsSheet({ title, size = 36, lead, label, tips, children, id }: { title: ReactNode; size?: number; lead: string; label: string; tips: string[]; children?: ReactNode; id: PrepareId }) {
  return (
    <PrepSheet>
      <PageTitle size={size} className="pt-[28px]">{title}</PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">{lead}</Lead>
      <SectionLabel className="mt-[30px]">{label}</SectionLabel>
      {tips.map((t, i) => <Tip key={t} n={i + 1} last={i === tips.length - 1}>{t}</Tip>)}
      {children}
      <ReadyToggle id={id} />
    </PrepSheet>
  );
}

/** B082 · Le don d'organes */
export const SelfDon = () => (
  <TipsSheet id="don" title={<>Le don<br /><em>d'organes.</em></>} lead="En France, chacun est considéré comme donneur, sauf s'il a exprimé son refus." label="Selon votre choix"
    tips={["Vous êtes d'accord : dites-le à vos proches, ils seront consultés.", "Vous refusez : inscrivez-vous sur le registre national des refus.", "Vous hésitez : prenez le temps, vous pourrez changer d'avis."]}>
    <div className="pt-6"><PrimaryButton to="/care/journal" search={{ ecrire: "plus-tard", amorce: "Au sujet du don d'organes, je voudrais vous dire…" }}>Écrire un mot à mes proches</PrimaryButton></div>
  </TipsSheet>
);

/** B083 · Mon testament */
export const SelfTestament = () => (
  <TipsSheet id="testament" size={38} title={<>Mon <em>testament.</em></>} lead="Il dit à qui vont vos biens et vos objets. Sans testament, c'est la loi qui décide." label="Deux façons de faire"
    tips={["Seul : écrit en entier à la main, daté et signé. Gratuit, mais il faut qu'on le retrouve.", "Avec un notaire : il le conserve et l'enregistre, pour qu'il soit retrouvé."]}>
    <div className="flex flex-wrap items-center gap-[22px] pt-[26px]">
      <Ext href="https://www.notaires.fr/fr/annuaires-notaires">Trouver un notaire</Ext>
      <a href="https://www.service-public.fr/particuliers/vosdroits/F770" target="_blank" rel="noreferrer" className="text-[13.5px] underline underline-offset-4">Ce qu'il faut savoir avant</a>
    </div>
  </TipsSheet>
);

/** B084 · Un contrat obsèques */
export const SelfContrat = () => (
  <TipsSheet id="contrat" title={<>Un contrat<br /><em>obsèques.</em></>} lead="Une assurance qui paie vos obsèques le moment venu, pour que vos proches n'aient rien à avancer." label="Deux formules"
    tips={["En capital : une somme est versée à la personne que vous choisissez.", "En prestations : vous choisissez à l'avance les pompes funèbres et le déroulé."]}>
    <Block className="mt-6" label="Avant de signer" title="Comparer plusieurs offres" meta="Vous pouvez y renoncer dans les 30 jours." />
  </TipsSheet>
);

/** B085 · Transmettre */
export function SelfTransmettre() {
  return (
    <StandardLayout space="memory" title="Transmettre" activeTab="/care/garden">
      <PageTitle size={36} className="pt-[26px]">Ce que vous voulez<br /><em>laisser.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Pour ceux que vous aimez, à votre rythme.</Lead>
      <Block className="lg-home-block mt-7" label="Pour commencer" title="Raconter votre vie, question par question" meta="Présence vous pose une question à la fois · 10 minutes">
        <PrimaryButton to="/care/garden/histoire">Commencer</PrimaryButton>
      </Block>
      <div className="mt-[10px]">
        <Row title="Des lettres pour plus tard" subtitle="À ouvrir à une date choisie" to="/care/garden/lettres" />
        <Row title="Vos objets" subtitle="À qui vous aimeriez les confier" to="/care/garden/objets" last />
      </div>
      <div className="mt-10"><TextLink to="/care/garden">Revenir aux parcelles</TextLink></div>
    </StandardLayout>
  );
}

/** B086 · Raconter votre vie — une question à la fois, sans barre de navigation */
export function SelfHistoire() {
  const d = useSelf();
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (started) return;
    const first = d.histoire.findIndex((a) => !a?.trim());
    const at = first === -1 ? (d.histoire.length >= LIFE_QUESTIONS.length ? 0 : d.histoire.length) : first;
    setI(at); setText(d.histoire[at] ?? "");
    if (d.histoire.length) setStarted(true);
  }, [d.histoire, started]);
  const base = text;
  const dict = useDictation((t) => setText(`${base}${base && !base.endsWith(" ") ? " " : ""}${t}`));
  const go = (save: boolean) => {
    setStarted(true);
    if (save) updateSelf((c) => { const h = [...c.histoire]; h[i] = text.trim(); return { histoire: h }; });
    const n = (i + 1) % LIFE_QUESTIONS.length;
    setI(n); setText(d.histoire[n] ?? "");
  };
  const [a, b] = splitQuestion(LIFE_QUESTIONS[i]);
  return (
    <StandardLayout space="memory" back="/care/garden/space" backLabel="Transmettre" nav={false}>
      <div className="flex min-h-[calc(100dvh-110px)] flex-col">
        <StepBar className="pt-[18px]" step={i + 1} total={LIFE_QUESTIONS.length} />
        <p className="lg-mono pt-[22px]" style={{ color: "var(--sp-sub)" }}>Question {i + 1} sur {LIFE_QUESTIONS.length}</p>
        <PageTitle size={32} className="mt-[10px]">{a}<br /><em>{b}</em></PageTitle>
        <Lead className="mt-[10px]">Écrivez ou dictez, autant que vous voulez.</Lead>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="La maison de ma grand-mère, l'odeur du café le matin…" aria-label="Votre réponse"
          className="mt-[26px] h-[190px] w-full resize-none bg-transparent px-4 py-[14px] outline-none" style={{ border: "1px solid var(--sp-line-2)", fontFamily: "var(--lg-serif)", fontSize: 18 }} />
        <div className="pt-3"><TextLink onClick={dict.toggle}>{dict.listening ? "Arrêter la dictée" : "Dicter"}</TextLink></div>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-4 pb-[34px] pt-6">
          <PrimaryButton full onClick={() => go(true)}>{i === LIFE_QUESTIONS.length - 1 ? "Garder ma réponse" : "Question suivante"}</PrimaryButton>
          <TextLink onClick={() => go(false)}>Passer cette question</TextLink>
        </div>
      </div>
    </StandardLayout>
  );
}
function splitQuestion(q: string): [string, string] {
  const w = q.split(" "); const cut = Math.ceil(w.length / 2);
  return [w.slice(0, cut).join(" "), w.slice(cut).join(" ")];
}

/** B087 · Des lettres pour plus tard */
export function SelfLettres() {
  const d = useSelf();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ pour: "", quand: "", texte: "" });
  return (
    <Sheet back="/care/garden/space" backLabel="Transmettre" tab="/care/garden">
      <PageTitle className="pt-[26px]">Des lettres<br /><em>pour plus tard.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Elles restent fermées jusqu'à la date choisie, ou jusqu'à ce qu'un proche les reçoive.</Lead>
      <div className="mt-3">
        {d.lettres.length === 0 && <p className="py-[18px] text-[14px]" style={{ color: "var(--sp-sub)" }}>Aucune lettre pour l'instant.</p>}
        {d.lettres.map((l, i) => (
          <div key={l.id} className="py-[18px]" style={{ borderBottom: i < d.lettres.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
            <p style={{ fontFamily: "var(--lg-serif)", fontSize: 21 }}>Pour {l.pour}</p>
            <p className="lg-mono mt-[6px]" style={{ color: "var(--sp-ink)" }}>À ouvrir {l.quand}</p>
          </div>
        ))}
      </div>
      {open ? (
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); updateSelf((c) => ({ lettres: [...c.lettres, { id: newId(), ...f, createdAt: Date.now() }] })); setF({ pour: "", quand: "", texte: "" }); setOpen(false); }}>
          <Field label="Pour qui" placeholder="Claire" value={f.pour} onChange={(e) => setF({ ...f, pour: e.target.value })} required />
          <Field label="À ouvrir" placeholder="à mes 70 ans" value={f.quand} onChange={(e) => setF({ ...f, quand: e.target.value })} required />
          <textarea value={f.texte} onChange={(e) => setF({ ...f, texte: e.target.value })} placeholder="Ce que je voudrais te dire…" aria-label="La lettre"
            className="h-[180px] w-full resize-none bg-transparent px-4 py-3 outline-none" style={{ border: "1px solid var(--sp-line-2)", fontFamily: "var(--lg-serif)", fontSize: 18 }} />
          <PrimaryButton type="submit">Fermer la lettre</PrimaryButton>
        </form>
      ) : <div className="pt-6"><PrimaryButton onClick={() => setOpen(true)}>Écrire une lettre</PrimaryButton></div>}
    </Sheet>
  );
}

/** B088 · Vos objets */
export function SelfObjets() {
  const d = useSelf();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ objet: "", pour: "" });
  return (
    <Sheet back="/care/garden/space" backLabel="Transmettre" tab="/care/garden">
      <PageTitle size={32} className="pt-[26px]">Vos objets,<br /><em>et à qui les confier.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Une simple liste pour vos proches. Elle n'a pas la valeur d'un testament.</Lead>
      {d.objets.length ? <Spec className="mt-[26px]" items={d.objets.map((o) => ({ label: o.objet, value: o.pour.trim() ? `Pour ${o.pour}` : "À décider" }))} />
        : <p className="mt-[26px] text-[14px]" style={{ color: "var(--sp-sub)" }}>Aucun objet pour l'instant.</p>}
      {open && (
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); updateSelf((c) => ({ objets: [...c.objets, { id: newId(), ...f }] })); setF({ objet: "", pour: "" }); setOpen(false); }}>
          <Field label="L'objet" placeholder="La montre" value={f.objet} onChange={(e) => setF({ ...f, objet: e.target.value })} required />
          <Field label="Pour qui · facultatif" placeholder="Paul" value={f.pour} onChange={(e) => setF({ ...f, pour: e.target.value })} />
          <PrimaryButton type="submit">Ajouter</PrimaryButton>
        </form>
      )}
      {!open && <div className="flex flex-wrap items-center gap-[22px] pt-[26px]"><PrimaryButton onClick={() => setOpen(true)}>Ajouter un objet</PrimaryButton><TextLink to="/practical/testament">Faire un testament</TextLink></div>}
    </Sheet>
  );
}

const thursday = () => nextThursday(new Date());
const thursdayLabel = (d: Date) => { const s = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }); return `${s.charAt(0).toUpperCase()}${s.slice(1)}, 19 h`; };

/** B089 · Communauté */
export function SelfCommunity() {
  return (
    <StandardLayout space="community" title="Communauté" activeTab="/care/community">
      <PageTitle size={36} className="pt-[26px]">En parler,<br /><em>sans tabou.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Des personnes qui se posent les mêmes questions. Groupes modérés.</Lead>
      <SectionLabel className="mt-7">Groupes</SectionLabel>
      <GroupLink id="mort-simplement" label="Parler de la mort, simplement" hint="82 membres" />
      <GroupLink id="angoisse" label="Apprivoiser l'angoisse" hint="34 membres · avec une psychologue" />
      <Block className="lg-home-block mt-[26px]" label="Café mortel · jeudi 19 h" title="Une heure pour parler de la mort, autour d'un café" meta="En visio · huit personnes · une animatrice">
        <PrimaryButton to="/care/community/cafe-mortel">Voir le café mortel</PrimaryButton>
      </Block>
      <Lead className="mt-7">Groupes et café d'exemple. Rien n'est envoyé ; aucune modération réelle n'est connectée.</Lead>
    </StandardLayout>
  );
}

/** B090 · Un café mortel — inscription gardée sur le téléphone, rendez-vous d'exemple. */
export function SelfCafe() {
  const d = useSelf();
  const [when, setWhen] = useState("Jeudi, 19 h");
  useEffect(() => setWhen(thursdayLabel(thursday())), []);
  return (
    <Sheet back="/care/community" backLabel="Communauté" tab="/care/community">
      <PageTitle size={38} className="pt-[28px]">Un café<br /><em>mortel.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Né en Suisse, ce rendez-vous existe aujourd'hui dans le monde entier : on parle de la mort librement, sans thème imposé.</Lead>
      <Spec className="mt-[26px]" items={[{ label: "Quand", value: when }, { label: "Où", value: "En visio, caméra facultative" }, { label: "Avec", value: "Huit personnes et une animatrice" }]} />
      <div className="flex flex-wrap items-center gap-[22px] pt-7">
        {d.cafe ? <TextLink onClick={() => updateSelf({ cafe: false })}>Me désinscrire</TextLink> : <PrimaryButton onClick={() => updateSelf({ cafe: true })}>S'inscrire</PrimaryButton>}
        <span className="lg-mono" style={{ color: "var(--sp-sub)" }}>{d.cafe ? "Inscrit · 2 places restantes" : "3 places restantes"}</span>
      </div>
      <Lead className="mt-6">Rendez-vous d'exemple : l'inscription reste sur cet appareil, aucun lien de visio n'est envoyé.</Lead>
    </Sheet>
  );
}

/** Lien « Continuer » après l'écran 3114 ouvert depuis la première ouverture. */
export function ResumeOnboarding() {
  return <div className="pt-8"><Link to="/onboarding" search={{ etape: "pret" }} className="text-[13.5px] underline underline-offset-4">Continuer à créer mon espace</Link></div>;
}
