import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";
import { spaceClass, type Space } from "./space";
import { PageHeader, StepBar } from "./components";
import { BottomNav } from "./BottomNav";

/** Écran standard (§4.1) : en-tête 64 px + barre flottante. */
export function StandardLayout({ space = "today", title, back, backLabel, headerLeft, children, nav = true }: {
  space?: Space; title?: string; back?: string; backLabel?: string; headerLeft?: ReactNode; children: ReactNode; nav?: boolean;
}) {
  return (
    <div className={`${spaceClass(space)} min-h-dvh`} style={{ background: "var(--sp-bg)", color: "var(--sp-ink)", fontFamily: "var(--lg-sans)" }}>
      <div className="mx-auto max-w-[430px] pb-32" style={{ paddingInline: "var(--lg-margin)" }}>
        <PageHeader space={space} title={title} back={back} backLabel={backLabel} left={headerLeft} />
        {children}
      </div>
      {nav && <BottomNav night={space === "night"} />}
    </div>
  );
}

/** Questionnaire (§4.2) : barre d'étapes, titre, cartes, pied fixe. Sans barre de navigation. */
export function QuestionLayout({ space = "today", step, total, children, footer }: {
  space?: Space; step: number; total: number; children: ReactNode; footer: ReactNode;
}) {
  return (
    <div className={`${spaceClass(space)} min-h-dvh`} style={{ background: "var(--sp-bg)", color: "var(--sp-ink)", fontFamily: "var(--lg-sans)" }}>
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col pt-[30px] pb-[34px]" style={{ paddingInline: "var(--lg-margin)" }}>
        <StepBar space={space} step={step} total={total} />
        <div className="flex-1 pt-[30px]">{children}</div>
        <div className="pt-8">{footer}</div>
      </div>
    </div>
  );
}

const GRAD = { support: "var(--lg-grad-soutien)", night: "var(--lg-grad-nuit)", memory: "var(--lg-grad-memoire)" } as const;

/** Page d'expérience (§4.3) : plein écran en dégradé, Retour / Fermer, contenu centré, un bouton en bas. */
export function ExperienceLayout({ variant = "support", back = "/care", close, children, action }: {
  variant?: keyof typeof GRAD; back?: string; close?: string; children: ReactNode; action?: ReactNode;
}) {
  return (
    <div className="lg-experience min-h-dvh" style={{ background: GRAD[variant], color: "var(--lg-cream)", fontFamily: "var(--lg-sans)" }}>
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col pb-10" style={{ paddingInline: "var(--lg-margin)" }}>
        <div className="flex items-center justify-between text-[14px]" style={{ height: "var(--lg-header-h)", color: variant === "memory" ? "var(--lg-cream)" : "var(--lg-deep)" }}>
          <Link to={back} className="flex min-h-11 items-center gap-2"><ArrowLeft className="size-4" strokeWidth={1.4} /> Retour</Link>
          <Link to={close ?? back} className="flex min-h-11 items-center gap-2">Fermer <X className="size-4" strokeWidth={1.4} /></Link>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center text-center">{children}</div>
        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
