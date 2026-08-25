import { useEffect, useState } from "react";
import type { Chapter } from "@/content/site";

export function ChapterNav({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "opening");

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -45%", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav
      aria-label="章节目录"
      className="fixed right-8 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      <ol className="border-r border-border pr-4">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              aria-label={chapter.label}
              className={`group flex h-9 items-center justify-end gap-3 text-[0.65rem] uppercase transition-colors ${active === chapter.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              aria-current={active === chapter.id ? "step" : undefined}
            >
              <span className="font-mono">{chapter.index}</span>
              <span
                className={`h-px transition-all duration-300 ${active === chapter.id ? "w-8 bg-primary" : "w-3 bg-border"}`}
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
