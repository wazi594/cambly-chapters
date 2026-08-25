import { createFileRoute } from "@tanstack/react-router";
import { MemoirArticle } from "@/components/MemoirArticle";
import { storiesPage } from "@/content/special-pages";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "我们的故事 · Cambly 半年回忆录" },
      { name: "description", content: storiesPage.description },
      { property: "og:title", content: "我们的故事 · Cambly 半年回忆录" },
      { property: "og:description", content: storiesPage.description },
      { property: "og:type", content: "article" },
    ],
  }),
  component: () => <MemoirArticle page={storiesPage} />,
});
