import { streamResponse, GatewayError } from "@lovable.dev/ai-gateway";
import { z } from "zod";
import { LIBRARY, libraryTitle } from "../library-data";
const Output = z.object({ proposals: z.array(z.object({ id: z.string(), why: z.string() })), safety: z.string().nullable() });
export async function generateLibrarySuggestions(query: string, precisions: string[], kind: string) {
  try {
    const stream = await streamResponse({
      model: "openai/gpt-6-astra",
      instructions: "Tu es Présence, la voix attentive de Legato. Propose deux ressources existantes du catalogue, jamais inventées, adaptées à la demande et aux précisions. Explique chaque proposition en une phrase française concrète, sans promettre qu'elle guérira ou fera du bien. Signale délicatement un contenu éprouvant. Pour un enfant : Coco seulement, accompagné. N'invente pas de disponibilité, prix ou contacts. Si la demande contient un danger immédiat ou une envie de mourir, ne propose rien et indique d'appeler le 3114, ou le 15 en urgence. Pas d'émojis.",
      input: JSON.stringify({ query, precisions, kind, catalogue: LIBRARY.map((i) => ({ id: i.id, kind: i.kind, title: libraryTitle(i), author: i.author, summary: i.summary, length: i.length, how: i.how })) }),
      reasoning: { effort: "low", summary: "auto" }, include: ["reasoning.encrypted_content"],
      text: { format: { type: "json_schema", name: "library_proposals", strict: true, schema: {
        type: "object", additionalProperties: false, required: ["proposals", "safety"], properties: {
          proposals: { type: "array", items: { type: "object", additionalProperties: false, required: ["id", "why"], properties: { id: { type: "string", enum: LIBRARY.map((i) => i.id) }, why: { type: "string" } } } },
          safety: { type: ["string", "null"] },
        },
      } } },
    });
    let text = "";
    for await (const event of stream) {
      if (event.type === "response.output_text.delta") text += event.delta;
      if (event.type === "response.refusal.done") throw new Error("Présence ne peut pas répondre à cette demande.");
    }
    const output = Output.parse(JSON.parse(text));
    const proposals = output.safety ? [] : output.proposals.filter((p) => LIBRARY.some((i) => i.id === p.id) && (!precisions.includes("Pour un enfant") || p.id === "coco")).slice(0, 2);
    return { proposals, safety: output.safety };
  } catch (error) {
    if (error instanceof GatewayError) {
      console.error("Library suggestions", error.code, error.ids);
      throw new Error(error.recovery?.message ?? error.message);
    }
    throw error;
  }
}
