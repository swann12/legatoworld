import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shell } from "@/components/legato/Shell";
import { LegatoMark } from "@/components/legato/LegatoMark";
import { listMyCircles, shareItem } from "@/lib/circle.functions";

export const Route = createFileRoute("/parcours/$taskId")({
  head: () => ({ meta: [{ title: "Étape — Legato" }] }),
  component: TaskDetail,
});

type TaskInfo = {
  title: string;
  why: string;
  when: string;
  infos: string[];
  docs: string[];
  questions: string[];
  budget: string;
};

const DATA: Record<string, TaskInfo> = {
  pf: {
    title: "Contacter une entreprise de pompes funèbres",
    why: "Cette étape conditionne le lieu, la date et l'organisation de la cérémonie. Sans elle, rien d'autre ne peut être planifié.",
    when: "Dans les 48 heures qui suivent le décès.",
    infos: ["Nom et date de naissance du défunt", "Lieu du décès", "Type de cérémonie souhaité", "Budget envisagé"],
    docs: ["Certificat médical de décès", "Pièce d'identité du défunt", "Livret de famille"],
    questions: ["Quels sont les devis détaillés ?", "Quels services sont inclus ?", "Quelles sont les disponibilités ?", "Acceptez-vous le paiement échelonné ?"],
    budget: "Entre 3 000 € et 7 000 € en moyenne.",
  },
};

function TaskDetail() {
  const { taskId } = Route.useParams();
  const t: TaskInfo = DATA[taskId] ?? {
    title: "Cette étape",
    why: "Cette étape fait partie de votre parcours.",
    when: "Quand vous serez prêt·e.",
    infos: [],
    docs: [],
    questions: [],
    budget: "—",
  };

  const listFn = useServerFn(listMyCircles);
  const shareFn = useServerFn(shareItem);
  const [delegating, setDelegating] = useState(false);
  const [done, setDone] = useState(false);
  const { data: circles } = useQuery({
    queryKey: ["my-circles"],
    queryFn: () => listFn({}),
    enabled: delegating,
  });

  async function delegate(circleId: string) {
    try {
      await shareFn({
        data: {
          circleId,
          kind: "task",
          title: t.title,
          status: "delegated",
          payload: { taskId, when: t.when, why: t.why },
        },
      });
      toast.success("Tâche déléguée au cercle.");
      setDelegating(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Délégation impossible.");
    }
  }

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <header className="px-6 pt-9 pb-6 flex items-center justify-between">
          <LegatoMark to="/space" size={22} />
          <Link to="/parcours" className="eyebrow hover:text-dusk">← Parcours</Link>
        </header>

        <section className="px-6 pb-9">
          <p className="eyebrow">Étape · Priorité</p>
          <h1 className="mt-5 display-xl">{t.title}.</h1>
        </section>

        <Block label="Pourquoi maintenant" body={t.why} />
        <Block label="Quand la réaliser"   body={t.when} />

        {t.infos.length > 0 && (
          <List label="Informations à préparer" items={t.infos} />
        )}
        {t.docs.length > 0 && (
          <List label="Documents utiles" items={t.docs} />
        )}
        {t.questions.length > 0 && (
          <List label="Questions à poser" items={t.questions} />
        )}

        <Block label="Budget estimé" body={t.budget} />

        <section className="px-6 pt-9">
          <p className="eyebrow">Professionnels recommandés</p>
          <Link
            to="/resources"
            search={{ space: "practical" }}
            className="mt-3 block card-plain px-5 py-4 hover:bg-dusk/[0.02]"
          >
            <p className="font-serif text-[18px] text-dusk">Voir l'annuaire</p>
            <p className="text-[12.5px] text-dusk/60 mt-1">Comparer plusieurs prestataires près de chez vous.</p>
          </Link>
        </section>

        <section className="px-5 pt-9 space-y-2.5">
          <button className="w-full card-tomato py-4 font-serif text-[20px] transition-transform active:scale-[0.99]">
            Commencer cette étape →
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setDelegating((v) => !v)}
              className="btn-ghost py-3 rounded-[14px] min-h-11"
              aria-expanded={delegating}
            >
              Déléguer
            </button>
            <button
              onClick={() => { setDone(true); toast.success("Étape marquée comme faite."); }}
              className="btn-ghost py-3 rounded-[14px] min-h-11"
            >
              {done ? "✓ Fait" : "Marquer fait"}
            </button>
          </div>
          {delegating && (
            <div className="paper-card p-4 mt-2">
              <p className="eyebrow mb-2">Choisir un cercle</p>
              {(circles?.circles?.length ?? 0) === 0 ? (
                <p className="text-[13px] text-dusk/65">
                  Aucun cercle pour l'instant. <Link to="/circle" className="underline">Créer un cercle</Link>.
                </p>
              ) : (
                <ul className="space-y-1">
                  {circles?.circles?.map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => delegate(c.id)}
                        className="w-full text-left text-[14px] text-dusk hover:bg-dusk/[0.04] rounded-[10px] px-3 py-2 min-h-11"
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button className="btn-ghost py-2.5 rounded-[14px]">Appeler</button>
            <button className="btn-ghost py-2.5 rounded-[14px]">Écrire</button>
            <button className="btn-ghost py-2.5 rounded-[14px]">RDV</button>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <section className="px-6 pt-8">
      <p className="eyebrow">{label}</p>
      <p className="mt-3 text-[15px] leading-[1.55] text-dusk/80 max-w-[40ch]">{body}</p>
    </section>
  );
}

function List({ label, items }: { label: string; items: string[] }) {
  return (
    <section className="px-6 pt-8">
      <p className="eyebrow">{label}</p>
      <ul className="mt-3 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2.5 text-[14px] text-dusk/80 leading-[1.55]">
            <span className="mt-2 size-1 rounded-full bg-dusk/40 shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}