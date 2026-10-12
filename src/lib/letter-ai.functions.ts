import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Écran 060 : Présence lit la photo d'un courrier et l'explique simplement. */
const Input = z.object({ image: z.string().startsWith("data:image/").max(8_000_000) });

export type LetterExplained = { sender: string; summary: string; todo: string; before: string; urgent: string };

const TOOL = {
  type: "function" as const,
  function: {
    name: "explain_letter",
    description: "Explique un courrier administratif reçu après un décès.",
    parameters: {
      type: "object",
      properties: {
        sender: { type: "string", description: "Expéditeur en un ou deux mots, ex. « Banque », « CAF »." },
        summary: { type: "string", description: "Deux phrases simples, vouvoiement, sans jargon : ce que dit le courrier." },
        todo: { type: "string", description: "L'action à faire, en quelques mots, ex. « Envoyer l'acte de décès »." },
        before: { type: "string", description: "La date limite, ex. « Le 15 octobre », ou « Pas de date »." },
        urgent: { type: "string", description: "Urgent ? Réponse courte et rassurante, ex. « Non, rien ne sera prélevé »." },
      },
      required: ["sender", "summary", "todo", "before", "urgent"],
      additionalProperties: false,
    },
  },
};

export const explainLetter = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { result: null as LetterExplained | null, error: "Le service n'est pas disponible." };
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "Tu aides une personne en deuil à comprendre un courrier. Français, vouvoiement, phrases courtes, ton calme. Si l'image n'est pas un courrier lisible, dis-le simplement dans summary." },
            { role: "user", content: [
              { type: "text", text: "Explique ce courrier." },
              { type: "image_url", image_url: { url: data.image } },
            ] },
          ],
          tools: [TOOL],
          tool_choice: { type: "function", function: { name: "explain_letter" } },
        }),
      });
      if (!res.ok) {
        console.error("letter AI", res.status, await res.text());
        return { result: null, error: res.status === 429 ? "Trop de demandes. Réessayez dans un instant." : "Le courrier n'a pas pu être lu." };
      }
      const json = (await res.json()) as { choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[] };
      const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      if (!args) return { result: null, error: "Le courrier n'a pas pu être lu." };
      return { result: JSON.parse(args) as LetterExplained, error: null as string | null };
    } catch (e) {
      console.error("letter AI failed", e);
      return { result: null, error: "Impossible de joindre le service." };
    }
  });
