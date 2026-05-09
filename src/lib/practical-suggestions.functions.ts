import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type PracticalTopic = "texts" | "music" | "flowers" | "objects" | "ceremony";

const InputSchema = z.object({
  portrait: z.string().min(3).max(3000),
  topic: z.enum(["texts", "music", "flowers", "objects", "ceremony"]),
  branch: z.string().max(40).optional(),
  mode: z.string().max(40).optional(),
});

const TOPIC_BRIEF: Record<PracticalTopic, string> = {
  texts:
    "Suggère 4 textes ou poèmes : auteur + œuvre exacts, jamais inventés. Mélange registre classique et contemporain selon ce qui correspond à la personne. Évite les choix archi-rebattus si la description suggère autre chose.",
  music:
    "Suggère 4 morceaux : titre + interprète exacts. Mélange instrumental et chanté, selon ce que la description évoque. Évite les choix attendus si la personne s'en éloigne.",
  flowers:
    "Suggère 4 compositions florales : variétés nommées (rose ancienne, anémone, eucalyptus…), palette précise (3 couleurs), forme (bouquet tenu, couronne, gerbe libre, brassée). Une ligne d'usage par proposition.",
  objects:
    "Suggère 4 objets ou rituels concrets : matière (chêne clair, lin, céramique…), usage (livret, plaque, bougie, lecture commune…). Reste sobre, jamais kitsch.",
  ceremony:
    "Suggère 3 trames de cérémonie : un titre (ex : « Veillée à la maison »), un déroulé en 3-4 étapes courtes, un lieu typique. Adapte à la personne, jamais générique.",
};

const SYSTEM_PROMPT = `Tu accompagnes quelqu'un qui prépare une cérémonie d'adieu. Tu proposes des suggestions très personnalisées, ancrées dans la description de la personne disparue.

Règles strictes :
- Français, ton doux, jamais cliché, jamais commercial, pas d'émojis.
- Chaque suggestion doit s'appuyer sur un détail de la description : cite-le sobrement entre parenthèses à la fin de la ligne.
- Pour les œuvres (textes, musiques) : ne JAMAIS inventer de titre ou d'auteur. Si tu n'es pas sûr·e, propose une catégorie ou une orientation plutôt qu'un faux titre.
- Si la description est très courte : propose plusieurs orientations brèves, et indique-le sobrement.
- Pas de redite entre suggestions.`;

type Suggestion = { title: string; detail: string; reason: string };

export const practicalSuggestions = createServerFn({ method: "POST" })
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { suggestions: [] as Suggestion[], error: "Service indisponible." };
    }
    const userPrompt = [
      `Sujet : ${data.topic}.`,
      `Brief : ${TOPIC_BRIEF[data.topic]}`,
      data.mode ? `Mode actuel de l'utilisateur·rice : ${data.mode}.` : null,
      data.branch ? `Branche : ${data.branch}.` : null,
      ``,
      `Voici la description de la personne :`,
      data.portrait.trim(),
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
                name: "propose_suggestions",
                description: "Renvoie 3 à 4 suggestions personnalisées.",
                parameters: {
                  type: "object",
                  properties: {
                    suggestions: {
                      type: "array",
                      minItems: 3,
                      maxItems: 4,
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string", description: "Le titre principal (ex. titre + auteur, variété, nom du rituel)." },
                          detail: { type: "string", description: "Une ligne d'usage très courte." },
                          reason: { type: "string", description: "L'élément de la description qui a inspiré ce choix, en quelques mots." },
                        },
                        required: ["title", "detail", "reason"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["suggestions"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "propose_suggestions" } },
        }),
      });
      if (!res.ok) {
        return { suggestions: [] as Suggestion[], error: `Service indisponible (${res.status}).` };
      }
      const json = (await res.json()) as {
        choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
      };
      const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ?? "{}";
      const parsed = JSON.parse(args) as { suggestions: Suggestion[] };
      return { suggestions: parsed.suggestions ?? [], error: null as string | null };
    } catch (err) {
      console.error("practicalSuggestions failed", err);
      return { suggestions: [] as Suggestion[], error: "Impossible de joindre le service." };
    }
  });