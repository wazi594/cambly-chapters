import assert from "node:assert/strict";
import test from "node:test";

test("the home page keeps core content while omitting decorative microcopy and the footer directory", async () => {
  const response = await fetch(process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/");
  assert.equal(response.status, 200);

  const html = await response.text();

  for (const coreCopy of ["连接世界的半年", "给 Lou 的一封信", "时间胶囊"]) {
    assert.match(html, new RegExp(coreCopy));
  }

  for (const decorativeCopy of [
    "ARCHIVE: CAMBLY H1",
    "STATUS: OPENING FRAME",
    "ENTRY ID: WINTER-001",
    "GRAIN 400 / ARCHIVE",
    "入口一 · Letter",
    "ENTER 01",
    "Choose a threshold",
  ]) {
    assert.doesNotMatch(html, new RegExp(decorativeCopy));
  }

  assert.doesNotMatch(html, /href="\/journey"/);
});

test("chapter 01 presents the stories archive without restoring the removed learner image", async () => {
  const response = await fetch(process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/");
  assert.equal(response.status, 200);

  const html = await response.text();

  assert.match(html, /我们的故事/);
  assert.doesNotMatch(html, /alt="窗边使用电脑练习英语的学习者"/);
});

test("the opening chapter presents conversation and teacher totals as two metrics", async () => {
  const response = await fetch(process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/");
  assert.equal(response.status, 200);

  const html = await response.text();

  for (const metricCopy of ["86", "CONVERSATIONS", "26", "Teachers"]) {
    assert.match(html, new RegExp(`>${metricCopy}<`));
  }
  assert.doesNotMatch(html, />180</);
});

test("chapters 01, 02, and 03 lead to the four authored archive pages", async () => {
  const base = process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/";
  const homeResponse = await fetch(base);
  assert.equal(homeResponse.status, 200);

  const home = await homeResponse.text();
  for (const copy of [
    "我们的故事",
    "记录 Cambly 这半年里，九段真正留下痕迹的关系",
    "进入回忆",
    "八十六节课的轨迹",
    "反复说的话",
    "家人的痕迹",
  ]) {
    assert.ok(home.includes(copy), `missing homepage copy: ${copy}`);
  }
  for (const href of ["/stories", "/trajectory", "/repeated-words", "/family-traces"]) {
    assert.ok(home.includes(`href="${href}"`), `missing homepage link: ${href}`);
  }

  const pages = [
    ["stories", "31 节课，2025-02-10 → 2025-06-10"],
    ["repeated-words", "好好生活，看清这个世界"],
    ["family-traces", "我意识到，当律师这个决定"],
  ];
  for (const [path, expectedCopy] of pages) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes(expectedCopy), `missing page copy: ${expectedCopy}`);
  }

  const trajectoryResponse = await fetch(new URL("trajectory", base));
  assert.equal(trajectoryResponse.status, 200);
  const trajectory = await trajectoryResponse.text();
  assert.match(trajectory, /八十六节课的轨迹/);
  assert.match(trajectory, /src="\/content\/create\/trajectory_report\.html"/);
});

test("the opening frame uses the supplied looping room video", async () => {
  const response = await fetch(process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const videoTag = html.match(/<video[^>]*>/)?.[0];
  assert.ok(videoTag, "missing opening video");
  assert.doesNotMatch(videoTag, /poster=/, "opening video still exposes the old image poster");
  assert.match(html, /src="\/media\/room-with-perspective\.mp4"/);
  for (const attribute of ["autoPlay", "muted", "loop", "playsInline"]) {
    assert.match(html, new RegExp(`${attribute}=""`));
  }
});

test("the stories page separates teacher names from lesson metadata", async () => {
  const base = process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/";
  const response = await fetch(new URL("stories", base));
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<h1[^>]*>我们的故事<\/h1>/);
  assert.doesNotMatch(
    html,
    /<p class="mt-6[^>]*">九段真正留下痕迹的关系<\/p>/,
    "removed stories subtitle is still rendered",
  );
  assert.match(
    html,
    /<h2 id="peter"[^>]*>[\s\S]*?<span class="story-teacher-name"[^>]*>Peter<\/span>[\s\S]*?<span class="story-teacher-meta"[^>]*>31 节课，2025-02-10 → 2025-06-10<\/span>[\s\S]*?<\/h2>/,
  );
});

test("the trajectory bar chart has no white card behind the chart", async () => {
  const response = await fetch(process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const chartTag = html.match(/<div[^>]*class="[^"]*trajectory-sheet-chart[^"]*"[^>]*>/)?.[0];
  assert.ok(chartTag, "missing trajectory chart");
  for (const cardStyle of ["bg-[#faf8f1]", "shadow-xl", "border-[#202b25]/20"]) {
    assert.ok(!chartTag.includes(cardStyle), `trajectory chart still has card style: ${cardStyle}`);
  }
});

test("the root exposes one persistent background music control", async () => {
  const response = await fetch(process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /src="\/media\/chopin-nocturne-op9-no2\.mp3"/);
  assert.match(html, /aria-label="开启背景音乐"/);
  assert.match(html, /data-background-music="true"/);
  assert.match(html, /data-volume="0.7"/);
  assert.match(html, /<audio[^>]*preload="metadata"/);
  assert.doesNotMatch(html, /<audio[^>]*preload="auto"/);
});

test("the homepage uses the new memoir copy and reserves metrics for the opening frame", async () => {
  const response = await fetch(process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.ok(html.includes("连接世界的半年"));
  assert.ok(html.includes("我在 Cambly 学英语的回忆录"));
  assert.ok(!html.includes("与世界连上线的半年"));
  assert.ok(!html.includes("连进世界的半年"));
  assert.equal((html.match(/data-chapter-stat="true"/g) ?? []).length, 1);
});

test("the story entrance links nine teachers to their matching article chapters", async () => {
  const base = process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/";
  const home = await (await fetch(base)).text();
  const stories = await (await fetch(new URL("stories", base))).text();
  const teachers = [
    ["Peter", "peter"],
    ["Susan Munro", "susan-munro"],
    ["Connie N", "connie-n"],
    ["Ellie / BJ", "ellie-bj"],
    ["Ian Smith", "ian-smith"],
    ["Olivia", "olivia"],
    ["Kenneth D", "kenneth-d"],
    ["Sally HS", "sally-hs"],
    ["Tutor Mark", "tutor-mark"],
  ];

  assert.ok(home.includes("进入回忆"));
  for (const [name, slug] of teachers) {
    assert.ok(home.includes(name), `missing teacher card: ${name}`);
    assert.ok(
      home.includes(`aria-label="打开 ${name} 的故事"`),
      `teacher entry is not exposed as a named link: ${name}`,
    );
    assert.ok(home.includes(`href="/stories#${slug}"`), `missing teacher link: ${slug}`);
    assert.ok(stories.includes(`id="${slug}"`), `missing story anchor: ${slug}`);
  }
});

test("the memoir's main teacher occupies the front of the floating name helix", async () => {
  const response = await fetch(process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/");
  const home = await response.text();
  const peterLink = home.indexOf('aria-label="打开 Peter 的故事"');
  const peterItem = home.slice(home.lastIndexOf("<li", peterLink), peterLink);

  assert.ok(peterLink > 0, "missing Peter story link");
  assert.ok(peterItem.includes("--helix-angle:0deg"), "Peter is not placed at the helix front");
});

test("the timeline grows slowly and the quote field contains five authentic tracks", async () => {
  const response = await fetch(process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/");
  const html = await response.text();
  const renderedText = html.replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
  const quotes = [
    "I am loved because I love.",
    "Live well, see the world clearly.",
    "We are same human being.",
    "We are connected.",
    "It's a new script.",
    "A new stage for me.",
    "I was a lawyer.",
    "But I am going to Australia.",
    "From barrister to barista.",
    "I worked five years as a lawyer.",
    "I suspended my job.",
    "I changed everything.",
    "No one is coming.",
    "You must keep going.",
    "I'm not a very confident person.",
    "Have faith in yourself.",
    "Face yourself.",
    "Both are right.",
    "You are the boss of your life.",
    "Spread your wings and fly.",
    "That's a gift.",
    "In your heart, you're saying Melbourne.",
    "You have that option.",
    "I admire you, Lou.",
    "Don't give up easily.",
    "Give it a really good go.",
    "Yes, I will. I promise you.",
    "Forget everything. Forget my career.",
    "I love technology more than humans.",
    "my name is Lawrence Lawrence",
    "I chat with the barista while waiting.",
  ];

  assert.equal((html.match(/data-quote-track="true"/g) ?? []).length, 5);
  assert.match(html, /data-timeline-line="true"/);
  assert.match(html, /data-timeline-start="top 82%"/);
  for (const quote of quotes) assert.ok(renderedText.includes(quote), `missing quote: ${quote}`);
});

test("retained reading routes stay available while obsolete memoir routes and controls disappear", async () => {
  const base = process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/";
  const retained = [
    "stories",
    "repeated-words",
    "family-traces",
    "letter",
    "time-capsule",
    "trajectory",
  ];
  const removed = ["journey", "dialogues", "growth", "notes"];

  for (const path of retained) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, `retained route failed: ${path}`);
    const html = await response.text();
    for (const control of ["字号", "行距", "上一篇", "下一篇"]) {
      assert.ok(!html.includes(control), `obsolete reading control on ${path}: ${control}`);
    }
  }

  for (const path of removed) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 404, `obsolete route still exists: ${path}`);
  }

  const home = await (await fetch(base)).text();
  for (const path of removed)
    assert.ok(!home.includes(`href="/${path}"`), `obsolete homepage link: ${path}`);
});

test("retained memoir pages share the quiet editorial reading template", async () => {
  const base = process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/";
  const paths = ["stories", "repeated-words", "family-traces", "letter", "time-capsule"];

  for (const path of paths) {
    const html = await (await fetch(new URL(path, base))).text();
    assert.match(html, /data-memoir-article="true"/, `missing reading template: ${path}`);
    assert.ok(html.includes("返回首页"), `missing home return: ${path}`);
    assert.ok(html.includes('href="/#opening"'), `home return does not target opening: ${path}`);
    assert.ok(!html.includes("PERSONAL ARCHIVE"), `decorative archive copy remains: ${path}`);
    assert.ok(!html.includes("Index ↑"), `prominent index copy remains: ${path}`);
    assert.ok(html.includes("Newsreader"), `quote font is not loaded: ${path}`);
  }

  const capsule = await (await fetch(new URL("time-capsule", base))).text();
  assert.match(capsule, /data-memoir-quote="true"/);
});

test("the letter keeps quotations without redundant speaker annotations", async () => {
  const base = process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/";
  const response = await fetch(new URL("letter", base));
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.ok(html.includes("this is some juice that I made"));
  assert.ok(html.includes("except my family. Maybe my family."));
  assert.ok(!html.includes("Peter · 关于他自酿的梅子汁"));
  assert.ok(!html.includes("Student · 关于家人"));
  assert.ok(!html.includes("· 关于"));
});

test("markdown memoir pages do not render duplicate divider rules", async () => {
  const base = process.env.CAMBLY_PREVIEW_URL ?? "http://127.0.0.1:8080/";
  for (const path of ["stories", "time-capsule", "repeated-words", "family-traces"]) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200);
    assert.ok(!(await response.text()).includes("rule-hairline"), `duplicate divider on ${path}`);
  }
});
