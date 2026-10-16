import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PRECISIONS } from "./library-suggestions";

export const suggestLibrary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ query: z.string().trim().min(1).max(1000), precisions: z.array(z.enum(PRECISIONS)).max(4), kind: z.enum(["lire", "ecouter", "voir"]) }).parse(input))
  .handler(async ({ data }) => {
    const { generateLibrarySuggestions } = await import("./library/suggestions.server");
    try {
      return { ...await generateLibrarySuggestions(data.query, data.precisions, data.kind), error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible de joindre Présence.";
      return { proposals: [], safety: null, error: message };
    }
  });