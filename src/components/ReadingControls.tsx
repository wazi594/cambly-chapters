import { SIZE_STEPS, LEADING_STEPS, type ReadingPrefs } from "@/hooks/useReadingPrefs";

type Props = {
  prefs: ReadingPrefs;
  update: (next: Partial<ReadingPrefs>) => void;
  className?: string;
};

export function ReadingControls({ prefs, update, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Group
        label="字号"
        value={prefs.size}
        options={SIZE_STEPS.map((_, i) => ["A", "A", "A", "A"][i]!)}
        sizes={["text-[0.6rem]", "text-[0.72rem]", "text-[0.85rem]", "text-[1rem]"]}
        onChange={(size) => update({ size })}
      />
      <span className="h-4 w-px bg-border" aria-hidden />
      <Group
        label="行距"
        value={prefs.leading}
        options={LEADING_STEPS.map((_, i) => ["紧", "中", "松"][i]!)}
        onChange={(leading) => update({ leading })}
      />
    </div>
  );
}

function Group({
  label,
  value,
  options,
  sizes,
  onChange,
}: {
  label: string;
  value: number;
  options: string[];
  sizes?: string[];
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[0.55rem] uppercase text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        {options.map((option, i) => (
          <button
            key={`${label}-${i}`}
            type="button"
            onClick={() => onChange(i)}
            aria-pressed={value === i}
            aria-label={`${label} ${i + 1}`}
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-sm border transition-colors ${
              value === i
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            } ${sizes?.[i] ?? "text-[0.7rem]"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
