import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  description: z.string().min(3).max(4000),
  context: z.enum(["self", "loved-one"]).default("loved-one"),
});

const SYSTEM_PROMPT = `Tu es un compagnon délicat qui aide à imaginer des pistes pour une cérémonie d'adieu, sensible à la singularité d'une personne.

Règles strictes :
- Réponds en français, ton doux, jamais cliché, jamais générique.
- Pas de formules vides ni d'émojis.
- Personnalise tout à partir des éléments donnés. Si l'information manque, propose plusieurs pistes courtes plutôt qu'une seule générique.
- Format strict en Markdown, sections suivantes (titres niveau ###), 2 à 4 idées brèves par section, en listes à puces courtes :

### Cérémonie
### Lieux
### Fleurs
### Musiques
### Textes et poèmes
### Objets, rituels
### Ambiance, couleurs, matières
### Un mot pour la fin

Évite les redites, reste concret, garde la pudeur.`;

export const suggestInspiration = createServerFn({ method: "POST" })
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { text: "", error: "La clé d'accès au service IA n'est pas configurée." };
    }
    const userPrompt =
      data.context === "self"
        ? `Voici comment je me décris, ou ce qui me définit. Propose des pistes pour ma propre cérémonie, fidèles à cette personne.\n\n${data.description}`
        : `Voici comment je décris la personne. Propose des pistes pour une cérémonie qui lui ressemble.\n\n${data.description}`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("AI gateway error", res.status, body);
        return { text: "", error: `Le service est momentanément indisponible (${res.status}).` };
      }
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = json.choices?.[0]?.message?.content?.trim() ?? "";
      return { text, error: null as string | null };
    } catch (err) {
      console.error("Inspiration request failed", err);
      return { text: "", error: "Impossible de joindre le service pour l'instant." };
    }
  });