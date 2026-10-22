import rules from "./ajouts5/regles-aujourdhui-soutien-demarches.json";
import { scopedKey } from "./active-space";
import { localDay, type EmotionDay } from "./moteur-legato";
export const emotionChoices = rules.emotions.liste;
export const validEmotions = (values: string[]) => emotionChoices.filter(value => values.includes(value));
export function readDailyEmotions(storage: Pick<Storage, "getItem">, key: string, now: Date): string[] {
  try {
    const saved = JSON.parse(storage.getItem(key) ?? "null") as EmotionDay | null;
    return saved?.day === localDay(now) && Array.isArray(saved.values) ? validEmotions(saved.values) : [];
  } catch { return []; }
}
export function writeDailyEmotions(storage: Pick<Storage, "getItem" | "setItem">, key: string, historyKey: string, values: string[], now: Date) {
  const day = localDay(now), selected = validEmotions(values);
  let history: EmotionDay[] = [];
  try { const saved = JSON.parse(storage.getItem(historyKey) ?? "[]"); if (Array.isArray(saved)) history = saved; } catch { /* ignore invalid history */ }
  storage.setItem(key, JSON.stringify({ day, values: selected }));
  storage.setItem(historyKey, JSON.stringify([...history.filter(entry => entry.day !== day), { day, values: selected }].slice(-90)));
  return selected;
}
export const loadTodayEmotions = (now = new Date()) => readDailyEmotions(localStorage, scopedKey("lg.today.emotions"), now);
export const saveTodayEmotions = (values: string[], now = new Date()) => writeDailyEmotions(localStorage, scopedKey("lg.today.emotions"), scopedKey("lg.today.emotion-history"), values, now);