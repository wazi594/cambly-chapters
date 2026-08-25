import test from "node:test";
import assert from "node:assert/strict";
import { parseCapsuleMarkdown, parseLetterHtml } from "./content-parser.ts";

test("parseCapsuleMarkdown preserves headings, quotations, and numbered prompts", () => {
  const markdown = [
    "# 标题",
    "",
    "*封存说明*",
    "",
    "## 一段记忆",
    "",
    '> "Keep going."',
    "",
    "1. 你现在会怎么回答?",
  ].join("\n");

  assert.deepEqual(parseCapsuleMarkdown(markdown), [
    { type: "meta", text: "封存说明" },
    { type: "h", text: "一段记忆" },
    { type: "quote", text: '"Keep going."' },
    { type: "p", text: "1. 你现在会怎么回答？" },
  ]);
});

test("visible Chinese prose normalizes adjacent ASCII punctuation without changing English or numbers", () => {
  const markdown = [
    "# 标题",
    "",
    'Lou,重新读一遍。第一次见面(2-10),我记得 31 节课,2025-06-10。这不是总结,是一份记录:它保留 91,101 words and "Have faith in yourself."',
  ].join("\n");

  assert.deepEqual(parseCapsuleMarkdown(markdown), [
    {
      type: "p",
      text: 'Lou，重新读一遍。第一次见面(2-10)，我记得 31 节课，2025-06-10。这不是总结，是一份记录：它保留 91,101 words and "Have faith in yourself."',
    },
  ]);
});

test("parseLetterHtml extracts the authored reading sequence from the sheet", () => {
  const html = `
    <style>body { color: red; }</style>
    <div class="sheet">
      <h1 class="greeting">亲爱的 Lou:</h1>
      <div class="letter-body">
        <p class="indent">第一段。</p>
        <div class="date-mark"><span class="lesson-no">第 1 课</span><span class="line"></span>2024-12-07</div>
        <blockquote><span class="line">"Hello."</span><span class="who">Tutor · 00:08</span></blockquote>
      </div>
      <div class="closing"><p class="indent">最后一段。</p><div class="sign">— Cambly</div></div>
    </div>`;

  assert.deepEqual(parseLetterHtml(html), [
    { type: "meta", text: "亲爱的 Lou:" },
    { type: "p", text: "第一段。" },
    { type: "h", text: "第 1 课 2024-12-07" },
    { type: "quote", text: '"Hello."', source: "Tutor · 00:08" },
    { type: "p", text: "最后一段。" },
    { type: "meta", text: "— Cambly" },
  ]);
});
