import { createFileRoute } from "@tanstack/react-router";
import { ReturnHomeLink } from "@/components/ReturnHomeLink";

export const Route = createFileRoute("/trajectory")({
  head: () => ({
    meta: [
      { title: "八十六节课的轨迹 · Cambly 半年回忆录" },
      {
        name: "description",
        content: "从 86 节课、41.75 小时通话与 91,101 个词中读出半年的学习轨迹。",
      },
      { property: "og:title", content: "八十六节课的轨迹 · Cambly 半年回忆录" },
      { property: "og:description", content: "从完整课程数据中读出半年学习节奏的变化。" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: TrajectoryPage,
});

function TrajectoryPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="grain-overlay" />
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-6 backdrop-blur-md md:px-12">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6">
          <ReturnHomeLink className="font-display text-xl text-foreground transition-colors hover:text-primary">
            Memoir <i>H1</i>
          </ReturnHomeLink>
          <h1 className="truncate text-sm font-normal text-foreground md:text-base">
            八十六节课的轨迹
          </h1>
          <ReturnHomeLink className="text-[0.65rem] uppercase text-muted-foreground transition-colors hover:text-primary">
            Index ↑
          </ReturnHomeLink>
        </div>
      </header>
      <iframe
        src="/content/create/trajectory_report.html"
        title="八十六节课的轨迹"
        className="block min-h-[calc(100vh-4rem)] w-full border-0 bg-[#f2f0e6]"
      />
    </main>
  );
}
