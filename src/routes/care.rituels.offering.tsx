import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { QuestionLayout, PageHeader, PageTitle, Lead, OptionCard, PrimaryButton, TextArea } from "@/components/legato/ds";
import { addMemory } from "@/lib/memories-store";
import { legatoHead } from "@/lib/legato-head";
export const Route = createFileRoute("/care/rituels/offering")({ head: () => legatoHead("Une offrande", "Un petit geste à déposer dans son jardin de souvenirs."), component: Offering });
const OPTIONS = [{ label: "Une fleur", hint: "Choisie parmi ses préférées" }, { label: "Un objet", hint: "Une photo de quelque chose qui lui ressemble" }, { label: "Quelques mots", hint: "Une phrase, juste pour elle" }];
function Offering() {
  const [choice, setChoice] = useState(""); const [words, setWords] = useState(""); const [error, setError] = useState(""); const navigate = useNavigate();
  const save = () => { try { addMemory({ zone: "lettres", type: "text", title: choice, body: words.trim() || choice }); navigate({ to: "/care/garden/space" }); } catch (e) { setError(e instanceof Error ? e.message : "Ce geste n’a pas pu être gardé."); } };
  return <QuestionLayout space="memory" step={1} total={1} header={<PageHeader space="memory" back="/care/rituels" backLabel="Un geste pour elle" help={false} />} footer={<PrimaryButton space="memory" full disabled={!choice} onClick={save}>Déposer dans son jardin</PrimaryButton>}>
    <PageTitle size={30}>Que voulez-vous<br /><em>déposer pour elle ?</em></PageTitle><Lead className="mt-3">Elle restera visible dans son jardin de souvenirs.</Lead>
    <div className="mt-6 space-y-3">{OPTIONS.map(o => <OptionCard key={o.label} label={o.label} hint={o.hint} selected={choice === o.label} onClick={() => setChoice(o.label)} />)}</div>
    {choice && <TextArea className="mt-6" label={choice === "Quelques mots" ? "Vos mots" : "Ce que vous souhaitez déposer"} value={words} onChange={e => setWords(e.target.value)} />}{error && <p role="alert" className="mt-4">{error}</p>}
  </QuestionLayout>;
}