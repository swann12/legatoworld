import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ExperienceLayout, ExperienceButton, TextLink } from "@/components/legato/ds";
import { legatoHead } from "@/lib/legato-head";

export const Route = createFileRoute("/care/rituels/lettre")({
  head: () => legatoHead("Une lettre, puis la laisser partir", "Écrire ce qui n'a pas été dit, puis laisser partir la lettre. Personne ne la lira."),
  component: Lettre,
});

/** B097 · La lettre, plein écran. Le texte n'est jamais enregistré. */
function Lettre() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [leaving, setLeaving] = useState(false);
  const release = () => { setLeaving(true); window.setTimeout(() => navigate({ to: "/care/rituels/fait", search: { geste: "lettre" } }), 1400); };
  return (
    <ExperienceLayout variant="memory" back="/care/rituels" backLabel="Rituels" close="/care/rituels" top={<>
      <h1 className="lg-title text-[36px]">Une lettre,<br /><em>puis la laisser partir.</em></h1>
      <p className="mt-3 text-[14px]">Écrivez ce qui n'a pas été dit. Personne ne la lira.</p>
    </>} action={<div className="flex w-full flex-col items-center gap-4">
      <ExperienceButton onClick={release} disabled={!text.trim() || leaving}>Laisser partir la lettre</ExperienceButton>
      <p className="text-center text-[12.5px]">Vous pouvez aussi l'<TextLink space="memory" onClick={() => window.print()}>imprimer</TextLink> et la brûler dehors, en sécurité.</p>
    </div>}>
      <textarea aria-label="Votre lettre" value={text} onChange={(e) => setText(e.target.value)} placeholder="Je voulais te dire…" rows={9}
        className="w-full resize-none bg-transparent outline-none placeholder:opacity-60"
        style={{ fontFamily: "var(--lg-serif)", fontSize: 21, lineHeight: 1.45, transition: "opacity 1.3s, transform 1.3s", opacity: leaving ? 0 : 1, transform: leaving ? "translateY(-40px)" : "none" }} />
    </ExperienceLayout>
  );
}
