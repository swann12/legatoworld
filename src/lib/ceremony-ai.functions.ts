import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  section: z.enum(["fleurs", "musique", "textes"]),
  brief: z.string().min(2).max(1500),
  choices: z.string().max(600).optional(),
  portrait: z.string().max(600).optional(),
  lovedName: z.string().max(80).optional(),
});

export type CeremonyIdea = { title: string; body: string };

const SYSTEM = `Tu accompagnes une personne endeuillée qui prépare une cérémonie.
- Français, ton doux, sensible, jamais bureaucratique, jamais de clichés ni d'émojis.
- Tu pars d'abord de ce que la personne écrit librement : son intention, un souvenir, une ambiance.
- Trois propositions concrètes maximum, nommées et utilisables telles quelles.
- Jamais d'injonction, jamais de jugement.`;

const TOOL = {
  type: "function" as const,
  function: {
    name: "ceremony_ideas",
    description: "Trois propositions concrètes pour une section de la cérémonie.",
    parameters: {
      type: "object",
      properties: {
        ideas: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Nom court de la proposition." },
              body: { type: "string", description: "Deux phrases maximum, concrètes." },
            },
            required: ["title", "body"],
            additionalProperties: false,
          },
        },
      },
      required: ["ideas"],
      additionalProperties: false,
    },
  },
};

export const refineCeremony = createServerFn({ method: "POST" })
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { ideas: [] as CeremonyIdea[], error: "Service indisponible." };

    const prompt = [
      `Section : ${data.section}.`,
      data.lovedName ? `La personne disparue : ${data.lovedName}.` : "",
      data.portrait ? `Ce qu'on sait d'elle : ${data.portrait}` : "",
      data.choices ? `Choix déjà faits : ${data.choices}` : "",
      "",
      "Ce que la personne écrit avec ses mots :",
      data.brief,
    ].filter(Boolean).join("\n");

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: prompt },
          ],
          tools: [TOOL],
          tool_choice: { type: "function", function: { name: "ceremony_ideas" } },
        }),
      });
      if (!res.ok) return { ideas: [] as CeremonyIdea[], error: `Service indisponible (${res.status}).` };
      const json = (await res.json()) as {
        choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
      };
      const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      if (!args) return { ideas: [] as CeremonyIdea[], error: "Réponse vide." };
      const parsed = JSON.parse(args) as { ideas: CeremonyIdea[] };
      return { ideas: (parsed.ideas ?? []).slice(0, 3), error: null as string | null };
    } catch {
      return { ideas: [] as CeremonyIdea[], error: "Impossible de joindre le service." };
    }
  });
