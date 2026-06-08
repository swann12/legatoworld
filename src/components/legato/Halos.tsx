import { modeTint, type Mode } from "@/lib/legato-state";

/** Editorial pass: halos retired. Kept as a no-op so legacy callers stay safe. */
export function Halos(_: { mode: Mode; variant?: "default" | "calm" | "rich" }) {
  return null;
}