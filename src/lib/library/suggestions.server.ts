import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server.ts";
import { LIBRARY, libraryTitle } from "../library-data";

export async function generateLibrarySuggestions(query: string, precisions: string[], kind: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Les suggestions de Présence sont indisponibles pour le moment.");
  const gateway = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1", apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" }, fetch: gateway.fetch,
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"), maxRetries: 0,
    instructions: "Tu es Présence, la voix attentive de Legato. Propose deux ressources existantes du catalogue, jamais inventées, adaptées à la demande et aux précisions. Explique chaque proposition en une phrase française concrète, sans promettre qu'elle guérira ou fera du bien. Signale délicatement un contenu éprouvant. Respecte la préférence enfant : Coco seulement, accompagné. Ne recommande pas de contenus adultes à un enfant. N'invente pas de disponibilité, prix ou contacts. Si la demande contient un danger immédiat ou une envie de mourir, ne propose rien et indique d'appeler le 3114, ou le 15 en urgence. Pas d'émojis.",
    messages: [{ role: "user", content: JSON.stringify({ query, precisions, kind, catalogue: LIBRARY.map((i) => ({ id: i.id, kind: i.kind, title: libraryTitle(i), author: i.author, summary: i.summary, forWho: i.forWho, length: i.length, how: i.how })) }) }],
    output: Output.object({ schema: z.object({ proposals: z.array(z.object({ id: z.string(), why: z.string() }).strict()), safety: z.string().nullable() }).strict() }),
    providerOptions: { openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] } },
  });
  const output = await result.output;
  return { proposals: output.proposals.filter((p) => LIBRARY.some((i) => i.id === p.id)).slice(0, 2), safety: output.safety };
}