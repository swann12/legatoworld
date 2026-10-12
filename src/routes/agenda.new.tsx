import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useSpaces } from "@/lib/spaces-store";
import { useActiveSpaceId } from "@/lib/active-space";
import { setDateReminder, type Reminder } from "@/lib/today";
import { StandardLayout, PageTitle, Field, PrimaryButton } from "@/components/legato/ds";

export const Route = createFileRoute("/agenda/new")({
  head: () => ({
    meta: [
      { title: "Ajouter une date — Legato" },
      { name: "description", content: "Ajouter une date importante et choisir quand vous la rappeler." },
      { property: "og:title", content: "Ajouter une date — Legato" },
      { property: "og:description", content: "Une date importante, rappelée quand vous le souhaitez." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewDate,
});

const REMINDERS: { id: Reminder; label: string }[] = [
  { id: "non", label: "Non" },
  { id: "semaine", label: "Une semaine avant" },
  { id: "veille", label: "La veille" },
];

/** 016 · Ajouter une date */
function NewDate() {
  const navigate = useNavigate();
  const { spaces, addSpace, addDate } = useSpaces();
  const activeId = useActiveSpaceId();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [reminder, setReminder] = useState<Reminder>("semaine");

  const save = () => {
    if (!title.trim() || !date) return;
    const space = spaces.find((s) => s.id === activeId) ?? spaces.find((s) => !s.archived) ?? addSpace({ name: "Mon proche" });
    addDate(space.id, title, date);
    setDateReminder(`${space.id}:${title.trim()}:${date}`, reminder);
    toast.success("Date enregistrée.");
    navigate({ to: "/agenda" });
  };

  return (
    <StandardLayout back="/agenda" backLabel="Les jours qui viennent">
      <PageTitle className="pt-8">Ajouter<br /><em>une date.</em></PageTitle>
      <Field className="mt-8" label="Quelle date" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Son anniversaire" />
      <Field className="mt-6" label="Le · chaque année" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <p className="lg-mono mt-6">Vous le rappeler</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {REMINDERS.map((r) => {
          const on = reminder === r.id;
          return (
            <button key={r.id} type="button" onClick={() => setReminder(r.id)} aria-pressed={on}
              className="h-10 rounded-full px-4 text-[14.5px]"
              style={{ background: on ? "var(--lg-mint)" : "transparent", border: on ? "1px solid var(--lg-mint)" : "1px solid var(--sp-line-2)", color: "var(--sp-ink)" }}>
              {r.label}
            </button>
          );
        })}
      </div>
      <p className="mt-6 px-5 py-4 text-[14px] leading-[1.5]" style={{ background: "var(--sp-block)" }}>
        Pour une date difficile, Legato vous proposera aussi de ne pas la passer seul.
      </p>
      <div className="mt-6"><PrimaryButton onClick={save} disabled={!title.trim() || !date}>Enregistrer</PrimaryButton></div>
    </StandardLayout>
  );
}
