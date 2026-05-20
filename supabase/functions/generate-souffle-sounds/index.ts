// Generates all souffle ambient sounds via ElevenLabs and uploads them
// to the public `souffle-sounds` bucket. Idempotent: skips files already present.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

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

const BUCKET = "souffle-sounds";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
  const supaUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ELEVENLABS_API_KEY missing" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supaUrl, serviceKey);
  const { data: existing } = await supabase.storage.from(BUCKET).list("");
  const have = new Set((existing ?? []).map((f) => f.name));

  const results: Record<string, string> = {};
  for (const [id, prompt] of Object.entries(PROMPTS)) {
    const fname = `${id}.mp3`;
    if (have.has(fname)) {
      results[id] = "cached";
      continue;
    }
    try {
      const res = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
        method: "POST",
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt, duration_seconds: 22, prompt_influence: 0.55 }),
      });
      if (!res.ok) {
        results[id] = `error ${res.status}: ${(await res.text()).slice(0, 120)}`;
        continue;
      }
      const buf = new Uint8Array(await res.arrayBuffer());
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(fname, buf, { contentType: "audio/mpeg", upsert: true });
      results[id] = upErr ? `upload error: ${upErr.message}` : "generated";
    } catch (e) {
      results[id] = `exception: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  // Public URLs for the client to use directly
  const urls: Record<string, string> = {};
  for (const id of Object.keys(PROMPTS)) {
    urls[id] = supabase.storage.from(BUCKET).getPublicUrl(`${id}.mp3`).data.publicUrl;
  }

  return new Response(JSON.stringify({ results, urls }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});