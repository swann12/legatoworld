import { Button } from "@/components/ui/button";
import { emotionChoices } from "@/lib/daily-emotions";
export function EmotionChoices({ picked, onChange }: { picked: string[]; onChange: (values: string[]) => void }) {
  return <div className="lg-emotion-choices flex flex-wrap gap-2">{emotionChoices.map(label => <Button key={label} variant="outline" aria-pressed={picked.includes(label)} onClick={() => onChange(picked.includes(label) ? picked.filter(value => value !== label) : [...picked, label])}>{label}</Button>)}</div>;
}