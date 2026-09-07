import type { ReactNode } from "react";

/** Sélection par touches — jamais de champ obligatoire. */
export function ChipSelect({
  options,
  value,
  onChange,
  multiple = false,
  max,
}: {
  options: { id: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  max?: number;
}) {
  const toggle = (id: string) => {
    if (!multiple) {
      onChange(value.includes(id) ? [] : [id]);
      return;
    }
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
      return;
    }
    if (max && value.length >= max) return;
    onChange([...value, id]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => toggle(o.id)}
            aria-pressed={on}
            className="rounded-full border px-4 py-2 text-[13px] transition-colors"
            style={{
              borderColor: on ? "transparent" : "color-mix(in oklab, var(--dusk) 15%, transparent)",
              background: on ? "var(--dusk)" : "transparent",
              color: on ? "var(--paper)" : "color-mix(in oklab, var(--dusk) 70%, transparent)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function QuestionBlock({
  label,
  question,
  hint,
  children,
}: {
  label?: string;
  question: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="px-6 pt-9">
      {label && <p className="mono-label">{label}</p>}
      <h2 className="mt-3 font-serif text-[21px] leading-[1.18] text-dusk max-w-[24ch]">{question}</h2>
      {hint && <p className="mt-2 text-[12.5px] text-dusk/55 max-w-[34ch]">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
