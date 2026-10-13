import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PageTitle, Lead, PrimaryButton, Field } from "@/components/legato/ds";
import { RitualsLayout } from "@/components/legato/RitualsUI";
import { useMemoryPerson } from "@/components/legato/MemoryUI";
import { findGesture } from "@/lib/rituals-catalog";
import { addMyRitual } from "@/lib/my-rituals";
import { getDiscovery } from "@/lib/discovery";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/organiser")({
  validateSearch: z.object({ rituel: z.string().optional() }),
  head: () => legatoHead("Organiser un rituel à plusieurs", "Choisir la date, le lieu et les proches, puis envoyer l'invitation."),
  component: Organiser,
});

/** B098 · Organiser à plusieurs */
function Organiser() {
  const navigate = useNavigate();
  const { rituel } = Route.useSearch();
  const { name } = useMemoryPerson();
  const g = findGesture(rituel ?? "repas") ?? findGesture("repas")!;
  const [date, setDate] = useState(""); const [time, setTime] = useState("19:00");
  const [where, setWhere] = useState(""); const [who, setWho] = useState("");
  const isMeal = g.id === "repas";

  const send = async () => {
    if (!date) return;
    if (getDiscovery().active) { navigate({ to: "/start/compte-requis" }); return; }
    const when = new Date(`${date}T${time || "12:00"}`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    const msg = `${g.title}, en mémoire de ${name}.\n${when}${time ? `, ${time.replace(":", " h ")}` : ""}${where ? ` · ${where}` : ""}.\n${isMeal ? `Apporte un plat qu'${name} aimait et un souvenir à raconter.` : "Je serais heureux que tu sois là."}`;
    const guests = who.split(",").map((s) => s.trim()).filter(Boolean);
    addMyRitual({ title: g.title, date, sub: [where, guests.length ? `${guests.length} proche${guests.length > 1 ? "s" : ""} invité${guests.length > 1 ? "s" : ""}` : ""].filter(Boolean).join(" · "), done: false });
    try {
      if (navigator.share) await navigator.share({ title: g.title, text: msg });
      else { await navigator.clipboard.writeText(msg); toast.success("Invitation copiée : collez-la dans un message."); }
    } catch { /* partage annulé : le rituel reste prévu */ }
    navigate({ to: "/care/rituels/mes-rituels" });
  };

  const [a, ...b] = g.title.split(" ");
  return (
    <RitualsLayout back={isMeal ? "/care/rituels/ensemble" : "/care/rituels"} backLabel={g.title}>
      <PageTitle className="pt-8">{a} {b.join(" ")},<br /><em>à plusieurs.</em></PageTitle>
      <Lead className="mt-3">{isMeal ? "Se réunir pour manger et raconter la personne. Chacun apporte un plat et un souvenir." : g.text}</Lead>
      <div className="mt-7 flex flex-col gap-5">
        <div className="flex gap-4"><Field className="flex-1" label="Quand" type="date" value={date} onChange={(e) => setDate(e.target.value)} /><Field className="w-28" label="Heure" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
        <Field label="Où" placeholder="Chez Claire" value={where} onChange={(e) => setWhere(e.target.value)} maxLength={80} />
        <Field label="Avec" placeholder="Claire, Paul, Jeanne" value={who} onChange={(e) => setWho(e.target.value)} maxLength={160} />
      </div>
      {isMeal && <Lead className="mt-5">Le message demandera à chacun d'apporter un plat qu'elle aimait et un souvenir à raconter.</Lead>}
      <div className="mt-8"><PrimaryButton onClick={() => void send()} disabled={!date}>Envoyer l'invitation</PrimaryButton></div>
    </RitualsLayout>
  );
}
