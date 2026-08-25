# Cambly Chronicles Production Release Readiness Design

## Goal

Prepare the existing Cambly Chronicles site for a Sites deployment by fixing only release-blocking issues while preserving the current visual design and interaction model.

## Scope

This release pass covers six areas:

1. Prevent private source material from being published as static assets.
2. Establish one authoritative content source and remove deployed duplicates.
3. Make visible facts, dates, punctuation, and repeated text internally consistent.
4. Remove unused application code and dependencies that add maintenance or release risk.
5. Improve loading behavior without changing the current visual effects or interactions.
6. Verify every public route and prepare the exact validated source for Sites.

It does not introduce a new visual direction, new pages, new interactions, or a content-system rewrite.

## Public and Private Content Boundaries

`src/content/source/` is the single authoritative source for the five long-form reading pages. These files remain bundled through the existing parsers because their contents are intentionally displayed by the site.

`public/content/create/trajectory_report.html` remains public because the trajectory page loads it in an iframe. The other duplicate authoring files under `public/content/create/` are removed from the deployed public surface.

Raw transcripts, teacher profiles, intermediate JSON, analysis notes, and generation scripts under `public/content/reference/` move to a non-public project directory. They remain available in the workspace but must not appear in the production output.

The production build must contain only the trajectory HTML and assets intentionally requested by a browser route.

## Content Consistency

The site uses these release facts consistently:

- Period: 2024-12-07 through 2025-06-10.
- Public summary: 86 conversations and 26 teachers, matching the homepage wording the user approved.
- Source records may contain an additional zero-duration or bookkeeping entry; it must not silently change the public summary.

Visible Chinese prose receives a conservative cleanup for duplicate attributions, repeated fragments, mixed Chinese/English punctuation, accidental doubled punctuation, and stale metadata. Authored meaning, quoted English, names, and story structure remain unchanged.

Only `src/content/source/` is edited for long-form content. Public duplicates are not maintained.

## Code and Dependency Cleanup

Unused starter UI components, hooks, configuration, and packages are removed only when no production import, generated route, or build tool depends on them. The existing TanStack Start, GSAP, Lenis, Three.js, audio, video, and content-parser architecture remains intact.

The cleanup must preserve:

- five homepage chapters;
- the floating teacher-name entrance and teacher anchors;
- the trajectory iframe;
- the two voice archive entrances;
- the letter and time-capsule light portals;
- persistent background music behavior;
- instant cross-route positioning and smooth homepage chapter scrolling;
- reduced-motion behavior.

## Loading and Runtime Behavior

Performance work is limited to release-safe changes:

- avoid preloading the full background-music file before the visitor requests playback;
- retain lazy loading for the WebGL background and non-critical media;
- preserve the current background appearance and mouse response while preventing unnecessary animation work during scrolling, hidden-tab state, and reduced-motion mode;
- remove assets and dependencies that are proven unused;
- keep the opening video muted, looping, inline, and visually unchanged.

No lossy media recompression or visual-quality change is made without separate approval.

## Verification

Automated release checks must include:

- TypeScript type checking;
- ESLint with zero errors;
- formatting of production source and configuration;
- all existing behavior tests;
- a production build;
- a check that private reference files are absent from production output;
- a check that every public route responds successfully and exposes route-specific title and description metadata.

Browser verification covers desktop and mobile widths for:

- homepage chapter navigation;
- all homepage-to-child-page entrances;
- all nine teacher anchors;
- child-page initial scroll position;
- return-to-opening behavior;
- background-music start, mute, route persistence, and 70% volume;
- opening video;
- trajectory iframe;
- reduced-motion fallback;
- missing-route behavior.

## Sites Release Preparation

After all checks pass, the exact validated source is committed without rewriting Lovable history. Sites configuration is created or updated only with the project identifier required by Sites. A private deployment is preferred for the first release unless the user explicitly authorizes a public deployment.

The release is blocked if private source files remain publicly accessible, the production build fails, public routes fail, or deployment would use a source state different from the validated state.

## Success Criteria

- Current visuals and interactions are recognizably unchanged.
- No raw transcript or private reference file is present in the deployable public output.
- The five long-form pages use one source location.
- Visible counts, dates, punctuation, and attributions are consistent.
- Unused starter code and dependencies are removed without breaking the build.
- All automated and browser checks pass.
- The validated source is ready for a Sites version and deployment.
