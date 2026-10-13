import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { StandardLayout, QuestionLayout, PageHeader, PageTitle, Lead, Row, PrimaryButton, TextLink, OptionCard, TextArea, Field } from "@/components/legato/ds";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLegato } from "@/lib/legato-state";
import { legatoHead } from "@/lib/legato-head";
import { Step10Extras } from "@/components/legato/Step10Extras";
import { LegacyWishesPage } from "@/components/legato/legacy/Step10WishesPage";

const VIEWS = ["obseques", "don", "messages", "prevenir"] as const;
type View = typeof VIEWS[number];
const OPTIONS = [
  { id: "cremation", label: "Crémation", hint: "Les cendres dispersées en mer" },
  { id: "inhumation", label: "Inhumation", hint: "Dans le caveau familial" },
  { id: "inconnu", label: "Je ne sais pas encore", hint: "Les proches choisiront" },
];
export const Route = createFileRoute("/practical/wishes")({
  validateSearch: (s: Record<string, unknown>): { view?: View } => ({ view: VIEWS.find(v => v === s.view) }),
  head: ({ match }) => legatoHead(match.search.view === "obseques" ? "Volontés · obsèques" : match.search.view === "don" ? "Volontés · don" : match.search.view === "messages" ? "Volontés · messages" : match.search.view === "prevenir" ? "Volontés · qui prévenir" : "Ses volontés, ou les vôtres", "Conserver les souhaits et les messages qui comptent, et décider soi-même de leur partage."),
  component: WishesPage,
});
function WishesPage() {
  const { view } = Route.useSearch();
  const navigate = useNavigate();
  const { wishes, setWishes } = useLegato();
  const [trustOpen, setTrustOpen] = useState(false);
  const [trust, setTrust] = useState("");
  const [notice, setNotice] = useState("");
  const go = (next?: View) => navigate({ to: "/practical/wishes", search: { view: next } });
  const step = view ? VIEWS.indexOf(view) + 1 : 0;
  const continueFlow = () => go(VIEWS[step]);
  const choice = wishes.funeralChoice ?? OPTIONS.find(o => wishes.ceremony.toLocaleLowerCase().includes(o.label.toLocaleLowerCase()))?.id;
  if (view) return <div className="lg-wishes-question"><QuestionLayout space="practical" step={step} total={4}
    header={<PageHeader space="practical" back="/practical/wishes" backLabel="Volontés" help={false} />}
    footer={<div className="flex flex-col items-center gap-4"><PrimaryButton space="practical" full onClick={continueFlow}>Continuer</PrimaryButton><TextLink space="practical" onClick={continueFlow}>Passer cette étape</TextLink></div>}>
    {view === "obseques" ? <>
      <PageTitle space="practical">Pour <em>les obsèques.</em></PageTitle>
      <Lead space="practical" className="mt-3">Ce que vous souhaitez, ou ce qu'elle avait exprimé.</Lead>
      <div className="mt-[26px] space-y-[10px]">{OPTIONS.map(option => <OptionCard key={option.id} space="practical" label={option.label} hint={option.hint} selected={choice === option.id} onClick={() => setWishes({ funeralChoice: option.id, ceremony: option.label })} />)}</div>
      <TextArea space="practical" className="mt-6" label="Un souhait de plus · facultatif" rows={1} placeholder="Une chanson, un lieu, une couleur…" value={wishes.funeralExtra ?? ""} onChange={e => setWishes({ funeralExtra: e.target.value })} />
    </> : view === "don" ? <>
      <PageTitle space="practical">Don d'organes<br /><em>et du corps.</em></PageTitle>
      <Lead space="practical" className="mt-3">Ce qui a été exprimé, avec vos mots.</Lead>
      <TextArea space="practical" className="mt-7" label="Ses souhaits, ou les vôtres" value={wishes.donation ?? ""} onChange={e => setWishes({ donation: e.target.value })} />
    </> : view === "messages" ? <>
      <PageTitle space="practical">Des messages<br /><em>à transmettre.</em></PageTitle>
      <Lead space="practical" className="mt-3">Lettres pour des proches.</Lead>
      <TextArea space="practical" className="mt-7" label="Un mot pour les proches" rows={8} value={wishes.toLovedOnes} onChange={e => setWishes({ toLovedOnes: e.target.value })} />
    </> : <>
      <PageTitle space="practical">Qui <em>prévenir.</em></PageTitle>
      <Lead space="practical" className="mt-3">Une liste de personnes.</Lead>
      <TextArea space="practical" className="mt-7" label="Noms et coordonnées" rows={8} value={wishes.notify ?? ""} onChange={e => setWishes({ notify: e.target.value })} />
    </>}
  </QuestionLayout></div>;
  const saveTrust = () => {
    const person = trust.trim(); if (!person) return;
    setWishes({ trustedPerson: person }); setTrustOpen(false);
    setNotice("Personne enregistrée sur cet appareil. Aucun accès ni message n’a été envoyé.");
  };
  return <StandardLayout space="practical" back="/practical/vault" backLabel="Mes documents" activeTab="/practical">
    <PageTitle space="practical" className="mt-[30px]">Ses volontés,<br /><em>ou les vôtres.</em></PageTitle>
    <Lead space="practical" className="mt-3">Rangées au même endroit, partagées seulement si vous le décidez.</Lead>
    <div className="mt-[14px]">
      <Row space="practical" n={1} title="Obsèques" subtitle="Inhumation, crémation, cérémonie" onClick={() => go("obseques")} />
      <Row space="practical" n={2} title="Don d'organes et du corps" subtitle="Ce qui a été exprimé" onClick={() => go("don")} />
      <Row space="practical" n={3} title="Messages à transmettre" subtitle="Lettres pour des proches" onClick={() => go("messages")} />
      <Row space="practical" n={4} title="Qui prévenir" subtitle="Une liste de personnes" onClick={() => go("prevenir")} last />
    </div>
    <div className="lg-step10-note mt-7"><p>Vous pouvez désigner une personne de confiance qui y aura accès.</p><div className="mt-4"><PrimaryButton space="practical" onClick={() => { setTrust(wishes.trustedPerson ?? ""); setTrustOpen(true); }}>{wishes.trustedPerson ? "Changer cette personne" : "Choisir cette personne"}</PrimaryButton></div>{wishes.trustedPerson && <p className="lg-row-sub mt-3">{wishes.trustedPerson}</p>}<p className="lg-row-sub mt-3">La désignation est conservée ici ; elle n’ouvre pas d’accès à distance.</p></div>
    {notice && <p role="status" className="lg-row-sub mt-3">{notice}</p>}
    <Step10Extras><LegacyWishesPage /></Step10Extras>
    <Dialog open={trustOpen} onOpenChange={setTrustOpen}><DialogContent className="lg-space-practical lg-step10-dialog"><DialogTitle>Personne de confiance</DialogTitle><DialogDescription>Enregistrer un nom ne lui donne pas accès à vos volontés et ne lui envoie aucun message.</DialogDescription><Field space="practical" label="Prénom ou courriel" value={trust} onChange={e => setTrust(e.target.value)} /><PrimaryButton space="practical" onClick={saveTrust} disabled={!trust.trim()}>Enregistrer cette personne</PrimaryButton></DialogContent></Dialog>
  </StandardLayout>;
}
