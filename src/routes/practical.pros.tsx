import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/practical/pros")({
  head: () => ({
    meta: [
      { title: "Professionnels — Démarches Legato" },
      { name: "description", content: "Pompes funèbres, notaires, fleuristes : qui appeler, quand, et quoi demander." },
      { property: "og:title", content: "Professionnels — Démarches Legato" },
      { property: "og:description", content: "Pompes funèbres, notaires, fleuristes : qui appeler, quand, et quoi demander." },
    ],
  }),
  component: PracticalPros,
});

type Category = "pompes" | "fleuristes" | "notaires" | "administrations" | "debarras" | "photographes";
type Moment = "now" | "week" | "later";

const MOMENTS: { id: Moment; label: string }[] = [
  { id: "now", label: "Tout de suite" },
  { id: "week", label: "Cette semaine" },
  { id: "later", label: "Plus tard" },
];

const PROS: {
  category: Category;
  label: string;
  hint: string;
  moment: Moment;
  ask: string;
  bg: string;
}[] = [
  {
    category: "pompes", label: "Pompes funèbres", hint: "Organiser les obsèques",
    moment: "now", bg: "var(--sage)",
    ask: "Demandez un devis détaillé écrit, poste par poste. Rien ne doit être signé le jour même.",
  },
  {
    category: "administrations", label: "Administratif", hint: "Mairie, caisses, organismes",
    moment: "now", bg: "var(--blush)",
    ask: "Demandez plusieurs copies de l'acte de décès : presque chaque organisme en réclame une.",
  },
  {
    category: "fleuristes", label: "Fleuristes", hint: "Compositions de cérémonie",
    moment: "week", bg: "var(--peach)",
    ask: "Dites simplement le budget et une couleur. Ils s'occupent du reste.",
  },
  {
    category: "notaires", label: "Notaires", hint: "Succession, actes",
    moment: "week", bg: "var(--lavender)",
    ask: "Le premier rendez-vous est souvent gratuit. Demandez le coût de la succession avant d'engager.",
  },
  {
    category: "photographes", label: "Photographes", hint: "Garder une trace discrète",
    moment: "later", bg: "var(--sky)",
    ask: "Précisez que vous voulez une présence discrète, sans mise en scène.",
  },
  {
    category: "debarras", label: "Débarras", hint: "Logement, tri, transport",
    moment: "later", bg: "var(--sun)",
    ask: "Rien ne presse. Faites une pièce à la fois, et gardez une boîte « je décide plus tard ».",
  },
];

function PracticalPros() {
  const [moment, setMoment] = useState<Moment | "all">("all");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROS.filter((p) => (moment === "all" || p.moment === moment))
      .filter((p) => !q || p.label.toLowerCase().includes(q) || p.hint.toLowerCase().includes(q));
  }, [moment, query]);

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="" back="/practical" />

        <section className="px-6 pb-2">
          <p className="mono-label">Professionnels</p>
          <h1 className="mt-5 font-serif font-normal text-[32px] leading-[1.06]">
            Les bonnes personnes,<br />
            <span className="italic" style={{ color: "var(--terracotta)" }}>au bon moment</span>.
          </h1>
          <p className="mt-4 text-[13px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            Qui appeler, dans quel ordre, et quoi demander pour ne pas décider sous pression.
          </p>
        </section>

        <section className="px-5 pt-7">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chercher : notaire, fleurs, mairie…"
            aria-label="Chercher un professionnel"
            className="w-full rounded-full border border-dusk/15 bg-paper px-5 py-3 text-[14px] outline-none focus:border-dusk/35"
          />
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <Chip active={moment === "all"} onClick={() => setMoment("all")}>Tout</Chip>
            {MOMENTS.map((m) => (
              <Chip key={m.id} active={moment === m.id} onClick={() => setMoment(m.id)}>{m.label}</Chip>
            ))}
          </div>
        </section>

        <section className="px-5 pt-6 space-y-3">
          {list.map((p) => (
            <Link
              key={p.category}
              to="/resources/$category"
              params={{ category: p.category }}
              search={{ space: "practical" as const }}
              className="block rounded-[20px] px-5 py-5"
              style={{ background: p.bg }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="mono-label text-dusk/60">
                    {MOMENTS.find((m) => m.id === p.moment)?.label}
                  </p>
                  <p className="mt-2 font-serif text-[21px] leading-[1.12]">{p.label}</p>
                  <p className="mt-1 text-[12.5px] text-dusk/65">{p.hint}</p>
                </div>
                <span className="mono-label text-dusk/55 shrink-0">Voir</span>
              </div>
              <p className="mt-4 rounded-[12px] bg-paper/70 px-4 py-3 text-[12px] leading-[1.55] text-dusk/75">
                <span className="mono-label text-dusk/55">À demander</span><br />
                {p.ask}
              </p>
            </Link>
          ))}
          {list.length === 0 && (
            <p className="px-1 py-6 text-center text-[13px] text-dusk/55">
              Rien à ce nom. Essayez « notaire » ou « fleurs ».
            </p>
          )}
        </section>

        <section className="px-5 pt-8">
          <div className="rounded-[20px] border border-dusk/12 bg-[color:var(--whisper)] px-5 py-5">
            <p className="mono-label text-dusk/55">Trois repères</p>
            <ul className="mt-3 space-y-2 text-[12.5px] leading-[1.6] text-dusk/70">
              <li>Un devis écrit, toujours, avant de signer quoi que ce soit.</li>
              <li>Vous pouvez demander à quelqu'un d'appeler à votre place.</li>
              <li>Aucune décision n'a besoin d'être prise dans l'heure, sauf le transport du corps.</li>
            </ul>
          </div>
        </section>

        <section className="px-5 pt-6">
          <Link to="/resources" search={{ space: "practical" as const }} className="block rounded-[18px] border border-dusk/12 bg-paper px-5 py-4">
            <p className="mono-label" style={{ color: "var(--terracotta)" }}>Voir tout</p>
            <p className="mt-1 font-serif text-[18px]">Annuaire démarches complet →</p>
          </Link>
        </section>
      </div>
    </Shell>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-[12px] transition-colors ${active ? "border-dusk/40 bg-[color:var(--whisper)] text-dusk" : "border-dusk/15 bg-paper text-dusk/65 hover:border-dusk/30"}`}
    >
      {children}
    </button>
  );
}
