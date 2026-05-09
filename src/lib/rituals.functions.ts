import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  kind: z.string().min(1).max(40),
  title: z.string().min(1).max(120),
  date: z.string().min(1).max(60),
  branch: z.string().min(1).max(40),
  mode: z.string().min(1).max(40),
  lostName: z.string().max(80).optional(),
});

const SYSTEM_PROMPT = `Tu proposes des rituels très courts ou plus longs, pour traverser une date sensible (anniversaire, jour d'absence, date récurrente).

Règles strictes :
- Français, ton tendre, jamais cliché, jamais médical, pas d'émojis.
- Chaque rituel = un seul geste, simple, faisable seul·e à la maison ou dehors.
- Les "rituels rapides" doivent durer 1 à 5 minutes (un geste, une parole, une respiration, allumer une bougie…).
- Les "rituels longs" doivent durer 20 à 90 minutes (cuisiner un plat aimé, marcher jusqu'à un lieu, écrire une lettre, écouter un disque entier…).
- Tiens compte de la nature de la date (anniversaire, jour de naissance, mémoire d'un moment, date récurrente).
- Tiens compte du mode (cocoon : intime · ancrage : geste concret · souffle : léger · relais : à plusieurs).
- Si un prénom est fourni, glisse-le sobrement dans deux ou trois rituels — sans en abuser.
- 4 rituels rapides, 3 rituels longs. Une phrase par rituel : titre court + une ligne d'invitation très douce.`;

type Ritual = { title: string; whisper: string; durationMin: number };

export const suggestRituals = createServerFn({ method: "POST" })
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { quick: [] as Ritual[], long: [] as Ritual[], error: "Service indisponible." };
    }
    const userPrompt = [
      `Date sensible :`,
      `- type : ${data.kind}`,
      `- titre : ${data.title}`,
      `- quand : ${data.date}`,
      `- branche : ${data.branch}`,
      `- mode actuel : ${data.mode}`,
      data.lostName ? `- prénom à glisser parfois : ${data.lostName}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "propose_rituals",
                description: "Renvoie des rituels rapides et longs.",
                parameters: {
                  type: "object",
                  properties: {
                    quick: {
                      type: "array",
                      minItems: 4,
                      maxItems: 4,
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          whisper: { type: "string" },
                          durationMin: { type: "number" },
                        },
                        required: ["title", "whisper", "durationMin"],
                        additionalProperties: false,
                      },
                    },
                    long: {
                      type: "array",
                      minItems: 3,
                      maxItems: 3,
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          whisper: { type: "string" },
                          durationMin: { type: "number" },
                        },
                        required: ["title", "whisper", "durationMin"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["quick", "long"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "propose_rituals" } },
        }),
      });
      if (!res.ok) {
        return { quick: [] as Ritual[], long: [] as Ritual[], error: `Service indisponible (${res.status}).` };
      }
      const json = (await res.json()) as {
        choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
      };
      const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ?? "{}";
      const parsed = JSON.parse(args) as { quick: Ritual[]; long: Ritual[] };
      return { quick: parsed.quick ?? [], long: parsed.long ?? [], error: null as string | null };
    } catch (err) {
      console.error("suggestRituals failed", err);
      return { quick: [] as Ritual[], long: [] as Ritual[], error: "Impossible de joindre le service." };
    }
  });