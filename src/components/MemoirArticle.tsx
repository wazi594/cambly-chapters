import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { prevOf, type MemoirPage } from "@/content/pages";
import { useReadingPrefs } from "@/hooks/useReadingPrefs";
import { ReadingControls } from "@/components/ReadingControls";
import { ReadingProgressBar, useReadingProgress } from "@/components/ReadingProgress";

export function MemoirArticle({ page }: { page: MemoirPage }) {
  const articleRef = useRef<HTMLElement>(null);
  const progress = useReadingProgress(articleRef);
  const { prefs, update, style } = useReadingPrefs();
  const prev = prevOf(page);

  return (
    <div className="min-h-screen bg-background">
      <div className="grain-overlay" />

      <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-6 backdrop-blur-md md:px-12">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Link to="/" className="shrink-0 font-display text-xl text-foreground transition-colors hover:text-primary">
              Memoir <i>H1</i>
            </Link>
            <p className="hidden truncate font-mono text-[0.6rem] uppercase text-muted-foreground sm:block">
              Archive / {page.index} · {Math.round(progress * 100)}%
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ReadingControls prefs={prefs} update={update} className="hidden md:flex" />
            <Link to="/" className="shrink-0 text-[0.65rem] uppercase text-muted-foreground transition-colors hover:text-primary">
              Index ↑
            </Link>
          </div>
        </div>
        <ReadingProgressBar progress={progress} />
      </header>

      <article ref={articleRef} className="mx-auto max-w-6xl px-6 pb-40 pt-16 md:px-12 md:pb-28">
        <header className="grid gap-10 border-b border-foreground pb-14 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-display text-3xl italic text-primary">{page.index}.</p>
            <h1 className="mt-5 text-6xl leading-none text-foreground md:text-8xl">{page.title}</h1>
          </div>
          <div className="flex flex-col justify-end md:col-span-4">
            <p className="text-sm uppercase text-muted-foreground">{page.subtitle}</p>
            <p className="mt-5 font-mono text-[0.6rem] uppercase leading-loose text-muted-foreground">PERSONAL ARCHIVE<br />LANGUAGE / MEMORY / GROWTH</p>
          </div>
        </header>

        <div className="mt-8 flex justify-center border-b border-border pb-6 md:hidden">
          <ReadingControls prefs={prefs} update={update} />
        </div>

        <div className="prose-memoir mx-auto mt-16 max-w-2xl space-y-10" style={style}>
          {page.blocks.map((block, i) => {
            switch (block.type) {
              case "h":
                return (
                  <h2 key={i} className="border-t border-border pt-10 text-[2em] leading-tight text-foreground">
                    {block.text}
                  </h2>
                );
              case "p":
                return (
                  <p key={i} className="text-[1em] text-foreground/85">
                    {block.text}
                  </p>
                );
              case "meta":
                return (
                  <p key={i} className="font-mono text-[0.65em] uppercase text-primary">
                    {block.text}
                  </p>
                );
              case "quote":
                return (
                  <blockquote key={i} className="my-16 -ml-0 border-l-2 border-primary py-3 pl-7 md:-ml-20">
                    <p className="font-display text-[2em] italic leading-snug text-foreground">{block.text}</p>
                    {block.source ? (
                      <cite className="mt-2 block text-[0.75em] text-muted-foreground not-italic">
                        — {block.source}
                      </cite>
                    ) : null}
                  </blockquote>
                );
              case "dialogue":
                return (
                  <div key={i} className="grid gap-2 border-l border-primary pl-6 md:grid-cols-[7rem_1fr]">
                    {block.who ? (
                      <p className="text-[0.7em] tracking-[0.3em] text-primary uppercase">
                        {block.who}
                      </p>
                    ) : null}
                    <div>
                      <p className="font-display text-[1.3em] italic text-foreground">{block.en}</p>
                      <p className="mt-2 text-[0.9em] text-muted-foreground">{block.zh}</p>
                    </div>
                  </div>
                );
              case "rule":
                return <hr key={i} className="rule-hairline border-0" />;
            }
          })}
        </div>

        <nav aria-label="文章导航" className="mt-24 grid gap-px overflow-hidden border-t border-foreground bg-border md:grid-cols-2">
          <Link
            to={prev.to}
            className="group flex flex-col gap-2 bg-background px-6 py-8 transition-colors hover:bg-secondary/40"
          >
            <span className="font-mono text-[0.6rem] uppercase text-muted-foreground">← 上一篇</span>
            <span className="text-2xl text-foreground transition-colors group-hover:text-primary">{prev.label}</span>
          </Link>
          <Link
            to={page.next.to}
            className="group flex flex-col gap-2 bg-background px-6 py-8 text-right transition-colors hover:bg-secondary/40 md:items-end"
          >
            <span className="font-mono text-[0.6rem] uppercase text-muted-foreground">下一篇 →</span>
            <span className="text-2xl text-foreground transition-colors group-hover:text-primary">{page.next.label}</span>
          </Link>
        </nav>

        <div className="mt-10 text-center">
          <Link to="/" className="text-xs tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary">
            返回主页
          </Link>
        </div>
      </article>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <Link to={prev.to} aria-label={`上一篇：${prev.label}`} className="grid h-10 w-10 place-items-center rounded-sm border border-border text-foreground">←</Link>
          <p className="truncate text-center font-mono text-[0.6rem] uppercase text-muted-foreground">
            {page.index} · {page.title} · {Math.round(progress * 100)}%
          </p>
          <Link to={page.next.to} aria-label={`下一篇：${page.next.label}`} className="grid h-10 w-10 place-items-center rounded-sm border border-border text-foreground">→</Link>
        </div>
      </div>
    </div>
  );
}
