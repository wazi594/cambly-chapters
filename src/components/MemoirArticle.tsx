import { Link } from "@tanstack/react-router";
import type { MemoirPage } from "@/content/pages";

export function MemoirArticle({ page }: { page: MemoirPage }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grain-overlay" />

      <header className="border-b border-border px-6 py-6 md:px-12">
        <Link
          to="/"
          className="text-xs tracking-[0.3em] text-muted-foreground transition-colors hover:text-primary"
        >
          ← 回忆录
        </Link>
      </header>

      <article className="mx-auto max-w-2xl px-6 pt-20 pb-28 md:px-0">
        <p className="font-serif-cn text-sm tracking-[0.4em] text-primary">{page.index}</p>
        <h1 className="mt-6 font-serif-cn text-4xl leading-tight text-foreground md:text-5xl">
          {page.title}
        </h1>
        <p className="mt-4 text-sm tracking-widest text-muted-foreground">{page.subtitle}</p>

        <div className="prose-memoir mt-16 space-y-8">
          {page.blocks.map((block, i) => {
            switch (block.type) {
              case "h":
                return (
                  <h2 key={i} className="pt-8 font-serif-cn text-xl text-foreground md:text-2xl">
                    {block.text}
                  </h2>
                );
              case "p":
                return (
                  <p key={i} className="text-[0.975rem] text-foreground/85">
                    {block.text}
                  </p>
                );
              case "meta":
                return (
                  <p key={i} className="text-xs tracking-[0.25em] text-muted-foreground">
                    {block.text}
                  </p>
                );
              case "quote":
                return (
                  <blockquote key={i} className="border-l-2 border-primary/60 py-1 pl-6">
                    <p className="font-serif-cn text-lg text-foreground">{block.text}</p>
                    {block.source ? (
                      <cite className="mt-2 block text-xs text-muted-foreground not-italic">
                        — {block.source}
                      </cite>
                    ) : null}
                  </blockquote>
                );
              case "dialogue":
                return (
                  <div key={i} className="border-l border-border pl-6">
                    {block.who ? (
                      <p className="text-[0.7rem] tracking-[0.3em] text-primary uppercase">
                        {block.who}
                      </p>
                    ) : null}
                    <p className="mt-1 font-serif-cn text-base text-foreground italic">
                      {block.en}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{block.zh}</p>
                  </div>
                );
              case "rule":
                return <hr key={i} className="rule-hairline border-0" />;
            }
          })}
        </div>

        <footer className="mt-24 flex items-center justify-between border-t border-border pt-8">
          <Link
            to="/"
            className="text-xs tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary"
          >
            返回主页
          </Link>
          <Link
            to={page.next.to}
            className="font-serif-cn text-sm text-foreground transition-colors hover:text-primary"
          >
            {page.next.label} →
          </Link>
        </footer>
      </article>
    </div>
  );
}
