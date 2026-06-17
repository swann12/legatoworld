import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Circles ----------

export const listMyCircles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: memberships, error: e1 } = await supabase
      .from("circle_members")
      .select("circle_id, role, status")
      .eq("user_id", userId)
      .eq("status", "active");
    if (e1) throw new Error(e1.message);
    const ids = (memberships ?? []).map((m) => m.circle_id);
    if (ids.length === 0) return { circles: [] };
    const { data, error } = await supabase
      .from("circles")
      .select("id, name, defunt_name, owner_id, created_at")
      .in("id", ids)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { circles: data ?? [] };
  });

export const createCircle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { name: string; defunt_name?: string }) =>
    z.object({ name: z.string().min(1).max(80), defunt_name: z.string().max(80).optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: circle, error } = await supabase
      .from("circles")
      .insert({ owner_id: userId, name: data.name, defunt_name: data.defunt_name ?? null })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    const { error: memErr } = await supabase
      .from("circle_members")
      .insert({ circle_id: circle.id, user_id: userId, role: "owner", status: "active" });
    if (memErr) throw new Error(memErr.message);
    return { id: circle.id };
  });

export const getCircle = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { circleId: string }) => z.object({ circleId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const [{ data: circle, error: e1 }, { data: members, error: e2 }, { data: items, error: e3 }, { data: invites, error: e4 }] =
      await Promise.all([
        supabase.from("circles").select("id, name, defunt_name, owner_id, created_at").eq("id", data.circleId).single(),
        supabase
          .from("circle_members")
          .select("id, user_id, email, role, status, display_name")
          .eq("circle_id", data.circleId),
        supabase
          .from("shared_items")
          .select("id, kind, title, payload, author_id, assignee_id, status, created_at")
          .eq("circle_id", data.circleId)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("circle_invites")
          .select("token, email, role, expires_at, accepted_at, created_at")
          .eq("circle_id", data.circleId)
          .is("accepted_at", null),
      ]);
    if (e1) throw new Error(e1.message);
    if (e2) throw new Error(e2.message);
    if (e3) throw new Error(e3.message);
    if (e4) throw new Error(e4.message);
    return { circle, members: members ?? [], items: items ?? [], invites: invites ?? [] };
  });

// ---------- Invitations ----------

function randomToken(): string {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const createInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { circleId: string; email?: string; role?: "proche" | "aidant" }) =>
    z
      .object({
        circleId: z.string().uuid(),
        email: z.string().email().optional(),
        role: z.enum(["proche", "aidant"]).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const token = randomToken();
    const { error } = await supabase.from("circle_invites").insert({
      token,
      circle_id: data.circleId,
      email: data.email ?? null,
      role: data.role ?? "proche",
      invited_by: userId,
    });
    if (error) throw new Error(error.message);
    return { token };
  });

export const acceptInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { token: string }) => z.object({ token: z.string().min(8) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context;
    const { data: invite, error: e1 } = await supabase
      .from("circle_invites")
      .select("token, circle_id, email, role, expires_at, accepted_at")
      .eq("token", data.token)
      .single();
    if (e1 || !invite) throw new Error("Invitation introuvable.");
    if (invite.accepted_at) throw new Error("Invitation déjà utilisée.");
    if (new Date(invite.expires_at).getTime() < Date.now()) throw new Error("Invitation expirée.");

    // upsert membership (active)
    const email = (claims as any)?.email ?? null;
    const { error: e2 } = await supabase.from("circle_members").upsert(
      {
        circle_id: invite.circle_id,
        user_id: userId,
        email,
        role: invite.role,
        status: "active",
      },
      { onConflict: "circle_id,user_id" },
    );
    if (e2) throw new Error(e2.message);
    // mark invite accepted (owner-only RLS update; use server admin path via update with explicit token match)
    await supabase.from("circle_invites").update({ accepted_at: new Date().toISOString() }).eq("token", data.token);
    return { circleId: invite.circle_id };
  });

// ---------- Shared items ----------

export const shareItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    circleId: string;
    kind: "task" | "memory" | "text" | "wish" | "doc" | "note";
    title: string;
    payload?: Record<string, unknown>;
    assigneeId?: string | null;
    status?: "open" | "in_progress" | "blocked" | "done" | "delegated";
  }) =>
    z
      .object({
        circleId: z.string().uuid(),
        kind: z.enum(["task", "memory", "text", "wish", "doc", "note"]),
        title: z.string().min(1).max(200),
        payload: z.record(z.unknown()).optional(),
        assigneeId: z.string().uuid().nullable().optional(),
        status: z.enum(["open", "in_progress", "blocked", "done", "delegated"]).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("shared_items")
      .insert({
        circle_id: data.circleId,
        kind: data.kind,
        title: data.title,
        payload: (data.payload ?? {}) as any,
        author_id: userId,
        assignee_id: data.assigneeId ?? null,
        status: data.status ?? (data.kind === "task" ? "open" : null),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateItemStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status: "open" | "in_progress" | "blocked" | "done" | "delegated" }) =>
    z.object({ id: z.string().uuid(), status: z.enum(["open", "in_progress", "blocked", "done", "delegated"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("shared_items").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });