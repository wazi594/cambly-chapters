import letterSource from "./source/cambly_letter.html?raw";
import capsuleSource from "./source/给一年后自己的时间胶囊.md?raw";
import storiesSource from "./source/我与老师们的故事.md?raw";
import repeatedWordsSource from "./source/反复说的话.md?raw";
import familyTracesSource from "./source/家人的痕迹.md?raw";
import { parseCapsuleMarkdown, parseLetterHtml } from "@/lib/content-parser";
import type { MemoirPage } from "@/content/pages";

export const letterPage: MemoirPage = {
  slug: "/letter",
  index: "Ⅴ",
  title: "给 Lou 的一封信",
  subtitle: "由你自己的话写成",
  description: "从 86 节 Cambly 课程的原始对话中，重新读一遍 Lou 走向新生活的半年。",
  blocks: parseLetterHtml(letterSource),
};

export const timeCapsulePage: MemoirPage = {
  slug: "/time-capsule",
  index: "Ⅵ",
  title: "时间胶囊",
  subtitle: "给一年后的自己",
  description: "封存于 2025 年 6 月，留给一年后 Lou 的承诺、建议与问题。",
  blocks: parseCapsuleMarkdown(capsuleSource),
};

export const storiesPage: MemoirPage = {
  slug: "/stories",
  index: "Ⅰ",
  title: "我们的故事",
  subtitle: "",
  description: "记录 Cambly 半年里，与九位老师之间真实、具体而双向的关系。",
  blocks: parseCapsuleMarkdown(storiesSource),
};

export const repeatedWordsPage: MemoirPage = {
  slug: "/repeated-words",
  index: "Ⅲ—A",
  title: "反复说的话",
  subtitle: "那些在不同课堂里一再出现的句子",
  description: "把反复说过的话按时间排列，看它们如何从对世界喊话变成与自己对话。",
  blocks: parseCapsuleMarkdown(repeatedWordsSource),
};

export const familyTracesPage: MemoirPage = {
  slug: "/family-traces",
  index: "Ⅲ—B",
  title: "家人的痕迹",
  subtitle: "半年对话里没有消失的暗线",
  description: "从母亲、父亲与外婆的片段里，重新看见出发前没有被解决的牵挂。",
  blocks: parseCapsuleMarkdown(familyTracesSource),
};
