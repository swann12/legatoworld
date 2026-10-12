import { createFileRoute } from "@tanstack/react-router";
import { StandardLayout, PageTitle, Lead, Columns, PrimaryButton, TextLink } from "@/components/legato/ds";
import { useDemarches, dueDate, dayName, inWords, BUCKETS, BUCKET_LABEL } from "@/lib/demarches";

export const Route = createFileRoute("/practical/progress")({
  head: () => ({
    meta: [
      { title: "Mon avancement — Legato" },
      { name: "description", content: "Ce qui est fait, semaine par semaine, sans pression." },
      { property: "og:title", content: "Mon avancement — Legato" },
      { property: "og:description", content: "Vous avancez, à votre rythme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Progress,
});

function Progress() {
  const { by, isDone, done, total, next, open } = useDemarches();
  const pct = total ? done / total : 0;
  const soonest = open.map(dueDate).filter((x): x is Date => !!x).sort((a, b) => +a - +b)[0];
  const lead = `${inWords(done)} démarche${done > 1 ? "s" : ""} faite${done > 1 ? "s" : ""} sur ${inWords(total).toLowerCase()}.` +
    (soonest ? ` Rien ne presse avant ${dayName(soonest)}.` : " Rien ne presse.");

  return (
    <StandardLayout space="practical" back="/practical" backLabel="Démarches" activeTab="/practical">
      <PageTitle space="practical" className="pt-8">Vous avancez,<br /><em>à votre rythme.</em></PageTitle>
      <Lead space="practical" className="mt-4">{lead}</Lead>

      <div className="mt-8 h-14 w-full overflow-hidden rounded-full" style={{ background: "var(--lg-linen)" }}
        role="progressbar" aria-valuenow={done} aria-valuemax={total} aria-label="Démarches faites">
        <div className="flex h-full items-center rounded-full pl-5"
          style={{ width: `max(${Math.round(pct * 100)}%, 92px)`, background: "var(--sp-fill)", color: "var(--lg-cream)", fontFamily: "var(--lg-serif)" }}>
          <span style={{ fontSize: 24 }}>{done}</span><span className="ml-1" style={{ fontSize: 15 }}>/ {total}</span>
        </div>
      </div>

      <Columns space="practical" className="mt-7" items={BUCKETS.map((b) => {
        const list = by(b).all;
        return { label: BUCKET_LABEL[b], value: `${list.filter(isDone).length} sur ${list.length}` };
      })} />

      <div className="mt-8 flex flex-col items-start gap-6">
        {next && <PrimaryButton space="practical" to={`/practical/tasks/${next.id}`}>Ouvrir la prochaine démarche</PrimaryButton>}
        {next && <TextLink space="practical" to={`/practical/share/${next.id}`}>Confier une démarche à un proche</TextLink>}
      </div>
    </StandardLayout>
  );
}
