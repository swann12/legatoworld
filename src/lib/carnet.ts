import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { scopedKey } from "@/lib/active-space";
import { getDiscovery } from "@/lib/discovery";
import { useActiveSpace } from "@/lib/use-active-space";
import { loadCarnet, addCarnetItem, updateCarnetItem, acceptCarnetTask } from "@/lib/carnet.functions";
import type { Rdv, CarnetNote, Task } from "@/lib/carnet-model";

/* Carnet partagé avec le cercle quand on est connecté ; sinon gardé sur le téléphone. */
type Data = { rdvs: Rdv[]; notes: CarnetNote[]; tasks: Task[]; members: { id: string; name: string }[] };
const EMPTY: Data = { rdvs: [], notes: [], tasks: [], members: [] };
const KEY = "lg.carnet.v1";
const uid = () => Math.random().toString(36).slice(2, 10);

function readLocal(): Data {
  try { const raw = window.localStorage.getItem(scopedKey(KEY)); return raw ? { ...EMPTY, ...JSON.parse(raw), members: [] } : EMPTY; } catch { return EMPTY; }
}
function writeLocal(d: Data) { try { window.localStorage.setItem(scopedKey(KEY), JSON.stringify({ rdvs: d.rdvs, notes: d.notes, tasks: d.tasks })); } catch { /* rien */ } }

type Row = { id: string; kind: string; title: string; payload: unknown; author_id: string; assignee_id: string | null; status: string | null; created_at: string };
function fromRows(rows: Row[], userId: string, members: { id: string; name: string }[]): Omit<Data, "members"> {
  const d: Omit<Data, "members"> = { rdvs: [], notes: [], tasks: [] };
  for (const r of rows) {
    const p = r.payload as Record<string, unknown>;
    if (p.carnet === "rdv") d.rdvs.push({ id: r.id, who: r.title, date: String(p.date ?? ""), time: p.time as string | undefined, place: p.place as string | undefined, with: p.with as string | undefined, questions: (p.questions as string[]) ?? [] });
    else if (p.carnet === "note") d.notes.push({ id: r.id, text: r.title, date: String(p.date ?? r.created_at.slice(0, 10)), label: p.label as string | undefined });
    else if (p.carnet === "task") d.tasks.push({
      id: r.id, what: r.title, when: String(p.when ?? ""), askedTo: (p.askedTo as string[]) ?? [],
      accepted: !!r.assignee_id, assignee: r.assignee_id ? (r.assignee_id === userId ? "Vous" : members.find((m) => m.id === r.assignee_id)?.name ?? "Un proche") : null,
      mine: r.author_id === userId,
    });
  }
  return d;
}

export function useCarnet() {
  const { space } = useActiveSpace();
  const [data, setData] = useState<Data>(EMPTY);
  const [shared, setShared] = useState<{ circleId: string } | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!space) return;
    const { data: s } = await supabase.auth.getSession();
    if (s.session && !getDiscovery().active) {
      try {
        const r = await loadCarnet({ data: { spaceName: space.name } });
        setShared({ circleId: r.circleId });
        setData({ ...fromRows(r.items as Row[], r.userId, r.members), members: r.members });
        setReady(true); return;
      } catch { /* repli local */ }
    }
    setShared(null); setData(readLocal()); setReady(true);
  }, [space?.id, space?.name]);
  useEffect(() => { void refresh(); }, [refresh]);

  const saveLocal = (fn: (d: Data) => Data) => setData((d) => { const n = fn(d); writeLocal(n); return n; });

  const addRdv = async (r: Omit<Rdv, "id">) => {
    if (shared) { await addCarnetItem({ data: { circleId: shared.circleId, kind: "note", title: r.who, payload: { carnet: "rdv", date: r.date, time: r.time, place: r.place, with: r.with, questions: r.questions } } }); return refresh(); }
    saveLocal((d) => ({ ...d, rdvs: [...d.rdvs, { ...r, id: uid() }] }));
  };
  const setQuestions = async (id: string, questions: string[]) => {
    const r = data.rdvs.find((x) => x.id === id); if (!r) return;
    if (shared) { await updateCarnetItem({ data: { id, payload: { carnet: "rdv", date: r.date, time: r.time, place: r.place, with: r.with, questions } } }); return refresh(); }
    saveLocal((d) => ({ ...d, rdvs: d.rdvs.map((x) => (x.id === id ? { ...x, questions } : x)) }));
  };
  const addNote = async (text: string, label?: string) => {
    const date = new Date().toISOString().slice(0, 10);
    if (shared) { await addCarnetItem({ data: { circleId: shared.circleId, kind: "note", title: text, payload: { carnet: "note", date, label } } }); return refresh(); }
    saveLocal((d) => ({ ...d, notes: [{ id: uid(), text, date, label }, ...d.notes] }));
  };
  const addTask = async (what: string, when: string, askedTo: string[]) => {
    if (shared) { await addCarnetItem({ data: { circleId: shared.circleId, kind: "task", title: what, payload: { carnet: "task", when, askedTo } } }); return refresh(); }
    saveLocal((d) => ({ ...d, tasks: [...d.tasks, { id: uid(), what, when, askedTo, accepted: false, mine: true }] }));
  };
  const askTask = async (id: string, askedTo: string[]) => {
    const t = data.tasks.find((x) => x.id === id); if (!t) return;
    if (shared) { await updateCarnetItem({ data: { id, payload: { carnet: "task", when: t.when, askedTo } } }); return refresh(); }
    saveLocal((d) => ({ ...d, tasks: d.tasks.map((x) => (x.id === id ? { ...x, askedTo } : x)) }));
  };
  const acceptTask = async (id: string) => {
    if (shared) { await acceptCarnetTask({ data: { id } }); return refresh(); }
  };

  return { ...data, ready, shared: !!shared, space, addRdv, setQuestions, addNote, addTask, askTask, acceptTask };
}
