import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageTitle, Lead, PrimaryButton, TextLink, OutlineButton } from "@/components/legato/ds";
import { RitualsLayout, NumberedSteps } from "@/components/legato/RitualsUI";
import { addMyRitual } from "@/lib/my-rituals";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/cercle")({
  head: () => legatoHead("Un cercle de parole", "Chacun partage un souvenir, Legato guide le cercle pas à pas."),
  component: Cercle,
});

/** B099 · Cercle de parole, avec un guide pas à pas sur place */
function Cercle() {
  const [turn, setTurn] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);
  if (turn !== null) return (
    <RitualsLayout>
      <p className="lg-mono pt-8">{ended ? "Pour finir" : `Tour ${turn + 1}`}</p>
      <PageTitle className="mt-3">{ended ? <>Une minute<br /><em>de silence, ensemble.</em></> : turn === 0 ? <>Qui veut<br /><em>commencer ?</em></> : <>À qui<br /><em>le tour ?</em></>}</PageTitle>
      <Lead className="mt-3">{ended ? "Ou allumez une bougie. Merci à chacun d'avoir partagé." : "Partagez un souvenir d'elle. On peut aussi passer son tour : le silence est accepté."}</Lead>
      {ended ? <div className="mt-8"><PrimaryButton onClick={() => { addMyRitual({ title: "Un cercle de parole", date: new Date().toISOString().slice(0, 10), sub: "À plusieurs", done: true }); setTurn(null); setEnded(false); }}>Terminer le cercle</PrimaryButton></div>
        : <div className="mt-8 flex flex-wrap items-center gap-4"><PrimaryButton onClick={() => setTurn(turn + 1)}>Au suivant</PrimaryButton><OutlineButton onClick={() => setTurn(turn + 1)}>Passer son tour</OutlineButton><TextLink onClick={() => setEnded(true)}>Tout le monde a parlé</TextLink></div>}
    </RitualsLayout>
  );
  return (
    <RitualsLayout>
      <PageTitle className="pt-8">Un cercle<br /><em>de parole.</em></PageTitle>
      <Lead className="mt-3">Réunis, chacun partage un souvenir. Legato vous guide pas à pas, pour que personne n'ait à animer.</Lead>
      <NumberedSteps title="Comment ça se passe" items={["Chacun parle à son tour, dans l'ordre qu'il veut.", "Le silence est accepté : on peut passer son tour.", "On termine ensemble, par une bougie ou une minute de silence."]} />
      <div className="mt-8"><PrimaryButton onClick={() => setTurn(0)}>Lancer le cercle</PrimaryButton></div>
      <div className="mt-5"><TextLink to="/care/rituels/organiser" search={{ rituel: "cercle" }}>Prévoir une date</TextLink></div>
    </RitualsLayout>
  );
}
