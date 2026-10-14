import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StandardLayout, PageTitle, Lead, PrimaryButton, TextLink } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";
import { useDictation } from "@/lib/use-dictation";
import { readSelf, updateSelf } from "@/lib/self-space";

export const Route = createFileRoute("/home/ecrire-peur")({
  head: () => legatoHead("Écrire ce qui vous fait peur", "Personne ne le lira. Le relire demain aide souvent à le voir autrement."),
  component: EcrirePeur,
});

/** B074 · Écrire ce qui fait peur — gardé seulement sur ce téléphone. */
function EcrirePeur() {
  const [text, setText] = useState("");
  const [kept, setKept] = useState<string | null>(null);
  useEffect(() => { const p = readSelf().peur; if (p) { setText(p.text); setKept(p.date); } }, []);
  const [base, setBase] = useState("");
  const dict = useDictation((t) => setText(`${base}${base ? " " : ""}${t}`));
  const keep = () => { const date = new Date().toISOString().slice(0, 10); updateSelf({ peur: { text: text.trim(), date } }); setKept(date); };
  return (
    <StandardLayout space="today" back="/home" backLabel="Aujourd'hui" activeTab="/home">
      <PageTitle className="pt-[28px]">Écrire ce qui<br /><em>vous fait peur.</em></PageTitle>
      <Lead className="mt-[10px] max-w-[310px]">Personne ne le lira. Le relire demain aide souvent à le voir autrement.</Lead>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Ce qui me fait peur, c'est…" aria-label="Ce qui me fait peur"
        className="mt-7 h-[220px] w-full resize-none bg-transparent px-4 py-[14px] outline-none" style={{ border: "1px solid var(--sp-line-2)", fontFamily: "var(--lg-serif)", fontSize: 18, lineHeight: 1.45 }} />
      <div className="flex flex-wrap items-center gap-[22px] pt-[26px]">
        <PrimaryButton onClick={keep} disabled={!text.trim()}>Garder pour demain</PrimaryButton>
        <TextLink onClick={() => { setBase(text); dict.toggle(); }}>{dict.listening ? "Arrêter la dictée" : "Dicter plutôt"}</TextLink>
      </div>
      {kept && <p className="mt-4 text-[13px]" style={{ color: "var(--sp-sub)" }}>Gardé sur ce téléphone le {new Date(`${kept}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}.</p>}
    </StandardLayout>
  );
}
