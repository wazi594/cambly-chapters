import type { Block } from "../content/pages.ts";

function normalizeVisibleText(value: string) {
  return value
    .replace(/([\p{Script=Han}]),/gu, "$1，")
    .replace(/,(?=[\p{Script=Han}])/gu, "，")
    .replace(/([A-Za-z0-9]),(?=[\p{Script=Han}])/gu, "$1，")
    .replace(/([\p{Script=Han}]):/gu, "$1：")
    .replace(/:(?=[\p{Script=Han}"“'])/gu, "：")
    .replace(/([\p{Script=Han}]);/gu, "$1；")
    .replace(/;(?=[\p{Script=Han}])/gu, "；")
    .replace(/([\p{Script=Han}])\?(?=\s|$|[\p{Script=Han}])/gu, "$1？")
    .replace(/([\p{Script=Han}])!(?=\s|$|[\p{Script=Han}])/gu, "$1！")
    .replace(/([\p{Script=Han}])\.(?=\s|$|[\p{Script=Han}])/gu, "$1。");
}

function decodeText(value: string) {
  return normalizeVisibleText(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function stripMarkdown(value: string) {
  return normalizeVisibleText(
    value
      .replace(/^\*\*(.+)\*\*$/, "$1")
      .replace(/^\*(.+)\*$/, "$1")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .trim(),
  );
}

export function parseCapsuleMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  const paragraph: string[] = [];

  const flushParagraph = () => {
    const text = stripMarkdown(paragraph.join(" "));
    if (text) blocks.push({ type: "p", text });
    paragraph.length = 0;
  };

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }
    if (/^#\s+/.test(line)) continue;
    if (/^-{3,}$/.test(line)) {
      flushParagraph();
      blocks.push({ type: "rule" });
      continue;
    }
    if (/^##\s+/.test(line)) {
      flushParagraph();
      blocks.push({ type: "h", text: stripMarkdown(line.replace(/^##\s+/, "")) });
      continue;
    }
    if (/^>\s?/.test(line)) {
      flushParagraph();
      blocks.push({ type: "quote", text: stripMarkdown(line.replace(/^>\s?/, "")) });
      continue;
    }
    if (/^\*[^*].*\*$/.test(line) || /^\*\*.+\*\*$/.test(line)) {
      flushParagraph();
      blocks.push({ type: "meta", text: stripMarkdown(line) });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      blocks.push({ type: "p", text: stripMarkdown(line) });
      continue;
    }
    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
}

export function parseLetterHtml(source: string): Block[] {
  const blocks: Block[] = [];
  const tokenPattern =
    /<h1\s+class="greeting"[^>]*>([\s\S]*?)<\/h1>|<p\s+class="indent"[^>]*>([\s\S]*?)<\/p>|<div\s+class="date-mark"[^>]*>([\s\S]*?)<\/div>|<blockquote[^>]*>([\s\S]*?)<\/blockquote>|<div\s+class="sign"[^>]*>([\s\S]*?)<\/div>|<div\s+class="sub"[^>]*>([\s\S]*?)<\/div>/gi;

  for (const match of source.matchAll(tokenPattern)) {
    if (match[1]) {
      blocks.push({ type: "meta", text: decodeText(match[1]) });
    } else if (match[2]) {
      blocks.push({ type: "p", text: decodeText(match[2]) });
    } else if (match[3]) {
      blocks.push({ type: "h", text: decodeText(match[3]) });
    } else if (match[4]) {
      const quote = match[4];
      const line = quote.match(/<span\s+class="line"[^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? quote;
      const sourceText = quote.match(/<span\s+class="who"[^>]*>([\s\S]*?)<\/span>/i)?.[1];
      const text = decodeText(line);
      const byline = sourceText ? decodeText(sourceText) : undefined;
      blocks.push(byline ? { type: "quote", text, source: byline } : { type: "quote", text });
    } else if (match[5]) {
      blocks.push({ type: "meta", text: decodeText(match[5]) });
    } else if (match[6]) {
      blocks.push({ type: "meta", text: decodeText(match[6]) });
    }
  }

  return blocks;
}
