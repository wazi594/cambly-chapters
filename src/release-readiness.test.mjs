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
});
