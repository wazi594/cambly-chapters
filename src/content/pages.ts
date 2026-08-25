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
};
