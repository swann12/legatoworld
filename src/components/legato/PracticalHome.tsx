import { SelfPreparer } from "@/components/legato/SelfSpace";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { StandardLayout, SplitHeader, Row, TextLink, Lead } from "@/components/legato/ds";
import { useDemarches, type Demarche } from "@/lib/demarches";
import { useVault } from "@/lib/vault-store";
import { getDeathDate, getPapers, getPapersHelper, setPapers, type PapersState } from "@/lib/onboarding-flow";
import { planSections, viewFor } from "@/lib/papers-plan";
import { useActiveSpace } from "@/lib/use-active-space";
import { AnimalPractical } from "./AnimalPractical";
import { MaladeAides } from "./MaladePractical";
import { MotExplique } from "./MotExplique";

export const demarcheLink = (d: Demarche) => (d.letter && d.id === "banque" ? `/practical/tasks/${d.id}/template` : `/practical/tasks/${d.id}`);

const serif = { fontFamily: "var(--lg-serif)", fontWeight: 400 } as const;
const sub = { color: "var(--sp-sub)" } as const;

function Label({ children, accent, className = "" }: { children: string; accent: boolean; className?: string }) {
  return <p className={className} style={{ ...serif, fontSize: 17, fontStyle: "italic", color: accent ? "var(--sp-accent)" : "var(--sp-ink)", margin: "0 0 2px" }}>{children} —</p>;
}

/** B013–B016 · l'onglet Démarches suit la réponse « Où en êtes-vous avec les papiers ? » (§6). */
export function Practical() {
  const { kind } = useActiveSpace();
  return kind === "malade" ? <MaladeAides /> : kind === "questions" ? <SelfPreparer /> : kind === "animal" ? <AnimalPractical /> : <DeuilPractical />;
}

function DeuilPractical() {
  const { done, total, status } = useDemarches();
  const { missing } = useVault();
  const [papers, setP] = useState<PapersState | null>(null);
  const [helper, setHelper] = useState("");
  const [death, setDeath] = useState<string | null>(null);
  useEffect(() => { setP(getPapers()); setHelper(getPapersHelper()); setDeath(getDeathDate()); }, []);

  const view = viewFor(papers);
  const isDone = (id: string) => {
    if (id === "retraite") return ["retraite", "mutuelle"].every((x) => status({ id: x } as Demarche) === "done");
    const d = { id, defaultDone: false } as Demarche;
    return status(d) === "done";
  };
  const sections = planSections(papers, isDone, death);
  const who = helper || "Un proche";
  const takeBack = () => { setPapers("obseques"); setP("obseques"); };
  const showAll = () => { setPapers("obseques"); setP("obseques"); };

  return (
    <StandardLayout space="practical" title="Démarches" activeTab="/practical">
      {view === "presque" ? (
        <SplitHeader space="practical" title={<>Presque<br /><em>terminé.</em></>} value={done} total={total}>
          <span className="lg-mono" style={sub}>faites</span>
        </SplitHeader>
      ) : (
        <h1 className="lg-title lg-ds-title pt-[30px]" style={{ fontSize: 34, lineHeight: 1.1 }}>
          {view === "avant" && <>Les premiers jours,<br /><em>dans l'ordre.</em></>}
          {view === "apres" && <>Ce qu'il reste<br /><em>à faire.</em></>}
          {view === "confie" && <>{who} s'occupe<br /><em>des démarches.</em></>}
        </h1>
      )}
      {view === "avant" && <Lead className="mt-[10px] max-w-[310px]">Les obsèques ont lieu au plus tard 14 jours après le décès. Seulement l'essentiel.</Lead>}
      {view === "confie" && <Lead className="mt-[10px] max-w-[310px]">Vous ne voyez que ce {helper ? "qu'elle" : "qu'on"} vous demande.</Lead>}
      {/* Accès « Je suis bloqué » dans les quatre états (ajouts-4 §7). */}
      <div className="mt-5 px-5" style={{ background: "var(--sp-block)" }}>
        <Row space="practical" title="Je suis bloqué" subtitle="Mots de passe, argent, papiers, premières heures" to="/practical/bloque" last />
      </div>

      {view === "apres" && (
        <div className="mt-[14px] flex items-center gap-[14px] py-4" style={{ borderBottom: "1px solid var(--sp-line)" }}>
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--lg-coral)" }}>
            <Check className="size-[13px]" strokeWidth={1.8} style={{ color: "var(--lg-cream)" }} />
          </span>
          <span className="flex flex-col gap-[3px]">
            <span style={{ ...serif, fontSize: 19, ...sub }}>La cérémonie</span>
            <span className="text-[12.5px]" style={sub}>faite</span>
          </span>
        </div>
      )}

      {sections.map((s, si) => {
        let n = sections.slice(0, si).reduce((a, x) => a + x.rows.length, 0);
        return (
          <div key={s.label}>
            <Label accent={s.accent} className={si === 0 ? (view === "presque" ? "mt-[34px]" : "mt-8") : "mt-10"}>{s.label}</Label>
            {s.rows.map((r, i) => <Row key={r.id} space="practical" n={++n} title={r.title} subtitle={r.sub} to={r.to} last={i === s.rows.length - 1} />)}
          </div>
        );
      })}

      {view === "presque" && sections.length === 0 && <p className="mt-10 lg-lead" style={sub}>Tout est fait.</p>}
      {view === "presque" && <div className="pt-[26px]"><TextLink space="practical" to="/practical/progress">Revoir ce qui est fait</TextLink></div>}
      {view === "apres" && sections.length === 0 && <p className="mt-10 lg-lead" style={sub}>Rien d'urgent ce mois-ci. Le reste peut attendre.</p>}
      {view === "avant" && <p className="mt-8 text-[13.5px] leading-[1.55]" style={sub}>Après les obsèques, la banque, les organismes et la <MotExplique mot="succession" pourVous="Rien avant les obsèques. Ensuite, prenez rendez-vous avec un notaire." page="/practical/tasks/notaire" /> apparaîtront ici. Rien ne presse avant.</p>}

      {view === "confie" && <>
        <section className="mt-[34px] px-6 pb-[26px] pt-6" style={{ background: "var(--sp-block)", color: "var(--sp-block-ink)" }}>
          <p style={{ ...serif, fontSize: 16, fontStyle: "italic" }}>{who} a besoin de vous —</p>
          <p className="mt-3" style={{ ...serif, fontSize: 23, lineHeight: 1.12 }}>Rien pour l'instant.</p>
          <p className="mt-[9px] text-[13.5px] leading-[1.5]" style={sub}>Ses demandes apparaîtront ici.</p>
        </section>
        <div className="flex flex-wrap items-center gap-[22px] pt-[30px]">
          <TextLink space="practical" onClick={showAll}>Voir toutes les démarches</TextLink>
          <TextLink space="practical" onClick={takeBack}>Les reprendre moi-même</TextLink>
        </div>
      </>}

      {/* Hors maquette, conservé en attendant votre accord */}
      {view !== "confie" && <div className="mt-12 flex flex-col items-start gap-4">
        <TextLink space="practical" to="/practical/vault">Mes documents{missing ? ` · il manque ${missing.short}` : ""}</TextLink>
        <TextLink space="practical" to="/practical/letter">Un courrier à comprendre ? Photographiez-le</TextLink>
        {view !== "presque" && <TextLink space="practical" to="/practical/progress">Mon avancement · {done}/{total}</TextLink>}
      </div>}
    </StandardLayout>
  );
}
