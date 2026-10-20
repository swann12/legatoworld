import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, PageTitle, PrimaryButton, TextLink } from "@/components/legato/ds";
import { Chip, Quote } from "@/components/legato/SoutienUI";
import { useSavedToast } from "@/components/legato/ActionFeedback";
import { legatoHead } from "@/lib/legato-head";
import { useLegato } from "@/lib/legato-state";
import { useSoutien } from "@/lib/soutien";

type Search = { pour?: "responsable" | "collegues" };

/** D060 · so-travail-message : un message pour les collègues */
export const Route = createFileRoute("/care/travail/message")({
  validateSearch: (s: Record<string, unknown>): Search => ({ pour: s.pour === "responsable" ? "responsable" : s.pour === "collegues" ? "collegues" : undefined }),
  head: () => legatoHead("Un message pour vos collègues", "Choisir ce que vous voulez dire, ou ne pas dire, en reprenant le travail."),
  component: Message,
});

const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

function Message() {
  const { pour } = Route.useSearch();
  const { name } = useLegato();
  const { s } = useSoutien();
  const { show, toast } = useSavedToast();
  const [merci, setMerci] = useState(true);
  const [parler, setParler] = useState<"non" | "oui">("non");

  const day = s.workDate ? DAYS[new Date(s.workDate + "T12:00:00").getDay()] : "bientôt";
  const parts = [
    pour === "responsable" ? `Bonjour, je vous confirme ma reprise ${day}.` : `Je reprends ${day}.`,
    merci ? "Merci pour vos messages, ils m'ont touché." : "",
    parler === "non" ? "Je préfère qu'on n'en parle pas au bureau pour l'instant." : "Vous pouvez m'en parler, si vous voulez.",
    name.trim(),
  ].filter(Boolean);
  const text = parts.join(" ");

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); show("Message copié."); } catch { show("La copie n'a pas fonctionné."); }
  };

  return (
    <StandardLayout space="support" back="/care/travail" backLabel="Reprendre le travail" activeTab="/care">
      <PageTitle space="support" size={36} className="pt-[22px]">Un message<br /><em>pour vos collègues.</em></PageTitle>
      <div className="pt-5">
        <Chip on={merci} onClick={() => setMerci(!merci)}>Merci pour vos messages</Chip>
        <Chip on={parler === "non"} onClick={() => setParler("non")}>Je préfère qu'on n'en parle pas au bureau</Chip>
        <Chip on={parler === "oui"} onClick={() => setParler("oui")}>Vous pouvez m'en parler, si vous voulez</Chip>
      </div>
      <Quote>« {text} »</Quote>
      <div className="flex flex-wrap items-center gap-[22px] pt-5">
        <PrimaryButton space="support" onClick={copy}>Copier le message</PrimaryButton>
        <TextLink space="support" onClick={() => { window.location.href = `mailto:?body=${encodeURIComponent(text)}`; }}>L'envoyer par e-mail</TextLink>
      </div>
      {toast}
    </StandardLayout>
  );
}
