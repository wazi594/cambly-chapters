# 子页面阅读系统与背景性能改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 删除四个旧占位页面，统一五个保留阅读页的排版与导航，并让首页 WebGL 背景更平稳、更省资源。

**Architecture:** 保留 `MemoirArticle` 作为五个正文页面的唯一模板，移除用户阅读偏好与文章链式导航，让页面结构由固定设计令牌控制。`PaintedBackground` 继续使用 Three.js，但降低绘制缓冲区、着色器复杂度和刷新频率，并在不可见或减少动态模式下停止连续绘制。

**Tech Stack:** React 19、TanStack Router、Tailwind CSS v4、Three.js、Node test runner、Vite/Nitro。

**Spec:** `docs/superpowers/specs/2026-08-25-reading-pages-and-background-design.md`

## Global Constraints

- 保留 `/trajectory` 及其 `trajectory_report.html`。
- 删除 `/journey`、`/dialogues`、`/growth`、`/notes`。
- 保留根级背景音乐组件和 SPA 切换连续播放行为。
- 不改写五个保留阅读页的正文内容。
- 不部署网站，只交付本地预览。

---

### Task 1: 删除旧阅读路由和文章切换系统

**Files:**
- Modify: `src/home-simplicity.test.mjs`
- Modify: `src/content/pages.ts`
- Modify: `src/content/special-pages.ts`
- Modify: `src/content/site.ts`
- Modify: `src/components/MemoirArticle.tsx`
- Delete: `src/routes/journey.tsx`
- Delete: `src/routes/dialogues.tsx`
- Delete: `src/routes/growth.tsx`
- Delete: `src/routes/notes.tsx`
- Delete: `src/components/ReadingControls.tsx`
- Delete: `src/hooks/useReadingPrefs.ts`
- Regenerate: `src/routeTree.gen.ts`

**Interfaces:**
- Consumes: existing `MemoirPage` block data and TanStack file routes.
- Produces: simplified `MemoirPage` without `next`, and a `MemoirArticle` with no reading controls or article-to-article navigation.

- [ ] **Step 1: Write the failing route and navigation test**

Add a test that fetches the homepage and five retained article routes, asserts retained routes return 200, asserts the four removed routes return 404, and asserts article HTML contains none of `字号`、`行距`、`上一篇`、`下一篇`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `CAMBLY_PREVIEW_URL=http://127.0.0.1:8091/ node --test --test-name-pattern="retained reading routes" src/home-simplicity.test.mjs`

Expected: FAIL because the four routes still return 200 and the controls still render.

- [ ] **Step 3: Remove old routes and simplify content contracts**

Delete the four route files and their four content objects. Remove `next`, `allPages`, `prevOf`, the obsolete `entries` array, all `ReadingControls`/`useReadingPrefs` imports and usages, desktop previous/next navigation, and the mobile fixed navigation.

- [ ] **Step 4: Regenerate the route tree and verify GREEN**

Start a fresh Vite server so the TanStack plugin regenerates `src/routeTree.gen.ts`, then rerun the focused test. Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `refactor: remove obsolete memoir routes`

### Task 2: 统一五个子页面的阅读设计

**Files:**
- Modify: `src/home-simplicity.test.mjs`
- Modify: `src/components/MemoirArticle.tsx`
- Modify: `src/styles.css`
- Modify: `src/routes/__root.tsx`

**Interfaces:**
- Consumes: `MemoirPage.blocks` and `ReadingProgressBar`.
- Produces: a stable `data-memoir-article="true"` reading surface, `data-memoir-quote="true"` quote blocks, and one subtle article header.

- [ ] **Step 1: Write the failing reading-template test**

Assert every retained article renders `data-memoir-article="true"`, has one `返回首页` link, has no `PERSONAL ARCHIVE`, and quote-bearing pages emit `data-memoir-quote="true"`. Assert the HTML imports `Newsreader`.

- [ ] **Step 2: Run the focused test and verify RED**

Expected: FAIL because the new template markers and font are absent.

- [ ] **Step 3: Implement the fixed editorial hierarchy**

Make the top bar 48px with only return link, centered title on desktop, and progress hairline. Set the title to `text-[2.375rem] md:text-[3.5rem]`, fixed body to 17px/1.95, section heading to 28–32px, readable metadata, and a 720px text column. Remove dynamic inline reading styles.

- [ ] **Step 4: Implement the Newsreader quote system**

Load `Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600` from Google Fonts. Add `--font-quote`, apply it to quote and English dialogue text, and style quote blocks with horizontal rules, 24px mobile/30px desktop type, restrained blue marker, and 12px source copy.

- [ ] **Step 5: Verify GREEN and commit**

Run focused tests and commit as `feat: unify memoir reading pages`.

### Task 3: 降低背景渲染负载并放缓鼠标跟随

**Files:**
- Create: `src/lib/paint-performance.ts`
- Create: `src/lib/paint-performance.test.ts`
- Modify: `src/components/PaintedBackground.tsx`

**Interfaces:**
- Produces: `PAINT_FRAME_INTERVAL_MS = 1000 / 30`, `PAINT_MAX_PIXEL_RATIO = 1.25`, and pure `shouldRenderPaintFrame(lastFrame, now, visible, reducedMotion)`.
- Consumes: existing paint tint/deep store and reduced-motion preference.

- [ ] **Step 1: Write failing unit tests for frame scheduling**

Test literal cases: hidden and reduced-motion states do not schedule continuous frames; a frame at 20ms after the previous frame is skipped; a frame at 34ms is rendered.

- [ ] **Step 2: Run tests and verify RED**

Expected: FAIL because `paint-performance.ts` does not exist.

- [ ] **Step 3: Implement frame policy and optimized shader loop**

Add the pure frame policy. Cap renderer DPR at 1.25; reduce FBM loop count to four; reuse one pointer vector; reduce mouse and trail interpolation to 0.025 and 0.008; halve speed/pull/smear influence; render at at most 30fps; use `visibilitychange` to stop/resume; render one static frame for reduced motion.

- [ ] **Step 4: Run unit and site tests, then commit**

Commit as `perf: calm and optimize painted background`.

### Task 4: 全面验证与浏览器验收

**Files:**
- Modify only if a verified defect requires a targeted fix.

**Interfaces:**
- Consumes: final local site at a fresh preview port.
- Produces: verified local preview with no broken retained routes or runtime errors.

- [ ] **Step 1: Run automated verification**

Run all Node tests and `pnpm run build`. Run ESLint against files changed by this plan; record unrelated pre-existing formatting failures separately rather than mechanically rewriting unrelated UI files.

- [ ] **Step 2: Inspect all retained routes in the in-app browser**

Check `/stories`, `/repeated-words`, `/family-traces`, `/letter`, `/time-capsule`, and `/trajectory` at desktop width. Check one long reading page at mobile width, verify no horizontal overflow, and inspect quote styling.

- [ ] **Step 3: Verify interactions and performance behavior**

Confirm background music remains audible through an SPA navigation, the background responds gently to pointer movement, and the browser console has no runtime errors.

- [ ] **Step 4: Final verification and handoff**

Rerun full tests and build immediately before reporting completion. Open the final local preview in Codex.
