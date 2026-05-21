import { useEffect, useState, type ReactNode } from "react";
import { BloomFlower, SoftToast } from "./BloomFlower";

const STORE_KEY = "legato.help.checks";

type Store = Record<string, boolean>;

function load(): Store {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }
  catch { return {}; }
}
function save(s: Store) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {}
}

const TOASTS = [
  "C'est noté. C'est suffisant pour maintenant.",
  "Bien.",
  "C'est fait.",
  "Prenez votre temps.",
  "C'est suffisant pour aujourd'hui.",
];

/** Carte cochable glassmorphism avec micro-illustration en SVG simple,
 *  fleur qui éclôt et message doux au tap. La carte ne disparaît jamais —
 *  elle reste accessible. L'état est persisté en localStorage. */
export function CheckableCard({
  id,
  icon,
  title,
  body,
  toast,
}: {
  id: string;
  icon?: ReactNode;
  title: string;
  body: ReactNode;
  toast?: string;
}) {
  const [checked, setChecked] = useState(false);
  const [bloom, setBloom] = useState<{ x: number; y: number } | null>(null);
  const [toastText, setToastText] = useState<string | null>(null);

  useEffect(() => { setChecked(!!load()[id]); }, [id]);

  const onTap = (e: React.MouseEvent) => {
    if (checked) return;
    const store = load();
    store[id] = true;
    save(store);
    setChecked(true);
    setBloom({ x: e.clientX, y: e.clientY });
    setToastText(toast || TOASTS[Math.floor(Math.random() * TOASTS.length)]);
  };

  return (
    <>
      <button
        type="button"
        onClick={onTap}
        aria-pressed={checked}
        className={`w-full text-left glass-card organic-radius-3 px-6 py-5 flex items-start gap-4 transition-all ${
          checked ? "opacity-65" : "hover:opacity-95"
        }`}
      >
        {icon && (
          <div className="shrink-0 size-12 rounded-full flex items-center justify-center bg-white/50 text-dusk/70">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif italic text-[17px] leading-snug text-dusk">{title}</h3>
          <div className="mt-1.5 text-[13px] leading-relaxed text-dusk/65">{body}</div>
        </div>
        <span
          className={`shrink-0 size-5 rounded-full border transition-colors ${
            checked
              ? "bg-dusk/65 border-dusk/65"
              : "border-dusk/30"
          }`}
          aria-hidden
        />
      </button>
      {bloom && <BloomFlower x={bloom.x} y={bloom.y} onDone={() => setBloom(null)} />}
      {toastText && <SoftToast text={toastText} onDone={() => setToastText(null)} />}
    </>
  );
}