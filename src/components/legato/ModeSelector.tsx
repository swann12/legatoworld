import { MODES, useLegato, type Mode } from "@/lib/legato-state";

export function ModeSelector({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useLegato();

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto px-7 no-scrollbar">
        {MODES.map((m) => (
          <ModeChip key={m.id} m={m} active={mode === m.id} onClick={() => setMode(m.id)} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 px-7">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-dusk/40">
        Interior mode
      </p>
      <div className="grid grid-cols-2 gap-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`organic-radius-3 p-5 text-left transition-all ${
              mode === m.id ? "glass-card-accent" : "glass-card opacity-75 hover:opacity-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`size-2 rounded-full bg-dusk/28 ${mode === m.id ? "breath" : ""}`}
              />
              <span className="font-serif text-xl text-dusk">{m.label}</span>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-dusk/55">{m.whisper}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ModeChip({
  m,
  active,
  onClick,
}: {
  m: (typeof MODES)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 organic-radius px-5 py-3 transition-all ${
        active ? "glass-card-accent" : "glass-card opacity-70"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`size-1.5 rounded-full bg-dusk/25 ${active ? "breath" : ""}`}
        />
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-dusk/82">
          {m.label}
        </span>
      </div>
    </button>
  );
}