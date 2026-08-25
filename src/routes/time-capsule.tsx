import { createFileRoute } from "@tanstack/react-router";
import { MemoirArticle } from "@/components/MemoirArticle";
import { timeCapsulePage } from "@/content/special-pages";

export const Route = createFileRoute("/time-capsule")({
  head: () => ({
    meta: [
      { title: "时间胶囊 · Cambly 半年回忆录" },
      { name: "description", content: timeCapsulePage.description },
      { property: "og:title", content: "时间胶囊 · Cambly 半年回忆录" },
      { property: "og:description", content: timeCapsulePage.description },
      { property: "og:type", content: "article" },
    ],
  }),
  component: () => <MemoirArticle page={timeCapsulePage} />,
});
