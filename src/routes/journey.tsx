import { createFileRoute } from "@tanstack/react-router";
import { MemoirArticle } from "@/components/MemoirArticle";
import { journey } from "@/content/pages";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "学习轨迹 · Cambly 半年回忆录" },
      { name: "description", content: journey.description },
      { property: "og:title", content: "学习轨迹 · Cambly 半年回忆录" },
      { property: "og:description", content: journey.description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <MemoirArticle page={journey} />,
});
