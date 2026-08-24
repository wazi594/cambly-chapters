import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { chapters, entries } from "@/content/site";
import { QuoteDanmaku } from "@/components/QuoteDanmaku";
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
      <ChapterNav chapters={chapters} />


      {chapters.map((chapter, i) => (
        <ChapterSection key={chapter.id} chapter={chapter} first={i === 0}>
          {chapter.id === "opening" ? (
            <p className="font-display text-lg italic text-foreground/60">
              （待补齐）
            </p>
          ) : null}
          {chapter.id === "trace" ? <GrowingLine /> : null}
          {chapter.id === "voices" ? <QuoteDanmaku /> : null}

        </ChapterSection>
      ))}

       <section id="index" className="relative border-t border-border px-6 py-32 md:px-12">
         <div className="mx-auto w-full max-w-6xl">
           <div className="divide-y divide-border border-t border-foreground">

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
