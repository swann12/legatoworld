import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

/** Shared in-flow entry; inherits the page palette without changing navigation. */
export function PresenceField({ className = "" }: { className?: string }) {
  return <Link to="/presence" className={`lg-today-presence ${className}`}><span>Une question ? Écrivez à Présence…</span><span><ArrowRight size={16} strokeWidth={1.3} /></span></Link>;
}