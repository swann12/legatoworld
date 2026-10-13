import { useEffect, useState } from "react";

const KEY = "legato.discovery.v1";
const EVENT = "legato:discovery";
export type DiscoveryState = { active: boolean; pending: boolean };
const EMPTY: DiscoveryState = { active: false, pending: false };
export function getDiscovery(): DiscoveryState {
  if (typeof window === "undefined") return EMPTY;
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return EMPTY; }
}
function setDiscovery(value: DiscoveryState) {
  localStorage.setItem(KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}
export function beginDiscovery() { setDiscovery({ active: true, pending: false }); }
export function prepareDiscoveryAccount() { if (getDiscovery().active) setDiscovery({ active: true, pending: true }); }
export function finishDiscoveryAccount() { setDiscovery(EMPTY); }
export function useDiscovery() {
  const [state, setState] = useState(EMPTY);
  useEffect(() => {
    const sync = () => setState(getDiscovery());
    sync(); window.addEventListener(EVENT, sync); window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  return state;
}
export function isDiscoveryContentKey(key: string): boolean {
  return /^(lg\.|legato[.-])/.test(key) && key !== KEY && !/auth|token|session|credential/i.test(key);
}
export function collectDiscoveryContent(storage: Pick<Storage, "length" | "key" | "getItem">): Record<string, string> {
  const entries: Record<string, string> = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && isDiscoveryContentKey(key)) { const value = storage.getItem(key); if (value !== null) entries[key] = value; }
  }
  return entries;
}
export function requestDiscoveryAccount(action: "invite" | "group") {
  window.dispatchEvent(new CustomEvent("legato:account-required", { detail: action }));
}
export function canUseConnectedAction(action: "invite" | "group"): boolean {
  if (!getDiscovery().active) return true;
  requestDiscoveryAccount(action); return false;
}
export function discoveryAllowsFunction(state: DiscoveryState, pathname: string): boolean {
  return !state.active || (state.pending && /^\/(auth|start)(\/|$)/.test(pathname));
}