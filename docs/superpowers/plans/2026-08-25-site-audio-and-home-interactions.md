# Site Audio and Home Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add continuous background music and complete the approved homepage copy, statistics, story deck, timeline, and five-track quote updates.

**Architecture:** A single `BackgroundMusic` component lives above `Outlet` in the router root so SPA navigation never replaces the audio element. Homepage changes remain isolated in existing chapter components, with a focused `StoryCardDeck` and stable article heading anchors for teacher deep links.

**Tech Stack:** React 19, TanStack Router/Start, TypeScript, GSAP ScrollTrigger, Tailwind CSS 4, Node test runner.

**Spec:** `docs/superpowers/specs/2026-08-25-site-audio-and-home-interactions-design.md`

## Global Constraints

- Use only the approved Wikimedia Commons CC0 recording; do not use the Arthur Rubinstein recording.
- Preserve `86 CONVERSATIONS / 26 Teachers` on the opening frame.
- Remove chapter statistic blocks only from chapters 01—04.
- Use the exact approved Chinese copy and all 31 supplied English sentences.
- Preserve reduced-motion behavior, keyboard access, and mobile layouts.
- Do not add a third-party audio or animation dependency.

---

### Task 1: Persistent background music

**Files:**
- Create: `public/media/chopin-nocturne-op9-no2.mp3`
- Create: `src/components/BackgroundMusic.tsx`
- Modify: `src/routes/__root.tsx`
- Test: `src/home-simplicity.test.mjs`

**Interfaces:**
- Consumes: root `Outlet`, browser `HTMLAudioElement`, `sessionStorage` key `cambly-background-music-time`.
- Produces: `BackgroundMusic(): JSX.Element`, one persistent audio element with source `/media/chopin-nocturne-op9-no2.mp3`, and a fixed mute toggle.

- [ ] **Step 1: Write the failing test**

Add a homepage integration assertion:

```js
test("the root exposes one persistent background music control", async () => {
  const html = await (await fetch(base)).text();
  assert.match(html, /src="\/media\/chopin-nocturne-op9-no2\.mp3"/);
  assert.match(html, /aria-label="开启背景音乐"/);
  assert.match(html, /data-background-music="true"/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
CAMBLY_PREVIEW_URL=http://127.0.0.1:8086/ node --experimental-strip-types --test src/home-simplicity.test.mjs
```

Expected: FAIL because the approved audio source and control are absent.

- [ ] **Step 3: Download and verify the approved asset**

Download `https://upload.wikimedia.org/wikipedia/commons/5/50/Nocturne_Op._9_no._2_in_E_flat_major.mp3` to `public/media/chopin-nocturne-op9-no2.mp3`. Verify that the response is `audio/mpeg`, the saved file is non-empty, and record the source/license in a code comment.

- [ ] **Step 4: Implement `BackgroundMusic`**

Create one audio ref, restore `currentTime` on `loadedmetadata`, save it on `timeupdate`, and toggle playback/mute from a fixed button:

```tsx
const STORAGE_KEY = "cambly-background-music-time";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audible, setAudible] = useState(false);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) await audio.play();
    audio.muted = audible;
    setAudible(!audible);
  }

  return (
    <>
      <button type="button" aria-pressed={audible} aria-label={audible ? "将背景音乐静音" : "开启背景音乐"} onClick={toggleAudio}>
        {audible ? "Music on" : "Music off"}
      </button>
      <audio ref={audioRef} data-background-music="true" src="/media/chopin-nocturne-op9-no2.mp3" loop muted />
    </>
  );
}
```

Render `<BackgroundMusic />` beside `<Outlet />` inside `RootComponent`, not inside any page route.

- [ ] **Step 5: Run the test and verify GREEN**

Run the Task 1 test command. Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add public/media/chopin-nocturne-op9-no2.mp3 src/components/BackgroundMusic.tsx src/routes/__root.tsx src/home-simplicity.test.mjs
git commit -m "feat: add persistent background music"
```

### Task 2: Homepage copy and chapter statistic cleanup

**Files:**
- Modify: `src/content/site.ts`
- Modify: `src/components/ChapterSection.tsx`
- Modify: `src/routes/index.tsx`
- Modify: `src/routes/__root.tsx`
- Test: `src/home-simplicity.test.mjs`

**Interfaces:**
- Consumes: `Chapter` records and the `first` flag already passed to `ChapterSection`.
- Produces: updated site title/subtitle and stat markup rendered only when `first === true`.

- [ ] **Step 1: Write the failing test**

```js
test("the homepage uses the new memoir copy and only the opening metrics", async () => {
  const html = await (await fetch(base)).text();
  assert.ok(html.includes("连进世界的半年"));
  assert.ok(html.includes("我在 Cambly 学英语的回忆录"));
  assert.ok(!html.includes("与世界连上线的半年"));
  for (const removed of [">09<", ">6<", ">03<", ">∞<"]) assert.ok(!html.includes(removed));
  for (const kept of [">86<", ">CONVERSATIONS<", ">26<", ">Teachers<"]) assert.ok(html.includes(kept));
});
```

- [ ] **Step 2: Run the test and verify RED**

Expected: FAIL on old copy and chapter stats.

- [ ] **Step 3: Implement the copy and conditional stat rendering**

Change `site.title`, `site.subtitle`, root metadata, and index-route metadata. Wrap the stat area in `ChapterSection` with `first ? (...) : null`, removing both the rule and spacing from chapters 01—04.

- [ ] **Step 4: Run the test and verify GREEN**

Expected: PASS with opening metrics intact.

- [ ] **Step 5: Commit**

```bash
git add src/content/site.ts src/components/ChapterSection.tsx src/routes/index.tsx src/routes/__root.tsx src/home-simplicity.test.mjs
git commit -m "feat: simplify homepage chapter copy"
```

### Task 3: Interactive nine-teacher story deck

**Files:**
- Create: `src/components/StoryCardDeck.tsx`
- Modify: `src/components/ArchiveEntrances.tsx`
- Modify: `src/components/MemoirArticle.tsx`
- Modify: `src/routes/index.tsx`
- Modify: `src/styles.css`
- Test: `src/home-simplicity.test.mjs`

**Interfaces:**
- Consumes: `/stories` route and article heading text.
- Produces: `StoryCardDeck(): JSX.Element`, links `/stories#peter`, `/stories#susan-munro`, `/stories#connie-n`, `/stories#ellie-bj`, `/stories#ian-smith`, `/stories#olivia`, `/stories#kenneth-d`, `/stories#sally-hs`, `/stories#tutor-mark`; `headingId(text: string): string` for stable matching article IDs.

- [ ] **Step 1: Write the failing test**

Assert the homepage contains `进入回忆`, all nine teacher names, and all nine deep-link hrefs. Fetch `/stories` and assert matching heading IDs exist.

- [ ] **Step 2: Run the test and verify RED**

Expected: FAIL because the old CTA and no card deck are rendered.

- [ ] **Step 3: Implement stable article heading IDs**

Add a deterministic title map for the nine known teacher headings in `MemoirArticle`; fall back to an index-based ID for other headings. Render `<h2 id={headingId(block.text)}>`.

- [ ] **Step 4: Implement the card deck**

Use a nine-record constant with `name`, `href`, `rotation`, and `offset`. Desktop hover/focus applies CSS custom properties to fan the cards. Mobile uses a local `expanded` boolean toggled by a real button; individual cards remain links.

- [ ] **Step 5: Replace the CTA copy and mount the deck**

Change `阅读九段故事` to `进入回忆`, place the deck in the same 01 child content region, and avoid nested interactive elements.

- [ ] **Step 6: Run the test and verify GREEN**

Expected: PASS for CTA, cards, and anchors.

- [ ] **Step 7: Commit**

```bash
git add src/components/StoryCardDeck.tsx src/components/ArchiveEntrances.tsx src/components/MemoirArticle.tsx src/routes/index.tsx src/styles.css src/home-simplicity.test.mjs
git commit -m "feat: add interactive teacher story deck"
```

### Task 4: Delayed timeline and five authentic quote tracks

**Files:**
- Modify: `src/components/GrowingLine.tsx`
- Modify: `src/components/QuoteDanmaku.tsx`
- Modify: `src/styles.css`
- Test: `src/home-simplicity.test.mjs`

**Interfaces:**
- Consumes: existing GSAP `ScrollTrigger`, reduced-motion behavior, and `danmaku-track` animation.
- Produces: a delayed `GrowingLine`, five quote rows with exact user-provided text, and no horizontal overflow at mobile widths.

- [ ] **Step 1: Write the failing test**

Assert `data-quote-track` occurs exactly five times and that representative first/last quotes from every track appear in the homepage HTML. Assert `data-timeline-line="true"` is present for browser QA targeting.

- [ ] **Step 2: Run the test and verify RED**

Expected: FAIL because only four old sample quote tracks exist.

- [ ] **Step 3: Implement the exact five quote rows**

Replace `rows` with the approved 6/6/6/6/7 sentence lists. Keep alternating direction and use durations proportional to total text, approximately 82, 96, 88, 102, and 118 seconds. Add `data-quote-track` to each row.

- [ ] **Step 4: Adjust the timeline**

Set the line trigger to `start: "top 58%"`, `end: "bottom 5%"`; use the same extended range for marks and increase `stagger` to `0.38`. Add `data-timeline-line="true"`. Apply a desktop width of 140% and 3px line thickness, falling back to 100% width on mobile.

- [ ] **Step 5: Run the test and verify GREEN**

Expected: PASS with all 31 exact quotes and five tracks.

- [ ] **Step 6: Commit**

```bash
git add src/components/GrowingLine.tsx src/components/QuoteDanmaku.tsx src/styles.css src/home-simplicity.test.mjs
git commit -m "feat: refine timeline and authentic quote tracks"
```

### Task 5: Full verification and browser QA

**Files:**
- Verify: all files changed in Tasks 1—4

**Interfaces:**
- Consumes: completed feature set.
- Produces: verified local preview and a marked deliverable browser tab.

- [ ] **Step 1: Run all tests**

```bash
CAMBLY_PREVIEW_URL=http://127.0.0.1:8087/ node --experimental-strip-types --test src/lib/content-parser.test.ts src/home-simplicity.test.mjs
```

Expected: all tests pass with zero failures.

- [ ] **Step 2: Run production build**

```bash
pnpm run build
```

Expected: exit code 0.

- [ ] **Step 3: Verify audio continuity in the browser**

Click the music button, record `currentTime`, navigate through a `Link` to `/stories`, wait briefly, and assert the root audio is still audible and `currentTime` is greater than the recorded value.

- [ ] **Step 4: Verify desktop interactions**

Inspect the opening copy, 01 card fan-out, delayed 02 line, and five 03 tracks. Confirm no page-level horizontal overflow.

- [ ] **Step 5: Verify reduced-motion and keyboard states**

Confirm the audio button and teacher links are keyboard reachable and labeled. Confirm reduced-motion CSS stops deck/timeline/danmaku transitions without hiding content.

- [ ] **Step 6: Mark the updated homepage preview as the deliverable**

Open the fresh local URL at `#opening`, reuse the same tab for any fixes, and call the browser deliverable marker after all checks pass.
