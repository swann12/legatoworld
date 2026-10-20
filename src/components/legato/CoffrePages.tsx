import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, FileText, Plus, Upload, X, ArrowLeft } from "lucide-react";
import { StandardLayout, PageTitle, Lead, PrimaryButton, TextLink, Toggle } from "@/components/legato/ds";
import { useSavedToast } from "@/components/legato/ActionFeedback";
import { useLegato } from "@/lib/legato-state";
import { useSelf } from "@/lib/self-space";
import {
  KINDS, kindOf, useCoffre, updateCoffre, setReceived, newId, frDay, namesFor, looksLikeSecret, transmissionDate, requestStage,
  type CoffreDoc, type CoffreKind,
} from "@/lib/coffre";

/* D110–D118 · Mon coffre pour mes proches (§9). */

const serif = { fontFamily: "var(--lg-serif)", fontWeight: 400 } as const;
const sub = { color: "var(--sp-sub)" } as const;
const line = "1px solid var(--sp-line)";

const Owner = ({ back, backLabel, children }: { back: string; backLabel: string; children: ReactNode }) => (
  <StandardLayout space="practical" back={back} backLabel={backLabel} activeTab="/practical">{children}</StandardLayout>
);

function DocRow({ title, subtitle, to, params, last, right }: { title: string; subtitle: string; to: string; params?: Record<string, string>; last?: boolean; right?: ReactNode }) {
  return (
    <Link to={to} params={params as never} className="flex items-center gap-3 py-[14px]" style={{ borderBottom: last ? "none" : line, color: "var(--sp-ink)" }}>
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span style={{ ...serif, fontSize: 19, lineHeight: 1.15 }}>{title}</span>
        <span className="text-[12.5px]" style={sub}>{subtitle}</span>
      </span>
      {right ?? <ChevronRight className="size-4 shrink-0" strokeWidth={1.3} />}
    </Link>
  );
}

/** Le proche de confiance de l'espace devient le premier destinataire. */
function useSeedConfiance() {
  const self = useSelf();
  const { c } = useCoffre();
  useEffect(() => {
    const name = self.confiance?.name?.trim();
    if (name && c.recipients.length === 0) updateCoffre(() => ({ recipients: [{ id: newId(), name, link: "votre personne de confiance", requester: true }] }));
  }, [self.confiance?.name, c.recipients.length]);
}

/** D110 · k-coffre */
export function CoffreHome() {
  useSeedConfiance();
  const { c } = useCoffre();
  return (
    <Owner back="/practical" backLabel="Préparer">
      <PageTitle className="pt-6">Mon coffre<br /><em>pour mes proches.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Rangés ici, transmis seulement quand il le faut, <br />à qui vous avez choisi.</Lead>
      <div className="mt-[22px] grid grid-cols-2" style={{ borderTop: "1px solid var(--sp-line-2)", borderBottom: "1px solid var(--sp-line-2)" }}>
        <Link to="/practical/coffre" className="flex items-baseline gap-2 py-4" style={{ borderRight: "1px solid var(--sp-line-2)" }}>
          <span style={{ ...serif, fontSize: 30 }}>{c.docs.length}</span><span className="text-[13px]" style={sub}>{c.docs.length > 1 ? "documents" : "document"}</span>
        </Link>
        <Link to="/practical/coffre/destinataires" className="flex items-baseline gap-2 py-4 pl-[18px]">
          <span style={{ ...serif, fontSize: 30 }}>{c.recipients.length}</span><span className="text-[13px]" style={sub}>{c.recipients.length > 1 ? "destinataires" : "destinataire"}</span>
        </Link>
      </div>
      <div className="mt-1">
        {c.docs.map((d, i) => <DocRow key={d.id} title={d.title} subtitle={namesFor(d, c.recipients)} to="/practical/coffre/$id" params={{ id: d.id }} last={i === c.docs.length - 1} />)}
        {c.docs.length === 0 && <p className="py-5 text-[14px]" style={sub}>Rien n'est encore rangé.</p>}
      </div>
      {c.stoppedAt && <p className="mt-4 text-[13px]" style={sub}>Transmission arrêtée le {frDay(c.stoppedAt)}. Rien n'a été envoyé.</p>}
      <div className="flex flex-wrap items-center gap-[22px] pt-[22px]">
        <PrimaryButton plus to="/practical/coffre/ajouter">Ajouter un document</PrimaryButton>
        <TextLink to="/practical/coffre/transmission">Comment ils seront transmis</TextLink>
      </div>
    </Owner>
  );
}

/** D111 · k-ajouter */
export function CoffreAjouter() {
  return (
    <Owner back="/practical/coffre" backLabel="Mon coffre">
      <PageTitle className="pt-6">Ajouter<br /><em>un document.</em></PageTitle>
      <div className="mt-3">
        {KINDS.slice(0, 5).map((k) => <AddRow key={k.kind} title={k.title} subtitle={k.sub} to="/practical/coffre/$id" params={{ id: `nouveau-${k.kind}` }} />)}
        <AddRow title="Une lettre pour plus tard" subtitle="à ouvrir à une date choisie" to="/care/garden/lettres" />
        <AddRow title={KINDS[5].title} subtitle={KINDS[5].sub} to="/practical/coffre/$id" params={{ id: "nouveau-autre" }} last />
      </div>
    </Owner>
  );
}
const AddRow = (p: { title: string; subtitle: string; to: string; params?: Record<string, string>; last?: boolean }) => (
  <DocRow {...p} right={<span className="flex size-8 shrink-0 items-center justify-center rounded-full" style={{ border: "1px solid var(--sp-line-2)" }}><Plus className="size-4" strokeWidth={1.3} /></span>} />
);

/** D112 · k-document (nouveau ou existant). */
export function CoffreDocument({ id }: { id: string }) {
  useSeedConfiance();
  const { c } = useCoffre();
  const nav = useNavigate();
  const { show, toast } = useSavedToast();
  const file = useRef<HTMLInputElement>(null);
  const existing = c.docs.find((d) => d.id === id);
  const kind = (existing?.kind ?? id.replace("nouveau-", "")) as CoffreKind;
  const meta = kindOf(kind);
  const [f, setF] = useState<CoffreDoc | null>(null);
  const [adding, setAdding] = useState(false);
  const [who, setWho] = useState("");
  useEffect(() => {
    if (f) return;
    if (existing) setF(existing);
    else if (meta && id.startsWith("nouveau-")) setF({ id: newId(), kind, title: meta.docTitle, at: "", recipients: c.recipients[0] ? [c.recipients[0].id] : [], readNow: [], remind: true });
  }, [existing, meta, id, kind, c.recipients, f]);

  if (!meta || !f) return (
    <Owner back="/practical/coffre" backLabel="Mon coffre">
      <PageTitle className="pt-6">Document<br /><em>introuvable.</em></PageTitle>
      <div className="pt-5"><TextLink to="/practical/coffre">Revenir au coffre</TextLink></div>
    </Owner>
  );
  const [t1, ...rest] = f.title.split(" ");
  const first = c.recipients.find((r) => f.recipients.includes(r.id));
  const firstName = first?.name.split(",")[0];
  const isCodes = kind === "codes";

  const save = () => {
    if (isCodes && !f.where?.trim()) return show("Dites où trouver vos codes.");
    if (looksLikeSecret(f.where ?? "")) return show("Legato ne garde jamais de mot de passe. Écrivez seulement où le trouver.");
    const next = { ...f, at: f.at || new Date().toISOString() };
    updateCoffre((cur) => ({ docs: cur.docs.some((d) => d.id === next.id) ? cur.docs.map((d) => (d.id === next.id ? next : d)) : [...cur.docs, next] }));
    nav({ to: "/practical/coffre" });
  };
  const toggleWho = (rid: string) => setF({ ...f, recipients: f.recipients.includes(rid) ? f.recipients.filter((x) => x !== rid) : [...f.recipients, rid], readNow: f.readNow.filter((x) => x !== rid || !f.recipients.includes(rid)) });
  const addWho = () => {
    const name = who.trim(); if (!name) return;
    const r = { id: newId(), name, link: "" };
    updateCoffre((cur) => ({ recipients: [...cur.recipients, r] }));
    setF({ ...f, recipients: [...f.recipients, r.id] }); setWho(""); setAdding(false);
  };

  return (
    <Owner back="/practical/coffre" backLabel="Mon coffre">
      <PageTitle size={32} className="pt-6">{t1}{rest.length ? " " : ""}<br /><em>{rest.join(" ")}.</em></PageTitle>
      {isCodes ? (
        <label className="mt-5 block p-4" style={{ background: "var(--sp-block)" }}>
          <span className="lg-mono" style={sub}>L'endroit, jamais les codes</span>
          <input value={f.where ?? ""} onChange={(e) => setF({ ...f, where: e.target.value })} placeholder="dans le tiroir du bureau"
            className="mt-2 w-full bg-transparent text-[16px] outline-none" style={{ ...serif, color: "var(--sp-ink)" }} />
        </label>
      ) : (
        <button type="button" onClick={() => file.current?.click()} className="mt-5 flex w-full items-center gap-[14px] p-4 text-left" style={{ background: "var(--sp-block)" }}>
          <span className="flex h-14 w-11 shrink-0 items-center justify-center" style={{ background: "var(--sp-bg)" }}>
            {f.fileName ? <FileText className="size-5" strokeWidth={1.2} /> : <Upload className="size-5" strokeWidth={1.2} />}
          </span>
          <span className="flex flex-col gap-[3px]">
            <span className="text-[14px]">{f.fileName ?? "Choisir le fichier"}</span>
            <span className="text-[12px]" style={sub}>{f.fileName ? `déposé le ${frDay(f.at || new Date().toISOString())}` : "photo ou PDF"}</span>
          </span>
          <input ref={file} type="file" accept="image/*,application/pdf" hidden onChange={(e) => { const x = e.target.files?.[0]; if (x) setF({ ...f, fileName: x.name }); }} />
        </button>
      )}
      <p className="lg-mono mt-6" style={sub}>Pour qui</p>
      <div className="mt-[10px] flex flex-wrap gap-2">
        {c.recipients.map((r) => {
          const on = f.recipients.includes(r.id);
          return <button key={r.id} type="button" aria-pressed={on} onClick={() => toggleWho(r.id)} className="h-[38px] rounded-full px-4 text-[14px]"
            style={on ? { background: "var(--lg-deep)", color: "var(--sp-block)" } : { border: "1px solid var(--sp-line-2)" }}>{r.name.split(",")[0]}</button>;
        })}
        {adding ? (
          <form onSubmit={(e) => { e.preventDefault(); addWho(); }} className="flex gap-2">
            <input autoFocus value={who} onChange={(e) => setWho(e.target.value)} placeholder="Prénom" aria-label="Prénom de la personne"
              className="h-[38px] w-36 rounded-full px-4 text-[14px] outline-none" style={{ border: "1px solid var(--sp-line-2)", background: "transparent" }} />
            <button type="submit" className="text-[13.5px] underline underline-offset-4">Ajouter</button>
          </form>
        ) : <button type="button" onClick={() => setAdding(true)} className="h-[38px] rounded-full px-4 text-[14px]" style={{ border: "1px solid var(--sp-line-2)" }}>+ Quelqu'un</button>}
      </div>
      <div className="mt-5" style={{ borderTop: line }}>
        <div className="flex items-center gap-4 py-4" style={{ borderBottom: line }}>
          <span className="flex-1"><span className="block" style={{ ...serif, fontSize: 18 }}>{firstName ? `${firstName} peut le lire dès maintenant` : "Lisible dès maintenant"}</span>
            <span className="mt-1 block text-[12.5px]" style={sub}>Sinon, seulement après la transmission</span></span>
          <Toggle checked={!!first && f.readNow.includes(first.id)} label="Lisible dès maintenant"
            onChange={(v) => first && setF({ ...f, readNow: v ? [...f.readNow, first.id] : f.readNow.filter((x) => x !== first.id) })} />
        </div>
        <div className="flex items-center gap-4 py-4">
          <span className="flex-1"><span className="block" style={{ ...serif, fontSize: 18 }}>Me rappeler de le mettre à jour</span>
            <span className="mt-1 block text-[12.5px]" style={sub}>Une fois par an</span></span>
          <Toggle checked={f.remind} label="Me rappeler de le mettre à jour" onChange={(v) => setF({ ...f, remind: v })} />
        </div>
      </div>
      <div className="pt-5"><PrimaryButton onClick={save}>Enregistrer</PrimaryButton></div>
      {toast}
    </Owner>
  );
}

/** D113 · k-destinataires */
export function CoffreDestinataires() {
  useSeedConfiance();
  const { c } = useCoffre();
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ name: "", link: "" });
  return (
    <Owner back="/practical/coffre" backLabel="Mon coffre">
      <PageTitle size={36} className="pt-6">Qui reçoit<br /><em>quoi.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Chaque personne ne recevra que ce que vous lui avez destiné. Elle ne voit rien avant.</Lead>
      <div className="mt-4">
        {c.recipients.map((r, i) => {
          const mine = c.docs.filter((d) => d.recipients.includes(r.id));
          const detail = r.requester ? "c'est elle qui fera la demande" : mine.length === 1 ? mine[0].title.toLowerCase().replace(/^mes /, "vos ").replace(/^mon /, "votre ") : "";
          const inner = (<>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full" style={{ ...serif, fontSize: 19, background: "var(--sp-block)" }}>{r.name[0]?.toUpperCase()}</span>
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span style={{ ...serif, fontSize: 20 }}>{r.name}{r.link ? `, ${r.link}` : ""}</span>
              <span className="text-[12.5px]" style={sub}>{mine.length} {mine.length > 1 ? "documents" : "document"}{detail ? ` · ${detail}` : ""}</span>
            </span>
            <ChevronRight className="size-4 shrink-0" strokeWidth={1.3} />
          </>);
          const style = { borderBottom: i < c.recipients.length - 1 ? line : "none" };
          return mine[0]
            ? <Link key={r.id} to="/practical/coffre/$id" params={{ id: mine[0].id }} className="flex items-center gap-[14px] py-4" style={style}>{inner}</Link>
            : <Link key={r.id} to="/practical/coffre/ajouter" className="flex items-center gap-[14px] py-4" style={style}>{inner}</Link>;
        })}
      </div>
      {adding ? (
        <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); if (!f.name.trim()) return; updateCoffre((cur) => ({ recipients: [...cur.recipients, { id: newId(), name: f.name.trim(), link: f.link.trim() }] })); setF({ name: "", link: "" }); setAdding(false); }}>
          {(["name", "link"] as const).map((k) => (
            <input key={k} autoFocus={k === "name"} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} placeholder={k === "name" ? "Son prénom" : "Votre lien (votre frère, votre notaire…)"} aria-label={k === "name" ? "Son prénom" : "Votre lien"}
              className="w-full px-4 py-3 text-[14px] outline-none" style={{ background: "var(--sp-block)", color: "var(--sp-ink)" }} />
          ))}
          <button type="submit" className="h-11 rounded-full px-[22px] text-[14.5px]" style={{ border: "1px solid var(--sp-line-2)" }}>Ajouter</button>
        </form>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="mt-[22px] h-11 rounded-full px-[22px] text-[14.5px]" style={{ border: "1px solid var(--sp-line-2)" }}>+ Ajouter une personne</button>
      )}
    </Owner>
  );
}

/** D114 · k-transmission */
export function CoffreTransmission() {
  useSeedConfiance();
  const { c } = useCoffre();
  const who = c.recipients.find((r) => r.requester)?.name.split(",")[0] ?? c.recipients[0]?.name.split(",")[0] ?? "Votre proche";
  const steps: [string, string][] = [
    [`${who} fait la demande`, "avec votre acte de décès"],
    ["Legato vérifie l'acte", `et l'identité de ${who === "Votre proche" ? "votre proche" : who}`],
    ["Sept jours de sécurité", "vous êtes prévenu : si vous êtes en vie, un geste suffit pour tout arrêter"],
    [`${who} reçoit ses documents`, "seulement ceux qui lui sont destinés"],
  ];
  return (
    <Owner back="/practical/coffre" backLabel="Mon coffre">
      <PageTitle size={32} className="pt-6">Comment ils seront<br /><em>transmis.</em></PageTitle>
      <ol className="mt-6">
        {steps.map(([t, s], i) => (
          <li key={t} className="relative flex gap-4 pb-5">
            {i < steps.length - 1 && <span aria-hidden className="absolute left-[13.5px] top-7 bottom-0 w-px" style={{ background: "var(--sp-line-2)" }} />}
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full text-[15px]" style={{ ...serif, background: "var(--sp-block)" }}>{i + 1}</span>
            <span><span className="block" style={{ ...serif, fontSize: 18, lineHeight: 1.25 }}>{t}</span><span className="mt-1 block text-[12.5px] leading-[1.45]" style={sub}>{s}</span></span>
          </li>
        ))}
      </ol>
      <div className="flex items-center gap-4 py-4" style={{ borderTop: line, borderBottom: line }}>
        <span className="flex-1"><span className="block" style={{ ...serif, fontSize: 18 }}>Si je suis hospitalisé et ne peux plus répondre</span>
          <span className="mt-1 block text-[12.5px]" style={sub}>Ma personne de confiance reçoit mes directives anticipées, rien d'autre</span></span>
        <Toggle checked={c.hospital} label="Si je suis hospitalisé" onChange={(v) => updateCoffre(() => ({ hospital: v }))} />
      </div>
      <div className="mt-5 px-[18px] py-4" style={{ background: "var(--sp-block)" }}>
        <p className="text-[13.5px] leading-[1.5]">Legato ne garde jamais vos mots de passe, et ne transmet rien sans vérification.</p>
      </div>
    </Owner>
  );
}

/** D115 · k-alerte : plein écran pendant les sept jours. */
export function CoffreAlerte() {
  const { c } = useCoffre();
  const nav = useNavigate();
  const who = c.recipients.find((r) => r.requester)?.name.split(",")[0] ?? c.recipients[0]?.name.split(",")[0] ?? "Votre proche";
  const until = frDay(transmissionDate(new Date().toISOString()));
  const ink = "var(--lg-pink, #EBC7C4)";
  return (
    <div className="min-h-dvh" style={{ background: "linear-gradient(180deg,var(--lg-bordeaux-deep, #7A2E2C) 0%,#A5534F 50%,#C98B86 100%)", color: ink, fontFamily: "var(--lg-sans)" }}>
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col pb-10" style={{ paddingInline: "var(--lg-margin)" }}>
        <div className="flex items-center justify-between text-[14px]" style={{ height: "var(--lg-header-h)" }}>
          <Link to="/practical/coffre" className="flex min-h-11 items-center gap-2"><ArrowLeft className="size-4" strokeWidth={1.4} /> Mon coffre</Link>
          <Link to="/practical/coffre" className="flex min-h-11 items-center gap-2">Fermer <X className="size-4" strokeWidth={1.4} /></Link>
        </div>
        <h1 className="pt-10" style={{ ...serif, fontSize: 34, lineHeight: 1.1 }}>{who} a demandé<br /><em>vos documents.</em></h1>
        <p className="mt-3 max-w-[310px] text-[14px] leading-[1.55]">Si c'est une erreur, vous pouvez tout arrêter. Sans réponse de votre part, ils lui seront transmis le {until}.</p>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-4">
          <button type="button" onClick={() => { updateCoffre(() => ({ stoppedAt: new Date().toISOString() })); nav({ to: "/practical/coffre" }); }}
            className="h-[52px] w-full rounded-full text-[15px]" style={{ background: ink, color: "var(--lg-bordeaux-deep, #7A2E2C)" }}>Arrêter la transmission</button>
          <Link to="/practical/coffre" className="text-[13.5px] underline underline-offset-4" style={{ color: "var(--lg-bordeaux-deep, #7A2E2C)" }}>Je préviens {who} moi-même</Link>
        </div>
      </div>
    </div>
  );
}

/* ——— Côté du proche ——— */

const Proche = ({ children }: { children: ReactNode }) => (
  <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">{children}</StandardLayout>
);
function usePerson() {
  const { lovedOneName } = useLegato();
  const n = lovedOneName?.trim();
  return { name: n || "votre proche", de: n ? (/^[aeiouyhéèêàâîôû]/i.test(n) ? `d'${n}` : `de ${n}`) : "de votre proche" };
}

/** D116 · k-demande */
export function CoffreDemande() {
  const p = usePerson();
  const nav = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>();
  const Name = p.name.charAt(0).toUpperCase() + p.name.slice(1);
  return (
    <Proche>
      <PageTitle size={32} className="pt-6">Recevoir les documents<br /><em>{p.de}.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[320px]">{Name} vous a confié des documents dans son coffre Legato. Pour les recevoir, déposez son acte de décès, le document officiel remis par la mairie.</Lead>
      <button type="button" onClick={() => ref.current?.click()} className="mt-5 flex h-[120px] w-full flex-col items-center justify-center gap-2" style={{ border: "1px dashed var(--sp-line-2)" }}>
        {fileName ? <Check className="size-5" strokeWidth={1.3} /> : <Upload className="size-5" strokeWidth={1.2} />}
        <span className="text-[14px]">{fileName ?? "Ajouter l'acte de décès"}</span>
        <span className="text-[12px]" style={sub}>{fileName ? "toucher pour changer" : "photo ou PDF"}</span>
        <input ref={ref} type="file" accept="image/*,application/pdf" hidden onChange={(e) => setFileName(e.target.files?.[0]?.name)} />
      </button>
      <div className="mt-4 px-[18px] py-4" style={{ background: "var(--sp-block)" }}>
        <p className="text-[13.5px] leading-[1.5]">Pas encore d'acte de décès ? Vous pouvez le demander en ligne à la mairie.</p>
        <div className="mt-2"><TextLink to="/lien-officiel/$id" params={{ id: "acte-deces" }}>Demander l'acte de décès</TextLink></div>
      </div>
      <div className="pt-5"><PrimaryButton disabled={!fileName} onClick={() => { setReceived({ personName: p.name, fileName: fileName!, sentAt: new Date().toISOString() }); nav({ to: "/practical/coffre-recu/attente" }); }}>Envoyer la demande</PrimaryButton></div>
    </Proche>
  );
}

/** D117 · k-attente */
export function CoffreAttente() {
  const p = usePerson();
  const { r } = useCoffre();
  const stage = requestStage(r);
  const Name = p.name.charAt(0).toUpperCase() + p.name.slice(1);
  const done = (b: boolean) => b
    ? <span className="flex size-6 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--lg-coral)" }}><Check className="size-3.5" strokeWidth={2} /></span>
    : <span className="size-6 shrink-0 rounded-full" style={{ border: "1px solid var(--sp-line-2)" }} />;
  const current = <span className="flex size-6 shrink-0 items-center justify-center rounded-full" style={{ border: "1.5px solid var(--lg-coral-text)" }}><span className="size-2.5 rounded-full" style={{ background: "var(--lg-coral-text)" }} /></span>;
  if (!r) return (
    <Proche>
      <PageTitle size={32} className="pt-6">Pas encore<br /><em>de demande.</em></PageTitle>
      <div className="pt-5"><TextLink to="/practical/coffre-recu/demande">Faire la demande</TextLink></div>
    </Proche>
  );
  const rows: [ReactNode, string, string, boolean?][] = [
    [done(true), "Acte de décès reçu", `le ${frDay(r.sentAt)}`],
    [r.verifiedAt ? done(true) : current, "Vérification", r.verifiedAt ? "faite par Legato" : "en cours par Legato"],
    [stage === "delai" ? current : done(stage === "transmis"), "Délai de sécurité", r.verifiedAt ? `jusqu'au ${frDay(transmissionDate(r.verifiedAt))}` : "sept jours, après la vérification"],
    [done(stage === "transmis"), `Les documents ${p.de}`, "vous serez prévenu", stage !== "transmis"],
  ];
  return (
    <Proche>
      <PageTitle size={32} className="pt-6">Votre demande<br /><em>{stage === "arretee" ? "a été arrêtée." : "est en cours."}</em></PageTitle>
      <div className="mt-5">
        {rows.map(([icon, t, s, muted], i) => (
          <div key={t} className="flex items-center gap-[14px] py-[14px]" style={{ borderBottom: i < rows.length - 1 ? line : "none" }}>
            {icon}
            <span className="flex flex-col gap-[3px]"><span style={{ ...serif, fontSize: 19, color: muted ? "var(--sp-sub)" : undefined }}>{t}</span><span className="text-[12.5px]" style={sub}>{s}</span></span>
          </div>
        ))}
      </div>
      <Lead className="mt-5 max-w-[310px]">Ce délai est une protection voulue par {Name}. Rien n'est à faire de votre côté.</Lead>
    </Proche>
  );
}

/** Exemple affiché tant que rien n'est transmis (la maquette). */
export const RECU_EXEMPLE = [
  { id: "coffre-recu-testament", title: "Copie de son testament", sub: "à remettre au notaire" },
  { id: "coffre-recu-contrat", title: "Son contrat obsèques", sub: "à transmettre aux pompes funèbres" },
  { id: "coffre-recu-comptes", title: "La liste de ses comptes", sub: "utile pour la banque et le notaire" },
  { id: "coffre-recu-codes", title: "Où trouver ses codes", sub: "l'endroit indiqué, jamais les codes" },
];

/** D118 · k-recus */
export function CoffreRecus() {
  const p = usePerson();
  const { r } = useCoffre();
  const stage = requestStage(r);
  return (
    <Proche>
      <PageTitle className="pt-6">Les documents<br /><em>{p.de}.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">{stage === "transmis" ? "Elle vous les a confiés. Ils restent ici, privés : vous seul pouvez les voir." : "Rien n'est encore transmis. Voici, en exemple, ce que vous verrez ici."}</Lead>
      <div className="mt-3">
        {RECU_EXEMPLE.map((d, i) => <DocRow key={d.id} title={d.title} subtitle={d.sub} to="/documents/$id" params={{ id: d.id }} last={i === RECU_EXEMPLE.length - 1} right={<span className="text-[13px]">Ouvrir</span>} />)}
      </div>
      {stage !== "transmis" && <div className="pt-3"><TextLink to={r ? "/practical/coffre-recu/attente" : "/practical/coffre-recu/demande"}>{r ? "Où en est ma demande" : "Faire la demande"}</TextLink></div>}
      <div className="pt-5"><PrimaryButton to="/practical/bloque">Préparer les démarches avec ces documents</PrimaryButton></div>
    </Proche>
  );
}
