import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, Lead, SectionLabel, Row, TextLink } from "@/components/legato/ds";
import { useAppointments, updateAppointment, removeAppointment, fmtWhen, type Appointment } from "@/lib/appointments-store";

export const Route = createFileRoute("/appointments/$id")({
  head: () => ({
    meta: [
      { title: "Un rendez-vous — Legato" },
      { name: "description", content: "Le détail d'un rendez-vous, et que faire si ce jour-là c'est trop dur." },
      { property: "og:title", content: "Un rendez-vous — Legato" },
      { property: "og:description", content: "Si ce jour-là c'est trop dur, plusieurs solutions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Detail,
});

function counts(a: Appointment): { label: string; text: string } {
  if (a.importance === "maintenir") {
    return { label: "Ce rendez-vous compte", text: /succession/i.test(a.what ?? "")
      ? "Mieux vaut le garder : la succession doit être déclarée dans les six mois."
      : "Mieux vaut le garder. Si c'est dur, vous pouvez y aller accompagné ou le faire en visio." };
  }
  if (a.importance === "reporter") return { label: "Il peut attendre", text: "Vous pouvez le décaler sans vous justifier. Un message est prêt pour cela." };
  return { label: "Il peut être annulé", text: "Sans conséquence. Vous pouvez le retirer si vous n'en avez pas la force." };
}

async function shareText(text: string) {
  if (navigator.share) { try { await navigator.share({ text }); return true; } catch { return false; } }
  await navigator.clipboard?.writeText(text);
  return true;
}

function Detail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const list = useAppointments();
  const [note, setNote] = useState("");
  const a = list?.find((x) => x.id === id);

  if (!list) return <StandardLayout space="support" back="/appointments" backLabel="Vos rendez-vous" activeTab="/care"><div /></StandardLayout>;
  if (!a) return <StandardLayout space="support" back="/appointments" backLabel="Vos rendez-vous" activeTab="/care"><p className="mt-12">Ce rendez-vous n'existe plus.</p></StandardLayout>;

  const w = fmtWhen(a.date);
  const [name, ...rest] = a.who.split(",");
  const c = counts(a);

  const accompany = async () => {
    const ok = await shareText(`Le ${w.full.toLowerCase()}, j'ai rendez-vous avec ${a.who}${a.place ? `, ${a.place}` : ""}. Pourrais-tu m'accompagner ?`);
    if (ok) { updateAppointment(a.id, { withSomeone: true }); setNote("Message prêt : envoyez-le à la personne de votre choix."); }
  };
  const visio = async () => {
    await shareText(`Bonjour, serait-il possible de faire notre rendez-vous du ${w.full.toLowerCase()} en visio ? Merci.`);
    updateAppointment(a.id, { visio: true });
    setNote("Message prêt pour demander la visio.");
  };
  const shift = async () => {
    const d = new Date(a.date); d.setDate(d.getDate() + 7);
    await shareText(`Bonjour, je traverse un deuil et je dois décaler notre rendez-vous du ${w.full.toLowerCase()}. Le ${fmtWhen(d.toISOString()).full.toLowerCase()} vous conviendrait-il ? Merci.`);
    updateAppointment(a.id, { date: d.toISOString() });
    setNote("Décalé d'une semaine. Un message est prêt pour prévenir.");
  };

  return (
    <StandardLayout space="support" back="/appointments" backLabel="Vos rendez-vous" activeTab="/care">
      <p className="lg-mono mt-10">{w.day} · {w.hour}</p>
      <PageTitle space="support" className="mt-3">{name}{rest.length ? "," : "."}{rest.length > 0 && <><br /><em>{rest.join(",").trim()}.</em></>}</PageTitle>
      <Lead space="support" className="mt-4">{[a.what && `Pour ${a.what}`, a.place].filter(Boolean).join(", ") || "Rendez-vous noté."}{a.visio ? " · en visio" : ""}</Lead>
      <section className="mt-7 p-6" style={{ background: "var(--sp-block)" }}>
        <p className="lg-section">{c.label} —</p>
        <p className="mt-3 text-[14.5px] leading-[1.55]">{c.text}</p>
      </section>
      <SectionLabel space="support" className="mt-9">Si ce jour-là c'est trop dur</SectionLabel>
      <div className="mt-1">
        <Row space="support" title="Y aller accompagné" subtitle={a.withSomeone ? "Demande envoyée à un proche" : "Demander à un proche de venir avec vous"} onClick={accompany} />
        <Row space="support" title="Le faire en visio" onClick={visio} />
        <Row space="support" title="Le décaler d'une semaine" onClick={shift} last />
      </div>
      {note && <p className="mt-4 text-[13.5px]" style={{ color: "var(--sp-sub)" }}>{note}</p>}
      <TextLink space="support" className="mt-8 inline-block" onClick={() => { removeAppointment(a.id); navigate({ to: "/appointments" }); }}>Retirer ce rendez-vous</TextLink>
    </StandardLayout>
  );
}
