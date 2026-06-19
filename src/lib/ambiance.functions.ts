import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  title: z.string().min(1).max(120),
  whisper: z.string().min(1).max(400),
  asmr: z.string().min(1).max(200),
  motion: z.string().min(1).max(40),
});

const SYSTEM_PROMPT = `Tu imagines des ambiances sensorielles très douces, pour quelqu'un qui traverse un moment difficile et cherche à s'apaiser sans mots.

Règles strictes :
- Réponds en français, ton tendre, jamais cliché, jamais médical.
- Pas d'émojis, pas de formules vides ("laissez-vous porter", "fermez les yeux"...).
- Chaque variation doit prolonger la même famille sensorielle que l'ambiance aimée, sans la copier.
- "title" : 2 à 4 mots, image concrète et délicate.
- "whisper" : une seule phrase brève (max 90 caractères), sensible, incarnée.
- "asmr" : 3 à 6 mots décrivant un son réel, doux et continu.
- "motion" doit être l'une de ces valeurs exactes : "drift", "ripple", "pulse", "rain", "veil".
- "palette" : trois nuances OKLCH très douces (claires, désaturées), au format "oklch(0.92 0.04 60)".`;

export const similarAmbiances = createServerFn({ method: "POST" })
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { variations: [], error: "Le service est momentanément indisponible." };
    }
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": apiKey,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Ambiance aimée :\n- titre : ${data.title}\n- murmure : ${data.whisper}\n- son : ${data.asmr}\n- motion : ${data.motion}\n\nPropose 3 variations proches, dans la même famille, pour prolonger ce moment sans rupture.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "propose_ambiances",
                description: "Renvoie 3 ambiances proches.",
                parameters: {
                  type: "object",
                  properties: {
                    variations: {
                      type: "array",
                      minItems: 3,
                      maxItems: 3,
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          whisper: { type: "string" },
                          asmr: { type: "string" },
                          motion: { type: "string", enum: ["drift", "ripple", "pulse", "rain", "veil"] },
                          palette: {
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: { type: "string" },
                          },
                        },
                        required: ["title", "whisper", "asmr", "motion", "palette"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["variations"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "propose_ambiances" } },
        }),
      });
      if (!res.ok) {
        return { variations: [], error: `Le service est momentanément indisponible (${res.status}).` };
      }
      const json = (await res.json()) as {
        choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
      };
      const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ?? "{}";
      const parsed = JSON.parse(args) as {
        variations: { title: string; whisper: string; asmr: string; motion: string; palette: string[] }[];
      };
      return { variations: parsed.variations ?? [], error: null as string | null };
    } catch (err) {
      console.error("similarAmbiances failed", err);
      return { variations: [], error: "Impossible de joindre le service pour l'instant." };
    }
  });