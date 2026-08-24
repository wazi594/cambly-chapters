// 子页面长文内容：直接替换字符串即可。

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string; source?: string }
  | { type: "dialogue"; en: string; zh: string; who: string }
  | { type: "meta"; text: string }
  | { type: "rule" };

export type MemoirPage = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  blocks: Block[];
  next: { to: string; label: string };
};

export const journey: MemoirPage = {
  slug: "/journey",
  index: "Ⅰ",
  title: "学习轨迹",
  subtitle: "半年的时间线",
  description: "记录我在 Cambly 从第一节课到第一百节课的完整学习历程与节奏变化。",
  blocks: [
    { type: "meta", text: "2025 年冬 — 2026 年夏 · 约 180 天" },
    {
      type: "p",
      text: "这一页是我给自己画的一条线。它不太直，中间断过几次，但确实一直往前走。（此处替换为你的正文。）",
    },
    { type: "h", text: "第一个月 · 试探" },
    {
      type: "p",
      text: "刚开始每次连线前都要在心里排练一遍开场白。老师问 How are you，我会想三秒才回答。写下这句话的时候我意识到，那三秒后来慢慢消失了。",
    },
    { type: "rule" },
    { type: "h", text: "第二、三个月 · 变成习惯" },
    {
      type: "p",
      text: "把课排在早上，成了每天最先做完的一件事。开始不再准备稿子，改成准备一个话题。",
    },
    { type: "quote", text: "语言不是学会的，是用旧的。", source: "某天课后写下的一句" },
    { type: "h", text: "第四到第六个月 · 松弛" },
    {
      type: "p",
      text: "能在对话里开玩笑，是我给自己定的一个隐秘的里程碑。它比任何测评分数都更让我确定：我在往前走。",
    },
  ],
  next: { to: "/dialogues", label: "对话记录" },
};

export const dialogues: MemoirPage = {
  slug: "/dialogues",
  index: "Ⅱ",
  title: "对话记录",
  subtitle: "留下来的片段",
  description: "半年里与 Cambly 外教的经典对话摘录，保留英文原文并附上中文注解。",
  blocks: [
    { type: "meta", text: "摘录自课堂笔记 · 英文原文 + 中文注解" },
    {
      type: "p",
      text: "有些句子在当时并不特别，回头看却记得很清楚。（此处替换为你的对话记录。）",
    },
    { type: "h", text: "关于雨季" },
    {
      type: "dialogue",
      who: "Tutor",
      en: "You said it rains for two months straight. What do people do all that time?",
      zh: "你说那里要连着下两个月的雨。那段时间大家都做什么？",
    },
    {
      type: "dialogue",
      who: "Me",
      en: "We wait. And we complain a little. Mostly we wait.",
      zh: "我们等着。顺便抱怨两句。不过主要还是等着。",
    },
    {
      type: "p",
      text: "注解：这是我第一次没有先在脑子里翻译就说出的句子。",
    },
    { type: "rule" },
    { type: "h", text: "关于犯错" },
    {
      type: "dialogue",
      who: "Tutor",
      en: "Don't fix it. I understood you perfectly.",
      zh: "别改了，我完全听懂了。",
    },
    { type: "quote", text: "被听懂，比说得对更重要。" },
  ],
  next: { to: "/growth", label: "我的成长" },
};

export const growth: MemoirPage = {
  slug: "/growth",
  index: "Ⅲ",
  title: "我的成长",
  subtitle: "反思与变化",
  description: "半年英语口语练习之后，关于表达、勇气与自我认知的一些长篇反思。",
  blocks: [
    { type: "meta", text: "写于第 180 天" },
    {
      type: "p",
      text: "如果只用一句话总结这半年：我从「怕说错」变成了「想说完」。（此处替换为你的正文。）",
    },
    { type: "h", text: "一、口语之外" },
    {
      type: "p",
      text: "真正的变化不在词汇量，而在于我开始允许自己不完美地表达。停顿、绕远路、用简单的词说复杂的事，这些都是能力。",
    },
    { type: "h", text: "二、连接" },
    {
      type: "p",
      text: "每一节课都是一次短暂的连接。半年下来，这些连接叠在一起，构成了一张很轻但很真实的网。",
    },
    { type: "quote", text: "我学的不是英语，是怎么被听见。" },
    { type: "h", text: "三、接下来" },
    { type: "p", text: "下一个半年，我想少记笔记，多讲故事。" },
  ],
  next: { to: "/notes", label: "零散记录" },
};

export const notes: MemoirPage = {
  slug: "/notes",
  index: "Ⅳ",
  title: "零散记录",
  subtitle: "词句与随想",
  description: "半年学习途中收集的地道表达、生词和随手写下的碎片想法。",
  blocks: [
    { type: "meta", text: "持续更新" },
    { type: "p", text: "没有结构，只有顺手记下的东西。（此处替换为你的记录。）" },
    { type: "h", text: "收藏的说法" },
    { type: "dialogue", who: "", en: "It grows on you.", zh: "越处越喜欢。" },
    { type: "dialogue", who: "", en: "Let me back up a bit.", zh: "我往回说一点。" },
    { type: "dialogue", who: "", en: "That's a fair point.", zh: "这话在理。" },
    { type: "rule" },
    { type: "h", text: "随想" },
    { type: "p", text: "把课排在早上，是我这半年做过最有效的一个决定。" },
    { type: "quote", text: "坚持不是意志力，是把摩擦力降到最低。" },
  ],
  next: { to: "/journey", label: "学习轨迹" },
};

// 阅读顺序：用于上一篇/下一篇导航
export const allPages: MemoirPage[] = [journey, dialogues, growth, notes];

export function prevOf(page: MemoirPage) {
  const i = allPages.findIndex((p) => p.slug === page.slug);
  const prev = allPages[(i - 1 + allPages.length) % allPages.length];
  return { to: prev.slug, label: prev.title };
}

