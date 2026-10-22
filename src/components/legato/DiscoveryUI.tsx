import { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { collectDiscoveryContent, finishDiscoveryAccount, getDiscovery, isDiscoveryContentKey, rememberDiscoveryTarget, useDiscovery } from "@/lib/discovery";
import { getDiscoveryArchive, saveDiscoveryArchive } from "@/lib/discovery.functions";
import { TextLink } from "./ds";

export function DiscoveryBanner() {
  const { active } = useDiscovery();
  const { pathname } = useLocation();
  if (!active || pathname.startsWith("/start") || pathname.startsWith("/auth")) return null;
  return <aside className="lg-discovery-banner" aria-label="Mode découverte"><span><span className="lg-mono">Mode découverte</span><span>Rien n'est enregistré en ligne.</span></span><Link to="/start/garder">Créer mon espace</Link></aside>;
}

/** One identity subscriber; copying only app content never includes credentials. */
export function DiscoverySession({ children }: { children: ReactNode }) {
  const nav = useNavigate();
  const { pathname, searchStr } = useLocation();
  const { active } = useDiscovery();
  const save = useServerFn(saveDiscoveryArchive);
  const read = useServerFn(getDiscoveryArchive);
  const [error, setError] = useState("");
  useEffect(() => { rememberDiscoveryTarget(pathname + searchStr); }, [pathname, searchStr]);
  useEffect(() => {
    let running = false;
    const resume = async () => {
      const discovery = getDiscovery();
      if (running || (discovery.active && !discovery.pending)) return;
      running = true;
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user) return;
        if (discovery.active && discovery.pending) {
          await save({ data: { entries: collectDiscoveryContent(localStorage) } });
          const { entries } = await read();
          if (Object.keys(entries).length === 0 && Object.keys(collectDiscoveryContent(localStorage)).length > 0) throw new Error("La reprise n'a pas pu être confirmée. Vos contenus restent sur ce téléphone.");
          finishDiscoveryAccount();
          await nav({ to: "/home" });
        } else if (!localStorage.getItem("legato.spaces.v1")) {
          const { entries } = await read();
          for (const [key, value] of Object.entries(entries)) if (isDiscoveryContentKey(key)) localStorage.setItem(key, value);
          if (Object.keys(entries).length) window.location.reload();
        }
        setError("");
      } catch (e) { setError(e instanceof Error ? e.message : "La reprise n'a pas abouti. Vos contenus sont conservés."); }
      finally { running = false; }
    };
    const { data } = supabase.auth.onAuthStateChange(event => {
      if (event === "SIGNED_IN") window.setTimeout(() => { void resume(); }, 0);
    });
    void resume();
    const retry = () => { void resume(); };
    window.addEventListener("legato:retry-discovery", retry);
    return () => { data.subscription.unsubscribe(); window.removeEventListener("legato:retry-discovery", retry); };
  }, [nav, save, read]);
  useEffect(() => {
    const request = (e: Event) => { void nav({ to: "/start/compte-requis", search: { action: (e as CustomEvent).detail === "group" ? "group" : "invite" } }); };
    const click = (e: MouseEvent) => {
      if (!getDiscovery().active) return;
      const link = (e.target as Element)?.closest("a");
      const href = link?.getAttribute("href") || "";
      if (/^\/(care\/garden\/invite|circle)/.test(href) || /^\/care\/community\/[^/]+\/new/.test(href)) {
        e.preventDefault(); e.stopPropagation();
        void nav({ to: "/start/compte-requis", search: { action: href.includes("community") ? "group" : "invite" } });
      }
    };
    window.addEventListener("legato:account-required", request); document.addEventListener("click", click, true);
    return () => { window.removeEventListener("legato:account-required", request); document.removeEventListener("click", click, true); };
  }, [nav]);
  useEffect(() => {
    if (active && (/^\/(care\/garden\/invite|circle)/.test(pathname) || /^\/care\/community\/[^/]+\/new/.test(pathname))) {
      void nav({ to: "/start/compte-requis", search: { action: pathname.includes("community") ? "group" : "invite" }, replace: true });
    }
  }, [active, pathname, nav]);
  const entry = pathname === "/" || pathname.startsWith("/start") || pathname.startsWith("/auth") || pathname.startsWith("/onboarding");
  return <>{active && !entry && !documentSafeStandard(pathname) && <div className="lg-discovery-floating"><DiscoveryBanner /></div>}{error && <aside role="alert" className="lg-discovery-error">{error} <TextLink onClick={() => window.dispatchEvent(new Event("legato:retry-discovery"))}>Réessayer</TextLink></aside>}{children}</>;
}
function documentSafeStandard(pathname: string) { return !/respirer|sans-mots|sons|rituels\/(candle|lantern)|onboarding/.test(pathname); }