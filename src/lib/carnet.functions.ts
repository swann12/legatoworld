import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* Le carnet et « Qui fait quoi » d'un espace « proche malade », partagés
   avec le cercle de l'espace (un cercle par espace, retrouvé par son nom). */

export const loadCarnet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { spaceName: string }) => z.object({ spaceName: z.string().min(1).max(80) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: mine } = await supabase.from("circle_members").select("circle_id").eq("user_id", userId).eq("status", "active");
    const ids = (mine ?? []).map((m) => m.circle_id);
    let circleId: string | null = null;
    if (ids.length) {
      const { data: found } = await supabase.from("circles").select("id").in("id", ids).eq("name", data.spaceName).order("created_at").limit(1);
      circleId = found?.[0]?.id ?? null;
    }
    if (!circleId) {
      const { data: c, error } = await supabase.from("circles").insert({ owner_id: userId, name: data.spaceName }).select("id").single();
      if (error) throw new Error(error.message);
      circleId = c.id;
      const { error: e2 } = await supabase.from("circle_members").insert({ circle_id: circleId, user_id: userId, role: "owner", status: "active" });
      if (e2) throw new Error(e2.message);
    }
    const [{ data: items, error: e3 }, { data: members }] = await Promise.all([
      supabase.from("shared_items").select("id, kind, title, payload, author_id, assignee_id, status, created_at").eq("circle_id", circleId).in("kind", ["note", "task"]).order("created_at", { ascending: false }).limit(200),
      supabase.from("circle_members").select("user_id, display_name, email, status").eq("circle_id", circleId).neq("status", "revoked"),
    ]);
    if (e3) throw new Error(e3.message);
    return {
      circleId, userId,
      items: (items ?? []).filter((i) => i.payload && typeof i.payload === "object" && "carnet" in (i.payload as object)),
      members: (members ?? []).filter((m) => m.user_id !== userId).map((m) => ({ id: m.user_id, name: m.display_name || m.email || "Un proche" })),
    };
  });

const payload = z.record(z.string(), z.unknown());

export const addCarnetItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { circleId: string; kind: "note" | "task"; title: string; payload: Record<string, unknown> }) =>
    z.object({ circleId: z.string().uuid(), kind: z.enum(["note", "task"]), title: z.string().min(1).max(300), payload }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase.from("shared_items").insert({
      circle_id: data.circleId, kind: data.kind, title: data.title, payload: data.payload as never, author_id: userId,
      status: data.kind === "task" ? "open" : null,
    }).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateCarnetItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; payload: Record<string, unknown> }) => z.object({ id: z.string().uuid(), payload }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("shared_items").update({ payload: data.payload as never }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const acceptCarnetTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: ok, error } = await context.supabase.rpc("accept_circle_task", { _item: data.id });
    if (error) throw new Error(error.message);
    return { ok: !!ok };
  });
