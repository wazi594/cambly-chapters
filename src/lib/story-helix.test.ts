import assert from "node:assert/strict";
import test from "node:test";

import { getStoryHelixPose } from "./story-helix.ts";

test("places the middle story at the readable front of a nine-card helix", () => {
  assert.deepEqual(getStoryHelixPose(4, 9), {
    angle: 0,
    depth: 0,
    offset: 0,
    opacity: 1,
    x: 0,
    y: 0,
    zIndex: 9,
  });
});

test("sends outer stories around and behind the centre card", () => {
  assert.deepEqual(getStoryHelixPose(0, 9), {
    angle: -88,
    depth: -148,
    offset: -4,
    opacity: 0.32,
    x: -184,
    y: -256,
    zIndex: 5,
  });
  assert.deepEqual(getStoryHelixPose(8, 9), {
    angle: 88,
    depth: -148,
    offset: 4,
    opacity: 0.32,
    x: 184,
    y: 256,
    zIndex: 5,
  });
});

test("keeps adjacent story names far enough apart to remain independently clickable", () => {
  const poses = Array.from({ length: 9 }, (_, index) => getStoryHelixPose(index, 9));

  for (let index = 1; index < poses.length; index += 1) {
    const current = poses[index];
    const previous = poses[index - 1];
    assert.ok(current && previous);
    assert.ok(current.y - previous.y >= 64);
  }
});
