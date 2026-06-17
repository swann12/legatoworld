import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const recordEmotion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    mood?: string;
    intensity?: number;
    tags?: string[];
    source?: string;
    note?: string;
  }) =>
    z
      .object({
        mood: z.string().max(40).optional(),
        intensity: z.number().int().min(0).max(10).optional(),
        tags: z.array(z.string().max(40)).max(12).optional(),
        source: z.string().max(40).optional(),
        note: z.string().max(500).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("emotional_state").insert({
      user_id: userId,
      mood: data.mood ?? null,
      intensity: data.intensity ?? null,
      tags: data.tags ?? [],
      source: data.source ?? null,
      note: data.note ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getEmotionalContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("emotional_state")
      .select("mood, intensity, tags, source, created_at")
      .eq("user_id", userId)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const latest = rows[0] ?? null;
    const tagCounts: Record<string, number> = {};
    let intensitySum = 0;
    let intensityN = 0;
    for (const r of rows) {
      for (const t of r.tags ?? []) tagCounts[t] = (tagCounts[t] ?? 0) + 1;
      if (typeof r.intensity === "number") {
        intensitySum += r.intensity;
        intensityN += 1;
      }
    }
    const trend = intensityN > 0 ? intensitySum / intensityN : null;
    const dominantTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t]) => t);
    return { latest, trend, dominantTags, count: rows.length };
  });

export const getDailyFocus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const { data: emo } = await supabase
      .from("emotional_state")
      .select("mood, intensity, tags, created_at")
      .eq("user_id", userId)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1);
    const latest = emo?.[0] ?? null;
    const intensity = latest?.intensity ?? null;
    const tags = latest?.tags ?? [];

    // Heuristique douce
    if (intensity !== null && intensity >= 7) {
      return {
        tone: "rest" as const,
        title: "Aujourd'hui, juste respirer.",
        body: "Rien d'urgent. Une pause vous fera plus de bien qu'une liste.",
        cta: { label: "Un moment de présence", to: "/presence" as const },
      };
    }
    if (tags.includes("anxieux") || tags.includes("perdu")) {
      return {
        tone: "anchor" as const,
        title: "Retrouvons un repère.",
        body: "Quelques mots à poser, sans plus.",
        cta: { label: "Ouvrir le journal", to: "/journal" as const },
      };
    }
    return {
      tone: "gentle" as const,
      title: "Une petite chose, si vous voulez.",
      body: "Avancer d'un pas suffit aujourd'hui.",
      cta: { label: "Voir le parcours", to: "/parcours" as const },
    };
  });