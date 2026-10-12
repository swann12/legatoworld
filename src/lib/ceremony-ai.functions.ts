import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  section: z.enum(["fleurs", "musique", "textes"]),
  brief: z.string().min(2).max(1500),
  choices: z.string().max(600).optional(),
  portrait: z.string().max(600).optional(),
  lovedName: z.string().max(80).optional(),
  outputMode: z.literal("flower-proposal").optional(),
});

export type CeremonyIdea = { title: string; body: string };
const FlowerProposalSchema = z.object({
  title: z.string().min(1), accent: z.string().min(1), body: z.string().min(1),
  flowers: z.string().min(1), shape: z.string().min(1), price: z.string().min(1),
});
const FLOWER_TOOL = {
  type: "function" as const,
  function: {
    name: "flower_proposal", description: "Une composition florale concrète à montrer au fleuriste.",
    parameters: {
      type: "object", properties: {
        title: { type: "string", description: "Première partie du titre : nom de la composition." },
        accent: { type: "string", description: "Deuxième partie courte et sensible du titre." },
        body: { type: "string", description: "Deux à trois phrases décrivant les fleurs, leur placement et le lien avec la personne." },
        flowers: { type: "string", description: "Les variétés de fleurs et feuillages." },
        shape: { type: "string", description: "Forme et dimensions de la composition." },
        price: { type: "string", description: "Fourchette indicative en euros, sans promesse de devis." },
      }, required: ["title", "accent", "body", "flowers", "shape", "price"], additionalProperties: false,
    },
  },
};

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

    const flowerMode = data.outputMode === "flower-proposal";
    const prompt = [
      `Section : ${data.section}.`,
      data.lovedName ? `La personne disparue : ${data.lovedName}.` : "",
      data.portrait ? `Ce qu'on sait d'elle : ${data.portrait}` : "",
      data.choices ? `Choix déjà faits : ${data.choices}` : "",
      "",
      "Ce que la personne écrit avec ses mots :",
      data.brief,
      flowerMode ? "Propose une seule composition florale, concrète et de saison, à montrer au fleuriste. Respecte les choix et le souvenir. Format très bref, obligatoire : title = nom littéral de la composition, 7 mots maximum (exemple : Un bouquet blanc et vert,) ; accent = 4 mots maximum (exemple : simple et posé.) ; body = deux phrases concrètes, 45 mots maximum, aucun discours sur la sérénité, la pureté ou l'amour ; flowers = seulement trois noms de fleurs ou feuillages, séparés par des virgules ; shape = forme et dimension, 7 mots maximum (exemple : Bouquet bas, 60 cm) ; price = seulement une fourchette indicative en euros (exemple : 120 à 180 €), jamais un devis confirmé. Aucune métaphore ni titre poétique abstrait." : "",
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
          tools: [flowerMode ? FLOWER_TOOL : TOOL],
          tool_choice: { type: "function", function: { name: flowerMode ? "flower_proposal" : "ceremony_ideas" } },
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null) as { message?: string; error?: { message?: string } } | null;
        return { ideas: [] as CeremonyIdea[], error: payload?.message ?? payload?.error?.message ?? `Service indisponible (${res.status}).` };
      }
      const json = (await res.json()) as {
        choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
      };
      const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      if (!args) return { ideas: [] as CeremonyIdea[], error: "Réponse vide." };
      if (flowerMode) {
        const result = FlowerProposalSchema.safeParse(JSON.parse(args));
        if (!result.success) return { ideas: [] as CeremonyIdea[], error: "La proposition reçue est incomplète." };
        return { ideas: [] as CeremonyIdea[], flowerProposal: result.data, error: null as string | null };
      }
      const parsed = JSON.parse(args) as { ideas: CeremonyIdea[] };
      return { ideas: (parsed.ideas ?? []).slice(0, 3), error: null as string | null };
    } catch {
      return { ideas: [] as CeremonyIdea[], error: "Impossible de joindre le service." };
    }
  });
