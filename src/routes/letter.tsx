import { createFileRoute } from "@tanstack/react-router";
import { MemoirArticle } from "@/components/MemoirArticle";
import { letterPage } from "@/content/special-pages";

export const Route = createFileRoute("/letter")({
  head: () => ({
    meta: [
      { title: "给 Lou 的一封信 · Cambly 半年回忆录" },
      { name: "description", content: letterPage.description },
      { property: "og:title", content: "给 Lou 的一封信 · Cambly 半年回忆录" },
      { property: "og:description", content: letterPage.description },
      { property: "og:type", content: "article" },
    ],
  }),
  component: () => <MemoirArticle page={letterPage} />,
});
