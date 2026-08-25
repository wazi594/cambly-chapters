import { createFileRoute } from "@tanstack/react-router";
import { MemoirArticle } from "@/components/MemoirArticle";
import { familyTracesPage } from "@/content/special-pages";

export const Route = createFileRoute("/family-traces")({
  head: () => ({
    meta: [
      { title: "家人的痕迹 · Cambly 半年回忆录" },
      { name: "description", content: familyTracesPage.description },
      { property: "og:title", content: "家人的痕迹 · Cambly 半年回忆录" },
      { property: "og:description", content: familyTracesPage.description },
      { property: "og:type", content: "article" },
    ],
  }),
  component: () => <MemoirArticle page={familyTracesPage} />,
});
