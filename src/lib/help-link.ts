/* Lien sécurisé « ce qui m'aiderait » (D061–D065) : sans compte, expire après 30 jours.
 * Le jeton n'est connu que du lien ; la base n'en garde que l'empreinte. */
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LinkItem = { id: string; title: string; when: string };
export type LinkDate = { label: string; date: string };
export type HelpLinkData = { sender_name: string; items: LinkItem[]; dates: LinkDate[]; claims: Record<string, string>; expires_at: string };

export async function createHelpLink(name: string, items: LinkItem[], dates: LinkDate[]) {
  const { data, error } = await supabase.rpc("create_help_link", { p_name: name, p_items: items, p_dates: dates });
  if (error || !data) throw new Error(error?.message ?? "Lien non créé");
  return data as string;
}

export function useHelpLink(token: string) {
  const [state, setState] = useState<{ loading: boolean; data: HelpLinkData | null }>({ loading: true, data: null });
  const reload = useCallback(async () => {
    const { data } = await supabase.rpc("get_help_link", { p_token: token });
    setState({ loading: false, data: (data as HelpLinkData | null) ?? null });
  }, [token]);
  useEffect(() => { void reload(); }, [reload]);
  const claim = useCallback(async (item: string, name: string) => {
    const { data } = await supabase.rpc("claim_help_item", { p_token: token, p_item: item, p_name: name });
    await reload();
    return data === true;
  }, [token, reload]);
  return { ...state, claim };
}

/** Pour l'auteur : qui s'occupe de quoi, lu sous ses propres règles d'accès. */
export async function loadMyClaims(linkId: string) {
  const { data } = await supabase.from("help_claims").select("item_id, helper_name").eq("link_id", linkId);
  return Object.fromEntries((data ?? []).map((c) => [c.item_id, c.helper_name])) as Record<string, string>;
}

export async function linkIdForToken(): Promise<string | null> {
  const { data } = await supabase.from("help_links").select("id").order("created_at", { ascending: false }).limit(1);
  return data?.[0]?.id ?? null;
}

export function helpLinkUrl(token: string) {
  return `${window.location.origin}/aide/${token}`;
}
