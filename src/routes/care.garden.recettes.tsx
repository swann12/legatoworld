import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StandardLayout, PageTitle, Lead, PrimaryButton, Field, TextLink } from "@/components/legato/ds";
import { addMemory, useMemories } from "@/lib/memories-store";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/garden/recettes")({
  head: () => legatoHead("Ses recettes", "Noter ses recettes avec elle, avec ses mots à elle."),
  component: Recettes,
});

/** B065 · Ses recettes */
function Recettes() {
  const list = useMemories("recette");
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const pick = (f?: File) => { if (!f) return; const r = new FileReader(); r.onload = () => setPhoto(String(r.result)); r.readAsDataURL(f); };
  const save = () => {
    if (!title.trim()) return;
    try { addMemory({ zone: "recette", type: photo ? "photo" : "text", title: title.trim(), body: body.trim() || undefined, imageDataUrl: photo }); }
    catch (e) { toast.error((e as Error).message); return; }
    setTitle(""); setBody(""); setPhoto(undefined); setAdding(false);
  };
  return (
    <StandardLayout space="memory" back="/care/garden/space" backLabel="Souvenirs" activeTab="/care/garden">
      <PageTitle className="pt-8">Ses recettes.</PageTitle>
      <Lead className="mt-3">Notées avec elle, avec ses mots à elle. Une photo du plat, si vous le cuisinez ensemble.</Lead>
      <div className="mt-6">
        {list.map((m) => (
          <div key={m.id} className="py-4" style={{ borderBottom: "1px solid var(--sp-line)" }}>
            <p className="lg-row-title">{m.title}</p>
            <p className="lg-row-sub mt-1">{m.body ? `« ${m.body} »` : `Notée en ${new Date(m.createdAt).toLocaleDateString("fr-FR", { month: "long" })}`}</p>
            {m.imageDataUrl && <img src={m.imageDataUrl} alt={m.title} className="mt-3 w-full rounded" />}
          </div>
        ))}
      </div>
      {adding ? <div className="mt-6 flex flex-col gap-4">
        <Field label="La recette" placeholder="Le clafoutis aux cerises" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
        <label className="block"><span className="lg-mono block" style={{ color: "var(--sp-sub)" }}>Avec ses mots</span>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={2000} placeholder="Beaucoup de beurre, et pas de noyaux enlevés"
            className="mt-2 w-full resize-none bg-transparent outline-none placeholder:opacity-40" style={{ fontFamily: "var(--lg-serif)", fontSize: 19, borderBottom: "1px solid var(--sp-line-2)" }} /></label>
        <label className="text-[13.5px] underline underline-offset-4 cursor-pointer" style={{ color: "var(--sp-stroke)" }}>{photo ? "Photo ajoutée" : "Une photo du plat · facultatif"}<input type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} /></label>
        <div className="flex items-center gap-4"><PrimaryButton onClick={save} disabled={!title.trim()}>Garder la recette</PrimaryButton><TextLink onClick={() => setAdding(false)}>Annuler</TextLink></div>
      </div> : <div className="mt-8"><PrimaryButton plus onClick={() => setAdding(true)}>Ajouter une recette</PrimaryButton></div>}
    </StandardLayout>
  );
}
