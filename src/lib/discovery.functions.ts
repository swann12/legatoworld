import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { isDiscoveryContentKey } from "./discovery";

export const saveDiscoveryArchive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ entries: z.record(z.string(), z.string()) }).parse(input))
  .handler(async ({ data, context }) => {
    if (Object.keys(data.entries).some(key => !isDiscoveryContentKey(key))) throw new Error("Ces données ne peuvent pas être reprises.");
    const { error } = await context.supabase.from("discovery_archives").upsert({ user_id: context.userId, payload: data.entries, updated_at: new Date().toISOString() });
    if (error) throw new Error("La reprise n'a pas abouti. Vos contenus restent sur ce téléphone.");
    const preferences: Record<string, string> = {};
    for (const [key, value] of Object.entries(data.entries)) if (/prefs|notif|theme|mode/i.test(key)) preferences[key] = value;
    const { error: profileError } = await context.supabase.from("profiles").update({ preferences }).eq("id", context.userId);
    if (profileError) throw new Error("Vos préférences n'ont pas pu être reprises. Vos contenus restent sur ce téléphone.");
    return { ok: true };
  });
export const getDiscoveryArchive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("discovery_archives").select("payload").eq("user_id", context.userId).maybeSingle();
    if (error) throw new Error("Votre espace n'a pas pu être retrouvé pour le moment.");
    return { entries: z.record(z.string(), z.string()).parse(data?.payload ?? {}) };
  });