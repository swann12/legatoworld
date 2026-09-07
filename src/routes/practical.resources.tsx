import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/legato/Shell";
import { PageHeader } from "@/components/legato/EditorialUI";

export const Route = createFileRoute("/practical/resources")({
  head: () => ({
    meta: [
      { title: "Repères — Démarches Legato" },
      { name: "description", content: "Succession, banque, assurance, employeur, logement, organismes, cérémonie, documents : ce qu'il faut savoir, en clair." },
      { property: "og:title", content: "Repères — Démarches Legato" },
      { property: "og:description", content: "Ce qu'il faut savoir pour chaque démarche, expliqué simplement." },
    ],
  }),
  component: PracticalResources,
});

type Topic = { label: string; body: string; to: string; task?: string; cta: string; bg: string };

const TOPICS: Topic[] = [
  {
    label: "Succession",
    body: "Le notaire n'est obligatoire qu'au-delà de certains montants ou s'il y a un bien immobilier. Le premier rendez-vous sert surtout à faire le point.",
    to: "/practical/pros", cta: "Trouver un notaire", bg: "var(--whisper)",
  },
  {
    label: "Banque",
    body: "Les comptes personnels sont bloqués dès l'annonce. Les frais d'obsèques peuvent souvent être réglés depuis le compte du défunt, sur facture.",
    to: "/practical/tasks/$id", task: "finances", cta: "Ouvrir la démarche Banque", bg: "var(--sun)",
  },
  {
    label: "Assurances",
    body: "Prévenez l'assurance habitation, l'auto et la mutuelle. Vérifiez s'il existait un contrat obsèques ou une assurance décès liée à un prêt.",
    to: "/practical/tasks/$id", task: "letters", cta: "Ouvrir les courriers de résiliation", bg: "var(--whisper)",
  },
  {
    label: "Employeur",
    body: "L'employeur ou la caisse de retraite doit être prévenu rapidement. Vous pouvez aussi demander vos jours d'absence pour deuil.",
    to: "/practical/tasks/$id", task: "first", cta: "Ouvrir les premières démarches", bg: "var(--blush)",
  },
  {
    label: "Logement",
    body: "Bail, loyer, énergie, box internet : tout se résilie sur présentation de l'acte de décès. Rien ne presse pour le tri des affaires.",
    to: "/practical/tasks/$id", task: "housing", cta: "Ouvrir la démarche Logement", bg: "var(--whisper)",
  },
  {
    label: "Organismes",
    body: "CAF, CPAM, retraite, impôts : chacun demande un acte de décès. Des aides existent (capital décès, allocation veuvage).",
    to: "/practical/tasks/$id", task: "rights", cta: "Ouvrir la démarche Aides & droits", bg: "var(--sage)",
  },
  {
    label: "Cérémonie",
    body: "Lieu, déroulé, textes, musiques, fleurs. Demandez toujours un devis écrit, poste par poste, et ne signez pas le jour même.",
    to: "/practical/ceremony", cta: "Préparer la cérémonie", bg: "var(--peach)",
  },
  {
    label: "Documents",
    body: "Demandez plusieurs copies de l'acte de décès dès la mairie : presque chaque organisme en réclame une.",
    to: "/practical/vault", cta: "Ouvrir le coffre", bg: "var(--whisper)",
  },
];

function PracticalResources() {
  return (
    <Shell livingBg={false}>
      <div className="min-h-dvh bg-paper text-dusk pb-32">
        <PageHeader title="REPÈRES" back="/practical" />

        <section className="px-6 pt-2">
          <h1 className="ed-page-title text-[30px]">
            Comprendre <span className="italic" style={{ color: "var(--terracotta)" }}>avant d'agir</span>.
          </h1>
          <p className="mt-4 text-[13px] leading-[1.6] text-dusk/60 max-w-[34ch]">
            L'essentiel de chaque démarche, en quelques lignes.
          </p>
        </section>

        <div className="px-5 pt-8 flex flex-col gap-3">
          {TOPICS.map((t) => (
            <article key={t.label} className="rounded-[18px] px-5 py-5" style={{ background: t.bg }}>
              <p className="mono-label">{t.label}</p>
              <p className="mt-3 text-[13.5px] leading-[1.6] text-dusk/80">{t.body}</p>
              <Link
                to={t.to as "/practical"}
                params={t.task ? ({ id: t.task } as never) : undefined}
                className="mt-4 inline-block text-[12px] underline underline-offset-4 text-dusk/65 hover:text-dusk"
              >
                {t.cta} →
              </Link>
            </article>
          ))}
        </div>

        <div className="pt-10" />
      </div>
    </Shell>
  );
}
