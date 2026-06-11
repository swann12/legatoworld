import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { SpaceHeader } from "@/components/legato/SpaceHeader";

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

  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <SpaceHeader space="organize" />

        <div className="px-7 pt-6">
          <Link
            to="/parcours"
            className="text-[11px] uppercase tracking-[0.22em] text-dusk/55 hover:text-dusk"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ← Retour au parcours
          </Link>
        </div>

        <section className="px-7 pt-8">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Étape · Priorité
          </p>
          <h1 className="mt-3 font-serif text-[30px] leading-[1.1] font-light text-balance">
            {t.title}
          </h1>
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

        <section className="px-7 pt-8">
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Professionnels recommandés
          </p>
          <Link
            to="/resources"
            className="mt-3 block rounded-[16px] border border-dusk/12 px-5 py-4 hover:bg-dusk/[0.03]"
          >
            <p className="font-serif text-[17px] text-dusk">Voir l'annuaire</p>
            <p className="text-[12.5px] text-dusk/60 mt-1">Comparer plusieurs prestataires près de chez vous.</p>
          </Link>
        </section>

        <section className="px-5 pt-10 space-y-2.5">
          <button
            className="w-full rounded-[16px] py-4 font-serif text-[18px]"
            style={{ background: "var(--terracotta)", color: "var(--paper)" }}
          >
            Commencer cette étape
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button className="rounded-[14px] border border-dusk/15 py-3 font-serif text-[15px]">
              Déléguer
            </button>
            <button className="rounded-[14px] border border-dusk/15 py-3 font-serif text-[15px]">
              Marquer terminée
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button className="rounded-[14px] border border-dusk/12 py-2.5 text-[12px] uppercase tracking-[0.18em] text-dusk/70"
              style={{ fontFamily: "var(--font-mono)" }}>Appeler</button>
            <button className="rounded-[14px] border border-dusk/12 py-2.5 text-[12px] uppercase tracking-[0.18em] text-dusk/70"
              style={{ fontFamily: "var(--font-mono)" }}>Écrire</button>
            <button className="rounded-[14px] border border-dusk/12 py-2.5 text-[12px] uppercase tracking-[0.18em] text-dusk/70"
              style={{ fontFamily: "var(--font-mono)" }}>RDV</button>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <section className="px-7 pt-8">
      <p
        className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </p>
      <p className="mt-2 text-[14.5px] leading-[1.6] text-dusk/80 max-w-[40ch]">{body}</p>
    </section>
  );
}

function List({ label, items }: { label: string; items: string[] }) {
  return (
    <section className="px-7 pt-8">
      <p
        className="text-[10px] uppercase tracking-[0.28em] text-dusk/50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </p>
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