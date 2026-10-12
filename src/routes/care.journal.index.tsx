import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLegato } from "@/lib/legato-state";
import { useDictation } from "@/lib/use-dictation";
import { StandardLayout, PageTitle, Lead, Row, PrimaryButton, TextLink } from "@/components/legato/ds";

type Mode = "journal" | "lettre" | "plus-tard";
type Search = { ecrire?: Mode; amorce?: string };

export const Route = createFileRoute("/care/journal/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ecrire: s.ecrire === "journal" || s.ecrire === "lettre" || s.ecrire === "plus-tard" ? s.ecrire : undefined,
    amorce: typeof s.amorce === "string" ? s.amorce.slice(0, 80) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Écrire — Mon journal intime · Legato" },
      { name: "description", content: "Écrire, sans relire : un journal et des lettres que personne ne lit." },
      { property: "og:title", content: "Écrire — Legato" },
      { property: "og:description", content: "Personne ne lit ce que vous écrivez ici." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Journal,
});

function lastLabel(iso?: string) {
  if (!iso) return "aucune page encore";
  const d = new Date(iso);
  const days = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) / 86400000);
  const soir = d.getHours() >= 18 ? " soir" : "";
  if (days <= 0) return `la dernière ${soir ? "ce soir" : "aujourd'hui"}`;
  if (days === 1) return `la dernière hier${soir}`;
  return `la dernière il y a ${days} jours`;
}

function Journal() {
  const { ecrire, amorce } = Route.useSearch();
  const { journal, lovedOneName, lovedOneRelation } = useLegato();
  if (ecrire) return <Page key={ecrire + (amorce ?? "")} mode={ecrire} amorce={amorce} />;

  const navigate = useNavigate();
  const go = (m: Mode) => navigate({ to: "/care/journal", search: { ecrire: m } });
  const pages = journal.length;
  const them = lovedOneName?.trim() || (lovedOneRelation === "conjoint" ? "mon amour" : "mon proche");

  return (
    <StandardLayout space="support" back="/care" backLabel="Soutien" activeTab="/care">
      <PageTitle space="support" className="mt-12">Écrire,<br /><em>sans relire.</em></PageTitle>
      <Lead space="support" className="mt-4">Personne ne lit ce que vous écrivez ici. Aucune phrase n'a besoin d'être juste.</Lead>
      <div className="mt-6">
        <Row space="support" title="Mon journal" subtitle={`${pages} page${pages > 1 ? "s" : ""} · ${lastLabel(journal[0]?.date)}`} onClick={() => go("journal")} />
        <Row space="support" title={`Une lettre à ${them}`} subtitle="Dire ce qui n'a pas été dit" onClick={() => go("lettre")} />
        <Row space="support" title="Une lettre pour plus tard" subtitle="Elle s'ouvrira à la date choisie" to="/care/journal/later" last />
      </div>
      <section className="mt-10 px-6 pb-2 pt-6" style={{ background: "var(--sp-block)" }}>
        <p className="lg-section">Si les mots ne viennent pas —</p>
        {["Ce matin, je…", "Ce qui me manque le plus…"].map((a, i) => (
          <Link key={a} to="/care/journal" search={{ ecrire: "journal", amorce: a }}
            className="block py-4 italic" style={{ fontFamily: "var(--lg-serif)", fontSize: 22, borderBottom: i === 0 ? "1px solid var(--sp-line)" : "none" }}>
            {a}
          </Link>
        ))}
      </section>
    </StandardLayout>
  );
}

function Page({ mode, amorce }: { mode: Mode; amorce?: string }) {
  const navigate = useNavigate();
  const { journal, addJournalEntry } = useLegato();
  const [body, setBody] = useState(amorce ? amorce.replace(/…$/, " ") : "");
  const [openOn, setOpenOn] = useState("");
  const [stamp, setStamp] = useState("");
  const [saved, setSaved] = useState(false);
  const [base, setBase] = useState(body);
  const { listening, toggle } = useDictation((t) => setBody((base ? base.trimEnd() + " " : "") + t));

  useEffect(() => {
    const d = new Date();
    const day = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    setStamp(`${day} · ${d.getHours()} h`);
  }, []);

  const save = () => {
    if (!body.trim()) return;
    addJournalEntry({
      body: body.trim(),
      to: mode === "journal" ? "self" : "them",
      title: mode === "plus-tard" && openOn ? `À ouvrir le ${new Date(openOn).toLocaleDateString("fr-FR")}` : mode === "lettre" ? "Lettre" : undefined,
    });
    setSaved(true);
    setTimeout(() => navigate({ to: "/care/journal", search: {} }), 900);
  };

  const dictate = () => { if (!listening) setBase(body); toggle(); };

  return (
    <StandardLayout space="support" back="/care/journal" backLabel="Écrire" activeTab="/care">
      <div className="mt-10 flex items-center justify-between">
        <span className="lg-mono">{stamp}</span>
        <span className="lg-mono" style={{ color: "var(--sp-ink)" }}>Page {journal.length + 1}</span>
      </div>
      {mode === "plus-tard" && (
        <label className="mt-6 flex items-center justify-between gap-3 pb-2 text-[14px]" style={{ borderBottom: "1px solid var(--sp-line-2)" }}>
          <span style={{ color: "var(--sp-sub)" }}>À ouvrir le</span>
          <input type="date" value={openOn} onChange={(e) => setOpenOn(e.target.value)} className="bg-transparent text-[16px] outline-none" />
        </label>
      )}
      <textarea value={body} onChange={(e) => setBody(e.target.value)} autoFocus
        placeholder={mode === "lettre" ? "Ce que je voulais te dire…" : "Laissez venir les mots…"}
        className="lg-ruled mt-6 block min-h-[468px] w-full resize-none bg-transparent outline-none"
        style={{ fontFamily: "var(--lg-serif)", fontSize: 22, lineHeight: "78px", color: "var(--sp-ink)" }} />
      <div className="mt-8 flex items-center gap-8">
        <PrimaryButton space="support" onClick={save} disabled={!body.trim() || saved || (mode === "plus-tard" && !openOn)}>
          {saved ? "Page gardée" : mode === "journal" ? "Garder cette page" : "Garder cette lettre"}
        </PrimaryButton>
        <TextLink space="support" onClick={dictate}>{listening ? "Arrêter la dictée" : "Dicter plutôt"}</TextLink>
      </div>
    </StandardLayout>
  );
}
