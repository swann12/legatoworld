import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BUCKET = "souffle-sounds";

const PROMPTS: Record<string, string> = {
  warmth:
    "Soft, intimate fireplace crackling. Gentle wood crackles and pops, very warm and slow. No music, no voices. Cozy, comforting ambient loop, low frequencies, distant and muffled, like sitting next to a hearth in a quiet room. Seamless ambience.",
  "morning-sky":
    "Soft dawn chorus of small forest birds, very distant and gentle, with a faint warm breeze. No traffic, no music, no human voices. Calm, airy, hopeful morning ambience. Seamless loop.",
  leaves:
    "Gentle wind softly rustling through leaves of trees, calm forest ambience, no music, no voices, no animals. Very soft, organic, continuous. Like a slow breath through a summer canopy. Seamless loop.",
  "rose-mist":
    "Very soft, gentle rain on leaves, muffled and distant, no thunder, no music, no voices. Calm, dreamy, intimate. Like light rain heard from inside a cottage at dusk. Seamless ambient loop.",
  "evening-gold":
    "Calm ocean waves gently lapping on a soft shore at sunset, distant and slow, no seagulls, no music, no voices. Warm, golden, peaceful. Seamless ambient loop.",
};

async function generateAndCache(id: string): Promise<string> {
  const prompt = PROMPTS[id];
  if (!prompt) throw new Error("unknown scene");

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");

  const res = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: prompt,
      duration_seconds: 22,
      prompt_influence: 0.55,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${err.slice(0, 200)}`);
  }
  const buf = new Uint8Array(await res.arrayBuffer());

  const path = `${id}.mp3`;
  const { error: upErr } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buf, { contentType: "audio/mpeg", upsert: true });
  if (upErr) throw upErr;

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export const Route = createFileRoute("/api/public/souffle-sound/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = params.id.replace(/\.mp3$/, "");
        if (!PROMPTS[id]) {
          return new Response("Not found", { status: 404 });
        }

        const path = `${id}.mp3`;
        // Check if already cached
        const { data: existing } = await supabaseAdmin.storage
          .from(BUCKET)
          .list("", { search: path });
        const hit = existing?.find((f) => f.name === path);

        let publicUrl: string;
        if (hit) {
          publicUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path).data
            .publicUrl;
        } else {
          try {
            publicUrl = await generateAndCache(id);
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            return new Response(`Generation failed: ${msg}`, { status: 502 });
          }
        }

        return new Response(null, {
          status: 302,
          headers: {
            Location: publicUrl,
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});