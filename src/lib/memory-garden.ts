import type { Memory, MemoryType } from "./memories-store";
export const MEMORY_ZONES = [
  { id: "photo", label: "Photos", title: "Ses photos", type: "photo" as MemoryType },
  { id: "voix", label: "Sa voix", title: "Sa voix", type: "voice" as MemoryType },
  { id: "lettre", label: "Lettres", title: "Lettres et mots", type: "text" as MemoryType },
  { id: "lieu", label: "Lieux", title: "Les lieux", type: "text" as MemoryType },
];
export function canonicalZone(zone: string) {
  return ({ photos: "photo", lettres: "lettre", lieux: "lieu", voice: "voix", text: "lettre" } as Record<string, string>)[zone] ?? zone;
}
export function memoriesInZone(list: Memory[], zone: string): Memory[] {
  const id = canonicalZone(zone);
  return list.filter(m => {
    const own = canonicalZone(m.zone);
    if (id === "lettre") return own === "lettre" || own === "citation" || (m.type === "sentence" && own !== "lieu");
    return own === id;
  }).sort((a, b) => b.createdAt - a.createdAt);
}
export function newestMemories(list: Memory[]) { return [...list].sort((a, b) => b.createdAt - a.createdAt); }
export function memoryKind(m: Memory) {
  if (canonicalZone(m.zone) === "lieu") return "Lieu";
  return ({ photo: "Photo", voice: "Message vocal", sentence: "Une phrase", text: "Un texte", sound: "Musique" })[m.type];
}
export function memoryDate(m: Memory) { return m.when || new Date(m.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }); }
export function memoryBookPages(count: number) { return Math.max(4, Math.ceil((count * 2 + 4) / 4) * 4); }