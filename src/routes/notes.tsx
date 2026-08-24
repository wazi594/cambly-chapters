import { createFileRoute } from "@tanstack/react-router";
import { MemoirArticle } from "@/components/MemoirArticle";
import { notes } from "@/content/pages";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "零散记录 · Cambly 半年回忆录" },
      { name: "description", content: notes.description },
      { property: "og:title", content: "零散记录 · Cambly 半年回忆录" },
      { property: "og:description", content: notes.description },
    ],
  }),
  component: () => <MemoirArticle page={notes} />,
});
