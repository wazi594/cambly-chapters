import { useRef } from "react";
import type { MemoirPage } from "@/content/pages";
import { ReadingProgressBar } from "@/components/ReadingProgress";
import { ReturnHomeLink } from "@/components/ReturnHomeLink";
import { useReadingProgress } from "@/hooks/useReadingProgress";

export function MemoirArticle({ page }: { page: MemoirPage }) {
  const articleRef = useRef<HTMLElement>(null);
  const progress = useReadingProgress(articleRef);

  const storyHeadingId = (text: string, index: number) => {
    const anchors = [
      ["Peter", "peter"],
      ["Susan Munro", "susan-munro"],
      ["Connie N", "connie-n"],
      ["Ellie / BJ", "ellie-bj"],
      ["Ian Smith", "ian-smith"],
      ["Olivia", "olivia"],
      ["Kenneth D", "kenneth-d"],
      ["Sally HS", "sally-hs"],
      ["Tutor Mark", "tutor-mark"],
    ] as const;
    return anchors.find(([name]) => text.includes(name))?.[1] ?? `section-${index + 1}`;
  };

  const storyHeadingParts = (text: string) => {
    if (page.slug !== "/stories") return null;
    const match = text.match(/^(.+?)\((\d+\s*节课)，(.+)\)$/);
    if (!match) return null;
    return { name: match[1], meta: `${match[2]}，${match[3]}` };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grain-overlay" />

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/96 px-5 md:px-8">
        <div className="relative mx-auto flex h-12 max-w-6xl items-center justify-between">
          <ReturnHomeLink className="text-xs tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary">
            ← 返回首页
          </ReturnHomeLink>
          <p className="pointer-events-none absolute left-1/2 hidden max-w-[45vw] -translate-x-1/2 truncate text-xs text-foreground/55 md:block">
            {page.title}
          </p>
        </div>
        <ReadingProgressBar progress={progress} />
      </header>

      <article
        ref={articleRef}
        data-memoir-article="true"
        className="mx-auto max-w-5xl px-6 pb-24 pt-14 md:px-12 md:pb-28 md:pt-20"
      >
        <header className="mx-auto max-w-3xl border-b border-foreground/70 pb-10 md:pb-12">
          <p className="font-display text-xl italic text-primary">{page.index}.</p>
          <h1 className="mt-4 max-w-3xl text-[2.375rem] leading-[1.08] text-foreground md:text-[3.5rem]">
            {page.title}
          </h1>
          {page.subtitle ? (
            <p className="mt-6 text-[0.95rem] leading-relaxed text-foreground/65">
              {page.subtitle}
            </p>
          ) : null}
        </header>

        <div className="prose-memoir mx-auto mt-14 max-w-[45rem] space-y-8 md:mt-16 md:space-y-10">
          {page.blocks.map((block, i) => {
            switch (block.type) {
              case "h": {
                const headingParts = storyHeadingParts(block.text);
                return (
                  <h2
                    id={storyHeadingId(block.text, i)}
                    key={i}
                    className="scroll-mt-24 border-t border-border pt-10 text-[1.75rem] leading-[1.3] text-foreground md:text-[2rem]"
                  >
                    {headingParts ? (
                      <>
                        <span className="story-teacher-name">{headingParts.name}</span>
                        <span className="story-teacher-meta">{headingParts.meta}</span>
                      </>
                    ) : (
                      block.text
                    )}
                  </h2>
                );
              }
              case "p":
                return (
                  <p key={i} className="text-foreground/85">
                    {block.text}
                  </p>
                );
              case "meta":
                return (
                  <p key={i} className="font-mono text-xs leading-relaxed text-primary">
                    {block.text}
                  </p>
                );
              case "quote":
                return (
                  <blockquote key={i} data-memoir-quote="true" className="memoir-quote">
                    <span aria-hidden className="memoir-quote-mark">
                      “
                    </span>
                    <p className="font-quote text-[1.5rem] italic leading-[1.45] text-foreground md:text-[1.875rem]">
                      {block.text}
                    </p>
                    {block.source ? (
                      <cite className="mt-4 block text-xs leading-relaxed text-muted-foreground not-italic">
                        — {block.source}
                      </cite>
                    ) : null}
                  </blockquote>
                );
              case "dialogue":
                return (
                  <div
                    key={i}
                    className="grid gap-3 border-l border-primary/70 pl-5 md:grid-cols-[6rem_1fr] md:pl-6"
                  >
                    {block.who ? (
                      <p className="text-xs tracking-[0.22em] text-primary uppercase">
                        {block.who}
                      </p>
                    ) : null}
                    <div>
                      <p className="font-quote text-[1.35rem] italic leading-relaxed text-foreground md:text-[1.5rem]">
                        {block.en}
                      </p>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                        {block.zh}
                      </p>
                    </div>
                  </div>
                );
              case "rule":
                return <hr key={i} className="rule-hairline border-0" />;
            }
          })}
        </div>

        <div className="mx-auto mt-20 max-w-[45rem] border-t border-border pt-8 text-center">
          <ReturnHomeLink className="text-xs tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary">
            返回首页 ↑
          </ReturnHomeLink>
        </div>
      </article>
    </div>
  );
}
