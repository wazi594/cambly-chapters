// 站点文案集中在此，替换文字即可，无需改动组件。
import deskImage from "@/assets/memoir-desk.jpg";
import learnerImage from "@/assets/memoir-learner.jpg";
import notesImage from "@/assets/memoir-notes.jpg";

export const site = {
  title: "连接世界的半年",
  subtitle: "我在 Cambly 学英语的回忆录",
  period: "2024 年冬 — 2025 年夏",
};

export type Chapter = {
  id: string;
  index: string;
  label: string;
  headline: string;
  line: string;
  /** 章节主色，驱动背景画布的色彩过渡（0-1 RGB） */
  tint: [number, number, number];
  /** 章节暗色，颜料的沉积与阴影（0-1 RGB） */
  deep: [number, number, number];
  /** 图片处理：image 正常显示，placeholder 保留版面留白，none 完全移除 */
  media?: "image" | "placeholder" | "none";
  /** 图片进场方式，逐章不同 */
  reveal: "wipe" | "curtain" | "iris" | "slats" | "tilt";
  image: string;
  imageAlt: string;
  figure: string;
  meta: string[];
  stat: {
    value: string;
    label: string;
    secondaryValue?: string;
    secondaryLabel?: string;
  };
  align: "image-left" | "image-right";
};

export const chapters: Chapter[] = [
  {
    id: "opening",
    index: "\n",
    label: "开场",
    headline: site.title,
    line: site.subtitle,
    tint: [0.93, 0.92, 0.85],
    deep: [0.64, 0.7, 0.62],
    reveal: "wipe",
    image: deskImage,
    imageAlt: "书桌上的笔记本电脑、手写笔记与咖啡",
    figure: "FIG. 00 — THE CONNECTION",
    meta: ["ARCHIVE: CAMBLY H1", "STATUS: OPENING FRAME"],
    stat: {
      value: "86",
      label: "CONVERSATIONS",
      secondaryValue: "26",
      secondaryLabel: "Teachers",
    },
    align: "image-right",
  },
  {
    id: "start",
    index: "01",
    label: "故事",
    headline: "我们的故事",
    line: "记录 Cambly 这半年里，九段真正留下痕迹的关系",
    tint: [0.88, 0.9, 0.86],
    deep: [0.45, 0.55, 0.58],
    media: "none",
    reveal: "curtain",
    image: learnerImage,
    imageAlt: "窗边使用电脑练习英语的学习者",
    figure: "FIG. 01 — FIRST CONTACT",
    meta: ["ENTRY ID: WINTER-001", "MODE: ORAL PRACTICE"],
    stat: { value: "09", label: "relationships remembered" },
    align: "image-left",
  },
  {
    id: "trace",
    index: "02",
    label: "轨迹",
    headline: "半年的节奏",
    line: "从每周三次，到几乎每天；从背句子，到忘记自己在说外语。",
    tint: [0.9, 0.87, 0.78],
    deep: [0.4, 0.5, 0.42],
    reveal: "slats",
    media: "placeholder",
    image: notesImage,
    imageAlt: "英语学习笔记、耳机与地图碎片",
    figure: "FIG. 02 — A LINE IN TIME",
    meta: ["SPAN: NOVEMBER—APRIL", "FREQUENCY: ALMOST DAILY"],
    stat: { value: "6", label: "months in motion" },
    align: "image-right",
  },
  {
    id: "voices",
    index: "03",
    label: "声音",
    headline: "那些留下来的句子",
    line: "有人纠正我的时态，也有人问我家乡的雨季。",
    tint: [0.85, 0.88, 0.92],
    deep: [0.3, 0.38, 0.55],
    reveal: "iris",
    media: "none",
    image: deskImage,
    imageAlt: "远程对话中的电脑与摊开的学习笔记",
    figure: "FIG. 03 — VOICES KEPT",
    meta: ["FORMAT: DIALOGUE FRAGMENTS", "LANGUAGE: EN / ZH"],
    stat: { value: "03", label: "sentences remembered" },
    align: "image-left",
  },
  {
    id: "growth",
    index: "04",
    label: "生长",
    headline: "语言之外的东西",
    line: "英语只是介质，真正变了的是我敢不敢开口。",
    tint: [0.94, 0.9, 0.82],
    deep: [0.52, 0.6, 0.48],
    reveal: "tilt",
    media: "placeholder",
    image: learnerImage,
    imageAlt: "在自然光下进行线上交流的学习者",
    figure: "FIG. 04 — BEYOND LANGUAGE",
    meta: ["MILESTONE: SPEAKING FREELY", "STATUS: STILL GROWING"],
    stat: { value: "∞", label: "connections ahead" },
    align: "image-right",
  },
];
