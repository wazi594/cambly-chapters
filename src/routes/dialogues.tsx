import { createFileRoute } from "@tanstack/react-router";
import { MemoirArticle } from "@/components/MemoirArticle";
import { dialogues } from "@/content/pages";

export const Route = createFileRoute("/dialogues")({
  head: () => ({
    meta: [
      { title: "对话记录 · Cambly 半年回忆录" },
      { name: "description", content: dialogues.description },
      { property: "og:title", content: "对话记录 · Cambly 半年回忆录" },
      { property: "og:description", content: dialogues.description },
    ],
  }),
  component: () => <MemoirArticle page={dialogues} />,
});
