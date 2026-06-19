import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  description: z.string().min(1).max(2000),
  mood: z.string().max(40).optional(),
});

/* Pool of element ids the AI can choose from. Kept sober — a curated subset. */
const ELEMENT_POOL = [
  // florale
  "florale-01-01","florale-01-02","florale-01-03","florale-01-05","florale-01-08","florale-01-10",
  "florale-01-12","florale-01-14","florale-01-16","florale-01-17","florale-01-19","florale-01-22",
  // feuillage
  "feuillage-04-01","feuillage-04-04","feuillage-04-08","feuillage-04-12","feuillage-04-15",
  "feuillage-05-02","feuillage-06-01","feuillage-06-03","feuillage-07-02","feuillage-07-06","feuillage-09-01","feuillage-09-04",
  // marin
  "marin-02-01","marin-02-04","marin-02-07","marin-02-10","marin-02-13","marin-02-17","marin-02-22",
  // atmosphere
  "atmosphere-03-01",
] as const;

const SYSTEM_PROMPT = `Tu composes une scène végétale très douce, en disposant 5 à 8 éléments sur une toile portrait (3:4).

Règles strictes :
- Choisis les éléments uniquement parmi la liste fournie (par identifiant exact).
- Compose comme un peintre : équilibre des masses, point d'ancrage central légèrement bas, éléments plus petits en retrait.
- Coordonnées en pourcentage du canevas : x ∈ [10..90], y ∈ [10..90]. Le centre 50/50 est l'origine de chaque élément.
- Tailles modérées : width ∈ [12..38] (un seul élément focal peut atteindre 45). Évite les chevauchements lourds.
- Rotation légère, ∈ [-25..25]. Opacité ∈ [0.55..1].
- Mélange au moins deux familles (florale + feuillage par exemple) pour donner de la respiration.
- Reste fidèle à la description : couleurs, saison, lieu, tempérament. N'invente pas un décor étranger à la personne.`;

type Item = {
  elementId: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  opacity: number;
};

export const composeFromPortrait = createServerFn({ method: "POST" })
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { items: [] as Item[], error: "Service indisponible." };
    }
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content:
                `Voici comment je décris la personne (et l'ambiance ressentie) :\n\n${data.description}\n\n` +
                (data.mood ? `Mode actuel : ${data.mood}.\n\n` : "") +
                `Liste exacte des éléments disponibles :\n${ELEMENT_POOL.join(", ")}\n\nPropose la composition.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "compose_layout",
                description: "Renvoie une composition d'éléments.",
                parameters: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      minItems: 5,
                      maxItems: 8,
                      items: {
                        type: "object",
                        properties: {
                          elementId: { type: "string", enum: [...ELEMENT_POOL] },
                          x: { type: "number" },
                          y: { type: "number" },
                          width: { type: "number" },
                          rotation: { type: "number" },
                          opacity: { type: "number" },
                        },
                        required: ["elementId", "x", "y", "width", "rotation", "opacity"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["items"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "compose_layout" } },
        }),
      });
      if (!res.ok) {
        return { items: [] as Item[], error: `Service indisponible (${res.status}).` };
      }
      const json = (await res.json()) as {
        choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
      };
      const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ?? "{}";
      const parsed = JSON.parse(args) as { items: Item[] };
      const items = (parsed.items ?? []).filter((it) =>
        (ELEMENT_POOL as readonly string[]).includes(it.elementId),
      );
      return { items, error: null as string | null };
    } catch (err) {
      console.error("composeFromPortrait failed", err);
      return { items: [] as Item[], error: "Impossible de joindre le service." };
    }
  });