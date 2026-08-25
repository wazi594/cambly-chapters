import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { rm, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("the deployable public content contains only the trajectory iframe", async () => {
  const root = new URL("../public/content/", import.meta.url);
  const rootPath = decodeURIComponent(root.pathname);
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => `${entry.parentPath.replace(rootPath, "")}/${entry.name}`)
    .map((path) => path.replace(/^\/+/, ""))
    .sort();

  assert.deepEqual(files, ["create/trajectory_report.html"]);
});

test("the production build emits Netlify's TanStack Start deployment contract", async () => {
  const projectRoot = new URL("../", import.meta.url);
  const dist = new URL("../dist/", import.meta.url);
  const netlify = new URL("../.netlify/", import.meta.url);
  const netlifyFunction = new URL("../.netlify/v1/functions/server.mjs", import.meta.url);
  const bundledFunction = new URL("../.netlify/server-bundle-test.mjs", import.meta.url);

  await Promise.all([
    rm(dist, { recursive: true, force: true }),
    rm(netlify, { recursive: true, force: true }),
  ]);

  const build = spawnSync(process.execPath, ["node_modules/vite/bin/vite.js", "build"], {
    cwd: decodeURIComponent(projectRoot.pathname),
    encoding: "utf8",
    env: { ...process.env, NETLIFY: "true" },
  });

  assert.equal(build.status, 0, `${build.stdout}\n${build.stderr}`);
  assert.ok(existsSync(new URL("client/", dist)), "missing Netlify publish directory: dist/client");
  assert.ok(existsSync(netlify), "missing Netlify runtime bundle: .netlify");

  // Netlify flattens the generated handler before running it in Lambda. Reproduce
  // that boundary and disable Node's syntax detection to match the CommonJS
  // interpretation that exposed the GSAP ScrollTrigger production crash.
  const bundle = spawnSync(
    process.execPath,
    [
      "node_modules/esbuild/bin/esbuild",
      decodeURIComponent(netlifyFunction.pathname),
      "--bundle",
      "--format=esm",
      "--platform=node",
      "--packages=external",
      `--outfile=${decodeURIComponent(bundledFunction.pathname)}`,
    ],
    { cwd: decodeURIComponent(projectRoot.pathname), encoding: "utf8" },
  );

  assert.equal(bundle.status, 0, `${bundle.stdout}\n${bundle.stderr}`);

  const coldStart = spawnSync(
    process.execPath,
    ["--no-experimental-detect-module", decodeURIComponent(bundledFunction.pathname)],
    { cwd: decodeURIComponent(projectRoot.pathname), encoding: "utf8" },
  );

  assert.equal(
    coldStart.status,
    0,
    `Netlify function failed during cold start:\n${coldStart.stdout}\n${coldStart.stderr}`,
  );
});
