import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { chapters } from "@/content/site";
import { QuoteDanmaku } from "@/components/QuoteDanmaku";
import { ChapterSection } from "@/components/ChapterSection";
import { ChapterNav } from "@/components/ChapterNav";
import { GrowingLine } from "@/components/GrowingLine";
import { LightThresholdPortals } from "@/components/LightThresholdPortals";
import {
  StoriesEntrance,
  TrajectoryCollage,
  VoiceArchiveEntrances,
} from "@/components/ArchiveEntrances";
import { OpeningVideo } from "@/components/OpeningVideo";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const PaintedBackground = lazy(() => import("@/components/PaintedBackground"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "连接世界的半年 · Cambly 学习回忆录" },
      {
        name: "description",
        content: "我在 Cambly 学英语的回忆录：记录半年的学习轨迹、对话片段与成长变化。",
      },
      { property: "og:title", content: "连接世界的半年 · Cambly 学习回忆录" },
      {
        property: "og:description",
        content: "滚动阅读我在 Cambly 学英语的半年回忆录。",
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
        <ChapterSection
          key={chapter.id}
          chapter={chapter}
          first={i === 0}
          mediaChildren={
            chapter.id === "opening" ? (
              <OpeningVideo />
            ) : chapter.id === "trace" ? (
              <TrajectoryCollage />
            ) : chapter.id === "growth" ? (
              <LightThresholdPortals />
            ) : undefined
          }
        >
          {chapter.id === "start" ? <StoriesEntrance /> : null}
          {chapter.id === "trace" ? <GrowingLine /> : null}
          {chapter.id === "voices" ? (
            <>
              <QuoteDanmaku />
              <VoiceArchiveEntrances />
            </>
          ) : null}
        </ChapterSection>
      ))}
    </main>
  );
}
