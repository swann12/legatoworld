import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { scopedKey } from "@/lib/active-space";
import { useCarnet } from "@/lib/carnet";
import { upcoming, dayName, hour } from "@/lib/carnet-model";
import { StandardLayout, PageTitle, Lead, PrimaryButton } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/home/questions-medecin")({
  head: () => legatoHead("Vos questions pour le médecin", "Préparer vos questions avant le prochain rendez-vous médical."),
  component: Page,
});

const BASE = ["Comment va-t-elle réagir au traitement ?", "Que pouvons-nous faire à la maison ?", "Qui appeler en cas de doute, le soir ?", "Comment prendre soin de moi aussi ?"];
type Q = { text: string; kept: boolean };

/** B048 · Questions au médecin, gardées dans le carnet pour le prochain rendez-vous */
function Page() {
  const navigate = useNavigate();
  const { rdvs, setQuestions, ready } = useCarnet();
  const next = upcoming(rdvs)[0];
  const [qs, setQs] = useState<Q[]>(BASE.map((text) => ({ text, kept: false })));
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!ready) return;
    let saved: Q[] | null = null;
    try { const raw = window.localStorage.getItem(scopedKey("lg.doctorQuestions")); if (raw) saved = JSON.parse(raw); } catch { /* rien */ }
    const list = saved ?? BASE.map((text) => ({ text, kept: false }));
    if (next) for (const t of next.questions) { const f = list.find((q) => q.text === t); if (f) f.kept = true; else list.push({ text: t, kept: true }); }
    setQs([...list]);
  }, [ready, next?.id]);

  const add = () => { const t = draft.trim(); if (!t) return; setQs((q) => [...q, { text: t, kept: true }]); setDraft(""); };
  const keep = async () => {
    try { window.localStorage.setItem(scopedKey("lg.doctorQuestions"), JSON.stringify(qs)); } catch { /* rien */ }
    const kept = qs.filter((q) => q.kept).map((q) => q.text);
    try { if (next) await setQuestions(next.id, kept); } catch { toast.error("Le carnet n'a pas pu être mis à jour. Réessayez."); return; }
    toast.success(`${kept.length} question${kept.length > 1 ? "s" : ""} gardée${kept.length > 1 ? "s" : ""} dans le carnet.`);
    navigate({ to: "/home/carnet" });
  };
  const doctor = next ? next.who.split(",")[0].trim().toLowerCase() : "";
  const forWho = doctor ? (/^[aeiouyéèh]/.test(doctor) ? `l'${doctor}` : `le ${doctor}`) : "le médecin";

  return (
    <StandardLayout back="/home" backLabel="Aujourd'hui" activeTab="/home">
      <p className="lg-mono pt-8">{next ? ["Rendez-vous " + dayName(next.date), hour(next.time), next.place].filter(Boolean).join(" · ") : "Prochain rendez-vous"}</p>
      <PageTitle className="mt-3">Vos questions<br /><em>pour {forWho}.</em></PageTitle>
      <Lead className="mt-3">Gardez celles qui vous parlent. Vous les retrouverez {next ? dayName(next.date) : "au rendez-vous"}, dans le carnet.</Lead>
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
        placeholder="Ajouter votre question…" maxLength={200} aria-label="Ajouter votre question"
        className="mt-4 w-full bg-transparent pb-3 italic outline-none placeholder:opacity-50"
        style={{ fontFamily: "var(--lg-serif)", fontSize: 21, borderBottom: "1px solid var(--sp-line-2)" }} />
      <div className="mt-6"><PrimaryButton onClick={() => void keep()}>{next ? `Garder pour ${dayName(next.date)}` : "Garder pour le rendez-vous"}</PrimaryButton></div>
    </StandardLayout>
  );
}
