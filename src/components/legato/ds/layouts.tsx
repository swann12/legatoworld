import { useSmartBack } from "@/lib/use-smart-back";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";
import { spaceClass, type Space } from "./space";
import { PageHeader, StepBar } from "./components";
import { BottomNav } from "./BottomNav";
import { DiscoveryBanner } from "../DiscoveryUI";

/** Écran standard (§4.1) : en-tête 64 px + barre flottante. */
export function StandardLayout({ space = "today", title, back, backLabel, headerLeft, children, nav = true, activeTab, className = "" }: {
  space?: Space; title?: string; back?: string; backLabel?: string; headerLeft?: ReactNode; children: ReactNode; nav?: boolean; activeTab?: string; className?: string;
}) {
  return (
    <div className={`${spaceClass(space)} min-h-dvh ${className}`} style={{ background: "var(--sp-bg)", color: "var(--sp-ink)", fontFamily: "var(--lg-sans)" }}>
      <div className="mx-auto max-w-[430px] pb-32" style={{ paddingInline: "var(--lg-margin)" }}>
        <PageHeader space={space} title={title} back={back} backLabel={backLabel} left={headerLeft} />
        <DiscoveryBanner />
        {children}
      </div>
      {nav && <BottomNav night={space === "night"} active={activeTab} />}
    </div>
  );
}

/** Questionnaire (§4.2) : barre d'étapes, titre, cartes, pied fixe. Sans barre de navigation. */
export function QuestionLayout({ space = "today", step, total, children, footer, header }: {
  space?: Space; step: number; total: number; children: ReactNode; footer: ReactNode; header?: ReactNode;
}) {
  return (
    <div className={`${spaceClass(space)} min-h-dvh`} style={{ background: "var(--sp-bg)", color: "var(--sp-ink)", fontFamily: "var(--lg-sans)" }}>
      <div className={`mx-auto flex min-h-dvh max-w-[430px] flex-col pb-[34px] ${header ? "" : "pt-[30px]"}`} style={{ paddingInline: "var(--lg-margin)" }}>
        {header}
        <StepBar space={space} step={step} total={total} />
        <div className="flex-1 pt-[30px]">{children}</div>
        <div className="pt-8">{footer}</div>
      </div>
    </div>
  );
}

const GRAD = { support: "var(--lg-grad-soutien)", night: "var(--lg-grad-nuit)", memory: "var(--lg-grad-memoire)" } as const;

/** Page d'expérience (§4.3) : plein écran en dégradé, Retour / Fermer, titre en haut (top), contenu centré, un bouton en bas. */
export function ExperienceLayout({ variant = "support", back = "/care", backLabel = "Retour", close, onBack, onClose, top, children, action }: {
  variant?: keyof typeof GRAD; back?: string; backLabel?: string; close?: string; onBack?: () => void; onClose?: () => void;
  top?: ReactNode; children: ReactNode; action?: ReactNode;
}) {
  const smartBack = useSmartBack();
  const headInk = variant === "support" ? "var(--lg-deep)" : variant === "memory" ? "var(--lg-blush)" : "var(--lg-cream)";
  const cls = "flex min-h-11 items-center gap-2";
  return (
    <div className={`lg-experience ${variant === "memory" ? spaceClass("memory") : ""} min-h-dvh`} style={{ background: GRAD[variant], color: variant === "memory" ? "var(--lg-blush)" : "var(--lg-cream)", fontFamily: "var(--lg-sans)" }}>
      <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col pb-10" style={{ paddingInline: "var(--lg-margin)" }}>
        <div className="flex items-center justify-between text-[14px]" style={{ height: "var(--lg-header-h)", color: headInk }}>
          {onBack
            ? <button type="button" onClick={onBack} className={cls}><ArrowLeft className="size-4" strokeWidth={1.4} /> {backLabel}</button>
            : <Link to={back} onClick={smartBack} className={cls}><ArrowLeft className="size-4" strokeWidth={1.4} /> {backLabel}</Link>}
          {onClose
            ? <button type="button" onClick={onClose} className={cls}>Fermer <X className="size-4" strokeWidth={1.4} /></button>
            : <Link to={close ?? back} className={cls}>Fermer <X className="size-4" strokeWidth={1.4} /></Link>}
        </div>
        {top && <div className="pt-6" style={{ color: headInk }}>{top}</div>}
        <div className="flex flex-1 flex-col items-center justify-center text-center">{children}</div>
        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
