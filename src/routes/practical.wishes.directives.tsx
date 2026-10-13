import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lead, Spec, OutlineButton } from "@/components/legato/ds";
import { SectionTitle } from "@/components/legato/AnimalPractical";
import { MaladeSheet } from "@/components/legato/MaladePractical";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/practical/wishes/directives")({
  head: () => legatoHead("Ses directives anticipées", "Ce qu'elle souhaite, ou non, pour la fin de sa vie, et des mots pour en parler."),
  component: Directives,
});

const PHRASES = [
  "« J'aimerais savoir ce qui compte pour toi, si un jour ça devient difficile. »",
  "« Le médecin nous a parlé des directives anticipées. Tu veux qu'on regarde ensemble ? »",
  "« Je ne veux pas avoir à deviner. Tu peux me dire ce que tu voudrais ? »",
];

/** B062 · Ses directives anticipées */
function Directives() {
  const [open, setOpen] = useState(false);
  return (
    <MaladeSheet back="/practical/wishes" backLabel="Ses volontés" title={<>Ses directives<br /><em>anticipées.</em></>}>
      <Lead className="mt-[10px] max-w-[320px]">Ce qu'elle souhaite, ou non, pour la fin de sa vie. C'est à elle de les écrire ; vous pouvez l'aider.</Lead>
      <Spec className="mt-7" items={[
        { label: "Valables", value: "Sans limite de durée" },
        { label: "Modifiables", value: "À tout moment" },
        { label: "À garder", value: "Chez elle, chez son médecin" },
      ]} />
      <SectionTitle className="mt-9">Pour en parler avec elle</SectionTitle>
      <div className="mt-3 p-5" style={{ background: "var(--sp-block)" }}>
        <p className="lg-title" style={{ fontSize: 22 }}>Des mots pour commencer</p>
        <p className="mt-1 text-[14px]" style={{ color: "var(--sp-sub)" }}>Sans urgence, quand elle est prête.</p>
        {open && <ul className="mt-4 space-y-3">{PHRASES.map((p) => <li key={p} style={{ fontFamily: "var(--lg-serif)", fontSize: 18 }}>{p}</li>)}</ul>}
        <div className="mt-4"><OutlineButton onClick={() => setOpen((o) => !o)}>{open ? "Masquer" : "Voir des phrases"}</OutlineButton></div>
      </div>
    </MaladeSheet>
  );
}
