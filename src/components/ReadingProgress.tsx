export function ReadingProgressBar({ progress }: { progress: number }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-px bg-border"
      role="progressbar"
      aria-label="阅读进度"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className="h-px origin-left bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
