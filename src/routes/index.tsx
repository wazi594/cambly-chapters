import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { chapters, entries, site } from "@/content/site";
import { ChapterSection } from "@/components/ChapterSection";
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

      <div className="pointer-events-none fixed top-8 left-6 z-20 md:left-12">
        <p className="text-[0.65rem] tracking-[0.4em] text-foreground/50">{site.period}</p>
      </div>

      {chapters.map((chapter, i) => (
        <ChapterSection key={chapter.id} chapter={chapter} first={i === 0}>
          {chapter.id === "opening" ? (
            <p className="font-serif-cn text-sm tracking-[0.3em] text-foreground/60">
              {site.subtitle} · 向下滚动
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

      <section className="relative px-6 py-32 md:px-16">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-xs tracking-[0.4em] text-muted-foreground">继续阅读</p>
          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {entries.map((entry) => (
              <Link
                key={entry.to}
                to={entry.to}
                className="group bg-background/70 px-8 py-12 backdrop-blur-sm transition-colors hover:bg-primary"
              >
                <span className="font-serif-cn text-xs tracking-[0.3em] text-primary transition-colors group-hover:text-primary-foreground">
                  {entry.index}
                </span>
                <p className="mt-6 font-serif-cn text-2xl text-foreground transition-colors group-hover:text-primary-foreground">
                  {entry.label}
                </p>
                <p className="mt-2 text-xs tracking-widest text-muted-foreground transition-colors group-hover:text-primary-foreground/80">
                  {entry.hint}
                </p>
              </Link>
            ))}
          </div>

          <p className="mt-20 text-center text-[0.65rem] tracking-[0.35em] text-foreground/40">
            CAMBLY · 半年 · 一份回忆录
          </p>
        </div>
      </section>
    </main>
  );
}
