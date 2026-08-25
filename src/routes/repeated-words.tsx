import { createFileRoute } from "@tanstack/react-router";
import { MemoirArticle } from "@/components/MemoirArticle";
import { repeatedWordsPage } from "@/content/special-pages";

export const Route = createFileRoute("/repeated-words")({
  head: () => ({
    meta: [
      { title: "反复说的话 · Cambly 半年回忆录" },
      { name: "description", content: repeatedWordsPage.description },
      { property: "og:title", content: "反复说的话 · Cambly 半年回忆录" },
      { property: "og:description", content: repeatedWordsPage.description },
      { property: "og:type", content: "article" },
    ],
  }),
  component: () => <MemoirArticle page={repeatedWordsPage} />,
});
