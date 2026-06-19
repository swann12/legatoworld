import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  description: z.string().min(3).max(4000),
  context: z.enum(["self", "loved-one"]).default("loved-one"),
});

const SYSTEM_PROMPT = `Tu es un compagnon délicat qui imagine des pistes pour une cérémonie d'adieu, fidèles à la singularité d'une personne précise.

Règles strictes :
- Français, ton doux, jamais cliché, jamais médical, jamais commercial, pas d'émojis.
- Chaque piste doit s'ancrer dans un détail concret de la description (un objet, un lieu, une habitude, une saison, un parfum, une musique, une couleur). Cite-le entre parenthèses à la fin de la ligne — sobrement.
- Si la description est très courte, propose plusieurs pistes brèves et alternatives, sans inventer de faits.
- Pour les fleurs, musiques, textes : donne des choix nommés (variété, titre + interprète, auteur + œuvre) — pas seulement des descriptions vagues.
- Pour les lieux : suggère des typologies très concrètes (verger, forêt de hêtres, atelier, grande table à la maison…), pas "un lieu paisible".
- Pour les rituels : un seul geste par puce, simple à faire, tendre.
- Format strict en Markdown :

### Cérémonie — la forme générale
### Lieux possibles
### Fleurs (variétés, couleurs)
### Musiques (titres précis, interprètes)
### Textes et poèmes (auteurs, œuvres)
### Objets et rituels — un geste à faire ensemble
### Ambiance — couleurs, matières, lumière, parfums
### Un mot pour la fin (3 lignes maximum)

2 à 4 puces courtes par section. Pas de redite. Garde la pudeur.`;

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
          "Lovable-API-Key": apiKey,
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