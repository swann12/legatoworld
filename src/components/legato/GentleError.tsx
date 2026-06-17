export function GentleError({
  message = "Quelque chose n'a pas pu charger.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="paper-card p-5 max-w-[42ch]">
      <p className="eyebrow text-dusk/70">Petit accroc</p>
      <p className="mt-2 text-[14.5px] text-dusk/80 leading-[1.55]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 btn-ghost px-4 py-2 rounded-[12px] text-[13px] min-h-11"
        >
          Réessayer doucement
        </button>
      )}
    </div>
  );
}