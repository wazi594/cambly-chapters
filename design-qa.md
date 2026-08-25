# Design QA — Simplified Chapter 04

## Evidence

- Source visual truth: `/Users/lou/.codex/generated_images/01a03394-393f-7462-b2dd-a14409735a7f/exec-ba61b084-1c58-4483-baab-4e2c4a000e27.png`
- Browser-rendered implementation: `/Users/lou/Documents/Codex/2026-08-24/sites-plugin-sites-openai-bundled-create/work/cambly-chronicles/qa-clean-home.png`
- Full-view comparison: `/Users/lou/Documents/Codex/2026-08-24/sites-plugin-sites-openai-bundled-create/work/cambly-chronicles/qa-clean-comparison.png`
- Focused portal comparison: `/Users/lou/Documents/Codex/2026-08-24/sites-plugin-sites-openai-bundled-create/work/cambly-chronicles/qa-clean-comparison-focus.png`
- State: home route, Chapter 04 aligned in the viewport, default interaction state.
- CSS viewport: 1440 × 1024 at density 1. Captured browser content: 1425 × 967 pixels.
- Source pixels: 1487 × 1058. Source and implementation were aspect-fit into equal 760 × 570 evidence panels; the portal crop measured 649 × 760 pixels.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Typography: only the chapter number, headline, body copy, core statistic, and two portal titles remain. The removed archive labels no longer compete with the hierarchy.
- Spacing and layout: removing captions, metadata, and the footer directory leaves each chapter with a simpler rhythm. Chapter 04 now ends the page without a second navigation block.
- Colors and tokens: the existing pale archive background and amber/blue portal palette remain unchanged.
- Image quality: the original raster portal asset is preserved. `object-cover` fills the media frame and removes the letterboxed top/bottom bands while keeping both doors and floor reflections visible.
- Copy and content: decorative `ARCHIVE`, `STATUS`, `FIG`, `GRAIN`, `ENTRY`, `ENTER`, chapter-label, and footer-directory copy is absent. The two destination names remain.
- Accessibility and behavior: the visually removed chapter labels remain available as navigation `aria-label` values. Both portal titles remain semantic links with focus outlines.
- Console: zero error-level entries during browser verification.

## Comparison History

1. Earlier implementation used `object-contain`, leaving visible letterboxed space around the portal artwork and retained multiple layers of decorative microcopy.
2. Fix: removed the decorative text groups and footer directory, retained only core content, and changed the portal image to `object-cover`.
3. Post-fix evidence: `qa-clean-comparison-focus.png` shows the portal artwork filling the component while both door silhouettes remain intact.

## Primary Interactions Tested

- Verified the home page keeps its primary title and both portal destination titles.
- Verified the archive/status/entry/grain/enter microcopy is absent from the rendered DOM.
- Verified the bottom directory link to `/journey` is absent.
- Verified Chapter 04 navigation and both semantic portal links remain present.

final result: passed
