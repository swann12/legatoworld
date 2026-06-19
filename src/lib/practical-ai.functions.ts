import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  description: z.string().min(2).max(4000),
  mode: z.enum(["cocoon", "anchoring", "breath", "relay"]).optional(),
  budget: z.string().optional(),
  step: z.string().optional(),
});

const SYSTEM_PROMPT = `Tu es un compagnon délicat qui aide à organiser un adieu.
- Réponds toujours en français, ton doux, jamais cliché, jamais bureaucratique.
- Adapte la densité au mode : Cocon (très bref, enveloppant), Ancrage (concret, structuré), Souffle (sensible, inspirant), Relais (pistes vers d'autres personnes).
- Respecte le budget si indiqué, sans culpabiliser.
- Pas d'émojis, pas de formules vides.`;

const TOOL = {
  type: "function" as const,
  function: {
    name: "suggest_practical",
    description: "Renvoie des suggestions sensibles et concrètes pour préparer un adieu.",
    parameters: {
      type: "object",
      properties: {
        intro: { type: "string", description: "Une phrase courte, posée, qui accueille la confidence." },
        flowers: { type: "array", items: { type: "string" }, description: "2 à 4 idées de fleurs ou ambiances florales." },
        music: { type: "array", items: { type: "string" }, description: "2 à 4 morceaux ou ambiances sonores." },
        texts: { type: "array", items: { type: "string" }, description: "2 à 4 textes, poèmes ou lectures." },
        objects: { type: "array", items: { type: "string" }, description: "2 à 4 objets ou rituels." },
        places: { type: "array", items: { type: "string" }, description: "2 à 3 lieux ou ambiances de cérémonie." },
        organization: { type: "array", items: { type: "string" }, description: "2 à 4 conseils d'organisation, simples et concrets." },
        closing: { type: "string", description: "Un mot court pour clore, sans pathos." },
      },
      required: ["intro", "flowers", "music", "texts", "objects", "places", "organization", "closing"],
      additionalProperties: false,
    },
  },
};

export type PracticalSuggestion = {
  intro: string;
  flowers: string[];
  music: string[];
  texts: string[];
  objects: string[];
  places: string[];
  organization: string[];
  closing: string;
};

export const suggestPractical = createServerFn({ method: "POST" })
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { suggestion: null as PracticalSuggestion | null, error: "Service IA non configuré." };
    }
    const userPrompt = [
      data.mode ? `Mode actuel : ${data.mode}.` : "",
      data.budget ? `Budget indicatif : ${data.budget}.` : "",
      data.step ? `Étape : ${data.step}.` : "",
      "",
      "Voici ce que la personne confie :",
      data.description,
    ].filter(Boolean).join("\n");

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          tools: [TOOL],
          tool_choice: { type: "function", function: { name: "suggest_practical" } },
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("AI gateway error", res.status, body);
        return { suggestion: null, error: `Service indisponible (${res.status}).` };
      }
      const json = (await res.json()) as {
        choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
      };
      const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      if (!args) return { suggestion: null, error: "Réponse vide." };
      try {
        const parsed = JSON.parse(args) as PracticalSuggestion;
        return { suggestion: parsed, error: null as string | null };
      } catch {
        return { suggestion: null, error: "Réponse mal formée." };
      }
    } catch (err) {
      console.error("Practical AI request failed", err);
      return { suggestion: null, error: "Impossible de joindre le service." };
    }
  });
