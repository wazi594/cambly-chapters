import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { chapters, entries, site } from "@/content/site";
import { ChapterSection } from "@/components/ChapterSection";
import { ChapterNav } from "@/components/ChapterNav";
import { GrowingLine } from "@/components/GrowingLine";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const PaintedBackground = lazy(() => import("@/components/PaintedBackground"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "半年，与世界连线 · Cambly 学习回忆录" },
      {
        name: "description",
        content:
          "一份滚动式的英语学习回忆录：记录我在 Cambly 半年的学习轨迹、对话片段与成长变化。",
      },
      { property: "og:title", content: "半年，与世界连线 · Cambly 学习回忆录" },
      {
        property: "og:description",
        content: "滚动阅读我在 Cambly 学习英语半年的轨迹、对话与成长。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useSmoothScroll();

  return (
    <main className="relative">
      <ClientOnly fallback={<div className="fixed inset-0 -z-10 bg-background" />}>
        <Suspense fallback={<div className="fixed inset-0 -z-10 bg-background" />}>
          <PaintedBackground />
        </Suspense>
      </ClientOnly>
      <div className="grain-overlay" />
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 px-6 backdrop-blur-md md:px-12">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <a href="#opening" className="font-display text-xl text-foreground">Memoir <i>H1</i></a>
          <p className="hidden font-mono text-[0.6rem] uppercase text-muted-foreground md:block">{site.period}</p>
          <a href="#index" className="text-[0.65rem] uppercase text-foreground transition-colors hover:text-primary">Index ↓</a>
        </div>
      </header>
      <ChapterNav chapters={chapters} />

      {chapters.map((chapter, i) => (
        <ChapterSection key={chapter.id} chapter={chapter} first={i === 0}>
          {chapter.id === "opening" ? (
            <p className="font-display text-lg italic text-foreground/60">
              {site.subtitle} · Scroll to explore
            </p>
          ) : null}
          {chapter.id === "trace" ? <GrowingLine /> : null}
          {chapter.id === "voices" ? (
            <div className="space-y-4 font-serif-cn text-foreground/70 italic">
              <p>“Don't fix it. I understood you perfectly.”</p>
              <p className="pl-8">“What do people do all that rainy season?”</p>
              <p className="pl-16">“Let me back up a bit.”</p>
            </div>
          ) : null}
        </ChapterSection>
      ))}

       <section id="index" className="relative border-t border-border px-6 py-32 md:px-12">
         <div className="mx-auto w-full max-w-6xl">
           <div className="flex items-end justify-between border-b border-foreground pb-5">
             <div><p className="text-[0.65rem] uppercase text-primary">Archive index</p><h2 className="mt-3 text-5xl md:text-7xl">继续阅读</h2></div>
             <p className="hidden font-mono text-[0.6rem] text-muted-foreground md:block">04 ENTRIES / PERSONAL ARCHIVE</p>
           </div>
           <div className="divide-y divide-border">
            {entries.map((entry) => (
              <Link
                key={entry.to}
                to={entry.to}
                className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-8 transition-colors md:grid-cols-[6rem_1fr_1fr_auto]"
              >
                <span className="font-display text-2xl italic text-primary">{entry.index}</span>
                <p className="text-2xl text-foreground transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">{entry.label}</p>
                <p className="hidden text-xs text-muted-foreground md:block">{entry.hint}</p>
                <span className="font-display text-3xl text-primary transition-transform duration-300 group-hover:translate-x-2">→</span>
              </Link>
            ))}
          </div>

          <p className="mt-20 text-center text-[0.65rem] uppercase text-foreground/40">
            CAMBLY · 半年 · 一份回忆录
          </p>
        </div>
      </section>
    </main>
  );
}
