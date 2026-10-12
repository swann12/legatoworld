import { useEffect, useState } from "react";

/** Rendez-vous (écrans 044–047). Gardés sur l'appareil. */
export type Importance = "maintenir" | "reporter" | "annuler";
export type Appointment = {
  id: string; who: string; what?: string; place?: string; date: string; // ISO
  importance: Importance; visio?: boolean; withSomeone?: boolean; providerId?: string;
};

export const IMPORTANCE: Record<Importance, { label: string; hint: string }> = {
  maintenir: { label: "À maintenir", hint: "Legato vous proposera de vous faire accompagner" },
  reporter: { label: "Peut être reporté", hint: "Un message prêt pour décaler" },
  annuler: { label: "Peut être annulé", hint: "Sans conséquence" },
};

const KEY = "legato.appointments.v1";
const EVT = "legato:appointments";

function seed(): Appointment[] {
  const d = (days: number, h: number, m = 0) => { const x = new Date(); x.setDate(x.getDate() + days); x.setHours(h, m, 0, 0); return x.toISOString(); };
  return [
    { id: "a-psy", who: "Claire Rolland, psychologue", place: "12 rue Paradis", date: d(3, 10), importance: "reporter", providerId: "claire-rolland" },
    { id: "a-veillee", who: "Veillée en visio", what: "Le premier mois", date: d(4, 20), importance: "annuler", visio: true },
    { id: "a-notaire", who: "Maître Blanc, notaire", what: "ouvrir la succession", place: "3 cours Pierre Puget", date: d(9, 14, 30), importance: "maintenir" },
  ];
}

function read(): Appointment[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) { const s = seed(); localStorage.setItem(KEY, JSON.stringify(s)); return s; }
  try { return JSON.parse(raw); } catch { return []; }
}
function write(a: Appointment[]) { localStorage.setItem(KEY, JSON.stringify(a)); window.dispatchEvent(new Event(EVT)); }

export function addAppointment(a: Omit<Appointment, "id">) { const id = `a-${Date.now()}`; write([...read(), { ...a, id }]); return id; }
export function updateAppointment(id: string, patch: Partial<Appointment>) { write(read().map((a) => (a.id === id ? { ...a, ...patch } : a))); }
export function removeAppointment(id: string) { write(read().filter((a) => a.id !== id)); }

export function useAppointments() {
  const [list, setList] = useState<Appointment[] | null>(null);
  useEffect(() => { const f = () => setList(read()); f(); window.addEventListener(EVT, f); return () => window.removeEventListener(EVT, f); }, []);
  return list ? [...list].sort((a, b) => a.date.localeCompare(b.date)) : null;
}

export const fmtWhen = (iso: string) => {
  const d = new Date(iso);
  const day = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const h = `${d.getHours()} h${d.getMinutes() ? ` ${String(d.getMinutes()).padStart(2, "0")}` : ""}`;
  return { day: day.charAt(0).toUpperCase() + day.slice(1), hour: h, full: `${day.charAt(0).toUpperCase() + day.slice(1)}, ${h}` };
};
