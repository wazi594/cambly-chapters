import { createFileRoute } from "@tanstack/react-router";
import { MemoirArticle } from "@/components/MemoirArticle";
import { growth } from "@/content/pages";

export const Route = createFileRoute("/growth")({
  head: () => ({
    meta: [
      { title: "我的成长 · Cambly 半年回忆录" },
      { name: "description", content: growth.description },
      { property: "og:title", content: "我的成长 · Cambly 半年回忆录" },
      { property: "og:description", content: growth.description },
    ],
  }),
  component: () => <MemoirArticle page={growth} />,
});
