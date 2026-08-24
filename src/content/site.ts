// 站点文案集中在此，替换文字即可，无需改动组件。

export const site = {
  title: "半年，与世界连线",
  subtitle: "我在 Cambly 学英语的一段回忆录",
  period: "2025 年冬 — 2026 年夏",
};

export type Chapter = {
  id: string;
  index: string;
  label: string;
  headline: string;
  line: string;
  /** 章节主色，驱动背景画布的色彩过渡（0-1 RGB） */
  tint: [number, number, number];
};

export const chapters: Chapter[] = [
  {
    id: "opening",
    index: "00",
    label: "开场",
    headline: site.title,
    line: "一根网线，把一间小屋接到了另一个时区的清晨。",
    tint: [0.93, 0.9, 0.83],
  },
  {
    id: "start",
    index: "01",
    label: "起点",
    headline: "第一次连线",
    line: "十五分钟，说了不到十句话，却记了一整页。",
    tint: [0.88, 0.82, 0.72],
  },
  {
    id: "trace",
    index: "02",
    label: "轨迹",
    headline: "半年的节奏",
    line: "从每周三次，到几乎每天；从背句子，到忘记自己在说外语。",
    tint: [0.82, 0.8, 0.73],
  },
  {
    id: "voices",
    index: "03",
    label: "声音",
    headline: "那些留下来的句子",
    line: "有人纠正我的时态，也有人问我家乡的雨季。",
    tint: [0.78, 0.79, 0.74],
  },
  {
    id: "growth",
    index: "04",
    label: "生长",
    headline: "语言之外的东西",
    line: "英语只是介质，真正变了的是我敢不敢开口。",
    tint: [0.84, 0.81, 0.75],
  },
];

export type Entry = {
  to: string;
  index: string;
  label: string;
  hint: string;
};

export const entries: Entry[] = [
  { to: "/journey", index: "Ⅰ", label: "学习轨迹", hint: "半年的时间线" },
  { to: "/dialogues", index: "Ⅱ", label: "对话记录", hint: "留下来的片段" },
  { to: "/growth", index: "Ⅲ", label: "我的成长", hint: "反思与变化" },
  { to: "/notes", index: "Ⅳ", label: "零散记录", hint: "词句与随想" },
];
