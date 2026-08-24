import { useEffect, useState } from "react";

export const SIZE_STEPS = [0.9, 1, 1.15, 1.3] as const;
export const LEADING_STEPS = [1.7, 1.95, 2.2] as const;

export type ReadingPrefs = { size: number; leading: number };

const KEY = "memoir-reading-prefs";
const DEFAULTS: ReadingPrefs = { size: 1, leading: 1 };

export function useReadingPrefs() {
  const [prefs, setPrefs] = useState<ReadingPrefs>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ReadingPrefs>;
        setPrefs({
          size: clamp(parsed.size ?? 1, SIZE_STEPS.length),
          leading: clamp(parsed.leading ?? 1, LEADING_STEPS.length),
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  const update = (next: Partial<ReadingPrefs>) => {
    setPrefs((prev) => {
      const merged = { ...prev, ...next };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(merged));
      } catch {
        /* ignore */
      }
      return merged;
    });
  };

  return {
    prefs,
    update,
    style: {
      "--read-size": `${SIZE_STEPS[prefs.size]}rem`,
      "--read-leading": `${LEADING_STEPS[prefs.leading]}`,
    } as React.CSSProperties,
  };
}

function clamp(value: number, length: number) {
  return Math.min(Math.max(Math.round(value), 0), length - 1);
}
