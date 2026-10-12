import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { StandardLayout, PageTitle, Lead, Spec, PrimaryButton, TextLink } from "@/components/legato/ds";
import { explainLetter, type LetterExplained } from "@/lib/letter-ai.functions";
import { addCustom } from "@/lib/demarches";

export const Route = createFileRoute("/practical/letter")({
  head: () => ({
    meta: [
      { title: "Un courrier expliqué — Legato" },
      { name: "description", content: "Photographiez un courrier : Présence vous dit ce qu'il demande, avant quand, et si c'est urgent." },
      { property: "og:title", content: "Un courrier expliqué — Legato" },
      { property: "og:description", content: "Ce que dit ce courrier, en clair." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Letter,
});

const KEY = "legato.letter.last";

/** Réduit la photo pour l'envoyer (côté le plus long : 1600 px). */
function shrink(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 1600 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function Letter() {
  const navigate = useNavigate();
  const explain = useServerFn(explainLetter);
  const input = useRef<HTMLInputElement>(null);
  const [res, setRes] = useState<LetterExplained | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => { try { const v = sessionStorage.getItem(KEY); if (v) setRes(JSON.parse(v)); } catch { /* rien */ } }, []);

  const onFile = async (f?: File) => {
    if (!f) return;
    setBusy(true); setErr(null); setAdded(false);
    try {
      const image = await shrink(f);
      const out = await explain({ data: { image } });
      if (out.result) { setRes(out.result); sessionStorage.setItem(KEY, JSON.stringify(out.result)); }
      else setErr(out.error);
    } catch { setErr("Le courrier n'a pas pu être lu."); }
    finally { setBusy(false); if (input.current) input.current.value = ""; }
  };

  const addToTasks = () => {
    if (!res) return;
    const id = `courrier-${Date.now()}`;
    addCustom({
      id, title: [res.todo, `· ${res.sender.toLowerCase()}.`], bucket: "week", minutes: 15, meta: res.before,
      who: res.sender, steps: [res.todo, "Garder une copie dans Mes documents"],
      ask: `Pourrais-tu m'aider : ${res.todo.toLowerCase()} (${res.sender}) ? Merci.`,
    });
    setAdded(true);
    setTimeout(() => navigate({ to: "/practical" }), 600);
  };

  return (
    <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
      <input ref={input} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

      {!res ? (
        <>
          <p className="lg-mono pt-8">Courrier à photographier</p>
          <PageTitle space="practical" className="mt-4">Un courrier <em>à comprendre ?</em></PageTitle>
          <Lead space="practical" className="mt-4">Prenez-le en photo. Présence vous dit ce qu'il demande, avant quand, et si c'est urgent.</Lead>
          <div className="mt-8"><PrimaryButton space="practical" onClick={() => input.current?.click()} disabled={busy}>{busy ? "Lecture du courrier…" : "Photographier le courrier"}</PrimaryButton></div>
          {err && <p className="mt-5 text-[14px]" style={{ color: "var(--sp-accent)" }}>{err}</p>}
        </>
      ) : (
        <>
          <p className="lg-mono pt-8">Courrier photographié · {res.sender}</p>
          <PageTitle space="practical" className="mt-4">Ce que dit <em>ce courrier.</em></PageTitle>
          <div className="mt-8 p-6" style={{ background: "var(--lg-linen)" }}>
            <p style={{ fontFamily: "var(--lg-serif)", fontSize: 20, lineHeight: 1.4 }}>{res.summary}</p>
          </div>
          <Spec space="practical" className="mt-6" items={[
            { label: "À faire", value: res.todo },
            { label: "Avant", value: res.before },
            { label: "Urgent ?", value: res.urgent },
          ]} />
          <div className="mt-8 flex flex-col items-start gap-6">
            <PrimaryButton space="practical" onClick={addToTasks} disabled={added}>{added ? "Ajouté" : "Ajouter à mes démarches"}</PrimaryButton>
            <TextLink space="practical" to="/presence">Poser une question</TextLink>
            <TextLink space="practical" onClick={() => input.current?.click()}>{busy ? "Lecture du courrier…" : "Photographier un autre courrier"}</TextLink>
          </div>
          {err && <p className="mt-5 text-[14px]" style={{ color: "var(--sp-accent)" }}>{err}</p>}
        </>
      )}
    </StandardLayout>
  );
}
