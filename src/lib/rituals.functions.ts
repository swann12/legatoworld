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

const SYSTEM_PROMPT = `Tu proposes des rituels du deuil concrets, inspirés de traditions vivantes du monde entier (Mexique, Japon, Irlande, Sénégal, Inde, Corée, Pays scandinaves, Maghreb, Italie, Brésil, peuples autochtones, traditions juives, chrétiennes, bouddhistes, soufies, animistes, etc.).

Règles strictes :
- Français, ton tendre, jamais cliché, jamais médical, pas d'émojis.
- Chaque rituel doit exister vraiment quelque part — pas une invention poétique. Cite la culture / tradition d'où il vient dans le champ "origin" (ex : "Japon — Obon", "Mexique — Día de los Muertos", "Irlande — wake", "Sénégal — Yaakaar", "Tradition juive — Yahrzeit").
- Le champ "whisper" décrit le geste à faire, en une phrase douce et très concrète.
- Le champ "originDetail" donne en 1 à 2 phrases ce que ce rituel signifie et d'où il vient. Pas de jargon, pas de date historique : du sens humain.
- Varie les durées : rituels rapides entre 5 et 15 min, rituels longs entre 30 min et 2 heures.
- Tiens compte du type de date (anniversaire, jour de naissance, mémoire d'un moment, date récurrente).
- Tiens compte du mode (cocoon : intime · ancrage : geste concret · souffle : léger · relais : à plusieurs).
- Si un prénom est fourni, glisse-le sobrement dans deux rituels au plus.
- 4 rituels rapides + 3 rituels longs. Diversifie les cultures d'origine entre les rituels.`;

type Ritual = {
  title: string;
  whisper: string;
  durationMin: number;
  origin: string;
  originDetail: string;
};

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
                          origin: { type: "string" },
                          originDetail: { type: "string" },
                        },
                        required: ["title", "whisper", "durationMin", "origin", "originDetail"],
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
                          origin: { type: "string" },
                          originDetail: { type: "string" },
                        },
                        required: ["title", "whisper", "durationMin", "origin", "originDetail"],
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