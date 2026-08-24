import { Link } from "@tanstack/react-router";
import type { MemoirPage } from "@/content/pages";

export function MemoirArticle({ page }: { page: MemoirPage }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grain-overlay" />

      <header className="border-b border-border px-6 md:px-12">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
          <Link to="/" className="font-display text-xl text-foreground transition-colors hover:text-primary">Memoir <i>H1</i></Link>
          <p className="font-mono text-[0.6rem] uppercase text-muted-foreground">Archive / {page.index}</p>
          <Link to="/" className="text-[0.65rem] uppercase text-muted-foreground transition-colors hover:text-primary">Index ↑</Link>
        </div>
      </header>

      <article className="mx-auto max-w-6xl px-6 pb-28 pt-16 md:px-12">
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

        <div className="prose-memoir mx-auto mt-20 max-w-2xl space-y-10">
          {page.blocks.map((block, i) => {
            switch (block.type) {
              case "h":
                return (
                  <h2 key={i} className="border-t border-border pt-10 text-3xl text-foreground md:text-4xl">
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
                  <p key={i} className="font-mono text-[0.65rem] uppercase text-primary">
                    {block.text}
                  </p>
                );
              case "quote":
                return (
                  <blockquote key={i} className="my-16 -ml-0 border-l-2 border-primary py-3 pl-7 md:-ml-20">
                    <p className="font-display text-3xl italic leading-snug text-foreground md:text-4xl">{block.text}</p>
                    {block.source ? (
                      <cite className="mt-2 block text-xs text-muted-foreground not-italic">
                        — {block.source}
                      </cite>
                    ) : null}
                  </blockquote>
                );
              case "dialogue":
                return (
                  <div key={i} className="grid gap-2 border-l border-primary pl-6 md:grid-cols-[7rem_1fr]">
                    {block.who ? (
                      <p className="text-[0.7rem] tracking-[0.3em] text-primary uppercase">
                        {block.who}
                      </p>
                    ) : null}
                    <div><p className="font-display text-xl italic text-foreground">{block.en}</p><p className="mt-2 text-sm text-muted-foreground">{block.zh}</p></div>
                  </div>
                );
              case "rule":
                return <hr key={i} className="rule-hairline border-0" />;
            }
          })}
        </div>

        <footer className="mt-24 flex items-center justify-between border-t border-foreground pt-8">
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
