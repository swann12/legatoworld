import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { scopedKey } from "@/lib/active-space";
import { useActiveSpace } from "@/lib/use-active-space";
import { StandardLayout, PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";

export const Route = createFileRoute("/home/questions-medecin")({
  head: () => ({
    meta: [
      { title: "Vos questions pour le médecin — Legato" },
      { name: "description", content: "Préparer vos questions avant le prochain rendez-vous médical." },
      { property: "og:title", content: "Vos questions pour le médecin — Legato" },
      { property: "og:description", content: "Gardez celles qui vous parlent, retrouvez-les au rendez-vous." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const BASE = [
  "Comment va-t-elle réagir au traitement ?",
  "Que pouvons-nous faire à la maison ?",
  "Qui appeler en cas de doute, le soir ?",
  "Comment prendre soin de moi aussi ?",
];
type Q = { text: string; kept: boolean };

/** 101 · Questions pour le médecin */
function Page() {
  const { space } = useActiveSpace();
  const [qs, setQs] = useState<Q[]>(BASE.map((text) => ({ text, kept: false })));
  const [draft, setDraft] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(scopedKey("lg.doctorQuestions"));
      if (raw) setQs(JSON.parse(raw));
    } catch { /* rien */ }
  }, [space?.id]);

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    setQs((q) => [...q, { text: t, kept: true }]);
    setDraft("");
  };
  const keep = () => {
    try { window.localStorage.setItem(scopedKey("lg.doctorQuestions"), JSON.stringify(qs)); } catch { /* rien */ }
    toast.success(`${qs.filter((q) => q.kept).length} questions gardées pour le rendez-vous.`);
  };

  return (
    <StandardLayout back="/home" backLabel={`Espace ${space?.name ?? ""}`.trim()} activeTab="/home">
      <p className="lg-mono pt-8" style={{ color: "var(--sp-ink)" }}>Prochain rendez-vous</p>
      <PageTitle className="mt-3">Vos questions<br /><em>pour le médecin.</em></PageTitle>
      <Lead className="mt-3">Gardez celles qui vous parlent. Vous les retrouverez au rendez-vous.</Lead>
      <ul className="mt-5">
        {qs.map((q, i) => (
          <li key={i}>
            <button type="button" aria-pressed={q.kept} onClick={() => setQs((all) => all.map((x, j) => (j === i ? { ...x, kept: !x.kept } : x)))}
              className="flex w-full items-center gap-4 py-[14px] text-left text-[15px]" style={{ borderBottom: "1px solid var(--sp-line)" }}>
              <span className="grid size-5 shrink-0 place-items-center rounded-full" style={{ border: "1.5px solid var(--sp-accent)" }}>
                {q.kept && <span className="size-2.5 rounded-full" style={{ background: "var(--sp-accent)" }} />}
              </span>
              {q.text}
            </button>
          </li>
        ))}
      </ul>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} onBlur={add}
        placeholder="Ajouter votre question…" maxLength={200}
        className="mt-4 w-full bg-transparent pb-3 italic outline-none placeholder:opacity-50"
        style={{ fontFamily: "var(--lg-serif)", fontSize: 21, borderBottom: "1px solid var(--sp-line-2)" }} />
      <div className="mt-6"><PrimaryButton onClick={keep}>Garder pour le rendez-vous</PrimaryButton></div>
    </StandardLayout>
  );
}
