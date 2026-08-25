# Cambly Chronicles Production Release Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce one privacy-safe, internally consistent, lean, fully verified Cambly Chronicles source state that is ready to save and publish with Sites.

**Architecture:** Preserve the existing TanStack Start route tree and visual components. Make `src/content/source/` authoritative for authored reading pages, keep only the trajectory iframe under the public content tree, and protect the release boundary with behavior-focused Node tests. Restrict runtime changes to safe loading improvements and remove only files and packages proven unreachable from production imports.

**Tech Stack:** React 19, TanStack Start/Router, TypeScript, Vite/Nitro, Tailwind CSS, GSAP, Lenis, Three.js, Node test runner, Sites hosting.

**Spec:** `docs/superpowers/specs/2026-08-25-production-release-readiness-design.md`

## Global Constraints

- Preserve the current visual design and interaction model.
- Fix only release-blocking privacy, consistency, loading, dead-code, verification, and hosting issues.
- Keep the public summary at 86 conversations and 26 teachers.
- Use 2024-12-07 through 2025-06-10 as the memoir period.
- Keep raw source material in the repository workspace but outside `public/`.
- Do not rewrite Lovable git history.

---

### Task 1: Enforce the Public Content Boundary

**Files:**
- Create: `src/release-readiness.test.mjs`
- Create: `content/reference/**` by moving `public/content/reference/**`
- Create: `content/archive/create/**` by moving non-runtime files from `public/content/create/**`
- Preserve: `public/content/create/trajectory_report.html`

**Interfaces:**
- Consumes: Vite's contract that every file below `public/` is copied to the deployment output.
- Produces: a public content tree containing only `create/trajectory_report.html`.

- [ ] **Step 1: Write the failing public-boundary test**

```js
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";

test("the deployable public content contains only the trajectory iframe", async () => {
  const root = new URL("../public/content/", import.meta.url);
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => `${entry.parentPath.replace(new URL(root).pathname, "")}/${entry.name}`)
    .map((path) => path.replace(/^\/+/, ""))
    .sort();

  assert.deepEqual(files, ["create/trajectory_report.html"]);
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run: `node --test src/release-readiness.test.mjs`

Expected: FAIL because raw transcripts, teacher profiles, JSON, scripts, and duplicate authoring files are still under `public/content/`.

- [ ] **Step 3: Move private and duplicate material without deleting it**

Move the complete `public/content/reference/` tree to `content/reference/`. Move every file in `public/content/create/` except `trajectory_report.html` to `content/archive/create/`. Preserve filenames and directory structure so the material remains recoverable.

- [ ] **Step 4: Run the boundary test and inspect the public tree**

Run: `node --test src/release-readiness.test.mjs`

Expected: PASS with exactly one public content file.

- [ ] **Step 5: Commit the privacy boundary**

```bash
git add src/release-readiness.test.mjs content public/content
git commit -m "fix: exclude source material from public release"
```

### Task 2: Make Visible Content Internally Consistent

**Files:**
- Modify: `src/lib/content-parser.test.ts`
- Modify: `src/lib/content-parser.ts`
- Modify: `src/content/site.ts`
- Modify: `src/content/source/cambly_letter.html`
- Modify: `src/content/source/反复说的话.md`
- Modify: `src/content/source/家人的痕迹.md`
- Modify: `src/content/source/我与老师们的故事.md`
- Modify: `src/content/source/给一年后自己的时间胶囊.md`
- Modify: `public/content/create/trajectory_report.html`

**Interfaces:**
- Consumes: raw authored HTML and Markdown imported by `src/content/special-pages.ts`.
- Produces: normalized `Block[]` values rendered by `MemoirArticle`, plus one consistent set of visible release facts.

- [ ] **Step 1: Add a failing punctuation-normalization test**

Add this independent behavior case to `src/lib/content-parser.test.ts`:

```ts
test("visible Chinese prose normalizes adjacent ASCII punctuation without changing English or numbers", () => {
  const markdown = [
    "# 标题",
    "",
    "这不是总结,是一份记录:它保留 91,101 words and \"Have faith in yourself.\"",
  ].join("\n");

  assert.deepEqual(parseCapsuleMarkdown(markdown), [
    {
      type: "p",
      text: "这不是总结，是一份记录：它保留 91,101 words and \"Have faith in yourself.\"",
    },
  ]);
});
```

- [ ] **Step 2: Run the parser test and verify it fails**

Run: `node --test src/lib/content-parser.test.ts`

Expected: FAIL because the parser currently preserves ASCII comma and colon between Chinese characters.

- [ ] **Step 3: Implement one shared visible-text normalizer**

Add `normalizeVisibleText(value: string)` in `src/lib/content-parser.ts`. Convert ASCII comma, colon, semicolon, question mark, and exclamation mark only when adjacent to a Han character. Call it at the end of `decodeText()` and `stripMarkdown()`. Do not rewrite numeric separators, ISO dates, English sentences, or quoted English punctuation.

- [ ] **Step 4: Reconcile release facts and known duplicate fragments**

Set `site.period` to `2024 年冬 — 2025 年夏`. Keep the homepage at `86 CONVERSATIONS / 26 Teachers`. In the letter, distinguish 25 teaching accounts from 26 individual teachers where necessary; keep the trajectory report's category count labeled as 25 teaching accounts. Remove only demonstrably repeated attributions or adjacent duplicate fragments, including any second copy already represented by a quote source or metadata block.

- [ ] **Step 5: Format the five canonical sources and rerun parser and page tests**

Run: `prettier --write src/content/source src/content/site.ts src/lib/content-parser.ts src/lib/content-parser.test.ts public/content/create/trajectory_report.html`

Run: `CAMBLY_PREVIEW_URL=http://127.0.0.1:8097/ node --test src/lib/content-parser.test.ts src/home-simplicity.test.mjs`

Expected: all parser and rendered-content checks PASS.

- [ ] **Step 6: Commit the content consistency fix**

```bash
git add src/lib/content-parser.ts src/lib/content-parser.test.ts src/content src/home-simplicity.test.mjs public/content/create/trajectory_report.html
git commit -m "fix: unify memoir facts and visible punctuation"
```

### Task 3: Remove Proven Dead Starter Code and Dependencies

**Files:**
- Remove: `src/components/ui/**`
- Remove: `src/hooks/use-mobile.tsx`
- Remove: `src/lib/utils.ts`
- Remove: `components.json`
- Modify: `package.json`
- Modify: `bun.lock`

**Interfaces:**
- Consumes: the production import graph rooted at `src/routes/**`, `src/router.tsx`, `src/start.ts`, and `src/server.ts`.
- Produces: a dependency graph containing only packages imported by production or required by the Lovable/Vite build.

- [ ] **Step 1: Prove the starter UI tree has no production consumer**

Run: `rg -n "@/components/ui|@/hooks/use-mobile|@/lib/utils" src --glob '!src/components/ui/**' --glob '!src/hooks/use-mobile.tsx' --glob '!src/lib/utils.ts'`

Expected: no matches.

- [ ] **Step 2: Remove the unreachable starter tree**

Delete the unused UI directory, mobile hook, utility, and shadcn component manifest. Do not remove `ChapterNav`, `BackgroundMusic`, `PaintedBackground`, or any memoir component.

- [ ] **Step 3: Remove packages used only by the deleted tree**

Retain React, TanStack, GSAP, Lenis, Three.js, Tailwind/Vite tooling, TypeScript, ESLint, Prettier, and Lovable tooling. Remove Radix component packages, form/chart/carousel/toast packages, `class-variance-authority`, `clsx`, `date-fns`, `lucide-react`, `tailwind-merge`, `tw-animate-css`, `vaul`, `zod`, and other packages with no remaining production or build import. Refresh `bun.lock` with the project's established package manager.

- [ ] **Step 4: Verify imports, types, lint, and build**

Run: `rg -n "from ['\"]([^'\"]+)['\"]" src`

Run: `pnpm exec tsc --noEmit`

Run: `pnpm run lint`

Run: `pnpm run build`

Expected: no unresolved imports, zero type errors, zero lint errors, and successful production output.

- [ ] **Step 5: Commit the dead-code removal**

```bash
git add package.json bun.lock src components.json
git commit -m "refactor: remove unused starter interface code"
```

### Task 4: Reduce Unrequested Resource Loading

**Files:**
- Modify: `src/home-simplicity.test.mjs`
- Modify: `src/components/BackgroundMusic.tsx`
- Inspect: `src/components/PaintedBackground.tsx`
- Inspect: `src/lib/paint-performance.ts`

**Interfaces:**
- Consumes: the persistent root audio element and the lazy WebGL homepage background.
- Produces: unchanged audio controls and visuals with less network and animation work before user intent.

- [ ] **Step 1: Add a failing audio-loading behavior assertion**

Extend the existing background-music test with:

```js
assert.match(html, /<audio[^>]*preload="metadata"/);
assert.doesNotMatch(html, /<audio[^>]*preload="auto"/);
```

- [ ] **Step 2: Run the homepage behavior test and verify it fails**

Run: `CAMBLY_PREVIEW_URL=http://127.0.0.1:8097/ node --test src/home-simplicity.test.mjs`

Expected: FAIL because the current audio element uses `preload="auto"`.

- [ ] **Step 3: Switch music to metadata-only preload**

Set the audio element to `preload="metadata"`. Preserve autoplay-muted initialization, session position restoration, looping, the 70% volume, and click-to-unmute behavior.

- [ ] **Step 4: Verify the background animation already observes the release constraints**

Confirm the existing implementation remains lazy, caps pixel ratio and frame rate, pauses while the page is hidden, yields during scrolling, disposes WebGL resources, and renders a static reduced-motion frame. Change it only if a check proves one of these contracts is broken; any behavior fix must begin with a failing test in `src/lib/paint-performance.test.ts`.

- [ ] **Step 5: Run homepage and paint tests**

Run: `CAMBLY_PREVIEW_URL=http://127.0.0.1:8097/ node --test src/home-simplicity.test.mjs src/lib/paint-performance.test.ts`

Expected: all checks PASS and visual parameters remain unchanged.

- [ ] **Step 6: Commit the loading fix**

```bash
git add src/components/BackgroundMusic.tsx src/home-simplicity.test.mjs src/lib/paint-performance.test.ts src/lib/paint-performance.ts
git commit -m "perf: defer background music loading"
```

### Task 5: Run the Full Release Verification Matrix

**Files:**
- Modify only if a test exposes a release-blocking defect.
- Inspect: all public routes and `.output/public/**`.

**Interfaces:**
- Consumes: the complete local production source.
- Produces: fresh evidence that the exact release candidate meets the specification.

- [ ] **Step 1: Run the complete automated suite**

Run: `node --test src/lib/content-parser.test.ts src/lib/paint-performance.test.ts src/lib/story-helix.test.ts src/release-readiness.test.mjs src/home-simplicity.test.mjs`

Run: `pnpm exec tsc --noEmit`

Run: `pnpm run lint`

Run: `pnpm exec prettier --check src package.json vite.config.ts tsconfig.json eslint.config.js .openai 2>/dev/null`

Run: `pnpm run build`

Expected: zero test failures, zero type errors, zero lint errors, formatted production files, and successful production output.

- [ ] **Step 2: Inspect the production boundary**

Run: `find .output/public/content -type f | sort`

Expected: only `.output/public/content/create/trajectory_report.html`.

- [ ] **Step 3: Verify every route over HTTP**

Check `/`, `/stories`, `/trajectory`, `/repeated-words`, `/family-traces`, `/letter`, and `/time-capsule`. Require HTTP 200, route-specific title and description metadata, and a working 404 response for a missing path.

- [ ] **Step 4: Verify the browser interaction matrix**

At desktop and mobile widths, verify homepage chapter navigation, every child-page entrance, all nine teacher anchors, initial child-page position, return to `#opening`, music playback/mute/70% volume/route continuity, the opening video, trajectory iframe, and reduced-motion rendering. Record exact failures before changing code.

- [ ] **Step 5: Fix only reproduced blockers with TDD and repeat the matrix**

For each defect: document reproduction, identify root cause, write one failing behavior test, implement the smallest fix, rerun the focused test, then rerun the complete matrix.

- [ ] **Step 6: Commit the verified release candidate**

```bash
git add -A
git commit -m "chore: prepare Cambly Chronicles release"
```

### Task 6: Prepare and Publish the Sites Version

**Files:**
- Create or modify: `.openai/hosting.json`
- Package: the exact validated source through the Sites packaging helper.

**Interfaces:**
- Consumes: the verified branch-head commit and production build.
- Produces: a Sites project version and deployment URL.

- [ ] **Step 1: Create or reuse the Sites project**

Use the Sites connector once. Store only the returned `project_id` in `.openai/hosting.json`; do not add credentials, secrets, or runtime values to the file.

- [ ] **Step 2: Save the exact validated source version**

Obtain a short-lived source write credential, push the validated branch-head commit without rewriting history, package with `scripts/package-site.sh`, and save one Sites version using the same commit SHA.

- [ ] **Step 3: Deploy with the safest available access level**

Prefer a private deployment. If only shared or public access is available, pause for explicit user approval naming that access level before publishing.

- [ ] **Step 4: Poll deployment status and hand off the deployed site**

Wait until Sites reports success or failure. On success, reuse the existing Site browser tab for the exact deployed URL. On failure, preserve the validated source and report the single actionable blocker.

## Plan Self-Review

- Every release requirement in the approved spec maps to a task above.
- Private material is moved, never discarded.
- The only public authoring artifact is the iframe actually consumed by a route.
- Tests assert public behavior and deployment boundaries rather than internal constants.
- Runtime changes preserve the existing visual design, routing, anchors, and music behavior.
- No task depends on an interface that another task leaves undefined.
