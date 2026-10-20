import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { StandardLayout, PageTitle, Lead, SectionLabel, PrimaryButton } from "@/components/legato/ds";
import { LegatoLogo } from "@/components/legato/ds/LegatoLogo";
import { spaceClass } from "@/components/legato/ds/space";
import { useSavedToast, ConfirmedCall } from "@/components/legato/ActionFeedback";
import { useHelpLink } from "@/lib/help-link";

const serif = { fontFamily: "var(--lg-serif)", fontWeight: 400 } as const;
const sub = { color: "var(--sp-sub)" } as const;
const HELPER_KEY = "lg.helper-name.v1";

function Source({ children }: { children: ReactNode }) {
  return <p className="lg-mono mt-8" style={sub}>Source : {children}</p>;
}

function Expired() {
  return (
    <div className={`${spaceClass("support")} min-h-dvh`} style={{ background: "var(--sp-bg)", color: "var(--sp-ink)" }}>
      <div className="mx-auto max-w-[430px]" style={{ paddingInline: "var(--lg-margin)" }}>
        <header className="flex h-16 items-center" style={{ borderBottom: "1px solid var(--sp-line-2)" }}><LegatoLogo /></header>
        <PageTitle space="support" className="pt-7">Ce lien<br /><em>n'est plus valable.</em></PageTitle>
        <Lead className="mt-2 max-w-[310px]">Les liens durent 30 jours. Demandez-en un nouveau à la personne qui vous l'a envoyé.</Lead>
      </div>
    </div>
  );
}

/** D061 · so-aide-proche : la page publique reçue par les proches. */
export function ProchesPage({ lien }: { lien: string }) {
  const { loading, data, claim } = useHelpLink(lien);
  const { show, toast } = useSavedToast();
  const [me, setMe] = useState("");
  const [asking, setAsking] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  useEffect(() => { setMe(window.localStorage.getItem(HELPER_KEY) ?? ""); }, []);

  if (loading) return <div className={`${spaceClass("support")} min-h-dvh`} style={{ background: "var(--sp-bg)" }} />;
  if (!data) return <Expired />;
  const who = data.sender_name || "Votre proche";

  const take = async (id: string, name: string) => {
    const ok = await claim(id, name);
    show(ok ? `C'est noté. ${who} le verra.` : "Quelqu'un s'en occupe déjà.");
  };
  const onTake = (id: string) => (me ? take(id, me) : (setAsking(id), setDraft("")));

  return (
    <div className={`${spaceClass("support")} min-h-dvh`} style={{ background: "var(--sp-bg)", color: "var(--sp-ink)", fontFamily: "var(--lg-sans)" }}>
      <div className="mx-auto max-w-[430px] pb-16" style={{ paddingInline: "var(--lg-margin)" }}>
        <header className="flex h-16 items-center justify-between" style={{ borderBottom: "1px solid var(--sp-line-2)" }}>
          <LegatoLogo />
          <span className="lg-mono">Pour les proches</span>
        </header>
        <PageTitle space="support" className="pt-[26px]">{who} aurait<br /><em>besoin d'aide.</em></PageTitle>
        <Lead className="mt-2 max-w-[310px]">Choisissez ce qui vous est possible. {who} verra qui s'occupe de quoi.</Lead>
        <Link to="/aide/$article/aider" params={{ article: lien }} className="mt-[14px] flex items-center justify-between gap-3 px-4 py-[13px]" style={{ background: "var(--sp-block)" }}>
          <span className="flex flex-col gap-[3px]">
            <span style={{ ...serif, fontSize: 19 }}>Comment l'aider, concrètement</span>
            <span className="text-[12.5px]" style={sub}>quoi dire, quoi éviter · 3 minutes</span>
          </span>
          <ArrowUpRight className="size-4 shrink-0" strokeWidth={1.3} />
        </Link>
        <div className="pt-3">
          {data.items.map((it) => {
            const by = data.claims[it.id];
            return (
              <div key={it.id} className="py-[14px]" style={{ borderBottom: "1px solid var(--sp-line)" }}>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex flex-col gap-[2px]">
                    <span style={{ ...serif, fontSize: 19 }}>{it.title}</span>
                    {it.when && <span className="text-[12px]" style={sub}>{it.when}</span>}
                  </span>
                  {by
                    ? <span className="text-[12.5px]" style={sub}>{by === me ? "Vous vous en occupez" : `${by} s'en occupe`}</span>
                    : <PrimaryButton space="support" onClick={() => onTake(it.id)} className="!h-9 shrink-0 whitespace-nowrap px-6">Je m'en occupe</PrimaryButton>}
                </div>
                {asking === it.id && (
                  <form className="mt-3 flex items-center gap-3" onSubmit={(e) => {
                    e.preventDefault();
                    const n = draft.trim(); if (!n) return;
                    window.localStorage.setItem(HELPER_KEY, n); setMe(n); setAsking(null); void take(it.id, n);
                  }}>
                    <input autoFocus aria-label="Votre prénom" placeholder="Votre prénom" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={40}
                      className="flex-1 bg-transparent py-2 text-[16px] outline-none" style={{ borderBottom: "1px solid var(--sp-line-2)" }} />
                    <button type="submit" className="text-[14px] underline underline-offset-4">Valider</button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
        {toast}
      </div>
    </div>
  );
}

function GuideShell({ lien, back, backLabel, children }: { lien: string; back: "index" | "aider"; backLabel: (who: string) => string; children: (who: string, data: NonNullable<ReturnType<typeof useHelpLink>["data"]>) => ReactNode }) {
  const { loading, data } = useHelpLink(lien);
  if (loading) return <div className={`${spaceClass("support")} min-h-dvh`} style={{ background: "var(--sp-bg)" }} />;
  if (!data) return <Expired />;
  const who = data.sender_name || "votre proche";
  return (
    <StandardLayout space="support" nav={false} back={back === "aider" ? `/aide/${lien}/aider` : `/aide/${lien}`} backLabel={backLabel(who)}>
      {children(who, data)}
    </StandardLayout>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return <div className="mt-4 px-4 py-3" style={{ background: "var(--sp-block)" }}><span style={{ ...serif, fontSize: 18, lineHeight: 1.35 }}>{children}</span></div>;
}

/** D062 · so-comment-aider */
export function GuideAider({ lien }: { lien: string }) {
  return (
    <GuideShell lien={lien} back="index" backLabel={(w) => `Ce dont ${w} a besoin`}>
      {(who) => (
        <>
          <PageTitle space="support" className="pt-6">Aider {who},<br /><em>concrètement.</em></PageTitle>
          <Highlight>Pour 81 % des personnes en deuil, ce sont les proches qui aident en premier.</Highlight>
          <div className="mt-4" style={{ borderTop: "1px solid var(--sp-line-2)" }}>
            {[
              { n: 1, t: "Cette semaine : une aide précise", s: "prenez une chose sur sa liste", to: "/aide/$article" },
              { n: 2, t: "Quoi lui dire, quoi éviter", s: "des phrases simples, et pourquoi", to: "/aide/$article/mots" },
              { n: 3, t: "Être là dans la durée", s: "après les obsèques, aux dates difficiles", to: "/aide/$article/dates" },
              { n: 4, t: "Si vous êtes inquiet pour lui", s: "les signes, et qui appeler", to: "/aide/$article/inquiet" },
            ].map((r) => (
              <Link key={r.n} to={r.to as "/aide/$article"} params={{ article: lien }} className="grid items-center py-[14px]"
                style={{ gridTemplateColumns: "28px 1fr 18px", borderBottom: "1px solid var(--sp-line)" }}>
                <span style={{ ...serif, fontSize: 21 }}>{r.n}</span>
                <span className="flex flex-col gap-[3px]">
                  <span style={{ ...serif, fontSize: 19, lineHeight: 1.15 }}>{r.t}</span>
                  <span className="text-[12.5px]" style={sub}>{r.s}</span>
                </span>
                <ArrowUpRight className="size-4" strokeWidth={1.3} />
              </Link>
            ))}
          </div>
          <Source>Crédoc, « Le vécu du deuil en France », 2016</Source>
        </>
      )}
    </GuideShell>
  );
}

/** D063 · so-aider-mots */
export function GuideMots({ lien }: { lien: string }) {
  const lines = [
    { ok: true, q: "« Je pense à toi. Je passe mardi avec un repas. »", w: "une aide précise, sans rien lui demander" },
    { ok: true, q: "« Tu veux me parler d'elle ? »", w: "écouter, sans donner de conseils" },
    { ok: false, q: "« Il faut tourner la page. »", w: "une injonction : chacun avance à son rythme" },
    { ok: false, q: "« Je sais ce que tu ressens. »", w: "chaque deuil est différent" },
  ];
  return (
    <GuideShell lien={lien} back="aider" backLabel={(w) => `Aider ${w}`}>
      {() => (
        <>
          <PageTitle space="support" size={32} className="pt-[22px]">Quoi lui dire,<br /><em>quoi éviter.</em></PageTitle>
          <Highlight>Une personne en deuil sur deux se dit heurtée par les injonctions de son entourage.</Highlight>
          <div className="pt-2">
            {lines.map((l, i) => (
              <div key={i} className="grid gap-3 py-3" style={{ gridTemplateColumns: "22px 1fr", borderBottom: i < lines.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
                <span aria-label={l.ok ? "à dire" : "à éviter"} className="grid size-[22px] place-items-center rounded-full text-[13px]"
                  style={l.ok ? { background: "var(--lg-deep)", color: "var(--lg-mint)" } : { border: "1px solid var(--lg-deep)" }}>{l.ok ? "✓" : "×"}</span>
                <span>
                  <span className="block" style={{ ...serif, fontSize: 18, lineHeight: 1.3 }}>{l.q}</span>
                  <span className="mt-[3px] block text-[12.5px]" style={sub}>{l.w}</span>
                </span>
              </div>
            ))}
          </div>
          <Source>Crédoc-Empreintes, « Les Français face au deuil », 2019 ; association Empreintes</Source>
        </>
      )}
    </GuideShell>
  );
}

function longDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return Number.isNaN(d.getTime()) ? iso : `le ${d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;
}

/** D064 · so-aider-dates */
export function GuideDates({ lien }: { lien: string }) {
  return (
    <GuideShell lien={lien} back="aider" backLabel={(w) => `Aider ${w}`}>
      {(who, data) => (
        <>
          <PageTitle space="support" size={32} className="pt-[22px]">Être là<br /><em>dans la durée.</em></PageTitle>
          <Highlight>La moitié des personnes en deuil évoquent un sentiment d'isolement profond.</Highlight>
          <Lead className="mt-4 max-w-[320px]">
            {data.dates.length
              ? `Après les obsèques, l'entourage reprend sa vie. ${who} a choisi de partager ces dates avec vous : notez-les pour lui faire signe.`
              : `Après les obsèques, l'entourage reprend sa vie. Un message, un mois après puis aux dates importantes, compte beaucoup.`}
          </Lead>
          <div className="pt-2">
            {data.dates.map((d, i) => (
              <div key={i} className="flex items-baseline justify-between py-[14px]" style={{ borderBottom: i < data.dates.length - 1 ? "1px solid var(--sp-line)" : "none" }}>
                <span style={{ ...serif, fontSize: 19 }}>{d.label}</span>
                <span className="text-[13px]" style={sub}>{longDate(d.date)}</span>
              </div>
            ))}
          </div>
          <Source>Crédoc-Empreintes-SAF,<br />« Les Français face au deuil », 2025</Source>
        </>
      )}
    </GuideShell>
  );
}

/** D065 · so-aider-inquiet */
export function GuideInquiet({ lien }: { lien: string }) {
  const signs = ["Il ne mange presque plus, ou ne se lève plus.", "Il s'isole complètement depuis des semaines.", "Il parle de mourir, ou de rejoindre la personne disparue."];
  return (
    <GuideShell lien={lien} back="aider" backLabel={(w) => `Aider ${w}`}>
      {() => (
        <>
          <PageTitle space="support" size={32} className="pt-[22px]">Si vous êtes inquiet<br /><em>pour lui.</em></PageTitle>
          <SectionLabel space="support" className="mt-5">Les signes qui doivent alerter</SectionLabel>
          {signs.map((s, i) => (
            <div key={i} className="grid items-baseline py-5" style={{ gridTemplateColumns: "40px 1fr", borderBottom: i < 2 ? "1px solid var(--sp-line)" : "none" }}>
              <span style={{ ...serif, fontSize: 28, lineHeight: 1 }}>{i + 1}</span>
              <span style={{ ...serif, fontSize: 20, lineHeight: 1.35 }}>{s}</span>
            </div>
          ))}
          <div className="mt-4 flex items-center justify-between gap-4 p-[18px]" style={{ background: "var(--lg-bordeaux)", color: "var(--lg-blush)" }}>
            <p className="text-[14px] leading-[1.45]">S'il parle de mourir : le 3114, gratuit, jour et nuit. Il répond aussi aux proches.</p>
            <ConfirmedCall href="tel:3114" number="3114" label="3114" subtitle="Gratuit, jour et nuit. Il répond aussi aux proches."
              className="inline-flex h-10 shrink-0 items-center rounded-full px-5 text-[15px]" style={{ border: "1px solid var(--lg-blush)", color: "var(--lg-blush)" }} />
          </div>
          <Lead className="mt-4">Sinon, proposez-lui de voir son médecin, ou d'appeler la ligne d'écoute gratuite de l'association Empreintes : 01 42 38 08 08.</Lead>
          <Source>3114.fr ; agences régionales<br />de santé ; association Empreintes</Source>
        </>
      )}
    </GuideShell>
  );
}
