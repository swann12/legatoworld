import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { ConfideDock } from "@/components/legato/ConfideDock";
import { useLegato, type Wishes } from "@/lib/legato-state";
import { ShareToCircle } from "@/components/legato/ShareToCircle";
import { PageHeader, IvoryCard, SectionLabel } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/wishes")({
  beforeLoad: () => { throw redirect({ to: "/practical/wishes" }); },
  head: () => ({
    meta: [
      { title: "Mes volontés — Legato" },
      { name: "description", content: "Écrire ses volontés pour ses obsèques, en douceur et en clarté." },
    ],
  }),
  component: WishesPage,
});

const FIELDS: { key: keyof Omit<Wishes, "sharedWith">; label: string; hint: string; rows?: number }[] = [
  { key: "ceremony",    label: "Cérémonie",            hint: "Inhumation, crémation, autre. Civile, religieuse, libre…" },
  { key: "ambiance",    label: "Ambiance",             hint: "Recueillie, lumineuse, joyeuse, dehors, en petit comité…" },
  { key: "flowers",     label: "Fleurs",               hint: "Préférées, à éviter, sauvages, en bouquet, pas de fleurs…" },
  { key: "music",       label: "Musique",              hint: "Morceaux, artistes, silence, instruments…" },
  { key: "texts",       label: "Textes et lectures",   hint: "Poèmes, citations, lettres, extraits qui comptent.", rows: 3 },
  { key: "objects",     label: "Objets, rituels",      hint: "Bougies, photos, lettres à brûler, gestes simples…" },
  { key: "colors",      label: "Couleurs",             hint: "Tons, vêtements, ce que je voudrais voir." },
  { key: "materials",   label: "Matières",             hint: "Bois, tissus, papier, pierre, choses simples…" },
  { key: "iWant",       label: "Ce que je voudrais",   hint: "Tout ce qui vous tient à cœur.", rows: 4 },
  { key: "iDontWant",   label: "Ce que je ne voudrais pas", hint: "Aussi important.", rows: 3 },
  { key: "toLovedOnes", label: "Un mot pour mes proches", hint: "Quelques phrases, un message, une intention.", rows: 4 },
];

function WishesPage() {
  const { wishes, setWishes, name } = useLegato();
  const [shareInput, setShareInput] = useState("");

  const addShare = () => {
    const v = shareInput.trim();
    if (!v || wishes.sharedWith.includes(v)) return;
    setWishes({ sharedWith: [...wishes.sharedWith, v] });
    setShareInput("");
  };
  const removeShare = (v: string) =>
    setWishes({ sharedWith: wishes.sharedWith.filter((x) => x !== v) });

  const sendToProche = () => {
    const subject = encodeURIComponent(`Mes volontés — ${name}`);
    const lines = [
      `Bonjour,`, ``,
      `Je voulais te confier ce que j'aimerais, pour le jour venu.`, ``,
      wishes.ceremony && `Cérémonie : ${wishes.ceremony}`,
      wishes.ambiance && `Ambiance : ${wishes.ambiance}`,
      wishes.flowers  && `Fleurs : ${wishes.flowers}`,
      wishes.music    && `Musique : ${wishes.music}`,
      wishes.iWant    && `Ce que je voudrais : ${wishes.iWant}`,
      wishes.iDontWant && `Ce que je ne voudrais pas : ${wishes.iDontWant}`,
      wishes.toLovedOnes && `\nUn mot pour vous : ${wishes.toLovedOnes}`,
      ``, `Merci de garder cela précieusement.`,
    ].filter(Boolean).join("\n");
    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(lines)}`;
  };

  return (
    <Shell>
      <div className="relative pb-12">
        <div className="relative z-10">
          <PageHeader title="VOLONTÉS" />

          <section className="px-6 pt-4 pb-6">
            <p className="mono-label">Mes volontés</p>
            <h1 className="mt-3 ed-page-title text-dusk">
              Écrire ce que <span className="italic">je voudrais,</span> pour le jour venu.
            </h1>
            <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-dusk/65">
              Rien n'est obligatoire. Vous remplissez ce qui compte, à votre rythme. C'est pour vos proches, pour les soulager d'avoir à deviner.
            </p>
          </section>

          <div className="px-5 mt-2 space-y-3">
            {FIELDS.map((f) => (
              <IvoryCard key={f.key} className="p-5">
                <p className="mono-label">{f.label}</p>
                <p className="mt-1 text-[12px] text-dusk/55">{f.hint}</p>
                <textarea
                  value={wishes[f.key]}
                  onChange={(e) => setWishes({ [f.key]: e.target.value } as Partial<Wishes>)}
                  rows={f.rows ?? 2}
                  placeholder="…"
                  className="mt-3 w-full bg-transparent resize-none outline-none text-[15px] leading-[24px] text-dusk placeholder:text-dusk/25"
                />
                {f.key === "flowers" && (
                  <Link to="/practical/flowers" className="mt-3 inline-block mono-label">
                    → composer une ambiance florale
                  </Link>
                )}
              </IvoryCard>
            ))}
          </div>

          {/* Sharing */}
          <div className="px-5 mt-6">
            <IvoryCard className="p-5">
              <p className="mono-label">Partager avec un proche</p>
              <p className="mt-1 text-[12px] text-dusk/55">
                Ajoutez le prénom ou l'e-mail des personnes qui pourront consulter ces volontés.
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  value={shareInput}
                  onChange={(e) => setShareInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addShare())}
                  placeholder="Prénom ou e-mail"
                  className="flex-1 bg-transparent outline-none border-b border-dusk/15 pb-2 text-[14px] text-dusk placeholder:text-dusk/30"
                />
                <button
                  onClick={addShare}
                  className="rounded-[14px] px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-dusk/70 border border-dusk/10 hover:bg-dusk/5 transition-colors"
                >
                  Ajouter
                </button>
              </div>
              {wishes.sharedWith.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {wishes.sharedWith.map((p) => (
                    <span key={p} className="rounded-[14px] border border-dusk/10 px-3 py-1.5 text-[12px] text-dusk/75 flex items-center gap-2">
                      {p}
                      <button
                        onClick={() => removeShare(p)}
                        aria-label={`Retirer ${p}`}
                        className="text-dusk/40 hover:text-dusk"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={sendToProche}
                className="mt-5 w-full rounded-[14px] border border-dusk/10 px-5 py-3 font-serif text-[14px] text-dusk hover:bg-dusk/5 transition-colors"
              >
                Envoyer mes volontés par mail à un proche →
              </button>
            </IvoryCard>
          </div>

          <div className="px-7 mt-8 text-center">
            <p className="font-serif italic text-[14px] text-dusk/55 max-w-[30ch] mx-auto text-balance">
              Merci, {name}. Ces pages restent à vous, modifiables à tout moment.
            </p>
          </div>
        </div>
      </div>
      <ConfideDock step="volontés" />
    </Shell>
  );
}
